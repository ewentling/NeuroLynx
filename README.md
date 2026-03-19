# NeuroLynx

<div align="center">
<img width="1200" height="475" alt="NeuroLynx Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

## Overview

NeuroLynx is an advanced AI-powered Business Orchestration Agent designed to help professionals manage clients, projects, and data using cutting-edge artificial intelligence. It serves as a super-powered executive assistant that can read emails and documents, listen to meetings and take notes, remember everything about your clients, and communicate in real-time.

## Key Features

- **AI Chat Assistant** - Natural language interface with multi-LLM support (Google Gemini, OpenAI, Anthropic, etc.)
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

# Configure environment
cp .env.example .env.local
# Edit .env.local with your API keys

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`.

## Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Framer Motion
- **AI/ML**: Google Gemini, OpenAI (Whisper), LangChain
- **Charts**: Recharts
- **PDF**: jsPDF, PDF.js
- **Maps**: Leaflet, React-Leaflet
- **Database**: SQLite (better-sqlite3) for agent memory

## License

This project is proprietary software. See [LICENSE](LICENSE) for details.
