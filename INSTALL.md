# NeuroLynx Installation Guide

This guide provides complete instructions for installing and configuring NeuroLynx for local development and production deployment.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Local Development Setup](#local-development-setup)
- [Environment Configuration](#environment-configuration)
- [Docker Deployment](#docker-deployment)
- [Production Deployment](#production-deployment)
- [Google Workspace Integration](#google-workspace-integration)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before installing NeuroLynx, ensure you have the following installed:

### Required Software

| Software | Minimum Version | Purpose |
|----------|----------------|---------|
| Node.js | 18.x or higher | JavaScript runtime |
| npm | 9.x or higher | Package manager |
| Git | 2.x or higher | Version control |

### Optional Software

| Software | Version | Purpose |
|----------|---------|---------|
| Docker | 20.x or higher | Containerized deployment |
| Docker Compose | 2.x or higher | Multi-container orchestration |

### System Requirements

- **RAM**: Minimum 4GB, recommended 8GB+
- **Storage**: Minimum 2GB free disk space
- **OS**: macOS, Windows 10/11, or Linux (Ubuntu 20.04+)

---

## Local Development Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/ewentling/NeuroLynx.git
cd NeuroLynx
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React 19 and React DOM
- TypeScript and Vite
- Google GenAI SDK
- OpenAI SDK
- PDF processing libraries
- Charting and visualization libraries

### Step 3: Configure Environment Variables

Create your local environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your API keys (see [Environment Configuration](#environment-configuration) for details).

### Step 4: Start the Development Server

```bash
npm run dev
```

The application will start and be accessible at `http://localhost:3000`.

### Step 5: Verify Installation

1. Open your browser to `http://localhost:3000`
2. You should see the NeuroLynx login screen
3. Use the default credentials (see [User Guide](USER_GUIDE.md) for details)

---

## Environment Configuration

### Required Environment Variables

Create a `.env.local` file in the project root with the following variables:

```bash
# Primary LLM API Key (Required for AI features)
GEMINI_API_KEY="your-google-gemini-api-key"

# OpenAI API Key (Required for Whisper audio transcription)
OPENAI_API_KEY="your-openai-api-key"
```

### Obtaining API Keys

#### Google Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key to your `.env.local` file

#### OpenAI API Key

1. Visit [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the generated key to your `.env.local` file

### Optional Configuration

```bash
# MCP Server Configuration (Optional)
# Map local MCP servers for extended agent capabilities
# MCP_SERVER_FOO="path/to/server"

# Vector Database Configuration (Optional)
# For long-term memory storage with Pinecone
# PINECONE_API_KEY="your-pinecone-api-key"
# PINECONE_INDEX_HOST="your-index-host"
```

---

## Docker Deployment

### Using Docker Compose (Recommended)

1. **Set environment variables**

   Create a `.env` file in the project root:
   
   ```bash
   GEMINI_API_KEY=your-gemini-api-key
   ```

2. **Build and start containers**

   ```bash
   docker compose up -d
   ```

3. **Access the application**

   Open `http://localhost:3000` in your browser.

4. **View logs**

   ```bash
   docker compose logs -f
   ```

5. **Stop containers**

   ```bash
   docker compose down
   ```

### Using Docker Directly

1. **Build the image**

   ```bash
   docker build -t neurolynx .
   ```

2. **Run the container**

   ```bash
   docker run -d \
     -p 3000:3000 \
     -e GEMINI_API_KEY="your-api-key" \
     -v $(pwd)/agent_memory.db:/app/agent_memory.db \
     --name neurolynx \
     neurolynx
   ```

---

## Production Deployment

### Building for Production

1. **Create production build**

   ```bash
   npm run build
   ```

   This generates optimized static files in the `dist/` directory.

2. **Preview production build**

   ```bash
   npm run preview
   ```

### Deployment Options

#### Static Hosting (Vercel, Netlify, etc.)

The production build outputs static files that can be deployed to any static hosting service:

1. Build the application: `npm run build`
2. Deploy the `dist/` directory to your hosting service
3. Configure environment variables in your hosting dashboard

#### Server Deployment

For server-based deployments:

1. Set up a Node.js server (nginx, Apache, or Node.js-based)
2. Serve the built static files from the `dist/` directory
3. Configure your server to handle client-side routing (redirect all requests to `index.html`)

#### Docker Production Deployment

For containerized production deployments, modify the Dockerfile to use a production build:

```dockerfile
FROM node:20-slim as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## Google Workspace Integration

NeuroLynx supports integration with Google Workspace services (Gmail, Drive, Calendar, Docs, Sheets).

### Setting Up Google OAuth

1. **Create a Google Cloud Project**
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable Required APIs**
   - Gmail API
   - Google Drive API
   - Google Calendar API
   - Google Docs API
   - Google Sheets API

3. **Configure OAuth Consent Screen**
   - Set up the OAuth consent screen with your application details
   - Add required scopes for the APIs you enabled

4. **Create OAuth 2.0 Credentials**
   - Create OAuth 2.0 Client ID credentials
   - Set authorized JavaScript origins (e.g., `http://localhost:3000`)
   - Set authorized redirect URIs

5. **Configure in NeuroLynx**
   - Enter your Google Client ID in the Settings > Integrations section
   - Click "Connect" to authorize access

---

## Troubleshooting

### Common Issues

#### "Cannot find module" errors during npm install

```bash
# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

#### Build errors with better-sqlite3

This package requires native compilation. Ensure you have build tools installed:

**macOS:**
```bash
xcode-select --install
```

**Ubuntu/Debian:**
```bash
sudo apt-get install python3 make g++
```

**Windows:**
```bash
npm install --global windows-build-tools
```

#### Port 3000 already in use

```bash
# Find and kill the process using port 3000
lsof -i :3000
kill -9 <PID>

# Or use a different port
npm run dev -- --port 3001
```

#### API key not working

1. Verify the key is correctly copied (no extra spaces)
2. Check that the key is in `.env.local`, not `.env`
3. Restart the development server after changes
4. Verify API quotas haven't been exceeded

### Getting Help

If you encounter issues not covered here:

1. Check the [GitHub Issues](https://github.com/ewentling/NeuroLynx/issues) for similar problems
2. Create a new issue with detailed error information
3. Include your Node.js version, OS, and relevant error logs

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run TypeScript type checking |

---

## Next Steps

After installation, proceed to the [User Guide](USER_GUIDE.md) to learn how to use NeuroLynx effectively.
