import OpenAI from 'openai';
import { createReadStream } from 'fs';

/**
 * Gravity Claw Transcription Service
 * Exclusively uses OpenAI's Whisper model via their SDK.
 * All other LLM operations are routed through Gemini.
 */

// Initialize the OpenAI client.
// It will automatically pick up OPENAI_API_KEY from the environment.
const openai = new OpenAI();

export async function transcribeAudio(filePath: string): Promise<string> {
    try {
        const transcription = await openai.audio.transcriptions.create({
            file: createReadStream(filePath),
            model: 'whisper-1',
            response_format: 'text',
        });

        return transcription as unknown as string; // SDK returns string for 'text' format
    } catch (error) {
        console.error("Whisper Transcription Error:", error);
        throw error;
    }
}
