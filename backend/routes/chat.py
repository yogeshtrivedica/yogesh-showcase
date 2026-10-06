import json
import logging
import os
import uuid
from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from emergentintegrations.llm.chat import LlmChat, UserMessage, TextDelta, StreamDone

from database import db
from profile_knowledge import SYSTEM_PROMPT

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/chat", tags=["chat"])

MAX_HISTORY = 30


class ChatMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    role: str
    content: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class ChatRequest(BaseModel):
    session_id: str = Field(min_length=1, max_length=128)
    message: str = Field(min_length=1, max_length=2000)


async def _history(session_id: str) -> List[dict]:
    docs = await db.chat_messages.find({"session_id": session_id}, {"_id": 0}).sort("created_at", 1).to_list(500)
    return docs


@router.get("/history/{session_id}", response_model=List[ChatMessage])
async def get_history(session_id: str):
    return await _history(session_id)


@router.delete("/history/{session_id}")
async def clear_history(session_id: str):
    result = await db.chat_messages.delete_many({"session_id": session_id})
    return {"deleted": result.deleted_count}


@router.post("/stream")
async def stream_chat(req: ChatRequest):
    api_key = os.environ.get("EMERGENT_LLM_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="EMERGENT_LLM_KEY is not configured")

    prior = await _history(req.session_id)
    initial = [{"role": "system", "content": SYSTEM_PROMPT}] + [
        {"role": m["role"], "content": m["content"]} for m in prior[-MAX_HISTORY:]
    ]

    user_msg = ChatMessage(session_id=req.session_id, role="user", content=req.message)
    await db.chat_messages.insert_one(user_msg.model_dump())

    chat = LlmChat(
        api_key=api_key,
        session_id=req.session_id,
        system_message=SYSTEM_PROMPT,
        initial_messages=initial,
    ).with_model("anthropic", "claude-sonnet-5-5").with_params(max_tokens=1200)

    async def event_generator():
        full = []
        try:
            async for ev in chat.stream_message(UserMessage(text=req.message)):
                if isinstance(ev, TextDelta):
                    full.append(ev.content)
                    yield f"data: {json.dumps({'delta': ev.content})}\n\n"
                elif isinstance(ev, StreamDone):
                    break
        except Exception as exc:  # surface provider errors to the client
            logger.exception("Claude stream failed")
            yield f"data: {json.dumps({'error': str(exc)})}\n\n"
            return

        text = "".join(full)
        if text:
            assistant_msg = ChatMessage(session_id=req.session_id, role="assistant", content=text)
            await db.chat_messages.insert_one(assistant_msg.model_dump())
        yield f"data: {json.dumps({'done': True})}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
