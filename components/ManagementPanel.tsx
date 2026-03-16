import React from 'react';
import {
    Deal, DealStage, Meeting, Message, WorkspaceItem,
    Product, User, AuditLog, Integration, Company,
    AutomationRule, Template, UserRole, Task, Contract,
    KPIGoal, SupportTicket, Invoice, EsignRequest, Asset,
    WikiPage, OrgContact, FeatureRequest, Partner, CustomField,
    ActivityEntry, OnboardingChecklist, EmailSequence, Vendor,
    BillingRecord, Expense, ComplianceItem, DocVersion, CSATResponse,
    Project, TimeEntry
} from '../types';

// Sub-components for better organization
import PipelineView from './ManagementPanel/PipelineView';
import MeetingsView from './ManagementPanel/MeetingsView';
import ChatView from './ManagementPanel/ChatView';
import InternalWorkspace from './ManagementPanel/InternalWorkspace';
import ClientWorkspace from './ManagementPanel/ClientWorkspace';

// Additional view components
import ForecastView from './ForecastView';
import AlertsPanel from './AlertsPanel';
import WinLossView from './WinLossView';
import KPIView from './KPIView';
import VelocityView from './VelocityView';
import ProfitabilityView from './ProfitabilityView';
import UtilizationView from './UtilizationView';
import CSATView from './CSATView';
import TicketView from './TicketView';
import InvoiceBuilder from './InvoiceBuilder';
import EsignTracker from './EsignTracker';
import AssetTracker from './AssetTracker';
import WikiView from './WikiView';
import OrgChartView from './OrgChartView';
import RoadmapView from './RoadmapView';
import PartnerView from './PartnerView';
import MetadataManager from './MetadataManager';
import ActivityTimeline from './ActivityTimeline';
import OnboardingView from './OnboardingView';
import SequenceView from './SequenceView';
import VendorView from './VendorView';
import ClientPortal from './ClientPortal';
import ExpenseView from './ExpenseView';
import ComplianceView from './ComplianceView';
import DocVersionsView from './DocVersionsView';

interface ManagementPanelProps {
    view: string;
    // Deals / Pipeline
    deals?: Deal[];
    companies?: Company[];
    selectedCompanyId?: string;
    draggedDealId?: string | null;
    onDealDragStart?: (e: React.DragEvent, id: string) => void;
    onDealDragOver?: (e: React.DragEvent) => void;
    onDealDrop?: (e: React.DragEvent, stage: DealStage) => void;
    onDealExport?: () => void;
    onMoveDeal?: (id: string, stage: DealStage) => void;
    onAddDeal?: () => void;
    onEditCompany?: (company: Company) => void;

    // Meetings
    meetings?: Meeting[];
    isLiveMeeting?: boolean;
    onToggleLiveMeeting?: (status: boolean) => void;
    onLogMeeting?: () => void;

    // Chat - simplified (no more mode)
    messages?: Message[];
    input?: string;
    onSetInput?: (val: string) => void;
    onSubmitMessage?: () => void;
    messagesEndRef?: React.RefObject<HTMLDivElement>;
    isVoiceContinuityEnabled?: boolean;
    onToggleVoiceContinuity?: (val: boolean) => void;

    // Workspace
    workspaceMode?: 'internal' | 'client';
    internalTab?: 'offerings' | 'team' | 'system' | 'automations' | 'profile' | 'data';
    clientWorkspaceTab?: 'overview' | 'contracts' | 'documents' | 'billing';
    onSetWorkspaceMode?: (mode: 'internal' | 'client') => void;
    onSetInternalTab?: (tab: any) => void;
    onSetClientWorkspaceTab?: (tab: any) => void;

    // Products
    products?: Product[];
    onAddProduct?: () => void;
    onEditProduct?: (p: Product) => void;
    onDeleteProduct?: (id: string) => void;

    // Users / Team
    users?: User[];
    currentUser?: User | null;
    maxUsers?: number;
    tasks?: Task[];
    onAddUser?: () => void;
    onUnlockUser?: (id: string) => void;
    onResetPassword?: (u: User) => void;
    onDeleteUser?: (id: string) => void;

    // System
    auditLogs?: AuditLog[];
    mockIntegrations?: Integration[];
    configuredModels?: any[];
    popularLlms?: any[];
    newModelSelection?: string;
    newModelKey?: string;
    onSetNewModelSelection?: (val: string) => void;
    onSetNewModelKey?: (val: string) => void;
    onRemoveModel?: (id: string) => void;
    onAddModel?: () => void;

    // Automations
    automationRules?: AutomationRule[];
    onAddAutomation?: () => void;
    onDeleteAutomation?: (id: string) => void;

    // Business Profile
    businessProfile?: any;
    onSetBusinessProfile?: (p: any) => void;

    // Client Data / Export
    clientHealth?: { score: number; trend: string };
    memory?: any[];
    workspaceItems?: WorkspaceItem[];
    contracts?: Contract[];
    clients?: any[];
    activeClient?: Company | null;
    selectedExportCompanyId?: string;
    onSetSelectedExportCompanyId?: (id: string) => void;
    onClientExport?: () => void;
    onImportCsv?: () => void;
    onLogAction?: (action: string, target: string, details?: string) => void;
    billingRecords?: BillingRecord[];
    onRunEOMBilling?: (companyId: string) => void;
    selectedMeeting?: Meeting | null;
    onSetSelectedMeeting?: (m: Meeting | null) => void;
    calYear?: number;
    calMonth?: number;
    monthNames?: string[];
    firstDay?: number;
    days?: number;
    onSetCurrentDate?: (d: Date) => void;
    commFolder?: string;
    onSetCommFolder?: (f: string) => void;
    onDraftEmail?: () => void;
    onManageTemplates?: () => void;
    taskFilter?: string;
    selectedTasks?: Set<string>;
    onSetSelectedTasks?: (ids: Set<string>) => void;
    onMoveTask?: (id: string, status: string) => void;
    onHandleTaskExport?: () => void;
    onSetModalData?: (data: any) => void;
    onSetActiveModal?: (modal: any) => void;
    isMapView?: boolean;
    onSetIsMapView?: (v: boolean) => void;
    isDarkMode?: boolean;
    isLoading?: boolean;
    onAddToast?: (type: any, msg: string) => void;
    onSetView?: (view: string) => void;
    onOpenContractBuilder?: (c?: any) => void;
    mockTemplates?: any[];
    setWorkspaceItems?: React.Dispatch<React.SetStateAction<any[]>>;
    setCompanies?: React.Dispatch<React.SetStateAction<any[]>>;
    onSetSelectedCompanyId?: React.Dispatch<React.SetStateAction<string | "all">>;

    // Additional props for various views
    tickets?: SupportTicket[];
    onSaveTicket?: (ticket: SupportTicket) => void;
    onUpdateTicket?: (id: string, updates: Partial<SupportTicket>) => void;
    kpiGoals?: KPIGoal[];
    onUpdateKpiGoal?: (id: string, current: number) => void;
    projects?: Project[];
    expenses?: Expense[];
    timeEntries?: TimeEntry[];
    csatResponses?: CSATResponse[];
    onSendSurvey?: () => void;
    invoices?: Invoice[];
    onSaveInvoice?: (invoice: Invoice) => void;
    esignRequests?: EsignRequest[];
    assets?: Asset[];
    wikiPages?: WikiPage[];
    orgContacts?: OrgContact[];
    featureRequests?: FeatureRequest[];
    partners?: Partner[];
    customFields?: CustomField[];
    activities?: ActivityEntry[];
    onLogActivity?: () => void;
    onboardingChecklists?: OnboardingChecklist[];
    onToggleOnboardingItem?: (checklistId: string, itemId: string) => void;
    onCreateOnboardingChecklist?: () => void;
    emailSequences?: EmailSequence[];
    onCreateSequence?: () => void;
    onToggleSequenceStatus?: (id: string) => void;
    vendors?: Vendor[];
    onAddVendor?: () => void;
    complianceItems?: ComplianceItem[];
    docVersions?: DocVersion[];
    onRestoreVersion?: (versionId: string) => void;
    onAddExpense?: () => void;
}

const ManagementPanel: React.FC<ManagementPanelProps> = (props) => {
    const { view } = props;

    // Helper to get selected company for single-company views
    // Only use first company as fallback for views that always need a company
    const selectedCompany = props.companies?.find(c => c.id === props.selectedCompanyId);
    const defaultCompany = props.companies?.[0];

    // Empty state component for views requiring company selection
    const CompanyRequiredState = () => (
        <div className="flex items-center justify-center h-64 text-slate-500 flex-col">
            <i className="fas fa-building text-4xl mb-4 opacity-50"></i>
            <div className="text-lg font-bold mb-2">Company Selection Required</div>
            <div className="text-sm">Please select a company from the dropdown above to view this section.</div>
        </div>
    );

    return (
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar relative">
            {view === 'pipeline' && (
                <PipelineView
                    deals={props.deals || []}
                    companies={props.companies || []}
                    selectedCompanyId={props.selectedCompanyId || ''}
                    draggedDealId={props.draggedDealId || null}
                    onDealDragStart={props.onDealDragStart || (() => {})}
                    onDealDragOver={props.onDealDragOver || (() => {})}
                    onDealDrop={props.onDealDrop || (() => {})}
                    onDealExport={props.onDealExport || (() => {})}
                    onMoveDeal={props.onMoveDeal || (() => {})}
                    onAddDeal={props.onAddDeal || (() => {})}
                />
            )}
            {view === 'meetings' && (
                <MeetingsView
                    meetings={props.meetings || []}
                    companies={props.companies || []}
                    isLiveMeeting={props.isLiveMeeting || false}
                    onToggleLiveMeeting={props.onToggleLiveMeeting || (() => {})}
                    onLogMeeting={props.onLogMeeting || (() => {})}
                    onAddToast={props.onAddToast || (() => {})}
                />
            )}
            {view === 'chat' && (
                <ChatView
                    messages={props.messages || []}
                    companies={props.companies || []}
                    selectedCompanyId={props.selectedCompanyId || ''}
                    input={props.input || ''}
                    onSetInput={props.onSetInput || (() => {})}
                    onSubmitMessage={props.onSubmitMessage || (() => {})}
                    messagesEndRef={props.messagesEndRef || { current: null }}
                    isVoiceContinuityEnabled={props.isVoiceContinuityEnabled || false}
                    onToggleVoiceContinuity={props.onToggleVoiceContinuity || (() => {})}
                />
            )}
            {view === 'workspace' && (
                <div className="space-y-6">
                    <div className="flex justify-center mb-6">
                        <div className="bg-slate-800 p-1 rounded-lg flex border border-white/10">
                            <button onClick={() => props.onSetWorkspaceMode?.('internal')} className={`px-4 py-1 rounded text-xs font-bold transition-all ${props.workspaceMode === 'internal' ? 'bg-orange-600' : 'text-slate-400'}`}>Internal Ops</button>
                            <button onClick={() => props.onSetWorkspaceMode?.('client')} className={`px-4 py-1 rounded text-xs font-bold transition-all ${props.workspaceMode === 'client' ? 'bg-orange-600' : 'text-slate-400'}`}>Client Portal</button>
                        </div>
                    </div>
                    {props.workspaceMode === 'internal' ? (
                        <>
                            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar border-b border-white/5 mb-6">
                                {['offerings', 'team', 'system', 'automations', 'profile', 'data'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => props.onSetInternalTab?.(tab)}
                                        className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${props.internalTab === tab ? 'bg-white/10 text-white border border-white/20' : 'text-slate-400 hover:text-white'}`}
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </button>
                                ))}
                            </div>
                            <InternalWorkspace
                                internalTab={props.internalTab || 'offerings'}
                                onSetInternalTab={props.onSetInternalTab || (() => {})}
                                products={props.products || []}
                                onAddProduct={props.onAddProduct || (() => {})}
                                onEditProduct={props.onEditProduct || (() => {})}
                                onDeleteProduct={props.onDeleteProduct || (() => {})}
                                users={props.users || []}
                                currentUser={props.currentUser || null}
                                maxUsers={props.maxUsers || 10}
                                tasks={props.tasks || []}
                                onAddUser={props.onAddUser || (() => {})}
                                onUnlockUser={props.onUnlockUser || (() => {})}
                                onResetPassword={props.onResetPassword || (() => {})}
                                onDeleteUser={props.onDeleteUser || (() => {})}
                                auditLogs={props.auditLogs || []}
                                mockIntegrations={props.mockIntegrations || []}
                                configuredModels={props.configuredModels || []}
                                popularLlms={props.popularLlms || []}
                                newModelSelection={props.newModelSelection || ''}
                                newModelKey={props.newModelKey || ''}
                                onSetNewModelSelection={props.onSetNewModelSelection || (() => {})}
                                onSetNewModelKey={props.onSetNewModelKey || (() => {})}
                                onRemoveModel={props.onRemoveModel || (() => {})}
                                onAddModel={props.onAddModel || (() => {})}
                                automationRules={props.automationRules || []}
                                onAddAutomation={props.onAddAutomation || (() => {})}
                                onDeleteAutomation={props.onDeleteAutomation || (() => {})}
                                businessProfile={props.businessProfile || {}}
                                onSetBusinessProfile={props.onSetBusinessProfile || (() => {})}
                                onImportCsv={props.onImportCsv || (() => {})}
                                onAddToast={props.onAddToast || (() => {})}
                                companies={props.companies || []}
                                selectedExportCompanyId={props.selectedExportCompanyId || ''}
                                onSetSelectedExportCompanyId={props.onSetSelectedExportCompanyId || (() => {})}
                                onClientExport={props.onClientExport || (() => {})}
                                isLoading={props.isLoading || false}
                            />
                        </>
                    ) : (
                        <>
                            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar border-b border-white/5 mb-6">
                                {['overview', 'contracts', 'documents', 'billing'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => props.onSetClientWorkspaceTab?.(tab)}
                                        className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${props.clientWorkspaceTab === tab ? 'bg-white/10 text-white border border-white/20' : 'text-slate-400 hover:text-white'}`}
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </button>
                                ))}
                            </div>
                            <ClientWorkspace
                                clientWorkspaceTab={props.clientWorkspaceTab || 'overview'}
                                activeClient={props.activeClient || null}
                                companies={props.companies || []}
                                selectedCompanyId={props.selectedCompanyId || ''}
                                clientHealth={props.clientHealth || { score: 0, trend: 'stable' }}
                                tasks={props.tasks || []}
                                meetings={props.meetings || []}
                                workspaceItems={props.workspaceItems || []}
                                memory={props.memory || []}
                                contracts={props.contracts || []}
                                clients={props.clients || []}
                                onOpenContractBuilder={props.onOpenContractBuilder || (() => {})}
                                mockTemplates={props.mockTemplates || []}
                                onAddToast={props.onAddToast || (() => {})}
                                setWorkspaceItems={props.setWorkspaceItems || (() => {})}
                                setCompanies={props.setCompanies || (() => {})}
                            />
                        </>
                    )}
                </div>
            )}

            {/* Analytics & Insights Views */}
            {view === 'forecast' && (
                <ForecastView
                    deals={props.deals || []}
                    companies={props.companies || []}
                />
            )}
            {view === 'alerts' && (
                <AlertsPanel
                    deals={props.deals || []}
                    tasks={props.tasks || []}
                    contracts={props.contracts || []}
                    companies={props.companies || []}
                    onNavigate={props.onSetView || (() => {})}
                />
            )}
            {view === 'winloss' && (
                <WinLossView
                    deals={props.deals || []}
                    companies={props.companies || []}
                />
            )}
            {view === 'kpis' && (
                <KPIView
                    goals={props.kpiGoals || []}
                    onUpdateGoal={props.onUpdateKpiGoal || (() => {})}
                />
            )}
            {view === 'velocity' && (
                <VelocityView
                    deals={props.deals || []}
                    companies={props.companies || []}
                />
            )}
            {view === 'profitability' && (
                <ProfitabilityView
                    projects={props.projects || []}
                    expenses={props.expenses || []}
                    timeEntries={props.timeEntries || []}
                    companies={props.companies || []}
                />
            )}
            {view === 'utilization' && (
                <UtilizationView
                    tasks={props.tasks || []}
                    meetings={props.meetings || []}
                    users={props.users || []}
                />
            )}
            {view === 'csat' && (
                <CSATView
                    responses={props.csatResponses || []}
                    companies={props.companies || []}
                    onSendSurvey={props.onSendSurvey || (() => {})}
                />
            )}

            {/* Support & Tickets */}
            {view === 'tickets' && (
                <TicketView
                    tickets={props.tickets || []}
                    companies={props.companies || []}
                    users={props.users || []}
                    onCreateTicket={() => props.onSetActiveModal?.('save_ticket')}
                    onUpdateTicket={props.onUpdateTicket || (() => {})}
                />
            )}

            {/* Business Operations Views */}
            {view === 'invoices' && (
                <InvoiceBuilder
                    invoices={props.invoices || []}
                    companies={props.companies || []}
                    onSaveInvoice={props.onSaveInvoice || (() => {})}
                />
            )}
            {view === 'esign' && (
                <EsignTracker
                    requests={props.esignRequests || []}
                    companies={props.companies || []}
                />
            )}
            {view === 'assets' && (
                <AssetTracker
                    assets={props.assets || []}
                    companies={props.companies || []}
                />
            )}
            {view === 'wiki' && (
                <WikiView
                    pages={props.wikiPages || []}
                    companies={props.companies || []}
                />
            )}
            {view === 'orgchart' && (
                selectedCompany ? (
                    <OrgChartView
                        company={selectedCompany}
                        contacts={props.orgContacts || []}
                    />
                ) : (
                    <CompanyRequiredState />
                )
            )}
            {view === 'roadmap' && (
                <RoadmapView
                    requests={props.featureRequests || []}
                    companies={props.companies || []}
                />
            )}
            {view === 'partners' && (
                <PartnerView
                    partners={props.partners || []}
                />
            )}
            {view === 'customfields' && (
                <MetadataManager
                    fields={props.customFields || []}
                />
            )}

            {/* Activity & Workflow Views */}
            {view === 'activity' && (
                <ActivityTimeline
                    activities={props.activities || []}
                    companies={props.companies || []}
                    users={props.users || []}
                    onLogActivity={props.onLogActivity || (() => {})}
                />
            )}
            {view === 'onboarding' && (
                <OnboardingView
                    checklists={props.onboardingChecklists || []}
                    companies={props.companies || []}
                    onToggleItem={props.onToggleOnboardingItem || (() => {})}
                    onCreateChecklist={props.onCreateOnboardingChecklist || (() => {})}
                />
            )}
            {view === 'sequences' && (
                <SequenceView
                    sequences={props.emailSequences || []}
                    onCreateSequence={props.onCreateSequence || (() => {})}
                    onToggleStatus={props.onToggleSequenceStatus || (() => {})}
                />
            )}
            {view === 'vendors' && (
                <VendorView
                    vendors={props.vendors || []}
                    onAddVendor={props.onAddVendor || (() => {})}
                />
            )}
            {view === 'portal' && (
                selectedCompany ? (
                    <ClientPortal
                        company={selectedCompany}
                        projects={props.projects || []}
                        billing={props.billingRecords || []}
                        documents={props.workspaceItems || []}
                        messages={props.messages || []}
                    />
                ) : (
                    <CompanyRequiredState />
                )
            )}
            {view === 'expenses' && (
                <ExpenseView
                    expenses={props.expenses || []}
                    companies={props.companies || []}
                    projects={props.projects || []}
                    onAddExpense={props.onAddExpense || (() => {})}
                />
            )}
            {view === 'compliance' && (
                <ComplianceView
                    items={props.complianceItems || []}
                />
            )}
            {view === 'versions' && (
                <DocVersionsView
                    versions={props.docVersions || []}
                    companies={props.companies || []}
                    onRestore={props.onRestoreVersion || (() => {})}
                />
            )}
        </div>
    );
};

export default ManagementPanel;
