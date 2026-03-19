import React, { useState } from 'react';
import { KPIGoal } from '../types';

interface KPIViewProps {
    goals: KPIGoal[];
    onUpdateGoal: (id: string, current: number) => void;
    onAddGoal?: (goal: KPIGoal) => void;
    onEditGoal?: (goal: KPIGoal) => void;
    onDeleteGoal?: (id: string) => void;
}

const METRIC_ICONS: Record<string, string> = {
    revenue: 'fa-dollar-sign',
    new_clients: 'fa-user-plus',
    meetings_held: 'fa-handshake',
    contracts_signed: 'fa-file-signature',
    deals_won: 'fa-trophy',
    tickets_resolved: 'fa-ticket-alt',
};

const METRIC_OPTIONS = [
    { value: 'revenue', label: 'Revenue' },
    { value: 'new_clients', label: 'New Clients' },
    { value: 'meetings_held', label: 'Meetings Held' },
    { value: 'contracts_signed', label: 'Contracts Signed' },
    { value: 'deals_won', label: 'Deals Won' },
    { value: 'tickets_resolved', label: 'Tickets Resolved' },
];

const PERIOD_OPTIONS = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' },
];

const KPIView: React.FC<KPIViewProps> = ({ goals, onUpdateGoal, onAddGoal, onEditGoal, onDeleteGoal }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState<KPIGoal | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
    const [adjustingGoal, setAdjustingGoal] = useState<string | null>(null);
    const [adjustValue, setAdjustValue] = useState<number>(0);
    
    // Form state
    const [formData, setFormData] = useState({
        label: '',
        metric: 'revenue' as KPIGoal['metric'],
        target: 0,
        current: 0,
        period: 'monthly' as KPIGoal['period'],
        startDate: new Date().toISOString().split('T')[0],
    });

    const onTrack = goals.filter(g => (g.current / g.target) >= 0.7).length;
    const atRisk = goals.filter(g => (g.current / g.target) < 0.5).length;

    const openAddModal = () => {
        setEditingGoal(null);
        setFormData({
            label: '',
            metric: 'revenue',
            target: 0,
            current: 0,
            period: 'monthly',
            startDate: new Date().toISOString().split('T')[0],
        });
        setIsModalOpen(true);
    };

    const openEditModal = (goal: KPIGoal) => {
        setEditingGoal(goal);
        setFormData({
            label: goal.label,
            metric: goal.metric,
            target: goal.target,
            current: goal.current,
            period: goal.period,
            startDate: goal.startDate,
        });
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (!formData.label.trim() || formData.target <= 0) return;

        const goalData: KPIGoal = {
            id: editingGoal?.id || `kpi_${Date.now()}`,
            ...formData,
        };

        if (editingGoal && onEditGoal) {
            onEditGoal(goalData);
        } else if (onAddGoal) {
            onAddGoal(goalData);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id: string) => {
        if (onDeleteGoal) {
            onDeleteGoal(id);
        }
        setConfirmDelete(null);
    };

    const handleAdjust = (id: string) => {
        onUpdateGoal(id, adjustValue);
        setAdjustingGoal(null);
    };

    const startAdjust = (goal: KPIGoal) => {
        setAdjustingGoal(goal.id);
        setAdjustValue(goal.current);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">KPI Goals</h2>
                <div className="flex gap-3 items-center">
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs font-bold text-green-400">{onTrack} On Track</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-xs font-bold text-red-400">{atRisk} At Risk</span>
                    </div>
                    {onAddGoal && (
                        <button
                            onClick={openAddModal}
                            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-sm font-bold transition-all"
                        >
                            <i className="fas fa-plus"></i>
                            Add Goal
                        </button>
                    )}
                </div>
            </div>

            {goals.length === 0 ? (
                <div className="text-center py-16 bg-slate-800/50 rounded-xl border border-white/10">
                    <i className="fas fa-chart-line text-4xl text-slate-600 mb-4"></i>
                    <p className="text-slate-400 text-lg mb-2">No KPI Goals Yet</p>
                    <p className="text-slate-500 text-sm mb-4">Create your first goal to start tracking performance</p>
                    {onAddGoal && (
                        <button
                            onClick={openAddModal}
                            className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-sm font-bold transition-all"
                        >
                            <i className="fas fa-plus mr-2"></i>Create Goal
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {goals.map(goal => {
                        const progress = Math.min(Math.round((goal.current / goal.target) * 100), 100);
                        const isOnTrack = progress >= 70;
                        const isAtRisk = progress < 50;
                        const color = isOnTrack ? 'green' : isAtRisk ? 'red' : 'yellow';
                        const icon = METRIC_ICONS[goal.metric] || 'fa-chart-bar';

                        return (
                            <div key={goal.id} className={`bg-slate-800 rounded-xl border border-${color}-500/20 p-6 relative overflow-hidden group`}>
                                <div className={`absolute -right-4 -top-4 w-20 h-20 bg-${color}-500/5 rounded-full group-hover:bg-${color}-500/10 transition-all`}></div>
                                
                                {/* Action buttons */}
                                <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => startAdjust(goal)}
                                        className="w-7 h-7 rounded bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-slate-400 hover:text-white transition-all"
                                        title="Adjust Value"
                                    >
                                        <i className="fas fa-sliders-h text-xs"></i>
                                    </button>
                                    {onEditGoal && (
                                        <button
                                            onClick={() => openEditModal(goal)}
                                            className="w-7 h-7 rounded bg-slate-700 hover:bg-cyan-600 flex items-center justify-center text-slate-400 hover:text-white transition-all"
                                            title="Edit Goal"
                                        >
                                            <i className="fas fa-edit text-xs"></i>
                                        </button>
                                    )}
                                    {onDeleteGoal && (
                                        <button
                                            onClick={() => setConfirmDelete(goal.id)}
                                            className="w-7 h-7 rounded bg-slate-700 hover:bg-red-600 flex items-center justify-center text-slate-400 hover:text-white transition-all"
                                            title="Delete Goal"
                                        >
                                            <i className="fas fa-trash text-xs"></i>
                                        </button>
                                    )}
                                </div>

                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`w-10 h-10 rounded-lg bg-${color}-500/20 flex items-center justify-center`}>
                                            <i className={`fas ${icon} text-${color}-400`}></i>
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm">{goal.label}</div>
                                            <div className="text-[10px] uppercase text-slate-500 font-bold">{goal.period}</div>
                                        </div>
                                    </div>

                                    {adjustingGoal === goal.id ? (
                                        <div className="mb-3">
                                            <label className="text-xs text-slate-400 mb-1 block">Adjust Current Value:</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="number"
                                                    value={adjustValue}
                                                    onChange={(e) => setAdjustValue(Number(e.target.value))}
                                                    className="flex-1 px-3 py-2 bg-slate-700 border border-white/10 rounded text-sm"
                                                />
                                                <button
                                                    onClick={() => handleAdjust(goal.id)}
                                                    className="px-3 py-2 bg-green-600 hover:bg-green-500 rounded text-xs font-bold"
                                                >
                                                    <i className="fas fa-check"></i>
                                                </button>
                                                <button
                                                    onClick={() => setAdjustingGoal(null)}
                                                    className="px-3 py-2 bg-slate-600 hover:bg-slate-500 rounded text-xs font-bold"
                                                >
                                                    <i className="fas fa-times"></i>
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex justify-between items-end mb-3">
                                            <div>
                                                <span className={`text-3xl font-bold font-mono text-${color}-400`}>
                                                    {goal.metric === 'revenue' ? `$${(goal.current / 1000).toFixed(1)}k` : goal.current}
                                                </span>
                                                <span className="text-slate-500 text-sm ml-1">
                                                    / {goal.metric === 'revenue' ? `$${(goal.target / 1000).toFixed(0)}k` : goal.target}
                                                </span>
                                            </div>
                                            <div className={`text-sm font-bold text-${color}-400`}>
                                                {progress}%
                                                <i className={`fas fa-arrow-${isOnTrack ? 'up' : 'down'} ml-1 text-xs`}></i>
                                            </div>
                                        </div>
                                    )}

                                    <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ${isOnTrack ? 'bg-gradient-to-r from-green-600 to-green-400' : isAtRisk ? 'bg-gradient-to-r from-red-600 to-red-400' : 'bg-gradient-to-r from-yellow-600 to-yellow-400'}`}
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>

                                    <div className="text-[10px] text-slate-500 mt-2">
                                        {goal.target - goal.current > 0
                                            ? `${goal.metric === 'revenue' ? '$' + (goal.target - goal.current).toLocaleString() : (goal.target - goal.current)} remaining`
                                            : 'Goal achieved! 🎉'}
                                    </div>
                                </div>

                                {/* Delete confirmation overlay */}
                                {confirmDelete === goal.id && (
                                    <div className="absolute inset-0 bg-slate-900/95 rounded-xl flex flex-col items-center justify-center p-4 z-20">
                                        <i className="fas fa-exclamation-triangle text-red-400 text-2xl mb-2"></i>
                                        <p className="text-sm text-center mb-4">Delete "{goal.label}"?</p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleDelete(goal.id)}
                                                className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded text-xs font-bold"
                                            >
                                                Delete
                                            </button>
                                            <button
                                                onClick={() => setConfirmDelete(null)}
                                                className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded text-xs font-bold"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-slate-800 rounded-2xl border border-white/10 w-full max-w-md p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">
                                {editingGoal ? 'Edit KPI Goal' : 'Create KPI Goal'}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Goal Name</label>
                                <input
                                    type="text"
                                    value={formData.label}
                                    onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                                    placeholder="e.g., Monthly Revenue Target"
                                    className="w-full px-4 py-3 bg-slate-700 border border-white/10 rounded-lg focus:border-cyan-500 focus:outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Metric Type</label>
                                    <select
                                        value={formData.metric}
                                        onChange={(e) => setFormData(prev => ({ ...prev, metric: e.target.value as KPIGoal['metric'] }))}
                                        className="w-full px-4 py-3 bg-slate-700 border border-white/10 rounded-lg focus:border-cyan-500 focus:outline-none"
                                    >
                                        {METRIC_OPTIONS.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Period</label>
                                    <select
                                        value={formData.period}
                                        onChange={(e) => setFormData(prev => ({ ...prev, period: e.target.value as KPIGoal['period'] }))}
                                        className="w-full px-4 py-3 bg-slate-700 border border-white/10 rounded-lg focus:border-cyan-500 focus:outline-none"
                                    >
                                        {PERIOD_OPTIONS.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">
                                        Target {formData.metric === 'revenue' ? '($)' : ''}
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.target}
                                        onChange={(e) => setFormData(prev => ({ ...prev, target: Number(e.target.value) }))}
                                        min="1"
                                        className="w-full px-4 py-3 bg-slate-700 border border-white/10 rounded-lg focus:border-cyan-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">
                                        Current {formData.metric === 'revenue' ? '($)' : ''}
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.current}
                                        onChange={(e) => setFormData(prev => ({ ...prev, current: Number(e.target.value) }))}
                                        min="0"
                                        className="w-full px-4 py-3 bg-slate-700 border border-white/10 rounded-lg focus:border-cyan-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Start Date</label>
                                <input
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                                    className="w-full px-4 py-3 bg-slate-700 border border-white/10 rounded-lg focus:border-cyan-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleSave}
                                disabled={!formData.label.trim() || formData.target <= 0}
                                className="flex-1 px-4 py-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-lg font-bold transition-all"
                            >
                                <i className={`fas fa-${editingGoal ? 'save' : 'plus'} mr-2`}></i>
                                {editingGoal ? 'Save Changes' : 'Create Goal'}
                            </button>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KPIView;
