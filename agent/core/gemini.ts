import { GoogleGenAI } from '@google/genai';
import { localTools, executeLocalTool } from './tools.js';

const MODEL_NAME = 'gemini-2.5-flash';
const MAX_ITERATIONS = 5;

// The system instruction defines the identity and safety limits of the agent.
const SYSTEM_INSTRUCTION = `
You are Gravity Claw, a lean, secure, and fully understood personal AI agent operating within NeuroLynx. 
You prioritize security, local-first data processing, and user safety.

**CORE CAPABILITIES (30 Business Skills):**

*Memory & Task Management:*
1. save_memory / search_memories - Persistent long-term memory via SQLite
2. create_task / list_tasks - Create and manage tasks with priorities
3. create_meeting_summary - Generate structured meeting summaries
4. schedule_followup - Schedule follow-up actions for clients
5. log_activity - Log calls, emails, meetings, notes, and deal updates

*Sales & Pipeline:*
6. calculate_deal_value - Calculate pipeline values and revenue projections
7. evaluate_lead_score - Score and grade leads based on multiple factors
8. update_deal_stage - Move deals through pipeline stages
9. create_quote - Generate price quotes and proposals
10. competitor_analysis - Retrieve battle card and competitive intelligence

*Client & Communication:*
11. generate_email_draft - Draft professional business emails
12. analyze_client_history - Get client insights and recommendations
13. manage_email_sequence - Manage automated email nurture sequences
14. calculate_csat_score - Calculate customer satisfaction scores and trends
15. create_feature_request - Log client feature requests for roadmap

*Finance & Billing:*
16. create_invoice_draft - Create invoice drafts with line items
17. track_time_entry - Log billable and non-billable hours
18. create_expense - Track business expenses for reimbursement
19. manage_contract - Create, activate, or terminate contracts
20. calculate_project_budget - Analyze project budget vs actual spending

*Operations & Projects:*
21. check_deadlines - Check upcoming deadlines, due dates, and SLAs
22. manage_project_milestone - Create and track project milestones
23. create_support_ticket - Create support tickets with SLA tracking
24. search_knowledge_base - Search internal wiki and documentation
25. find_vendor - Search for vendors by skills, rate, and rating

*Business Development:*
26. track_referral - Track referral leads and conversions
27. update_kpi_progress - Update KPI goals and track progress
28. manage_partner - Manage partner and affiliate relationships
29. check_compliance_status - Check regulatory compliance status
30. generate_report - Generate business reports (pipeline, revenue, activity)

**OPERATIONAL GUIDELINES:**
- Ensure all tasks and responses are concise and direct.
- Proactively use your tools to accomplish business tasks efficiently.
- When creating quotes, invoices, or tasks, always confirm key details with the user.
- Prioritize data accuracy and user privacy in all operations.
`;

export class GeminiAgent {
    private history: any[] = [];

    // Reset conversation history
    public reset() {
        this.history = [];
    }

    public async runAgentLoop(prompt: string, mcpTools: any[] = []): Promise<string> {
        if (!process.env.GEMINI_API_KEY) {
            return "Error: GEMINI_API_KEY is not set in the environment. Please add it to your .env file.";
        }
        const ai = new GoogleGenAI({});

        let iterations = 0;

        // Add the new user prompt to the history
        this.history.push({
            role: 'user',
            parts: [{ text: prompt }]
        });

        // Combine local tools with any dynamically loaded MCP tools
        const allTools = [...localTools, ...mcpTools];

        while (iterations < MAX_ITERATIONS) {
            iterations++;

            try {
                // Call the Gemini model
                const response = await ai.models.generateContent({
                    model: MODEL_NAME,
                    contents: this.history,
                    config: {
                        systemInstruction: SYSTEM_INSTRUCTION,
                        tools: [{ functionDeclarations: allTools }],
                        temperature: 0.1, // Keep the agent focused and deterministic
                    }
                });

                // Check for function calls
                if (response.functionCalls && response.functionCalls.length > 0) {
                    // Record the model's function call in history
                    this.history.push({
                        role: 'model',
                        parts: response.functionCalls.map(call => ({
                            functionCall: call
                        }))
                    });

                    // Execute all function calls requested by the model
                    const functionResponses = [];
                    for (const call of response.functionCalls) {
                        const { name, args } = call;

                        let result;
                        try {
                            // Check if it's a local tool
                            if (localTools.some(t => t.name === name)) {
                                result = await executeLocalTool(call);
                            } else {
                                // TODO: Route to MCP executing client
                                result = { error: `Tool ${name} handled by external MCP not fully implemented in local stub yet.` };
                            }
                        } catch (e: any) {
                            result = { error: e.message };
                        }

                        functionResponses.push({
                            name,
                            response: result
                        });
                    }

                    // Add the function responses back to the history for the model to see
                    this.history.push({
                        role: 'user',
                        parts: functionResponses.map(r => ({
                            functionResponse: r
                        }))
                    });

                    // Loop continues so the model can process the tool results
                    continue;
                }

                // If no function calls, the model has provided its final answer
                const replyText = response.text || '';
                this.history.push({
                    role: 'model',
                    parts: [{ text: replyText }]
                });

                return replyText;

            } catch (error: any) {
                console.error("Gemini Agent Error:", error);
                return `Error processing request: ${error.message}`;
            }
        }

        return "Error: Maximum agentic loop iterations reached. Stopping to prevent runaway execution.";
    }
}
