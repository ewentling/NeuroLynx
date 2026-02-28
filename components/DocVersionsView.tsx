import React from 'react';
import { DocVersion, Company } from '../types';

interface DocVersionsViewProps {
    versions: DocVersion[];
    companies: Company[];
    onRestore: (versionId: string) => void;
}

const DocVersionsView: React.FC<DocVersionsViewProps> = ({ versions, companies, onRestore }) => {
    // Group versions by documentId
    const docs = Array.from(new Set(versions.map(v => v.documentId))).map(docId => {
        const docVersions = versions.filter(v => v.documentId === docId).sort((a, b) => b.version - a.version);
        return {
            id: docId,
            title: docVersions[0].documentTitle,
            companyId: docVersions[0].companyId,
            latestVersion: docVersions[0].version,
            history: docVersions
        };
    });

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Document Version Control</h2>

            <div className="grid grid-cols-1 gap-6">
                {docs.map(doc => {
                    const company = companies.find(c => c.id === doc.companyId);
                    return (
                        <div key={doc.id} className="bg-slate-800 rounded-xl border border-white/5 overflow-hidden">
                            <div className="p-6 bg-black/20 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-lg">{doc.title}</h3>
                                    <div className="text-xs text-slate-400">{company?.name || 'Internal'}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] uppercase font-bold text-slate-500">Current Version</div>
                                    <div className="text-sm font-bold text-cyan-400 font-mono">v{doc.latestVersion}.0</div>
                                </div>
                            </div>

                            <div className="divide-y divide-white/5">
                                {doc.history.map(v => (
                                    <div key={v.id} className="p-6 flex items-start gap-4 hover:bg-white/2 transition-colors">
                                        <div className="w-10 h-10 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center font-mono font-bold text-xs text-slate-400">
                                            v{v.version}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <div className="font-bold text-sm text-slate-200">{v.changeNotes}</div>
                                                <div className="text-[10px] text-slate-500">{new Date(v.timestamp).toLocaleString()}</div>
                                            </div>
                                            <div className="text-xs text-slate-500 flex items-center gap-2">
                                                <i className="fas fa-user-edit text-[10px]"></i> Edited by {v.author}
                                            </div>
                                        </div>
                                        {v.version < doc.latestVersion && (
                                            <button
                                                onClick={() => onRestore(v.id)}
                                                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-[10px] font-bold uppercase transition-colors"
                                            >
                                                Restore
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {docs.length === 0 && (
                <div className="text-center py-20 bg-slate-800/50 rounded-2xl border border-dashed border-white/10">
                    <i className="fas fa-history text-4xl text-slate-600 mb-4"></i>
                    <div className="text-slate-400">No document history found.</div>
                </div>
            )}
        </div>
    );
};

export default DocVersionsView;
