/**
 * Ollama Service - Local LLM Integration
 * Provides a privacy-focused alternative to cloud LLMs by connecting to locally-running Ollama.
 */

export interface OllamaModel {
    name: string;
    model: string;
    modified_at: string;
    size: number;
    digest: string;
    details?: {
        parent_model?: string;
        format?: string;
        family?: string;
        families?: string[];
        parameter_size?: string;
        quantization_level?: string;
    };
}

export interface OllamaStatus {
    isRunning: boolean;
    version?: string;
    models: OllamaModel[];
    baseUrl: string;
}

export class OllamaService {
    private baseUrl: string;
    private history: { role: string; content: string }[] = [];
    private systemPrompt: string = '';

    constructor(baseUrl: string = 'http://localhost:11434') {
        this.baseUrl = baseUrl;
    }

    /**
     * Check if Ollama is running and get its status
     */
    async checkStatus(): Promise<OllamaStatus> {
        try {
            // Check if Ollama is responding
            const response = await fetch(`${this.baseUrl}/api/version`, {
                method: 'GET',
                signal: AbortSignal.timeout(3000) // 3 second timeout
            });
            
            if (!response.ok) {
                return { isRunning: false, models: [], baseUrl: this.baseUrl };
            }

            const versionData = await response.json();
            
            // Get available models
            const models = await this.listModels();
            
            return {
                isRunning: true,
                version: versionData.version,
                models,
                baseUrl: this.baseUrl
            };
        } catch (error) {
            console.log('Ollama not running or not accessible:', error);
            return { isRunning: false, models: [], baseUrl: this.baseUrl };
        }
    }

    /**
     * List all available models installed in Ollama
     */
    async listModels(): Promise<OllamaModel[]> {
        try {
            const response = await fetch(`${this.baseUrl}/api/tags`, {
                method: 'GET',
                signal: AbortSignal.timeout(5000)
            });
            
            if (!response.ok) {
                console.error('Failed to fetch Ollama models');
                return [];
            }

            const data = await response.json();
            return data.models || [];
        } catch (error) {
            console.error('Error listing Ollama models:', error);
            return [];
        }
    }

    /**
     * Configure the service with a system prompt
     */
    configure(systemPrompt: string): void {
        this.systemPrompt = systemPrompt;
        this.history = [];
    }

    /**
     * Send a message to Ollama and get a response
     */
    async sendMessage(model: string, prompt: string, contextData?: string): Promise<{ text: string }> {
        const fullPrompt = contextData 
            ? `[CONTEXTUAL DATA START]\n${contextData}\n[CONTEXTUAL DATA END]\n\nUser Query: ${prompt}` 
            : prompt;

        // Add user message to history
        this.history.push({ role: 'user', content: fullPrompt });

        try {
            const response = await fetch(`${this.baseUrl}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        ...(this.systemPrompt ? [{ role: 'system', content: this.systemPrompt }] : []),
                        ...this.history
                    ],
                    stream: false
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Ollama API error: ${response.status}`);
            }

            const data = await response.json();
            const assistantMessage = data.message?.content || '';

            // Add assistant response to history
            this.history.push({ role: 'assistant', content: assistantMessage });

            return { text: assistantMessage };
        } catch (error: any) {
            console.error('Ollama API error:', error);
            return { text: `Ollama Error: ${error.message}. Please ensure Ollama is running (ollama serve) and the model is pulled.` };
        }
    }

    /**
     * Generate text without conversation history (one-shot)
     */
    async generate(model: string, prompt: string): Promise<{ text: string }> {
        try {
            const response = await fetch(`${this.baseUrl}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: model,
                    prompt: prompt,
                    stream: false
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Ollama API error: ${response.status}`);
            }

            const data = await response.json();
            return { text: data.response || '' };
        } catch (error: any) {
            console.error('Ollama generate error:', error);
            return { text: `Ollama Error: ${error.message}` };
        }
    }

    /**
     * Clear conversation history
     */
    clearHistory(): void {
        this.history = [];
    }

    /**
     * Get the base URL
     */
    getBaseUrl(): string {
        return this.baseUrl;
    }

    /**
     * Set a new base URL (for custom Ollama installations)
     */
    setBaseUrl(url: string): void {
        this.baseUrl = url;
    }
}

// Singleton instance for app-wide use
let ollamaServiceInstance: OllamaService | null = null;

export function getOllamaService(baseUrl?: string): OllamaService {
    if (!ollamaServiceInstance) {
        ollamaServiceInstance = new OllamaService(baseUrl);
    } else if (baseUrl && baseUrl !== ollamaServiceInstance.getBaseUrl()) {
        ollamaServiceInstance.setBaseUrl(baseUrl);
    }
    return ollamaServiceInstance;
}

export default OllamaService;
