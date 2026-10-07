import os
import uuid

import pytest
import requests
from dotenv import load_dotenv

load_dotenv("/app/frontend/.env")
API = os.environ["REACT_APP_BACKEND_URL"] + "/api"


def test_create_booking_lead_sends_email():
    r = requests.post(
        f"{API}/leads",
        json={
            "name": "Pytest Visitor",
            "email": "delivered@resend.dev",
            "company": "Acme Trading LLC",
            "interest": "Financial Health Check",
            "message": "Automated test submission",
            "source": "booking",
        },
        timeout=40,
    )
    assert r.status_code == 201, r.text
    body = r.json()
    assert body["id"] and body["email_sent"] is True
    assert body["source"] == "booking"


def test_create_chat_lead_with_transcript():
    sid = f"pytest-lead-{uuid.uuid4()}"
    with requests.post(
        f"{API}/chat/stream",
        json={"session_id": sid, "message": "How much do you charge and how can I book a call?"},
        stream=True,
        timeout=90,
    ) as r:
        body = b"".join(r.iter_content(chunk_size=None)).decode()
    assert "[[LEAD_FORM]]" not in body  # marker must never leak to the client
    assert '"done": true' in body

    r = requests.post(
        f"{API}/leads",
        json={"name": "Chat Lead", "email": "delivered@resend.dev", "source": "chat", "session_id": sid},
        timeout=40,
    )
    assert r.status_code == 201, r.text
    assert r.json()["email_sent"] is True
    requests.delete(f"{API}/chat/history/{sid}", timeout=10)


@pytest.mark.parametrize(
    "payload",
    [
        {"name": "A", "email": "delivered@resend.dev"},  # name too short
        {"name": "Valid Name", "email": "not-an-email"},
        {"name": "Valid Name", "email": "delivered@resend.dev", "source": "other"},
        {"email": "delivered@resend.dev"},
    ],
)
def test_lead_validation(payload):
    r = requests.post(f"{API}/leads", json=payload, timeout=10)
    assert r.status_code == 422
