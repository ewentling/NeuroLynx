import React from 'react';
import { Company, WorkspaceItem, Contract, Template, BillingRecord } from '../../types';

interface ClientWorkspaceProps {
    clientWorkspaceTab: 'overview' | 'contracts' | 'documents' | 'billing';
    activeClient: Company | null;
    companies: Company[];
    selectedCompanyId: string;
    clientHealth: { score: number; trend: string };
    tasks: any[];
    meetings: any[];
    workspaceItems: WorkspaceItem[];
    memory: any[];
    contracts: Contract[];
    clients: any[];
    onOpenContractBuilder: (c?: any) => void;
    mockTemplates: Template[];
    onAddToast: (type: any, msg: string) => void;
    setWorkspaceItems: React.Dispatch<React.SetStateAction<WorkspaceItem[]>>;
    setCompanies: React.Dispatch<React.SetStateAction<Company[]>>;
    billingRecords?: BillingRecord[];
    onRunEOMBilling?: (companyId: string) => void;
}

const ClientWorkspace: React.FC<ClientWorkspaceProps> = ({
    clientWorkspaceTab,
    activeClient,
    companies,
    selectedCompanyId,
    clientHealth,
    tasks,
    meetings,
    workspaceItems,
    memory,
    contracts,
    clients,
    onOpenContractBuilder,
    mockTemplates,
    onAddToast,
    setWorkspaceItems,
    setCompanies,
    billingRecords = [],
    onRunEOMBilling
}) => {
    return (
        <>
            {(!activeClient && selectedCompanyId !== 'all') ? (
                <div className="flex items-center justify-center h-64 text-slate-500 flex-col">
                    <i className="fas fa-building text-4xl mb-4 opacity-50"></i>
                    <div>Please select a company from the top right dropdown to view client workspace.</div>
                </div>
            ) : (
                <>
                    {clientWorkspaceTab === 'overview' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="bg-slate-800 p-6 rounded-xl border border-white/5 flex items-center gap-4 relative group">
                                    <div className="w-12 h-12 bg-cyan-500/20 text-cyan-400 rounded-lg flex items-center justify-center text-xl"><i className="fas fa-building"></i></div>
                                    <div>
                                        <h2 className="text-lg font-bold truncate">{activeClient?.name || 'All Clients'}</h2>
                                        <div className="text-xs text-slate-400">{activeClient?.industry || 'Overview'}</div>
                                    </div>
                                    {activeClient && (
                                        <button
                                            onClick={() => {
                                                onAddToast('info', 'Enriching Data...');
                                                setTimeout(() => {
                                                    setCompanies(prev => prev.map(c => c.id === activeClient.id ? { ...c, industry: 'Tech (Enriched)', revenue: c.revenue * 1.1 } : c));
                                                    onAddToast('success', 'Data Enriched!');
                                                }, 1500);
                                            }}
                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded hover:bg-cyan-500 hover:text-white"
                                        >
                                            <i className="fas fa-magic mr-1"></i> Enrich
                                        </button>
                                    )}
                                </div>
                                <div className="bg-slate-800 p-6 rounded-xl border border-white/5">
                                    <div className="text-xs text-slate-400 uppercase mb-1">Annual Revenue</div>
                                    <div className="text-2xl font-mono font-bold text-white">${activeClient ? activeClient.revenue.toLocaleString() : companies.reduce((a, b) => a + b.revenue, 0).toLocaleString()}</div>
                                </div>
                                <div className="bg-slate-800 p-6 rounded-xl border border-white/5 relative overflow-hidden group">
                                    <div className="absolute right-0 top-0 p-2 opacity-50"><i className="fas fa-heartbeat text-3xl text-slate-700"></i></div>
                                    <div className="text-xs text-slate-400 uppercase mb-2">Relationship Pulse</div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-3xl font-bold text-white">{clientHealth.score}</div>
                                        <div className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${clientHealth.score > 70 ? 'border-emerald-500 text-emerald-400' : clientHealth.score < 50 ? 'border-red-500 text-red-400' : 'border-yellow-500 text-yellow-400'}`}>
                                            {clientHealth.score > 70 ? 'Excellent' : clientHealth.score < 50 ? 'Risk' : 'Neutral'}
                                        </div>
                                    </div>
                                    <div className="mt-2 h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full transition-all duration-1000 ${clientHealth.score > 70 ? 'bg-emerald-500' : clientHealth.score < 50 ? 'bg-red-500' : 'bg-yellow-500'}`} style={{ width: `${clientHealth.score}%` }}></div>
                                    </div>
                                    <div className="mt-1 text-[10px] text-slate-500 flex justify-between">
                                        <span>Trend: {clientHealth.trend.toUpperCase()}</span>
                                        {clientHealth.trend === 'up' && <i className="fas fa-arrow-up text-emerald-500"></i>}
                                        {clientHealth.trend === 'down' && <i className="fas fa-arrow-down text-red-500"></i>}
                                        {clientHealth.trend === 'stable' && <i className="fas fa-minus text-slate-500"></i>}
                                    </div>
                                </div>
                                <div className="bg-slate-800 p-6 rounded-xl border border-white/5">
                                    <div className="text-xs text-slate-400 uppercase mb-1">Open Tasks</div>
                                    <div className="text-2xl font-bold text-white">{tasks.filter(t => t.status !== 'done' && (selectedCompanyId === 'all' || t.clientId === activeClient?.id)).length}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 bg-slate-800 rounded-xl border border-white/5 p-6">
                                    <h3 className="font-bold text-sm uppercase text-slate-500 mb-4">Unified Timeline</h3>
                                    <div className="space-y-6 relative before:absolute before:left-4 before:top-10 before:bottom-0 before:w-0.5 before:bg-slate-700">
                                        {[
                                            ...meetings.filter(m => selectedCompanyId === 'all' || m.clientId === activeClient?.id).map(m => ({ ...m, type: 'meeting', dateObj: new Date(m.date) })),
                                            ...workspaceItems.filter(i => i.type === 'email' && (selectedCompanyId === 'all' || i.clientId === activeClient?.id)).map(e => ({ ...e, type: 'email', dateObj: new Date(e.date) })),
                                            ...memory.filter(m => selectedCompanyId === 'all' || m.clientId === selectedCompanyId).map(m => ({ ...m, type: 'note', dateObj: new Date(m.timestamp) }))
                                        ].sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime()).slice(0, 10).map((item: any) => (
                                            <div key={item.id} className="relative pl-10">
                                                <div className={`absolute left-0 top-0 w-8 h-8 rounded-full border-4 border-slate-800 flex items-center justify-center z-10 ${item.type === 'meeting' ? 'bg-purple-500 text-white' : item.type === 'email' ? 'bg-blue-500 text-white' : 'bg-orange-500 text-white'}`}>
                                                    <i className={`fas ${item.type === 'meeting' ? 'fa-microphone' : item.type === 'email' ? 'fa-envelope' : 'fa-sticky-note'}`}></i>
                                                </div>
                                                <div className="bg-slate-700/30 p-4 rounded-xl border border-white/5 hover:border-white/20 transition-colors">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${item.type === 'meeting' ? 'bg-purple-500/20 text-purple-400' : item.type === 'email' ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'}`}>{item.type}</span>
                                                        <span className="text-xs text-slate-500">{item.dateObj.toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="font-bold text-sm mb-1">{item.title || item.key || 'Note'}</div>
                                                    <div className="text-xs text-slate-400 line-clamp-2">{item.summary || item.snippet || item.value}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="bg-slate-800 rounded-xl border border-white/5 p-6">
                                        <h3 className="font-bold text-sm uppercase text-slate-500 mb-4">Active Contracts</h3>
                                        <div className="space-y-3">
                                            {contracts.filter(c => c.status === 'active' && (selectedCompanyId === 'all' || c.companyId === activeClient?.id)).map(c => (
                                                <div key={c.id} className="p-3 bg-black/20 rounded border border-white/5 flex justify-between items-center">
                                                    <div>
                                                        <div className="font-bold text-sm">{c.title}</div>
                                                        <div className="text-xs text-slate-400">Expires: {c.endDate}</div>
                                                    </div>
                                                    <div className="font-mono text-emerald-400">${c.totalValue.toLocaleString()}</div>
                                                </div>
                                            ))}
                                            {contracts.filter(c => c.status === 'active' && (selectedCompanyId === 'all' || c.companyId === activeClient?.id)).length === 0 && (
                                                <div className="text-slate-500 italic text-sm">No active contracts</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="bg-slate-800 rounded-xl border border-white/5 p-6">
                                        <h3 className="font-bold text-sm uppercase text-slate-500 mb-4">Key Stakeholders</h3>
                                        <div className="space-y-3">
                                            {clients.filter(c => selectedCompanyId === 'all' || c.companyId === activeClient?.id).map(c => (
                                                <div key={c.id} className="flex items-center gap-3 p-3 bg-black/20 rounded border border-white/5">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${c.avatarColor}`}>{c.name[0]}</div>
                                                    <div>
                                                        <div className="font-bold text-sm">{c.name}</div>
                                                        <div className="text-xs text-slate-400">{c.role}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {clientWorkspaceTab === 'contracts' && (
                        <div>
                            <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold">Contracts</h2><button onClick={() => onOpenContractBuilder()} className="px-4 py-2 bg-orange-600 rounded text-xs font-bold">New Contract</button></div>
                            <div className="space-y-4">
                                {contracts.filter(c => selectedCompanyId === 'all' || c.companyId === selectedCompanyId).map(c => (
                                    <div key={c.id} className="p-4 bg-slate-800 rounded-xl flex justify-between items-center cursor-pointer hover:bg-slate-700" onClick={() => onOpenContractBuilder(c)}>
                                        <div>
                                            <div className="font-bold">{c.title}</div>
                                            <div className="text-xs text-slate-400">{c.status}</div>
                                        </div>
                                        <div className="font-mono text-cyan-400">${c.totalValue.toLocaleString()}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {clientWorkspaceTab === 'documents' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">Documents</h2>
                                <div className="flex gap-2">
                                    <button onClick={() => window.open('https://www.canva.com/create', '_blank')} className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded text-xs font-bold text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-pink-500/20 transition-all"><i className="fas fa-palette mr-2"></i> Create with Canva</button>
                                    <div className="relative group">
                                        <button className="px-4 py-2 bg-slate-700 rounded text-xs font-bold hover:bg-slate-600"><i className="fas fa-file-medical mr-2"></i> Templates</button>
                                        <div className="absolute right-0 top-full mt-2 w-64 bg-slate-800 border border-white/10 rounded-xl shadow-xl hidden group-hover:block z-50 max-h-64 overflow-y-auto custom-scrollbar">
                                            {mockTemplates.map(tpl => (
                                                <button
                                                    key={tpl.id}
                                                    onClick={() => {
                                                        onAddToast('success', `Created ${tpl.title} from Template`);
                                                        setWorkspaceItems(prev => [{
                                                            id: `doc-${Date.now()}`,
                                                            type: 'doc',
                                                            title: `${tpl.title} - ${activeClient?.name || 'Draft'}`,
                                                            snippet: `Generated from template: ${tpl.title}`,
                                                            date: new Date().toISOString().split('T')[0],
                                                            link: '#',
                                                            clientId: activeClient?.id
                                                        }, ...prev]);
                                                    }}
                                                    className="w-full text-left px-4 py-2 hover:bg-white/5 text-xs border-b border-white/5 last:border-0 truncate"
                                                    title={tpl.title}
                                                >
                                                    {tpl.title}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <button className="px-4 py-2 bg-slate-700 rounded text-xs font-bold hover:bg-slate-600"><i className="fas fa-upload mr-2"></i> Upload Document</button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {workspaceItems.filter(i => (i.type === 'doc' || i.type === 'sheet' || i.type === 'contract') && (selectedCompanyId === 'all' || i.clientId === selectedCompanyId)).map(doc => (
                                    <a key={doc.id} href={doc.link} target="_blank" rel="noreferrer" className="block p-4 bg-slate-800 rounded-xl border border-white/5 hover:border-cyan-500/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded flex items-center justify-center ${doc.type === 'sheet' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}><i className={`fas ${doc.type === 'sheet' ? 'fa-table' : 'fa-file-alt'}`}></i></div>
                                            <div className="flex-1 truncate">
                                                <div className="font-bold text-sm truncate">{doc.title}</div>
                                                <div className="text-xs text-slate-500">{doc.date}</div>
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {clientWorkspaceTab === 'billing' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">Billing Records</h2>
                                {activeClient && onRunEOMBilling && (
                                    <button 
                                        onClick={() => onRunEOMBilling(activeClient.id)} 
                                        className="px-4 py-2 bg-green-600 rounded text-xs font-bold hover:bg-green-500 transition-colors"
                                    >
                                        <i className="fas fa-calculator mr-2"></i>Run EOM Billing
                                    </button>
                                )}
                            </div>
                            <div className="space-y-4">
                                {billingRecords
                                    .filter(b => selectedCompanyId === 'all' || b.clientId === selectedCompanyId)
                                    .map(record => (
                                        <div key={record.id} className="p-4 bg-slate-800 rounded-xl border border-white/5 flex justify-between items-center">
                                            <div>
                                                <div className="font-bold">{record.breakdown}</div>
                                                <div className="text-xs text-slate-400">{record.date}</div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${
                                                    record.status === 'paid' ? 'bg-emerald-500/20 text-emerald-400' :
                                                    record.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-red-500/20 text-red-400'
                                                }`}>
                                                    {record.status}
                                                </span>
                                                <div className="font-mono text-cyan-400 font-bold">${record.amount.toLocaleString()}</div>
                                            </div>
                                        </div>
                                    ))}
                                {billingRecords.filter(b => selectedCompanyId === 'all' || b.clientId === selectedCompanyId).length === 0 && (
                                    <div className="text-center p-8 bg-slate-800/50 rounded-xl border border-white/5 border-dashed text-slate-500">
                                        <i className="fas fa-file-invoice-dollar text-4xl mb-4 opacity-50"></i>
                                        <div>No billing records yet for this client.</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default ClientWorkspace;
