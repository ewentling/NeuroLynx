import React from 'react';
import { motion } from 'framer-motion';
import { Project, Expense, TimeEntry, Company } from '../types';
import { TrendingUp, TrendingDown, DollarSign, Users, Briefcase, Activity, PieChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart as RePie, Pie } from 'recharts';

interface ProfitabilityViewProps {
    projects: Project[];
    expenses: Expense[];
    timeEntries: TimeEntry[];
    companies: Company[];
}

const ProfitabilityView: React.FC<ProfitabilityViewProps> = ({ projects, expenses, timeEntries, companies }) => {
    const projectProfitability = projects.map(proj => {
        const projectExpenses = expenses.filter(e => e.projectId === proj.id && e.status === 'approved');
        const totalExpenses = projectExpenses.reduce((sum, e) => sum + e.amount, 0);

        const projectTime = timeEntries.filter(te => te.projectId === proj.id);
        const laborCost = projectTime.reduce((sum, te) => sum + (te.hours * (te.rate || 100) * 0.7), 0); // Assuming 70% of rate as cost

        const revenue = proj.budget;
        const totalCost = totalExpenses + laborCost;
        const profit = revenue - totalCost;
        const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

        return {
            id: proj.id,
            name: proj.name,
            company: companies.find(c => c.id === proj.companyId)?.name || 'Unknown',
            revenue,
            expenses: totalExpenses,
            laborCost,
            totalCost,
            profit,
            margin
        };
    });

    const averageMargin = projectProfitability.reduce((sum, p) => sum + p.margin, 0) / (projectProfitability.length || 1);

    const chartData = projectProfitability.map(p => ({
        name: p.name.length > 15 ? p.name.substring(0, 12) + '...' : p.name,
        Profit: p.profit,
        Cost: p.totalCost,
        Margin: p.margin
    }));

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Project Profitability</h2>
                    <p className="text-slate-400 text-sm">Real-time analysis of project margins, labor costs, and expense overheads.</p>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-900 border border-white/5 rounded-2xl">
                    <div className="text-right">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Avg. Network Margin</div>
                        <div className="text-xl font-black text-green-400">{averageMargin.toFixed(1)}%</div>
                    </div>
                    <div className={`p-2 rounded-xl ${averageMargin > 20 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                        {averageMargin > 20 ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-900 border border-white/10 p-6 rounded-3xl shadow-xl">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-orange-400" /> Profit vs. Cost by Project
                    </h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                                <YAxis stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                />
                                <Bar dataKey="Profit" fill="#f97316" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Cost" fill="#1e293b" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {projectProfitability.sort((a, b) => b.profit - a.profit).map((p) => (
                        <div key={p.id} className="bg-slate-900 border border-white/5 p-4 rounded-2xl hover:border-white/10 transition-all">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-white truncate w-32">{p.name}</h4>
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${p.margin > 30 ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'}`}>
                                    {p.margin.toFixed(0)}% MARGIN
                                </span>
                            </div>
                            <div className="flex justify-between items-end mt-4">
                                <div className="space-y-1">
                                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Net Profit</div>
                                    <div className="text-lg font-black text-white">${p.profit.toLocaleString()}</div>
                                </div>
                                <div className="text-right space-y-1">
                                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Total Cost</div>
                                    <div className="text-xs font-bold text-slate-400">${p.totalCost.toLocaleString()}</div>
                                </div>
                            </div>
                            <div className="mt-4 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.max(5, Math.min(100, (p.profit / p.revenue) * 100))}%` }}
                                    className="bg-orange-500 h-full rounded-full"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProfitabilityView;
