import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Contract, ContractItem, Product, Company, WorkspaceItem } from '../types';

interface ContractBuilderProps {
    isOpen: boolean;
    onClose: () => void;
    selectedCompanyId: string;
    companies: Company[];
    products: Product[];
    businessProfile: any;
    contractTaxRate: number;
    editingContractId: string | null;
    initialData: {
        title: string;
        startDate: string;
        endDate: string;
        paymentTerms: 'immediate' | 'net15' | 'net30' | 'net60';
        items: ContractItem[];
        discount: number;
        terms: string;
    };
    onSave: (contract: Contract, pdfBlob: Blob) => void;
    onDraftTerms: (clientName: string, items: any[]) => Promise<string | undefined>;
    isLoading: boolean;
}

const ContractBuilder: React.FC<ContractBuilderProps> = ({
    isOpen,
    onClose,
    selectedCompanyId,
    companies,
    products,
    businessProfile,
    contractTaxRate,
    editingContractId,
    initialData,
    onSave,
    onDraftTerms,
    isLoading
}) => {
    const [contractBuilderTitle, setContractBuilderTitle] = useState(initialData.title);
    const [contractStartDate, setContractStartDate] = useState(initialData.startDate);
    const [contractEndDate, setContractEndDate] = useState(initialData.endDate);
    const [contractPaymentTerms, setContractPaymentTerms] = useState(initialData.paymentTerms);
    const [contractBuilderItems, setContractBuilderItems] = useState<ContractItem[]>(initialData.items);
    const [contractDiscount, setContractDiscount] = useState(initialData.discount);
    const [contractTerms, setContractTerms] = useState(initialData.terms);
    const [contractPreviewMode, setContractPreviewMode] = useState(initialData.items.length > 0 && !!initialData.terms);

    const handleAddToContract = (product: Product) => {
        setContractBuilderItems(prev => [...prev, {
            productId: product.id,
            productName: product.name,
            quantity: 1,
            unitPrice: product.price,
            billingTiming: product.billingTiming
        }]);
    };

    const handleRemoveFromContract = (idx: number) => {
        setContractBuilderItems(prev => prev.filter((_, i) => i !== idx));
    };

    const handleQuantityChange = (index: number, newQty: string) => {
        const qty = parseInt(newQty);
        if (isNaN(qty) || qty < 1) return;
        setContractBuilderItems(prev => prev.map((item, i) => i === index ? { ...item, quantity: qty } : item));
    };

    const calculateTotals = () => {
        const subtotal = contractBuilderItems.reduce((acc, i) => acc + (i.quantity * i.unitPrice), 0);
        const taxable = Math.max(0, subtotal - contractDiscount);
        const tax = taxable * contractTaxRate;
        const total = taxable + tax;
        return { subtotal, tax, total };
    };

    const totals = calculateTotals();

    const generatePDF = (contract: Contract): Blob => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);
        doc.setTextColor(44, 62, 80);
        doc.text(businessProfile.name, 20, 20);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(businessProfile.address, 20, 26);
        doc.text(`Phone: ${businessProfile.phone}`, 20, 31);
        doc.text(`Web: ${businessProfile.website}`, 20, 36);

        doc.setFontSize(24);
        doc.setTextColor(0);
        doc.setFont("helvetica", "bold");
        doc.text("SERVICE AGREEMENT", pageWidth - 20, 30, { align: 'right' });

        doc.setDrawColor(200);
        doc.setFillColor(245, 247, 250);
        doc.rect(20, 45, pageWidth - 40, 25, 'F');

        const company = companies.find(c => c.id === selectedCompanyId);
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("PREPARED FOR:", 25, 52);

        doc.setFont("helvetica", "bold");
        doc.setTextColor(0);
        doc.setFontSize(12);
        doc.text(company?.name || 'Client Name', 25, 58);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(company?.address || '', 25, 64);

        doc.text(`Date: ${new Date().toLocaleDateString()}`, 140, 52);
        doc.text(`Valid Until: ${contract.endDate || 'N/A'}`, 140, 58);

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(contract.title, 20, 85);

        const headers = [["Item Description", "Billing", "Qty", "Unit Price", "Total"]];
        const data = contract.items.map(i => [
            i.productName,
            i.billingTiming === 'immediate' ? 'Immediate' : 'Net Terms',
            i.quantity.toString(),
            `$${i.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
            `$${(i.quantity * i.unitPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
        ]);

        autoTable(doc, {
            startY: 90,
            head: headers,
            body: data,
            theme: 'grid',
            headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
            styles: { fontSize: 10, cellPadding: 3 },
            columnStyles: {
                0: { cellWidth: 'auto' },
                2: { halign: 'center' },
                3: { halign: 'right' },
                4: { halign: 'right' }
            }
        });

        const finalY = (doc as any).lastAutoTable?.finalY || 100;
        const rightColX = 140;
        const valueX = pageWidth - 20;
        let currentY = finalY + 10;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(0);

        const subtotal = contract.totalValue - (contract.tax || 0) + (contract.discount || 0);
        doc.text("Subtotal:", rightColX, currentY);
        doc.text(`$${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, valueX, currentY, { align: 'right' });

        if (contract.discount && contract.discount > 0) {
            currentY += 6;
            doc.setTextColor(231, 76, 60);
            doc.text("Discount:", rightColX, currentY);
            doc.text(`-$${contract.discount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, valueX, currentY, { align: 'right' });
            doc.setTextColor(0);
        }

        currentY += 6;
        doc.text(`Tax (${(contractTaxRate * 100).toFixed(0)}%):`, rightColX, currentY);
        doc.text(`$${(contract.tax || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, valueX, currentY, { align: 'right' });

        currentY += 8;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("TOTAL:", rightColX, currentY);
        doc.text(`$${contract.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, valueX, currentY, { align: 'right' });

        currentY += 20;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("TERMS & CONDITIONS", 20, currentY);

        currentY += 5;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(80);
        const terms = contract.terms || "Standard business terms apply. Payment is due within the specified terms.";
        const splitTerms = doc.splitTextToSize(terms, pageWidth - 40);
        doc.text(splitTerms, 20, currentY);

        const pageHeight = doc.internal.pageSize.getHeight();
        let sigY = pageHeight - 40;
        if (currentY + splitTerms.length * 4 > sigY - 20) {
            doc.addPage();
            sigY = 40;
        }

        doc.line(20, sigY, 90, sigY);
        doc.text("Authorized Signature", 20, sigY + 5);
        doc.text(businessProfile.name, 20, sigY + 10);
        doc.line(120, sigY, 190, sigY);
        doc.text("Client Signature", 120, sigY + 5);
        doc.text("Date", 120, sigY + 10);

        return doc.output('blob');
    };

    const handleSave = () => {
        const { subtotal, tax, total } = calculateTotals();
        const newContract: Contract = {
            id: editingContractId || Date.now().toString(),
            companyId: selectedCompanyId,
            title: contractBuilderTitle,
            status: 'draft',
            items: contractBuilderItems,
            totalValue: total,
            startDate: contractStartDate,
            endDate: contractEndDate,
            paymentTerms: contractPaymentTerms,
            terms: contractTerms,
            dateCreated: new Date().toISOString(),
            discount: contractDiscount,
            tax: tax
        };
        const pdfBlob = generatePDF(newContract);
        onSave(newContract, pdfBlob);
    };

    const handleGenerateTerms = async () => {
        const items = contractBuilderItems.map(i => ({ name: i.productName, quantity: i.quantity, billing: i.billingTiming || 'net_term' }));
        const terms = await onDraftTerms(companies.find(c => c.id === selectedCompanyId)?.name || 'Client', items);
        if (terms) setContractTerms(terms);
    };

    if (!isOpen) return null;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <h3 className="text-xl font-bold">Contract Builder</h3>
                <div className="flex gap-2">
                    <button onClick={() => setContractPreviewMode(!contractPreviewMode)} className="px-4 py-2 bg-slate-700 rounded text-xs font-bold">
                        {contractPreviewMode ? 'Edit Mode' : 'Preview PDF'}
                    </button>
                    <button onClick={handleSave} className="px-4 py-2 bg-green-600 rounded text-xs font-bold">
                        Save & Download
                    </button>
                </div>
            </div>

            {!contractPreviewMode ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <input
                            className="w-full p-3 bg-black/20 rounded border border-white/10"
                            placeholder="Contract Title"
                            value={contractBuilderTitle}
                            onChange={e => setContractBuilderTitle(e.target.value)}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-slate-500 uppercase">Start Date</label>
                                <input type="date" className="w-full p-3 bg-black/20 rounded border border-white/10 text-white" value={contractStartDate} onChange={e => setContractStartDate(e.target.value)} />
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 uppercase">End Date</label>
                                <input type="date" className="w-full p-3 bg-black/20 rounded border border-white/10 text-white" value={contractEndDate} onChange={e => setContractEndDate(e.target.value)} />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-slate-500 uppercase mb-2 block">Payment Terms</label>
                            <select className="w-full p-3 bg-black/20 rounded border border-white/10 text-white" value={contractPaymentTerms} onChange={(e) => setContractPaymentTerms(e.target.value as any)}>
                                <option value="immediate">Immediate (Upon Signing)</option>
                                <option value="net15">Net 15 Days</option>
                                <option value="net30">Net 30 Days</option>
                                <option value="net60">Net 60 Days</option>
                            </select>
                        </div>
                        <div className="bg-slate-800 p-4 rounded-xl border border-white/5">
                            <label className="text-xs text-slate-500 uppercase mb-2 block">Add Items</label>
                            <select className="w-full p-3 bg-black/20 rounded border border-white/10 text-white mb-2" onChange={(e) => {
                                const prod = products.find(p => p.id === e.target.value);
                                if (prod) handleAddToContract(prod);
                                e.target.value = '';
                            }}>
                                <option value="">+ Select Product to Add</option>
                                {products.filter(p => p.status === 'active').map(p => (
                                    <option key={p.id} value={p.id}>{p.name} (${p.price})</option>
                                ))}
                            </select>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {contractBuilderItems.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-black/40 p-2 rounded text-sm">
                                        <div className="flex-1 truncate pr-2">{item.productName}</div>
                                        <input type="number" className="w-16 p-1 bg-transparent border border-white/10 rounded text-center mr-2" value={item.quantity} onChange={(e) => handleQuantityChange(idx, e.target.value)} />
                                        <div className="font-mono w-20 text-right">${(item.quantity * item.unitPrice).toLocaleString()}</div>
                                        <button onClick={() => handleRemoveFromContract(idx)} className="ml-2 text-red-400"><i className="fas fa-times"></i></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-slate-800 p-4 rounded-xl border border-white/5 space-y-2">
                            <div className="flex justify-between text-sm"><span>Subtotal:</span> <span className="font-mono">${totals.subtotal.toLocaleString()}</span></div>
                            <div className="flex justify-between text-sm items-center"><span>Discount:</span> <input type="number" className="w-24 p-1 bg-black/20 border border-white/10 rounded text-right" value={contractDiscount} onChange={e => setContractDiscount(Number(e.target.value))} /></div>
                            <div className="flex justify-between text-sm"><span>Tax (6%):</span> <span className="font-mono">${totals.tax.toLocaleString()}</span></div>
                            <div className="flex justify-between font-bold text-lg border-t border-white/10 pt-2"><span>Total:</span> <span className="font-mono text-cyan-400">${totals.total.toLocaleString()}</span></div>
                        </div>
                    </div>
                    <div className="flex flex-col h-full">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs text-slate-500 uppercase">Terms & Conditions</label>
                            <button onClick={handleGenerateTerms} disabled={isLoading} className="text-xs text-orange-400 hover:text-white flex items-center gap-2">
                                {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-magic"></i>} Generate with AI
                            </button>
                        </div>
                        <textarea
                            className="flex-1 w-full p-4 bg-black/20 rounded border border-white/10 font-mono text-xs leading-relaxed resize-none focus:border-cyan-500 outline-none"
                            placeholder="Legal terms go here..."
                            value={contractTerms}
                            onChange={e => setContractTerms(e.target.value)}
                        />
                    </div>
                </div>
            ) : (
                <div className="h-[60vh] bg-white text-black p-8 overflow-y-auto rounded shadow-inner font-serif">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 uppercase tracking-widest">{businessProfile.name}</h2>
                            <p className="text-sm text-slate-600">{businessProfile.address}</p>
                            <p className="text-sm text-slate-600">{businessProfile.phone}</p>
                            <p className="text-sm text-slate-600">{businessProfile.website}</p>
                        </div>
                        <div className="text-right">
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">SERVICE AGREEMENT</h1>
                            <p className="text-sm text-slate-600">Date: {new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded mb-8">
                        <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Prepared For:</h3>
                        <p className="font-bold text-lg">{companies.find(c => c.id === selectedCompanyId)?.name || 'Client Name'}</p>
                        <p className="text-sm text-slate-600">{companies.find(c => c.id === selectedCompanyId)?.address}</p>
                    </div>
                    <table className="w-full mb-8 border-collapse text-sm">
                        <thead>
                            <tr className="bg-slate-100">
                                <th className="border border-slate-300 p-2 text-left">Item Description</th>
                                <th className="border border-slate-300 p-2 text-center">Qty</th>
                                <th className="border border-slate-300 p-2 text-right">Unit Price</th>
                                <th className="border border-slate-300 p-2 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contractBuilderItems.map((item, idx) => (
                                <tr key={idx}>
                                    <td className="border border-slate-300 p-2">{item.productName}</td>
                                    <td className="border border-slate-300 p-2 text-center">{item.quantity}</td>
                                    <td className="border border-slate-300 p-2 text-right">${item.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                    <td className="border border-slate-300 p-2 text-right">${(item.quantity * item.unitPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex justify-end mb-12">
                        <div className="w-1/3 space-y-2">
                            <div className="flex justify-between text-sm"><span>Subtotal:</span><span>${totals.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                            {contractDiscount > 0 && <div className="flex justify-between text-sm text-red-600"><span>Discount:</span><span>-${contractDiscount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>}
                            <div className="flex justify-between text-sm"><span>Tax (6%):</span><span>${totals.tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                            <div className="flex justify-between text-lg font-bold border-t border-slate-300 pt-2"><span>Total:</span><span>${totals.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                        </div>
                    </div>
                    <div className="mb-12">
                        <h3 className="font-bold text-sm uppercase mb-2">Terms & Conditions</h3>
                        <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{contractTerms || 'Standard business terms apply.'}</p>
                    </div>
                    <div className="flex justify-between mt-12 pt-12">
                        <div className="w-1/3 border-t border-slate-400 pt-2">
                            <p className="font-bold text-sm">Authorized Signature</p>
                            <p className="text-xs text-slate-500">{businessProfile.name}</p>
                        </div>
                        <div className="w-1/3 border-t border-slate-400 pt-2">
                            <p className="font-bold text-sm">Client Signature</p>
                            <p className="text-xs text-slate-500">Date</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContractBuilder;
