
import { Meeting, BillingRecord, Contract } from '../types';

export const calculateClientHealth = (
    companyId: string, 
    meetings: Meeting[], 
    billingRecords: BillingRecord[], 
    contracts: Contract[]
): { score: number, trend: 'up' | 'down' | 'stable' } => {
    let score = 70; // Base score
    
    // Filter data for company
    const companyMeetings = meetings.filter(m => m.clientId === companyId);
    const companyBilling = billingRecords.filter(b => b.clientId === companyId);
    const companyContracts = contracts.filter(c => c.companyId === companyId);

    // 1. Meetings Sentiment (Sort by date desc to get latest)
    const sortedMeetings = [...companyMeetings].sort((a, b) => b.date - a.date);
    sortedMeetings.slice(0, 5).forEach(m => {
        if (m.sentiment === 'positive') score += 5;
        if (m.sentiment === 'negative') score -= 10;
    });

    // 2. Overdue Invoices
    const overdue = companyBilling.filter(b => b.status === 'overdue').length;
    score -= (overdue * 15);

    // 3. Active Contracts
    const activeContracts = companyContracts.filter(c => c.status === 'active').length;
    score += (activeContracts * 5);

    // 4. Recency
    if (sortedMeetings.length > 0) {
        const lastMeeting = sortedMeetings[0].date;
        const daysSinceMeeting = (Date.now() - lastMeeting) / (1000 * 60 * 60 * 24);
        if (daysSinceMeeting > 30) score -= 10;
        if (daysSinceMeeting < 7) score += 5;
    } else {
        // No meetings ever? slight penalty or neutral
        score -= 5;
    }

    // Clamp
    score = Math.max(0, Math.min(100, score));

    // Trend
    const trend = score > 75 ? 'up' : score < 50 ? 'down' : 'stable';

    return { score, trend };
};
