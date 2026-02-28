import React from 'react';
import {
    Deal, DealStage, Meeting, Message, WorkspaceItem,
    Product, User, AuditLog, Integration, Company,
    AutomationRule, Template, UserRole
} from '../types';

// Sub-components for better organization
import PipelineView from './ManagementPanel/PipelineView';
import MeetingsView from './ManagementPanel/MeetingsView';
import ChatView from './ManagementPanel/ChatView';
import InternalWorkspace from './ManagementPanel/InternalWorkspace';
import ClientWorkspace from './ManagementPanel/ClientWorkspace';

interface ManagementPanelProps {
    view: string;
    // Deals / Pipeline
    deals: Deal[];
    companies: Company[];
    selectedCompanyId: string;
    draggedDealId: string | null;
    onDealDragStart: (e: React.DragEvent, id: string) => void;
    onDealDragOver: (e: React.DragEvent) => void;
    onDealDrop: (e: React.DragEvent, stage: DealStage) => void;
    onDealExport: () => void;
    onMoveDeal: (id: string, stage: DealStage) => void;
    onAddDeal: () => void;
    onEditCompany: (company: Company) => void;

    // Meetings
    meetings: Meeting[];
    isLiveMeeting: boolean;
    onToggleLiveMeeting: (status: boolean) => void;
    onLogMeeting: () => void;

    // Chat
    chatMode: 'internal' | 'all' | 'client';
    chatClientSelection: string;
    onSetChatMode: (mode: 'internal' | 'all' | 'client') => void;
    onSetChatClientSelection: (id: string) => void;
    messages: Message[];
    input: string;
    onSetInput: (val: string) => void;
    onSubmitMessage: () => void;
    messagesEndRef: React.RefObject<HTMLDivElement>;
    isVoiceContinuityEnabled: boolean;
    onToggleVoiceContinuity: (val: boolean) => void;

    // Workspace
    workspaceMode: 'internal' | 'client';
    internalTab: 'offerings' | 'team' | 'system' | 'automations' | 'profile' | 'data';
    clientWorkspaceTab: 'overview' | 'contracts' | 'documents' | 'billing';
    onSetWorkspaceMode: (mode: 'internal' | 'client') => void;
    onSetInternalTab: (tab: any) => void;
    onSetClientWorkspaceTab: (tab: any) => void;

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

    // Client Data / Export
    clientHealth: { score: number; trend: string };
    memory: any[];
    workspaceItems: WorkspaceItem[];
    contracts: any[];
    clients: any[];
    activeClient: Company | null;
    selectedExportCompanyId: string;
    onSetSelectedExportCompanyId: (id: string) => void;
    onClientExport: () => void;
    onImportCsv: () => void;
    onLogAction: (action: string, target: string, details?: string) => void;
    billingRecords: any[];
    onRunEOMBilling: (companyId: string) => void;
    selectedMeeting: Meeting | null;
    onSetSelectedMeeting: (m: Meeting | null) => void;
    calYear: number;
    calMonth: number;
    monthNames: string[];
    firstDay: number;
    days: number;
    onSetCurrentDate: (d: Date) => void;
    commFolder: string;
    onSetCommFolder: (f: string) => void;
    onDraftEmail: () => void;
    onManageTemplates: () => void;
    taskFilter: string;
    selectedTasks: Set<string>;
    onSetSelectedTasks: (ids: Set<string>) => void;
    onMoveTask: (id: string, status: string) => void;
    onHandleTaskExport: () => void;
    onSetModalData: (data: any) => void;
    onSetActiveModal: (modal: any) => void;
    isMapView: boolean;
    onSetIsMapView: (v: boolean) => void;
    isDarkMode: boolean;
    isLoading: boolean;
    onAddToast: (type: any, msg: string) => void;
    onSetView: (view: string) => void;
    onOpenContractBuilder: (c?: any) => void;
    mockTemplates: any[];
    setWorkspaceItems: React.Dispatch<React.SetStateAction<any[]>>;
    setCompanies: React.Dispatch<React.SetStateAction<any[]>>;
    onSetSelectedCompanyId: React.Dispatch<React.SetStateAction<string | "all">>;
}

const ManagementPanel: React.FC<ManagementPanelProps> = (props) => {
    const { view } = props;

    return (
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar relative">
            {view === 'pipeline' && <PipelineView {...props} />}
            {view === 'meetings' && <MeetingsView {...props} />}
            {view === 'chat' && (
                <ChatView
                    {...props}
                    isVoiceContinuityEnabled={props.isVoiceContinuityEnabled}
                    onToggleVoiceContinuity={props.onToggleVoiceContinuity}
                />
            )}
            {view === 'workspace' && (
                <div className="space-y-6">
                    <div className="flex justify-center mb-6">
                        <div className="bg-slate-800 p-1 rounded-lg flex border border-white/10">
                            <button onClick={() => props.onSetWorkspaceMode('internal')} className={`px-4 py-1 rounded text-xs font-bold transition-all ${props.workspaceMode === 'internal' ? 'bg-orange-600' : 'text-slate-400'}`}>Internal Ops</button>
                            <button onClick={() => props.onSetWorkspaceMode('client')} className={`px-4 py-1 rounded text-xs font-bold transition-all ${props.workspaceMode === 'client' ? 'bg-orange-600' : 'text-slate-400'}`}>Client Portal</button>
                        </div>
                    </div>
                    {props.workspaceMode === 'internal' ? (
                        <>
                            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar border-b border-white/5 mb-6">
                                {['offerings', 'team', 'system', 'automations', 'profile', 'data'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => props.onSetInternalTab(tab)}
                                        className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${props.internalTab === tab ? 'bg-white/10 text-white border border-white/20' : 'text-slate-400 hover:text-white'}`}
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </button>
                                ))}
                            </div>
                            <InternalWorkspace {...props} />
                        </>
                    ) : (
                        <>
                            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar border-b border-white/5 mb-6">
                                {['overview', 'contracts', 'documents', 'billing'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => props.onSetClientWorkspaceTab(tab)}
                                        className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${props.clientWorkspaceTab === tab ? 'bg-white/10 text-white border border-white/20' : 'text-slate-400 hover:text-white'}`}
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </button>
                                ))}
                            </div>
                            <ClientWorkspace {...props} />
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default ManagementPanel;
