import React from 'react';
import { OnboardingChecklist, Company } from '../types';

interface OnboardingViewProps {
    checklists: OnboardingChecklist[];
    companies: Company[];
    onToggleItem: (checklistId: string, itemId: string) => void;
    onCreateChecklist: () => void;
}

const OnboardingView: React.FC<OnboardingViewProps> = ({ checklists, companies, onToggleItem, onCreateChecklist }) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Client Onboarding</h2>
                <button onClick={onCreateChecklist} className="px-4 py-2 bg-orange-600 rounded text-xs font-bold hover:bg-orange-500">
                    <i className="fas fa-plus mr-2"></i>New Onboarding
                </button>
            </div>

            {checklists.length === 0 ? (
                <div className="text-center p-12 bg-slate-800 rounded-xl border border-white/5">
                    <i className="fas fa-clipboard-check text-4xl text-slate-600 mb-4"></i>
                    <div className="text-slate-500 font-bold text-sm uppercase">No active onboardings</div>
                    <div className="text-xs text-slate-600 mt-1">Start an onboarding when a deal is won</div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {checklists.map(checklist => {
                        const company = companies.find(c => c.id === checklist.companyId);
                        const completed = checklist.items.filter(i => i.completed).length;
                        const total = checklist.items.length;
                        const progress = total ? Math.round((completed / total) * 100) : 0;

                        return (
                            <div key={checklist.id} className="bg-slate-800 rounded-xl border border-white/5 p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg">{company?.name || 'Unknown'}</h3>
                                        <div className="text-xs text-slate-400">Started {new Date(checklist.createdAt).toLocaleDateString()}</div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold ${checklist.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                        {checklist.status}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-slate-500">{completed}/{total} steps</span>
                                        <span className="font-mono text-cyan-400">{progress}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-orange-500 to-cyan-500 rounded-full transition-all duration-700" style={{ width: `${progress}%` }}></div>
                                    </div>
                                </div>

                                <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
                                    {checklist.items.map((item, idx) => (
                                        <div
                                            key={item.id}
                                            className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${item.completed ? 'bg-green-500/5 border-green-500/20 opacity-70' : 'bg-black/20 border-white/5 hover:border-orange-500/30'}`}
                                            onClick={() => onToggleItem(checklist.id, item.id)}
                                        >
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${item.completed ? 'border-green-500 bg-green-500 text-white' : 'border-slate-600 hover:border-orange-500'}`}>
                                                {item.completed && <i className="fas fa-check text-xs"></i>}
                                            </div>
                                            <div className="flex-1">
                                                <div className={`text-sm font-bold ${item.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                                                    {idx + 1}. {item.label}
                                                </div>
                                                {item.completedAt && (
                                                    <div className="text-[10px] text-slate-500 mt-0.5">
                                                        Completed {new Date(item.completedAt).toLocaleDateString()}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default OnboardingView;
