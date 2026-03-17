import React, { useState, useEffect, useCallback } from 'react';
import { Meeting, Company } from '../../types';
import { VexaService, VexaPlatform, VexaTranscriptSegment, vexaService } from '../../services/vexaService';

interface MeetingsViewProps {
    meetings: Meeting[];
    companies: Company[];
    selectedCompanyId?: string;
    isLiveMeeting: boolean;
    onToggleLiveMeeting: (status: boolean) => void;
    onLogMeeting: () => void;
    onAddToast: (type: any, msg: string) => void;
    onUpdateMeeting?: (meeting: Meeting) => void;
}

const MeetingsView: React.FC<MeetingsViewProps> = ({
    meetings,
    companies,
    selectedCompanyId,
    isLiveMeeting,
    onToggleLiveMeeting,
    onLogMeeting,
    onAddToast,
    onUpdateMeeting
}) => {
    const [vexaApiKey, setVexaApiKey] = useState('');
    const [showVexaSetup, setShowVexaSetup] = useState(false);
    const [vexaMeetingUrl, setVexaMeetingUrl] = useState('');
    const [vexaDeploying, setVexaDeploying] = useState(false);
    const [activeVexaBot, setActiveVexaBot] = useState<{ botId: string; meetingId: string; platform: VexaPlatform } | null>(null);
    const [vexaTranscript, setVexaTranscript] = useState<VexaTranscriptSegment[]>([]);
    const [selectedMeetingForVexa, setSelectedMeetingForVexa] = useState<Meeting | null>(null);

    // Filter meetings based on selected company
    const filteredMeetings = selectedCompanyId && selectedCompanyId !== 'all'
        ? meetings.filter(m => m.clientId === selectedCompanyId)
        : meetings;

    // Check if Vexa is configured
    const isVexaConfigured = vexaService.isConfigured() || !!vexaApiKey;

    // Save Vexa API key
    const handleSaveVexaKey = useCallback(() => {
        if (vexaApiKey.trim()) {
            vexaService.setApiKey(vexaApiKey.trim());
            localStorage.setItem('vexa_api_key', vexaApiKey.trim());
            setShowVexaSetup(false);
            onAddToast('success', 'Vexa API key saved successfully');
        }
    }, [vexaApiKey, onAddToast]);

    // Load saved Vexa API key on mount
    useEffect(() => {
        const savedKey = localStorage.getItem('vexa_api_key');
        if (savedKey) {
            setVexaApiKey(savedKey);
            vexaService.setApiKey(savedKey);
        }
    }, []);

    // Deploy Vexa bot to meeting
    const handleDeployVexaBot = async () => {
        if (!vexaMeetingUrl.trim()) {
            onAddToast('error', 'Please enter a meeting URL');
            return;
        }

        const parsed = VexaService.extractMeetingId(vexaMeetingUrl);
        if (!parsed) {
            onAddToast('error', 'Invalid meeting URL. Supported: Google Meet, Teams, Zoom');
            return;
        }

        setVexaDeploying(true);
        try {
            const response = await vexaService.deployBot({
                platform: parsed.platform,
                native_meeting_id: parsed.meetingId,
                bot_name: 'NeuroLynx Transcription Bot'
            });

            setActiveVexaBot({
                botId: response.bot_id,
                meetingId: parsed.meetingId,
                platform: parsed.platform
            });

            // Update selected meeting with Vexa info if applicable
            if (selectedMeetingForVexa && onUpdateMeeting) {
                onUpdateMeeting({
                    ...selectedMeetingForVexa,
                    vexaBotId: response.bot_id,
                    vexaPlatform: parsed.platform,
                    vexaMeetingId: parsed.meetingId,
                    vexaStatus: 'active'
                });
            }

            // Subscribe to real-time transcription
            vexaService.subscribeToTranscript(
                parsed.platform,
                parsed.meetingId,
                (segment) => {
                    setVexaTranscript(prev => [...prev, segment]);
                },
                (error) => {
                    console.error('Vexa transcript error:', error);
                    onAddToast('warning', 'Vexa real-time connection issue');
                }
            );

            onAddToast('success', `Vexa bot deployed to ${VexaService.getPlatformName(parsed.platform)}`);
            setVexaMeetingUrl('');
        } catch (error: any) {
            onAddToast('error', error.message || 'Failed to deploy Vexa bot');
        } finally {
            setVexaDeploying(false);
        }
    };

    // Stop Vexa bot
    const handleStopVexaBot = async () => {
        if (!activeVexaBot) return;

        try {
            await vexaService.stopBot(activeVexaBot.botId);
            vexaService.disconnect();

            // Update meeting with transcript - only mark as completed if it was processing
            if (selectedMeetingForVexa && onUpdateMeeting) {
                const fullTranscript = VexaService.formatTranscript(vexaTranscript);
                onUpdateMeeting({
                    ...selectedMeetingForVexa,
                    vexaStatus: 'ended',
                    transcript: fullTranscript,
                    // Only change status to completed if it was processing or scheduled
                    status: selectedMeetingForVexa.status === 'scheduled' || selectedMeetingForVexa.status === 'processing' 
                        ? 'completed' 
                        : selectedMeetingForVexa.status
                });
            }

            setActiveVexaBot(null);
            setVexaTranscript([]);
            onAddToast('success', 'Vexa transcription ended');
        } catch (error: any) {
            onAddToast('error', error.message || 'Failed to stop Vexa bot');
        }
    };

    // Fetch transcript for a past meeting
    const handleFetchTranscript = async (meeting: Meeting) => {
        if (!meeting.vexaPlatform || !meeting.vexaMeetingId) {
            onAddToast('error', 'No Vexa meeting info available');
            return;
        }

        try {
            const transcript = await vexaService.getTranscript(
                meeting.vexaPlatform,
                meeting.vexaMeetingId
            );

            if (onUpdateMeeting) {
                onUpdateMeeting({
                    ...meeting,
                    transcript: VexaService.formatTranscript(transcript.segments)
                });
            }

            onAddToast('success', 'Transcript fetched successfully');
        } catch (error: any) {
            onAddToast('error', error.message || 'Failed to fetch transcript');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Meeting Intelligence</h2>
                <div className="flex gap-2">
                    {/* Vexa Integration Button */}
                    <button
                        onClick={() => setShowVexaSetup(!showVexaSetup)}
                        className={`px-4 py-2 rounded text-xs font-bold transition-all ${
                            isVexaConfigured 
                                ? 'bg-purple-600 hover:bg-purple-500' 
                                : 'bg-slate-700 hover:bg-slate-600'
                        }`}
                    >
                        <i className="fas fa-robot mr-2"></i>
                        {isVexaConfigured ? 'Vexa Bot' : 'Setup Vexa'}
                    </button>
                    
                    {isLiveMeeting ? (
                        <button onClick={() => onToggleLiveMeeting(false)} className="px-4 py-2 bg-red-600 rounded text-xs font-bold animate-pulse"><i className="fas fa-stop mr-2"></i> End Session</button>
                    ) : (
                        <button onClick={() => { onToggleLiveMeeting(true); onAddToast('info', 'Live transcription started...'); }} className="px-4 py-2 bg-green-600 rounded text-xs font-bold hover:bg-green-500"><i className="fas fa-microphone mr-2"></i> Start Live Session</button>
                    )}
                    <button onClick={onLogMeeting} className="px-4 py-2 bg-orange-600 rounded text-xs font-bold">Log Meeting</button>
                </div>
            </div>

            {/* Vexa Setup Panel */}
            {showVexaSetup && (
                <div className="bg-slate-800 rounded-xl border border-purple-500/30 p-6 shadow-2xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                            <i className="fas fa-robot text-purple-400"></i>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Vexa Meeting Transcription</h3>
                            <p className="text-xs text-slate-400">Automated bot-based transcription for Google Meet, Teams & Zoom</p>
                        </div>
                    </div>

                    {!isVexaConfigured ? (
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vexa API Key</label>
                                <input
                                    type="password"
                                    value={vexaApiKey}
                                    onChange={(e) => setVexaApiKey(e.target.value)}
                                    placeholder="Enter your Vexa API key"
                                    className="w-full mt-1 px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-sm focus:border-purple-500 focus:outline-none"
                                />
                                <p className="text-xs text-slate-500 mt-1">
                                    Get your API key at <a href="https://vexa.ai" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">vexa.ai</a>
                                </p>
                            </div>
                            <button
                                onClick={handleSaveVexaKey}
                                disabled={!vexaApiKey.trim()}
                                className="px-4 py-2 bg-purple-600 rounded text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-500"
                            >
                                Save API Key
                            </button>
                        </div>
                    ) : activeVexaBot ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                <div className="flex-1">
                                    <div className="font-bold text-green-400">Bot Active</div>
                                    <div className="text-xs text-slate-400">
                                        {VexaService.getPlatformName(activeVexaBot.platform)} • {activeVexaBot.meetingId}
                                    </div>
                                </div>
                                <button
                                    onClick={handleStopVexaBot}
                                    className="px-3 py-1 bg-red-600 rounded text-xs font-bold hover:bg-red-500"
                                >
                                    Stop Bot
                                </button>
                            </div>

                            {/* Real-time transcript */}
                            <div className="h-48 overflow-y-auto bg-black/30 rounded p-4 font-mono text-sm space-y-2 border border-white/5">
                                {vexaTranscript.length === 0 ? (
                                    <div className="text-slate-500 italic">Waiting for speech...</div>
                                ) : (
                                    vexaTranscript.map((seg, i) => {
                                        // Use speaker name comparison - 'You' typically indicates the local user
                                        const isLocalUser = seg.speaker.toLowerCase() === 'you' || seg.speaker.toLowerCase() === 'me';
                                        return (
                                            <div key={i} className={isLocalUser ? 'text-white' : 'text-cyan-400'}>
                                                <span className="text-slate-500 text-xs">[{new Date(seg.timestamp).toLocaleTimeString()}]</span> {seg.speaker}: "{seg.text}"
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Meeting URL</label>
                                <input
                                    type="text"
                                    value={vexaMeetingUrl}
                                    onChange={(e) => setVexaMeetingUrl(e.target.value)}
                                    placeholder="https://meet.google.com/abc-defg-hij"
                                    className="w-full mt-1 px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-sm focus:border-purple-500 focus:outline-none"
                                />
                                <p className="text-xs text-slate-500 mt-1">
                                    Paste a Google Meet, Microsoft Teams, or Zoom meeting URL
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleDeployVexaBot}
                                    disabled={vexaDeploying || !vexaMeetingUrl.trim()}
                                    className="px-4 py-2 bg-purple-600 rounded text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-500 flex items-center gap-2"
                                >
                                    {vexaDeploying ? (
                                        <>
                                            <i className="fas fa-spinner animate-spin"></i>
                                            Deploying...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-play"></i>
                                            Deploy Bot
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => {
                                        setVexaApiKey('');
                                        localStorage.removeItem('vexa_api_key');
                                        vexaService.setApiKey('');
                                    }}
                                    className="px-4 py-2 bg-slate-700 rounded text-xs font-bold hover:bg-slate-600"
                                >
                                    Reset API Key
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {isLiveMeeting && (
                <div className="bg-slate-800 rounded-xl border border-red-500/50 p-6 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-shimmer"></div>
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                            <span className="text-red-400 font-bold uppercase text-xs tracking-widest">Live Recording (Browser)</span>
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
                            <div className="flex items-center gap-2">
                                {m.vexaStatus && (
                                    <div className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${
                                        m.vexaStatus === 'active' ? 'bg-green-500/20 text-green-400' :
                                        m.vexaStatus === 'ended' ? 'bg-slate-500/20 text-slate-400' :
                                        m.vexaStatus === 'error' ? 'bg-red-500/20 text-red-400' :
                                        'bg-yellow-500/20 text-yellow-400'
                                    }`}>
                                        <i className="fas fa-robot mr-1"></i>
                                        {m.vexaStatus}
                                    </div>
                                )}
                                <div className="px-2 py-1 rounded bg-slate-700 text-[10px] uppercase font-bold text-slate-300">{m.type || 'Meeting'}</div>
                            </div>
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
                            <div className="flex items-center gap-2">
                                {m.vexaPlatform && m.vexaMeetingId && !m.transcript && (
                                    <button 
                                        onClick={() => handleFetchTranscript(m)}
                                        className="text-xs text-purple-400 font-bold hover:text-white transition-colors"
                                    >
                                        <i className="fas fa-download mr-1"></i> Fetch Transcript
                                    </button>
                                )}
                                {isVexaConfigured && m.link && !activeVexaBot && m.status === 'scheduled' && (
                                    <button 
                                        onClick={() => {
                                            setSelectedMeetingForVexa(m);
                                            setVexaMeetingUrl(m.link || '');
                                            setShowVexaSetup(true);
                                        }}
                                        className="text-xs text-purple-400 font-bold hover:text-white transition-colors"
                                    >
                                        <i className="fas fa-robot mr-1"></i> Deploy Bot
                                    </button>
                                )}
                                <button className="text-xs text-purple-400 font-bold hover:text-white group-hover:translate-x-1 transition-transform">View Transcript <i className="fas fa-arrow-right ml-1"></i></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MeetingsView;
