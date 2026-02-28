import React from 'react';
import { KPIGoal } from '../types';

interface KPIViewProps {
    goals: KPIGoal[];
    onUpdateGoal: (id: string, current: number) => void;
}

const METRIC_ICONS: Record<string, string> = {
    revenue: 'fa-dollar-sign',
    new_clients: 'fa-user-plus',
    meetings_held: 'fa-handshake',
    contracts_signed: 'fa-file-signature',
    deals_won: 'fa-trophy',
    tickets_resolved: 'fa-ticket-alt',
};

const KPIView: React.FC<KPIViewProps> = ({ goals }) => {
    const onTrack = goals.filter(g => (g.current / g.target) >= 0.7).length;
    const atRisk = goals.filter(g => (g.current / g.target) < 0.5).length;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">KPI Goals</h2>
                <div className="flex gap-3">
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs font-bold text-green-400">{onTrack} On Track</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-xs font-bold text-red-400">{atRisk} At Risk</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goals.map(goal => {
                    const progress = Math.min(Math.round((goal.current / goal.target) * 100), 100);
                    const isOnTrack = progress >= 70;
                    const isAtRisk = progress < 50;
                    const color = isOnTrack ? 'green' : isAtRisk ? 'red' : 'yellow';
                    const icon = METRIC_ICONS[goal.metric] || 'fa-chart-bar';

                    return (
                        <div key={goal.id} className={`bg-slate-800 rounded-xl border border-${color}-500/20 p-6 relative overflow-hidden group`}>
                            <div className={`absolute -right-4 -top-4 w-20 h-20 bg-${color}-500/5 rounded-full group-hover:bg-${color}-500/10 transition-all`}></div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`w-10 h-10 rounded-lg bg-${color}-500/20 flex items-center justify-center`}>
                                        <i className={`fas ${icon} text-${color}-400`}></i>
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm">{goal.label}</div>
                                        <div className="text-[10px] uppercase text-slate-500 font-bold">{goal.period}</div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-end mb-3">
                                    <div>
                                        <span className={`text-3xl font-bold font-mono text-${color}-400`}>
                                            {goal.metric === 'revenue' ? `$${(goal.current / 1000).toFixed(1)}k` : goal.current}
                                        </span>
                                        <span className="text-slate-500 text-sm ml-1">
                                            / {goal.metric === 'revenue' ? `$${(goal.target / 1000).toFixed(0)}k` : goal.target}
                                        </span>
                                    </div>
                                    <div className={`text-sm font-bold text-${color}-400`}>
                                        {progress}%
                                        <i className={`fas fa-arrow-${isOnTrack ? 'up' : 'down'} ml-1 text-xs`}></i>
                                    </div>
                                </div>

                                <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${isOnTrack ? 'bg-gradient-to-r from-green-600 to-green-400' : isAtRisk ? 'bg-gradient-to-r from-red-600 to-red-400' : 'bg-gradient-to-r from-yellow-600 to-yellow-400'}`}
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>

                                <div className="text-[10px] text-slate-500 mt-2">
                                    {goal.target - goal.current > 0
                                        ? `${goal.metric === 'revenue' ? '$' + (goal.target - goal.current).toLocaleString() : (goal.target - goal.current)} remaining`
                                        : 'Goal achieved! 🎉'}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default KPIView;
