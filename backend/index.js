// backend/index.js
import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/stream", async (req, res) => {
  const { prompt } = req.body;

  const ollamaRes = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "mistral",
      prompt,
      stream: true,
    }),
  });

  // Set headers for SSE
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Stream chunks from Ollama response to client
  ollamaRes.body.on("data", (chunk) => {
    res.write(chunk); // stream raw data
  });

  ollamaRes.body.on("end", () => {
    res.end();
  });

  ollamaRes.body.on("error", (err) => {
    console.error("Stream error:", err);
    res.end();
  });
});

app.listen(3001, () =>
  console.log("Backend listening on http://localhost:3001")
);
