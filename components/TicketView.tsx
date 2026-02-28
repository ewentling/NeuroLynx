import React, { useState } from 'react';
import { SupportTicket, Company, User } from '../types';

interface TicketViewProps {
    tickets: SupportTicket[];
    companies: Company[];
    users: User[];
    onCreateTicket: () => void;
    onUpdateTicket: (id: string, updates: Partial<SupportTicket>) => void;
}

const PRIORITY_COLORS: Record<string, string> = {
    critical: 'bg-red-500 text-white',
    high: 'bg-orange-500/20 text-orange-400',
    medium: 'bg-yellow-500/20 text-yellow-400',
    low: 'bg-blue-500/20 text-blue-400',
};

const STATUS_COLORS: Record<string, string> = {
    open: 'bg-red-500/20 text-red-400',
    in_progress: 'bg-yellow-500/20 text-yellow-400',
    waiting: 'bg-purple-500/20 text-purple-400',
    resolved: 'bg-green-500/20 text-green-400',
    closed: 'bg-slate-700 text-slate-400',
};

const TicketView: React.FC<TicketViewProps> = ({ tickets, companies, users, onCreateTicket, onUpdateTicket }) => {
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const filtered = statusFilter === 'all' ? tickets : tickets.filter(t => t.status === statusFilter);
    const sorted = [...filtered].sort((a, b) => {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return (priorityOrder[a.priority] ?? 4) - (priorityOrder[b.priority] ?? 4);
    });

    const getSlaRemaining = (deadline: number) => {
        const remaining = deadline - Date.now();
        if (remaining <= 0) return { text: 'BREACHED', color: 'text-red-500 animate-pulse' };
        const hours = Math.floor(remaining / 3600000);
        const mins = Math.floor((remaining % 3600000) / 60000);
        if (hours < 2) return { text: `${hours}h ${mins}m`, color: 'text-red-400' };
        if (hours < 8) return { text: `${hours}h ${mins}m`, color: 'text-yellow-400' };
        return { text: `${hours}h ${mins}m`, color: 'text-green-400' };
    };

    const openCount = tickets.filter(t => t.status === 'open').length;
    const criticalCount = tickets.filter(t => t.priority === 'critical' && t.status !== 'resolved' && t.status !== 'closed').length;
    const breachedCount = tickets.filter(t => t.slaDeadline < Date.now() && t.status !== 'resolved' && t.status !== 'closed').length;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Support Tickets</h2>
                <div className="flex gap-2">
                    <select className="bg-slate-800 border border-white/10 rounded px-3 py-2 text-xs font-bold" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                        <option value="all">All Status</option>
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="waiting">Waiting</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                    </select>
                    <button onClick={onCreateTicket} className="px-4 py-2 bg-orange-600 rounded text-xs font-bold hover:bg-orange-500">
                        <i className="fas fa-plus mr-2"></i>New Ticket
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-800 p-4 rounded-xl border border-red-500/20 text-center">
                    <div className="text-2xl font-bold text-red-400">{openCount}</div>
                    <div className="text-[10px] uppercase text-slate-500 font-bold">Open</div>
                </div>
                <div className="bg-slate-800 p-4 rounded-xl border border-orange-500/20 text-center">
                    <div className="text-2xl font-bold text-orange-400">{criticalCount}</div>
                    <div className="text-[10px] uppercase text-slate-500 font-bold">Critical</div>
                </div>
                <div className="bg-slate-800 p-4 rounded-xl border border-yellow-500/20 text-center">
                    <div className="text-2xl font-bold text-yellow-400">{breachedCount}</div>
                    <div className="text-[10px] uppercase text-slate-500 font-bold">SLA Breached</div>
                </div>
            </div>

            <div className="space-y-3">
                {sorted.map(ticket => {
                    const company = companies.find(c => c.id === ticket.companyId);
                    const assignee = users.find(u => u.id === ticket.assignedTo);
                    const sla = ticket.status !== 'resolved' && ticket.status !== 'closed' ? getSlaRemaining(ticket.slaDeadline) : null;

                    return (
                        <div key={ticket.id} className="bg-slate-800 p-4 rounded-xl border border-white/5 hover:border-white/15 transition-all">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${PRIORITY_COLORS[ticket.priority]} ${ticket.priority === 'critical' ? 'status-pulse shadow-[0_0_10px_rgba(239,68,68,0.4)]' : ''}`}>{ticket.priority}</span>
                                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${STATUS_COLORS[ticket.status]}`}>{ticket.status.replace('_', ' ')}</span>
                                    <span className="px-2 py-0.5 rounded bg-slate-700 text-[10px] uppercase font-bold text-slate-300">{ticket.category.replace('_', ' ')}</span>
                                </div>
                                {sla && <div className={`font-mono text-xs font-bold ${sla.color}`}><i className="fas fa-clock mr-1"></i>SLA: {sla.text}</div>}
                            </div>
                            <div className="font-bold text-sm mb-1">{ticket.title}</div>
                            <div className="text-xs text-slate-400 mb-3">{ticket.description}</div>
                            <div className="flex justify-between items-center text-xs text-slate-500">
                                <div className="flex items-center gap-4">
                                    {company && <span><i className="fas fa-building mr-1"></i>{company.name}</span>}
                                    <span><i className="fas fa-user mr-1"></i>{ticket.reportedBy}</span>
                                    {assignee && <span><i className="fas fa-user-cog mr-1"></i>{assignee.name}</span>}
                                </div>
                                <div className="flex gap-1">
                                    {ticket.status === 'open' && (
                                        <button onClick={() => onUpdateTicket(ticket.id, { status: 'in_progress' })} className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-[10px] font-bold hover:bg-yellow-500/30">Start</button>
                                    )}
                                    {(ticket.status === 'in_progress' || ticket.status === 'waiting') && (
                                        <button onClick={() => onUpdateTicket(ticket.id, { status: 'resolved', resolvedAt: Date.now() })} className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-[10px] font-bold hover:bg-green-500/30">Resolve</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TicketView;
