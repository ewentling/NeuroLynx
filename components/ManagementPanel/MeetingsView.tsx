import React, { useState, useMemo } from 'react';
import { Meeting, Company, Task } from '../../types';

interface MeetingsViewProps {
    meetings: Meeting[];
    companies: Company[];
    selectedCompanyId?: string;
    isLiveMeeting: boolean;
    onToggleLiveMeeting: (status: boolean) => void;
    onLogMeeting: () => void;
    onAddToast: (type: any, msg: string) => void;
    onScheduleMeeting?: (meeting: Partial<Meeting>) => void;
    onAddTaskFromMeeting?: (task: Omit<Task, 'id'>) => void;
    onUpdateMeeting?: (id: string, updates: Partial<Meeting>) => void;
    onDeleteMeeting?: (id: string) => void;
}

type ViewMode = 'grid' | 'list' | 'analytics';
type FilterStatus = 'all' | 'scheduled' | 'completed' | 'processing';
type FilterSentiment = 'all' | 'positive' | 'neutral' | 'negative';

const MeetingsView: React.FC<MeetingsViewProps> = ({
    meetings,
    companies,
    selectedCompanyId,
    isLiveMeeting,
    onToggleLiveMeeting,
    onLogMeeting,
    onAddToast,
    onScheduleMeeting,
    onAddTaskFromMeeting,
    onUpdateMeeting,
    onDeleteMeeting
}) => {
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
    const [showTranscriptModal, setShowTranscriptModal] = useState(false);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
    const [filterSentiment, setFilterSentiment] = useState<FilterSentiment>('all');
    const [selectedActionItems, setSelectedActionItems] = useState<Set<string>>(new Set());
    
    // Schedule form state
    const [scheduleForm, setScheduleForm] = useState({
        title: '',
        date: '',
        time: '',
        type: 'video' as Meeting['type'],
        clientId: selectedCompanyId || '',
        link: '',
        attendees: ''
    });

    // Filter and search meetings
    const filteredMeetings = useMemo(() => {
        let result = meetings;
        
        // Company filter
        if (selectedCompanyId && selectedCompanyId !== 'all') {
            result = result.filter(m => m.clientId === selectedCompanyId);
        }
        
        // Status filter
        if (filterStatus !== 'all') {
            result = result.filter(m => m.status === filterStatus);
        }
        
        // Sentiment filter
        if (filterSentiment !== 'all') {
            result = result.filter(m => m.sentiment === filterSentiment);
        }
        
        // Search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(m => 
                m.title.toLowerCase().includes(query) ||
                m.summary.toLowerCase().includes(query) ||
                m.transcript.toLowerCase().includes(query)
            );
        }
        
        // Sort by date (most recent first)
        return result.sort((a, b) => b.date - a.date);
    }, [meetings, selectedCompanyId, filterStatus, filterSentiment, searchQuery]);

    // Analytics calculations
    const analytics = useMemo(() => {
        const completed = meetings.filter(m => m.status === 'completed');
        const totalDuration = completed.reduce((sum, m) => sum + (m.duration || 0), 0);
        const avgDuration = completed.length > 0 ? totalDuration / completed.length : 0;
        
        const sentiments = {
            positive: completed.filter(m => m.sentiment === 'positive').length,
            neutral: completed.filter(m => m.sentiment === 'neutral').length,
            negative: completed.filter(m => m.sentiment === 'negative').length
        };
        
        const totalActionItems = completed.reduce((sum, m) => sum + (m.actionItems?.length || 0), 0);
        const upcomingMeetings = meetings.filter(m => m.status === 'scheduled').length;
        
        return {
            totalMeetings: meetings.length,
            completed: completed.length,
            upcoming: upcomingMeetings,
            avgDuration,
            sentiments,
            totalActionItems
        };
    }, [meetings]);

    const handleScheduleMeeting = () => {
        if (!scheduleForm.title || !scheduleForm.date) {
            onAddToast('error', 'Please fill in meeting title and date');
            return;
        }
        
        const newMeeting: Partial<Meeting> = {
            title: scheduleForm.title,
            date: new Date(`${scheduleForm.date}T${scheduleForm.time || '09:00'}`).getTime(),
            time: scheduleForm.time || '09:00',
            type: scheduleForm.type,
            clientId: scheduleForm.clientId || undefined,
            link: scheduleForm.link || undefined,
            attendees: scheduleForm.attendees.split(',').map(a => a.trim()).filter(Boolean),
            status: 'scheduled',
            summary: 'Meeting scheduled',
            transcript: '',
            duration: 0
        };
        
        if (onScheduleMeeting) {
            onScheduleMeeting(newMeeting);
            onAddToast('success', 'Meeting scheduled successfully');
        }
        setShowScheduleModal(false);
        setScheduleForm({ title: '', date: '', time: '', type: 'video', clientId: selectedCompanyId || '', link: '', attendees: '' });
    };

    const handleAddActionItemsAsTasks = () => {
        if (!selectedMeeting || selectedActionItems.size === 0) return;
        
        selectedActionItems.forEach(item => {
            onAddTaskFromMeeting?.({
                title: item,
                description: `From meeting: ${selectedMeeting.title}`,
                status: 'todo',
                priority: 'medium',
                clientId: selectedMeeting.clientId || '',
                source: 'meeting'
            });
        });
        
        onAddToast('success', `${selectedActionItems.size} tasks created from meeting`);
        setSelectedActionItems(new Set());
    };

    const handleExportMeeting = (meeting: Meeting, format: 'txt' | 'json') => {
        const company = companies.find(c => c.id === meeting.clientId);
        
        let content: string;
        let filename: string;
        let mimeType: string;
        
        if (format === 'json') {
            content = JSON.stringify(meeting, null, 2);
            filename = `meeting_${meeting.id}.json`;
            mimeType = 'application/json';
        } else {
            content = `Meeting: ${meeting.title}
Date: ${new Date(meeting.date).toLocaleString()}
Client: ${company?.name || 'Unknown'}
Duration: ${Math.round((meeting.duration || 0) / 60)} minutes
Status: ${meeting.status}
Sentiment: ${meeting.sentiment || 'N/A'}

SUMMARY:
${meeting.summary}

TRANSCRIPT:
${meeting.transcript || 'No transcript available'}

ACTION ITEMS:
${(meeting.actionItems || []).map(item => `• ${item}`).join('\n') || 'None'}

RECOMMENDATIONS:
${(meeting.recommendations || []).map(rec => `• ${rec}`).join('\n') || 'None'}
`;
            filename = `meeting_${meeting.id}.txt`;
            mimeType = 'text/plain';
        }
        
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        onAddToast('success', `Meeting exported as ${format.toUpperCase()}`);
    };

    const getSentimentColor = (sentiment?: string) => {
        switch (sentiment) {
            case 'positive': return 'text-green-400 bg-green-500/20';
            case 'negative': return 'text-red-400 bg-red-500/20';
            default: return 'text-yellow-400 bg-yellow-500/20';
        }
    };

    const getSentimentIcon = (sentiment?: string) => {
        switch (sentiment) {
            case 'positive': return 'fa-smile';
            case 'negative': return 'fa-frown';
            default: return 'fa-meh';
        }
    };

    const formatDuration = (seconds: number) => {
        if (!seconds) return 'N/A';
        const mins = Math.floor(seconds / 60);
        if (mins < 60) return `${mins}m`;
        const hours = Math.floor(mins / 60);
        const remainMins = mins % 60;
        return `${hours}h ${remainMins}m`;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Meeting Intelligence</h2>
                    <p className="text-slate-400 text-sm mt-1">AI-powered meeting insights and transcription</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                    {isLiveMeeting ? (
                        <button onClick={() => onToggleLiveMeeting(false)} className="px-4 py-2 bg-red-600 rounded-lg text-xs font-bold animate-pulse hover:bg-red-500 transition-all">
                            <i className="fas fa-stop mr-2"></i>End Session
                        </button>
                    ) : (
                        <button onClick={() => { onToggleLiveMeeting(true); onAddToast('info', 'Live transcription started...'); }} className="px-4 py-2 bg-green-600 rounded-lg text-xs font-bold hover:bg-green-500 transition-all">
                            <i className="fas fa-microphone mr-2"></i>Start Live
                        </button>
                    )}
                    <button onClick={() => setShowScheduleModal(true)} className="px-4 py-2 bg-cyan-600 rounded-lg text-xs font-bold hover:bg-cyan-500 transition-all">
                        <i className="fas fa-calendar-plus mr-2"></i>Schedule
                    </button>
                    <button onClick={onLogMeeting} className="px-4 py-2 bg-orange-600 rounded-lg text-xs font-bold hover:bg-orange-500 transition-all">
                        <i className="fas fa-file-alt mr-2"></i>Log Meeting
                    </button>
                </div>
            </div>

            {/* Analytics Dashboard */}
            {viewMode === 'analytics' && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <div className="bg-slate-800 rounded-xl border border-white/5 p-4">
                        <div className="text-2xl font-bold text-cyan-400">{analytics.totalMeetings}</div>
                        <div className="text-xs text-slate-400">Total Meetings</div>
                    </div>
                    <div className="bg-slate-800 rounded-xl border border-white/5 p-4">
                        <div className="text-2xl font-bold text-green-400">{analytics.completed}</div>
                        <div className="text-xs text-slate-400">Completed</div>
                    </div>
                    <div className="bg-slate-800 rounded-xl border border-white/5 p-4">
                        <div className="text-2xl font-bold text-yellow-400">{analytics.upcoming}</div>
                        <div className="text-xs text-slate-400">Upcoming</div>
                    </div>
                    <div className="bg-slate-800 rounded-xl border border-white/5 p-4">
                        <div className="text-2xl font-bold text-purple-400">{formatDuration(analytics.avgDuration)}</div>
                        <div className="text-xs text-slate-400">Avg Duration</div>
                    </div>
                    <div className="bg-slate-800 rounded-xl border border-white/5 p-4">
                        <div className="text-2xl font-bold text-orange-400">{analytics.totalActionItems}</div>
                        <div className="text-xs text-slate-400">Action Items</div>
                    </div>
                    <div className="bg-slate-800 rounded-xl border border-white/5 p-4">
                        <div className="flex items-center gap-2">
                            <span className="text-green-400 text-sm"><i className="fas fa-smile"></i> {analytics.sentiments.positive}</span>
                            <span className="text-yellow-400 text-sm"><i className="fas fa-meh"></i> {analytics.sentiments.neutral}</span>
                            <span className="text-red-400 text-sm"><i className="fas fa-frown"></i> {analytics.sentiments.negative}</span>
                        </div>
                        <div className="text-xs text-slate-400 mt-1">Sentiment Breakdown</div>
                    </div>
                </div>
            )}

            {/* Live Meeting Panel */}
            {isLiveMeeting && (
                <div className="bg-slate-800 rounded-xl border border-red-500/50 p-6 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-shimmer"></div>
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                            <span className="text-red-400 font-bold uppercase text-xs tracking-widest">Live Recording</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="font-mono text-slate-400">00:{new Date().getSeconds().toString().padStart(2, '0')}</div>
                            <button className="text-xs text-slate-400 hover:text-white"><i className="fas fa-expand"></i></button>
                        </div>
                    </div>
                    <div className="h-48 overflow-y-auto bg-black/30 rounded p-4 font-mono text-sm space-y-2 border border-white/5">
                        <div className="text-slate-500 italic">Listening for speech...</div>
                        <div className="text-cyan-400">Client: "We are looking to scale our operations by Q3."</div>
                        <div className="text-white">You: "That aligns perfectly with our enterprise tier."</div>
                        <div className="text-cyan-400">Client: "What about security compliance?"</div>
                        <div className="text-slate-500 italic text-xs mt-2 border-t border-white/5 pt-2">
                            <i className="fas fa-robot text-purple-400 mr-2"></i>
                            AI Note: Potential objection detected regarding security. Suggest mentioning SOC2 compliance.
                        </div>
                    </div>
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5">
                        <div className="flex-1 flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-slate-400">Voice detected</span>
                        </div>
                        <button className="text-xs text-slate-400 hover:text-white"><i className="fas fa-pause mr-1"></i>Pause</button>
                        <button className="text-xs text-slate-400 hover:text-white"><i className="fas fa-bookmark mr-1"></i>Mark Important</button>
                    </div>
                </div>
            )}

            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                        <input
                            type="text"
                            placeholder="Search meetings..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-sm w-64 focus:border-cyan-500 focus:outline-none"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                        className="px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-sm"
                    >
                        <option value="all">All Status</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="processing">Processing</option>
                    </select>
                    <select
                        value={filterSentiment}
                        onChange={(e) => setFilterSentiment(e.target.value as FilterSentiment)}
                        className="px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-sm"
                    >
                        <option value="all">All Sentiment</option>
                        <option value="positive">Positive</option>
                        <option value="neutral">Neutral</option>
                        <option value="negative">Negative</option>
                    </select>
                </div>
                <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1 border border-white/10">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`px-3 py-1 rounded text-xs font-bold transition-all ${viewMode === 'grid' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        <i className="fas fa-th-large"></i>
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`px-3 py-1 rounded text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        <i className="fas fa-list"></i>
                    </button>
                    <button
                        onClick={() => setViewMode('analytics')}
                        className={`px-3 py-1 rounded text-xs font-bold transition-all ${viewMode === 'analytics' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        <i className="fas fa-chart-bar"></i>
                    </button>
                </div>
            </div>

            {/* Meetings Grid/List */}
            {filteredMeetings.length === 0 ? (
                <div className="text-center py-16 bg-slate-800/50 rounded-xl border border-white/10">
                    <i className="fas fa-calendar-times text-4xl text-slate-600 mb-4"></i>
                    <p className="text-slate-400 text-lg mb-2">No Meetings Found</p>
                    <p className="text-slate-500 text-sm">Try adjusting your filters or schedule a new meeting</p>
                </div>
            ) : viewMode === 'list' ? (
                <div className="bg-slate-800 rounded-xl border border-white/5 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-900/50">
                            <tr className="text-xs text-slate-400 uppercase">
                                <th className="text-left p-4">Meeting</th>
                                <th className="text-left p-4">Date</th>
                                <th className="text-left p-4">Client</th>
                                <th className="text-left p-4">Duration</th>
                                <th className="text-left p-4">Sentiment</th>
                                <th className="text-left p-4">Status</th>
                                <th className="text-right p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredMeetings.map(m => (
                                <tr key={m.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold">{m.title}</div>
                                        <div className="text-xs text-slate-400 truncate max-w-[200px]">{m.summary}</div>
                                    </td>
                                    <td className="p-4 text-sm">{new Date(m.date).toLocaleDateString()}</td>
                                    <td className="p-4 text-sm">{companies.find(c => c.id === m.clientId)?.name || '-'}</td>
                                    <td className="p-4 text-sm">{formatDuration(m.duration)}</td>
                                    <td className="p-4">
                                        {m.sentiment && (
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${getSentimentColor(m.sentiment)}`}>
                                                <i className={`fas ${getSentimentIcon(m.sentiment)} mr-1`}></i>
                                                {m.sentiment}
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                            m.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                            m.status === 'scheduled' ? 'bg-blue-500/20 text-blue-400' :
                                            'bg-yellow-500/20 text-yellow-400'
                                        }`}>
                                            {m.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => { setSelectedMeeting(m); setShowTranscriptModal(true); }}
                                                className="p-2 rounded hover:bg-white/10 text-slate-400 hover:text-cyan-400"
                                                title="View Details"
                                            >
                                                <i className="fas fa-eye"></i>
                                            </button>
                                            <button 
                                                onClick={() => handleExportMeeting(m, 'txt')}
                                                className="p-2 rounded hover:bg-white/10 text-slate-400 hover:text-green-400"
                                                title="Export"
                                            >
                                                <i className="fas fa-download"></i>
                                            </button>
                                            {onDeleteMeeting && (
                                                <button 
                                                    onClick={() => onDeleteMeeting(m.id)}
                                                    className="p-2 rounded hover:bg-white/10 text-slate-400 hover:text-red-400"
                                                    title="Delete"
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMeetings.map(m => (
                        <div key={m.id} className="p-6 bg-slate-800 rounded-xl border border-white/5 hover:border-purple-500/50 transition-all group relative">
                            {/* Status Badge */}
                            <div className={`absolute top-4 right-4 px-2 py-1 rounded text-[10px] uppercase font-bold ${
                                m.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                m.status === 'scheduled' ? 'bg-blue-500/20 text-blue-400' :
                                'bg-yellow-500/20 text-yellow-400'
                            }`}>
                                {m.status}
                            </div>
                            
                            <div className="flex items-center gap-3 mb-4 pr-20">
                                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                                    {new Date(m.date).getDate()}
                                </div>
                                <div>
                                    <div className="font-bold text-lg">{m.title}</div>
                                    <div className="text-xs text-slate-400">{new Date(m.date).toLocaleDateString()} • {m.time || formatDuration(m.duration)}</div>
                                </div>
                            </div>
                            
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <i className="fas fa-building w-4"></i>
                                    {companies.find(c => c.id === m.clientId)?.name || 'Internal Meeting'}
                                </div>
                                {m.type && (
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <i className={`fas ${m.type === 'video' ? 'fa-video' : m.type === 'phone' ? 'fa-phone' : 'fa-user'} w-4`}></i>
                                        {m.type.charAt(0).toUpperCase() + m.type.slice(1)}
                                    </div>
                                )}
                                {m.sentiment && (
                                    <div className="flex items-center gap-2 text-xs">
                                        <i className={`fas ${getSentimentIcon(m.sentiment)} w-4 ${getSentimentColor(m.sentiment).split(' ')[0]}`}></i>
                                        <span className={getSentimentColor(m.sentiment).split(' ')[0]}>{m.sentiment} sentiment</span>
                                    </div>
                                )}
                            </div>
                            
                            <div className="p-3 bg-black/20 rounded border border-white/5 text-sm text-slate-300 italic mb-4 line-clamp-2">
                                "{m.summary}"
                            </div>
                            
                            {/* Action Items Preview */}
                            {m.actionItems && m.actionItems.length > 0 && (
                                <div className="mb-4 p-3 bg-orange-500/10 rounded border border-orange-500/20">
                                    <div className="text-xs text-orange-400 font-bold mb-2">
                                        <i className="fas fa-tasks mr-1"></i>{m.actionItems.length} Action Items
                                    </div>
                                    <ul className="text-xs text-slate-300 space-y-1">
                                        {m.actionItems.slice(0, 2).map((item, i) => (
                                            <li key={i} className="truncate">• {item}</li>
                                        ))}
                                        {m.actionItems.length > 2 && (
                                            <li className="text-slate-500">+{m.actionItems.length - 2} more</li>
                                        )}
                                    </ul>
                                </div>
                            )}
                            
                            <div className="flex justify-between items-center border-t border-white/5 pt-4">
                                <div className="flex -space-x-2">
                                    {(m.attendees || []).slice(0, 4).map((a, i) => (
                                        <div key={i} className="w-7 h-7 rounded-full bg-slate-600 border-2 border-slate-800 flex items-center justify-center text-[10px] text-white" title={a}>
                                            {a[0]?.toUpperCase()}
                                        </div>
                                    ))}
                                    {(m.attendees?.length || 0) > 4 && (
                                        <div className="w-7 h-7 rounded-full bg-slate-700 border-2 border-slate-800 flex items-center justify-center text-[10px] text-slate-400">
                                            +{(m.attendees?.length || 0) - 4}
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => handleExportMeeting(m, 'txt')}
                                        className="p-2 rounded hover:bg-white/10 text-slate-400 hover:text-green-400 transition-colors"
                                        title="Export"
                                    >
                                        <i className="fas fa-download text-xs"></i>
                                    </button>
                                    <button 
                                        onClick={() => { setSelectedMeeting(m); setShowTranscriptModal(true); }}
                                        className="text-xs text-purple-400 font-bold hover:text-white transition-colors"
                                    >
                                        View Details <i className="fas fa-arrow-right ml-1"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Meeting Details Modal */}
            {showTranscriptModal && selectedMeeting && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 rounded-2xl border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
                        <div className="flex justify-between items-center p-6 border-b border-white/10">
                            <div>
                                <h3 className="text-xl font-bold">{selectedMeeting.title}</h3>
                                <div className="text-sm text-slate-400 mt-1">
                                    {new Date(selectedMeeting.date).toLocaleString()} • 
                                    {companies.find(c => c.id === selectedMeeting.clientId)?.name || 'Internal'}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleExportMeeting(selectedMeeting, 'txt')}
                                    className="px-3 py-2 bg-slate-700 rounded-lg text-xs font-bold hover:bg-slate-600"
                                >
                                    <i className="fas fa-download mr-2"></i>Export TXT
                                </button>
                                <button
                                    onClick={() => handleExportMeeting(selectedMeeting, 'json')}
                                    className="px-3 py-2 bg-slate-700 rounded-lg text-xs font-bold hover:bg-slate-600"
                                >
                                    <i className="fas fa-code mr-2"></i>Export JSON
                                </button>
                                <button
                                    onClick={() => { setShowTranscriptModal(false); setSelectedMeeting(null); setSelectedActionItems(new Set()); }}
                                    className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center"
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                            {/* Meeting Stats */}
                            <div className="grid grid-cols-4 gap-4 mb-6">
                                <div className="bg-slate-900/50 rounded-lg p-4">
                                    <div className="text-xs text-slate-400 uppercase">Duration</div>
                                    <div className="text-xl font-bold text-cyan-400">{formatDuration(selectedMeeting.duration)}</div>
                                </div>
                                <div className="bg-slate-900/50 rounded-lg p-4">
                                    <div className="text-xs text-slate-400 uppercase">Status</div>
                                    <div className={`text-xl font-bold ${
                                        selectedMeeting.status === 'completed' ? 'text-green-400' :
                                        selectedMeeting.status === 'scheduled' ? 'text-blue-400' : 'text-yellow-400'
                                    }`}>
                                        {selectedMeeting.status}
                                    </div>
                                </div>
                                <div className="bg-slate-900/50 rounded-lg p-4">
                                    <div className="text-xs text-slate-400 uppercase">Sentiment</div>
                                    <div className={`text-xl font-bold ${getSentimentColor(selectedMeeting.sentiment).split(' ')[0]}`}>
                                        <i className={`fas ${getSentimentIcon(selectedMeeting.sentiment)} mr-2`}></i>
                                        {selectedMeeting.sentiment || 'N/A'}
                                    </div>
                                </div>
                                <div className="bg-slate-900/50 rounded-lg p-4">
                                    <div className="text-xs text-slate-400 uppercase">Type</div>
                                    <div className="text-xl font-bold text-purple-400">{selectedMeeting.type || 'Meeting'}</div>
                                </div>
                            </div>
                            
                            {/* Summary */}
                            <div className="mb-6">
                                <h4 className="text-sm font-bold text-slate-400 uppercase mb-2">AI Summary</h4>
                                <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-lg p-4 border border-purple-500/20">
                                    <p className="text-slate-200">{selectedMeeting.summary}</p>
                                </div>
                            </div>
                            
                            {/* Action Items */}
                            {selectedMeeting.actionItems && selectedMeeting.actionItems.length > 0 && (
                                <div className="mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="text-sm font-bold text-slate-400 uppercase">
                                            <i className="fas fa-tasks text-orange-400 mr-2"></i>Action Items ({selectedMeeting.actionItems.length})
                                        </h4>
                                        {onAddTaskFromMeeting && selectedActionItems.size > 0 && (
                                            <button
                                                onClick={handleAddActionItemsAsTasks}
                                                className="px-3 py-1 bg-orange-600 rounded text-xs font-bold hover:bg-orange-500"
                                            >
                                                <i className="fas fa-plus mr-1"></i>Add {selectedActionItems.size} as Tasks
                                            </button>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        {selectedMeeting.actionItems.map((item, i) => (
                                            <div key={i} className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg border border-white/5 hover:border-orange-500/30 transition-colors">
                                                {onAddTaskFromMeeting && (
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedActionItems.has(item)}
                                                        onChange={(e) => {
                                                            const newSet = new Set(selectedActionItems);
                                                            if (e.target.checked) {
                                                                newSet.add(item);
                                                            } else {
                                                                newSet.delete(item);
                                                            }
                                                            setSelectedActionItems(newSet);
                                                        }}
                                                        className="w-4 h-4 rounded border-white/20 bg-slate-700"
                                                    />
                                                )}
                                                <span className="flex-1">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {/* Recommendations */}
                            {selectedMeeting.recommendations && selectedMeeting.recommendations.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="text-sm font-bold text-slate-400 uppercase mb-2">
                                        <i className="fas fa-lightbulb text-yellow-400 mr-2"></i>AI Recommendations
                                    </h4>
                                    <div className="space-y-2">
                                        {selectedMeeting.recommendations.map((rec, i) => (
                                            <div key={i} className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                                                <i className="fas fa-star text-yellow-400 mr-2"></i>{rec}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {/* Transcript */}
                            <div>
                                <h4 className="text-sm font-bold text-slate-400 uppercase mb-2">
                                    <i className="fas fa-file-alt text-cyan-400 mr-2"></i>Transcript
                                </h4>
                                <div className="bg-black/30 rounded-lg p-4 font-mono text-sm text-slate-300 whitespace-pre-wrap border border-white/5 max-h-64 overflow-y-auto">
                                    {selectedMeeting.transcript || 'No transcript available for this meeting.'}
                                </div>
                            </div>
                            
                            {/* Attendees */}
                            {selectedMeeting.attendees && selectedMeeting.attendees.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-white/10">
                                    <h4 className="text-sm font-bold text-slate-400 uppercase mb-3">
                                        <i className="fas fa-users text-blue-400 mr-2"></i>Attendees ({selectedMeeting.attendees.length})
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedMeeting.attendees.map((attendee, i) => (
                                            <div key={i} className="flex items-center gap-2 px-3 py-2 bg-slate-700 rounded-lg">
                                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-xs font-bold">
                                                    {attendee[0]?.toUpperCase()}
                                                </div>
                                                <span className="text-sm">{attendee}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Schedule Meeting Modal */}
            {showScheduleModal && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 rounded-2xl border border-white/10 w-full max-w-md p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Schedule Meeting</h3>
                            <button
                                onClick={() => setShowScheduleModal(false)}
                                className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Meeting Title *</label>
                                <input
                                    type="text"
                                    value={scheduleForm.title}
                                    onChange={(e) => setScheduleForm(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="e.g., Project Kickoff"
                                    className="w-full px-4 py-3 bg-slate-700 border border-white/10 rounded-lg focus:border-cyan-500 focus:outline-none"
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Date *</label>
                                    <input
                                        type="date"
                                        value={scheduleForm.date}
                                        onChange={(e) => setScheduleForm(prev => ({ ...prev, date: e.target.value }))}
                                        className="w-full px-4 py-3 bg-slate-700 border border-white/10 rounded-lg focus:border-cyan-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Time</label>
                                    <input
                                        type="time"
                                        value={scheduleForm.time}
                                        onChange={(e) => setScheduleForm(prev => ({ ...prev, time: e.target.value }))}
                                        className="w-full px-4 py-3 bg-slate-700 border border-white/10 rounded-lg focus:border-cyan-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Meeting Type</label>
                                <select
                                    value={scheduleForm.type}
                                    onChange={(e) => setScheduleForm(prev => ({ ...prev, type: e.target.value as Meeting['type'] }))}
                                    className="w-full px-4 py-3 bg-slate-700 border border-white/10 rounded-lg focus:border-cyan-500 focus:outline-none"
                                >
                                    <option value="video">Video Call</option>
                                    <option value="phone">Phone Call</option>
                                    <option value="in_person">In Person</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Client</label>
                                <select
                                    value={scheduleForm.clientId}
                                    onChange={(e) => setScheduleForm(prev => ({ ...prev, clientId: e.target.value }))}
                                    className="w-full px-4 py-3 bg-slate-700 border border-white/10 rounded-lg focus:border-cyan-500 focus:outline-none"
                                >
                                    <option value="">Internal Meeting</option>
                                    {companies.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Meeting Link</label>
                                <input
                                    type="url"
                                    value={scheduleForm.link}
                                    onChange={(e) => setScheduleForm(prev => ({ ...prev, link: e.target.value }))}
                                    placeholder="https://meet.google.com/..."
                                    className="w-full px-4 py-3 bg-slate-700 border border-white/10 rounded-lg focus:border-cyan-500 focus:outline-none"
                                />
                            </div>
                            
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Attendees (comma-separated)</label>
                                <input
                                    type="text"
                                    value={scheduleForm.attendees}
                                    onChange={(e) => setScheduleForm(prev => ({ ...prev, attendees: e.target.value }))}
                                    placeholder="John, Jane, Bob"
                                    className="w-full px-4 py-3 bg-slate-700 border border-white/10 rounded-lg focus:border-cyan-500 focus:outline-none"
                                />
                            </div>
                        </div>
                        
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleScheduleMeeting}
                                className="flex-1 px-4 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-bold transition-all"
                            >
                                <i className="fas fa-calendar-plus mr-2"></i>Schedule Meeting
                            </button>
                            <button
                                onClick={() => setShowScheduleModal(false)}
                                className="px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MeetingsView;
