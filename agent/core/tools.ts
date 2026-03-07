import { memoryManager } from './memory.js';

// Setup basic tools that the agent can use
// We are hardcoding the memory tools; MCP tools will be injected on run.
export const localTools = [
    // ============ MEMORY TOOLS ============
    {
        name: 'save_memory',
        description: 'Saves important information to the long-term memory for later retrieval.',
        parameters: {
            type: 'object',
            properties: {
                text: { type: 'string', description: 'The text to remember.' },
                type: { type: 'string', description: 'The category of this memory (e.g., preference, fact, task).' }
            },
            required: ['text', 'type']
        }
    },
    {
        name: 'search_memories',
        description: 'Searches the user\'s long-term memory for past context.',
        parameters: {
            type: 'object',
            properties: {
                query: { type: 'string', description: 'The search query.' }
            },
            required: ['query']
        }
    },

    // ============ BUSINESS SKILLS ============

    // 1. Task Management
    {
        name: 'create_task',
        description: 'Creates a new task or to-do item for tracking business activities.',
        parameters: {
            type: 'object',
            properties: {
                title: { type: 'string', description: 'The title of the task.' },
                description: { type: 'string', description: 'Detailed description of the task.' },
                priority: { type: 'string', enum: ['low', 'medium', 'high'], description: 'Priority level of the task.' },
                dueDate: { type: 'string', description: 'Due date in ISO format (YYYY-MM-DD).' },
                clientId: { type: 'string', description: 'Optional client/company ID to associate the task with.' }
            },
            required: ['title', 'priority']
        }
    },

    // 2. List Tasks
    {
        name: 'list_tasks',
        description: 'Lists and filters tasks based on status, priority, or client.',
        parameters: {
            type: 'object',
            properties: {
                status: { type: 'string', enum: ['todo', 'in_progress', 'done', 'all'], description: 'Filter tasks by status.' },
                priority: { type: 'string', enum: ['low', 'medium', 'high', 'all'], description: 'Filter tasks by priority.' },
                clientId: { type: 'string', description: 'Filter tasks by client/company ID.' }
            },
            required: []
        }
    },

    // 3. Meeting Summary
    {
        name: 'create_meeting_summary',
        description: 'Creates a structured meeting summary with action items and key decisions.',
        parameters: {
            type: 'object',
            properties: {
                title: { type: 'string', description: 'Title of the meeting.' },
                attendees: { type: 'string', description: 'Comma-separated list of attendees.' },
                notes: { type: 'string', description: 'Raw meeting notes or transcript.' },
                clientId: { type: 'string', description: 'Client/company ID if applicable.' }
            },
            required: ['title', 'notes']
        }
    },

    // 4. Schedule Follow-up
    {
        name: 'schedule_followup',
        description: 'Schedules a follow-up action for a client or deal.',
        parameters: {
            type: 'object',
            properties: {
                type: { type: 'string', enum: ['call', 'email', 'meeting', 'task'], description: 'Type of follow-up action.' },
                subject: { type: 'string', description: 'Subject or purpose of the follow-up.' },
                date: { type: 'string', description: 'Scheduled date in ISO format (YYYY-MM-DD).' },
                clientId: { type: 'string', description: 'Client/company ID for the follow-up.' },
                notes: { type: 'string', description: 'Additional notes for the follow-up.' }
            },
            required: ['type', 'subject', 'date']
        }
    },

    // 5. Calculate Deal Value
    {
        name: 'calculate_deal_value',
        description: 'Calculates total deal value, weighted pipeline, and revenue projections.',
        parameters: {
            type: 'object',
            properties: {
                deals: { type: 'string', description: 'JSON array of deals with value and probability fields, or "all" to calculate entire pipeline.' },
                includeWeighted: { type: 'boolean', description: 'Whether to include probability-weighted values.' }
            },
            required: ['deals']
        }
    },

    // 6. Generate Email Draft
    {
        name: 'generate_email_draft',
        description: 'Generates a professional business email draft.',
        parameters: {
            type: 'object',
            properties: {
                templateType: { type: 'string', enum: ['followup', 'proposal', 'introduction', 'thankyou', 'reminder', 'custom'], description: 'Type of email template.' },
                recipientName: { type: 'string', description: 'Name of the recipient.' },
                recipientCompany: { type: 'string', description: 'Company of the recipient.' },
                subject: { type: 'string', description: 'Email subject line.' },
                keyPoints: { type: 'string', description: 'Key points to include in the email.' },
                tone: { type: 'string', enum: ['formal', 'friendly', 'urgent'], description: 'Tone of the email.' }
            },
            required: ['templateType', 'recipientName', 'keyPoints']
        }
    },

    // 7. Analyze Client History
    {
        name: 'analyze_client_history',
        description: 'Analyzes client interaction history and provides insights.',
        parameters: {
            type: 'object',
            properties: {
                clientId: { type: 'string', description: 'Client/company ID to analyze.' },
                timeframe: { type: 'string', enum: ['30days', '90days', '1year', 'all'], description: 'Timeframe for analysis.' },
                includeRecommendations: { type: 'boolean', description: 'Whether to include actionable recommendations.' }
            },
            required: ['clientId']
        }
    },

    // 8. Create Invoice Draft
    {
        name: 'create_invoice_draft',
        description: 'Creates a draft invoice for billing a client.',
        parameters: {
            type: 'object',
            properties: {
                clientId: { type: 'string', description: 'Client/company ID to bill.' },
                items: { type: 'string', description: 'JSON array of line items with description, quantity, and rate.' },
                dueDate: { type: 'string', description: 'Payment due date in ISO format.' },
                notes: { type: 'string', description: 'Additional notes for the invoice.' },
                taxRate: { type: 'number', description: 'Tax rate percentage (e.g., 8.5 for 8.5%).' }
            },
            required: ['clientId', 'items']
        }
    },

    // 9. Track Time Entry
    {
        name: 'track_time_entry',
        description: 'Logs a billable or non-billable time entry for tracking work.',
        parameters: {
            type: 'object',
            properties: {
                description: { type: 'string', description: 'Description of the work performed.' },
                hours: { type: 'number', description: 'Number of hours worked.' },
                date: { type: 'string', description: 'Date of work in ISO format (YYYY-MM-DD).' },
                clientId: { type: 'string', description: 'Client/company ID if applicable.' },
                projectId: { type: 'string', description: 'Project ID if applicable.' },
                billable: { type: 'boolean', description: 'Whether this time is billable.' },
                rate: { type: 'number', description: 'Hourly rate if billable.' }
            },
            required: ['description', 'hours', 'date']
        }
    },

    // 10. Generate Report
    {
        name: 'generate_report',
        description: 'Generates business reports such as sales pipeline, revenue, or activity summaries.',
        parameters: {
            type: 'object',
            properties: {
                reportType: { type: 'string', enum: ['pipeline', 'revenue', 'activity', 'client_summary', 'time_tracking', 'forecast'], description: 'Type of report to generate.' },
                timeframe: { type: 'string', enum: ['weekly', 'monthly', 'quarterly', 'yearly', 'custom'], description: 'Time period for the report.' },
                clientId: { type: 'string', description: 'Filter report by specific client/company.' },
                format: { type: 'string', enum: ['summary', 'detailed', 'executive'], description: 'Level of detail in the report.' }
            },
            required: ['reportType', 'timeframe']
        }
    },

    // 11. Evaluate Lead Score
    {
        name: 'evaluate_lead_score',
        description: 'Evaluates and calculates a lead score based on company attributes and engagement.',
        parameters: {
            type: 'object',
            properties: {
                companyId: { type: 'string', description: 'Company ID to evaluate.' },
                factors: { type: 'string', description: 'JSON object with scoring factors: revenue, engagement, industry_fit, decision_timeline.' },
                recalculate: { type: 'boolean', description: 'Force recalculation of existing score.' }
            },
            required: ['companyId']
        }
    },

    // 12. Create Quote
    {
        name: 'create_quote',
        description: 'Creates a price quote or proposal for a potential client.',
        parameters: {
            type: 'object',
            properties: {
                clientId: { type: 'string', description: 'Client/company ID for the quote.' },
                title: { type: 'string', description: 'Title of the quote/proposal.' },
                items: { type: 'string', description: 'JSON array of products/services with name, quantity, and unit price.' },
                discount: { type: 'number', description: 'Discount percentage to apply.' },
                validDays: { type: 'number', description: 'Number of days the quote is valid.' },
                notes: { type: 'string', description: 'Additional terms or notes.' }
            },
            required: ['clientId', 'title', 'items']
        }
    },

    // 13. Log Activity
    {
        name: 'log_activity',
        description: 'Logs a business activity such as a call, email, meeting, or note.',
        parameters: {
            type: 'object',
            properties: {
                activityType: { type: 'string', enum: ['call', 'email', 'meeting', 'note', 'deal_update'], description: 'Type of activity.' },
                title: { type: 'string', description: 'Title or subject of the activity.' },
                description: { type: 'string', description: 'Details about the activity.' },
                clientId: { type: 'string', description: 'Client/company ID associated with the activity.' },
                outcome: { type: 'string', description: 'Outcome or result of the activity.' }
            },
            required: ['activityType', 'title', 'description']
        }
    },

    // 14. Check Deadlines
    {
        name: 'check_deadlines',
        description: 'Checks and lists upcoming deadlines, due dates, and SLA timelines.',
        parameters: {
            type: 'object',
            properties: {
                scope: { type: 'string', enum: ['tasks', 'contracts', 'invoices', 'tickets', 'all'], description: 'What type of deadlines to check.' },
                daysAhead: { type: 'number', description: 'Number of days to look ahead (default: 7).' },
                priority: { type: 'string', enum: ['critical', 'high', 'all'], description: 'Filter by priority level.' }
            },
            required: ['scope']
        }
    },

    // 15. Competitor Analysis
    {
        name: 'competitor_analysis',
        description: 'Retrieves competitive intelligence and battle card information.',
        parameters: {
            type: 'object',
            properties: {
                competitorName: { type: 'string', description: 'Name of the competitor to analyze.' },
                infoType: { type: 'string', enum: ['strengths', 'weaknesses', 'differentiators', 'objections', 'pricing', 'full'], description: 'Type of competitive information needed.' },
                context: { type: 'string', description: 'Sales context or situation for tailored insights.' }
            },
            required: ['competitorName']
        }
    }
];

// Helper to generate unique IDs
function generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Helper to format dates
function formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
}

export async function executeLocalTool(call: any): Promise<any> {
    const { name, args } = call;

    // ============ MEMORY TOOLS ============
    if (name === 'save_memory') {
        memoryManager.addMemory(args.text, args.type);
        return { success: true, message: `Saved to memory successfully.` };
    }

    if (name === 'search_memories') {
        const results = memoryManager.searchMemories(args.query);
        return { success: true, results };
    }

    // ============ BUSINESS SKILLS ============

    // 1. Create Task
    if (name === 'create_task') {
        const task = {
            id: generateId('task'),
            title: args.title,
            description: args.description || '',
            priority: args.priority,
            status: 'todo',
            dueDate: args.dueDate || null,
            clientId: args.clientId || null,
            createdAt: new Date().toISOString()
        };
        // Store task in memory for persistence
        memoryManager.addMemory(JSON.stringify(task), 'task');
        return { 
            success: true, 
            message: `Task "${args.title}" created successfully.`,
            task 
        };
    }

    // 2. List Tasks
    if (name === 'list_tasks') {
        const allTasks = memoryManager.searchMemories('task');
        let tasks = allTasks.map(m => {
            try { return JSON.parse(m.text); } catch { return null; }
        }).filter(t => t !== null);

        // Apply filters
        if (args.status && args.status !== 'all') {
            tasks = tasks.filter(t => t.status === args.status);
        }
        if (args.priority && args.priority !== 'all') {
            tasks = tasks.filter(t => t.priority === args.priority);
        }
        if (args.clientId) {
            tasks = tasks.filter(t => t.clientId === args.clientId);
        }

        return { 
            success: true, 
            count: tasks.length,
            tasks 
        };
    }

    // 3. Create Meeting Summary
    if (name === 'create_meeting_summary') {
        const summary = {
            id: generateId('meeting'),
            title: args.title,
            attendees: args.attendees ? args.attendees.split(',').map((a: string) => a.trim()) : [],
            notes: args.notes,
            clientId: args.clientId || null,
            createdAt: new Date().toISOString(),
            // AI would typically generate these, returning structure for now
            actionItems: [],
            keyDecisions: [],
            nextSteps: []
        };
        memoryManager.addMemory(JSON.stringify(summary), 'meeting_summary');
        return { 
            success: true, 
            message: `Meeting summary for "${args.title}" created.`,
            summary 
        };
    }

    // 4. Schedule Follow-up
    if (name === 'schedule_followup') {
        const followup = {
            id: generateId('followup'),
            type: args.type,
            subject: args.subject,
            date: args.date,
            clientId: args.clientId || null,
            notes: args.notes || '',
            status: 'scheduled',
            createdAt: new Date().toISOString()
        };
        memoryManager.addMemory(JSON.stringify(followup), 'followup');
        return { 
            success: true, 
            message: `${args.type} follow-up "${args.subject}" scheduled for ${args.date}.`,
            followup 
        };
    }

    // 5. Calculate Deal Value
    if (name === 'calculate_deal_value') {
        let deals: Array<{ value: number; probability: number }>;
        
        if (args.deals === 'all') {
            // In a real implementation, this would fetch from database
            deals = [
                { value: 50000, probability: 80 },
                { value: 75000, probability: 60 },
                { value: 120000, probability: 40 }
            ];
        } else {
            try {
                deals = JSON.parse(args.deals);
            } catch {
                return { success: false, error: 'Invalid deals JSON format.' };
            }
        }

        const totalValue = deals.reduce((sum, d) => sum + d.value, 0);
        const weightedValue = args.includeWeighted 
            ? deals.reduce((sum, d) => sum + (d.value * d.probability / 100), 0)
            : null;

        const dealCount = deals.length;
        return { 
            success: true, 
            totalValue,
            weightedValue,
            dealCount,
            averageDealSize: dealCount > 0 ? totalValue / dealCount : 0
        };
    }

    // 6. Generate Email Draft
    if (name === 'generate_email_draft') {
        const templates: Record<string, string> = {
            followup: `Following up on our recent conversation about`,
            proposal: `I'm pleased to present our proposal for`,
            introduction: `I wanted to introduce myself and share how we can help`,
            thankyou: `Thank you for taking the time to meet with us regarding`,
            reminder: `This is a friendly reminder about`,
            custom: ''
        };

        const draft = {
            id: generateId('email'),
            to: args.recipientName,
            company: args.recipientCompany || '',
            subject: args.subject || `${args.templateType.charAt(0).toUpperCase() + args.templateType.slice(1)} - ${args.recipientCompany || 'Our Discussion'}`,
            body: `Dear ${args.recipientName},\n\n${templates[args.templateType]} ${args.keyPoints}.\n\nBest regards`,
            tone: args.tone || 'formal',
            createdAt: new Date().toISOString()
        };

        return { 
            success: true, 
            message: `Email draft created for ${args.recipientName}.`,
            draft 
        };
    }

    // 7. Analyze Client History
    if (name === 'analyze_client_history') {
        // In production, this would query actual client data
        const analysis = {
            clientId: args.clientId,
            timeframe: args.timeframe || 'all',
            metrics: {
                totalInteractions: 24,
                lastContact: formatDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
                averageResponseTime: '2.3 days',
                dealsClosed: 3,
                totalRevenue: 125000,
                openOpportunities: 2
            },
            recommendations: args.includeRecommendations ? [
                'Schedule quarterly business review',
                'Explore upsell opportunity for additional services',
                'Request referral based on positive relationship'
            ] : []
        };

        return { 
            success: true, 
            analysis 
        };
    }

    // 8. Create Invoice Draft
    if (name === 'create_invoice_draft') {
        let items: Array<{ description: string; quantity: number; rate: number }>;
        try {
            items = JSON.parse(args.items);
        } catch {
            return { success: false, error: 'Invalid items JSON format.' };
        }

        const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
        const taxAmount = args.taxRate ? subtotal * (args.taxRate / 100) : 0;
        const total = subtotal + taxAmount;

        const invoice = {
            id: generateId('inv'),
            invoiceNumber: `INV-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`,
            clientId: args.clientId,
            items,
            subtotal,
            taxRate: args.taxRate || 0,
            taxAmount,
            total,
            dueDate: args.dueDate || formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
            notes: args.notes || '',
            status: 'draft',
            createdAt: new Date().toISOString()
        };

        memoryManager.addMemory(JSON.stringify(invoice), 'invoice');
        return { 
            success: true, 
            message: `Invoice ${invoice.invoiceNumber} created for $${total.toFixed(2)}.`,
            invoice 
        };
    }

    // 9. Track Time Entry
    if (name === 'track_time_entry') {
        const isBillable = args.billable !== false;
        const hourlyRate = args.rate || 0;
        const entry = {
            id: generateId('time'),
            description: args.description,
            hours: args.hours,
            date: args.date,
            clientId: args.clientId || null,
            projectId: args.projectId || null,
            billable: isBillable,
            rate: hourlyRate,
            totalValue: isBillable ? args.hours * hourlyRate : 0,
            createdAt: new Date().toISOString()
        };

        memoryManager.addMemory(JSON.stringify(entry), 'time_entry');
        return { 
            success: true, 
            message: `Logged ${args.hours} hours for "${args.description}".`,
            entry 
        };
    }

    // 10. Generate Report
    if (name === 'generate_report') {
        const reportData: Record<string, any> = {
            pipeline: {
                title: 'Sales Pipeline Report',
                totalDeals: 12,
                totalValue: 450000,
                weightedValue: 285000,
                byStage: {
                    qualification: { count: 4, value: 120000 },
                    proposal: { count: 3, value: 150000 },
                    negotiation: { count: 3, value: 130000 },
                    closed_won: { count: 2, value: 50000 }
                }
            },
            revenue: {
                title: 'Revenue Report',
                totalRevenue: 325000,
                recurringRevenue: 180000,
                oneTimeRevenue: 145000,
                growth: '+15%'
            },
            activity: {
                title: 'Activity Summary',
                calls: 45,
                emails: 128,
                meetings: 23,
                tasksCompleted: 67
            },
            client_summary: {
                title: 'Client Summary',
                activeClients: 24,
                newClients: 5,
                churnedClients: 1,
                averageContractValue: 48000
            },
            time_tracking: {
                title: 'Time Tracking Summary',
                totalHours: 160,
                billableHours: 128,
                utilization: '80%',
                billableRevenue: 19200
            },
            forecast: {
                title: 'Revenue Forecast',
                currentQuarter: 325000,
                nextQuarter: 380000,
                projectedGrowth: '+17%',
                confidence: 'high'
            }
        };

        const report = {
            id: generateId('report'),
            ...reportData[args.reportType] || { title: 'Custom Report', data: {} },
            timeframe: args.timeframe,
            format: args.format || 'summary',
            clientId: args.clientId || null,
            generatedAt: new Date().toISOString()
        };

        return { 
            success: true, 
            report 
        };
    }

    // 11. Evaluate Lead Score
    if (name === 'evaluate_lead_score') {
        let factors = { revenue: 50, engagement: 70, industry_fit: 80, decision_timeline: 60 };
        
        if (args.factors) {
            try {
                factors = { ...factors, ...JSON.parse(args.factors) };
            } catch {
                // Use defaults if parsing fails
            }
        }

        // Calculate weighted score
        const weights = { revenue: 0.3, engagement: 0.25, industry_fit: 0.25, decision_timeline: 0.2 };
        const score = Math.round(
            factors.revenue * weights.revenue +
            factors.engagement * weights.engagement +
            factors.industry_fit * weights.industry_fit +
            factors.decision_timeline * weights.decision_timeline
        );

        const evaluation = {
            companyId: args.companyId,
            score,
            grade: score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : 'D',
            factors,
            recommendation: score >= 70 ? 'High priority - pursue actively' : 
                           score >= 50 ? 'Medium priority - nurture relationship' :
                           'Low priority - qualify further',
            evaluatedAt: new Date().toISOString()
        };

        return { 
            success: true, 
            evaluation 
        };
    }

    // 12. Create Quote
    if (name === 'create_quote') {
        let items: Array<{ name: string; quantity: number; unitPrice: number }>;
        try {
            items = JSON.parse(args.items);
        } catch {
            return { success: false, error: 'Invalid items JSON format.' };
        }

        const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
        const discountAmount = args.discount ? subtotal * (args.discount / 100) : 0;
        const total = subtotal - discountAmount;

        const validUntil = new Date();
        validUntil.setDate(validUntil.getDate() + (args.validDays || 30));

        const quote = {
            id: generateId('quote'),
            clientId: args.clientId,
            title: args.title,
            items,
            subtotal,
            discount: args.discount || 0,
            discountAmount,
            total,
            validUntil: formatDate(validUntil),
            notes: args.notes || '',
            status: 'draft',
            createdAt: new Date().toISOString()
        };

        memoryManager.addMemory(JSON.stringify(quote), 'quote');
        return { 
            success: true, 
            message: `Quote "${args.title}" created for $${total.toFixed(2)}.`,
            quote 
        };
    }

    // 13. Log Activity
    if (name === 'log_activity') {
        const activity = {
            id: generateId('activity'),
            type: args.activityType,
            title: args.title,
            description: args.description,
            clientId: args.clientId || null,
            outcome: args.outcome || '',
            timestamp: new Date().toISOString()
        };

        memoryManager.addMemory(JSON.stringify(activity), 'activity');
        return { 
            success: true, 
            message: `${args.activityType} activity "${args.title}" logged.`,
            activity 
        };
    }

    // 14. Check Deadlines
    if (name === 'check_deadlines') {
        const daysAhead = args.daysAhead || 7;
        const today = new Date();
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + daysAhead);

        // In production, this would query actual deadline data
        const deadlines: Record<string, any[]> = {
            tasks: [
                { id: 't1', title: 'Prepare Q3 Report', dueDate: formatDate(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)), priority: 'high' },
                { id: 't2', title: 'Update Licensing Contract', dueDate: formatDate(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)), priority: 'medium' }
            ],
            contracts: [
                { id: 'c1', title: 'Acme Support Renewal', dueDate: formatDate(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)), priority: 'critical' }
            ],
            invoices: [
                { id: 'inv1', title: 'INV-2026-001', dueDate: formatDate(new Date(Date.now() + 6 * 24 * 60 * 60 * 1000)), amount: 15000, priority: 'high' }
            ],
            tickets: [
                { id: 'tk1', title: 'Critical Security Patch', slaDeadline: formatDate(new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)), priority: 'critical' }
            ]
        };

        let results: any[] = [];
        if (args.scope === 'all') {
            results = [...deadlines.tasks, ...deadlines.contracts, ...deadlines.invoices, ...deadlines.tickets];
        } else {
            results = deadlines[args.scope] || [];
        }

        // Filter by priority if specified
        if (args.priority && args.priority !== 'all') {
            if (args.priority === 'critical') {
                results = results.filter(d => d.priority === 'critical');
            } else if (args.priority === 'high') {
                results = results.filter(d => d.priority === 'critical' || d.priority === 'high');
            }
        }

        // Pre-compute timestamps for efficient sorting
        const sortedDeadlines = results
            .map(item => ({
                ...item,
                _sortTime: new Date(item.dueDate || item.slaDeadline).getTime()
            }))
            .sort((a, b) => a._sortTime - b._sortTime)
            .map(({ _sortTime, ...item }) => item);

        return { 
            success: true, 
            daysAhead,
            count: results.length,
            deadlines: sortedDeadlines
        };
    }

    // 15. Competitor Analysis
    if (name === 'competitor_analysis') {
        // Mock competitor data - in production would come from database
        const competitorData: Record<string, any> = {
            default: {
                name: args.competitorName,
                strengths: ['Strong brand recognition', 'Large customer base', 'Comprehensive feature set'],
                weaknesses: ['Higher pricing', 'Complex implementation', 'Slower support response'],
                differentiators: ['Our AI-first approach', 'Faster time-to-value', 'Superior integrations'],
                objections: [
                    { objection: 'They have more features', response: 'Focus on outcomes, not features - our streamlined approach delivers faster ROI' },
                    { objection: 'They are more established', response: 'Our modern architecture means better performance and lower maintenance costs' }
                ],
                pricing: 'Generally 20-30% higher than our offerings',
                lastUpdated: formatDate(new Date())
            }
        };

        const competitor = competitorData.default;
        let result: any = { name: competitor.name };

        if (args.infoType === 'full' || !args.infoType) {
            result = { ...competitor };
        } else {
            result[args.infoType] = competitor[args.infoType];
        }

        if (args.context) {
            result.contextualAdvice = `For ${args.context}: Lead with our ${competitor.differentiators[0].toLowerCase()} and address any concerns about ${competitor.strengths[0].toLowerCase()} by emphasizing long-term value.`;
        }

        return { 
            success: true, 
            competitorAnalysis: result 
        };
    }

    throw new Error(`Tool ${name} not found in local tools.`);
}
