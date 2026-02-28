import React from 'react';
import { Deal, Company } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ForecastViewProps {
    deals: Deal[];
    companies: Company[];
}

const COLORS = ['#f97316', '#06b6d4', '#8b5cf6', '#10b981', '#f43f5e', '#eab308'];

const ForecastView: React.FC<ForecastViewProps> = ({ deals, companies }) => {
    const openDeals = deals.filter(d => d.stage !== 'closed_won' && d.stage !== 'closed_lost');

    // Group by month of expectedCloseDate
    const monthlyForecast: Record<string, { weighted: number; unweighted: number; count: number }> = {};
    openDeals.forEach(deal => {
        if (!deal.expectedCloseDate) return;
        const month = deal.expectedCloseDate.substring(0, 7); // YYYY-MM
        if (!monthlyForecast[month]) monthlyForecast[month] = { weighted: 0, unweighted: 0, count: 0 };
        monthlyForecast[month].weighted += deal.value * (deal.probability / 100);
        monthlyForecast[month].unweighted += deal.value;
        monthlyForecast[month].count++;
    });

    const chartData = Object.entries(monthlyForecast)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, data]) => ({
            name: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
            weighted: Math.round(data.weighted),
            unweighted: Math.round(data.unweighted),
            count: data.count,
        }));

    const totalWeighted = openDeals.reduce((sum, d) => sum + d.value * (d.probability / 100), 0);
    const totalPipeline = openDeals.reduce((sum, d) => sum + d.value, 0);
    const avgProbability = openDeals.length ? Math.round(openDeals.reduce((sum, d) => sum + d.probability, 0) / openDeals.length) : 0;

    // Stage breakdown
    const stageData = ['qualification', 'proposal', 'negotiation'].map(stage => ({
        name: stage.charAt(0).toUpperCase() + stage.slice(1),
        value: deals.filter(d => d.stage === stage).reduce((s, d) => s + d.value, 0),
    }));

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Revenue Forecast</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800 p-6 rounded-xl border border-orange-500/20">
                    <div className="text-xs uppercase text-slate-500 font-bold mb-1">Weighted Forecast</div>
                    <div className="text-3xl font-bold font-mono text-orange-400">${Math.round(totalWeighted).toLocaleString()}</div>
                    <div className="text-xs text-slate-400 mt-1">Probability-adjusted revenue</div>
                </div>
                <div className="bg-slate-800 p-6 rounded-xl border border-cyan-500/20">
                    <div className="text-xs uppercase text-slate-500 font-bold mb-1">Total Pipeline</div>
                    <div className="text-3xl font-bold font-mono text-cyan-400">${Math.round(totalPipeline).toLocaleString()}</div>
                    <div className="text-xs text-slate-400 mt-1">{openDeals.length} open deals</div>
                </div>
                <div className="bg-slate-800 p-6 rounded-xl border border-purple-500/20">
                    <div className="text-xs uppercase text-slate-500 font-bold mb-1">Avg. Probability</div>
                    <div className="text-3xl font-bold font-mono text-purple-400">{avgProbability}%</div>
                    <div className="text-xs text-slate-400 mt-1">Across pipeline</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-800 p-6 rounded-xl border border-white/5">
                    <h3 className="font-bold text-sm uppercase text-slate-500 mb-4">Monthly Projected Revenue</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                            />
                            <Bar dataKey="weighted" name="Weighted" fill="#f97316" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="unweighted" name="Unweighted" fill="#06b6d4" radius={[4, 4, 0, 0]} opacity={0.3} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-slate-800 p-6 rounded-xl border border-white/5">
                    <h3 className="font-bold text-sm uppercase text-slate-500 mb-4">Pipeline by Stage</h3>
                    <div className="space-y-4">
                        {stageData.map((stage, i) => (
                            <div key={stage.name}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-bold">{stage.name}</span>
                                    <span className="text-sm font-mono text-slate-400">${stage.value.toLocaleString()}</span>
                                </div>
                                <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-1000"
                                        style={{
                                            width: `${totalPipeline ? (stage.value / totalPipeline) * 100 : 0}%`,
                                            backgroundColor: COLORS[i % COLORS.length],
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 space-y-2">
                        <h4 className="text-xs uppercase text-slate-500 font-bold">Top Deals</h4>
                        {openDeals.sort((a, b) => b.value - a.value).slice(0, 5).map(deal => (
                            <div key={deal.id} className="flex justify-between items-center p-2 bg-black/20 rounded text-sm">
                                <div>
                                    <div className="font-bold text-xs">{deal.title}</div>
                                    <div className="text-[10px] text-slate-500">{companies.find(c => c.id === deal.companyId)?.name}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-mono text-cyan-400 text-xs">${deal.value.toLocaleString()}</div>
                                    <div className="text-[10px] text-slate-500">{deal.probability}%</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForecastView;
