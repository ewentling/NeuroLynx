import React from 'react';
import { CSATResponse, Company } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface CSATViewProps {
    responses: CSATResponse[];
    companies: Company[];
    onSendSurvey: () => void;
}

const CSATView: React.FC<CSATViewProps> = ({ responses, companies, onSendSurvey }) => {
    const avgScore = responses.length ? (responses.reduce((s, r) => s + r.score, 0) / responses.length).toFixed(1) : '0';
    const promoters = responses.filter(r => r.score >= 9).length;
    const detractors = responses.filter(r => r.score <= 6).length;
    const nps = responses.length ? Math.round(((promoters - detractors) / responses.length) * 100) : 0;

    // Per-company averages
    const companyScores: Record<string, { total: number; count: number }> = {};
    responses.forEach(r => {
        if (!companyScores[r.companyId]) companyScores[r.companyId] = { total: 0, count: 0 };
        companyScores[r.companyId].total += r.score;
        companyScores[r.companyId].count++;
    });

    const chartData = Object.entries(companyScores).map(([id, data]) => ({
        name: companies.find(c => c.id === id)?.name || id,
        score: parseFloat((data.total / data.count).toFixed(1)),
    })).sort((a, b) => b.score - a.score);

    const getScoreColor = (score: number) => score >= 9 ? '#10b981' : score >= 7 ? '#eab308' : '#f43f5e';

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Client Satisfaction</h2>
                <button onClick={onSendSurvey} className="px-4 py-2 bg-orange-600 rounded text-xs font-bold hover:bg-orange-500">
                    <i className="fas fa-paper-plane mr-2"></i>Send Survey
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-800 p-6 rounded-xl border border-cyan-500/20 text-center">
                    <div className="text-3xl font-bold text-cyan-400">{avgScore}</div>
                    <div className="text-[10px] uppercase text-slate-500 font-bold">Avg Score (1-10)</div>
                </div>
                <div className={`bg-slate-800 p-6 rounded-xl border text-center ${nps >= 50 ? 'border-green-500/20' : nps >= 0 ? 'border-yellow-500/20' : 'border-red-500/20'}`}>
                    <div className={`text-3xl font-bold ${nps >= 50 ? 'text-green-400' : nps >= 0 ? 'text-yellow-400' : 'text-red-400'}`}>{nps}</div>
                    <div className="text-[10px] uppercase text-slate-500 font-bold">NPS Score</div>
                </div>
                <div className="bg-slate-800 p-6 rounded-xl border border-green-500/20 text-center">
                    <div className="text-3xl font-bold text-green-400">{promoters}</div>
                    <div className="text-[10px] uppercase text-slate-500 font-bold">Promoters (9-10)</div>
                </div>
                <div className="bg-slate-800 p-6 rounded-xl border border-red-500/20 text-center">
                    <div className="text-3xl font-bold text-red-400">{detractors}</div>
                    <div className="text-[10px] uppercase text-slate-500 font-bold">Detractors (1-6)</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-800 p-6 rounded-xl border border-white/5">
                    <h3 className="font-bold text-sm uppercase text-slate-500 mb-4">Satisfaction by Company</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={chartData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis type="number" domain={[0, 10]} stroke="#94a3b8" fontSize={12} />
                            <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} width={100} />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                            <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                                {chartData.map((entry, i) => <Cell key={i} fill={getScoreColor(entry.score)} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-slate-800 p-6 rounded-xl border border-white/5">
                    <h3 className="font-bold text-sm uppercase text-slate-500 mb-4">Recent Feedback</h3>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
                        {[...responses].sort((a, b) => b.date.localeCompare(a.date)).map(r => (
                            <div key={r.id} className="p-3 bg-black/20 rounded border border-white/5">
                                <div className="flex justify-between items-center mb-1">
                                    <div className="font-bold text-sm">{r.respondentName}</div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-500">{r.date}</span>
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono`} style={{ color: getScoreColor(r.score) }}>{r.score}/10</span>
                                    </div>
                                </div>
                                <div className="text-xs text-slate-400">{companies.find(c => c.id === r.companyId)?.name}</div>
                                {r.feedback && <div className="text-xs text-slate-300 mt-2 italic">"{r.feedback}"</div>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CSATView;
