import React, { useState, useMemo } from 'react';
import { Deal, DealStage, DealFilters, Company, User } from '../../types';

interface PipelineViewProps {
    deals: Deal[];
    companies: Company[];
    users?: User[];
    selectedCompanyId: string;
    draggedDealId: string | null;
    onDealDragStart: (e: React.DragEvent, id: string) => void;
    onDealDragOver: (e: React.DragEvent) => void;
    onDealDrop: (e: React.DragEvent, stage: DealStage) => void;
    onDealExport: () => void;
    onMoveDeal: (id: string, stage: DealStage) => void;
    onAddDeal: () => void;
    onEditDeal?: (deal: Deal) => void;
    onDeleteDeal?: (dealId: string) => void;
    onMarkLost?: (dealId: string) => void;
    onViewDeal?: (deal: Deal) => void;
}

const STAGES: DealStage[] = ['qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost'];

// Stagnant deal threshold - deals without updates for this duration are flagged
const STAGNANT_THRESHOLD_DAYS = 30;
const STAGNANT_THRESHOLD_MS = STAGNANT_THRESHOLD_DAYS * 24 * 60 * 60 * 1000;

const PipelineView: React.FC<PipelineViewProps> = ({
    deals,
    companies,
    users = [],
    selectedCompanyId,
    draggedDealId,
    onDealDragStart,
    onDealDragOver,
    onDealDrop,
    onDealExport,
    onMoveDeal,
    onAddDeal,
    onEditDeal,
    onDeleteDeal,
    onMarkLost,
    onViewDeal
}) => {
    // Filter state
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<DealFilters>({
        search: '',
        stages: [],
        minValue: undefined,
        maxValue: undefined,
        dateFrom: '',
        dateTo: '',
        ownerId: '',
        showArchived: false
    });

    // Apply filters to deals
    const filteredDeals = useMemo(() => {
        let result = deals.filter(d => !d.isArchived || filters.showArchived);

        // Company filter
        if (selectedCompanyId !== 'all') {
            result = result.filter(d => d.companyId === selectedCompanyId);
        }

        // Search filter
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            result = result.filter(d =>
                d.title.toLowerCase().includes(searchLower) ||
                companies.find(c => c.id === d.companyId)?.name.toLowerCase().includes(searchLower)
            );
        }

        // Stage filter
        if (filters.stages && filters.stages.length > 0) {
            result = result.filter(d => filters.stages!.includes(d.stage));
        }

        // Value range filter
        if (filters.minValue !== undefined) {
            result = result.filter(d => d.value >= filters.minValue!);
        }
        if (filters.maxValue !== undefined) {
            result = result.filter(d => d.value <= filters.maxValue!);
        }

        // Date range filter
        if (filters.dateFrom) {
            result = result.filter(d => d.expectedCloseDate >= filters.dateFrom!);
        }
        if (filters.dateTo) {
            result = result.filter(d => d.expectedCloseDate <= filters.dateTo!);
        }

        // Owner filter
        if (filters.ownerId) {
            result = result.filter(d => d.ownerId === filters.ownerId);
        }

        return result;
    }, [deals, selectedCompanyId, filters, companies]);

    // Calculate pipeline metrics
    const pipelineMetrics = useMemo(() => {
        const activeDeals = filteredDeals.filter(d => d.stage !== 'closed_won' && d.stage !== 'closed_lost');
        const totalValue = activeDeals.reduce((acc, d) => acc + d.value, 0);
        const weightedValue = activeDeals.reduce((acc, d) => acc + (d.value * d.probability / 100), 0);
        const dealCount = activeDeals.length;
        return { totalValue, weightedValue, dealCount };
    }, [filteredDeals]);

    const clearFilters = () => {
        setFilters({
            search: '',
            stages: [],
            minValue: undefined,
            maxValue: undefined,
            dateFrom: '',
            dateTo: '',
            ownerId: '',
            showArchived: false
        });
    };

    const hasActiveFilters = filters.search || (filters.stages && filters.stages.length > 0) ||
        filters.minValue !== undefined || filters.maxValue !== undefined ||
        filters.dateFrom || filters.dateTo || filters.ownerId || filters.showArchived;

    const handleMarkLost = (dealId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (onMarkLost) {
            onMarkLost(dealId);
        } else {
            onMoveDeal(dealId, 'closed_lost');
        }
    };

    const getOwnerName = (ownerId?: string) => {
        if (!ownerId) return null;
        const owner = users.find(u => u.id === ownerId);
        return owner?.name;
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
                <div>
                    <h2 className="text-2xl font-bold">Deal Pipeline</h2>
                    <div className="text-sm text-slate-400 mt-1 flex gap-4">
                        <span>
                            Pipeline Value: <span className="text-emerald-400 font-mono font-bold">${pipelineMetrics.totalValue.toLocaleString()}</span>
                        </span>
                        <span>
                            Weighted: <span className="text-cyan-400 font-mono font-bold">${Math.round(pipelineMetrics.weightedValue).toLocaleString()}</span>
                        </span>
                        <span>
                            Deals: <span className="text-white font-mono">{pipelineMetrics.dealCount}</span>
                        </span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`px-4 py-2 rounded text-xs font-bold shadow-lg transition-all ${showFilters || hasActiveFilters ? 'bg-cyan-600 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}
                    >
                        <i className="fas fa-filter mr-2"></i>
                        Filters
                        {hasActiveFilters && <span className="ml-2 bg-white/20 px-1.5 py-0.5 rounded-full text-[10px]">Active</span>}
                    </button>
                    <button onClick={onDealExport} className="px-4 py-2 bg-slate-700 rounded text-xs font-bold hover:bg-slate-600 shadow-lg">
                        <i className="fas fa-download mr-2"></i> Export
                    </button>
                    <button onClick={onAddDeal} className="px-4 py-2 bg-orange-600 rounded text-xs font-bold hover:bg-orange-500 shadow-lg shadow-orange-500/20">
                        + New Deal
                    </button>
                </div>
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <div className="mb-4 p-4 bg-slate-800/70 rounded-xl border border-white/10 flex-shrink-0">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-bold text-slate-300">Filter Deals</h3>
                        {hasActiveFilters && (
                            <button onClick={clearFilters} className="text-xs text-cyan-400 hover:text-cyan-300">
                                Clear All
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {/* Search */}
                        <div>
                            <label className="text-[10px] text-slate-500 uppercase mb-1 block">Search</label>
                            <input
                                type="text"
                                placeholder="Deal title or company..."
                                className="w-full p-2 bg-black/30 rounded border border-white/10 text-sm"
                                value={filters.search || ''}
                                onChange={e => setFilters({ ...filters, search: e.target.value })}
                            />
                        </div>

                        {/* Stage filter */}
                        <div>
                            <label className="text-[10px] text-slate-500 uppercase mb-1 block">Stage</label>
                            <select
                                className="w-full p-2 bg-black/30 rounded border border-white/10 text-sm text-slate-300"
                                value={filters.stages?.[0] || ''}
                                onChange={e => setFilters({ ...filters, stages: e.target.value ? [e.target.value as DealStage] : [] })}
                            >
                                <option value="">All Stages</option>
                                {STAGES.map(stage => (
                                    <option key={stage} value={stage}>{stage.replace('_', ' ')}</option>
                                ))}
                            </select>
                        </div>

                        {/* Value range */}
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-[10px] text-slate-500 uppercase mb-1 block">Min Value</label>
                                <input
                                    type="number"
                                    placeholder="$0"
                                    className="w-full p-2 bg-black/30 rounded border border-white/10 text-sm"
                                    value={filters.minValue || ''}
                                    onChange={e => setFilters({ ...filters, minValue: e.target.value ? Number(e.target.value) : undefined })}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-500 uppercase mb-1 block">Max Value</label>
                                <input
                                    type="number"
                                    placeholder="No limit"
                                    className="w-full p-2 bg-black/30 rounded border border-white/10 text-sm"
                                    value={filters.maxValue || ''}
                                    onChange={e => setFilters({ ...filters, maxValue: e.target.value ? Number(e.target.value) : undefined })}
                                />
                            </div>
                        </div>

                        {/* Owner filter */}
                        <div>
                            <label className="text-[10px] text-slate-500 uppercase mb-1 block">Owner</label>
                            <select
                                className="w-full p-2 bg-black/30 rounded border border-white/10 text-sm text-slate-300"
                                value={filters.ownerId || ''}
                                onChange={e => setFilters({ ...filters, ownerId: e.target.value })}
                            >
                                <option value="">All Owners</option>
                                {users.map(user => (
                                    <option key={user.id} value={user.id}>{user.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Date range */}
                        <div>
                            <label className="text-[10px] text-slate-500 uppercase mb-1 block">Close Date From</label>
                            <input
                                type="date"
                                className="w-full p-2 bg-black/30 rounded border border-white/10 text-sm text-slate-300"
                                value={filters.dateFrom || ''}
                                onChange={e => setFilters({ ...filters, dateFrom: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-slate-500 uppercase mb-1 block">Close Date To</label>
                            <input
                                type="date"
                                className="w-full p-2 bg-black/30 rounded border border-white/10 text-sm text-slate-300"
                                value={filters.dateTo || ''}
                                onChange={e => setFilters({ ...filters, dateTo: e.target.value })}
                            />
                        </div>

                        {/* Show archived */}
                        <div className="flex items-end">
                            <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.showArchived || false}
                                    onChange={e => setFilters({ ...filters, showArchived: e.target.checked })}
                                    className="rounded border-white/20 bg-black/30"
                                />
                                Show Archived
                            </label>
                        </div>
                    </div>
                </div>
            )}

            {/* Kanban Board */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
                <div className="flex gap-4 h-full min-w-[1000px]">
                    {STAGES.map((stage) => {
                        const stageDeals = filteredDeals.filter(d => d.stage === stage);
                        const draggedDeal = deals.find(d => d.id === draggedDealId);
                        const stageValue = stageDeals.reduce((acc, d) => acc + d.value, 0);

                        return (
                            <div
                                key={stage}
                                className={`w-72 flex-shrink-0 flex flex-col bg-slate-800/50 rounded-xl border transition-all h-full ${draggedDeal && draggedDeal.stage !== stage ? 'border-dashed border-cyan-500/30 bg-cyan-500/5' : 'border-white/5'
                                    }`}
                                onDragOver={onDealDragOver}
                                onDrop={(e) => onDealDrop(e, stage)}
                            >
                                {/* Stage Header */}
                                <div className={`p-3 border-b border-white/5 ${stage === 'closed_won' ? 'text-emerald-400 bg-emerald-500/10' :
                                        stage === 'closed_lost' ? 'text-red-400 bg-red-500/10' :
                                            'text-slate-400 bg-slate-800'
                                    }`}>
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold uppercase text-xs tracking-wider">{stage.replace('_', ' ')}</span>
                                        <span className="bg-black/30 px-2 py-0.5 rounded text-[10px]">{stageDeals.length}</span>
                                    </div>
                                    <div className="text-[10px] mt-1 font-mono opacity-70">${stageValue.toLocaleString()}</div>
                                </div>

                                {/* Deal Cards */}
                                <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                                    {stageDeals.map(deal => {
                                        const isStagnant = (new Date().getTime() - new Date(deal.lastUpdated).getTime()) > STAGNANT_THRESHOLD_MS;
                                        const ownerName = getOwnerName(deal.ownerId);

                                        return (
                                            <div
                                                key={deal.id}
                                                draggable
                                                onDragStart={(e) => onDealDragStart(e, deal.id)}
                                                onClick={() => onViewDeal?.(deal)}
                                                className={`p-4 bg-slate-700 rounded-lg border shadow-sm group hover:border-cyan-500/50 transition-all relative cursor-grab active:cursor-grabbing ${deal.isArchived ? 'opacity-60 border-white/5' : 'border-white/5'
                                                    }`}
                                            >
                                                {/* Company name */}
                                                <div className="text-xs text-cyan-400 font-bold mb-1 truncate">
                                                    {companies.find(c => c.id === deal.companyId)?.name}
                                                </div>

                                                {/* Deal title */}
                                                <div className="font-bold text-sm mb-2">{deal.title}</div>

                                                {/* Value and Probability */}
                                                <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
                                                    <span className="font-mono text-white">${deal.value.toLocaleString()}</span>
                                                    <span className={`${deal.probability >= 70 ? 'text-emerald-400' :
                                                            deal.probability >= 40 ? 'text-yellow-400' : 'text-slate-400'
                                                        }`}>
                                                        {deal.probability}%
                                                    </span>
                                                </div>

                                                {/* Expected close date */}
                                                <div className="text-[10px] text-slate-500 mb-1 truncate">
                                                    <i className="fas fa-calendar-alt mr-1"></i> {deal.expectedCloseDate}
                                                </div>

                                                {/* Owner */}
                                                {ownerName && (
                                                    <div className="text-[10px] text-slate-500 truncate">
                                                        <i className="fas fa-user mr-1"></i> {ownerName}
                                                    </div>
                                                )}

                                                {/* Loss reason badge */}
                                                {deal.stage === 'closed_lost' && deal.lossReason && (
                                                    <div className="mt-2 text-[10px] text-red-400 bg-red-500/10 px-2 py-1 rounded truncate" title={deal.lossReason}>
                                                        <i className="fas fa-info-circle mr-1"></i> {deal.lossReason}
                                                    </div>
                                                )}

                                                {/* Stagnant indicator */}
                                                {isStagnant && (
                                                    <div className="absolute top-2 right-2 text-red-500 animate-pulse" title="Stagnant Deal (>30 days)">
                                                        <i className="fas fa-exclamation-circle"></i>
                                                    </div>
                                                )}

                                                {/* Archived badge */}
                                                {deal.isArchived && (
                                                    <div className="absolute top-2 left-2 text-[9px] bg-slate-600 px-1.5 py-0.5 rounded uppercase">
                                                        Archived
                                                    </div>
                                                )}

                                                {/* Action buttons */}
                                                <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <div className="flex gap-1">
                                                        {/* Edit button */}
                                                        {onEditDeal && (
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); onEditDeal(deal); }}
                                                                className="text-[10px] hover:text-cyan-400 p-1"
                                                                title="Edit Deal"
                                                            >
                                                                <i className="fas fa-edit"></i>
                                                            </button>
                                                        )}

                                                        {/* Delete button */}
                                                        {onDeleteDeal && (
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); onDeleteDeal(deal.id); }}
                                                                className="text-[10px] hover:text-red-400 p-1"
                                                                title="Archive Deal"
                                                            >
                                                                <i className="fas fa-archive"></i>
                                                            </button>
                                                        )}

                                                        {/* Move backward */}
                                                        {stage !== 'qualification' && stage !== 'closed_won' && stage !== 'closed_lost' && (
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); onMoveDeal(deal.id, 'qualification'); }}
                                                                className="text-[10px] hover:text-white p-1"
                                                                title="Move to Start"
                                                            >
                                                                <i className="fas fa-backward"></i>
                                                            </button>
                                                        )}
                                                    </div>

                                                    <div className="flex gap-1">
                                                        {/* Mark Lost */}
                                                        {stage !== 'closed_lost' && stage !== 'closed_won' && (
                                                            <button
                                                                onClick={(e) => handleMarkLost(deal.id, e)}
                                                                className="text-[10px] hover:text-red-400 p-1"
                                                                title="Mark Lost"
                                                            >
                                                                <i className="fas fa-times"></i>
                                                            </button>
                                                        )}

                                                        {/* Mark Won */}
                                                        {stage !== 'closed_won' && stage !== 'closed_lost' && (
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); onMoveDeal(deal.id, 'closed_won'); }}
                                                                className="text-[10px] hover:text-emerald-400 p-1"
                                                                title="Mark Won"
                                                            >
                                                                <i className="fas fa-check"></i>
                                                            </button>
                                                        )}

                                                        {/* Advance */}
                                                        {stage !== 'closed_won' && stage !== 'closed_lost' && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    const stageIndex = STAGES.indexOf(stage);
                                                                    const next = STAGES[stageIndex + 1];
                                                                    if (next && next !== 'closed_lost') onMoveDeal(deal.id, next);
                                                                }}
                                                                className="text-[10px] hover:text-white p-1"
                                                                title="Advance"
                                                            >
                                                                <i className="fas fa-forward"></i>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {stageDeals.length === 0 && (
                                        <div className="text-center text-slate-500 text-xs py-8 opacity-50">
                                            No deals
                                        </div>
                                    )}
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
