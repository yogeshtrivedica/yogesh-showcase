import os
import uuid

import pytest
import requests
from dotenv import load_dotenv

load_dotenv("/app/frontend/.env")
API = os.environ["REACT_APP_BACKEND_URL"] + "/api"


def test_root():
    r = requests.get(f"{API}/", timeout=10)
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_chat_stream_and_persistence():
    sid = f"pytest-{uuid.uuid4()}"
    with requests.post(
        f"{API}/chat/stream",
        json={"session_id": sid, "message": "Reply with the single word: Dubai"},
        stream=True,
        timeout=90,
    ) as r:
        assert r.status_code == 200
        assert r.headers["content-type"].startswith("text/event-stream")
        body = b"".join(r.iter_content(chunk_size=None)).decode()
    assert '"delta"' in body and '"done": true' in body

    hist = requests.get(f"{API}/chat/history/{sid}", timeout=10).json()
    assert [m["role"] for m in hist] == ["user", "assistant"]
    assert hist[1]["content"]

    deleted = requests.delete(f"{API}/chat/history/{sid}", timeout=10).json()
    assert deleted["deleted"] == 2
    assert requests.get(f"{API}/chat/history/{sid}", timeout=10).json() == []


@pytest.mark.parametrize("payload", [{"session_id": "x"}, {"session_id": "", "message": "hi"}, {"session_id": "x", "message": ""}])
def test_chat_validation(payload):
    r = requests.post(f"{API}/chat/stream", json=payload, timeout=10)
    assert r.status_code == 422
