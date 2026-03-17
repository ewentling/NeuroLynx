import React from 'react';
import { Product, User, AuditLog, Integration, AutomationRule } from '../../types';

interface InternalWorkspaceProps {
    internalTab: 'offerings' | 'team' | 'system' | 'automations' | 'profile' | 'data';
    onSetInternalTab: (tab: any) => void;

    // Products
    products: Product[];
    onAddProduct: () => void;
    onEditProduct: (p: Product) => void;
    onDeleteProduct: (id: string) => void;

    // Users / Team
    users: User[];
    currentUser: User | null;
    maxUsers: number;
    tasks: any[];
    onAddUser: () => void;
    onUnlockUser: (id: string) => void;
    onResetPassword: (u: User) => void;
    onDeleteUser: (id: string) => void;

    // System
    auditLogs: AuditLog[];
    mockIntegrations: Integration[];
    configuredModels: any[];
    featureMapping: { [key: string]: string };
    onSetFeatureMapping: (mapping: { [key: string]: string }) => void;
    popularLlms: any[];
    newModelSelection: string;
    newModelKey: string;
    onSetNewModelSelection: (val: string) => void;
    onSetNewModelKey: (val: string) => void;
    onRemoveModel: (id: string) => void;
    onAddModel: () => void;

    // Automations
    automationRules: AutomationRule[];
    onAddAutomation: () => void;
    onDeleteAutomation: (id: string) => void;

    // Business Profile
    businessProfile: any;
    onSetBusinessProfile: (p: any) => void;

    // Data Management
    onImportCsv: () => void;
    onAddToast: (type: any, msg: string) => void;
    companies: any[];
    selectedExportCompanyId: string;
    onSetSelectedExportCompanyId: (id: string) => void;
    onClientExport: () => void;
    isLoading: boolean;
}

const InternalWorkspace: React.FC<InternalWorkspaceProps> = ({
    internalTab,
    onSetInternalTab,
    products,
    onAddProduct,
    onEditProduct,
    onDeleteProduct,
    users,
    currentUser,
    maxUsers,
    tasks,
    onAddUser,
    onUnlockUser,
    onResetPassword,
    onDeleteUser,
    auditLogs,
    mockIntegrations,
    configuredModels,
    featureMapping,
    onSetFeatureMapping,
    popularLlms,
    newModelSelection,
    newModelKey,
    onSetNewModelSelection,
    onSetNewModelKey,
    onRemoveModel,
    onAddModel,
    automationRules,
    onAddAutomation,
    onDeleteAutomation,
    businessProfile,
    onSetBusinessProfile,
    onImportCsv,
    onAddToast,
    companies,
    selectedExportCompanyId,
    onSetSelectedExportCompanyId,
    onClientExport,
    isLoading
}) => {
    return (
        <div className="space-y-6">
            {/* Tabs are handled in App.tsx or parent for now, assuming they are passed in or handled via Props */}
            {internalTab === 'offerings' && (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Product & Service Offerings</h2>
                        <button onClick={onAddProduct} className="px-4 py-2 bg-orange-600 rounded text-xs font-bold hover:bg-orange-500">Add Product</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {products.map(p => (
                            <div key={p.id} className="p-4 bg-slate-800 rounded-xl border border-white/5 flex justify-between items-start group hover:border-cyan-500/30 transition-all">
                                <div>
                                    <div className="font-bold text-white">{p.name}</div>
                                    <div className="text-xs text-slate-400 mb-1">{p.sku} • {p.billingTiming}</div>
                                    <div className="text-xs text-slate-500">{p.description.substring(0, 50)}...</div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <div className="font-mono text-cyan-400 font-bold">${p.price}</div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => onEditProduct(p)} className="p-1 hover:text-white text-slate-400" title="Edit"><i className="fas fa-edit"></i></button>
                                        <button onClick={() => onDeleteProduct(p.id)} className="p-1 hover:text-red-400 text-slate-400" title="Delete"><i className="fas fa-trash"></i></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {internalTab === 'team' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold">Team Management</h2>
                            <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                                <i className={`fas fa-circle text-[8px] ${users.length >= maxUsers ? 'text-red-500' : 'text-emerald-500'}`}></i>
                                <span className="font-mono text-slate-200 font-bold">{users.length}</span> of <span className="font-mono text-slate-200 font-bold">{maxUsers}</span> Accounts Used
                            </div>
                        </div>
                        <button onClick={onAddUser} className="px-4 py-2 bg-orange-600 rounded-lg text-white font-bold text-xs hover:bg-orange-500 transition-colors"><i className="fas fa-plus mr-2"></i> Add Member</button>
                    </div>

                    <div className="bg-slate-800 rounded-xl border border-white/5 p-6 mb-6">
                        <h3 className="font-bold text-sm uppercase text-slate-500 mb-4"><i className="fas fa-trophy text-yellow-500 mr-2"></i> Sales Leaderboard</h3>
                        <div className="space-y-3">
                            {users.map(user => {
                                const completedTasks = tasks.filter(t => t.assignedTo === user.id && t.status === 'done').length;
                                const score = completedTasks * 100;
                                return { user, score };
                            }).sort((a, b) => b.score - a.score).map((item, idx) => (
                                <div key={item.user.id} className="flex items-center gap-4 p-3 bg-black/20 rounded border border-white/5">
                                    <div className={`font-bold text-lg w-6 text-center ${idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-slate-300' : idx === 2 ? 'text-orange-400' : 'text-slate-600'}`}>#{idx + 1}</div>
                                    <div className="flex-1">
                                        <div className="font-bold text-sm">{item.user.name}</div>
                                        <div className="text-xs text-slate-400">{item.user.role}</div>
                                    </div>
                                    <div className="font-mono font-bold text-cyan-400">{item.score} pts</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {users.map(u => (
                            <div key={u.id} className="flex items-center justify-between p-4 bg-slate-800 border border-white/5 rounded-xl">
                                <div className="flex items-center gap-4">
                                    <div>
                                        <div className="font-bold">{u.name} {u.id === currentUser?.id && <span className="text-xs text-cyan-400">(You)</span>}</div>
                                        <div className="text-xs text-slate-400">{u.email}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${u.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>{u.role}</div>
                                    {u.lockoutUntil && u.lockoutUntil > Date.now() ? (
                                        <button onClick={() => onUnlockUser(u.id)} className="text-red-400 text-xs hover:underline"><i className="fas fa-lock mr-1"></i> Locked</button>
                                    ) : (
                                        <span className="text-green-400 text-xs"><i className="fas fa-check-circle mr-1"></i> Active</span>
                                    )}
                                    {currentUser?.role === 'admin' && (
                                        <div className="flex gap-2 ml-4">
                                            <button onClick={() => onResetPassword(u)} className="p-2 hover:bg-white/10 rounded text-slate-400 hover:text-white" title="Reset Password"><i className="fas fa-key"></i></button>
                                            {u.id !== currentUser?.id && (
                                                <button onClick={() => onDeleteUser(u.id)} className="p-2 hover:bg-red-500/20 rounded text-slate-400 hover:text-red-400" title="Remove User"><i className="fas fa-trash"></i></button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {internalTab === 'system' && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold">System Configuration</h2>

                    <div className="p-6 bg-slate-800 rounded-xl border border-white/10">
                        <h3 className="font-bold mb-4 flex items-center gap-2"><i className="fas fa-history text-slate-400"></i> System Audit Logs</h3>
                        <div className="max-h-64 overflow-y-auto space-y-2 custom-scrollbar border border-white/5 rounded bg-black/20 p-2">
                            {auditLogs.map(log => (
                                <div key={log.id} className="text-xs flex gap-2 p-2 hover:bg-white/5 rounded">
                                    <span className="text-slate-500 font-mono">{new Date(log.timestamp).toLocaleString()}</span>
                                    <span className="font-bold text-cyan-400 w-24 truncate">{log.action}</span>
                                    <span className="text-white flex-1">{log.details || log.target}</span>
                                    <span className="text-slate-500">{users.find(u => u.id === log.userId)?.name || 'System'}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 bg-slate-800 rounded-xl border border-white/10">
                        <h3 className="font-bold mb-4">Integrations Status</h3>
                        <div className="space-y-2">
                            {mockIntegrations.map(int => (
                                <div key={int.id} className="flex justify-between items-center p-3 bg-black/20 rounded border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${int.status === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                        <div className="font-bold text-sm">{int.name}</div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs text-slate-500">Last Sync: {int.lastSync ? new Date(int.lastSync).toLocaleDateString() : 'N/A'}</span>
                                        <button onClick={() => {
                                            onAddToast('info', `Testing connection to ${int.name}...`);
                                            setTimeout(() => onAddToast('success', `${int.name} is healthy (24ms)`), 1500);
                                        }} className="text-xs text-cyan-400 hover:underline">Test Connection</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 bg-slate-800 rounded-xl border border-white/10">
                        <h3 className="font-bold mb-4">AI Models</h3>
                        <div className="space-y-2">
                            {configuredModels.map(m => (
                                <div key={m.id} className="flex justify-between items-center p-3 bg-black/20 rounded">
                                    <div>
                                        <div className="font-bold text-sm">{m.name}</div>
                                        <div className="text-xs text-slate-500">{m.modelId}</div>
                                    </div>
                                    <button onClick={() => onRemoveModel(m.id)} className="text-red-400 hover:text-white"><i className="fas fa-trash"></i></button>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
                            <select className="flex-1 bg-black/20 p-2 rounded border border-white/10 text-sm" value={newModelSelection} onChange={e => onSetNewModelSelection(e.target.value)}>
                                {popularLlms.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                            <input className="flex-1 bg-black/20 p-2 rounded border border-white/10 text-sm" placeholder="API Key" value={newModelKey} onChange={e => onSetNewModelKey(e.target.value)} type="password" />
                            <button onClick={onAddModel} className="px-4 bg-green-600 rounded text-xs font-bold">Add</button>
                        </div>
                    </div>

                    <div className="p-6 bg-slate-800 rounded-xl border border-white/10">
                        <h3 className="font-bold mb-4">Chat Model Assignment</h3>
                        <p className="text-sm text-slate-400 mb-4">Select which AI model to use for the chat feature. The chat will automatically use the first model with a valid API key if "Auto-select" is chosen.</p>
                        <div className="flex items-center gap-3">
                            <label className="text-sm text-slate-400">Chat Model:</label>
                            <select 
                                className="flex-1 bg-black/20 p-2 rounded border border-white/10 text-sm" 
                                value={featureMapping['chat'] || 'default'}
                                onChange={e => onSetFeatureMapping({ ...featureMapping, chat: e.target.value })}
                            >
                                <option value="default">Auto-select (first with API key)</option>
                                {configuredModels.filter(m => m.apiKey && m.apiKey.trim() !== '').map(m => (
                                    <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                            </select>
                        </div>
                        {featureMapping['chat'] !== 'default' && (
                            <div className="mt-2 text-xs text-green-400">
                                <i className="fas fa-check-circle mr-1"></i>
                                Using: {configuredModels.find(m => m.id === featureMapping['chat'])?.name || 'Unknown'}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {internalTab === 'automations' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Workflow Automations</h2>
                        <button onClick={onAddAutomation} className="px-4 py-2 bg-orange-600 rounded text-xs font-bold hover:bg-orange-500 shadow-lg shadow-orange-500/20">+ Add Workflow</button>
                    </div>
                    <div className="text-slate-400 text-sm mb-4">
                        Configure webhooks to trigger external n8n workflows based on internal events.
                    </div>
                    <div className="space-y-3">
                        {automationRules.map(rule => (
                            <div key={rule.id} className="p-4 bg-slate-800 rounded-xl border border-white/10 flex justify-between items-center">
                                <div>
                                    <div className="font-bold text-sm flex items-center gap-2">
                                        {rule.name}
                                        <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px]">{rule.event}</span>
                                    </div>
                                    <div className="text-xs text-slate-500 font-mono mt-1 truncate max-w-md">{rule.webhookUrl}</div>
                                </div>
                                <div className="flex items-center gap-4">
                                    {rule.lastTriggered && (
                                        <div className="text-[10px] text-emerald-400">
                                            Last Run: {new Date(rule.lastTriggered).toLocaleTimeString()}
                                        </div>
                                    )}
                                    <button onClick={() => onDeleteAutomation(rule.id)} className="text-red-400 hover:text-white"><i className="fas fa-trash"></i></button>
                                </div>
                            </div>
                        ))}
                        {automationRules.length === 0 && (
                            <div className="text-center p-8 bg-slate-800/50 rounded-xl border border-white/5 border-dashed text-slate-500">
                                No active automations. Create one to connect to n8n.
                            </div>
                        )}
                    </div>
                </div>
            )}

            {internalTab === 'profile' && (
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold">Business Profile</h2>
                    <input className="w-full p-3 bg-slate-800 rounded border border-white/10" value={businessProfile.name} onChange={e => onSetBusinessProfile({ ...businessProfile, name: e.target.value })} placeholder="Business Name" />
                    <input className="w-full p-3 bg-slate-800 rounded border border-white/10" value={businessProfile.address} onChange={e => onSetBusinessProfile({ ...businessProfile, address: e.target.value })} placeholder="Address" />
                    <input className="w-full p-3 bg-slate-800 rounded border border-white/10" value={businessProfile.phone} onChange={e => onSetBusinessProfile({ ...businessProfile, phone: e.target.value })} placeholder="Phone" />
                    <input className="w-full p-3 bg-slate-800 rounded border border-white/10" value={businessProfile.website} onChange={e => onSetBusinessProfile({ ...businessProfile, website: e.target.value })} placeholder="Website" />
                </div>
            )}

            {internalTab === 'data' && (
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold">Data Management</h2>

                    <div className="p-6 bg-slate-800 rounded-xl border border-white/10">
                        <h3 className="font-bold mb-2">Import Clients (CSV)</h3>
                        <p className="text-xs text-slate-500 mb-4">Format: Name, Email, Company, Role</p>
                        <div className="flex gap-2">
                            <textarea className="flex-1 bg-black/20 p-3 rounded border border-white/10 text-xs font-mono h-24" placeholder="John Doe, john@example.com, Acme Inc, CEO..." id="csv-input"></textarea>
                            <button onClick={onImportCsv} className="px-4 bg-blue-600 rounded text-xs font-bold hover:bg-blue-500">Import</button>
                        </div>
                    </div>

                    <div className="p-6 bg-slate-800 rounded-xl border border-white/10">
                        <h3 className="font-bold mb-2">Export Client Data</h3>
                        <div className="flex gap-2">
                            <select className="flex-1 bg-black/20 p-2 rounded border border-white/10 text-sm" value={selectedExportCompanyId} onChange={e => onSetSelectedExportCompanyId(e.target.value)}>
                                <option value="">Select Client...</option>
                                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            <button onClick={onClientExport} disabled={isLoading} className="px-4 py-2 bg-cyan-600 rounded text-xs font-bold hover:bg-cyan-500">{isLoading ? 'Exporting...' : 'Export ZIP'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InternalWorkspace;
