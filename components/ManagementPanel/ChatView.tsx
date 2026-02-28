import React from 'react';
import { Message, Company } from '../../types';

interface ChatViewProps {
    chatMode: 'internal' | 'all' | 'client';
    chatClientSelection: string;
    onSetChatMode: (mode: 'internal' | 'all' | 'client') => void;
    onSetChatClientSelection: (id: string) => void;
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
    // Basic implementation as seen in original App.tsx or similar
    return <div className="whitespace-pre-wrap">{content}</div>;
};

const ChatView: React.FC<ChatViewProps> = ({
    chatMode,
    chatClientSelection,
    onSetChatMode,
    onSetChatClientSelection,
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
        <div className="flex flex-col h-full">
            <div className="flex flex-col items-center mb-4 gap-2">
                <div className="bg-slate-800 p-1 rounded-lg flex border border-white/10">
                    <button onClick={() => onSetChatMode('internal')} className={`px-4 py-1 rounded text-xs font-bold transition-all ${chatMode === 'internal' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'}`}>Internal</button>
                    <button onClick={() => onSetChatMode('all')} className={`px-4 py-1 rounded text-xs font-bold transition-all ${chatMode === 'all' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'}`}>Shared</button>
                    <button onClick={() => onSetChatMode('client')} className={`px-4 py-1 rounded text-xs font-bold transition-all ${chatMode === 'client' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'}`}>Client</button>
                </div>
                {chatMode === 'client' && (
                    <div className="w-full flex justify-center">
                        <select
                            className="bg-slate-800 border border-orange-500/50 rounded px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 shadow-lg w-64 text-center"
                            value={chatClientSelection || (selectedCompanyId !== 'all' ? selectedCompanyId : '')}
                            onChange={(e) => onSetChatClientSelection(e.target.value)}
                        >
                            <option value="">-- Select Client Context --</option>
                            {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                )}
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
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {messages.filter(m => chatMode === 'all' ? true : chatMode === 'client' ? (m.clientId === (chatClientSelection || selectedCompanyId)) : !m.clientId).map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-4 rounded-2xl max-w-[80%] ${msg.role === 'user' ? 'bg-orange-600' : 'glass-panel border border-white/10'}`}>
                            <SimpleMarkdown content={msg.content} />
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef}></div>
            </div>
            <div className="flex gap-4">
                <input
                    className="flex-1 p-4 rounded-xl bg-slate-800 border border-white/10 focus:border-cyan-500 outline-none"
                    value={input}
                    onChange={e => onSetInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && onSubmitMessage()}
                    placeholder={`Ask NeuroLynx (${chatMode})...`}
                />
                <button onClick={onSubmitMessage} className="px-6 rounded-xl bg-cyan-600 hover:bg-cyan-500"><i className="fas fa-paper-plane"></i></button>
            </div>
        </div>
    );
};

export default ChatView;
