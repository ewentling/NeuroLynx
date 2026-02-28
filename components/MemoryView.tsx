import React from 'react';

interface MemoryViewProps {
    memory: any[];
    onMemoryUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSetActiveModal: (modal: any) => void;
}

const MemoryView: React.FC<MemoryViewProps> = ({
    memory, onMemoryUpload, onSetActiveModal
}) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Long-term Memory</h2>
                <div className="flex gap-2">
                    <label className="px-4 py-2 bg-slate-700 rounded text-xs font-bold cursor-pointer hover:bg-slate-600">
                        <i className="fas fa-upload mr-2"></i> Upload PDF
                        <input type="file" className="hidden" accept=".pdf" onChange={onMemoryUpload} />
                    </label>
                    <button onClick={() => onSetActiveModal('save_memory')} className="px-4 py-2 bg-purple-600 rounded text-xs font-bold"><i className="fas fa-plus mr-2"></i> Add note</button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                {memory.map(m => (
                    <div key={m.id} className="bg-slate-800 p-6 rounded-2xl border border-white/5 relative group overflow-hidden">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-2 rounded-lg ${m.type === 'file' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-purple-500/10 text-purple-400'}`}>
                                <i className={`fas ${m.type === 'file' ? 'fa-file-pdf' : 'fa-sticky-note'} text-xl`}></i>
                            </div>
                            <div className="text-[10px] text-slate-500 uppercase font-mono">{new Date(m.timestamp).toLocaleDateString()}</div>
                        </div>
                        <h3 className="font-bold text-sm mb-2 text-white">{m.key}</h3>
                        <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">{m.value}</p>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                            <i className="fas fa-user text-[8px]"></i> {m.createdBy || 'AI Agent'}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MemoryView;
