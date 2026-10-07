import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const STORAGE_KEY = "yt_chat_session";

const getSessionId = () => {
  let id = localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
};

export const useChat = () => {
  const [sessionId, setSessionId] = useState(getSessionId);
  const [messages, setMessages] = useState([]);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  useEffect(() => {
    axios
      .get(`${API}/chat/history/${sessionId}`)
      .then((r) => setMessages(r.data.map((m) => ({ role: m.role, content: m.content, id: m.id }))))
      .catch(() => {});
  }, [sessionId]);

  const send = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed || streaming) return;
      setError(null);
      setStreaming(true);
      setMessages((prev) => [
        ...prev,
        { role: "user", content: trimmed, id: crypto.randomUUID() },
        { role: "assistant", content: "", id: crypto.randomUUID(), pending: true },
      ]);

      const controller = new AbortController();
      abortRef.current = controller;

      const append = (delta) =>
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          next[next.length - 1] = { ...last, content: last.content + delta, pending: false };
          return next;
        });

      try {
        const res = await fetch(`${API}/chat/stream`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId, message: trimmed }),
          signal: controller.signal,
        });
        if (!res.ok || !res.body) throw new Error(`Request failed (${res.status})`);

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split("\n\n");
          buffer = parts.pop();
          for (const part of parts) {
            const line = part.trim();
            if (!line.startsWith("data:")) continue;
            const payload = JSON.parse(line.slice(5));
            if (payload.delta) append(payload.delta);
            if (payload.error) throw new Error(payload.error);
            if (payload.done && payload.lead_form) {
              setMessages((prev) => [...prev, { role: "lead_form", content: "", id: crypto.randomUUID() }]);
            }
          }
        }
      } catch (e) {
        if (e.name !== "AbortError") {
          setError("Something went wrong. Please try again.");
          setMessages((prev) => prev.filter((m) => !(m.pending && m.content === "")));
        }
      } finally {
        setStreaming(false);
        abortRef.current = null;
      }
    },
    [sessionId, streaming]
  );

  const reset = useCallback(async () => {
    abortRef.current?.abort();
    await axios.delete(`${API}/chat/history/${sessionId}`).catch(() => {});
    const id = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, id);
    setSessionId(id);
    setMessages([]);
    setError(null);
  }, [sessionId]);

  return { messages, send, reset, streaming, error, sessionId };
};
