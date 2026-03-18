import React, { useState } from 'react';

interface LeadEmail {
    id: string;
    from: string;
    email: string;
    subject: string;
    message: string;
    date: string;
    source: string;
    status: 'new' | 'read' | 'replied' | 'converted' | 'archived';
    priority: 'high' | 'medium' | 'low';
    company?: string;
    phone?: string;
}

type LeadFolder = 'inbox' | 'replied' | 'converted' | 'archive';

interface CommunicationsViewProps {
    commFolder: LeadFolder;
    onSetCommFolder: (folder: LeadFolder) => void;
    onDraftEmail: () => void;
}

// Mock lead emails for demonstration
const MOCK_LEAD_EMAILS: LeadEmail[] = [
    {
        id: '1',
        from: 'John Smith',
        email: 'john.smith@acmecorp.com',
        subject: 'Interested in Enterprise Solution',
        message: 'Hi, I came across your website and I\'m interested in learning more about your enterprise solutions. We have a team of 50+ and need a comprehensive CRM...',
        date: '2024-03-18T14:30:00Z',
        source: 'Website Contact Form',
        status: 'new',
        priority: 'high',
        company: 'Acme Corporation',
        phone: '+1 (555) 123-4567'
    },
    {
        id: '2',
        from: 'Sarah Johnson',
        email: 'sarah.j@techstart.io',
        subject: 'Demo Request - Startup Plan',
        message: 'We\'re a growing startup looking for a scalable solution. Would love to schedule a demo to see how your platform can help us...',
        date: '2024-03-18T11:15:00Z',
        source: 'Landing Page',
        status: 'read',
        priority: 'medium',
        company: 'TechStart.io'
    },
    {
        id: '3',
        from: 'Michael Chen',
        email: 'm.chen@globalindustries.com',
        subject: 'Partnership Inquiry',
        message: 'Our company is looking for strategic partnerships in the AI/CRM space. I\'d like to discuss potential collaboration opportunities...',
        date: '2024-03-17T09:45:00Z',
        source: 'Website Contact Form',
        status: 'replied',
        priority: 'high',
        company: 'Global Industries Ltd'
    }
];

type PriorityFilter = 'all' | LeadEmail['priority'];

const isValidPriorityFilter = (value: string): value is PriorityFilter => {
    return ['all', 'high', 'medium', 'low'].includes(value);
};

const CommunicationsView: React.FC<CommunicationsViewProps> = ({
    commFolder, onSetCommFolder, onDraftEmail
}) => {
    // Lead emails - in production, this would come from props or API
    const leadEmails = MOCK_LEAD_EMAILS;
    const [selectedLead, setSelectedLead] = useState<LeadEmail | null>(null);
    const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');

    // Filter leads based on selected folder/status
    const filteredLeads = leadEmails.filter(lead => {
        if (commFolder === 'inbox') return lead.status === 'new' || lead.status === 'read';
        if (commFolder === 'replied') return lead.status === 'replied';
        if (commFolder === 'converted') return lead.status === 'converted';
        if (commFolder === 'archive') return lead.status === 'archived';
        return true;
    });

    const getStatusColor = (status: LeadEmail['status']) => {
        switch (status) {
            case 'new': return 'bg-green-500';
            case 'read': return 'bg-blue-500';
            case 'replied': return 'bg-yellow-500';
            case 'converted': return 'bg-purple-500';
            case 'archived': return 'bg-slate-500';
            default: return 'bg-slate-500';
        }
    };

    const getPriorityBadge = (priority: LeadEmail['priority']) => {
        switch (priority) {
            case 'high': return <span className="px-2 py-0.5 text-[10px] font-bold bg-red-500/20 text-red-400 rounded-full">HIGH</span>;
            case 'medium': return <span className="px-2 py-0.5 text-[10px] font-bold bg-yellow-500/20 text-yellow-400 rounded-full">MED</span>;
            case 'low': return <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-500/20 text-slate-400 rounded-full">LOW</span>;
            default: return null;
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const folders: { key: LeadFolder; label: string; icon: string; count: number }[] = [
        { key: 'inbox', label: 'New Leads', icon: 'fa-inbox', count: leadEmails.filter(l => l.status === 'new' || l.status === 'read').length },
        { key: 'replied', label: 'Replied', icon: 'fa-reply', count: leadEmails.filter(l => l.status === 'replied').length },
        { key: 'converted', label: 'Converted', icon: 'fa-check-circle', count: leadEmails.filter(l => l.status === 'converted').length },
        { key: 'archive', label: 'Archive', icon: 'fa-box-archive', count: leadEmails.filter(l => l.status === 'archived').length },
    ];

    return (
        <div className="space-y-6 h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Leads Messages</h2>
                    <p className="text-sm text-slate-400 mt-1">Monitor and manage lead emails from your website</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-slate-700 rounded text-xs font-bold whitespace-nowrap hover:bg-slate-600 transition-colors">
                        <i className="fas fa-cog mr-2"></i> Mailbox Settings
                    </button>
                    <button className="px-4 py-2 bg-slate-700 rounded text-xs font-bold whitespace-nowrap hover:bg-slate-600 transition-colors">
                        <i className="fas fa-sync-alt mr-2"></i> Sync Now
                    </button>
                    <button onClick={onDraftEmail} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded text-xs font-bold whitespace-nowrap shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all">
                        <i className="fas fa-pen-fancy mr-2"></i> Reply to Lead
                    </button>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5">
                    <div className="text-2xl font-bold text-green-400">{leadEmails.filter(l => l.status === 'new').length}</div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">New Today</div>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5">
                    <div className="text-2xl font-bold text-blue-400">{leadEmails.filter(l => l.status === 'read').length}</div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Pending Response</div>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5">
                    <div className="text-2xl font-bold text-yellow-400">{leadEmails.filter(l => l.status === 'replied').length}</div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Replied</div>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5">
                    <div className="text-2xl font-bold text-purple-400">{leadEmails.filter(l => l.status === 'converted').length}</div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Converted</div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Folder Sidebar */}
                <div className="w-52 flex-shrink-0 space-y-1">
                    {folders.map(folder => (
                        <button
                            key={folder.key}
                            onClick={() => onSetCommFolder(folder.key)}
                            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-between ${commFolder === folder.key ? 'bg-orange-600/10 text-orange-400 border border-orange-500/20' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
                        >
                            <span>
                                <i className={`fas ${folder.icon} mr-3`}></i> {folder.label}
                            </span>
                            {folder.count > 0 && (
                                <span className={`px-2 py-0.5 rounded-full text-[10px] ${commFolder === folder.key ? 'bg-orange-500/20' : 'bg-slate-700'}`}>
                                    {folder.count}
                                </span>
                            )}
                        </button>
                    ))}

                    {/* Mailbox Configuration */}
                    <div className="mt-6 pt-6 border-t border-white/5">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Mailbox Config</div>
                        <div className="bg-slate-800/30 rounded-xl p-3 border border-white/5">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                <span className="text-xs text-slate-400">Connected</span>
                            </div>
                            <div className="text-[10px] text-slate-500">leads@yourcompany.com</div>
                            <div className="text-[10px] text-slate-600 mt-1">Last sync: 2 min ago</div>
                        </div>
                    </div>
                </div>

                {/* Email List */}
                <div className="flex-1 bg-slate-800 rounded-2xl border border-white/5 overflow-hidden flex flex-col">
                    {/* List Header */}
                    <div className="p-3 border-b border-white/5 flex items-center justify-between bg-slate-800/50">
                        <div className="text-xs text-slate-400">
                            {filteredLeads.length} lead{filteredLeads.length !== 1 ? 's' : ''} in {folders.find(f => f.key === commFolder)?.label || 'Inbox'}
                        </div>
                        <select 
                            className="text-xs bg-slate-700 border border-white/10 rounded px-2 py-1 text-slate-300"
                            value={priorityFilter}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (isValidPriorityFilter(value)) {
                                    setPriorityFilter(value);
                                }
                            }}
                        >
                            <option value="all">All Priorities</option>
                            <option value="high">High Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="low">Low Priority</option>
                        </select>
                    </div>

                    {/* Email Items */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {filteredLeads.filter(l => priorityFilter === 'all' || l.priority === priorityFilter).map(lead => (
                            <div 
                                key={lead.id} 
                                onClick={() => setSelectedLead(lead)}
                                className={`p-4 border-b border-white/5 hover:bg-white/5 transition-all group cursor-pointer ${selectedLead?.id === lead.id ? 'bg-orange-500/10 border-l-2 border-l-orange-500' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${getStatusColor(lead.status)}`}></div>
                                        <div className="font-bold text-sm text-white">{lead.from}</div>
                                        {lead.status === 'new' && (
                                            <span className="px-1.5 py-0.5 text-[9px] font-bold bg-green-500/20 text-green-400 rounded">NEW</span>
                                        )}
                                        {getPriorityBadge(lead.priority)}
                                    </div>
                                    <div className="text-[10px] text-slate-500 font-mono">{formatDate(lead.date)}</div>
                                </div>
                                <div className="text-xs text-cyan-400 mb-1 font-medium">{lead.subject}</div>
                                <div className="text-xs text-slate-400 line-clamp-1">{lead.message}</div>
                                <div className="flex items-center gap-3 mt-2">
                                    {lead.company && (
                                        <span className="text-[10px] text-slate-500">
                                            <i className="fas fa-building mr-1"></i> {lead.company}
                                        </span>
                                    )}
                                    <span className="text-[10px] text-slate-500">
                                        <i className="fas fa-globe mr-1"></i> {lead.source}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {filteredLeads.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-slate-500 p-12">
                                <i className="fas fa-envelope-open text-4xl mb-4 opacity-20"></i>
                                <div className="font-bold uppercase tracking-widest text-xs">No Lead Messages Found</div>
                                <p className="text-xs text-slate-600 mt-2 text-center max-w-xs">
                                    Lead emails from your website contact form will appear here automatically
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Lead Detail Panel */}
                {selectedLead && (
                    <div className="w-96 flex-shrink-0 bg-slate-800 rounded-2xl border border-white/5 overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-white/5 bg-slate-800/50">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-bold text-lg">{selectedLead.from}</h3>
                                <button 
                                    onClick={() => setSelectedLead(null)}
                                    className="text-slate-500 hover:text-white transition-colors"
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                            <div className="text-xs text-slate-400">{selectedLead.email}</div>
                            {selectedLead.phone && (
                                <div className="text-xs text-slate-400 mt-1">
                                    <i className="fas fa-phone mr-1"></i> {selectedLead.phone}
                                </div>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
                            {/* Lead Info */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-500 uppercase tracking-wider">Company</span>
                                    <span className="text-sm text-white">{selectedLead.company || 'Not provided'}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-500 uppercase tracking-wider">Source</span>
                                    <span className="text-sm text-cyan-400">{selectedLead.source}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-500 uppercase tracking-wider">Priority</span>
                                    {getPriorityBadge(selectedLead.priority)}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-500 uppercase tracking-wider">Status</span>
                                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${getStatusColor(selectedLead.status)} bg-opacity-20 text-white`}>
                                        {selectedLead.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            {/* Message Content */}
                            <div className="border-t border-white/5 pt-4">
                                <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Subject</div>
                                <div className="text-sm font-medium text-cyan-400 mb-4">{selectedLead.subject}</div>
                                <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Message</div>
                                <div className="text-sm text-slate-300 leading-relaxed">{selectedLead.message}</div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-4 border-t border-white/5 space-y-2">
                            <button className="w-full py-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded text-xs font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all">
                                <i className="fas fa-reply mr-2"></i> Reply to Lead
                            </button>
                            <div className="flex gap-2">
                                <button className="flex-1 py-2 bg-green-600/20 text-green-400 rounded text-xs font-bold hover:bg-green-600/30 transition-colors">
                                    <i className="fas fa-user-plus mr-1"></i> Convert
                                </button>
                                <button className="flex-1 py-2 bg-slate-700 rounded text-xs font-bold hover:bg-slate-600 transition-colors">
                                    <i className="fas fa-archive mr-1"></i> Archive
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommunicationsView;
