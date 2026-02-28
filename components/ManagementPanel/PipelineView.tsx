import React from 'react';
import { Deal, DealStage, Company } from '../../types';

interface PipelineViewProps {
    deals: Deal[];
    companies: Company[];
    selectedCompanyId: string;
    draggedDealId: string | null;
    onDealDragStart: (e: React.DragEvent, id: string) => void;
    onDealDragOver: (e: React.DragEvent) => void;
    onDealDrop: (e: React.DragEvent, stage: DealStage) => void;
    onDealExport: () => void;
    onMoveDeal: (id: string, stage: DealStage) => void;
    onAddDeal: () => void;
}

const PipelineView: React.FC<PipelineViewProps> = ({
    deals,
    companies,
    selectedCompanyId,
    draggedDealId,
    onDealDragStart,
    onDealDragOver,
    onDealDrop,
    onDealExport,
    onMoveDeal,
    onAddDeal
}) => {
    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6 flex-shrink-0">
                <div>
                    <h2 className="text-2xl font-bold">Deal Pipeline</h2>
                    <div className="text-sm text-slate-400 mt-1">
                        Total Pipeline Value: <span className="text-emerald-400 font-mono font-bold">${deals.reduce((acc, d) => acc + d.value, 0).toLocaleString()}</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={onDealExport} className="px-4 py-2 bg-slate-700 rounded text-xs font-bold hover:bg-slate-600 shadow-lg"><i className="fas fa-download mr-2"></i> Export</button>
                    <button onClick={onAddDeal} className="px-4 py-2 bg-orange-600 rounded text-xs font-bold hover:bg-orange-500 shadow-lg shadow-orange-500/20">+ New Deal</button>
                </div>
            </div>
            <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
                <div className="flex gap-4 h-full min-w-[1000px]">
                    {['qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost'].map((stage) => {
                        const draggedDeal = deals.find(d => d.id === draggedDealId);
                        return (
                            <div
                                key={stage}
                                className={`w-72 flex-shrink-0 flex flex-col bg-slate-800/50 rounded-xl border transition-all h-full ${draggedDeal && draggedDeal.stage !== stage ? 'border-dashed border-cyan-500/30 bg-cyan-500/5' : 'border-white/5'}`}
                                onDragOver={onDealDragOver}
                                onDrop={(e) => onDealDrop(e, stage as DealStage)}
                            >
                                <div className={`p-3 border-b border-white/5 font-bold uppercase text-xs tracking-wider flex justify-between items-center ${stage === 'closed_won' ? 'text-emerald-400 bg-emerald-500/10' : stage === 'closed_lost' ? 'text-red-400 bg-red-500/10' : 'text-slate-400 bg-slate-800'}`}>
                                    <span>{stage.replace('_', ' ')}</span>
                                    <span className="bg-black/30 px-2 py-0.5 rounded text-[10px]">{deals.filter(d => d.stage === stage && (selectedCompanyId === 'all' || d.companyId === selectedCompanyId)).length}</span>
                                </div>
                                <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                                    {deals.filter(d => d.stage === stage && (selectedCompanyId === 'all' || d.companyId === selectedCompanyId)).map(deal => (
                                        <div
                                            key={deal.id}
                                            draggable
                                            onDragStart={(e) => onDealDragStart(e, deal.id)}
                                            className="p-4 bg-slate-700 rounded-lg border border-white/5 shadow-sm group hover:border-cyan-500/50 transition-all relative cursor-grab active:cursor-grabbing"
                                        >
                                            <div className="text-xs text-cyan-400 font-bold mb-1 truncate">{companies.find(c => c.id === deal.companyId)?.name}</div>
                                            <div className="font-bold text-sm mb-2">{deal.title}</div>
                                            <div className="flex justify-between items-center text-xs text-slate-400 mb-3">
                                                <span className="font-mono text-white">${deal.value.toLocaleString()}</span>
                                                <span>{deal.probability}% Prob.</span>
                                            </div>
                                            <div className="text-[10px] text-slate-500 mb-2 truncate"><i className="fas fa-calendar-alt mr-1"></i> {deal.expectedCloseDate}</div>

                                            {(new Date().getTime() - new Date(deal.lastUpdated).getTime()) > (30 * 24 * 60 * 60 * 1000) && (
                                                <div className="absolute top-2 right-2 text-red-500 animate-pulse" title="Stagnant Deal (>30 days)">
                                                    <i className="fas fa-exclamation-circle"></i>
                                                </div>
                                            )}

                                            <div className="flex justify-between mt-2 pt-2 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {stage !== 'qualification' && <button onClick={() => onMoveDeal(deal.id, 'qualification')} className="text-[10px] hover:text-white" title="Move to Start"><i className="fas fa-backward"></i></button>}

                                                <div className="flex gap-2">
                                                    {stage !== 'closed_lost' && <button onClick={() => onMoveDeal(deal.id, 'closed_lost')} className="text-[10px] hover:text-red-400" title="Mark Lost"><i className="fas fa-times"></i></button>}
                                                    {stage !== 'closed_won' && <button onClick={() => onMoveDeal(deal.id, 'closed_won')} className="text-[10px] hover:text-emerald-400" title="Mark Won"><i className="fas fa-check"></i></button>}
                                                </div>

                                                {stage !== 'closed_won' && stage !== 'closed_lost' && (
                                                    <button onClick={() => {
                                                        const stages: DealStage[] = ['qualification', 'proposal', 'negotiation', 'closed_won'];
                                                        const next = stages[stages.indexOf(stage as DealStage) + 1];
                                                        if (next) onMoveDeal(deal.id, next as DealStage);
                                                    }} className="text-[10px] hover:text-white" title="Advance"><i className="fas fa-forward"></i></button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default PipelineView;
