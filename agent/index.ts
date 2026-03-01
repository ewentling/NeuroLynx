import 'dotenv/config'; // Load environment variables securely from .env first
import { GeminiAgent } from './core/gemini.js';
import * as readline from 'readline';

/**
 * Gravity Claw Agent Interface
 * This is the secure IPC entry point for NeuroLynx. 
 * Instead of exposing a local HTTP server, this script runs via `tsx`
 * and communicates entirely via stdin/stdout.
 */

const agent = new GeminiAgent();
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

// Let the host application know we are ready
console.log(JSON.stringify({ status: 'ready', message: 'Gravity Claw Secure Bridge Initialized' }));

// Listen for incoming messages from the NeuroLynx host app
rl.on('line', async (line) => {
    try {
        const request = JSON.parse(line);

        // Expected format: { command: "prompt"|"reset", text?: string }
        if (request.command === 'reset') {
            agent.reset();
            console.log(JSON.stringify({ type: 'control', status: 'history_cleared' }));
            return;
        }

        if (request.command === 'prompt' && request.text) {
            // Send the prompt to the agent loop.
            // MCP tools could be dynamically loaded here if configured.
            const responseText = await agent.runAgentLoop(request.text, []);

            // Output the response securely back to the host app
            console.log(JSON.stringify({ type: 'reply', text: responseText }));
            return;
        }

        console.log(JSON.stringify({ type: 'error', error: 'Invalid command or missing payload' }));

    } catch (e: any) {
        // If it's not JSON, ignore or log error securely
        console.log(JSON.stringify({ type: 'error', error: `IPC parse failed: ${e.message}` }));
    }
});
