import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Partner } from '../types';
import { Handshake, Users, DollarSign, ExternalLink, Mail, Phone, TrendingUp, Award, Clock, ArrowUpRight } from 'lucide-react';

interface PartnerViewProps {
    partners: Partner[];
}

const PartnerView: React.FC<PartnerViewProps> = ({ partners }) => {
    const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

    const filteredPartners = filter === 'all' ? partners : partners.filter(p => p.status === filter);

    const getPartnerTypeColor = (type: Partner['type']) => {
        switch (type) {
            case 'technology': return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
            case 'referral': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
            case 'reseller': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
            case 'implementation': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            default: return 'text-slate-400 bg-slate-800 border-white/5';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Partner & Affiliate Network</h2>
                    <p className="text-slate-400 text-sm">Manage referral partners, technology alliances, and commission payouts.</p>
                </div>
                <div className="flex bg-slate-900 border border-white/5 rounded-2xl p-1 shadow-inner">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === 'all' ? 'text-white bg-slate-800 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        All Partners
                    </button>
                    <button
                        onClick={() => setFilter('active')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === 'active' ? 'text-white bg-slate-800 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Active
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPartners.map((partner) => (
                    <motion.div
                        key={partner.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-slate-900 border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-all group relative overflow-hidden shadow-2xl"
                    >
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Handshake className="w-16 h-16 text-white" />
                        </div>

                        <div className="flex items-start justify-between mb-6">
                            <div className={`px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${getPartnerTypeColor(partner.type)}`}>
                                {partner.type}
                            </div>
                            <div className={`w-3 h-3 rounded-full ${partner.status === 'active' ? 'bg-green-500 shadow-lg shadow-green-500/20' : 'bg-slate-700'}`} />
                        </div>

                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-orange-400 transition-colors uppercase tracking-tight">{partner.name}</h3>
                        <div className="text-xs text-slate-500 font-medium mb-6 flex items-center gap-2">
                            <Mail className="w-3 h-3" /> {partner.contactEmail}
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-slate-800/40 p-3 rounded-2xl border border-white/5 text-center">
                                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Referrals</div>
                                <div className="text-sm font-black text-white">{partner.totalReferrals}</div>
                            </div>
                            <div className="bg-slate-800/40 p-3 rounded-2xl border border-white/5 text-center">
                                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Commission</div>
                                <div className="text-sm font-black text-orange-400">{partner.commissionRate}%</div>
                            </div>
                        </div>

                        <div className="flex justify-between items-end pt-4 border-t border-white/5">
                            <div>
                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Paid Out</div>
                                <div className="text-lg font-black text-white">${partner.totalPayout.toLocaleString()}</div>
                            </div>
                            <button className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors">
                                <ArrowUpRight className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="bg-gradient-to-r from-slate-900 to-indigo-900/40 border border-indigo-500/20 rounded-3xl p-8 mt-12 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                        <Award className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-white tracking-tighter mb-1">Top Performing Partner</h3>
                        <p className="text-indigo-200/60 text-sm">Microsoft Enterprise has generated <strong>$45k</strong> in referrals this year.</p>
                    </div>
                </div>
                <button className="px-6 py-3 bg-indigo-600 rounded-2xl font-bold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all uppercase text-xs tracking-widest">
                    View Network Audit
                </button>
            </div>
        </div>
    );
};

export default PartnerView;
