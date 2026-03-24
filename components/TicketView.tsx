import React, { useState } from 'react';
import { SupportTicket, Company, User, TicketStatusNote } from '../types';

interface TicketViewProps {
    tickets: SupportTicket[];
    companies: Company[];
    users: User[];
    currentUser?: User;
    onCreateTicket: () => void;
    onUpdateTicket: (id: string, updates: Partial<SupportTicket>) => void;
    onSendTicketEmail?: (ticketId: string, noteContent: string, clientEmail: string) => void;
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

const TicketView: React.FC<TicketViewProps> = ({ tickets, companies, users, currentUser, onCreateTicket, onUpdateTicket, onSendTicketEmail }) => {
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);
    const [newNoteContent, setNewNoteContent] = useState<string>('');
    const [emailToClient, setEmailToClient] = useState<boolean>(false);
    const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
    const [editingNoteContent, setEditingNoteContent] = useState<string>('');
    
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

    const handleAddNote = (ticketId: string) => {
        if (!newNoteContent.trim()) return;
        
        const ticket = tickets.find(t => t.id === ticketId);
        if (!ticket) return;

        const newNote: TicketStatusNote = {
            id: `note_${Date.now()}`,
            content: newNoteContent.trim(),
            createdBy: currentUser?.name || 'System',
            createdAt: Date.now(),
            emailedToClient: emailToClient && !!ticket.reportedByEmail
        };

        const existingNotes = ticket.statusNotes || [];
        onUpdateTicket(ticketId, { statusNotes: [...existingNotes, newNote] });

        // Send email if checkbox is checked and client email exists
        if (emailToClient && ticket.reportedByEmail && onSendTicketEmail) {
            onSendTicketEmail(ticketId, newNoteContent.trim(), ticket.reportedByEmail);
        }

        setNewNoteContent('');
        setEmailToClient(false);
    };

    const handleEditNote = (ticketId: string, noteId: string) => {
        if (!editingNoteContent.trim()) return;
        
        const ticket = tickets.find(t => t.id === ticketId);
        if (!ticket || !ticket.statusNotes) return;

        const updatedNotes = ticket.statusNotes.map(note => 
            note.id === noteId 
                ? { ...note, content: editingNoteContent.trim() } 
                : note
        );

        onUpdateTicket(ticketId, { statusNotes: updatedNotes });
        setEditingNoteId(null);
        setEditingNoteContent('');
    };

    const startEditNote = (note: TicketStatusNote) => {
        setEditingNoteId(note.id);
        setEditingNoteContent(note.content);
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
                    const isExpanded = expandedTicketId === ticket.id;
                    const statusNotes = ticket.statusNotes || [];

                    return (
                        <div key={ticket.id} className="bg-slate-800 rounded-xl border border-white/5 hover:border-white/15 transition-all">
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${PRIORITY_COLORS[ticket.priority]} ${ticket.priority === 'critical' ? 'status-pulse shadow-[0_0_10px_rgba(239,68,68,0.4)]' : ''}`}>{ticket.priority}</span>
                                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${STATUS_COLORS[ticket.status]}`}>{ticket.status.replace('_', ' ')}</span>
                                        <span className="px-2 py-0.5 rounded bg-slate-700 text-[10px] uppercase font-bold text-slate-300">{ticket.category.replace('_', ' ')}</span>
                                        {statusNotes.length > 0 && (
                                            <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-[10px] font-bold text-cyan-400">
                                                <i className="fas fa-sticky-note mr-1"></i>{statusNotes.length} notes
                                            </span>
                                        )}
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
                                        <button 
                                            onClick={() => setExpandedTicketId(isExpanded ? null : ticket.id)} 
                                            className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-[10px] font-bold hover:bg-cyan-500/30"
                                        >
                                            <i className={`fas fa-${isExpanded ? 'chevron-up' : 'sticky-note'} mr-1`}></i>
                                            {isExpanded ? 'Close' : 'Notes'}
                                        </button>
                                        {ticket.status === 'open' && (
                                            <button onClick={() => onUpdateTicket(ticket.id, { status: 'in_progress' })} className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-[10px] font-bold hover:bg-yellow-500/30">Start</button>
                                        )}
                                        {(ticket.status === 'in_progress' || ticket.status === 'waiting') && (
                                            <button onClick={() => onUpdateTicket(ticket.id, { status: 'resolved', resolvedAt: Date.now() })} className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-[10px] font-bold hover:bg-green-500/30">Resolve</button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Status Notes Section */}
                            {isExpanded && (
                                <div className="border-t border-white/5 p-4 bg-slate-900/50">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">
                                        <i className="fas fa-history mr-1"></i>Status Notes
                                    </h4>

                                    {/* Existing Notes */}
                                    {statusNotes.length > 0 && (
                                        <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                                            {statusNotes.map(note => (
                                                <div key={note.id} className="p-3 bg-slate-800 rounded-lg border border-white/5">
                                                    {editingNoteId === note.id ? (
                                                        <div className="space-y-2">
                                                            <textarea
                                                                value={editingNoteContent}
                                                                onChange={e => setEditingNoteContent(e.target.value)}
                                                                className="w-full bg-slate-700 border border-white/10 rounded p-2 text-sm resize-none"
                                                                rows={2}
                                                            />
                                                            <div className="flex gap-2">
                                                                <button 
                                                                    onClick={() => handleEditNote(ticket.id, note.id)}
                                                                    className="px-2 py-1 bg-green-600 text-white rounded text-[10px] font-bold hover:bg-green-500"
                                                                >
                                                                    Save
                                                                </button>
                                                                <button 
                                                                    onClick={() => { setEditingNoteId(null); setEditingNoteContent(''); }}
                                                                    className="px-2 py-1 bg-slate-600 text-white rounded text-[10px] font-bold hover:bg-slate-500"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div className="text-sm text-slate-200 mb-2">{note.content}</div>
                                                            <div className="flex justify-between items-center text-[10px] text-slate-500">
                                                                <div className="flex items-center gap-2">
                                                                    <span><i className="fas fa-user mr-1"></i>{note.createdBy}</span>
                                                                    <span><i className="fas fa-clock mr-1"></i>{new Date(note.createdAt).toLocaleString()}</span>
                                                                    {note.emailedToClient && (
                                                                        <span className="text-green-400"><i className="fas fa-envelope-check mr-1"></i>Emailed</span>
                                                                    )}
                                                                </div>
                                                                <button 
                                                                    onClick={() => startEditNote(note)}
                                                                    className="text-cyan-400 hover:text-cyan-300"
                                                                >
                                                                    <i className="fas fa-edit"></i>
                                                                </button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {statusNotes.length === 0 && (
                                        <div className="text-xs text-slate-500 text-center py-4 mb-4">
                                            No status notes yet. Add one below.
                                        </div>
                                    )}

                                    {/* Add New Note */}
                                    <div className="space-y-2">
                                        <textarea
                                            value={newNoteContent}
                                            onChange={e => setNewNoteContent(e.target.value)}
                                            placeholder="Add a status note..."
                                            className="w-full bg-slate-800 border border-white/10 rounded p-3 text-sm resize-none placeholder-slate-500"
                                            rows={2}
                                        />
                                        <div className="flex justify-between items-center">
                                            <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={emailToClient}
                                                    onChange={e => setEmailToClient(e.target.checked)}
                                                    className="rounded bg-slate-700 border-white/20 text-cyan-500 focus:ring-cyan-500"
                                                    disabled={!ticket.reportedByEmail}
                                                />
                                                <span className={!ticket.reportedByEmail ? 'line-through opacity-50' : ''}>
                                                    <i className="fas fa-envelope mr-1"></i>
                                                    Email copy to client
                                                    {!ticket.reportedByEmail && <span className="text-yellow-500 ml-1">(no email on file)</span>}
                                                </span>
                                            </label>
                                            <button 
                                                onClick={() => handleAddNote(ticket.id)}
                                                disabled={!newNoteContent.trim()}
                                                className="px-3 py-1.5 bg-cyan-600 text-white rounded text-xs font-bold hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <i className="fas fa-plus mr-1"></i>Add Note
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TicketView;
