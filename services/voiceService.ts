
export class VoiceService {
    private currentVoice: SpeechSynthesisVoice | null = null;
    private rate: number = 1.0;

    constructor() {
        // Init with preferred voice if possible
        this.initVoices();
    }

    private initVoices() {
        const voices = window.speechSynthesis.getVoices();
        // Prefer "Google" or high quality natural voices for "Gemini" feel
        const preferred = voices.find(v => v.name.includes('Google') || v.name.includes('Natural')) || voices[0];
        if (preferred) this.currentVoice = preferred;
    }

    getVoices(): SpeechSynthesisVoice[] {
        return window.speechSynthesis.getVoices();
    }

    getVoice(): SpeechSynthesisVoice | null {
        return this.currentVoice;
    }

    setVoice(voiceName: string) {
        const voices = this.getVoices();
        const voice = voices.find(v => v.name === voiceName);
        if (voice) this.currentVoice = voice;
    }

    async speak(text: string): Promise<void> {
        return new Promise((resolve) => {
            // Cancel existing speech
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            if (this.currentVoice) utterance.voice = this.currentVoice;
            utterance.rate = this.rate;
            utterance.pitch = 1.0;

            utterance.onend = () => resolve();
            utterance.onerror = (e) => {
                console.error("Speech Synthesis Error", e);
                resolve();
            };

            window.speechSynthesis.speak(utterance);
        });
    }
}
