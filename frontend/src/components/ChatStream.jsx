import React, { useState, useRef, useEffect } from "react";

export default function ChatStream() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]); // array of { role, text }
  const [loading, setLoading] = useState(false);
  const controllerRef = useRef(null);
  const bottomRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user's message
    setMessages((prev) => [...prev, { role: "user", text: input }]);
    setLoading(true);

    const newMessage = { role: "assistant", text: "" };
    setMessages((prev) => [...prev, newMessage]);
    controllerRef.current = new AbortController();

    try {
      const res = await fetch("http://localhost:3001/api/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
        signal: controllerRef.current.signal,
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let partial = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter(Boolean);

        for (const line of lines) {
          const jsonStr = line.trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const data = JSON.parse(jsonStr);
            if (data.response) {
              partial += data.response;
              setMessages((prev) =>
                prev.map((msg, i) =>
                  i === prev.length - 1 ? { ...msg, text: partial } : msg
                )
              );
            }
          } catch (err) {
            console.warn("JSON parse error", err);
          }
        }
      }
    } catch (err) {
      if (err.name !== "AbortError") console.error("Stream error:", err);
    } finally {
      setInput("");
      setLoading(false);
    }
  };

  const handleAbort = () => {
    controllerRef.current?.abort();
    setLoading(false);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col items-center w-full h-screen bg-gray-50">
      <div className="w-full px-4 py-3 text-lg font-medium bg-gray-100 shadow">
        🧠 AI Assistant (Mistral via Ollama)
      </div>
  <div className="flex flex-col w-full h-full max-w-2xl bg-gray-50 ">

      {/* Chat area */}
      <div className="flex-1 px-4 py-6 space-y-4 overflow-y-auto bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-2xl px-4 py-2 rounded-lg shadow-sm whitespace-pre-wrap ${
              msg.role === "user"
                ? "bg-blue-100 self-end text-right"
                : "bg-gray-100 self-start text-left"
            }`}
          >
            {msg.text || 'Thinking...'}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div>

      <form
        onSubmit={handleSubmit}
        className="flex gap-2 p-4 bg-gray-50 "
      >
        <textarea
          type="text"
          value={input}
          disabled={loading}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none"
          placeholder="Ask anything"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-white bg-blue-600 rounded-lg disabled:opacity-50"
        >
          Send
        </button>
        {loading && (
          <button
            type="button"
            onClick={handleAbort}
            className="text-sm text-red-500"
          >
            Stop
          </button>
        )}
      </form>
      </div>
    </div>
    </div>
  );
}
