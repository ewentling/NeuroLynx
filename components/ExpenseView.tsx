import React from 'react';
import { Expense, Company, Project, ExpenseCategory } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface ExpenseViewProps {
    expenses: Expense[];
    companies: Company[];
    projects: Project[];
    onAddExpense: () => void;
}

const ExpenseView: React.FC<ExpenseViewProps> = ({ expenses, companies, projects, onAddExpense }) => {
    const totalExpenses = expenses.filter(e => e.status === 'approved').reduce((s, e) => s + e.amount, 0);
    const pendingExpenses = expenses.filter(e => e.status === 'pending').reduce((s, e) => s + e.amount, 0);

    // Category breakdown
    const categoryDataMap: Record<string, number> = {};
    expenses.filter(e => e.status === 'approved').forEach(e => {
        categoryDataMap[e.category] = (categoryDataMap[e.category] || 0) + e.amount;
    });
    const categoryData = Object.entries(categoryDataMap).map(([name, value]) => ({ name, value }));

    const COLORS = ['#0891b2', '#06b6d4', '#22d3ee', '#818cf8', '#6366f1', '#f97316', '#fb923c', '#94a3b8'];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Expense Tracking</h2>
                <button onClick={onAddExpense} className="px-4 py-2 bg-orange-600 rounded text-xs font-bold hover:bg-orange-500">
                    <i className="fas fa-plus mr-2"></i>Log Expense
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800 p-6 rounded-xl border border-green-500/20 text-center">
                    <div className="text-3xl font-bold text-green-400">${totalExpenses.toLocaleString()}</div>
                    <div className="text-[10px] uppercase text-slate-500 font-bold">Total (Approved)</div>
                </div>
                <div className="bg-slate-800 p-6 rounded-xl border border-yellow-500/20 text-center">
                    <div className="text-3xl font-bold text-yellow-400">${pendingExpenses.toLocaleString()}</div>
                    <div className="text-[10px] uppercase text-slate-500 font-bold">In Approval</div>
                </div>
                <div className="bg-slate-800 p-6 rounded-xl border border-cyan-500/20 text-center">
                    <div className="text-3xl font-bold text-cyan-400">{expenses.length}</div>
                    <div className="text-[10px] uppercase text-slate-500 font-bold">Transactions</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-800 p-6 rounded-xl border border-white/5">
                    <h3 className="font-bold text-sm uppercase text-slate-500 mb-4">Breakdown by Category</h3>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                                    formatter={(value: number) => `$${value.toLocaleString()}`}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-slate-800 p-6 rounded-xl border border-white/5">
                    <h3 className="font-bold text-sm uppercase text-slate-500 mb-4">Recent Transactions</h3>
                    <div className="space-y-3 max-h-[250px] overflow-y-auto custom-scrollbar pr-1">
                        {expenses.sort((a, b) => b.date.localeCompare(a.date)).map(exp => (
                            <div key={exp.id} className="flex items-center gap-4 p-3 bg-black/20 rounded border border-white/5">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${exp.status === 'approved' ? 'bg-green-500/10 text-green-400' :
                                        exp.status === 'rejected' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'
                                    }`}>
                                    <i className={`fas fa-${exp.category === 'travel' ? 'plane' : exp.category === 'software' ? 'code' : 'receipt'}`}></i>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-bold text-xs truncate">{exp.description}</div>
                                    <div className="text-[10px] text-slate-500 uppercase">{exp.category} • {exp.date}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-sm font-mono">${exp.amount}</div>
                                    <div className={`text-[10px] uppercase font-bold ${exp.status === 'approved' ? 'text-green-500' : 'text-yellow-500'
                                        }`}>{exp.status}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpenseView;
