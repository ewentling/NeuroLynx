# NeuroLynx User Guide

Welcome to NeuroLynx, your AI-powered Business Orchestration Agent. This comprehensive guide will help you understand and utilize all features of the platform.

## Table of Contents

- [Getting Started](#getting-started)
- [Navigation Overview](#navigation-overview)
- [Core Features](#core-features)
  - [Dashboard (Home)](#dashboard-home)
  - [AI Chat Assistant](#ai-chat-assistant)
  - [Client Management](#client-management)
  - [Deal Pipeline](#deal-pipeline)
  - [Meetings](#meetings)
  - [Tasks](#tasks)
  - [Calendar](#calendar)
  - [Communications](#communications)
- [Documents & Contracts](#documents--contracts)
- [Analytics & Reporting](#analytics--reporting)
- [Administration](#administration)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Tips & Best Practices](#tips--best-practices)

---

## Getting Started

### First Login

1. **Access NeuroLynx**: Navigate to your NeuroLynx URL (default: `http://localhost:3000`)

2. **Login Credentials**: Use your assigned credentials to log in:
   - **Admin Account**: `admin@neurolynx.ai` / `password`
   - **Worker Account**: `worker@neurolynx.ai` / `password`
   
   > ⚠️ **Important**: Change these default passwords immediately in a production environment.

3. **License Validation**: If prompted, enter your license key or connect to the license validation service.

### Interface Overview

After logging in, you'll see the main interface with three primary areas:

- **Left Sidebar**: Navigation menu organized by function
- **Main Content Area**: The active view's content
- **Header Bar**: Quick actions, search, notifications, and user menu

### Theme Switching

Toggle between dark and light themes using the moon/sun icon in the header bar.

---

## Navigation Overview

### Main Menu Categories

| Category | Views | Description |
|----------|-------|-------------|
| **Home** | Dashboard | Business overview with KPIs and quick actions |
| **Chat** | AI Assistant | Conversational AI interface |
| **Companies** | Clients, Onboarding | Company and contact management |
| **Workspace** | Pipeline, Meetings, Documents | Day-to-day work areas |
| **Tasks** | Task Board | Kanban-style task management |
| **Calendar** | Events | Schedule and meeting management |
| **Comms** | Messages, Sequences | Communication management |
| **Analytics** | Various reports | Business intelligence dashboards |
| **Settings** | Configuration | System and user settings |

### Quick Navigation

- Use **Cmd/Ctrl + K** to open the command palette for quick navigation
- Click the search icon in the header to search across all data
- Use breadcrumbs to navigate back through view hierarchy

---

## Core Features

### Dashboard (Home)

The Home view provides an at-a-glance overview of your business:

#### Key Performance Indicators (KPIs)
- **Active Clients**: Total number of active company accounts
- **Monthly Revenue**: Current month's recognized revenue
- **Pipeline Value**: Total value of deals in progress
- **Open Tasks**: Number of tasks awaiting completion

#### Quick Actions
- Create new companies, deals, or tasks
- Access recent items
- View upcoming meetings

#### Meeting Spotlight
Shows your next scheduled meeting with one-click join option.

### AI Chat Assistant

The AI Chat is your intelligent assistant powered by large language models.

#### Starting a Conversation

1. Navigate to the **Chat** view
2. Type your message in the input field or click the microphone for voice input
3. Press Enter or click Send

#### Chat Capabilities

- **Information Retrieval**: "What deals do we have with Acme Corp?"
- **Document Generation**: "Draft a proposal for the cloud migration project"
- **Meeting Summaries**: "Summarize my last meeting with Stark Industries"
- **Task Creation**: "Create a task to follow up with the client next week"
- **Data Analysis**: "What's our win rate this quarter?"

#### Voice Mode

1. Click the microphone icon to start recording
2. Speak your request clearly
3. Click again to stop recording
4. The AI will respond in a conversational format

#### Context Awareness

The AI maintains context about:
- Currently selected company/client
- Recent conversation history
- Your workspace data (deals, contracts, tasks)

### Client Management

#### Companies View

Manage your business accounts:

1. **Add Company**: Click "+ Add Company" button
2. **Edit Company**: Click on a company card, then the edit icon
3. **View Details**: Click a company to see full profile
4. **Filter/Search**: Use the search bar to find specific companies

**Company Information Includes:**
- Name, address, phone, website
- Industry and status (Active/Inactive/Lead)
- Revenue and lead score
- Geographic coordinates (for map view)

#### Contacts

Each company can have multiple contacts:

1. Select a company from the dropdown
2. Navigate to the Contacts section
3. Add contacts with role, email, phone, and social links

#### Client Notes

Store important information about each client:
- Meeting notes
- Preferences
- Key decisions
- Historical context

### Deal Pipeline

Visual Kanban board for managing sales opportunities.

#### Pipeline Stages

| Stage | Description |
|-------|-------------|
| **Qualification** | Initial assessment of opportunity fit |
| **Proposal** | Preparing and presenting solution |
| **Negotiation** | Discussing terms and pricing |
| **Closed Won** | Successfully closed deals |
| **Closed Lost** | Unsuccessful opportunities |

#### Managing Deals

1. **Create Deal**: Click "+ New Deal" in any stage column
2. **Move Deal**: Drag and drop between stages
3. **Edit Deal**: Click on a deal card to modify
4. **Archive Deal**: Use the menu to archive closed deals

#### Deal Information
- Title and associated company
- Deal value and probability
- Expected close date
- Owner assignment
- Notes and loss reasons (if applicable)

### Meetings

Comprehensive meeting management with AI-powered analysis.

#### Scheduling Meetings

1. Navigate to **Meetings** view
2. Click "+ Schedule Meeting"
3. Fill in meeting details (title, date, time, type, attendees)
4. Save the meeting

#### Meeting Intelligence

After a meeting:

1. **Upload Recording**: Drag and drop audio file or use the upload button
2. **AI Processing**: The system transcribes and analyzes the recording
3. **Review Results**:
   - Full transcript with speaker identification
   - AI-generated summary
   - Extracted action items
   - Sentiment analysis
   - Recommendations

#### Live Meeting Cards

During active meetings, enable Battle Cards to receive real-time:
- Competitor information
- Product details
- Objection handling tips
- Pricing guidance

### Tasks

Kanban-style task management across all clients.

#### Task Board Columns

| Column | Description |
|--------|-------------|
| **To Do** | Pending tasks not yet started |
| **In Progress** | Currently active work |
| **Done** | Completed tasks |

#### Creating Tasks

1. Click "+ Add Task" in the desired column
2. Fill in:
   - Title and description
   - Priority (Low/Medium/High)
   - Due date
   - Assigned user
   - Associated client (optional)
   - Tags

#### Task Sources

Tasks can be created from:
- Manual entry
- Meeting action items (automatic)
- Email extraction (AI-powered)
- Chat commands

### Calendar

Integrated calendar showing all scheduled events.

#### Calendar Views
- **Month View**: Overview of the full month
- **Week View**: Detailed weekly schedule
- **Day View**: Hour-by-hour daily agenda

#### Event Management

1. Click on a date to create a new event
2. Drag events to reschedule
3. Click an event to view details or edit

#### Google Calendar Sync

If Google Workspace is connected:
1. Go to Settings > Integrations
2. Connect your Google account
3. Events sync bidirectionally

### Communications

Manage all client communications in one place.

#### Message Folders

| Folder | Contents |
|--------|----------|
| **Inbox** | Received messages |
| **Sent** | Outgoing messages |
| **Drafts** | Unsent messages |
| **Archive** | Archived communications |

#### Composing Messages

1. Click "Compose" button
2. Select recipient (company/contact)
3. Enter subject and message
4. Click Send or Save as Draft

#### Email Sequences

Automate outreach with multi-step email sequences:

1. Navigate to **Sequences** view
2. Create a new sequence
3. Add email steps with delays
4. Enroll contacts
5. Track engagement

---

## Documents & Contracts

### Contract Builder

Create professional contracts from templates or scratch.

#### Building a Contract

1. Navigate to **Workspace** > **Contracts**
2. Click "+ New Contract"
3. Select company and template (optional)
4. Add line items from product catalog
5. Configure:
   - Payment terms
   - Discount and tax
   - Start and end dates
   - Terms and conditions
6. Generate PDF preview
7. Send for signature

### Invoice Builder

Create and track invoices:

1. Navigate to **Invoices** view
2. Click "+ New Invoice"
3. Select company
4. Add line items
5. Set due date and terms
6. Generate and send

**Invoice Statuses**: Draft → Sent → Paid (or Overdue)

### Quote Builder

Generate quick quotes for prospects:

1. Navigate to **Quotes** view
2. Create new quote
3. Add products with quantities
4. Set discount and validity period
5. Generate PDF

### E-Signature Tracking

Track document signing status:

1. Send documents via integrated e-sign service
2. Monitor status: Draft → Sent → Viewed → Signed
3. Receive notifications on completion

---

## Analytics & Reporting

### Available Reports

| Report | Description |
|--------|-------------|
| **Forecast** | Revenue projections based on pipeline |
| **KPIs** | Goal tracking and performance metrics |
| **Velocity** | Sales cycle speed analysis |
| **Profitability** | Margin and cost analysis |
| **Utilization** | Team resource utilization |
| **Win/Loss** | Deal outcome analysis |
| **CSAT** | Customer satisfaction scores |
| **Leaderboard** | Sales team performance ranking |

### Viewing Reports

1. Navigate to the Analytics section in the sidebar
2. Select the desired report
3. Use filters to customize the view
4. Export data as needed

### KPI Goals

Set and track organizational goals:

1. Navigate to **KPIs** view
2. Click "+ Add Goal"
3. Configure:
   - Metric (revenue, clients, deals, etc.)
   - Target value
   - Period (monthly/quarterly/yearly)
4. Track progress over time

---

## Administration

### User Management (Admin Only)

1. Navigate to **Settings** > **Team**
2. View all users
3. Add new users with role assignment
4. Deactivate users as needed

#### User Roles

| Role | Permissions |
|------|-------------|
| **Admin** | Full system access, user management, settings |
| **Worker** | Standard access to workspace features |

### AI Configuration

Configure LLM providers and settings:

1. Navigate to **Settings** > **AI Config**
2. Add API keys for desired providers:
   - Google Gemini
   - OpenAI
   - Anthropic Claude
   - Others
3. Map features to specific models
4. Test configurations

### Integrations

Connect external services:

1. Navigate to **Settings** > **Integrations**
2. Available integrations:
   - Google Workspace
   - Slack
   - HubSpot
   - Salesforce
   - Custom webhooks (n8n)
3. Follow connection prompts for each service

### Audit Logs (Admin Only)

View system activity:

1. Navigate to **Settings** > **Audit Logs**
2. Filter by user, action type, or date
3. Review detailed activity records

### Custom Fields

Extend data models with custom fields:

1. Navigate to **Settings** > **Custom Fields**
2. Create fields for: Companies, Deals, Contacts, Projects
3. Define field type: Text, Number, Date, Boolean, Dropdown
4. Fields appear in respective entity forms

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + K` | Open command palette |
| `Cmd/Ctrl + B` | Toggle sidebar |
| `Cmd/Ctrl + /` | Show shortcuts help |
| `Esc` | Close modal/panel |
| `Cmd/Ctrl + Enter` | Submit form/send message |
| `Arrow Keys` | Navigate lists |
| `Enter` | Select/confirm |

---

## Tips & Best Practices

### Maximizing AI Effectiveness

1. **Provide Context**: When asking questions, specify the company or deal context
2. **Be Specific**: "Draft a follow-up email for the Acme meeting on March 15" works better than "write an email"
3. **Use Voice for Quick Tasks**: Voice input is great for quick note-taking and simple queries
4. **Review AI Outputs**: Always review generated content before sending

### Organization Tips

1. **Consistent Naming**: Use consistent naming conventions for companies and deals
2. **Regular Updates**: Keep deal stages and task statuses current
3. **Tag Liberally**: Use tags to categorize and filter information
4. **Document Everything**: Store important notes in the Memory feature

### Data Management

1. **Regular Backups**: Export important data periodically
2. **Clean Pipeline**: Archive old deals to keep the pipeline focused
3. **Review Contacts**: Keep contact information up to date
4. **Monitor Integrations**: Check integration status regularly

### Security Recommendations

1. **Strong Passwords**: Use unique, complex passwords
2. **API Key Safety**: Never share API keys or commit them to code
3. **Session Management**: Log out when not using the application
4. **Review Audit Logs**: Regularly review activity for anomalies

---

## Getting Help

### In-App Help

- Navigate to **Help** view for documentation
- Use the AI Chat to ask questions about features
- Check tooltips on icons and buttons

### Support Resources

- **GitHub Issues**: Report bugs or request features
- **Documentation**: Check for updated guides
- **Community**: Join discussions with other users

---

## Glossary

| Term | Definition |
|------|------------|
| **Battle Card** | Real-time competitive intelligence during meetings |
| **Company** | A business account/organization |
| **Contact** | An individual person at a company |
| **Deal** | A sales opportunity being tracked |
| **LLM** | Large Language Model (AI) |
| **MCP** | Model Context Protocol |
| **Pipeline** | Visual representation of deals by stage |
| **RBAC** | Role-Based Access Control |
| **Sequence** | Automated multi-step email campaign |
| **Workspace** | Client-specific document and data area |

---

*Last Updated: March 2026*
