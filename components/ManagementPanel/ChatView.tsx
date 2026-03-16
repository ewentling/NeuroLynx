import React from 'react';
import { Message, Company } from '../../types';

interface ChatViewProps {
    messages: Message[];
    companies: Company[];
    selectedCompanyId: string;
    input: string;
    onSetInput: (val: string) => void;
    onSubmitMessage: () => void;
    messagesEndRef: React.RefObject<HTMLDivElement>;
    isVoiceContinuityEnabled: boolean;
    onToggleVoiceContinuity: (val: boolean) => void;
}

const SimpleMarkdown: React.FC<{ content: string }> = ({ content }) => {
    if (!content) return null;
    const lines = content.split('\n');
    return (
        <div className="space-y-2">
            {lines.map((line, idx) => {
                const trimmed = line.trim();
                if (trimmed.startsWith('### ')) return <h3 key={idx} className="text-lg font-bold mt-3 mb-1">{trimmed.replace('### ', '')}</h3>;
                if (trimmed.startsWith('#### ')) return <h4 key={idx} className="text-md font-bold text-orange-400 mt-2 mb-1">{trimmed.replace('#### ', '')}</h4>;
                if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                    return <div key={idx} className="flex gap-2 ml-2 opacity-90"><span className="text-orange-500">•</span><span>{trimmed.replace(/^[-*] /, '')}</span></div>;
                }
                const parts = line.split(/(\*\*.*?\*\*)/g);
                return (
                    <p key={idx} className="opacity-90 leading-relaxed text-sm min-h-[0.5em]">
                        {parts.map((part, i) => {
                            if (part.startsWith('**') && part.endsWith('**')) return <strong key={i} className="font-bold opacity-100">{part.slice(2, -2)}</strong>;
                            return <span key={i}>{part}</span>;
                        })}
                    </p>
                );
            })}
        </div>
    );
};

const ChatView: React.FC<ChatViewProps> = ({
    messages,
    companies,
    selectedCompanyId,
    input,
    onSetInput,
    onSubmitMessage,
    messagesEndRef,
    isVoiceContinuityEnabled,
    onToggleVoiceContinuity
}) => {
    return (
        <div className="flex flex-col h-full max-h-[calc(100vh-200px)]">
            {/* Header with title and voice toggle */}
            <div className="flex flex-col items-center mb-4 gap-2">
                <div className="flex items-center gap-4 mb-2">
                    <div className="flex items-center gap-2">
                        <i className="fas fa-brain text-cyan-400"></i>
                        <span className="text-sm font-black uppercase tracking-widest text-slate-300">NeuroLynx AI</span>
                    </div>
                    <div className="px-3 py-1 bg-gradient-to-r from-orange-500/20 to-cyan-500/20 rounded-full border border-orange-500/30">
                        <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">500+ Skills Active</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-tighter">Voice Continuity</span>
                    <button
                        onClick={() => onToggleVoiceContinuity(!isVoiceContinuityEnabled)}
                        className={`w-10 h-5 rounded-full p-1 transition-all ${isVoiceContinuityEnabled ? 'bg-cyan-500' : 'bg-slate-700'}`}
                    >
                        <div className={`w-3 h-3 rounded-full bg-white transition-transform ${isVoiceContinuityEnabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </button>
                    {isVoiceContinuityEnabled && (
                        <div className="flex items-center gap-1">
                            <div className="w-1 h-1 bg-cyan-400 rounded-full animate-ping"></div>
                            <span className="text-[9px] font-bold text-cyan-400 uppercase">Hands-Free Mode</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-4 custom-scrollbar">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center py-12">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500/20 to-cyan-500/20 flex items-center justify-center mb-4">
                            <i className="fas fa-comments text-3xl text-cyan-400"></i>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Start a Conversation</h3>
                        <p className="text-slate-400 text-sm max-w-md mb-4">
                            Ask anything about your business, clients, deals, tasks, or let me help you with analysis and automation.
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                            {[
                                'Who is our highest paying customer?',
                                'Create a task for tomorrow',
                                'Summarize my open deals',
                                'What tasks are overdue?'
                            ].map((suggestion, i) => (
                                <button
                                    key={i}
                                    onClick={() => onSetInput(suggestion)}
                                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-lg text-xs text-slate-300 hover:text-white transition-all"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-4 rounded-2xl max-w-[80%] ${msg.role === 'user' ? 'bg-orange-600' : 'glass-panel border border-white/10'}`}>
                            <SimpleMarkdown content={msg.content} />
                            {msg.toolCalls && msg.toolCalls.length > 0 && (
                                <div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-2 text-[10px] text-cyan-400">
                                    <i className="fas fa-cog"></i>
                                    <span>Used: {msg.toolCalls.map(t => t.toolName).join(', ')}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef}></div>
            </div>

            {/* Input area */}
            <div className="flex gap-4">
                <input
                    className="flex-1 p-4 rounded-xl bg-slate-800 border border-white/10 focus:border-cyan-500 outline-none text-white placeholder-slate-500"
                    value={input}
                    onChange={e => onSetInput(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            onSubmitMessage();
                        }
                    }}
                    placeholder="Ask NeuroLynx anything..."
                />
                <button 
                    onClick={onSubmitMessage} 
                    className="px-6 rounded-xl bg-cyan-600 hover:bg-cyan-500 transition-all text-white"
                    disabled={!input.trim()}
                >
                    <i className="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
    );
};

export default ChatView;
