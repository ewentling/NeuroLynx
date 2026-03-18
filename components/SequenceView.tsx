import React from 'react';
import { EmailSequence } from '../types';

interface SequenceViewProps {
    sequences: EmailSequence[];
    onCreateSequence: () => void;
    onToggleStatus: (id: string) => void;
}

const SequenceView: React.FC<SequenceViewProps> = ({ sequences, onCreateSequence, onToggleStatus }) => {
    const totalEnrolled = sequences.reduce((s, seq) => s + seq.enrolledCount, 0);
    const totalCompleted = sequences.reduce((s, seq) => s + seq.completedCount, 0);
    const activeCount = sequences.filter(s => s.status === 'active').length;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Email Campaigns</h2>
                <button onClick={onCreateSequence} className="px-4 py-2 bg-orange-600 rounded text-xs font-bold hover:bg-orange-500">
                    <i className="fas fa-plus mr-2"></i>New Campaign
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800 p-6 rounded-xl border border-green-500/20 text-center">
                    <div className="text-3xl font-bold text-green-400">{activeCount}</div>
                    <div className="text-[10px] uppercase text-slate-500 font-bold">Active Campaigns</div>
                </div>
                <div className="bg-slate-800 p-6 rounded-xl border border-cyan-500/20 text-center">
                    <div className="text-3xl font-bold text-cyan-400">{totalEnrolled}</div>
                    <div className="text-[10px] uppercase text-slate-500 font-bold">Total Enrolled</div>
                </div>
                <div className="bg-slate-800 p-6 rounded-xl border border-purple-500/20 text-center">
                    <div className="text-3xl font-bold text-purple-400">{totalCompleted}</div>
                    <div className="text-[10px] uppercase text-slate-500 font-bold">Completed</div>
                </div>
            </div>

            <div className="space-y-6">
                {sequences.map(seq => {
                    const completionRate = seq.enrolledCount ? Math.round((seq.completedCount / seq.enrolledCount) * 100) : 0;
                    return (
                        <div key={seq.id} className="bg-slate-800 rounded-xl border border-white/5 overflow-hidden">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg">{seq.name}</h3>
                                        <div className="text-xs text-slate-400">Created {seq.createdAt} • {seq.steps.length} steps</div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-xs font-mono text-slate-400">{completionRate}% completion</div>
                                        <button
                                            onClick={() => onToggleStatus(seq.id)}
                                            className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold cursor-pointer ${seq.status === 'active' ? 'bg-green-500/20 text-green-400' : seq.status === 'paused' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-slate-700 text-slate-400'}`}
                                        >
                                            {seq.status}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mb-4">
                                    <div className="text-xs text-slate-500">{seq.enrolledCount} enrolled</div>
                                    <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-orange-500 to-cyan-500 rounded-full transition-all" style={{ width: `${completionRate}%` }}></div>
                                    </div>
                                    <div className="text-xs text-slate-500">{seq.completedCount} completed</div>
                                </div>

                                {/* Step Timeline */}
                                <div className="relative">
                                    <div className="absolute left-4 top-6 bottom-6 w-0.5 bg-slate-700"></div>
                                    <div className="space-y-4">
                                        {seq.steps.sort((a, b) => a.order - b.order).map((step, idx) => (
                                            <div key={step.id} className="relative pl-10">
                                                <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white border-2 border-slate-800 z-10">
                                                    {idx + 1}
                                                </div>
                                                <div className="bg-black/20 rounded-lg p-3 border border-white/5">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <div className="font-bold text-sm"><i className="fas fa-envelope text-blue-400 mr-2 text-xs"></i>{step.subject}</div>
                                                        <span className="text-xs text-slate-500 bg-slate-700 px-2 py-0.5 rounded">
                                                            {step.delayDays === 0 ? 'Immediately' : `+${step.delayDays}d`}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs text-slate-400 truncate">{step.body}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SequenceView;
