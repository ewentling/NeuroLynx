import { memoryManager } from './memory.js';

// Setup basic tools that the agent can use
// We are hardcoding the memory tools; MCP tools will be injected on run.
export const localTools = [
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
    }
];

export async function executeLocalTool(call: any): Promise<any> {
    const { name, args } = call;

    if (name === 'save_memory') {
        memoryManager.addMemory(args.text, args.type);
        return { success: true, message: `Saved to memory successfully.` };
    }

    if (name === 'search_memories') {
        const results = memoryManager.searchMemories(args.query);
        return { success: true, results };
    }

    throw new Error(`Tool ${name} not found in local tools.`);
}
