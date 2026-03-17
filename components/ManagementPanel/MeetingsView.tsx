import React from 'react';
import { Meeting, Company } from '../../types';

interface MeetingsViewProps {
    meetings: Meeting[];
    companies: Company[];
    selectedCompanyId?: string;
    isLiveMeeting: boolean;
    onToggleLiveMeeting: (status: boolean) => void;
    onLogMeeting: () => void;
    onAddToast: (type: any, msg: string) => void;
}

const MeetingsView: React.FC<MeetingsViewProps> = ({
    meetings,
    companies,
    selectedCompanyId,
    isLiveMeeting,
    onToggleLiveMeeting,
    onLogMeeting,
    onAddToast
}) => {
    // Filter meetings based on selected company
    const filteredMeetings = selectedCompanyId && selectedCompanyId !== 'all'
        ? meetings.filter(m => m.clientId === selectedCompanyId)
        : meetings;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Meeting Intelligence</h2>
                <div className="flex gap-2">
                    {isLiveMeeting ? (
                        <button onClick={() => onToggleLiveMeeting(false)} className="px-4 py-2 bg-red-600 rounded text-xs font-bold animate-pulse"><i className="fas fa-stop mr-2"></i> End Session</button>
                    ) : (
                        <button onClick={() => { onToggleLiveMeeting(true); onAddToast('info', 'Live transcription started...'); }} className="px-4 py-2 bg-green-600 rounded text-xs font-bold hover:bg-green-500"><i className="fas fa-microphone mr-2"></i> Start Live Session</button>
                    )}
                    <button onClick={onLogMeeting} className="px-4 py-2 bg-orange-600 rounded text-xs font-bold">Log Meeting</button>
                </div>
            </div>

            {isLiveMeeting && (
                <div className="bg-slate-800 rounded-xl border border-red-500/50 p-6 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-shimmer"></div>
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                            <span className="text-red-400 font-bold uppercase text-xs tracking-widest">Live Recording</span>
                        </div>
                        <div className="font-mono text-slate-400">00:{new Date().getSeconds().toString().padStart(2, '0')}</div>
                    </div>
                    <div className="h-48 overflow-y-auto bg-black/30 rounded p-4 font-mono text-sm space-y-2 border border-white/5">
                        <div className="text-slate-500 italic">Listening for speech...</div>
                        <div className="text-cyan-400">Client: "We are looking to scale our operations by Q3."</div>
                        <div className="text-white">You: "That aligns perfectly with our enterprise tier."</div>
                        <div className="text-cyan-400">Client: "What about security compliance?"</div>
                        <div className="text-slate-500 italic text-xs mt-2 border-t border-white/5 pt-2">AI Note: Potential objection detected regarding security. Suggest mentioning SOC2 compliance.</div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredMeetings.map(m => (
                    <div key={m.id} className="p-6 bg-slate-800 rounded-xl border border-white/5 hover:border-purple-500/50 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                                    {new Date(m.date).getDate()}
                                </div>
                                <div>
                                    <div className="font-bold text-lg">{m.title}</div>
                                    <div className="text-xs text-slate-400">{new Date(m.date).toLocaleDateString()} • {m.time || 'TBD'}</div>
                                </div>
                            </div>
                            <div className="px-2 py-1 rounded bg-slate-700 text-[10px] uppercase font-bold text-slate-300">{m.type || 'Meeting'}</div>
                        </div>
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-xs text-slate-400"><i className="fas fa-user"></i> {companies.find(c => c.id === m.clientId)?.name || 'Unknown Client'}</div>
                            <div className="flex items-center gap-2 text-xs text-slate-400"><i className="fas fa-link"></i> <a href="#" className="hover:text-cyan-400 truncate max-w-[200px]">{m.link || '#'}</a></div>
                        </div>
                        <div className="p-3 bg-black/20 rounded border border-white/5 text-sm text-slate-300 italic mb-4">
                            "{m.summary}"
                        </div>
                        <div className="flex justify-between items-center border-t border-white/5 pt-4">
                            <div className="flex -space-x-2">
                                {(m.attendees || []).map((a, i) => (
                                    <div key={i} className="w-6 h-6 rounded-full bg-slate-600 border border-slate-800 flex items-center justify-center text-[10px] text-white" title={a}>{a[0]}</div>
                                ))}
                            </div>
                            <button className="text-xs text-purple-400 font-bold hover:text-white group-hover:translate-x-1 transition-transform">View Transcript <i className="fas fa-arrow-right ml-1"></i></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MeetingsView;
