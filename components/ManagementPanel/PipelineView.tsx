import React, { useState, useMemo } from 'react';
import { Deal, DealStage, DealFilters, Company, User } from '../../types';
import { PLAYBOOKS } from '../../constants';

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
    onDuplicateDeal?: (deal: Deal) => void;
}

const STAGES: DealStage[] = ['qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost'];

// Stagnant deal threshold - deals without updates for this duration are flagged
const STAGNANT_THRESHOLD_DAYS = 30;
const STAGNANT_THRESHOLD_MS = STAGNANT_THRESHOLD_DAYS * 24 * 60 * 60 * 1000;

type ViewMode = 'kanban' | 'list';

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
    onViewDeal,
    onDuplicateDeal
}) => {
    // Filter state
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>('kanban');
    const [selectedDeals, setSelectedDeals] = useState<Set<string>>(new Set());
    const [showPlaybook, setShowPlaybook] = useState<string | null>(null);
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
        
        // Calculate stagnant deals
        const stagnantDeals = activeDeals.filter(d => (new Date().getTime() - new Date(d.lastUpdated).getTime()) > STAGNANT_THRESHOLD_MS);
        
        // Calculate win rate
        const closedWon = filteredDeals.filter(d => d.stage === 'closed_won').length;
        const closedLost = filteredDeals.filter(d => d.stage === 'closed_lost').length;
        const winRate = (closedWon + closedLost) > 0 ? Math.round((closedWon / (closedWon + closedLost)) * 100) : 0;
        
        // Calculate avg deal size
        const avgDealSize = activeDeals.length > 0 ? Math.round(totalValue / activeDeals.length) : 0;
        
        // Calculate deals closing this month
        const thisMonth = new Date().toISOString().substring(0, 7);
        const closingThisMonth = activeDeals.filter(d => d.expectedCloseDate?.substring(0, 7) === thisMonth).length;
        
        return { totalValue, weightedValue, dealCount, stagnantDeals: stagnantDeals.length, winRate, avgDealSize, closingThisMonth };
    }, [filteredDeals]);

    // Toggle deal selection for bulk operations
    const toggleDealSelection = (dealId: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        setSelectedDeals(prev => {
            const newSet = new Set(prev);
            if (newSet.has(dealId)) {
                newSet.delete(dealId);
            } else {
                newSet.add(dealId);
            }
            return newSet;
        });
    };

    // Bulk move selected deals
    const bulkMoveDeals = (stage: DealStage) => {
        selectedDeals.forEach(dealId => {
            onMoveDeal(dealId, stage);
        });
        setSelectedDeals(new Set());
    };

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

    const handleMarkLost = (dealId: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
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

    const getDaysInStage = (deal: Deal) => {
        const lastUpdated = new Date(deal.lastUpdated).getTime();
        const now = Date.now();
        return Math.floor((now - lastUpdated) / (24 * 60 * 60 * 1000));
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
                <div>
                    <h2 className="text-2xl font-bold">Deal Pipeline</h2>
                    <p className="text-sm text-slate-400 mt-1">Track and manage your sales opportunities</p>
                </div>
                <div className="flex gap-2 items-center">
                    {/* View Mode Toggle */}
                    <div className="flex bg-slate-800 rounded-lg p-1 border border-white/10">
                        <button
                            onClick={() => setViewMode('kanban')}
                            className={`px-3 py-1 rounded text-xs font-bold transition-all ${viewMode === 'kanban' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            <i className="fas fa-columns"></i>
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-3 py-1 rounded text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            <i className="fas fa-list"></i>
                        </button>
                    </div>
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

            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-4 flex-shrink-0">
                <div className="bg-slate-800/70 rounded-xl p-4 border border-white/5">
                    <div className="text-xs text-slate-500 uppercase font-bold">Pipeline Value</div>
                    <div className="text-xl font-bold font-mono text-emerald-400">${pipelineMetrics.totalValue.toLocaleString()}</div>
                </div>
                <div className="bg-slate-800/70 rounded-xl p-4 border border-white/5">
                    <div className="text-xs text-slate-500 uppercase font-bold">Weighted</div>
                    <div className="text-xl font-bold font-mono text-cyan-400">${Math.round(pipelineMetrics.weightedValue).toLocaleString()}</div>
                </div>
                <div className="bg-slate-800/70 rounded-xl p-4 border border-white/5">
                    <div className="text-xs text-slate-500 uppercase font-bold">Active Deals</div>
                    <div className="text-xl font-bold font-mono text-white">{pipelineMetrics.dealCount}</div>
                </div>
                <div className="bg-slate-800/70 rounded-xl p-4 border border-white/5">
                    <div className="text-xs text-slate-500 uppercase font-bold">Avg Deal Size</div>
                    <div className="text-xl font-bold font-mono text-purple-400">${pipelineMetrics.avgDealSize.toLocaleString()}</div>
                </div>
                <div className="bg-slate-800/70 rounded-xl p-4 border border-white/5">
                    <div className="text-xs text-slate-500 uppercase font-bold">Win Rate</div>
                    <div className={`text-xl font-bold font-mono ${pipelineMetrics.winRate >= 50 ? 'text-green-400' : 'text-yellow-400'}`}>{pipelineMetrics.winRate}%</div>
                </div>
                <div className={`rounded-xl p-4 border ${pipelineMetrics.stagnantDeals > 0 ? 'bg-red-500/10 border-red-500/30' : 'bg-slate-800/70 border-white/5'}`}>
                    <div className="text-xs text-slate-500 uppercase font-bold">Stagnant</div>
                    <div className={`text-xl font-bold font-mono ${pipelineMetrics.stagnantDeals > 0 ? 'text-red-400' : 'text-slate-400'}`}>{pipelineMetrics.stagnantDeals}</div>
                </div>
                <div className="bg-slate-800/70 rounded-xl p-4 border border-white/5">
                    <div className="text-xs text-slate-500 uppercase font-bold">Closing Soon</div>
                    <div className="text-xl font-bold font-mono text-orange-400">{pipelineMetrics.closingThisMonth}</div>
                </div>
            </div>

            {/* Bulk Actions Bar (when deals are selected) */}
            {selectedDeals.size > 0 && (
                <div className="mb-4 p-3 bg-cyan-600/20 border border-cyan-500/30 rounded-xl flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-cyan-400">{selectedDeals.size} deal{selectedDeals.size > 1 ? 's' : ''} selected</span>
                        <button onClick={() => setSelectedDeals(new Set())} className="text-xs text-slate-400 hover:text-white">
                            Clear
                        </button>
                    </div>
                    <div className="flex gap-2">
                        <select
                            className="px-3 py-1 bg-slate-800 border border-white/10 rounded text-xs"
                            onChange={(e) => { if (e.target.value) bulkMoveDeals(e.target.value as DealStage); e.target.value = ''; }}
                            defaultValue=""
                        >
                            <option value="">Move to...</option>
                            {STAGES.filter(s => s !== 'closed_lost').map(stage => (
                                <option key={stage} value={stage}>{stage.replace('_', ' ')}</option>
                            ))}
                        </select>
                        <button
                            onClick={() => { selectedDeals.forEach(id => onDeleteDeal?.(id)); setSelectedDeals(new Set()); }}
                            className="px-3 py-1 bg-red-600/20 border border-red-500/30 text-red-400 rounded text-xs font-bold hover:bg-red-600/30"
                        >
                            <i className="fas fa-archive mr-1"></i> Archive All
                        </button>
                    </div>
                </div>
            )}

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
            {viewMode === 'kanban' && (
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
                                        const daysInStage = getDaysInStage(deal);
                                        const isSelected = selectedDeals.has(deal.id);

                                        return (
                                            <div
                                                key={deal.id}
                                                draggable
                                                onDragStart={(e) => onDealDragStart(e, deal.id)}
                                                onClick={() => onViewDeal?.(deal)}
                                                className={`p-4 bg-slate-700 rounded-lg border shadow-sm group hover:border-cyan-500/50 transition-all relative cursor-grab active:cursor-grabbing ${
                                                    deal.isArchived ? 'opacity-60 border-white/5' : 
                                                    isSelected ? 'border-cyan-500 bg-cyan-500/10' : 'border-white/5'
                                                }`}
                                            >
                                                {/* Selection checkbox */}
                                                <div 
                                                    className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={(e) => toggleDealSelection(deal.id, e)}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => {}}
                                                        className="w-4 h-4 rounded border-white/20 bg-black/30 cursor-pointer"
                                                    />
                                                </div>

                                                {/* Days in stage badge */}
                                                {stage !== 'closed_won' && stage !== 'closed_lost' && daysInStage > 0 && (
                                                    <div className={`absolute top-2 right-8 text-[9px] px-1.5 py-0.5 rounded ${
                                                        daysInStage > 30 ? 'bg-red-500/20 text-red-400' :
                                                        daysInStage > 14 ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-slate-600 text-slate-400'
                                                    }`}>
                                                        {daysInStage}d
                                                    </div>
                                                )}

                                                {/* Company name */}
                                                <div className="text-xs text-cyan-400 font-bold mb-1 truncate pl-5 group-hover:pl-0">
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
                                                        {/* Playbook button */}
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setShowPlaybook(showPlaybook === deal.id ? null : deal.id); }}
                                                            className="text-[10px] hover:text-purple-400 p-1"
                                                            title="View Playbook"
                                                        >
                                                            <i className="fas fa-book"></i>
                                                        </button>
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
                                                        {/* Duplicate button */}
                                                        {onDuplicateDeal && (
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); onDuplicateDeal(deal); }}
                                                                className="text-[10px] hover:text-green-400 p-1"
                                                                title="Duplicate Deal"
                                                            >
                                                                <i className="fas fa-copy"></i>
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

                                                {/* Playbook Popup */}
                                                {showPlaybook === deal.id && (
                                                    <div 
                                                        className="mt-3 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="text-xs font-bold text-purple-400">
                                                                <i className="fas fa-book mr-1"></i> Stage Playbook
                                                            </span>
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); setShowPlaybook(null); }}
                                                                className="text-slate-400 hover:text-white text-xs"
                                                            >
                                                                <i className="fas fa-times"></i>
                                                            </button>
                                                        </div>
                                                        <ul className="space-y-1">
                                                            {(PLAYBOOKS[deal.stage] || []).map((step, i) => (
                                                                <li key={i} className="text-[10px] text-slate-300 flex items-start gap-2">
                                                                    <span className="text-purple-400 font-bold mt-0.5">{i + 1}.</span>
                                                                    <span>{step}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
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
            )}

            {/* List View */}
            {viewMode === 'list' && (
                <div className="flex-1 overflow-y-auto">
                    <div className="bg-slate-800 rounded-xl border border-white/5 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-slate-900/50">
                                <tr className="text-xs text-slate-400 uppercase">
                                    <th className="text-left p-4 w-10">
                                        <input 
                                            type="checkbox"
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedDeals(new Set(filteredDeals.map(d => d.id)));
                                                } else {
                                                    setSelectedDeals(new Set());
                                                }
                                            }}
                                            checked={selectedDeals.size === filteredDeals.length && filteredDeals.length > 0}
                                            className="rounded border-white/20 bg-black/30"
                                        />
                                    </th>
                                    <th className="text-left p-4">Deal</th>
                                    <th className="text-left p-4">Company</th>
                                    <th className="text-left p-4">Value</th>
                                    <th className="text-left p-4">Probability</th>
                                    <th className="text-left p-4">Stage</th>
                                    <th className="text-left p-4">Close Date</th>
                                    <th className="text-left p-4">Owner</th>
                                    <th className="text-left p-4">Days</th>
                                    <th className="text-right p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredDeals.map(deal => {
                                    const isStagnant = (new Date().getTime() - new Date(deal.lastUpdated).getTime()) > STAGNANT_THRESHOLD_MS;
                                    const daysInStage = getDaysInStage(deal);
                                    const isSelected = selectedDeals.has(deal.id);

                                    return (
                                        <tr 
                                            key={deal.id} 
                                            className={`hover:bg-white/5 transition-colors cursor-pointer ${isSelected ? 'bg-cyan-500/10' : ''}`}
                                            onClick={() => onViewDeal?.(deal)}
                                        >
                                            <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => toggleDealSelection(deal.id)}
                                                    className="rounded border-white/20 bg-black/30"
                                                />
                                            </td>
                                            <td className="p-4">
                                                <div className="font-bold">{deal.title}</div>
                                                {deal.notes && <div className="text-xs text-slate-400 truncate max-w-[200px]">{deal.notes}</div>}
                                            </td>
                                            <td className="p-4">
                                                <span className="text-cyan-400 text-sm font-bold">{companies.find(c => c.id === deal.companyId)?.name || '-'}</span>
                                            </td>
                                            <td className="p-4">
                                                <span className="font-mono font-bold text-emerald-400">${deal.value.toLocaleString()}</span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`font-bold ${
                                                    deal.probability >= 70 ? 'text-emerald-400' :
                                                    deal.probability >= 40 ? 'text-yellow-400' : 'text-slate-400'
                                                }`}>
                                                    {deal.probability}%
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                    deal.stage === 'closed_won' ? 'bg-emerald-500/20 text-emerald-400' :
                                                    deal.stage === 'closed_lost' ? 'bg-red-500/20 text-red-400' :
                                                    'bg-cyan-500/20 text-cyan-400'
                                                }`}>
                                                    {deal.stage.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm">{deal.expectedCloseDate}</td>
                                            <td className="p-4 text-sm text-slate-400">{getOwnerName(deal.ownerId) || '-'}</td>
                                            <td className="p-4">
                                                <span className={`text-xs px-2 py-1 rounded ${
                                                    isStagnant ? 'bg-red-500/20 text-red-400' :
                                                    daysInStage > 14 ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-slate-600 text-slate-400'
                                                }`}>
                                                    {daysInStage}d
                                                </span>
                                            </td>
                                            <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        onClick={() => onEditDeal?.(deal)}
                                                        className="p-2 rounded hover:bg-white/10 text-slate-400 hover:text-cyan-400"
                                                        title="Edit"
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    {onDuplicateDeal && (
                                                        <button
                                                            onClick={() => onDuplicateDeal(deal)}
                                                            className="p-2 rounded hover:bg-white/10 text-slate-400 hover:text-green-400"
                                                            title="Duplicate"
                                                        >
                                                            <i className="fas fa-copy"></i>
                                                        </button>
                                                    )}
                                                    {deal.stage !== 'closed_won' && deal.stage !== 'closed_lost' && (
                                                        <>
                                                            <button
                                                                onClick={() => onMoveDeal(deal.id, 'closed_won')}
                                                                className="p-2 rounded hover:bg-white/10 text-slate-400 hover:text-emerald-400"
                                                                title="Mark Won"
                                                            >
                                                                <i className="fas fa-check"></i>
                                                            </button>
                                                            <button
                                                                onClick={() => handleMarkLost(deal.id)}
                                                                className="p-2 rounded hover:bg-white/10 text-slate-400 hover:text-red-400"
                                                                title="Mark Lost"
                                                            >
                                                                <i className="fas fa-times"></i>
                                                            </button>
                                                        </>
                                                    )}
                                                    {onDeleteDeal && (
                                                        <button
                                                            onClick={() => onDeleteDeal(deal.id)}
                                                            className="p-2 rounded hover:bg-white/10 text-slate-400 hover:text-red-400"
                                                            title="Archive"
                                                        >
                                                            <i className="fas fa-archive"></i>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {filteredDeals.length === 0 && (
                            <div className="text-center py-16 text-slate-500">
                                <i className="fas fa-inbox text-4xl mb-4"></i>
                                <p>No deals found</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PipelineView;
