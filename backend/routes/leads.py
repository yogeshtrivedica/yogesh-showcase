import logging
import os
import time
import uuid
from collections import defaultdict
from datetime import datetime, timezone
from html import escape
from typing import Literal, Optional

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, EmailStr, Field

from database import db
from email_service import EMAIL_FROM_NAME, send_email

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/leads", tags=["leads"])

OWNER_EMAIL = os.environ["OWNER_EMAIL"]

# simple per-IP rate limit: 5 submissions / 10 minutes
_hits: dict[str, list[float]] = defaultdict(list)
RATE_LIMIT, RATE_WINDOW = 5, 600


def _rate_limited(ip: str) -> bool:
    now = time.time()
    _hits[ip] = [t for t in _hits[ip] if now - t < RATE_WINDOW]
    if len(_hits[ip]) >= RATE_LIMIT:
        return True
    _hits[ip].append(now)
    return False


class LeadCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    phone: Optional[str] = Field(default=None, max_length=40)
    company: Optional[str] = Field(default=None, max_length=160)
    interest: Optional[str] = Field(default=None, max_length=80)
    message: Optional[str] = Field(default=None, max_length=2000)
    source: Literal["booking", "chat"] = "booking"
    session_id: Optional[str] = Field(default=None, max_length=128)


class Lead(LeadCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    email_sent: bool = False


def _row(label: str, value: Optional[str]) -> str:
    if not value:
        return ""
    return (
        f'<tr><td style="padding:8px 12px;color:#5F5E5A;font-size:13px;width:140px;vertical-align:top">{escape(label)}</td>'
        f'<td style="padding:8px 12px;color:#1a1a1a;font-size:14px;white-space:pre-wrap">{escape(value)}</td></tr>'
    )


async def _chat_transcript(session_id: Optional[str]) -> str:
    if not session_id:
        return ""
    msgs = await db.chat_messages.find({"session_id": session_id}, {"_id": 0}).sort("created_at", 1).to_list(40)
    if not msgs:
        return ""
    lines = "".join(
        f'<p style="margin:0 0 8px;font-size:13px;color:#1a1a1a"><strong style="color:#042C53">'
        f'{"Visitor" if m["role"] == "user" else "Assistant"}:</strong> {escape(m["content"])}</p>'
        for m in msgs[-12:]
    )
    return (
        '<tr><td colspan="2" style="padding:16px 12px 4px;color:#0F6E56;font-size:12px;letter-spacing:.08em;text-transform:uppercase">'
        'Recent chat transcript</td></tr>'
        f'<tr><td colspan="2" style="padding:8px 12px">{lines}</td></tr>'
    )


def _email_html(lead: Lead, transcript: str) -> str:
    source = "AI assistant chat" if lead.source == "chat" else "website booking form"
    return (
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" '
        'style="font-family:Arial,sans-serif;background:#F8F7F4;padding:24px">'
        '<tr><td align="center">'
        '<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #D3D1C7;border-radius:12px;overflow:hidden">'
        f'<tr><td style="background:#042C53;padding:20px 24px;color:#E1F5EE;font-size:18px;font-weight:bold">New conversation request</td></tr>'
        f'<tr><td style="padding:16px 24px 4px;color:#444441;font-size:14px">A visitor asked for the free 20-minute conversation via the {escape(source)}.</td></tr>'
        '<tr><td style="padding:8px 12px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">'
        + _row("Name", lead.name)
        + _row("Email", lead.email)
        + _row("Phone", lead.phone)
        + _row("Company", lead.company)
        + _row("Interested in", lead.interest)
        + _row("Message", lead.message)
        + _row("Received", lead.created_at[:16].replace("T", " ") + " UTC")
        + transcript
        + '</table></td></tr>'
        f'<tr><td style="padding:16px 24px 20px;color:#888;font-size:12px">Sent by {escape(EMAIL_FROM_NAME)} website. Reply to this email to answer the visitor directly.</td></tr>'
        '</table></td></tr></table>'
    )


@router.post("", response_model=Lead, status_code=201)
async def create_lead(payload: LeadCreate, request: Request):
    ip = request.headers.get("x-forwarded-for", request.client.host if request.client else "unknown").split(",")[0].strip()
    if _rate_limited(ip):
        raise HTTPException(status_code=429, detail="Too many requests. Please try again later.")

    lead = Lead(**payload.model_dump())
    transcript = await _chat_transcript(lead.session_id) if lead.source == "chat" else ""
    subject = f"New conversation request — {lead.name}" + (f" ({lead.interest})" if lead.interest else "")

    try:
        await send_email(to=OWNER_EMAIL, subject=subject, html=_email_html(lead, transcript), reply_to=lead.email)
        lead.email_sent = True
    except HTTPException:
        logger.warning("Lead %s stored but notification email failed", lead.id)

    await db.leads.insert_one(lead.model_dump())
    return lead
