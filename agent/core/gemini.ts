import { GoogleGenAI } from '@google/genai';
import { localTools, executeLocalTool } from './tools.js';

const MODEL_NAME = 'gemini-2.5-flash';
const MAX_ITERATIONS = 5;

// The system instruction defines the identity and safety limits of the agent.
const SYSTEM_INSTRUCTION = `
You are Gravity Claw, a lean, secure, and fully understood personal AI agent operating within NeuroLynx. 
You prioritize security, local-first data processing, and user safety.
You have access to long-term memory via SQLite.
Ensure all tasks and responses are concise and direct.
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
