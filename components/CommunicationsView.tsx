import React from 'react';
import { WorkspaceItem } from '../types';

interface CommunicationsViewProps {
    commFolder: string;
    onSetCommFolder: (folder: string) => void;
    workspaceItems: WorkspaceItem[];
    onDraftEmail: () => void;
    onManageTemplates: () => void;
}

const CommunicationsView: React.FC<CommunicationsViewProps> = ({
    commFolder, onSetCommFolder, workspaceItems, onDraftEmail, onManageTemplates
}) => {
    const emails = workspaceItems.filter(i => i.type === 'email' && i.folder === commFolder);

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Communications</h2>
                <div className="flex gap-2">
                    <button onClick={onManageTemplates} className="px-4 py-2 bg-slate-700 rounded text-xs font-bold whitespace-nowrap"><i className="fas fa-layer-group mr-2"></i> Templates</button>
                    <button onClick={onDraftEmail} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded text-xs font-bold whitespace-nowrap shadow-lg shadow-blue-500/20"><i className="fas fa-pen-fancy mr-2"></i> Compose</button>
                </div>
            </div>

            <div className="flex-1 flex gap-6 overflow-hidden">
                <div className="w-48 flex-shrink-0 space-y-1">
                    {['inbox', 'sent', 'drafts', 'archive'].map(folder => (
                        <button
                            key={folder}
                            onClick={() => onSetCommFolder(folder)}
                            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${commFolder === folder ? 'bg-orange-600/10 text-orange-400 border border-orange-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            <i className={`fas fa-${folder === 'inbox' ? 'inbox' : folder === 'sent' ? 'paper-plane' : folder === 'drafts' ? 'file-lines' : 'box-archive'} mr-3`}></i> {folder}
                        </button>
                    ))}
                </div>

                <div className="flex-1 bg-slate-800 rounded-2xl border border-white/5 overflow-y-auto custom-scrollbar">
                    {emails.map(email => (
                        <div key={email.id} className="p-4 border-b border-white/5 hover:bg-white/5 transition-all group cursor-pointer">
                            <div className="flex justify-between items-start mb-1">
                                <div className="font-bold text-sm text-white">{email.to || 'Unknown Recipient'}</div>
                                <div className="text-[10px] text-slate-500 font-mono">{email.date}</div>
                            </div>
                            <div className="text-xs font-bold text-cyan-400 mb-1">{email.title}</div>
                            <div className="text-xs text-slate-400 line-clamp-1">{email.snippet}</div>
                        </div>
                    ))}
                    {emails.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 p-12">
                            <i className="fas fa-envelope-open text-4xl mb-4 opacity-20"></i>
                            <div className="font-bold uppercase tracking-widest text-xs">No Messages Found</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommunicationsView;
