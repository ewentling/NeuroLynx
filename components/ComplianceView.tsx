import React from 'react';
import { ComplianceItem } from '../types';

interface ComplianceViewProps {
    items: ComplianceItem[];
    onGenerateReport?: (framework: string) => void;
}

const ComplianceView: React.FC<ComplianceViewProps> = ({ items, onGenerateReport }) => {
    const frameworks = Array.from(new Set(items.map(i => i.framework)));

    const getStatusColor = (status: ComplianceItem['status']) => {
        switch (status) {
            case 'compliant': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'in_progress': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'non_compliant': return 'bg-red-500/20 text-red-400 border-red-500/30';
            default: return 'bg-slate-700 text-slate-400 border-slate-600/30';
        }
    };

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold">Compliance & Regulatory Tracker</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {frameworks.map(fw => {
                    const fwItems = items.filter(i => i.framework === fw);
                    const compliant = fwItems.filter(i => i.status === 'compliant').length;
                    const total = fwItems.filter(i => i.status !== 'not_applicable').length;
                    const progress = total ? Math.round((compliant / total) * 100) : 100;

                    return (
                        <div key={fw} className="bg-slate-800 rounded-3xl border border-white/5 overflow-hidden shadow-xl group">
                            <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-800">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-black italic tracking-tighter group-hover:text-cyan-400 transition-colors">{fw}</h3>
                                    <div className="text-right">
                                        <div className="text-[10px] uppercase font-bold text-slate-500">Audit Readiness</div>
                                        <div className="text-xl font-mono font-bold text-white">{progress}%</div>
                                    </div>
                                </div>
                                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${progress === 100 ? 'bg-cyan-500' : progress > 70 ? 'bg-green-500' : 'bg-yellow-500'}`}
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                                {fwItems.map(item => (
                                    <div key={item.id} className="space-y-2">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <div className="text-[10px] font-black text-slate-600">{item.control}</div>
                                                <div className="text-xs font-bold leading-snug">{item.description}</div>
                                            </div>
                                            <div className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase ${getStatusColor(item.status)}`}>
                                                {item.status.replace('_', ' ')}
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px] text-slate-500 border-t border-white/5 pt-2">
                                            <span>
                                                {item.lastAuditDate ? `Last Audit: ${item.lastAuditDate}` : item.dueDate ? `Due: ${item.dueDate}` : ''}
                                            </span>
                                            {item.evidenceLink && (
                                                <a href="#" className="text-cyan-400 hover:underline flex items-center gap-1">
                                                    <i className="fas fa-file-contract"></i> Evidence
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button 
                                onClick={() => onGenerateReport?.(fw)}
                                className="w-full py-4 bg-slate-900/50 hover:bg-slate-700 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-all border-t border-white/5">
                                Generate {fw} Readiness Report
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ComplianceView;
