import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FeatureRequest, Company } from '../types';
import { Map, ThumbsUp, MessageSquare, Plus, Filter, SortAsc, Clock, CheckCircle2, PlayCircle, Lightbulb } from 'lucide-react';

interface RoadmapViewProps {
    requests: FeatureRequest[];
    companies: Company[];
}

const RoadmapView: React.FC<RoadmapViewProps> = ({ requests, companies }) => {
    const [filter, setFilter] = useState<FeatureRequest['status'] | 'all'>('all');
    const [selectedRequest, setSelectedRequest] = useState<FeatureRequest | null>(null);

    const filteredRequests = filter === 'all' ? requests : requests.filter(r => r.status === filter);

    const getStatusIcon = (status: FeatureRequest['status']) => {
        switch (status) {
            case 'backlog': return <Clock className="w-4 h-4 text-slate-500" />;
            case 'planned': return <Lightbulb className="w-4 h-4 text-orange-400" />;
            case 'in_progress': return <PlayCircle className="w-4 h-4 text-cyan-400" />;
            case 'shipped': return <CheckCircle2 className="w-4 h-4 text-green-400" />;
            default: return <Clock className="w-4 h-4 text-slate-500" />;
        }
    };

    const getStatusStyles = (status: FeatureRequest['status']) => {
        switch (status) {
            case 'backlog': return 'bg-slate-800 text-slate-400 border-white/5';
            case 'planned': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
            case 'in_progress': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
            case 'shipped': return 'bg-green-500/10 text-green-400 border-green-500/20';
            default: return 'bg-slate-800 text-slate-400 border-white/5';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Product Roadmap</h2>
                    <p className="text-slate-400 text-sm">Collaborative feature requests and long-term project planning.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-slate-900 border border-white/5 rounded-xl font-bold text-slate-300 hover:bg-slate-800 transition-all flex items-center gap-2">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                    <button className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl font-bold text-white shadow-lg hover:shadow-orange-500/30 transition-all flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Suggest Feature
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {['backlog', 'planned', 'in_progress', 'shipped'].map((status) => (
                    <div key={status} className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{status}</h3>
                            <span className="text-[10px] font-mono text-slate-700">{requests.filter(r => r.status === status).length}</span>
                        </div>

                        <div className="space-y-3 min-h-[500px]">
                            {requests.filter(r => r.status === status).map((req) => (
                                <motion.div
                                    key={req.id}
                                    layoutId={req.id}
                                    onClick={() => setSelectedRequest(req)}
                                    className="bg-slate-900 border border-white/5 p-4 rounded-2xl hover:border-white/10 cursor-pointer transition-all group"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className={`p-1.5 rounded-lg border ${getStatusStyles(req.status)}`}>
                                            {getStatusIcon(req.status)}
                                        </div>
                                        <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-800 rounded-lg text-xs font-bold text-slate-400 group-hover:text-white transition-colors">
                                            <ThumbsUp className="w-3 h-3" /> {req.voteCount}
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-white text-sm leading-snug mb-2 group-hover:text-orange-400 transition-colors uppercase tracking-tight">{req.title}</h4>
                                    <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{req.description}</p>

                                    <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-[9px] font-bold text-slate-600 uppercase tracking-tighter">
                                        <span>{companies.find(c => c.id === req.companyId)?.name}</span>
                                        <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {selectedRequest && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-slate-900 border border-white/10 rounded-3xl p-8 max-w-xl w-full shadow-2xl overflow-hidden relative"
                        >
                            <button
                                onClick={() => setSelectedRequest(null)}
                                className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full text-slate-500"
                            >
                                <Plus className="w-6 h-6 rotate-45" />
                            </button>

                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest mb-6 ${getStatusStyles(selectedRequest.status)}`}>
                                {getStatusIcon(selectedRequest.status)}
                                {selectedRequest.status}
                            </div>

                            <h3 className="text-2xl font-black text-white mb-4 tracking-tighter leading-tight">{selectedRequest.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-8">{selectedRequest.description}</p>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="p-4 bg-slate-800/50 rounded-2xl border border-white/5">
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 font-mono">Interest</div>
                                    <div className="text-xl font-black text-white flex items-center gap-2">
                                        <ThumbsUp className="w-5 h-5 text-orange-500" /> {selectedRequest.voteCount} Votes
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-800/50 rounded-2xl border border-white/5 text-right">
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 font-mono">Priority</div>
                                    <div className={`text-xl font-black uppercase tracking-tighter ${selectedRequest.priority === 'high' || selectedRequest.priority === 'critical' ? 'text-red-500' : 'text-cyan-400'}`}>
                                        {selectedRequest.priority}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button className="flex-1 py-3 bg-orange-600 rounded-xl font-bold text-white shadow-lg shadow-orange-600/20 hover:bg-orange-500 transition-all flex items-center justify-center gap-2">
                                    <ThumbsUp className="w-4 h-4" /> Upvote Feature
                                </button>
                                <button className="flex-1 py-3 bg-slate-800 rounded-xl font-bold text-slate-300 hover:bg-slate-700 transition-all flex items-center justify-center gap-2">
                                    <MessageSquare className="w-4 h-4" /> Comments
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RoadmapView;
