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

const MAX_HISTORY_TURNS = 20; // Limit conversation history to prevent prompt growth

export class OllamaService {
    private baseUrl: string;
    private history: { role: string; content: string }[] = [];
    private systemPrompt: string = '';

    constructor(baseUrl: string = 'http://localhost:11434') {
        this.baseUrl = baseUrl;
    }

    /**
     * Create an AbortSignal that times out after the given number of milliseconds.
     * Uses AbortSignal.timeout when available, and falls back to AbortController + setTimeout.
     */
    private createTimeoutSignal(timeoutMs: number): AbortSignal | undefined {
        // Prefer native AbortSignal.timeout if available
        if (typeof AbortSignal !== 'undefined' && 'timeout' in AbortSignal) {
            return (AbortSignal as any).timeout(timeoutMs);
        }

        // Fallback for environments without AbortSignal.timeout
        if (typeof AbortController !== 'undefined') {
            const controller = new AbortController();
            setTimeout(() => controller.abort(), timeoutMs);
            return controller.signal;
        }

        // As a last resort, return undefined and perform the request without a timeout
        return undefined;
    }

    /**
     * Check if Ollama is running and get its status
     */
    async checkStatus(): Promise<OllamaStatus> {
        try {
            const timeoutSignal = this.createTimeoutSignal(3000); // 3 second timeout

            // Check if Ollama is responding
            const response = await fetch(`${this.baseUrl}/api/version`, {
                method: 'GET',
                ...(timeoutSignal ? { signal: timeoutSignal } : {})
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
            const timeoutSignal = this.createTimeoutSignal(5000);
            const response = await fetch(`${this.baseUrl}/api/tags`, {
                method: 'GET',
                ...(timeoutSignal ? { signal: timeoutSignal } : {})
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
        // Build the full prompt with context for this request only
        const fullPrompt = contextData 
            ? `[CONTEXTUAL DATA START]\n${contextData}\n[CONTEXTUAL DATA END]\n\nUser Query: ${prompt}` 
            : prompt;

        // Store only the raw user prompt in history (not the contextual wrapper)
        // to prevent rapid prompt growth
        this.history.push({ role: 'user', content: prompt });

        // Trim history to prevent unbounded growth (keep last N turns)
        if (this.history.length > MAX_HISTORY_TURNS * 2) {
            this.history = this.history.slice(-MAX_HISTORY_TURNS * 2);
        }

        // Build messages for this request with full context only for the current message
        const messagesForRequest = [
            ...(this.systemPrompt ? [{ role: 'system', content: this.systemPrompt }] : []),
            ...this.history.slice(0, -1), // Previous history (raw prompts)
            { role: 'user', content: fullPrompt } // Current message with context
        ];

        try {
            const response = await fetch(`${this.baseUrl}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: model,
                    messages: messagesForRequest,
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
