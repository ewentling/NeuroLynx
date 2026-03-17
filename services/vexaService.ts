/**
 * Vexa Meeting Transcription Service
 * 
 * Integrates with Vexa's API for real-time meeting transcription and bot deployment.
 * Supports Google Meet, Microsoft Teams, and Zoom.
 * 
 * API Documentation: https://api.cloud.vexa.ai
 */

export type VexaPlatform = 'google_meet' | 'ms_teams' | 'zoom';

export interface VexaBotRequest {
    platform: VexaPlatform;
    native_meeting_id: string;
    bot_name?: string;
    webhook_url?: string;
}

export interface VexaBotResponse {
    bot_id: string;
    status: 'deploying' | 'active' | 'ended' | 'error';
    message?: string;
}

export interface VexaTranscriptSegment {
    speaker: string;
    text: string;
    /** Unix timestamp in milliseconds */
    timestamp: number;
    confidence?: number;
}

export interface VexaTranscript {
    meeting_id: string;
    platform: VexaPlatform;
    segments: VexaTranscriptSegment[];
    duration_seconds?: number;
    language?: string;
    status: 'in_progress' | 'completed' | 'error';
}

export interface VexaMeetingSummary {
    summary: string;
    action_items: string[];
    key_topics: string[];
    sentiment?: 'positive' | 'neutral' | 'negative';
}

export class VexaService {
    private apiKey: string;
    private baseUrl: string;
    private wsConnection: WebSocket | null = null;
    private transcriptCallbacks: Map<string, (segment: VexaTranscriptSegment) => void> = new Map();

    constructor(apiKey?: string, baseUrl: string = 'https://api.cloud.vexa.ai') {
        this.apiKey = apiKey || process.env.VEXA_API_KEY || '';
        this.baseUrl = baseUrl;
    }

    /**
     * Set or update the API key
     */
    setApiKey(apiKey: string): void {
        this.apiKey = apiKey;
    }

    /**
     * Check if service is configured with an API key
     */
    isConfigured(): boolean {
        return !!this.apiKey;
    }

    /**
     * Deploy a transcription bot to a meeting
     */
    async deployBot(request: VexaBotRequest): Promise<VexaBotResponse> {
        if (!this.apiKey) {
            throw new Error('Vexa API key not configured');
        }

        try {
            const response = await fetch(`${this.baseUrl}/bots`, {
                method: 'POST',
                headers: {
                    'X-API-Key': this.apiKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    platform: request.platform,
                    native_meeting_id: request.native_meeting_id,
                    bot_name: request.bot_name || 'NeuroLynx Transcription Bot',
                    webhook_url: request.webhook_url
                })
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({ message: 'Unknown error' }));
                throw new Error(error.message || `Failed to deploy bot: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Vexa Deploy Bot Error:', error);
            throw error;
        }
    }

    /**
     * Get the transcript for a meeting
     */
    async getTranscript(platform: VexaPlatform, meetingId: string): Promise<VexaTranscript> {
        if (!this.apiKey) {
            throw new Error('Vexa API key not configured');
        }

        try {
            const response = await fetch(
                `${this.baseUrl}/transcripts/${platform}/${encodeURIComponent(meetingId)}`,
                {
                    method: 'GET',
                    headers: {
                        'X-API-Key': this.apiKey
                    }
                }
            );

            if (!response.ok) {
                const error = await response.json().catch(() => ({ message: 'Unknown error' }));
                throw new Error(error.message || `Failed to get transcript: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Vexa Get Transcript Error:', error);
            throw error;
        }
    }

    /**
     * Stop a running bot
     */
    async stopBot(botId: string): Promise<void> {
        if (!this.apiKey) {
            throw new Error('Vexa API key not configured');
        }

        try {
            const response = await fetch(`${this.baseUrl}/bots/${botId}`, {
                method: 'DELETE',
                headers: {
                    'X-API-Key': this.apiKey
                }
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({ message: 'Unknown error' }));
                throw new Error(error.message || `Failed to stop bot: ${response.status}`);
            }
        } catch (error) {
            console.error('Vexa Stop Bot Error:', error);
            throw error;
        }
    }

    /**
     * Get bot status
     */
    async getBotStatus(botId: string): Promise<VexaBotResponse> {
        if (!this.apiKey) {
            throw new Error('Vexa API key not configured');
        }

        try {
            const response = await fetch(`${this.baseUrl}/bots/${botId}`, {
                method: 'GET',
                headers: {
                    'X-API-Key': this.apiKey
                }
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({ message: 'Unknown error' }));
                throw new Error(error.message || `Failed to get bot status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Vexa Get Bot Status Error:', error);
            throw error;
        }
    }

    /**
     * Subscribe to real-time transcript updates via WebSocket
     */
    subscribeToTranscript(
        platform: VexaPlatform,
        meetingId: string,
        onSegment: (segment: VexaTranscriptSegment) => void,
        onError?: (error: Error) => void
    ): () => void {
        if (!this.apiKey) {
            onError?.(new Error('Vexa API key not configured'));
            return () => {};
        }

        const wsUrl = this.baseUrl.replace('https://', 'wss://').replace('http://', 'ws://');
        const callbackKey = `${platform}:${meetingId}`;
        
        this.transcriptCallbacks.set(callbackKey, onSegment);

        if (!this.wsConnection || this.wsConnection.readyState === WebSocket.CLOSED) {
            this.wsConnection = new WebSocket(`${wsUrl}/ws/transcripts?api_key=${this.apiKey}`);

            this.wsConnection.onopen = () => {
                // Subscribe to the specific meeting
                this.wsConnection?.send(JSON.stringify({
                    action: 'subscribe',
                    platform,
                    meeting_id: meetingId
                }));
            };

            this.wsConnection.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === 'transcript_segment') {
                        const key = `${data.platform}:${data.meeting_id}`;
                        const callback = this.transcriptCallbacks.get(key);
                        if (callback) {
                            callback({
                                speaker: data.speaker,
                                text: data.text,
                                timestamp: data.timestamp,
                                confidence: data.confidence
                            });
                        }
                    }
                } catch (err) {
                    console.error('Vexa WebSocket parse error:', err);
                }
            };

            this.wsConnection.onerror = (event) => {
                console.error('Vexa WebSocket error:', event);
                onError?.(new Error('WebSocket connection error'));
            };

            this.wsConnection.onclose = () => {
                console.log('Vexa WebSocket closed');
            };
        } else {
            // Already connected, just subscribe to the meeting
            this.wsConnection.send(JSON.stringify({
                action: 'subscribe',
                platform,
                meeting_id: meetingId
            }));
        }

        // Return unsubscribe function
        return () => {
            this.transcriptCallbacks.delete(callbackKey);
            if (this.wsConnection && this.wsConnection.readyState === WebSocket.OPEN) {
                this.wsConnection.send(JSON.stringify({
                    action: 'unsubscribe',
                    platform,
                    meeting_id: meetingId
                }));
            }
        };
    }

    /**
     * Close WebSocket connection
     */
    disconnect(): void {
        if (this.wsConnection) {
            this.wsConnection.close();
            this.wsConnection = null;
        }
        this.transcriptCallbacks.clear();
    }

    /**
     * Extract meeting ID from various URL formats
     */
    static extractMeetingId(url: string): { platform: VexaPlatform; meetingId: string } | null {
        // Google Meet: https://meet.google.com/abc-defg-hij
        const gmeetMatch = url.match(/meet\.google\.com\/([a-z]{3}-[a-z]{4}-[a-z]{3})/i);
        if (gmeetMatch) {
            return { platform: 'google_meet', meetingId: gmeetMatch[1] };
        }

        // Microsoft Teams: https://teams.microsoft.com/l/meetup-join/...
        const teamsMatch = url.match(/teams\.microsoft\.com.*meetup-join\/([^\/&?]+)/i);
        if (teamsMatch) {
            return { platform: 'ms_teams', meetingId: decodeURIComponent(teamsMatch[1]) };
        }

        // Zoom: https://zoom.us/j/1234567890
        const zoomMatch = url.match(/zoom\.us\/j\/(\d+)/i);
        if (zoomMatch) {
            return { platform: 'zoom', meetingId: zoomMatch[1] };
        }

        return null;
    }

    /**
     * Format transcript segments into readable text
     */
    static formatTranscript(segments: VexaTranscriptSegment[]): string {
        return segments.map(seg => {
            const time = new Date(seg.timestamp).toLocaleTimeString();
            return `[${time}] ${seg.speaker}: ${seg.text}`;
        }).join('\n');
    }

    /**
     * Get platform display name
     */
    static getPlatformName(platform: VexaPlatform): string {
        const names: Record<VexaPlatform, string> = {
            'google_meet': 'Google Meet',
            'ms_teams': 'Microsoft Teams',
            'zoom': 'Zoom'
        };
        return names[platform] || platform;
    }
}

// Singleton instance for global use
export const vexaService = new VexaService();
