import React from 'react';
import { Deal, Task, Contract, Company } from '../types';

interface AlertsPanelProps {
    deals: Deal[];
    tasks: Task[];
    contracts: Contract[];
    companies: Company[];
    onNavigate: (view: string) => void;
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({ deals, tasks, contracts, companies, onNavigate }) => {
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 86400000;
    const thirtyDaysFromNow = now + 30 * 86400000;

    // Stale deals: no update in 7+ days, still open
    const staleDeals = deals.filter(d =>
        d.stage !== 'closed_won' && d.stage !== 'closed_lost' &&
        new Date(d.lastUpdated).getTime() < sevenDaysAgo
    );

    // Overdue tasks
    const overdueTasks = tasks.filter(t =>
        t.status !== 'done' && t.dueDate && new Date(t.dueDate).getTime() < now
    );

    // Expiring contracts (within 30 days)
    const expiringContracts = contracts.filter(c =>
        c.status === 'active' && c.endDate &&
        new Date(c.endDate).getTime() < thirtyDaysFromNow &&
        new Date(c.endDate).getTime() > now
    );

    const totalAlerts = staleDeals.length + overdueTasks.length + expiringContracts.length;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Alerts & Reminders</h2>
                <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
                    <i className="fas fa-bell text-red-400 text-xs"></i>
                    <span className="text-xs font-bold text-red-400">{totalAlerts} Active Alerts</span>
                </div>
            </div>

            {/* Stale Deals */}
            <div className="bg-slate-800 rounded-xl border border-orange-500/20 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-orange-500/20 rounded flex items-center justify-center"><i className="fas fa-hourglass-half text-orange-400"></i></div>
                    <h3 className="font-bold text-sm uppercase text-orange-400">Stale Deals ({staleDeals.length})</h3>
                </div>
                {staleDeals.length === 0 ? (
                    <div className="text-sm text-slate-500 italic">No stale deals — great pipeline hygiene!</div>
                ) : (
                    <div className="space-y-2">
                        {staleDeals.map(deal => {
                            const daysSince = Math.floor((now - new Date(deal.lastUpdated).getTime()) / 86400000);
                            return (
                                <div key={deal.id} className="flex justify-between items-center p-3 bg-black/20 rounded border border-white/5 cursor-pointer hover:border-orange-500/30" onClick={() => onNavigate('pipeline')}>
                                    <div>
                                        <div className="font-bold text-sm">{deal.title}</div>
                                        <div className="text-xs text-slate-400">{companies.find(c => c.id === deal.companyId)?.name} • {deal.stage}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-mono text-orange-400 text-sm">${deal.value.toLocaleString()}</div>
                                        <div className="text-[10px] text-red-400 font-bold">{daysSince}d stale</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Overdue Tasks */}
            <div className="bg-slate-800 rounded-xl border border-red-500/20 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-red-500/20 rounded flex items-center justify-center"><i className="fas fa-exclamation-triangle text-red-400"></i></div>
                    <h3 className="font-bold text-sm uppercase text-red-400">Overdue Tasks ({overdueTasks.length})</h3>
                </div>
                {overdueTasks.length === 0 ? (
                    <div className="text-sm text-slate-500 italic">All tasks on schedule!</div>
                ) : (
                    <div className="space-y-2">
                        {overdueTasks.map(task => {
                            const daysOverdue = Math.floor((now - new Date(task.dueDate!).getTime()) / 86400000);
                            return (
                                <div key={task.id} className="flex justify-between items-center p-3 bg-black/20 rounded border border-white/5 cursor-pointer hover:border-red-500/30" onClick={() => onNavigate('tasks')}>
                                    <div>
                                        <div className="font-bold text-sm">{task.title}</div>
                                        <div className="text-xs text-slate-400">Due: {task.dueDate}</div>
                                    </div>
                                    <div className="text-[10px] text-red-400 font-bold animate-pulse">{daysOverdue}d overdue</div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Expiring Contracts */}
            <div className="bg-slate-800 rounded-xl border border-yellow-500/20 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-yellow-500/20 rounded flex items-center justify-center"><i className="fas fa-file-contract text-yellow-400"></i></div>
                    <h3 className="font-bold text-sm uppercase text-yellow-400">Expiring Contracts ({expiringContracts.length})</h3>
                </div>
                {expiringContracts.length === 0 ? (
                    <div className="text-sm text-slate-500 italic">No contracts expiring soon.</div>
                ) : (
                    <div className="space-y-2">
                        {expiringContracts.map(contract => {
                            const daysUntil = Math.floor((new Date(contract.endDate!).getTime() - now) / 86400000);
                            return (
                                <div key={contract.id} className="flex justify-between items-center p-3 bg-black/20 rounded border border-white/5">
                                    <div>
                                        <div className="font-bold text-sm">{contract.title}</div>
                                        <div className="text-xs text-slate-400">{companies.find(c => c.id === contract.companyId)?.name}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-mono text-yellow-400 text-sm">${contract.totalValue.toLocaleString()}</div>
                                        <div className="text-[10px] text-yellow-400 font-bold">{daysUntil}d remaining</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AlertsPanel;
