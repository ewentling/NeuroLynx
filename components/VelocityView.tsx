import React from 'react';
import { motion } from 'framer-motion';
import { Deal, Company } from '../types';
import { Zap, Timer, ArrowRight, AlertTriangle, CheckCircle, BarChart2, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface VelocityViewProps {
    deals: Deal[];
    companies: Company[];
}

const VelocityView: React.FC<VelocityViewProps> = ({ deals, companies }) => {
    // Simulated velocity data based on deal stages
    const stageDurations = {
        qualification: 12,
        proposal: 24,
        negotiation: 18,
        closed_won: 5,
    };

    const conversionRates = {
        qualification_to_proposal: 65,
        proposal_to_negotiation: 45,
        negotiation_to_won: 80,
    };

    const avgVelocity = 59; // days to close

    const pipelineData = [
        { name: 'Jan', velocity: 65, volume: 120000 },
        { name: 'Feb', velocity: 62, volume: 150000 },
        { name: 'Mar', velocity: 59, volume: 185000 },
        { name: 'Apr', velocity: 52, volume: 210000 },
        { name: 'May', velocity: 48, volume: 250000 },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Pipeline Velocity</h2>
                    <p className="text-slate-400 text-sm">Identifying bottlenecks and measuring the speed of your sales cycle.</p>
                </div>
                <div className="flex bg-slate-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="p-4 border-r border-white/5 text-center">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Avg. Close Time</div>
                        <div className="text-2xl font-black text-orange-400">{avgVelocity} Days</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-900 border border-white/10 p-6 rounded-3xl shadow-xl">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Zap className="w-4 h-4 text-orange-400" /> Velocity Trend (Days to Close)
                        </h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={pipelineData}>
                                    <defs>
                                        <linearGradient id="colorVel" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                                    <YAxis stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} reversed domain={[40, 80]} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                    />
                                    <Area type="monotone" dataKey="velocity" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorVel)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-slate-900 border border-white/5 p-4 rounded-2xl">
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Qualification</div>
                            <div className="text-xl font-bold text-white mb-1">12 Days</div>
                            <div className="text-[9px] font-bold text-green-400 flex items-center gap-1 uppercase tracking-tighter">
                                <TrendingUp className="w-3 h-3" /> -2 days vs ly
                            </div>
                        </div>
                        <div className="bg-slate-900/40 border border-orange-500/20 p-4 rounded-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2"><AlertTriangle className="w-4 h-4 text-orange-500 opacity-50" /></div>
                            <div className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-4">Proposal</div>
                            <div className="text-xl font-bold text-white mb-1">24 Days</div>
                            <div className="text-[9px] font-bold text-red-500 flex items-center gap-1 uppercase tracking-tighter">
                                <TrendingUp className="w-3 h-3 rotate-180" /> +5 days vs ly
                            </div>
                        </div>
                        <div className="bg-slate-900 border border-white/5 p-4 rounded-2xl">
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Negotiation</div>
                            <div className="text-xl font-bold text-white mb-1">18 Days</div>
                            <div className="text-[9px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-tighter">
                                Stable vs ly
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-900 border border-white/10 p-6 rounded-3xl shadow-xl h-full">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-8 flex items-center gap-2">
                            <Timer className="w-4 h-4 text-orange-400" /> Stage Conversion
                        </h3>

                        <div className="space-y-8 relative">
                            <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-orange-500 via-orange-500/20 to-transparent"></div>

                            {[
                                { name: 'Lead to Qualified', rate: 65, icon: Zap },
                                { name: 'Qualified to Proposal', rate: 45, icon: BarChart2, warning: true },
                                { name: 'Proposal to Signed', rate: 80, icon: CheckCircle },
                            ].map((conv, i) => (
                                <div key={i} className="flex gap-4 items-center relative z-10">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${conv.warning ? 'bg-orange-500/10 border-orange-500/40 text-orange-400 shadow-lg shadow-orange-500/10' : 'bg-slate-800 border-white/10 text-slate-400'}`}>
                                        <conv.icon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-end mb-1">
                                            <div className="text-[10px] font-bold text-white uppercase tracking-wider">{conv.name}</div>
                                            <div className={`text-sm font-black ${conv.warning ? 'text-orange-400' : 'text-slate-400'}`}>{conv.rate}%</div>
                                        </div>
                                        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${conv.rate}%` }}
                                                className={`h-full ${conv.warning ? 'bg-orange-500' : 'bg-slate-600'}`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 p-4 bg-orange-600/10 border border-orange-500/20 rounded-2xl">
                            <h4 className="text-xs font-bold text-orange-500 mb-2 uppercase tracking-widest flex items-center gap-2">
                                <Zap className="w-3 h-3" /> Growth Insight
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed italic">
                                Reducing your <strong>Proposal</strong> stage duration by just 3 days could increase Q3 revenue throughput by <strong>$45,000</strong>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VelocityView;
