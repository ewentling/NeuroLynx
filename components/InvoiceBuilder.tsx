import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Invoice, Company, InvoiceStatus } from '../types';
import { FileText, Download, Send, Plus, Trash2, Printer, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface InvoiceBuilderProps {
    invoices: Invoice[];
    companies: Company[];
    onSaveInvoice: (invoice: Invoice) => void;
}

const InvoiceBuilder: React.FC<InvoiceBuilderProps> = ({ invoices, companies, onSaveInvoice }) => {
    const [filter, setFilter] = useState<InvoiceStatus | 'all'>('all');
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

    const filteredInvoices = filter === 'all' ? invoices : invoices.filter(inv => inv.status === filter);

    const getStatusIcon = (status: InvoiceStatus) => {
        switch (status) {
            case 'paid': return <CheckCircle className="w-4 h-4 text-green-400" />;
            case 'sent': return <Send className="w-4 h-4 text-blue-400" />;
            case 'overdue': return <AlertCircle className="w-4 h-4 text-red-400" />;
            case 'draft': return <FileText className="w-4 h-4 text-slate-400" />;
            default: return <Clock className="w-4 h-4 text-slate-400" />;
        }
    };

    const getStatusStyles = (status: InvoiceStatus) => {
        switch (status) {
            case 'paid': return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'sent': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'overdue': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-slate-800 text-slate-400 border-white/5';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Professional Invoicing</h2>
                    <p className="text-slate-400 text-sm">Create and manage client invoices with PDF export.</p>
                </div>
                <div className="flex gap-2">
                    {['all', 'draft', 'sent', 'paid', 'overdue'].map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilter(s as any)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border uppercase tracking-wider ${filter === s ? 'bg-orange-500 text-white border-orange-400 shadow-lg shadow-orange-500/20' : 'bg-slate-800 text-slate-400 border-white/5 hover:border-white/10'}`}
                        >
                            {s}
                        </button>
                    ))}
                    <button className="ml-4 px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl font-bold text-white shadow-lg hover:shadow-orange-500/30 transition-all flex items-center gap-2">
                        <Plus className="w-4 h-4" /> New Invoice
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-3 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredInvoices.map((inv) => (
                        <motion.div
                            key={inv.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={() => setSelectedInvoice(inv)}
                            className={`p-4 rounded-2xl border cursor-pointer transition-all ${selectedInvoice?.id === inv.id ? 'bg-slate-800/80 border-orange-500/40 shadow-xl' : 'bg-slate-900 border-white/5 hover:border-white/10'}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-mono text-slate-500">{inv.invoiceNumber}</span>
                                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase ${getStatusStyles(inv.status)}`}>
                                    {getStatusIcon(inv.status)}
                                    {inv.status}
                                </div>
                            </div>
                            <h4 className="font-bold text-white truncate">{companies.find(c => c.id === inv.companyId)?.name || 'Unknown Client'}</h4>
                            <div className="flex justify-between items-end mt-2">
                                <span className="text-slate-500 text-xs">Due: {new Date(inv.dueDate).toLocaleDateString()}</span>
                                <span className="text-lg font-bold text-orange-400">${inv.total.toLocaleString()}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="lg:col-span-2">
                    {selectedInvoice ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-slate-900 rounded-3xl border border-white/10 p-8 shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-6 flex gap-3">
                                <button className="p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-colors" title="Print"><Printer className="w-5 h-5" /></button>
                                <button className="p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-colors" title="Download PDF"><Download className="w-5 h-5" /></button>
                            </div>

                            <div className="flex justify-between mb-12">
                                <div>
                                    <div className="text-3xl font-black text-white mb-1 tracking-tighter">INVOICE</div>
                                    <div className="text-slate-500 font-mono">{selectedInvoice.invoiceNumber}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-white">NeuroSyntax Media</div>
                                    <div className="text-xs text-slate-500">100 Innovation Drive</div>
                                    <div className="text-xs text-slate-500">Philadelphia, PA 19104</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8 mb-12">
                                <div>
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Bill To</div>
                                    <div className="font-bold text-white text-lg">{companies.find(c => c.id === selectedInvoice.companyId)?.name}</div>
                                    <div className="text-sm text-slate-400">{companies.find(c => c.id === selectedInvoice.companyId)?.address}</div>
                                </div>
                                <div className="text-right">
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                        <span className="text-xs text-slate-500 uppercase font-bold">Issued</span>
                                        <span className="text-xs text-white uppercase font-bold">{new Date(selectedInvoice.issueDate).toLocaleDateString()}</span>
                                        <span className="text-xs text-slate-500 uppercase font-bold">Due</span>
                                        <span className="text-xs text-white uppercase font-bold">{new Date(selectedInvoice.dueDate).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            <table className="w-full text-left mb-12">
                                <thead>
                                    <tr className="border-b border-white/10 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                        <th className="py-4 font-bold">Description</th>
                                        <th className="py-4 text-center font-bold">Qty</th>
                                        <th className="py-4 text-right font-bold">Rate</th>
                                        <th className="py-4 text-right font-bold">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedInvoice.items.map(item => (
                                        <tr key={item.id} className="border-b border-white/5 text-sm">
                                            <td className="py-4 text-white font-medium">{item.description}</td>
                                            <td className="py-4 text-center text-slate-400">{item.quantity}</td>
                                            <td className="py-4 text-right text-slate-400">${item.rate.toLocaleString()}</td>
                                            <td className="py-4 text-right text-white font-bold">${item.amount.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="flex justify-end">
                                <div className="w-64 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 font-bold uppercase text-xs">Subtotal</span>
                                        <span className="text-white font-bold">${selectedInvoice.subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 font-bold uppercase text-xs">Tax (6%)</span>
                                        <span className="text-white font-bold">${selectedInvoice.tax.toLocaleString()}</span>
                                    </div>
                                    <div className="pt-3 border-t border-white/10 flex justify-between items-end">
                                        <span className="text-slate-500 font-bold uppercase text-xs pb-1">Total Due</span>
                                        <span className="text-2xl font-black text-orange-400">${selectedInvoice.total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {selectedInvoice.notes && (
                                <div className="mt-12 p-4 bg-slate-800/50 rounded-xl border border-white/5">
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Notes</div>
                                    <p className="text-xs text-slate-400 italic">{selectedInvoice.notes}</p>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-600 bg-slate-900/50 rounded-3xl border border-dashed border-white/10 p-12">
                            <FileText className="w-16 h-16 mb-4 opacity-20" />
                            <p className="font-bold uppercase tracking-widest text-sm">Select an invoice to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InvoiceBuilder;
