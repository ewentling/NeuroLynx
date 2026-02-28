import React, { useState } from 'react';
import { Competitor } from '../types';

interface CompetitorViewProps {
    competitors: Competitor[];
    onAddCompetitor: () => void;
}

const CompetitorView: React.FC<CompetitorViewProps> = ({ competitors, onAddCompetitor }) => {
    const [expanded, setExpanded] = useState<string | null>(null);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Competitor Battle Cards</h2>
                <button onClick={onAddCompetitor} className="px-4 py-2 bg-orange-600 rounded text-xs font-bold hover:bg-orange-500">
                    <i className="fas fa-plus mr-2"></i>Add Competitor
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {competitors.map(comp => {
                    const isExpanded = expanded === comp.id;
                    return (
                        <div key={comp.id} className="bg-slate-800 rounded-xl border border-white/5 overflow-hidden hover:border-orange-500/20 transition-all">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg">{comp.name}</h3>
                                        {comp.website && <div className="text-xs text-cyan-400">{comp.website}</div>}
                                    </div>
                                    <div className="text-[10px] text-slate-500">Updated: {comp.lastUpdated}</div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <div className="text-[10px] uppercase font-bold text-green-400 mb-2 flex items-center gap-1"><i className="fas fa-thumbs-up"></i> Strengths</div>
                                        <ul className="space-y-1">
                                            {comp.strengths.map((s, i) => <li key={i} className="text-xs text-slate-300 flex items-start gap-1"><span className="text-green-500 mt-0.5">•</span>{s}</li>)}
                                        </ul>
                                    </div>
                                    <div>
                                        <div className="text-[10px] uppercase font-bold text-red-400 mb-2 flex items-center gap-1"><i className="fas fa-thumbs-down"></i> Weaknesses</div>
                                        <ul className="space-y-1">
                                            {comp.weaknesses.map((w, i) => <li key={i} className="text-xs text-slate-300 flex items-start gap-1"><span className="text-red-500 mt-0.5">•</span>{w}</li>)}
                                        </ul>
                                    </div>
                                </div>

                                <button onClick={() => setExpanded(isExpanded ? null : comp.id)} className="w-full text-center py-2 text-xs text-slate-500 hover:text-white transition-colors border-t border-white/5">
                                    {isExpanded ? 'Show Less' : 'Show More'} <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} ml-1`}></i>
                                </button>

                                {isExpanded && (
                                    <div className="space-y-4 pt-4 border-t border-white/5 mt-2">
                                        <div>
                                            <div className="text-[10px] uppercase font-bold text-cyan-400 mb-2"><i className="fas fa-star mr-1"></i>Our Differentiators</div>
                                            <div className="space-y-1">
                                                {comp.differentiators.map((d, i) => (
                                                    <div key={i} className="flex items-start gap-2 text-xs p-2 bg-cyan-500/5 rounded border border-cyan-500/10">
                                                        <i className="fas fa-check-circle text-cyan-400 mt-0.5"></i>{d}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <div className="text-[10px] uppercase font-bold text-yellow-400 mb-2"><i className="fas fa-comment-dots mr-1"></i>Common Objections & Rebuttals</div>
                                            <div className="space-y-1">
                                                {comp.commonObjections.map((obj, i) => (
                                                    <div key={i} className="text-xs p-2 bg-yellow-500/5 rounded border border-yellow-500/10 italic">"{obj}"</div>
                                                ))}
                                            </div>
                                        </div>

                                        {comp.pricingNotes && (
                                            <div>
                                                <div className="text-[10px] uppercase font-bold text-purple-400 mb-1"><i className="fas fa-tag mr-1"></i>Pricing Intel</div>
                                                <div className="text-xs text-slate-300 p-2 bg-purple-500/5 rounded border border-purple-500/10">{comp.pricingNotes}</div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CompetitorView;
