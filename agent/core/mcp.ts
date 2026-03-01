import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

/**
 * Initializes a connection to an external MCP server via stdio.
 * This is meant to demonstrate how Gravity Claw securely communicates with
 * local tool servers without exposing any web ports.
 */
export async function connectToMCPServer(command: string, args: string[]): Promise<Client> {
    const transport = new StdioClientTransport({
        command,
        args,
        env: process.env
    });

    const client = new Client(
        {
            name: "GravityClaw-Agent",
            version: "1.0.0",
        },
        {
            capabilities: {
                tools: {} // we request tools from the server
            }
        }
    );

    // Provide safety hooks or required prompts before tool execution here if needed
    // based on MCP protocols.
    await client.connect(transport);
    return client;
}

/**
 * Translates MCP tools into Gemini-compatible function declarations.
 */
export async function getMCPGeminiTools(client: Client) {
    const response = await client.listTools();
    const tools = response.tools.map(t => ({
        name: t.name,
        description: t.description || '',
        parameters: t.inputSchema || {}
    }));
    return tools;
}

export async function executeMCPTool(client: Client, name: string, args: any) {
    return await client.callTool({
        name,
        arguments: args
    });
}
