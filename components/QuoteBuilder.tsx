import React, { useState } from 'react';
import { Product, Company, Quote, QuoteLineItem } from '../types';
import { jsPDF } from 'jspdf';

interface QuoteBuilderProps {
    products: Product[];
    companies: Company[];
    selectedCompanyId: string;
    businessProfile: { name: string; address: string; phone: string; website: string };
    onSaveQuote: (quote: Quote) => void;
    onClose: () => void;
    addToast: (type: 'success' | 'error' | 'info' | 'warning', msg: string) => void;
}

const QuoteBuilder: React.FC<QuoteBuilderProps> = ({ products, companies, selectedCompanyId, businessProfile, onSaveQuote, onClose, addToast }) => {
    const [title, setTitle] = useState('Quick Quote');
    const [items, setItems] = useState<QuoteLineItem[]>([]);
    const [discount, setDiscount] = useState(0);
    const [notes, setNotes] = useState('');
    const [validDays, setValidDays] = useState(30);
    const [companyId, setCompanyId] = useState(selectedCompanyId !== 'all' ? selectedCompanyId : companies[0]?.id || '');
    const [productSearch, setProductSearch] = useState('');

    const subtotal = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
    const discountAmount = Math.min(discount, subtotal);
    const total = subtotal - discountAmount;

    const addProduct = (product: Product) => {
        const existing = items.find(i => i.productId === product.id);
        if (existing) {
            setItems(prev => prev.map(i => i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i));
        } else {
            setItems(prev => [...prev, { productId: product.id, productName: product.name, quantity: 1, unitPrice: product.price }]);
        }
        setProductSearch('');
    };

    const removeItem = (idx: number) => setItems(prev => prev.filter((_, i) => i !== idx));

    const handleExportPDF = () => {
        if (items.length === 0) return addToast('error', 'Add at least one product');

        const company = companies.find(c => c.id === companyId);
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.text(businessProfile.name, 20, 20);
        doc.setFontSize(10);
        doc.text(businessProfile.address, 20, 28);
        doc.text(businessProfile.phone, 20, 34);

        doc.setFontSize(16);
        doc.text('QUOTE', 150, 20);
        doc.setFontSize(10);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 28);
        doc.text(`Valid Until: ${new Date(Date.now() + validDays * 86400000).toLocaleDateString()}`, 150, 34);

        doc.setFontSize(12);
        doc.text(`To: ${company?.name || 'Client'}`, 20, 50);

        doc.setFontSize(14);
        doc.text(title, 20, 65);

        // Table header
        let y = 80;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Item', 20, y);
        doc.text('Qty', 120, y);
        doc.text('Unit Price', 140, y);
        doc.text('Total', 170, y);
        doc.line(20, y + 2, 190, y + 2);
        y += 10;

        doc.setFont('helvetica', 'normal');
        items.forEach(item => {
            doc.text(item.productName, 20, y);
            doc.text(String(item.quantity), 120, y);
            doc.text(`$${item.unitPrice.toLocaleString()}`, 140, y);
            doc.text(`$${(item.quantity * item.unitPrice).toLocaleString()}`, 170, y);
            y += 8;
        });

        y += 5;
        doc.line(140, y, 190, y);
        y += 8;
        doc.text(`Subtotal: $${subtotal.toLocaleString()}`, 140, y);
        if (discountAmount > 0) {
            y += 8;
            doc.text(`Discount: -$${discountAmount.toLocaleString()}`, 140, y);
        }
        y += 8;
        doc.setFont('helvetica', 'bold');
        doc.text(`Total: $${total.toLocaleString()}`, 140, y);

        if (notes) {
            y += 20;
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.text('Notes:', 20, y);
            doc.text(notes, 20, y + 6);
        }

        doc.save(`${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);

        const quote: Quote = {
            id: `q-${Date.now()}`,
            companyId,
            title,
            items,
            discount: discountAmount,
            totalValue: total,
            status: 'draft',
            validUntil: new Date(Date.now() + validDays * 86400000).toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
            notes,
        };
        onSaveQuote(quote);
        addToast('success', 'Quote exported & saved');
        onClose();
    };

    const filteredProducts = products.filter(p =>
        p.status === 'active' && p.name.toLowerCase().includes(productSearch.toLowerCase())
    );

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl">
                <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-slate-900 z-10">
                    <h2 className="text-xl font-bold">Quick Quote Builder</h2>
                    <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center"><i className="fas fa-times"></i></button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <input className="bg-slate-800 border border-white/10 rounded p-3 text-sm w-full" value={title} onChange={e => setTitle(e.target.value)} placeholder="Quote Title" />
                        <select className="bg-slate-800 border border-white/10 rounded p-3 text-sm" value={companyId} onChange={e => setCompanyId(e.target.value)}>
                            {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>

                    {/* Product Search */}
                    <div className="relative">
                        <input
                            className="bg-slate-800 border border-white/10 rounded p-3 text-sm w-full"
                            value={productSearch}
                            onChange={e => setProductSearch(e.target.value)}
                            placeholder="Search products to add..."
                        />
                        {productSearch && filteredProducts.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-white/10 rounded max-h-40 overflow-y-auto z-20">
                                {filteredProducts.map(p => (
                                    <button key={p.id} onClick={() => addProduct(p)} className="w-full text-left px-4 py-2 hover:bg-white/5 text-sm flex justify-between">
                                        <span>{p.name}</span>
                                        <span className="text-cyan-400 font-mono">${p.price}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Line Items */}
                    <div className="space-y-2">
                        {items.length === 0 && <div className="text-center py-8 text-slate-500 text-sm">Search and add products above</div>}
                        {items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-3 bg-black/20 rounded border border-white/5">
                                <div className="flex-1 font-bold text-sm">{item.productName}</div>
                                <input
                                    type="number" min="1"
                                    className="w-16 bg-slate-800 border border-white/10 rounded p-1 text-center text-sm"
                                    value={item.quantity}
                                    onChange={e => setItems(prev => prev.map((it, i) => i === idx ? { ...it, quantity: Math.max(1, parseInt(e.target.value) || 1) } : it))}
                                />
                                <div className="font-mono text-sm text-slate-400 w-20 text-right">${item.unitPrice.toLocaleString()}</div>
                                <div className="font-mono text-sm text-cyan-400 w-24 text-right">${(item.quantity * item.unitPrice).toLocaleString()}</div>
                                <button onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-300"><i className="fas fa-trash text-xs"></i></button>
                            </div>
                        ))}
                    </div>

                    {/* Totals */}
                    <div className="border-t border-white/10 pt-4 space-y-2">
                        <div className="flex justify-between text-sm"><span className="text-slate-400">Subtotal</span><span className="font-mono">${subtotal.toLocaleString()}</span></div>
                        <div className="flex justify-between text-sm items-center">
                            <span className="text-slate-400">Discount</span>
                            <input type="number" min="0" className="w-32 bg-slate-800 border border-white/10 rounded p-1 text-sm text-right font-mono" value={discount} onChange={e => setDiscount(Number(e.target.value) || 0)} />
                        </div>
                        <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="font-mono text-orange-400">${total.toLocaleString()}</span></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Valid For (days)</label>
                            <input type="number" className="bg-slate-800 border border-white/10 rounded p-3 text-sm w-full" value={validDays} onChange={e => setValidDays(Number(e.target.value) || 30)} />
                        </div>
                        <div>
                            <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Notes</label>
                            <input className="bg-slate-800 border border-white/10 rounded p-3 text-sm w-full" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional notes..." />
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-white/10 flex justify-end gap-3 sticky bottom-0 bg-slate-900">
                    <button onClick={onClose} className="px-6 py-2 bg-slate-700 rounded text-sm font-bold hover:bg-slate-600">Cancel</button>
                    <button onClick={handleExportPDF} className="px-6 py-2 bg-gradient-to-r from-orange-600 to-cyan-600 rounded text-sm font-bold hover:opacity-90 shadow-lg">
                        <i className="fas fa-file-pdf mr-2"></i>Export PDF & Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuoteBuilder;
