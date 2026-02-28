
import { GoogleGenAI } from "@google/genai";

export class VectorService {
  private ai: GoogleGenAI;
  private pineconeKey: string;
  private pineconeHost: string;
  private configured: boolean = false;

  constructor(apiKey: string, pineconeKey: string, pineconeHost: string) {
    this.ai = new GoogleGenAI({ apiKey });
    this.pineconeKey = pineconeKey;
    this.pineconeHost = pineconeHost;
    this.configured = !!(apiKey && pineconeKey && pineconeHost);
  }

  isConfigured(): boolean {
    return this.configured;
  }

  private getNamespace(clientId: string | undefined | 'all'): string {
    if (!clientId || clientId === 'internal' || clientId === 'all') {
      return 'neurolynx-internal';
    }
    return `client-${clientId}`;
  }

  // 1. Generate Embedding using Gemini
  async embedText(text: string): Promise<number[]> {
    try {
      const result = await this.ai.models.embedContent({
        model: "text-embedding-004",
        contents: text,
      });
      // The SDK returns an array of embeddings for consistency
      if (result.embeddings && result.embeddings.length > 0) {
        return result.embeddings[0].values;
      }
      throw new Error("No embeddings returned");
    } catch (e) {
      console.error("Embedding Error", e);
      throw new Error("Failed to generate embeddings");
    }
  }

  // 2. Upsert to Pinecone via REST
  async saveMemory(id: string, text: string, clientId?: string) {
    if (!this.configured) {
      console.warn("VectorService: Attempted to save memory while unconfigured.");
      return;
    }

    const vector = await this.embedText(text);
    const namespace = this.getNamespace(clientId);

    const payload = {
      vectors: [
        {
          id: id,
          values: vector,
          metadata: {
            text: text,
            created: new Date().toISOString(),
            clientId: clientId || 'internal'
          }
        }
      ],
      namespace: namespace
    };

    try {
      const response = await fetch(`${this.pineconeHost}/vectors/upsert`, {
        method: 'POST',
        headers: {
          'Api-Key': this.pineconeKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error(`Pinecone Upsert Failed: ${response.statusText}`);
    } catch (e) {
      console.error("Vector Save Error", e);
      throw e;
    }
  }

  // 3. Query Pinecone
  async queryMemory(queryText: string, clientId?: string, topK: number = 3): Promise<string[]> {
    if (!this.configured) {
      console.warn("VectorService: Attempted to query memory while unconfigured.");
      return [];
    }

    const vector = await this.embedText(queryText);
    const namespace = this.getNamespace(clientId);

    const payload = {
      vector: vector,
      topK: topK,
      includeMetadata: true,
      namespace: namespace
    };

    try {
      const response = await fetch(`${this.pineconeHost}/query`, {
        method: 'POST',
        headers: {
          'Api-Key': this.pineconeKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error(`Pinecone Query Failed: ${response.statusText}`);

      const data = await response.json();
      return data.matches.map((m: any) => m.metadata.text);
    } catch (e) {
      console.error("Vector Query Error", e);
      return [];
    }
  }
}
