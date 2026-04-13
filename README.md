# Rate My Professor Assistant 🎓

An AI-powered chat assistant that helps students find and evaluate professors
using natural language queries. Built with Next.js, powered by Meta's Llama 3.1
via OpenRouter, and backed by Pinecone for vector storage.



---

## What it does

Students can ask natural language questions like:
- "Who is the best Computer Science professor for Data Structures?"
- "Find me a professor who explains concepts clearly and grades fairly"
- "Which professors have high ratings in the Math department?"

The assistant queries an LLM for professor information, stores the AI responses
and professor data as vectors in Pinecone, and returns conversational answers
inside a clean real-time chat interface.

---

## Tech stack

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Llama 3.1](https://img.shields.io/badge/Llama_3.1-0467DF?style=flat-square&logo=meta&logoColor=white)
![OpenRouter](https://img.shields.io/badge/OpenRouter-000000?style=flat-square)
![Pinecone](https://img.shields.io/badge/Pinecone-000000?style=flat-square)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)

---

## How it works
User query
↓
/api/query.js
↓
OpenRouter (Llama 3.1-8b) → AI response
↓
/api/pinecone.js
↓
Vectorize response → Upsert into Pinecone index
↓
Return formatted answer to chat UI

1. User types a question into the chat interface
2. `/api/query.js` sends the query to Llama 3.1 via OpenRouter
3. The AI response is formatted and returned to the UI
4. `/api/pinecone.js` vectorizes professor data and AI responses
   and upserts them into Pinecone for future retrieval
5. Professor links can also be submitted to extract and store
   structured professor data (name, rating, department)

---

## Project structure

rate-my-professor/
├── pages/
│   ├── index.js              # Chat UI — message input, history, send/clear
│   ├── _app.js               # Global app wrapper
│   └── api/
│       ├── query.js          # LLM handler — OpenRouter + Llama 3.1
│       └── pinecone.js       # Vector storage — upsert professor & AI data
├── styles/
│   └── styles.css            # Global styles
├── .env.local                # API keys (not committed)
└── package.json

---

## Getting started

### Prerequisites
- Node.js 18+
- OpenRouter API key — [openrouter.ai](https://openrouter.ai)
- Pinecone API key + index — [pinecone.io](https://pinecone.io)

### Installation

```bash
git clone https://github.com/varnika-dev/rate-my-professor.git
cd rate-my-professor
npm install
```

### Environment variables

Create a `.env.local` file in the root:

```env
OPENROUTER_API_KEY=your_openrouter_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=your_pinecone_environment
PINECONE_INDEX_NAME=your_index_name
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## API reference

### `POST /api/query`
Sends a natural language query to Llama 3.1 and returns an AI-generated response.

| Body field | Type | Description |
|------------|------|-------------|
| `userQuery` | `string` | The professor-related question |
| `professorLink` | `string` | Optional — RateMyProfessor URL to process |

**Response:**
```json
{ "aiReply": "Professor John Doe has a rating of 4.5 in Computer Science..." }
```

### `POST /api/pinecone`
Vectorizes and stores professor data or AI responses into Pinecone.

| Body field | Type | Description |
|------------|------|-------------|
| `professorLink` | `string` | URL to extract and store professor data |
| `aiResponse` | `string` | AI response text to vectorize and store |

---

## Features

- 💬 Real-time chat UI with full conversation history
- 🤖 Llama 3.1 (8B) via OpenRouter for free, fast LLM responses
- 🗄️ Pinecone vector storage for professor data and AI responses
- 🔗 Professor link ingestion — extract name, rating, and department
- 🧹 Clear chat button to reset the session
- ⚡ Serverless API routes via Next.js

---

## Connect

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://linkedin.com/in/varnika-k-26650318b)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/varnika-dev)
