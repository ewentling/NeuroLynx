# NeuroLynx

<div align="center">
<img width="1200" height="475" alt="NeuroLynx Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

## Overview

NeuroLynx is an advanced AI-powered Business Orchestration Agent designed to help professionals manage clients, projects, and data using cutting-edge artificial intelligence. It serves as a super-powered executive assistant that can read emails and documents, listen to meetings and take notes, remember everything about your clients, and communicate in real-time.

## Key Features

- **AI Chat Assistant** - Natural language interface with multi-LLM support (Ollama local models, Google Gemini, OpenAI, Anthropic, etc.)
- **Local AI with Ollama** - Run AI models locally for maximum privacy - your data never leaves your machine
- **Client Relationship Management** - Companies, contacts, deals, and pipeline visualization
- **Meeting Intelligence** - Audio transcription, summaries, action items, and real-time battle cards
- **Document Management** - Contract builder, invoice generator, quotes, and e-signature tracking
- **Task Management** - Kanban boards, calendar integration, and automated task extraction
- **Analytics Dashboard** - KPIs, forecasting, profitability analysis, and sales leaderboards
- **Integrations** - Google Workspace (Gmail, Drive, Calendar), webhooks, and automation workflows
- **Security** - Role-based access control (RBAC), AES-GCM encryption, and audit logging

## Documentation

- **[Installation Guide](INSTALL.md)** - Complete setup instructions for local development and deployment
- **[User Guide](USER_GUIDE.md)** - Comprehensive documentation for using NeuroLynx features

## Quick Start

```bash
# Install dependencies
npm install

# (Optional) Set up Ollama for local AI - recommended for privacy
./scripts/setup-ollama.sh

# Configure environment
cp .env.example .env.local
# Edit .env.local with your API keys (optional if using Ollama)

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`.

## Local AI with Ollama (Recommended)

NeuroLynx defaults to using **Ollama** for local AI processing - your data stays on your machine.

### Setting up Ollama

1. **Install Ollama**: https://ollama.ai/download
2. **Start the service**: `ollama serve`
3. **Pull a model**: `ollama pull llama3.3`
4. **Configure in NeuroLynx**: Go to Settings > AI Configuration

### Recommended Models

| Model | Size | Best For |
|-------|------|----------|
| `llama3.3` | 4.7GB | All-around great performance |
| `mistral` | 4.1GB | Fast and efficient |
| `phi3` | 2.2GB | Lightweight, good for coding |
| `qwen2.5` | 4.4GB | Multilingual support |

```bash
# Pull your preferred model
ollama pull llama3.3
```

## Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Framer Motion
- **AI/ML**: Ollama (Local), Google Gemini, OpenAI (Whisper)
- **Charts**: Recharts
- **PDF**: jsPDF, PDF.js
- **Maps**: Leaflet, React-Leaflet
- **Database**: SQLite (better-sqlite3) for agent memory

## License

This project is proprietary software. See [LICENSE](LICENSE) for details.
