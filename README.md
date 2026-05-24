# 🛡️ Audit Management AI

Audit Management AI is a modern Next.js 16 microservice that powers the AI integrations of the Audit Management platform. It leverages advanced LLMs via Groq and Vercel AI SDK to generate structured corrective actions from failed audit questions and support real-time streaming conversations for quality audit participants.

## ✨ Key Features

- 🤖 **AI Corrective Action Generator**: Analyzes failed audit questions to produce structured, prioritized, and actionable corrective plans.
- 💬 **Streaming Conversations**: Provides real-time SSE chat streaming for audité users and quality advisors to resolve audit issues dynamically.
- 🖼️ **Multimodal Analysis**: Supports image uploads within the conversational stream, enabling the AI to inspect visual evidence or documents.
- 🔐 **Secure CORS Whitelisting**: Includes configurable CORS protection (`AI_CHAT_ALLOWED_ORIGINS`) to authorize frontend requests safely.
- 🎨 **Playground & Landing Page**: Features a stunning, interactive Web UI built with React 19, Tailwind CSS 4, and custom glassmorphism to test the API endpoints locally.
- 📐 **Structured Formatting**: Guarantees that generated actions include 7 required audit dimensions (root cause, detailed actions, alternatives, roles, evidence, risks, and KPIs).

## 🧰 Tech Stack

- Next.js 16.2.1 (App Router & Route Handlers)
- React 19.2.4
- Vercel AI SDK (core & `@ai-sdk/react`)
- Groq AI SDK (`@ai-sdk/groq` using Llama 3.3 70B & Llama 4 Scout 17B)
- Tailwind CSS 4 + PostCSS 8
- Zod 4 for API validation and schema enforcement
- TypeScript 5
- ESLint 9

## 🏗️ Architecture

The microservice follows Next.js App Router patterns and Vercel AI SDK conventions:

- `app/api/chat/` handles HTTP POST requests for batch corrective action generation.
- `app/api/audite-chat/` handles streaming chat interactions with role-based system prompts and file attachments.
- `app/chat/` provides the interactive React testing page where users can submit sample failed questions.
- `app/page.tsx` serves as the public entry point, detailing repo statistics and project links.
- `lib/cors.ts` wraps cross-origin requests to enforce security based on environment configs.

## 👥 AI Assistant Roles

The conversational streaming interface supports two specialized roles tailored to the platform:

- `AUDITE`: Tailored for process owners (e.g., department heads) focusing on executing corrective tasks, identifying evidence, and verifying local compliance.
- `CONSEILLER`: Tailored for quality advisors focusing on process oversight, compliance regulations, audit preparations, and risk analysis.

## 🌐 API Surface

### 📝 Corrective Action Generator

- **Endpoint**: `POST /api/chat`
- **Description**: Accepts a list of failed audit questions and returns a structured JSON payload containing corrective action guides.

**Request Payload**:
```json
{
  "failedQuestions": [
    "Le registre des incidents de securite est-il a jour ?",
    "Les extincteurs sont-ils controles selon le planning ?"
  ]
}
```

**Response Format**:
```json
{
  "totalQuestions": 2,
  "generatedAt": "2026-05-24T22:15:00.000Z",
  "actions": [
    {
      "title": "Le registre des incidents de securite est-il a jour ?",
      "description": "- Cause racine probable: ...\n- Actions correctives detaillees: ...\n- Alternatives possibles: ...\n- Responsables: ...\n- Preuves attendues: ...\n- Risques si non traite: ...\n- Indicateurs de verification: ...",
      "temps_estime": "COURT TERME (2 a 4 semaines)",
      "priority": "HIGH"
    }
  ]
}
```

### 🔄 Multimodal Conversational Chat

- **Endpoint**: `POST /api/audite-chat`
- **Description**: Streams a response turn-by-turn to build a persistent AI conversation about a selected audit criterion.

**Request Payload**:
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Comment puis-je prouver que les extincteurs ont été vérifiés ?"
    }
  ],
  "assistantRole": "CONSEILLER",
  "auditCriterion": "SECURITE",
  "schoolContext": "ENICarthage"
}
```

## ⚙️ Configuration

Create a `.env` file in the root directory.

```properties
GROQ_API_KEY=gsk_...
AI_CHAT_ALLOWED_ORIGINS=http://localhost:4200,http://127.0.0.1:4200
```

Notes:
- `GROQ_API_KEY` is required to communicate with Groq cloud models.
- `AI_CHAT_ALLOWED_ORIGINS` is a comma-separated list of browser domains allowed to invoke the endpoints.

## 🚀 Run Locally

### Prerequisites

- Node.js 20 or newer
- npm
- A Groq API Key

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

Open the application at:
```text
http://localhost:3000/
```

### Build for production

```bash
npm run build
npm start
```

## 🐳 Docker

The repository includes a multi-stage Dockerfile to build and package the microservice securely.

```bash
docker build -t audit-ai .
docker run --rm -p 3000:3000 --env-file .env audit-ai
```

The server exposes port 3000 by default.

## 📦 Project Structure

```text
app/
	api/
		audite-chat/
		chat/
	chat/
	globals.css
	layout.tsx
	page.tsx
lib/
	cors.ts
```

## 📌 Operational Notes

- The API routes are configured to allow cross-origin requests specifically matching the client-side domains defined in `AI_CHAT_ALLOWED_ORIGINS`.
- Multimodal requests require that the chat images are correctly processed as base64 or file parts within the payload structure.
- Corrective action generation enforces strict time scales tailored to school calendars: `IMMEDIAT`, `COURT TERME`, `MOYEN TERME`, `LONG TERME`, and `STRUCTUREL`.

## 🤝 Contributing

1. Create a feature branch.
2. Implement your changes following the existing App Router structure.
3. Validate typescript compiling and run the build command.
4. Open a pull request with a clear description of your edits.
