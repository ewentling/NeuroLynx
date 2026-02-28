
import { AutomationEvent, AutomationRule } from '../types';

export const processAutomationTrigger = async (
    event: AutomationEvent,
    payload: any,
    rules: AutomationRule[]
): Promise<{ triggered: string[], failed: string[] }> => {

    const activeRules = rules.filter(r => r.event === event && r.active);
    const results = { triggered: [] as string[], failed: [] as string[] };

    if (activeRules.length === 0) return results;

    const timestamp = Date.now();

    for (const rule of activeRules) {
        const finalPayload = {
            event: event,
            timestamp: timestamp,
            rule_id: rule.id,
            data: payload
        };

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

            const response = await fetch(rule.webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalPayload),
                mode: 'cors', // Ensure we try to respect CORS
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok && response.status !== 0) { // status 0 is opaque (no-cors)
                throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
            }

            results.triggered.push(rule.name);
        } catch (e: any) {
            const errorMsg = e.name === 'AbortError' ? 'Timeout (10s)' : (e.message || e);
            console.error(`Automation Error [${rule.name}]:`, errorMsg);
            results.failed.push(rule.name);
        }
    }

    return results;
};
