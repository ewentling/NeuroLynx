import React from 'react';
import { motion } from 'framer-motion';
import { EsignRequest, Company } from '../types';
import { FileSignature, Send, Eye, CheckCircle2, XCircle, Clock, Mail, Calendar } from 'lucide-react';

interface EsignTrackerProps {
    requests: EsignRequest[];
    companies: Company[];
}

const EsignTracker: React.FC<EsignTrackerProps> = ({ requests, companies }) => {
    const getStatusIcon = (status: EsignRequest['status']) => {
        switch (status) {
            case 'signed': return <CheckCircle2 className="w-5 h-5 text-green-400" />;
            case 'viewed': return <Eye className="w-5 h-5 text-blue-400" />;
            case 'sent': return <Send className="w-5 h-5 text-orange-400" />;
            case 'declined': return <XCircle className="w-5 h-5 text-red-500" />;
            default: return <Clock className="w-5 h-5 text-slate-500" />;
        }
    };

    const getStatusColor = (status: EsignRequest['status']) => {
        switch (status) {
            case 'signed': return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'viewed': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'sent': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
            case 'declined': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-slate-800 text-slate-400 border-white/5';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">E-Signature Tracking</h2>
                    <p className="text-slate-400 text-sm">Monitor the real-time status of documents sent for digital signature.</p>
                </div>
                <div className="flex bg-slate-900 border border-white/5 rounded-2xl p-1 shadow-inner">
                    <button className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-800 shadow-lg">Pending</button>
                    <button className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-300 transition-colors">Completed</button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {requests.map((req) => (
                    <motion.div
                        key={req.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="group bg-slate-900/50 hover:bg-slate-800/50 border border-white/5 hover:border-white/10 p-6 rounded-3xl transition-all"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-5">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${getStatusColor(req.status)}`}>
                                    <FileSignature className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-orange-400 transition-colors">{req.documentTitle}</h3>
                                    <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                                        <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> {companies.find(c => c.id === req.companyId)?.name}</span>
                                        <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {req.signerEmail}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-3">
                                <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${getStatusColor(req.status)}`}>
                                    {getStatusIcon(req.status)}
                                    {req.status}
                                </div>
                                <div className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter">
                                    Last Event: {req.completedDate ? `Signed ${new Date(req.completedDate).toLocaleDateString()}` : `Sent ${new Date(req.sentDate).toLocaleDateString()}`}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-4 gap-2">
                            {['sent', 'viewed', 'signed'].map((step, idx) => {
                                const isDone = req.status === 'signed' || (req.status === 'viewed' && (step === 'sent' || step === 'viewed')) || (req.status === 'sent' && step === 'sent');
                                const isCurrent = req.status === step;

                                return (
                                    <div key={step} className="relative">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${isDone ? 'bg-orange-500 border-orange-400 text-white shadow-lg' : 'bg-slate-800 border-white/5 text-slate-600'}`}>
                                                {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                                            </div>
                                            <div className={`text-[10px] font-bold uppercase tracking-widest ${isDone ? 'text-white' : 'text-slate-600'}`}>{step}</div>
                                        </div>
                                        {idx < 2 && <div className={`absolute left-4 top-8 w-px h-4 transition-colors ${isDone ? 'bg-orange-500' : 'bg-slate-800'}`}></div>}
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                ))}
            </div>

            {requests.length === 0 && (
                <div className="p-20 text-center bg-slate-900 shadow-2xl rounded-3xl border border-dashed border-white/10">
                    <FileSignature className="w-16 h-16 mx-auto text-slate-800 mb-6" />
                    <h3 className="text-xl font-bold text-white mb-2">No Active Esign Requests</h3>
                    <p className="text-slate-500 max-w-sm mx-auto">Send your first document for digital signature to start tracking its status here.</p>
                </div>
            )}
        </div>
    );
};

export default EsignTracker;

const Building2 = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="16" height="20" x="4" y="2" rx="2" ry="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M8 10h.01" /><path d="M16 10h.01" /><path d="M8 14h.01" /><path d="M16 14h.01" /><path d="M8 18h.01" /><path d="M16 18h.01" /></svg>
);
