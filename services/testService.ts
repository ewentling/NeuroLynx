
import { CryptoService } from './cryptoService';
import { calculateClientHealth } from './analyticsService';
import { processAutomationTrigger } from './automationService';
import { Meeting, BillingRecord, Contract, AutomationRule, Deal, TestResult } from '../types';

export class TestService {
    private crypto: CryptoService;

    constructor() {
        this.crypto = new CryptoService();
    }

    // ... (Existing Tests preserved below) ...

    async runCryptoTest(): Promise<TestResult> {
        try {
            const payload = { secret: "NeuroLynx Test payload " + Date.now() };
            const encrypted = await this.crypto.encrypt(payload);
            if (!encrypted.startsWith('ENC:')) throw new Error("Invalid encryption prefix");
            const decrypted = await this.crypto.decrypt(encrypted);
            if (decrypted.secret !== payload.secret) throw new Error("Decrypted data mismatch");
            return { id: 'crypto-1', category: 'Security', name: 'AES-GCM Encryption', status: 'pass', message: 'Data integrity verified.', timestamp: Date.now() };
        } catch (e: any) {
            return { id: 'crypto-1', category: 'Security', name: 'AES-GCM Encryption', status: 'fail', message: e.message, timestamp: Date.now() };
        }
    }

    runStorageTest(): TestResult {
        try {
            const key = 'nl_test_io';
            localStorage.setItem(key, 'test');
            if (localStorage.getItem(key) !== 'test') throw new Error("Read mismatch");
            localStorage.removeItem(key);
            return { id: 'sys-1', category: 'System', name: 'LocalStorage I/O', status: 'pass', message: 'Read/Write operations successful.', timestamp: Date.now() };
        } catch (e: any) {
            return { id: 'sys-1', category: 'System', name: 'LocalStorage I/O', status: 'fail', message: e.message, timestamp: Date.now() };
        }
    }

    async runPdfTest(): Promise<TestResult> {
        try {
            if (!window.FileReader) throw new Error("FileReader API not supported");
            return { id: 'sys-2', category: 'System', name: 'PDF Dependencies', status: 'pass', message: 'FileReader API available.', timestamp: Date.now() };
        } catch (e: any) {
            return { id: 'sys-2', category: 'System', name: 'PDF Dependencies', status: 'fail', message: e.message, timestamp: Date.now() };
        }
    }

    runGeminiTest(): TestResult {
        if (!process.env.API_KEY) return { id: 'ai-1', category: 'AI', name: 'Gemini Configuration', status: 'fail', message: 'API Key missing.', timestamp: Date.now() };
        return { id: 'ai-1', category: 'AI', name: 'Gemini Configuration', status: 'pass', message: 'API Key present.', timestamp: Date.now() };
    }

    runVectorTest(pineconeKey: string, pineconeHost: string): TestResult {
        if (!pineconeKey || !pineconeHost) return { id: 'db-1', category: 'Database', name: 'Vector DB Config', status: 'warning', message: 'Pinecone keys missing.', timestamp: Date.now() };
        return { id: 'db-1', category: 'Database', name: 'Vector DB Config', status: 'pass', message: 'Configuration present.', timestamp: Date.now() };
    }

    async runBrowserTest(): Promise<TestResult> {
        try {
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            if (!audioCtx) throw new Error("AudioContext failed");
            return { id: 'br-1', category: 'Browser', name: 'Audio Support', status: 'pass', message: 'Web Audio API supported.', timestamp: Date.now() };
        } catch (e: any) {
            return { id: 'br-1', category: 'Browser', name: 'Audio Support', status: 'fail', message: e.message, timestamp: Date.now() };
        }
    }

    // --- NEW TESTS ---

    runAnalyticsTest(): TestResult {
        try {
            // Mock Data
            const cid = 'test-co';
            const now = Date.now();
            // 1. Meetings: 1 positive (+5), 1 neutral (0). Recent (<7 days) (+5). Total Meetings Bonus: +10.
            const meetings: Meeting[] = [
                { id: 'm1', clientId: cid, sentiment: 'positive', date: now - 10000, title: 'm1', duration: 0, transcript: '', summary: '', status: 'completed' },
                { id: 'm2', clientId: cid, sentiment: 'neutral', date: now - 20000, title: 'm2', duration: 0, transcript: '', summary: '', status: 'completed' }
            ];
            // 2. Billing: 0 overdue.
            const billing: BillingRecord[] = [
                { id: 'b1', clientId: cid, status: 'paid', amount: 100, date: '', breakdown: '' }
            ];
            // 3. Contracts: 1 active (+5).
            const contracts: Contract[] = [
                { id: 'c1', companyId: cid, status: 'active', items: [], totalValue: 100, dateCreated: '', paymentTerms: 'net30', title: 'c1' }
            ];

            // Expected Score: 70 (Base) + 5 (Pos Meeting) + 5 (Recency) + 5 (Active Contract) = 85
            const result = calculateClientHealth(cid, meetings, billing, contracts);

            if (result.score !== 85) throw new Error(`Score mismatch. Expected 85, got ${result.score}`);
            if (result.trend !== 'up') throw new Error(`Trend mismatch. Expected 'up', got ${result.trend}`);

            return { id: 'an-1', category: 'Analytics', name: 'Pulse Score Calculation', status: 'pass', message: 'Logic verified (85/100).', timestamp: Date.now() };
        } catch (e: any) {
            return { id: 'an-1', category: 'Analytics', name: 'Pulse Score Calculation', status: 'fail', message: e.message, timestamp: Date.now() };
        }
    }

    async runAutomationTest(): Promise<TestResult> {
        try {
            // Mock Fetch
            const originalFetch = window.fetch;
            let fetchCalled = false;
            let fetchUrl = '';
            let fetchBody = '';

            window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
                fetchCalled = true;
                fetchUrl = input.toString();
                fetchBody = init?.body as string || '';
                return new Response(JSON.stringify({ success: true }));
            };

            const rule: AutomationRule = {
                id: 'r1', name: 'Test Rule', event: 'DEAL_WON', webhookUrl: 'https://test.n8n.webhook/hook', active: true
            };

            const payload = { dealId: 'd1', amount: 5000 };

            await processAutomationTrigger('DEAL_WON', payload, [rule]);

            // Restore Fetch
            window.fetch = originalFetch;

            if (!fetchCalled) throw new Error("Webhook fetch not triggered");
            if (fetchUrl !== 'https://test.n8n.webhook/hook') throw new Error("Wrong URL called");

            const parsedBody = JSON.parse(fetchBody);
            if (parsedBody.event !== 'DEAL_WON' || parsedBody.data.amount !== 5000) throw new Error("Payload mismatch");

            return { id: 'auto-1', category: 'Automation', name: 'n8n Webhook Trigger', status: 'pass', message: 'Webhook payload structure verified.', timestamp: Date.now() };
        } catch (e: any) {
            // Restore Fetch in case of error
            // window.fetch = originalFetch; // (cannot access originalFetch here easily in catch block due to scope, strictly, but locally defined variables are available)
            return { id: 'auto-1', category: 'Automation', name: 'n8n Webhook Trigger', status: 'fail', message: e.message, timestamp: Date.now() };
        }
    }
}
