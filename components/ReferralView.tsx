import React from 'react';
import { Company, Referral, LeadSource } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface ReferralViewProps {
    companies: Company[];
    referrals: Referral[];
    onAddReferral: () => void;
}

const SOURCE_COLORS: Record<LeadSource, string> = {
    referral: '#f97316',
    website: '#06b6d4',
    cold_outreach: '#8b5cf6',
    event: '#10b981',
    social_media: '#f43f5e',
    partner: '#eab308',
    other: '#94a3b8',
};

const ReferralView: React.FC<ReferralViewProps> = ({ companies, referrals, onAddReferral }) => {
    // Source breakdown
    const sourceCounts: Record<string, number> = {};
    companies.forEach(c => {
        const source = c.leadSource || 'other';
        sourceCounts[source] = (sourceCounts[source] || 0) + 1;
    });

    const pieData = Object.entries(sourceCounts).map(([name, value]) => ({ name: name.replace('_', ' '), value }));
    const colors = Object.entries(sourceCounts).map(([name]) => SOURCE_COLORS[name as LeadSource] || '#94a3b8');

    const convertedReferrals = referrals.filter(r => r.status === 'converted');
    const totalReferralValue = convertedReferrals.reduce((s, r) => s + (r.dealValue || 0), 0);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Referral & Lead Sources</h2>
                <button onClick={onAddReferral} className="px-4 py-2 bg-orange-600 rounded text-xs font-bold hover:bg-orange-500">
                    <i className="fas fa-plus mr-2"></i>Log Referral
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800 p-6 rounded-xl border border-orange-500/20 text-center">
                    <div className="text-3xl font-bold text-orange-400">{referrals.length}</div>
                    <div className="text-[10px] uppercase text-slate-500 font-bold">Total Referrals</div>
                </div>
                <div className="bg-slate-800 p-6 rounded-xl border border-green-500/20 text-center">
                    <div className="text-3xl font-bold text-green-400">{convertedReferrals.length}</div>
                    <div className="text-[10px] uppercase text-slate-500 font-bold">Converted</div>
                </div>
                <div className="bg-slate-800 p-6 rounded-xl border border-cyan-500/20 text-center">
                    <div className="text-2xl font-bold font-mono text-cyan-400">${totalReferralValue.toLocaleString()}</div>
                    <div className="text-[10px] uppercase text-slate-500 font-bold">Referral Revenue</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-800 p-6 rounded-xl border border-white/5">
                    <h3 className="font-bold text-sm uppercase text-slate-500 mb-4">Lead Source Distribution</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                                {pieData.map((_, i) => <Cell key={`cell-${i}`} fill={colors[i]} />)}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-slate-800 p-6 rounded-xl border border-white/5">
                    <h3 className="font-bold text-sm uppercase text-slate-500 mb-4">Referral Log</h3>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
                        {referrals.map(ref => {
                            const referred = companies.find(c => c.id === ref.referredCompanyId);
                            const referrer = ref.referrerCompanyId ? companies.find(c => c.id === ref.referrerCompanyId) : null;
                            return (
                                <div key={ref.id} className="p-3 bg-black/20 rounded border border-white/5 flex justify-between items-center">
                                    <div>
                                        <div className="font-bold text-sm">{referred?.name || 'Unknown'}</div>
                                        <div className="text-xs text-slate-400">
                                            Referred by: {referrer?.name || ref.referrerName} • {ref.date}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {ref.dealValue && <span className="font-mono text-cyan-400 text-xs">${ref.dealValue.toLocaleString()}</span>}
                                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${ref.status === 'converted' ? 'bg-green-500/20 text-green-400' : ref.status === 'lost' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                            {ref.status}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReferralView;
