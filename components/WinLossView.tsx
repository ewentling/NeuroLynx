import React from 'react';
import { Deal, Company } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface WinLossViewProps {
    deals: Deal[];
    companies: Company[];
}

const COLORS = ['#10b981', '#f43f5e', '#94a3b8'];

const WinLossView: React.FC<WinLossViewProps> = ({ deals, companies }) => {
    const wonDeals = deals.filter(d => d.stage === 'closed_won');
    const lostDeals = deals.filter(d => d.stage === 'closed_lost');
    const openDeals = deals.filter(d => d.stage !== 'closed_won' && d.stage !== 'closed_lost');

    const winRate = (wonDeals.length + lostDeals.length) > 0
        ? Math.round((wonDeals.length / (wonDeals.length + lostDeals.length)) * 100)
        : 0;

    const wonRevenue = wonDeals.reduce((s, d) => s + d.value, 0);
    const lostRevenue = lostDeals.reduce((s, d) => s + d.value, 0);

    const pieData = [
        { name: 'Won', value: wonDeals.length },
        { name: 'Lost', value: lostDeals.length },
        { name: 'Open', value: openDeals.length },
    ];

    // Loss reasons
    const lossReasons: Record<string, number> = {};
    lostDeals.forEach(d => {
        const reason = d.lossReason || 'Unspecified';
        lossReasons[reason] = (lossReasons[reason] || 0) + 1;
    });
    const lossReasonData = Object.entries(lossReasons).sort((a, b) => b[1] - a[1]);

    // Average deal velocity (days from creation to close for won deals)
    const avgVelocity = wonDeals.length > 0
        ? Math.round(wonDeals.reduce((sum, d) => {
            const lastUpdate = new Date(d.lastUpdated).getTime();
            const expectedClose = new Date(d.expectedCloseDate).getTime();
            return sum + Math.abs(lastUpdate - expectedClose) / 86400000;
        }, 0) / wonDeals.length)
        : 0;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Win/Loss Analysis</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-800 p-6 rounded-xl border border-green-500/20 text-center">
                    <div className="text-3xl font-bold text-green-400">{winRate}%</div>
                    <div className="text-[10px] uppercase text-slate-500 font-bold">Win Rate</div>
                </div>
                <div className="bg-slate-800 p-6 rounded-xl border border-green-500/20 text-center">
                    <div className="text-2xl font-bold font-mono text-green-400">${wonRevenue.toLocaleString()}</div>
                    <div className="text-[10px] uppercase text-slate-500 font-bold">Won Revenue ({wonDeals.length})</div>
                </div>
                <div className="bg-slate-800 p-6 rounded-xl border border-red-500/20 text-center">
                    <div className="text-2xl font-bold font-mono text-red-400">${lostRevenue.toLocaleString()}</div>
                    <div className="text-[10px] uppercase text-slate-500 font-bold">Lost Revenue ({lostDeals.length})</div>
                </div>
                <div className="bg-slate-800 p-6 rounded-xl border border-cyan-500/20 text-center">
                    <div className="text-2xl font-bold text-cyan-400">{avgVelocity}d</div>
                    <div className="text-[10px] uppercase text-slate-500 font-bold">Avg. Deal Cycle</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-800 p-6 rounded-xl border border-white/5">
                    <h3 className="font-bold text-sm uppercase text-slate-500 mb-4">Deal Outcomes</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                                {pieData.map((_, i) => <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />)}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-slate-800 p-6 rounded-xl border border-white/5">
                    <h3 className="font-bold text-sm uppercase text-slate-500 mb-4">Loss Reasons</h3>
                    {lossReasonData.length === 0 ? (
                        <div className="text-sm text-slate-500 italic text-center py-8">No lost deals with documented reasons</div>
                    ) : (
                        <div className="space-y-3">
                            {lossReasonData.map(([reason, count]) => (
                                <div key={reason}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-bold">{reason}</span>
                                        <span className="text-slate-400">{count} deal{count > 1 ? 's' : ''}</span>
                                    </div>
                                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-red-500 rounded-full" style={{ width: `${(count / lostDeals.length) * 100}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-slate-800 p-6 rounded-xl border border-white/5">
                <h3 className="font-bold text-sm uppercase text-slate-500 mb-4">Recent Closed Deals</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[...wonDeals, ...lostDeals].sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()).slice(0, 6).map(deal => (
                        <div key={deal.id} className={`p-3 rounded border flex justify-between items-center ${deal.stage === 'closed_won' ? 'border-green-500/20 bg-green-500/5' : 'border-red-500/20 bg-red-500/5'}`}>
                            <div>
                                <div className="font-bold text-sm">{deal.title}</div>
                                <div className="text-xs text-slate-400">{companies.find(c => c.id === deal.companyId)?.name}</div>
                            </div>
                            <div className="text-right">
                                <div className={`font-mono text-sm ${deal.stage === 'closed_won' ? 'text-green-400' : 'text-red-400'}`}>${deal.value.toLocaleString()}</div>
                                <div className={`text-[10px] font-bold uppercase ${deal.stage === 'closed_won' ? 'text-green-500' : 'text-red-500'}`}>{deal.stage === 'closed_won' ? 'WON' : 'LOST'}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WinLossView;
