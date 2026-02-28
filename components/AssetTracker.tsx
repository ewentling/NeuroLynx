import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Asset, Company, AssetType } from '../types';
import { Laptop, Server, Smartphone, Key, Settings, Trash2, Plus, Search, Tag, User, Calendar, DollarSign, Activity } from 'lucide-react';

interface AssetTrackerProps {
    assets: Asset[];
    companies: Company[];
}

const AssetTracker: React.FC<AssetTrackerProps> = ({ assets, companies }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState<AssetType | 'all'>('all');

    const filteredAssets = assets.filter(a => {
        const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'all' || a.type === typeFilter;
        return matchesSearch && matchesType;
    });

    const getAssetIcon = (type: AssetType) => {
        switch (type) {
            case 'laptop': return <Laptop className="w-5 h-5" />;
            case 'server': return <Server className="w-5 h-5" />;
            case 'mobile': return <Smartphone className="w-5 h-5" />;
            case 'license': return <Key className="w-5 h-5" />;
            case 'networking': return <Activity className="w-5 h-5" />;
            default: return <Tag className="w-5 h-5" />;
        }
    };

    const getStatusColor = (status: Asset['status']) => {
        switch (status) {
            case 'active': return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'deployed': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'maintenance': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
            case 'retired': return 'bg-slate-800 text-slate-500 border-white/5';
            default: return 'bg-slate-800 text-slate-400 border-white/5';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">IT Asset Inventory</h2>
                    <p className="text-slate-400 text-sm">Managing client hardware, software licenses, and critical infrastructure.</p>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-bold text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add Asset
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-900 border border-white/10 p-6 rounded-3xl shadow-xl">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Search & Filters</h3>
                        <div className="relative mb-6">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search by name or serial..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-800 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            {['all', 'laptop', 'server', 'mobile', 'license', 'networking'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setTypeFilter(type as any)}
                                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-3 ${typeFilter === type ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-lg shadow-cyan-500/10' : 'text-slate-500 border-transparent hover:bg-white/5'}`}
                                >
                                    {type !== 'all' && getAssetIcon(type as AssetType)}
                                    <span className="capitalize">{type}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-white/10 p-6 rounded-3xl shadow-xl">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Quick Stats</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-500 font-medium">Total Value</span>
                                <span className="text-lg font-black text-white">${assets.reduce((sum, a) => sum + (a.value || 0), 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-500 font-medium">EOL in 2026</span>
                                <span className="text-orange-400 font-bold">12 Assets</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredAssets.map((asset) => (
                            <motion.div
                                key={asset.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-slate-900 hover:bg-slate-800/80 border border-white/5 hover:border-cyan-500/20 p-5 rounded-3xl transition-all group shadow-xl"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-colors ${getStatusColor(asset.status)}`}>
                                        {getAssetIcon(asset.type)}
                                    </div>
                                    <div className={`px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-tighter ${getStatusColor(asset.status)}`}>
                                        {asset.status}
                                    </div>
                                </div>
                                <h4 className="font-bold text-white text-lg group-hover:text-cyan-400 transition-colors truncate">{asset.name}</h4>
                                <div className="text-[10px] text-slate-500 font-mono mb-4">{asset.serialNumber || 'No Serial Number'}</div>

                                <div className="grid grid-cols-2 gap-y-2 pt-4 border-t border-white/5">
                                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                                        <Building2 className="w-3 h-3" /> {companies.find(c => c.id === asset.companyId)?.name}
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-tighter justify-end">
                                        <User className="w-3 h-3" /> {asset.assignedTo || 'Unassigned'}
                                    </div>
                                    {asset.value && (
                                        <div className="flex items-center gap-2 text-[10px] text-cyan-400 font-black tracking-widest col-span-2 mt-2">
                                            <DollarSign className="w-3 h-3" /> VALUE: ${asset.value.toLocaleString()}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {filteredAssets.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center p-20 text-slate-600 bg-slate-900/50 rounded-3xl border border-dashed border-white/10">
                            <Tag className="w-16 h-16 mb-4 opacity-10" />
                            <p className="font-bold uppercase tracking-widest text-sm">No assets found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AssetTracker;

const Building2 = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="16" height="20" x="4" y="2" rx="2" ry="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M8 10h.01" /><path d="M16 10h.01" /><path d="M8 14h.01" /><path d="M16 14h.01" /><path d="M8 18h.01" /><path d="M16 18h.01" /></svg>
);
