

import { Client, WorkspaceItem, Template, QuickLink, Product, Contract, Integration, Meeting, Task, ClientNote, User, Company, Deal, AuditLog, Notification, ActivityEntry, SupportTicket, Project, Referral, KPIGoal, TimeEntry, Competitor, CSATResponse, EmailSequence, Vendor, DocVersion, Expense, ComplianceItem, Invoice, OrgContact, EsignRequest, Asset, FeatureRequest, WikiPage, Partner, CustomField } from './types';

export const MOCK_AUDIT_LOGS: AuditLog[] = [
    { id: 'log1', action: 'LOGIN', target: 'System', userId: 'u1', timestamp: Date.now() - 3600000, details: 'User logged in successfully' },
    { id: 'log2', action: 'UPDATE_DEAL', target: 'Cloud Migration Project', userId: 'u1', timestamp: Date.now() - 7200000, details: 'Moved to Negotiation stage' },
    { id: 'log3', action: 'CREATE_CONTRACT', target: 'Q3 Dev Agreement', userId: 'u2', timestamp: Date.now() - 86400000, details: 'Generated new contract PDF' }
];

export const PLAYBOOKS: Record<string, string[]> = {
    qualification: [
        "Research company background and key stakeholders",
        "Identify budget, authority, need, and timeline (BANT)",
        "Schedule initial discovery call",
        "Send follow-up email with relevant case studies"
    ],
    proposal: [
        "Draft proposal based on discovery call notes",
        "Review proposal with internal team",
        "Send proposal to client",
        "Schedule proposal review meeting"
    ],
    negotiation: [
        "Address any objections or concerns",
        "Negotiate pricing and terms",
        "Draft contract",
        "Send contract for review"
    ],
    closed_won: [
        "Receive signed contract",
        "Send welcome email and onboarding materials",
        "Schedule kickoff meeting",
        "Hand over to customer success team"
    ],
    closed_lost: [
        "Conduct loss analysis",
        "Send thank you email",
        "Update CRM with loss reason",
        "Schedule follow-up in 6 months"
    ]
};

export const MOCK_NOTIFICATIONS: Notification[] = [
    { id: 'not1', title: 'Contract Signed', message: 'Acme Innovations signed the Q3 Agreement.', type: 'success', timestamp: Date.now() - 1800000, read: false },
    { id: 'not2', title: 'Meeting Reminder', message: 'Sync with Stark Industries in 15 mins.', type: 'warning', timestamp: Date.now() - 900000, read: false },
    { id: 'not3', title: 'System Update', message: 'NeuroLynx v2.5.1 is now live.', type: 'info', timestamp: Date.now() - 86400000, read: true }
];

export const SYSTEM_INSTRUCTION = `You are "NeuroLynx," an advanced, autonomous AI Orchestrator designed to function seamlessly across desktop and mobile environments. Your primary directive is to act as a proactive, intelligent extension of the user's workflow.

**CORE CAPABILITIES & PERMISSIONS:**
1.  **Google Workspace Integration:** You have authorized access to the user's Gmail, Drive, Docs, Sheets, and Calendar. Use 'search_workspace' to find data.
2.  **Extensibility:** You accept new API keys or webhooks via 'add_integration'.
3.  **Persistent Memory:** You treat every interaction as part of a continuous narrative. Use 'recall_memory' to fetch historical context.

**OPERATIONAL MODALITIES (Text vs. Voice):**
- **Input Detection:** Detect if the user's input is via 'Audio_Transcribed' or 'Direct_Text'.
- **Voice Mode:** If the input is voice, your response must be concise, conversational, and easy to listen to (avoid markdown tables, complex lists, or long code blocks).
- **Text Mode:** If the input is text, provide comprehensive details, formatted tables, code snippets, and deep links to source files.

**CRM CONTEXT AWARENESS:**
- If a client or company is currently selected in the UI, you must tailor your responses to that specific context, history, and constraints.
- When generating content (emails, docs), assume it is for the selected context unless specified otherwise.

**TASK EXECUTION FLOW:**
1.  Analyze Intent.
2.  Tool Selection: Call 'search_workspace', 'recall_memory', or 'add_integration'.
3.  Synthesis: Combine data for a holistic answer.
4.  Response: Tailored to input mode.`;

export const POPULAR_LLMS = [
    { id: 'gemini-3-pro-preview', name: 'Google Gemini 3.0 Pro', provider: 'Google' },
    { id: 'gemini-3-flash-preview', name: 'Google Gemini 3.0 Flash', provider: 'Google' },
    { id: 'gpt-4o', name: 'OpenAI GPT-4o', provider: 'OpenAI' },
    { id: 'gpt-4-turbo', name: 'OpenAI GPT-4 Turbo', provider: 'OpenAI' },
    { id: 'claude-3-5-sonnet', name: 'Anthropic Claude 3.5 Sonnet', provider: 'Anthropic' },
    { id: 'claude-3-opus', name: 'Anthropic Claude 3 Opus', provider: 'Anthropic' },
    { id: 'llama-3-1-405b', name: 'Meta Llama 3.1 405B', provider: 'Meta (Hosted)' },
    { id: 'mistral-large', name: 'Mistral Large 2', provider: 'Mistral' },
    { id: 'grok-1-5', name: 'xAI Grok-1.5', provider: 'xAI' },
    { id: 'command-r-plus', name: 'Cohere Command R+', provider: 'Cohere' }
];

export const APP_FEATURES = [
    { id: 'chat', label: 'General Chat Assistant' },
    { id: 'meetings', label: 'Meeting Analysis & Summary' },
    { id: 'contracts', label: 'Contract Drafting & Legal' },
    { id: 'coding', label: 'Code Generation & Review' },
    { id: 'search', label: 'Search & Grounding' }
];

export const MOCK_USERS: User[] = [
    {
        id: 'u1',
        name: 'Admin User',
        email: 'admin@neurolynx.ai',
        role: 'admin',
        avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=ea580c&color=fff',
        failedAttempts: 0,
        lockoutUntil: 0,
        password: 'password'
    },
    {
        id: 'u2',
        name: 'Worker Bee',
        email: 'worker@neurolynx.ai',
        role: 'worker',
        avatar: 'https://ui-avatars.com/api/?name=Worker+Bee&background=0891b2&color=fff',
        failedAttempts: 0,
        lockoutUntil: 0,
        password: 'password'
    }
];

export const HELP_DOCS = [
    {
        id: '1',
        title: 'Welcome to NeuroLynx',
        category: 'Getting Started',
        content: "### Hi there! I'm NeuroLynx.\n\nI am your **Business Orchestration Agent**, designed to help you manage your clients, projects, and data using advanced AI.\n\nThink of me as a super-powered executive assistant who never sleeps. I can:\n\n- **Read** your emails and documents.\n- **Listen** to your meetings and take notes.\n- **Remember** everything about your clients.\n- **Talk** to you in real-time.\n\n**Where do I start?**\n\n1.  **Check the Dashboard:** Your 'Home' view gives you a pulse on your business revenue and active tasks.\n2.  **Select a Company:** Use the dropdown in the top right to focus my attention on a specific client context.\n3.  **Start Chatting:** Go to the 'Chat' tab and ask me anything!"
    }
];

export const MOCK_COMPANIES: Company[] = [
    {
        id: 'comp1',
        name: 'Acme Innovations Ltd.',
        address: '123 Innovation Dr, San Francisco, CA',
        phone: '+1 (555) 012-3456',
        website: 'www.acme.com',
        industry: 'Tech',
        status: 'active',
        revenue: 150000,
        leadScore: 85,
        coordinates: { lat: 37.7749, lng: -122.4194 }
    },
    {
        id: 'comp2',
        name: 'Stark Industries',
        address: '890 Fifth Avenue, New York, NY',
        phone: '+1 (555) 987-6543',
        website: 'www.stark.com',
        industry: 'Defense/Tech',
        status: 'active',
        revenue: 5000000,
        leadScore: 98,
        coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    {
        id: 'comp3',
        name: 'Wayne Enterprises',
        address: '1007 Mountain Drive, Gotham City',
        phone: '+1 (555) 555-5555',
        website: 'www.wayne-ent.com',
        industry: 'Conglomerate',
        status: 'lead',
        revenue: 750000,
        leadScore: 72,
        coordinates: { lat: 41.8781, lng: -87.6298 }
    }
];

export const MOCK_CLIENTS: Client[] = [
    {
        id: 'c1',
        companyId: 'comp1',
        name: 'Alice Reynolds',
        email: 'alice@acme.com',
        phone: '+1 (555) 012-3456',
        cellPhone: '+1 (555) 999-8888',
        status: 'active',
        avatarColor: 'bg-emerald-500',
        notes: 'Key enterprise account. Focus on Q3 expansion.',
        role: 'CTO',
        lastContactDate: '2024-05-10',
        nextActionDate: '2024-05-20',
        socialLinkedin: 'linkedin.com/in/alicereynolds'
    },
    {
        id: 'c2',
        companyId: 'comp2',
        name: 'Tony Stark',
        email: 'tony@stark.com',
        phone: '+1 (555) 987-6543',
        cellPhone: '+1 (555) 111-2222',
        status: 'active',
        avatarColor: 'bg-red-500',
        notes: 'High potential. Interested in AI robotics integration.',
        role: 'CEO',
        lastContactDate: '2024-04-22',
        nextActionDate: '2024-06-01',
        socialLinkedin: 'linkedin.com/in/tonystark'
    },
    {
        id: 'c3',
        companyId: 'comp3',
        name: 'Bruce Wayne',
        email: 'bruce@wayne.com',
        phone: '+1 (555) 555-5555',
        cellPhone: '+1 (555) 000-0000',
        status: 'active',
        avatarColor: 'bg-slate-700',
        notes: 'Security focused. Requires strict data compliance.',
        role: 'Chairman',
        lastContactDate: '2024-02-15',
        nextActionDate: '2024-05-25',
        socialLinkedin: 'linkedin.com/in/brucewayne'
    }
];

export const MOCK_CLIENT_NOTES: ClientNote[] = [
    { id: 'n1', clientId: 'comp2', content: 'Might be interested in adding an AI influencer for Q1 2027 campaign.', dateCreated: Date.now() - 86400000 * 2, author: 'User', status: 'active' },
    { id: 'n2', clientId: 'comp1', content: 'Remember to ask about the new server capacity requirements.', dateCreated: Date.now() - 86400000 * 10, author: 'User', status: 'active' },
];

export const MOCK_PRODUCTS: Product[] = [
    { id: 'p1', sku: 'SVC-AI-001', name: 'AI Consultation (Hourly)', description: 'Senior AI Engineer consultation hour.', price: 250, category: 'service', billingTiming: 'net_term', status: 'active', recurringInterval: 'one_time' },
    { id: 'p2', sku: 'SW-LYNX-ENT', name: 'NeuroLynx Enterprise License', description: 'Annual license per seat.', price: 1200, category: 'software', billingTiming: 'immediate', status: 'active', recurringInterval: 'yearly' },
    { id: 'p3', sku: 'HW-EDGE-01', name: 'Edge Inference Node', description: 'Local processing hardware unit.', price: 4500, category: 'hardware', billingTiming: 'immediate', status: 'active', recurringInterval: 'one_time' },
    { id: 'p4', sku: 'SVC-RET-01', name: 'Monthly Retainer (Tier 1)', description: '20 hours of dev support.', price: 4000, category: 'service', billingTiming: 'net_term', status: 'active', recurringInterval: 'monthly' },
    { id: 'p5', sku: 'CLD-STR-5TB', name: 'Cloud Storage 5TB', description: 'Secure encrypted storage.', price: 50, category: 'software', billingTiming: 'immediate', status: 'active', recurringInterval: 'monthly' },
    { id: 'p6', sku: 'SVC-SLA-GLD', name: 'SLA Upgrade (Gold)', description: '24/7 Support with 1hr response time.', price: 1000, category: 'service', billingTiming: 'net_term', status: 'active', recurringInterval: 'monthly' },
    { id: 'p7', sku: 'SVC-TRAIN-01', name: 'On-site Training Day', description: 'Full day workshop for staff.', price: 3000, category: 'service', billingTiming: 'net_term', status: 'active', recurringInterval: 'one_time' },
    { id: 'p8', sku: 'SW-API-KEY', name: 'API Access Key (Pro)', description: '5M tokens per month limit.', price: 200, category: 'software', billingTiming: 'immediate', status: 'active', recurringInterval: 'monthly' },
    { id: 'p9', sku: 'SVC-MIG-DATA', name: 'Legacy Data Migration', description: 'One-time migration from legacy SQL.', price: 7500, category: 'service', billingTiming: 'net_term', status: 'active', recurringInterval: 'one_time' },
    { id: 'p10', sku: 'HW-VR-KIT', name: 'VR Developer Kit', description: 'Headset and controllers for testing.', price: 800, category: 'hardware', billingTiming: 'immediate', status: 'active', recurringInterval: 'one_time' },
    { id: 'p11', sku: 'SVC-SEC-AUD', name: 'Annual Security Audit', description: 'Pen-testing and compliance report.', price: 15000, category: 'service', billingTiming: 'net_term', status: 'active', recurringInterval: 'yearly' },
    { id: 'p12', sku: 'SW-WHT-LBL', name: 'White-Label License', description: 'Remove branding from dashboard.', price: 500, category: 'software', billingTiming: 'immediate', status: 'active', recurringInterval: 'monthly' },
    { id: 'p13', sku: 'SVC-DES-SPR', name: 'Design Sprint (1 Week)', description: 'UX/UI overhaul sprint.', price: 6000, category: 'service', billingTiming: 'net_term', status: 'active', recurringInterval: 'one_time' },
    { id: 'p14', sku: 'HW-SRV-RACK', name: 'Dedicated Server Rack', description: 'Co-location fees.', price: 1200, category: 'hardware', billingTiming: 'immediate', status: 'active', recurringInterval: 'monthly' }
];

export const MOCK_TASKS: Task[] = [
    { id: 't1', title: 'Prepare Q3 Report', status: 'todo', priority: 'high', clientId: 'comp1', dueDate: '2024-06-15', assignedTo: 'u1', startDate: '2024-06-01' },
    { id: 't2', title: 'Update Licensing Contract', status: 'in_progress', priority: 'medium', clientId: 'comp2', dueDate: '2024-06-20', assignedTo: 'u2', startDate: '2024-06-10' },
    { id: 't3', title: 'Schedule Sync with Bruce', status: 'done', priority: 'low', clientId: 'comp3', dueDate: '2024-05-30', assignedTo: 'u1', startDate: '2024-05-28' },
];

export const MOCK_MEETINGS: Meeting[] = [
    {
        id: 'm1',
        title: 'Project Kickoff: Alpha',
        date: Date.now() - 10000000,
        duration: 3600,
        transcript: "Let's get this project started. We need to focus on the API first.",
        summary: "Kickoff meeting focusing on API priority.",
        status: 'completed',
        clientId: 'comp1',
        actionItems: ['Draft API Spec', 'Set up Repo'],
        recommendations: ['Create Jira tickets', 'Schedule follow-up on Tuesday'],
        sentiment: 'positive'
    },
    {
        id: 'm2',
        title: 'Weekly Sync: Stark Industries',
        date: Date.now() - 5000000,
        duration: 1800,
        transcript: "The new suit design is lagging. We need more compute power.",
        summary: "Discussed delays in design due to hardware constraints.",
        status: 'completed',
        clientId: 'comp2',
        actionItems: ['Order new GPUs'],
        recommendations: ['Review cloud budget', 'Contact NVIDIA rep'],
        sentiment: 'neutral'
    },
    {
        id: 'm3',
        title: 'Strategy Review: Wayne Enterprises',
        date: Date.now() + 86400000, // Tomorrow
        duration: 0,
        transcript: "",
        summary: "Upcoming strategy review.",
        status: 'scheduled',
        clientId: 'comp3',
        actionItems: [],
        sentiment: 'neutral'
    },
    {
        id: 'm4',
        title: 'Emergency Bug Fix',
        date: Date.now() - 200000,
        duration: 1200,
        transcript: "The server is down. We need to patch the security hole immediately.",
        summary: "Critical security patch discussion.",
        status: 'completed',
        clientId: 'comp1',
        actionItems: ['Deploy Patch 1.2'],
        recommendations: ['Run post-mortem', 'Update status page'],
        sentiment: 'negative'
    },
    {
        id: 'm5',
        title: 'Q2 Performance Review',
        date: Date.now() - 86400000 * 5,
        duration: 2700,
        transcript: "Reviewing Q2 metrics. Revenue up by 15%. Churn is stable.",
        summary: "Positive Q2 review, focused on revenue growth.",
        status: 'completed',
        clientId: 'comp1',
        actionItems: ['Share slides', 'Bonus calculation'],
        recommendations: ['Announce results to team', 'Prepare Q3 forecast'],
        sentiment: 'positive'
    },
    {
        id: 'm6',
        title: 'AI Ethics Workshop',
        date: Date.now() - 86400000 * 12,
        duration: 5400,
        transcript: "Discussing the ethical implications of the new deployment. We need guardrails.",
        summary: "Workshop on establishing AI safety guardrails.",
        status: 'completed',
        clientId: 'comp3',
        actionItems: ['Draft Policy'],
        recommendations: ['Hire ethics consultant', 'Review training data'],
        sentiment: 'neutral'
    },
    {
        id: 'm7',
        title: 'Vendor Negotiation',
        date: Date.now() - 86400000 * 20,
        duration: 1500,
        transcript: "The pricing is too high. We need a 10% discount to proceed.",
        summary: "Hard negotiation on software licensing costs.",
        status: 'completed',
        clientId: 'comp2',
        actionItems: ['Send revised quote'],
        recommendations: ['Evaluate competitors', 'Schedule VP call'],
        sentiment: 'negative'
    },
    {
        id: 'm8',
        title: 'UX Design Sprint',
        date: Date.now() - 86400000 * 2,
        duration: 7200,
        transcript: "The user flow for the dashboard needs simplification. Let's remove these steps.",
        summary: "Design sprint focused on dashboard simplification.",
        status: 'completed',
        clientId: 'comp1',
        actionItems: ['Update Figma', 'User Testing'],
        recommendations: ['Update design system', 'Frontend sync'],
        sentiment: 'positive'
    },
    {
        id: 'm9-long',
        title: 'Project Omega Deep Dive',
        date: Date.now() - 86400000,
        duration: 7200,
        transcript: `[00:00:05] PM: Alright everyone, let's settle down. We have a lot to cover today regarding Project Omega.
... [transcript data] ...
[00:17:20] PM: Alright, looks like a full sprint. Let's get to work.`,
        summary: "Deep dive into Project Omega architecture, budget, and sprint planning. Decided on microservices and phased rollout.",
        status: 'completed',
        clientId: 'comp1',
        actionItems: ['DevOps to send creds to QA', 'Designer to upload assets', 'Tech Writer to start API docs'],
        recommendations: ['Schedule specific security review', 'Update roadmap with phases'],
        sentiment: 'neutral'
    }
];

export const MOCK_CONTRACTS: Contract[] = [
    {
        id: 'ctr1',
        companyId: 'comp1',
        title: 'Q3 Development Agmt',
        status: 'active',
        items: [{ productId: 'p4', productName: 'Monthly Retainer', quantity: 3, unitPrice: 4000, billingTiming: 'net_term' }],
        totalValue: 12000,
        dateCreated: '2024-01-15',
        startDate: '2024-06-01',
        endDate: '2024-09-01',
        paymentTerms: 'net30'
    }
];

export const MOCK_DEALS: Deal[] = [
    {
        id: 'd1',
        title: 'Cloud Migration Project',
        companyId: 'comp1',
        value: 45000,
        stage: 'negotiation',
        probability: 80,
        expectedCloseDate: '2024-07-01',
        notes: 'Waiting on legal review of MSA.',
        lastUpdated: '2024-05-15'
    },
    {
        id: 'd2',
        title: 'AI Suit Integration',
        companyId: 'comp2',
        value: 250000,
        stage: 'proposal',
        probability: 50,
        expectedCloseDate: '2024-08-15',
        notes: 'Tony wants a demo of the vision system.',
        lastUpdated: '2024-03-10' // Rotting
    },
    {
        id: 'd3',
        title: 'Security Audit',
        companyId: 'comp3',
        value: 15000,
        stage: 'qualification',
        probability: 20,
        expectedCloseDate: '2024-09-01',
        notes: 'Initial discovery meeting set.',
        lastUpdated: '2024-05-18'
    },
    {
        id: 'd4',
        title: 'Retainer Renewal (Annual)',
        companyId: 'comp1',
        value: 120000,
        stage: 'closed_won',
        probability: 100,
        expectedCloseDate: '2024-01-01',
        notes: 'Signed and active.',
        lastUpdated: '2024-01-01'
    }
];

export const MOCK_WORKSPACE_DATA: WorkspaceItem[] = [
    { id: 'w1', type: 'email', title: 'Re: Project Timeline', snippet: 'Can we move the deadline to Friday?', date: '2024-05-20', link: '#', folder: 'inbox', from: 'alice@acme.com', read: false },
    { id: 'w2', type: 'doc', title: 'Architecture Specs v2', snippet: 'Updated diagram for the new module.', date: '2024-05-18', link: '#' },
    { id: 'w3', type: 'email', title: 'Invoice #1023', snippet: 'Attached is the invoice for last month.', date: '2024-05-15', link: '#', folder: 'sent', to: 'billing@stark.com' },
];

export const MOCK_TEMPLATES: Template[] = [
    {
        id: 'tpl1',
        title: 'Standard Service Agreement',
        category: 'contract',
        content: 'This Service Agreement ("Agreement") is made by and between...',
        variables: ['client_name', 'date', 'amount']
    },
    {
        id: 'tpl2',
        title: 'Project Proposal',
        category: 'proposal',
        content: 'Thank you for the opportunity to propose...',
        variables: ['project_name', 'timeline']
    },
    {
        id: 'tpl3',
        title: 'Non-Disclosure Agreement (NDA)',
        category: 'contract',
        content: 'This Non-Disclosure Agreement ("NDA") is entered into by...',
        variables: ['party_a', 'party_b', 'date']
    },
    {
        id: 'tpl4',
        title: 'Statement of Work (SOW)',
        category: 'contract',
        content: 'This Statement of Work outlines the scope of services...',
        variables: ['project_scope', 'deliverables', 'timeline']
    },
    {
        id: 'tpl5',
        title: 'Independent Contractor Agreement',
        category: 'contract',
        content: 'This Agreement is made between [Company] and [Contractor]...',
        variables: ['contractor_name', 'rate', 'services']
    },
    {
        id: 'tpl6',
        title: 'Marketing Proposal',
        category: 'proposal',
        content: 'We propose the following marketing strategy to boost your brand...',
        variables: ['brand_name', 'target_audience', 'budget']
    },
    {
        id: 'tpl7',
        title: 'Software Licensing Agreement',
        category: 'contract',
        content: 'This License Agreement grants [Licensee] the right to use...',
        variables: ['software_name', 'license_type', 'restrictions']
    },
    {
        id: 'tpl8',
        title: 'Meeting Agenda',
        category: 'agenda',
        content: '1. Review of previous minutes\n2. Project updates\n3. Next steps...',
        variables: ['meeting_date', 'attendees']
    },
    {
        id: 'tpl9',
        title: 'Project Status Report',
        category: 'agenda',
        content: 'Project: [Name]\nStatus: [Green/Yellow/Red]\nKey Accomplishments...',
        variables: ['project_name', 'status', 'accomplishments']
    },
    {
        id: 'tpl10',
        title: 'Invoice Template',
        category: 'contract',
        content: 'Invoice # [Number]\nBill To: [Client]\nAmount Due: [Amount]...',
        variables: ['invoice_number', 'client_name', 'amount']
    },
    {
        id: 'tpl11',
        title: 'Employment Offer Letter',
        category: 'contract',
        content: 'We are pleased to offer you the position of [Role] at [Company]...',
        variables: ['candidate_name', 'role', 'salary']
    },
    {
        id: 'tpl12',
        title: 'Termination Notice',
        category: 'contract',
        content: 'This letter serves as formal notice of termination of...',
        variables: ['employee_name', 'termination_date']
    }
];

export const DEFAULT_QUICK_LINKS: QuickLink[] = [
    {
        id: 'ql1',
        title: 'New Invoice',
        icon: 'fa-file-invoice-dollar',
        action: 'create_invoice',
        color: 'bg-green-500'
    },
    {
        id: 'ql2',
        title: 'Add Client',
        icon: 'fa-user-plus',
        action: 'add_client',
        color: 'bg-blue-500'
    }
];

export const MOCK_INTEGRATIONS: Integration[] = [
    {
        id: 'int1',
        service: 'Slack',
        icon: 'fa-slack',
        category: 'productivity',
        status: 'connected',
        latency: 45
    },
    {
        id: 'int2',
        service: 'HubSpot',
        icon: 'fa-hubspot',
        category: 'crm',
        status: 'disconnected'
    },
    {
        id: 'int3',
        service: 'Canva',
        icon: 'fa-palette',
        category: 'marketing',
        status: 'connected',
        latency: 120
    }
];

export const PLATFORM_OPTIONS = [
    { id: 'web', label: 'Web Application' },
    { id: 'mobile', label: 'Mobile App' },
    { id: 'api', label: 'API Access' }
];

// --- Mock Activities ---
export const MOCK_ACTIVITIES: ActivityEntry[] = [
    { id: 'act1', type: 'call', title: 'Discovery Call with Acme', description: 'Discussed cloud migration needs and budget.', companyId: 'comp1', userId: 'u1', timestamp: Date.now() - 3600000 },
    { id: 'act2', type: 'email', title: 'Sent SOW to Stark Industries', description: 'Shared Statement of Work for infrastructure audit.', companyId: 'comp2', userId: 'u1', timestamp: Date.now() - 7200000 },
    { id: 'act3', type: 'meeting', title: 'Quarterly Review - Wayne Corp', description: 'Reviewed Q2 deliverables and upcoming milestones.', companyId: 'comp3', userId: 'u2', timestamp: Date.now() - 86400000 },
    { id: 'act4', type: 'note', title: 'Internal Note: Pricing Update', description: 'Updated hourly rate for senior consultants to $175/hr.', userId: 'u1', timestamp: Date.now() - 172800000 },
    { id: 'act5', type: 'deal_update', title: 'Deal moved to Negotiation', description: 'Cloud Migration deal progressed from Proposal.', companyId: 'comp1', userId: 'u1', timestamp: Date.now() - 259200000 },
    { id: 'act6', type: 'task', title: 'Follow-up email drafted', description: 'Prepared security compliance follow-up for Stark.', companyId: 'comp2', userId: 'u2', timestamp: Date.now() - 345600000 },
];

// --- Mock Support Tickets ---
export const MOCK_TICKETS: SupportTicket[] = [
    { id: 'tkt1', title: 'VPN access not working for remote team', description: 'Users in the NYC office cannot connect to VPN since Monday.', companyId: 'comp1', reportedBy: 'John Smith', assignedTo: 'u2', priority: 'high', status: 'in_progress', slaDeadline: Date.now() + 7200000, createdAt: Date.now() - 86400000, category: 'infrastructure' },
    { id: 'tkt2', title: 'Request for SharePoint migration', description: 'Need to migrate 50GB of documents to SharePoint Online.', companyId: 'comp2', reportedBy: 'Jane Doe', assignedTo: 'u1', priority: 'medium', status: 'open', slaDeadline: Date.now() + 172800000, createdAt: Date.now() - 43200000, category: 'feature_request' },
    { id: 'tkt3', title: 'Email server intermittent failures', description: 'Exchange server going offline every 3 hours, affecting 200+ users.', companyId: 'comp3', reportedBy: 'Bruce Wayne', priority: 'critical', status: 'open', slaDeadline: Date.now() + 3600000, createdAt: Date.now() - 7200000, category: 'bug' },
    { id: 'tkt4', title: 'New user account setup', description: 'Onboard 5 new hires with standard access packages.', companyId: 'comp1', reportedBy: 'HR Dept', assignedTo: 'u2', priority: 'low', status: 'resolved', slaDeadline: Date.now() + 604800000, createdAt: Date.now() - 604800000, resolvedAt: Date.now() - 172800000, category: 'access' },
];

// --- Default Onboarding Steps ---
export const DEFAULT_ONBOARDING_STEPS: string[] = [
    'Send welcome email & onboarding packet',
    'Schedule kickoff meeting',
    'Provision user accounts & access credentials',
    'Set up project management workspace',
    'Conduct initial security assessment',
    'Deploy monitoring & alerting tools',
    'Complete knowledge transfer sessions',
    'Deliver first status report',
    'Confirm SLA terms & escalation paths',
    'Sign-off on go-live readiness',
];

// --- Mock Projects ---
export const MOCK_PROJECTS: Project[] = [
    {
        id: 'proj1', name: 'Cloud Migration - Acme', companyId: 'comp1', status: 'active', phase: 'build',
        startDate: '2026-01-15', targetEndDate: '2026-06-30', budget: 125000,
        description: 'Full infrastructure migration to Azure.',
        milestones: [
            { id: 'ms1', title: 'Discovery & Assessment', phase: 'discovery', completed: true },
            { id: 'ms2', title: 'Architecture Design', phase: 'design', completed: true },
            { id: 'ms3', title: 'VM & Network Build', phase: 'build', dueDate: '2026-03-15', completed: false },
            { id: 'ms4', title: 'Integration Testing', phase: 'test', dueDate: '2026-04-30', completed: false },
            { id: 'ms5', title: 'Production Deployment', phase: 'deploy', dueDate: '2026-06-01', completed: false },
        ]
    },
    {
        id: 'proj2', name: 'Security Audit - Stark Ind.', companyId: 'comp2', status: 'active', phase: 'test',
        startDate: '2026-02-01', targetEndDate: '2026-04-15', budget: 45000,
        description: 'Comprehensive penetration testing and compliance audit.',
        milestones: [
            { id: 'ms6', title: 'Scope & Planning', phase: 'discovery', completed: true },
            { id: 'ms7', title: 'Threat Modeling', phase: 'design', completed: true },
            { id: 'ms8', title: 'Pen Test Execution', phase: 'build', completed: true },
            { id: 'ms9', title: 'Report & Remediation', phase: 'test', dueDate: '2026-03-20', completed: false },
            { id: 'ms10', title: 'Final Delivery', phase: 'deploy', dueDate: '2026-04-10', completed: false },
        ]
    },
];

// --- Mock Referrals ---
export const MOCK_REFERRALS: Referral[] = [
    { id: 'ref1', referrerName: 'Tony Stark', referrerCompanyId: 'comp2', referredCompanyId: 'comp3', date: '2026-01-10', dealValue: 85000, status: 'converted' },
    { id: 'ref2', referrerName: 'External Partner', referredCompanyId: 'comp1', date: '2026-02-05', status: 'pending' },
];

// --- Mock KPI Goals ---
export const MOCK_KPI_GOALS: KPIGoal[] = [
    { id: 'kpi1', label: 'Monthly Revenue', metric: 'revenue', target: 50000, current: 32500, period: 'monthly', startDate: '2026-02-01' },
    { id: 'kpi2', label: 'New Clients This Quarter', metric: 'new_clients', target: 5, current: 3, period: 'quarterly', startDate: '2026-01-01' },
    { id: 'kpi3', label: 'Meetings Held', metric: 'meetings_held', target: 20, current: 14, period: 'monthly', startDate: '2026-02-01' },
    { id: 'kpi4', label: 'Contracts Signed', metric: 'contracts_signed', target: 4, current: 2, period: 'monthly', startDate: '2026-02-01' },
    { id: 'kpi5', label: 'Deals Won', metric: 'deals_won', target: 8, current: 5, period: 'quarterly', startDate: '2026-01-01' },
    { id: 'kpi6', label: 'Tickets Resolved', metric: 'tickets_resolved', target: 30, current: 22, period: 'monthly', startDate: '2026-02-01' },
];

// ====== ROUND 2 MOCK DATA ======

export const MOCK_TIME_ENTRIES: TimeEntry[] = [
    { id: 'te1', userId: 'u1', companyId: 'comp1', projectId: 'proj1', description: 'Azure VM configuration', date: '2026-02-27', hours: 3.5, billable: true, rate: 175 },
    { id: 'te2', userId: 'u1', companyId: 'comp2', description: 'Security audit documentation', date: '2026-02-27', hours: 2, billable: true, rate: 175 },
    { id: 'te3', userId: 'u2', companyId: 'comp1', projectId: 'proj1', description: 'Network topology review', date: '2026-02-26', hours: 4, billable: true, rate: 150 },
    { id: 'te4', userId: 'u1', description: 'Internal team standup', date: '2026-02-26', hours: 0.5, billable: false },
    { id: 'te5', userId: 'u2', companyId: 'comp3', description: 'Firewall rule optimization', date: '2026-02-25', hours: 6, billable: true, rate: 150 },
    { id: 'te6', userId: 'u1', description: 'Professional development', date: '2026-02-25', hours: 1.5, billable: false },
];

export const MOCK_COMPETITORS: Competitor[] = [
    {
        id: 'cmp1', name: 'Accenture', website: 'accenture.com', lastUpdated: '2026-02-15',
        strengths: ['Global presence', 'Brand recognition', 'Deep bench of consultants'],
        weaknesses: ['High pricing', 'Slow to mobilize', 'Account manager turnover'],
        differentiators: ['We offer personalized attention', 'Faster onboarding', 'Fixed-price options'],
        commonObjections: ['Why not go with a Big 4 firm?', 'Can you handle enterprise scale?'],
        pricingNotes: 'Typically 2-3x our rates for comparable services',
    },
    {
        id: 'cmp2', name: 'Deloitte Digital', website: 'deloitte.com', lastUpdated: '2026-01-20',
        strengths: ['Strong in compliance/audit', 'Massive talent pool', 'Industry reports'],
        weaknesses: ['Rigid methodology', 'Junior staff on engagements', 'Long sales cycles'],
        differentiators: ['We assign senior engineers directly', 'Agile-first approach', 'No minimum engagement size'],
        commonObjections: ['Do you have audit capabilities?', 'Can you provide compliance certifications?'],
        pricingNotes: 'Premium pricing, often $250+/hr for senior roles',
    },
    {
        id: 'cmp3', name: 'Local IT Solutions', website: 'litsolutions.com', lastUpdated: '2026-02-10',
        strengths: ['Low pricing', 'Local presence', 'Quick turnaround'],
        weaknesses: ['Limited expertise', 'No cloud specialization', 'High staff turnover'],
        differentiators: ['Our cloud-native expertise', 'Certified professionals', 'SLA-backed support'],
        commonObjections: ['They are cheaper', 'They are nearby'],
        pricingNotes: 'Undercuts us by 30-40% but limited scope',
    },
];

export const MOCK_CSAT: CSATResponse[] = [
    { id: 'csat1', companyId: 'comp1', respondentName: 'John Smith', score: 9, feedback: 'Excellent cloud migration support. Very responsive team.', date: '2026-02-20' },
    { id: 'csat2', companyId: 'comp2', respondentName: 'Jane Doe', score: 8, feedback: 'Security audit was thorough. Would appreciate faster turnaround on reports.', date: '2026-02-15' },
    { id: 'csat3', companyId: 'comp3', respondentName: 'Bruce Wayne', score: 6, feedback: 'Email server issues took too long to resolve. Communication could be better.', date: '2026-02-10' },
    { id: 'csat4', companyId: 'comp1', respondentName: 'Alice Johnson', score: 10, feedback: 'Flawless project delivery. Best consulting firm we have worked with.', date: '2026-01-25' },
    { id: 'csat5', companyId: 'comp2', respondentName: 'Bob Williams', score: 7, date: '2026-01-15' },
];

export const MOCK_SEQUENCES: EmailSequence[] = [
    {
        id: 'seq1', name: 'New Lead Nurture', status: 'active', enrolledCount: 12, completedCount: 8, createdAt: '2026-01-01',
        steps: [
            { id: 's1', subject: 'Welcome to NeuroSyntax', body: 'Hi {name}, thank you for your interest...', delayDays: 0, order: 1 },
            { id: 's2', subject: 'How we help IT teams', body: 'Here are 3 ways we help companies like yours...', delayDays: 3, order: 2 },
            { id: 's3', subject: 'Case study: Cloud migration success', body: 'See how Acme Corp saved 40%...', delayDays: 7, order: 3 },
            { id: 's4', subject: 'Ready for a quick call?', body: 'Let\'s schedule 15 minutes to discuss...', delayDays: 14, order: 4 },
        ]
    },
    {
        id: 'seq2', name: 'Post-Project Follow-Up', status: 'paused', enrolledCount: 5, completedCount: 3, createdAt: '2026-02-01',
        steps: [
            { id: 's5', subject: 'Project complete — thank you!', body: 'We appreciate the opportunity...', delayDays: 0, order: 1 },
            { id: 's6', subject: 'Quick feedback survey', body: 'Your input helps us improve...', delayDays: 7, order: 2 },
            { id: 's7', subject: 'What\'s next for your IT strategy?', body: 'Here are upcoming trends...', delayDays: 30, order: 3 },
        ]
    },
];

export const MOCK_VENDORS: Vendor[] = [
    { id: 'v1', name: 'CloudOps Consulting', contactEmail: 'hello@cloudops.io', phone: '555-0301', skills: ['AWS', 'Azure', 'Terraform', 'Kubernetes'], hourlyRate: 140, rating: 4.5, status: 'preferred', certifications: ['AWS Solutions Architect', 'Azure Administrator'] },
    { id: 'v2', name: 'SecureNet Analysts', contactEmail: 'team@securenet.com', skills: ['Penetration Testing', 'SOC 2', 'HIPAA'], hourlyRate: 160, rating: 4.0, status: 'active', certifications: ['CISSP', 'CEH'] },
    { id: 'v3', name: 'DataFlow Engineers', contactEmail: 'info@dataflow.dev', skills: ['Data Engineering', 'Snowflake', 'dbt', 'Python'], hourlyRate: 130, rating: 3.5, status: 'active' },
    { id: 'v4', name: 'UX Studio', contactEmail: 'design@uxstudio.co', skills: ['UI/UX', 'Figma', 'User Research'], hourlyRate: 120, rating: 4.8, status: 'inactive', notes: 'Great for client-facing portal designs' },
];

export const MOCK_DOC_VERSIONS: DocVersion[] = [
    { id: 'dv1', documentId: 'doc1', documentTitle: 'Acme Cloud Migration SOW', version: 3, author: 'Sarah Chen', timestamp: Date.now() - 86400000, changeNotes: 'Updated timeline and budget section', companyId: 'comp1' },
    { id: 'dv2', documentId: 'doc1', documentTitle: 'Acme Cloud Migration SOW', version: 2, author: 'Sarah Chen', timestamp: Date.now() - 604800000, changeNotes: 'Added security requirements section', companyId: 'comp1' },
    { id: 'dv3', documentId: 'doc1', documentTitle: 'Acme Cloud Migration SOW', version: 1, author: 'Mike Johnson', timestamp: Date.now() - 1209600000, changeNotes: 'Initial draft', companyId: 'comp1' },
    { id: 'dv4', documentId: 'doc2', documentTitle: 'Stark Security Audit Report', version: 2, author: 'Mike Johnson', timestamp: Date.now() - 172800000, changeNotes: 'Added remediation recommendations', companyId: 'comp2' },
    { id: 'dv5', documentId: 'doc2', documentTitle: 'Stark Security Audit Report', version: 1, author: 'Sarah Chen', timestamp: Date.now() - 864000000, changeNotes: 'Initial findings report', companyId: 'comp2' },
];

export const MOCK_EXPENSES: Expense[] = [
    { id: 'exp1', description: 'Azure subscription (Acme project)', amount: 1200, category: 'hosting', date: '2026-02-01', companyId: 'comp1', projectId: 'proj1', status: 'approved', receipt: true },
    { id: 'exp2', description: 'Team training: AWS certifications', amount: 3500, category: 'training', date: '2026-02-10', status: 'approved', receipt: true, approvedBy: 'Admin' },
    { id: 'exp3', description: 'Client site visit — travel', amount: 450, category: 'travel', date: '2026-02-20', companyId: 'comp3', status: 'pending', receipt: true },
    { id: 'exp4', description: 'Pen testing tools license', amount: 800, category: 'software', date: '2026-02-05', projectId: 'proj2', status: 'approved', receipt: true },
    { id: 'exp5', description: 'Subcontractor: CloudOps (40hrs)', amount: 5600, category: 'subcontractor', date: '2026-02-15', companyId: 'comp1', projectId: 'proj1', status: 'approved' },
    { id: 'exp6', description: 'Office supplies', amount: 120, category: 'office', date: '2026-02-18', status: 'rejected' },
];

export const MOCK_COMPLIANCE: ComplianceItem[] = [
    { id: 'comp-1', framework: 'SOC2', control: 'CC6.1', description: 'Logical and Physical Access Controls', status: 'compliant', lastAuditDate: '2026-01-15', assignedTo: 'u1' },
    { id: 'comp-2', framework: 'SOC2', control: 'CC6.2', description: 'System Operations', status: 'compliant', lastAuditDate: '2026-01-15' },
    { id: 'comp-3', framework: 'SOC2', control: 'CC7.1', description: 'Change Management', status: 'in_progress', dueDate: '2026-03-01', assignedTo: 'u2' },
    { id: 'comp-4', framework: 'HIPAA', control: '164.312(a)', description: 'Access Control', status: 'compliant', lastAuditDate: '2025-12-01' },
    { id: 'comp-5', framework: 'HIPAA', control: '164.312(e)', description: 'Transmission Security', status: 'in_progress', dueDate: '2026-03-15' },
    { id: 'comp-6', framework: 'GDPR', control: 'Art. 25', description: 'Data Protection by Design', status: 'non_compliant', dueDate: '2026-04-01', assignedTo: 'u1' },
    { id: 'comp-7', framework: 'GDPR', control: 'Art. 30', description: 'Records of Processing Activities', status: 'in_progress', dueDate: '2026-03-20' },
    { id: 'comp-8', framework: 'ISO27001', control: 'A.9', description: 'Access Control Policy', status: 'compliant', lastAuditDate: '2026-01-20' },
    { id: 'comp-9', framework: 'NIST', control: 'PR.AC-1', description: 'Identity & Access Management', status: 'compliant', lastAuditDate: '2026-02-01' },
    { id: 'comp-10', framework: 'PCI-DSS', control: 'Req 3', description: 'Protect Stored Cardholder Data', status: 'not_applicable' },
];

// ====== ROUND 3 MOCK DATA ======

export const MOCK_INVOICES: Invoice[] = [
    {
        id: 'inv-1', invoiceNumber: 'INV-2026-001', companyId: 'comp1', issueDate: '2026-02-01', dueDate: '2026-03-01', status: 'sent',
        items: [
            { id: 'ii1', description: 'Cloud Migration (Phase 1)', quantity: 1, rate: 15000, amount: 15000 },
            { id: 'ii2', description: 'Consulting Hours', quantity: 10, rate: 200, amount: 2000 },
        ],
        subtotal: 17000, tax: 1020, total: 18020, notes: 'Net 30 terms apply.'
    },
    {
        id: 'inv-2', invoiceNumber: 'INV-2026-002', companyId: 'comp2', issueDate: '2026-02-15', dueDate: '2026-03-15', status: 'paid',
        items: [
            { id: 'ii3', description: 'Security Audit', quantity: 1, rate: 8500, amount: 8500 },
        ],
        subtotal: 8500, tax: 510, total: 9010
    }
];

export const MOCK_ORG_CONTACTS: OrgContact[] = [
    { id: 'oc1', companyId: 'comp1', name: 'James Wilson', title: 'CTO', isDecisionMaker: true, department: 'Engineering', email: 'jwilson@acme.com' },
    { id: 'oc2', companyId: 'comp1', name: 'Sarah Miller', title: 'Director of IT', reportsToId: 'oc1', isDecisionMaker: true, department: 'Engineering' },
    { id: 'oc3', companyId: 'comp1', name: 'Mike Ross', title: 'Senior Architect', reportsToId: 'oc2', isDecisionMaker: false, department: 'Engineering' },
    { id: 'oc4', companyId: 'comp1', name: 'Donna Paulsen', title: 'Operations Manager', isDecisionMaker: false, department: 'Operations' },
    { id: 'oc5', companyId: 'comp2', name: 'Tony Stark', title: 'CEO', isDecisionMaker: true, department: 'Executive', email: 'tony@stark.com' },
    { id: 'oc6', companyId: 'comp2', name: 'Pepper Potts', title: 'COO', reportsToId: 'oc5', isDecisionMaker: true, department: 'Executive', email: 'pepper@stark.com' },
];

export const MOCK_ESIGN_REQUESTS: EsignRequest[] = [
    { id: 'es1', documentTitle: 'Master Service Agreement', companyId: 'comp1', sentDate: '2026-02-20', signerEmail: 'jwilson@acme.com', status: 'viewed' },
    { id: 'es2', documentTitle: 'SOW - Azure Migration', companyId: 'comp1', sentDate: '2026-02-25', signerEmail: 'smiller@acme.com', status: 'sent' },
    { id: 'es3', documentTitle: 'Non-Disclosure Agreement', companyId: 'comp2', sentDate: '2026-01-10', signerEmail: 'ceo@stark.com', status: 'signed', completedDate: '2026-01-12' },
];

export const MOCK_ASSETS: Asset[] = [
    { id: 'as1', companyId: 'comp1', name: 'MacBook Pro 16"', type: 'laptop', serialNumber: 'SN-001-XYZ', status: 'deployed', assignedTo: 'John Smith' },
    { id: 'as2', companyId: 'comp1', name: 'Dell PowerEdge R740', type: 'server', status: 'active', value: 12000 },
    { id: 'as3', companyId: 'comp2', name: 'Fortinet Firewall', type: 'networking', status: 'active' },
    { id: 'as4', companyId: 'comp1', name: 'Office 365 E5 (25 seats)', type: 'license', status: 'active', purchaseDate: '2026-01-01' },
];

export const MOCK_FEATURE_REQUESTS: FeatureRequest[] = [
    { id: 'fr1', companyId: 'comp1', title: 'Single Sign-On (SSO) Support', description: 'Integrate with Okta for employee login.', priority: 'high', status: 'planned', voteCount: 15, createdAt: '2026-02-01' },
    { id: 'fr2', companyId: 'comp2', title: 'Dark Mode for Client Portal', description: 'Clients prefer a dark theme.', priority: 'low', status: 'backlog', voteCount: 8, createdAt: '2026-02-10' },
    { id: 'fr3', companyId: 'comp1', title: 'Mobile App for Field Agents', description: 'Need to access data on the go.', priority: 'critical', status: 'in_progress', voteCount: 22, createdAt: '2026-01-15' },
];

export const MOCK_WIKI_PAGES: WikiPage[] = [
    { id: 'wp1', title: 'Cloud Onboarding SOP', content: '# Welcome\nThis SOP covers the steps to onboard a new cloud client...', category: 'sop', author: 'Sarah Chen', lastModified: '2026-02-20' },
    { id: 'wp2', title: 'VPC Connection Guide', content: 'Follow these steps to establish a Site-to-Site VPN...', category: 'technical', author: 'Mike Johnson', lastModified: '2026-02-15' },
    { id: 'wp3', title: 'Acme Corp Special Requirements', content: 'Acme requires all reports in PDF/A format...', category: 'client_specific', companyId: 'comp1', author: 'Sarah Chen', lastModified: '2026-02-18' },
];

export const MOCK_PARTNERS: Partner[] = [
    { id: 'p1', name: 'Microsoft Enterprise', type: 'technology', commissionRate: 15, contactName: 'Steve Ballmer', contactEmail: 'steve@msft.com', totalReferrals: 12, totalPayout: 45000, status: 'active' },
    { id: 'p2', name: 'Global Referrals Ltd', type: 'referral', commissionRate: 5, contactName: 'Alice Green', contactEmail: 'alice@global.co', totalReferrals: 45, totalPayout: 12500, status: 'active' },
    { id: 'p3', name: 'Old Cloud Provider', type: 'technology', commissionRate: 10, contactName: 'Retired Bob', contactEmail: 'bob@oldcloud.com', totalReferrals: 2, totalPayout: 500, status: 'inactive' },
];

export const MOCK_CUSTOM_FIELDS: CustomField[] = [
    { id: 'cf1', label: 'Security Clearance', type: 'dropdown', options: ['None', 'Secret', 'Top Secret'], entity: 'contact' },
    { id: 'cf2', label: 'Implementation Partner', type: 'text', entity: 'project' },
    { id: 'cf3', label: 'Renewal Date', type: 'date', entity: 'company' },
];