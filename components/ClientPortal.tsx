import React from 'react';
import { Company, Project, BillingRecord, WorkspaceItem, Message } from '../types';

interface ClientPortalProps {
    company: Company;
    projects: Project[];
    billing: BillingRecord[];
    documents: WorkspaceItem[];
    messages: Message[];
}

const ClientPortal: React.FC<ClientPortalProps> = ({ company, projects, billing, documents, messages }) => {
    const activeProjects = projects.filter(p => p.companyId === company.id && p.status === 'active');
    const pendingInvoices = billing.filter(b => b.clientId === company.id && b.status === 'pending');
    const totalPending = pendingInvoices.reduce((s, i) => s + i.amount, 0);

    return (
        <div className="bg-slate-900 min-h-full rounded-2xl border border-white/10 p-8 space-y-8 overflow-y-auto">
            {/* Header: Portal Preview Branding */}
            <div className="flex justify-between items-start border-b border-white/10 pb-8">
                <div>
                    <div className="text-[10px] uppercase font-black tracking-[0.2em] text-orange-500 mb-2">Internal Preview • Client Portal</div>
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                        {company.name} <span className="text-slate-600 font-light">Experience</span>
                    </h2>
                </div>
                <div className="px-4 py-2 bg-slate-800 rounded-xl border border-white/5 flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full bg-green-500 animate-pulse`}></div>
                    <span className="text-xs font-bold text-slate-300">Portal Link Live</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Projects & Invoices */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Active Projects */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-slate-400 uppercase text-xs tracking-widest">Active Engagements</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {activeProjects.map(project => {
                                const completed = project.milestones.filter(m => m.completed).length;
                                const progress = Math.round((completed / project.milestones.length) * 100);
                                return (
                                    <div key={project.id} className="bg-slate-800/50 p-6 rounded-2xl border border-white/5 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div className="font-bold text-lg">{project.name}</div>
                                            <div className="text-xs font-mono text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded">{progress}% Complete</div>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                            <div className="h-full bg-cyan-500 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                                        </div>
                                        <div className="flex gap-2 text-[10px] text-slate-500">
                                            {project.milestones.slice(0, 3).map(m => (
                                                <div key={m.id} className="flex items-center gap-1">
                                                    <i className={`fas fa-${m.completed ? 'check-circle text-green-500' : 'circle'}`}></i>
                                                    {m.title}
                                                </div>
                                            ))}
                                            {project.milestones.length > 3 && <span>+{project.milestones.length - 3} more</span>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Shared Documents */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-slate-400 uppercase text-xs tracking-widest">Collaborative Assets</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {documents.slice(0, 6).map(doc => (
                                <div key={doc.id} className="p-4 bg-slate-800/30 border border-white/5 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer group">
                                    <div className="text-orange-500 mb-3 group-hover:scale-110 transition-transform">
                                        <i className={`fas fa-file-${doc.type === 'contract' ? 'contract' : 'pdf'} text-2xl`}></i>
                                    </div>
                                    <div className="text-xs font-bold truncate">{doc.title}</div>
                                    <div className="text-[10px] text-slate-500">Updated recently</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Billing & Support */}
                <div className="space-y-8">
                    {/* Financial Summary */}
                    <div className="bg-gradient-to-br from-orange-600 to-red-600 p-6 rounded-3xl shadow-xl space-y-4">
                        <h3 className="text-white/60 font-bold uppercase text-[10px] tracking-widest">Pending Invoices</h3>
                        <div className="text-4xl font-black text-white font-mono">${totalPending.toLocaleString()}</div>
                        <div className="space-y-2">
                            {pendingInvoices.map(inv => (
                                <div key={inv.id} className="flex justify-between items-center text-xs text-white/80 py-2 border-t border-white/10">
                                    <span>{inv.breakdown}</span>
                                    <span className="font-bold">${inv.amount}</span>
                                </div>
                            ))}
                        </div>
                        <button className="w-full py-3 bg-white text-orange-600 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg transform active:scale-95 transition-all">Pay via Stripe</button>
                    </div>

                    {/* Support & Messaging */}
                    <div className="bg-slate-800 p-6 rounded-3xl border border-white/5 space-y-4">
                        <h3 className="font-bold text-slate-400 uppercase text-xs tracking-widest">Direct Channel</h3>
                        <div className="space-y-3 h-48 overflow-y-auto pr-2 custom-scrollbar">
                            {messages.slice(-5).map(msg => (
                                <div key={msg.id} className={`p-3 rounded-2xl text-[10px] ${msg.role === 'user' ? 'bg-orange-500/10 border border-orange-400/20 ml-4' : 'bg-slate-900 mr-4'}`}>
                                    <div className="font-bold mb-1">{msg.role === 'user' ? 'You' : 'NeuroLynx Advisor'}</div>
                                    <div className="text-slate-400">{msg.content}</div>
                                </div>
                            ))}
                        </div>
                        <div className="relative">
                            <input className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 px-4 text-xs pr-12 focus:outline-none" placeholder="Message your advisor..." />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-orange-600 rounded-lg text-white"><i className="fas fa-paper-plane text-xs"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientPortal;
