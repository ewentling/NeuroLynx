import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { getOllamaService, OllamaService } from "./ollamaService";

const DEFAULT_MODEL = 'gemini-3-flash-preview';

export const searchWorkspaceDeclaration: FunctionDeclaration = {
  name: 'search_workspace',
  parameters: {
    type: Type.OBJECT,
    description: 'Searches through Gmail, Drive, Docs, and Sheets for specific keywords or timeframes.',
    properties: {
      query: { type: Type.STRING, description: 'The search term' },
      app_filter: { type: Type.STRING, description: 'gmail, docs, sheets, or all' }
    }
  },
};

export class NeuroLynxService {
  private chat: any = null;
  private ai: GoogleGenAI | null = null;
  private ollamaService: OllamaService | null = null;
  private currentConfig: { provider: string, model: string, apiKey: string } | null = null;
  private history: any[] = []; // Manual history for non-Google providers

  constructor() {
      // Lazy init
  }

  // Initialize or Re-initialize the chat session with specific context
  async configure(config: { provider: string, model: string, apiKey: string, systemInstruction?: string }) {
      this.currentConfig = config;
      
      if (config.provider === 'Ollama') {
          // Initialize Ollama service for local LLM
          this.ollamaService = getOllamaService();
          this.ollamaService.configure(config.systemInstruction || SYSTEM_INSTRUCTION);
      } else if (config.provider === 'Google') {
          // Use config key if provided, otherwise fallback to system key.
          const finalApiKey = config.apiKey && config.apiKey.length > 0 ? config.apiKey : process.env.API_KEY;
          
          if (!finalApiKey) {
              console.error("Gemini Init Error: No API Key available in config or env.");
              throw new Error("Missing API Key. Please check your system configuration.");
          }

          this.ai = new GoogleGenAI({ apiKey: finalApiKey });
          this.chat = this.ai.chats.create({
              model: config.model || DEFAULT_MODEL,
              config: {
                  systemInstruction: config.systemInstruction || SYSTEM_INSTRUCTION,
                  // Removed tools for now to prevent empty text responses when model tries to call undefined functions
              }
          });
      } else {
          // Reset for other providers (simulated history)
          this.history = [
              { role: 'system', content: config.systemInstruction || SYSTEM_INSTRUCTION }
          ];
      }
  }

  async sendMessage(text: string, contextData?: string) {
      if (!this.currentConfig) {
          await this.configure({ provider: 'Google', model: DEFAULT_MODEL, apiKey: process.env.API_KEY || '' });
      }

      // Prepend context data to the prompt if provided
      const finalPrompt = contextData ? `[CONTEXTUAL DATA START]\n${contextData}\n[CONTEXTUAL DATA END]\n\nUser Query: ${text}` : text;

      if (this.currentConfig?.provider === 'Ollama' && this.ollamaService) {
          // Use local Ollama for privacy-focused local inference
          // Model format is "ollama:modelname" - extract the actual model name
          const modelName = this.currentConfig.model.startsWith('ollama:') 
              ? this.currentConfig.model.substring(7) 
              : this.currentConfig.model;
          return this.ollamaService.sendMessage(modelName, text, contextData);
      } else if (this.currentConfig?.provider === 'Google' && this.chat) {
          try {
              const response = await this.chat.sendMessage({ message: finalPrompt });
              return { text: response.text };
          } catch (e) {
              console.error("Gemini API Call Error", e);
              throw e;
          }
      } 
      else if (this.currentConfig?.provider === 'OpenAI') {
          // Direct fetch for OpenAI to satisfy "Use selected LLM" requirement
          return this.callOpenAI(finalPrompt);
      }
      else {
          return { text: `[System] The provider ${this.currentConfig?.provider} is not fully integrated yet. Please switch to Ollama, Google Gemini, or OpenAI.` };
      }
  }

  async callOpenAI(prompt: string) {
      if (!this.currentConfig?.apiKey) throw new Error("OpenAI API Key required");
      
      this.history.push({ role: 'user', content: prompt });

      try {
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${this.currentConfig.apiKey}`
              },
              body: JSON.stringify({
                  model: this.currentConfig.model || 'gpt-4o',
                  messages: this.history,
                  temperature: 0.7
              })
          });

          const data = await response.json();
          if (data.error) throw new Error(data.error.message);
          
          const reply = data.choices[0].message.content;
          this.history.push({ role: 'assistant', content: reply });
          return { text: reply };
      } catch (e: any) {
          return { text: `OpenAI Error: ${e.message}` };
      }
  }

  // --- Helper Methods (Keep existing logic using default/system AI instance for background tasks) ---

  private getSystemAI() {
      // Always uses system key for background processing
      return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async draftContractTerms(clientName: string, items: {name: string, quantity: number, billing: string}[]) {
      // ... (Existing implementation) ...
      // Using a fresh instance to ensure background tasks work regardless of chat state
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Draft Terms for ${clientName} covering: ${JSON.stringify(items)}. Return ONLY the legal text.`;
      const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt
      });
      return response.text;
  }

  async generateEmailDraft(recipientName: string, topic: string, tone: string, keyPoints: string) {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Draft a professional email to ${recipientName} regarding "${topic}".
      Tone: ${tone}
      Key Points to include: ${keyPoints}
      
      Return ONLY the email body content. Do not include subject line or placeholders like [Your Name].`;
      
      try {
          const response = await ai.models.generateContent({
              model: 'gemini-3-flash-preview',
              contents: prompt
          });
          return response.text;
      } catch (error) {
          console.error("Error generating email draft:", error);
          throw error;
      }
  }
}