# 🧠 LLM UI — Local Chat Interface with Ollama + Mistral

A full-stack conversational AI interface using:

- ⚛️ **React + Tailwind CSS** frontend
- 🟩 **Node.js + Express** backend (streaming proxy)
- 🤖 **Ollama** running Mistral locally as the LLM model

---

## 📦 Features

- Real-time token-by-token streaming (like ChatGPT)
- Clean chat UI with message bubbles
- Abort/resume generation support
- Local-first privacy with Ollama

---

## 🧰 Stack

| Layer      | Tech                  |
| ---------- | --------------------- |
| Frontend   | React, Vite, Tailwind |
| Backend    | Node.js, Express      |
| LLM Engine | Ollama + Mistral      |

---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone git@github.com:sijoyjos/llm-ui.git
cd llm-ui
```

---

### 2. Setup Backend

```bash
cd backend
npm install
node index.js
```

> Ensure Ollama is running and mistral model is pulled:
>
> ```bash
> ollama run mistral
> ```

This will serve the local LLM on:  
`http://localhost:11434`

---

### 3. Setup Frontend

```bash
cd ../frontend
npm install
npm run dev
```

Then open: [http://localhost:5173](http://localhost:5173)

---

## ✨ Sample Prompt

```
Explain how Server-Sent Events work in Node.js and when you’d use them.
```

---

## 📁 Folder Structure

```
llm-ui/
├── backend/       # Node.js API proxy to Ollama
│   └── index.js
├── frontend/      # React + Tailwind chat UI
│   ├── src/
│   │   └── components/
│   │       └── ChatStream.jsx
│   ├── index.html
│   └── vite.config.js
├── .gitignore
└── README.md
```

---

## 🔒 Privacy First

This project uses **Ollama locally**, so:

- No prompts or responses leave your machine
- Ideal for secure, private LLM experimentation
- Great for air-gapped or dev environments

---

## 💡 Future Enhancements

- [ ] Markdown/code block rendering
- [ ] Chat history with localStorage
- [ ] File upload & prompt chaining
- [ ] Plugin-style assistant tools

---

## 📜 License

MIT — feel free to use, remix, and build on top of it!

---
