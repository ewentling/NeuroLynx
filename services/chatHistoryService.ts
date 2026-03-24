/**
 * Chat History Service
 * Persists chat messages to localStorage with bounded storage (max 1000 messages)
 */

import { Message } from '../types';

const STORAGE_KEY = 'neurolynx_chat_history';
const MAX_MESSAGES = 1000; // Maximum messages to store to prevent localStorage overflow

export interface ChatHistoryEntry extends Message {
  sessionId?: string;  // Group messages by session
}

export class ChatHistoryService {
  /**
   * Load all chat messages from localStorage
   */
  static loadMessages(): Message[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const messages = JSON.parse(stored) as Message[];
        // Ensure all messages have required fields (use explicit checks for timestamp)
        return messages.filter(m => 
          m.id !== undefined && m.id !== null &&
          m.role !== undefined && m.role !== null &&
          m.content !== undefined && m.content !== null &&
          m.timestamp !== undefined && m.timestamp !== null
        );
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
    return [];
  }

  /**
   * Save a single message to chat history
   */
  static saveMessage(message: Message): void {
    try {
      const messages = this.loadMessages();
      messages.push(message);
      
      // Trim old messages if exceeding limit
      const trimmedMessages = messages.slice(-MAX_MESSAGES);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedMessages));
    } catch (error) {
      console.error('Failed to save chat message:', error);
    }
  }

  /**
   * Save all messages (batch save)
   */
  static saveAllMessages(messages: Message[]): void {
    try {
      const trimmedMessages = messages.slice(-MAX_MESSAGES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedMessages));
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  }

  /**
   * Clear all chat history
   */
  static clearHistory(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  /**
   * Get recent messages for context (useful for LLM context building)
   */
  static getRecentMessages(count: number = 20): Message[] {
    const messages = this.loadMessages();
    return messages.slice(-count);
  }

  /**
   * Search messages by content
   */
  static searchMessages(query: string): Message[] {
    const messages = this.loadMessages();
    const lowerQuery = query.toLowerCase();
    return messages.filter(m => 
      m.content.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get conversation summary for LLM context
   * Returns a condensed history string
   */
  static getConversationContext(maxMessages: number = 10): string {
    const messages = this.getRecentMessages(maxMessages);
    if (messages.length === 0) return '';

    return messages.map(m => {
      const role = m.role === 'user' ? 'User' : 'Assistant';
      const content = m.content.length > 200 
        ? m.content.substring(0, 200) + '...' 
        : m.content;
      return `${role}: ${content}`;
    }).join('\n');
  }

  /**
   * Get message count
   */
  static getMessageCount(): number {
    return this.loadMessages().length;
  }
}

export default ChatHistoryService;
