import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductRecommendation, Product, Company, Contract, Meeting, Task, Deal } from '../types';
import { 
    Sparkles, TrendingUp, Target, CheckCircle2, XCircle, ShoppingCart, 
    ChevronRight, BarChart3, Clock, RefreshCw, Filter, Info, Zap,
    Building2, Package, DollarSign, Calendar, Brain
} from 'lucide-react';

interface ProductRecommendationsViewProps {
    recommendations: ProductRecommendation[];
    products: Product[];
    companies: Company[];
    contracts: Contract[];
    meetings: Meeting[];
    tasks: Task[];
    deals: Deal[];
    selectedCompanyId?: string;
    onAcceptRecommendation: (id: string) => void;
    onDismissRecommendation: (id: string) => void;
    onConvertToDeal: (recommendation: ProductRecommendation) => void;
    onRunScan: () => void;
    lastScanDate?: string;
}

const ProductRecommendationsView: React.FC<ProductRecommendationsViewProps> = ({
    recommendations,
    products,
    companies,
    contracts,
    meetings,
    tasks,
    deals,
    selectedCompanyId,
    onAcceptRecommendation,
    onDismissRecommendation,
    onConvertToDeal,
    onRunScan,
    lastScanDate
}) => {
    const [statusFilter, setStatusFilter] = useState<ProductRecommendation['status'] | 'all'>('all');
    const [selectedRecommendation, setSelectedRecommendation] = useState<ProductRecommendation | null>(null);
    const [sortBy, setSortBy] = useState<'score' | 'date' | 'company'>('score');

    // Filter recommendations by company if one is selected
    const companyFilteredRecs = useMemo(() => {
        if (selectedCompanyId && selectedCompanyId !== 'internal') {
            return recommendations.filter(r => r.companyId === selectedCompanyId);
        }
        return recommendations.filter(r => {
            const company = companies.find(c => c.id === r.companyId);
            return company && !company.isInternal;
        });
    }, [recommendations, selectedCompanyId, companies]);

    // Apply status filter and sort
    const filteredAndSortedRecs = useMemo(() => {
        let filtered = statusFilter === 'all' 
            ? companyFilteredRecs 
            : companyFilteredRecs.filter(r => r.status === statusFilter);
        
        return [...filtered].sort((a, b) => {
            switch (sortBy) {
                case 'score':
                    return b.benefitScore - a.benefitScore;
                case 'date':
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                case 'company':
                    const compA = companies.find(c => c.id === a.companyId)?.name || '';
                    const compB = companies.find(c => c.id === b.companyId)?.name || '';
                    return compA.localeCompare(compB);
                default:
                    return 0;
            }
        });
    }, [companyFilteredRecs, statusFilter, sortBy, companies]);

    const getProduct = (productId: string) => products.find(p => p.id === productId);
    const getCompany = (companyId: string) => companies.find(c => c.id === companyId);

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-400';
        if (score >= 60) return 'text-cyan-400';
        if (score >= 40) return 'text-orange-400';
        return 'text-red-400';
    };

    const getScoreBg = (score: number) => {
        if (score >= 80) return 'bg-green-500/10 border-green-500/20';
        if (score >= 60) return 'bg-cyan-500/10 border-cyan-500/20';
        if (score >= 40) return 'bg-orange-500/10 border-orange-500/20';
        return 'bg-red-500/10 border-red-500/20';
    };

    const getStatusIcon = (status: ProductRecommendation['status']) => {
        switch (status) {
            case 'pending': return <Clock className="w-4 h-4 text-orange-400" />;
            case 'accepted': return <CheckCircle2 className="w-4 h-4 text-green-400" />;
            case 'dismissed': return <XCircle className="w-4 h-4 text-slate-500" />;
            case 'converted': return <ShoppingCart className="w-4 h-4 text-cyan-400" />;
        }
    };

    const stats = useMemo(() => ({
        total: companyFilteredRecs.length,
        pending: companyFilteredRecs.filter(r => r.status === 'pending').length,
        accepted: companyFilteredRecs.filter(r => r.status === 'accepted').length,
        converted: companyFilteredRecs.filter(r => r.status === 'converted').length,
        avgScore: companyFilteredRecs.length > 0 
            ? Math.round(companyFilteredRecs.reduce((acc, r) => acc + r.benefitScore, 0) / companyFilteredRecs.length)
            : 0
    }), [companyFilteredRecs]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                        <Brain className="w-7 h-7 text-orange-500" />
                        Product Recommendations
                    </h2>
                    <p className="text-slate-400 text-sm">
                        AI-powered product and service recommendations based on client data analysis.
                    </p>
                </div>
                <div className="flex gap-2 items-center">
                    {lastScanDate && (
                        <span className="text-xs text-slate-500 mr-2">
                            Last scan: {new Date(lastScanDate).toLocaleDateString()}
                        </span>
                    )}
                    <button 
                        onClick={onRunScan}
                        className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl font-bold text-white shadow-lg hover:shadow-orange-500/30 transition-all flex items-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" /> Run Analysis
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-5 gap-4">
                <div className="bg-slate-900 border border-white/5 rounded-2xl p-4">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total</div>
                    <div className="text-2xl font-black text-white">{stats.total}</div>
                </div>
                <div className="bg-slate-900 border border-white/5 rounded-2xl p-4">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Pending</div>
                    <div className="text-2xl font-black text-orange-400">{stats.pending}</div>
                </div>
                <div className="bg-slate-900 border border-white/5 rounded-2xl p-4">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Accepted</div>
                    <div className="text-2xl font-black text-green-400">{stats.accepted}</div>
                </div>
                <div className="bg-slate-900 border border-white/5 rounded-2xl p-4">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Converted</div>
                    <div className="text-2xl font-black text-cyan-400">{stats.converted}</div>
                </div>
                <div className="bg-slate-900 border border-white/5 rounded-2xl p-4">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Avg Score</div>
                    <div className={`text-2xl font-black ${getScoreColor(stats.avgScore)}`}>{stats.avgScore}%</div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4 items-center">
                <div className="flex gap-2">
                    {(['all', 'pending', 'accepted', 'dismissed', 'converted'] as const).map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                statusFilter === status 
                                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' 
                                    : 'bg-slate-800 text-slate-400 border border-white/5 hover:bg-slate-700'
                            }`}
                        >
                            {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>
                <div className="ml-auto flex gap-2 items-center">
                    <span className="text-xs text-slate-500">Sort by:</span>
                    <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'score' | 'date' | 'company')}
                        className="bg-slate-800 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                    >
                        <option value="score">Benefit Score</option>
                        <option value="date">Date</option>
                        <option value="company">Company</option>
                    </select>
                </div>
            </div>

            {/* Recommendations Grid */}
            {filteredAndSortedRecs.length === 0 ? (
                <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-white/5">
                    <Sparkles className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-400 mb-2">No Recommendations Yet</h3>
                    <p className="text-sm text-slate-500 mb-4">
                        Run an analysis to generate intelligent product recommendations for your clients.
                    </p>
                    <button 
                        onClick={onRunScan}
                        className="px-4 py-2 bg-orange-600 rounded-xl font-bold text-white hover:bg-orange-500 transition-all"
                    >
                        Run Analysis Now
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredAndSortedRecs.map((rec) => {
                        const product = getProduct(rec.productId);
                        const company = getCompany(rec.companyId);
                        
                        return (
                            <motion.div
                                key={rec.id}
                                layoutId={rec.id}
                                onClick={() => setSelectedRecommendation(rec)}
                                className="bg-slate-900 border border-white/5 rounded-2xl p-5 hover:border-orange-500/30 cursor-pointer transition-all group"
                            >
                                {/* Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(rec.status)}
                                        <span className="text-[10px] font-bold text-slate-500 uppercase">
                                            {rec.status}
                                        </span>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full border ${getScoreBg(rec.benefitScore)}`}>
                                        <span className={`text-lg font-black ${getScoreColor(rec.benefitScore)}`}>
                                            {rec.benefitScore}%
                                        </span>
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div className="mb-4">
                                    <h4 className="font-bold text-white text-sm mb-1 group-hover:text-orange-400 transition-colors">
                                        {product?.name || 'Unknown Product'}
                                    </h4>
                                    <p className="text-xs text-slate-500">
                                        {product?.category || 'N/A'} • ${product?.price?.toLocaleString() || '0'}/{product?.recurringInterval || 'one-time'}
                                    </p>
                                </div>

                                {/* Company */}
                                <div className="flex items-center gap-2 mb-4 p-2 bg-slate-800/50 rounded-lg">
                                    <Building2 className="w-4 h-4 text-slate-500" />
                                    <span className="text-xs font-bold text-slate-300">{company?.name || 'Unknown Company'}</span>
                                </div>

                                {/* Reasoning Preview */}
                                <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                                    {rec.reasoning}
                                </p>

                                {/* Data Points */}
                                <div className="flex flex-wrap gap-1 mb-4">
                                    {rec.dataPoints.slice(0, 3).map((dp, i) => (
                                        <span key={i} className="px-2 py-0.5 bg-slate-800 rounded text-[9px] text-slate-500">
                                            {dp}
                                        </span>
                                    ))}
                                    {rec.dataPoints.length > 3 && (
                                        <span className="px-2 py-0.5 bg-slate-800 rounded text-[9px] text-slate-500">
                                            +{rec.dataPoints.length - 3} more
                                        </span>
                                    )}
                                </div>

                                {/* Actions */}
                                {rec.status === 'pending' && (
                                    <div className="flex gap-2 pt-3 border-t border-white/5">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onAcceptRecommendation(rec.id); }}
                                            className="flex-1 py-2 bg-green-500/10 text-green-400 rounded-lg text-xs font-bold hover:bg-green-500/20 transition-all"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onDismissRecommendation(rec.id); }}
                                            className="flex-1 py-2 bg-slate-800 text-slate-400 rounded-lg text-xs font-bold hover:bg-slate-700 transition-all"
                                        >
                                            Dismiss
                                        </button>
                                    </div>
                                )}
                                {rec.status === 'accepted' && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onConvertToDeal(rec); }}
                                        className="w-full py-2 bg-cyan-500/10 text-cyan-400 rounded-lg text-xs font-bold hover:bg-cyan-500/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        <ShoppingCart className="w-3 h-3" /> Convert to Deal
                                    </button>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedRecommendation && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-slate-900 border border-white/10 rounded-3xl p-8 max-w-2xl w-full shadow-2xl overflow-hidden relative max-h-[90vh] overflow-y-auto"
                            role="dialog"
                            aria-modal="true"
                            aria-label="Recommendation details"
                        >
                            <button
                                type="button"
                                onClick={() => setSelectedRecommendation(null)}
                                className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full text-slate-500"
                                aria-label="Close recommendation details"
                                autoFocus
                            >
                                <XCircle className="w-6 h-6" />
                            </button>

                            {(() => {
                                const product = getProduct(selectedRecommendation.productId);
                                const company = getCompany(selectedRecommendation.companyId);
                                
                                return (
                                    <>
                                        {/* Score Badge */}
                                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-black mb-6 ${getScoreBg(selectedRecommendation.benefitScore)}`}>
                                            <Target className="w-4 h-4" />
                                            <span className={getScoreColor(selectedRecommendation.benefitScore)}>
                                                {selectedRecommendation.benefitScore}% Client Benefit Score
                                            </span>
                                        </div>

                                        {/* Product & Company */}
                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="p-4 bg-slate-800/50 rounded-2xl border border-white/5">
                                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Product</div>
                                                <div className="flex items-center gap-3">
                                                    <Package className="w-8 h-8 text-orange-500" />
                                                    <div>
                                                        <div className="font-bold text-white">{product?.name}</div>
                                                        <div className="text-xs text-slate-400">{product?.category}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-4 bg-slate-800/50 rounded-2xl border border-white/5">
                                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Client</div>
                                                <div className="flex items-center gap-3">
                                                    <Building2 className="w-8 h-8 text-cyan-500" />
                                                    <div>
                                                        <div className="font-bold text-white">{company?.name}</div>
                                                        <div className="text-xs text-slate-400">{company?.industry}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Pricing */}
                                        <div className="p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl border border-orange-500/20 mb-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="w-5 h-5 text-orange-400" />
                                                    <span className="text-sm text-slate-400">Potential Revenue</span>
                                                </div>
                                                <span className="text-2xl font-black text-white">
                                                    ${product?.price?.toLocaleString() || '0'}
                                                    <span className="text-sm text-slate-400">/{product?.recurringInterval || 'one-time'}</span>
                                                </span>
                                            </div>
                                        </div>

                                        {/* Reasoning */}
                                        <div className="mb-6">
                                            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                                                <Brain className="w-4 h-4 text-orange-400" />
                                                AI Reasoning
                                            </h4>
                                            <p className="text-slate-400 text-sm leading-relaxed bg-slate-800/50 p-4 rounded-xl">
                                                {selectedRecommendation.reasoning}
                                            </p>
                                        </div>

                                        {/* Data Points */}
                                        <div className="mb-6">
                                            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                                                <BarChart3 className="w-4 h-4 text-cyan-400" />
                                                Supporting Data Points
                                            </h4>
                                            <div className="space-y-2">
                                                {selectedRecommendation.dataPoints.map((dp, i) => (
                                                    <div key={i} className="flex items-center gap-2 p-3 bg-slate-800/50 rounded-lg">
                                                        <Zap className="w-4 h-4 text-orange-400" />
                                                        <span className="text-sm text-slate-300">{dp}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-4 pt-4 border-t border-white/5">
                                            {selectedRecommendation.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => { onAcceptRecommendation(selectedRecommendation.id); setSelectedRecommendation(null); }}
                                                        className="flex-1 py-3 bg-green-600 rounded-xl font-bold text-white shadow-lg hover:bg-green-500 transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <CheckCircle2 className="w-4 h-4" /> Accept Recommendation
                                                    </button>
                                                    <button
                                                        onClick={() => { onDismissRecommendation(selectedRecommendation.id); setSelectedRecommendation(null); }}
                                                        className="flex-1 py-3 bg-slate-800 rounded-xl font-bold text-slate-300 hover:bg-slate-700 transition-all"
                                                    >
                                                        Dismiss
                                                    </button>
                                                </>
                                            )}
                                            {selectedRecommendation.status === 'accepted' && (
                                                <button
                                                    onClick={() => { onConvertToDeal(selectedRecommendation); setSelectedRecommendation(null); }}
                                                    className="flex-1 py-3 bg-cyan-600 rounded-xl font-bold text-white shadow-lg hover:bg-cyan-500 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <ShoppingCart className="w-4 h-4" /> Convert to Deal
                                                </button>
                                            )}
                                        </div>
                                    </>
                                );
                            })()}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProductRecommendationsView;
