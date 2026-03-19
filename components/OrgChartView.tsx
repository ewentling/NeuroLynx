import React from 'react';
import { motion } from 'framer-motion';
import { OrgContact, Company } from '../types';
import { Users, User, Shield, ChevronRight, Mail, Phone, Building2, Plus, Trash2 } from 'lucide-react';

interface OrgChartViewProps {
    company: Company;
    contacts: OrgContact[];
    onAddContact?: () => void;
    onRemoveContact?: (contactId: string) => void;
}

const OrgChartView: React.FC<OrgChartViewProps> = ({ company, contacts, onAddContact, onRemoveContact }) => {
    // Helper to get subordinates recursively
    const renderNode = (contact: OrgContact, level: number = 0) => {
        const subordinates = contacts.filter(c => c.reportsToId === contact.id);

        return (
            <div key={contact.id} className="relative">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`ml-${level * 8} group flex items-start gap-4 p-4 rounded-3xl border transition-all mb-4 ${contact.isDecisionMaker ? 'bg-orange-500/5 border-orange-500/30' : 'bg-slate-900 border-white/5 hover:border-white/10'}`}
                >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${contact.isDecisionMaker ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-slate-800 text-slate-400'}`}>
                        <User className="w-6 h-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-bold text-white text-lg leading-tight truncate">{contact.name}</h4>
                                <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">{contact.title}</div>
                            </div>
                            {contact.isDecisionMaker && (
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-orange-500 text-white font-black text-[9px] uppercase tracking-tighter">
                                    <Shield className="w-3 h-3" /> Decision Maker
                                </div>
                            )}
                        </div>

                        <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400">
                            {contact.email && <div className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> {contact.email}</div>}
                            {contact.department && <div className="flex items-center gap-1.5"><Building2 className="w-3 h-3" /> {contact.department}</div>}
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        {onRemoveContact && (
                            <button 
                                onClick={(e) => { e.stopPropagation(); onRemoveContact(contact.id); }}
                                className="self-center p-2 rounded-xl text-slate-600 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
                                title="Remove contact"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                        <button className="self-center p-2 rounded-xl text-slate-600 hover:text-white hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-all">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </motion.div>

                {subordinates.length > 0 && (
                    <div className={`ml-${level * 8 + 6} border-l-2 border-slate-800/50 pl-6 mt-[-1rem] pb-2`}>
                        {subordinates.map(sub => renderNode(sub, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    // Find top-level contacts (those who don't report to anyone or whose manager isn't in this list)
    const topLevel = contacts.filter(c => !c.reportsToId || !contacts.find(m => m.id === c.reportsToId));

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Internal Organization</h2>
                    <p className="text-slate-400 text-sm">Visualizing the hierarchy and key decision-makers at <span className="text-orange-400 font-bold">{company.name}</span>.</p>
                </div>
                <div className="flex items-center gap-4">
                    {onAddContact && (
                        <button 
                            onClick={onAddContact}
                            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-bold text-white shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" /> Add Contact
                        </button>
                    )}
                    <div className="flex gap-2 text-xs font-bold uppercase text-slate-500 border border-white/5 rounded-2xl p-2 bg-slate-900/50">
                        <span className="px-3 py-1 flex items-center gap-2 border-r border-white/10"><Users className="w-4 h-4 text-cyan-400" /> {contacts.length} Total Contacts</span>
                        <span className="px-3 py-1 flex items-center gap-2"><Shield className="w-4 h-4 text-orange-400" /> {contacts.filter(c => c.isDecisionMaker).length} Stakeholders</span>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl">
                {topLevel.length > 0 ? (
                    topLevel.map(c => renderNode(c))
                ) : (
                    <div className="p-12 text-center bg-slate-900/50 rounded-3xl border border-dashed border-white/10">
                        <Users className="w-12 h-12 mx-auto text-slate-700 mb-4" />
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No organizational data available for this company.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrgChartView;
