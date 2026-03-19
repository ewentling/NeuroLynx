

export enum Modality {
  TEXT = 'TEXT',
  AUDIO = 'AUDIO',
  IMAGE = 'IMAGE'
}

export type UserRole = 'admin' | 'worker';
export type LicenseStatus = 'checking' | 'valid' | 'invalid' | 'none' | 'offline';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  password?: string; // Mock password
  failedAttempts?: number;
  lockoutUntil?: number; // Timestamp
}

export interface ToolCallLog {
  id: string;
  toolName: string;
  args: any;
  result?: string;
  status?: 'queued' | 'success' | 'error';
  timestamp: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  type: 'text' | 'voice';
  groundingUrls?: Array<{ title: string; uri: string }>;
  toolCalls?: ToolCallLog[];
  clientId?: string;
}

export interface ClientNote {
  id: string;
  clientId: string;
  content: string;
  dateCreated: number;
  author: string;
  status: 'active' | 'inactive';
  lastModified?: number;
  modifiedBy?: string;
}

export interface WorkspaceItem {
  id: string;
  type: 'email' | 'doc' | 'sheet' | 'event' | 'contract' | 'message';
  title: string;
  snippet: string;
  fullContent?: string;
  date: string;
  link: string;
  clientId?: string;
  visualTags?: string[];
  folder?: 'inbox' | 'sent' | 'drafts' | 'archive';
  to?: string;
  from?: string;
  read?: boolean;
  contentData?: string;
  mimeType?: string;
  summary?: string;
}

export interface MemoryEntry {
  id: string;
  key: string;
  value: string;
  timestamp: number;
  clientId?: string;
  createdBy?: string; // User Name
  type?: 'file' | 'text';
  fileName?: string;
}

export interface VectorConfig {
  apiKey: string;
  indexHost: string;
  namespace?: string;
}

export interface Integration {
  id: string;
  service: string;
  name?: string;
  icon: string;
  category: 'social' | 'productivity' | 'crm' | 'marketing';
  status: 'connected' | 'disconnected';
  clientId?: string;
  lastUsed?: string;
  latency?: number;
  lastSync?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  target: string;
  timestamp: number;
  details?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: number;
  link?: string;
}

export interface TestResult {
  id: string;
  name: string;
  status: 'pass' | 'fail' | 'warn' | 'pending' | 'running' | 'warning';
  message: string;
  category: 'Security' | 'AI' | 'Database' | 'System' | 'Browser' | 'Analytics' | 'Automation' | 'Config' | 'Storage' | 'Network' | string;
  timestamp: number;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  clientId?: string;
  dueDate?: string;
  startDate?: string;
  assignedTo?: string; // User ID
  tags?: string[];
  source?: 'manual' | 'meeting' | 'email' | 'ai';
  recurring?: boolean;
  recurringInterval?: 'daily' | 'weekly' | 'monthly';
  dealId?: string;
}

export interface BattleCard {
  id: string;
  trigger: string;
  title: string;
  content: string;
  sourceUrl?: string;
  confidence: number;
}

export interface Meeting {
  id: string;
  title: string;
  date: number;
  duration: number;
  audioUrl?: string;
  transcript: string;
  summary: string;
  status: 'processing' | 'completed' | 'scheduled';
  clientId?: string;
  actionItems?: string[];
  recommendations?: string[];
  sentiment?: 'positive' | 'neutral' | 'negative';
  chatHistory?: Message[];
  time?: string;
  type?: 'video' | 'phone' | 'in_person';
  link?: string;
  attendees?: string[];
}

export interface Company {
  id: string;
  name: string;
  address: string;
  phone: string;
  website?: string;
  industry?: string;
  status: 'active' | 'inactive' | 'lead';
  revenue: number;
  leadScore?: number; // 0-100
  leadSource?: LeadSource;
  coordinates?: { lat: number; lng: number };
  isInternal?: boolean; // True for internal organization entry
}

export interface Client { // Represents a Contact Person
  id: string;
  companyId: string; // Link to Company
  name: string;
  role: string; // Position
  email: string;
  phone: string;
  cellPhone?: string;
  status: 'active' | 'inactive';
  avatarColor: string;
  notes: string;
  lastContactDate: string;
  nextActionDate: string;
  socialLinkedin?: string;
}

export interface Template {
  id: string;
  title: string;
  category: 'contract' | 'email' | 'agenda' | 'proposal';
  content: string;
  variables: string[];
}

export interface QuickLink {
  id: string;
  title: string;
  icon: string;
  action: string;
  color: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  category: 'service' | 'software' | 'hardware';
  billingTiming: 'immediate' | 'net_term';
  status: 'active' | 'inactive'; // Added Status
  recurringInterval?: 'one_time' | 'monthly' | 'yearly'; // New Field
}

export interface ProductRecommendation {
  id: string;
  companyId: string;
  productId: string;
  benefitScore: number; // 0-100 percentage
  reasoning: string;
  dataPoints: string[]; // What data influenced this recommendation
  status: 'pending' | 'accepted' | 'dismissed' | 'converted';
  createdAt: string;
  updatedAt: string;
}

export interface ContractItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  billingTiming?: 'immediate' | 'net_term';
}

export interface Contract {
  id: string;
  companyId: string; // Contracts belong to Company
  title: string;
  status: 'quote' | 'draft' | 'active' | 'terminated';
  items: ContractItem[];
  totalValue: number;
  discount?: number;
  tax?: number; // Added Tax field
  terms?: string;
  dateCreated: string;
  startDate?: string;
  endDate?: string;
  paymentTerms: 'immediate' | 'net15' | 'net30' | 'net60';
}

export interface BillingRecord {
  id: string;
  clientId: string; // Can be companyId
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  breakdown: string;
}

export type DealStage = 'qualification' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';

export interface Deal {
  id: string;
  title: string;
  companyId: string;
  value: number;
  stage: DealStage;
  probability: number; // 0-100
  expectedCloseDate: string;
  ownerId?: string;
  notes?: string;
  lossReason?: string;
  lastUpdated: string; // ISO Date
  createdAt?: string; // ISO Date - when deal was created
  isArchived?: boolean; // Soft delete flag
}

// Pipeline filter options
export interface DealFilters {
  search?: string;
  stages?: DealStage[];
  minValue?: number;
  maxValue?: number;
  dateFrom?: string;
  dateTo?: string;
  ownerId?: string;
  showArchived?: boolean;
}

export type AutomationEvent = 'DEAL_WON' | 'CONTRACT_CREATED' | 'CLIENT_ADDED';

export interface AutomationRule {
  id: string;
  name: string;
  event: AutomationEvent;
  webhookUrl: string;
  active: boolean;
  lastTriggered?: number;
}

export interface ChartData {
  name: string;
  value: number;
}

// --- Feature 1: Activity Timeline ---
export interface ActivityEntry {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'deal_update' | 'task';
  title: string;
  description: string;
  companyId?: string;
  clientId?: string;
  userId: string;
  timestamp: number;
}

// --- Feature 3: Support Tickets ---
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';
export type TicketStatus = 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed';

export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  companyId: string;
  reportedBy: string;
  assignedTo?: string;
  priority: TicketPriority;
  status: TicketStatus;
  slaDeadline: number; // timestamp
  createdAt: number;
  resolvedAt?: number;
  category: 'bug' | 'feature_request' | 'access' | 'infrastructure' | 'consulting' | 'other';
}

// --- Feature 5: Onboarding Checklist ---
export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  completedBy?: string;
  completedAt?: number;
}

export interface OnboardingChecklist {
  id: string;
  companyId: string;
  items: ChecklistItem[];
  createdAt: number;
  status: 'active' | 'completed';
}

// --- Feature 7: Project Tracker ---
export type ProjectPhase = 'discovery' | 'design' | 'build' | 'test' | 'deploy' | 'completed';

export interface ProjectMilestone {
  id: string;
  title: string;
  phase: ProjectPhase;
  dueDate?: string;
  completed: boolean;
}

export interface Project {
  id: string;
  name: string;
  companyId: string;
  status: 'active' | 'on_hold' | 'completed';
  phase: ProjectPhase;
  milestones: ProjectMilestone[];
  startDate: string;
  targetEndDate?: string;
  budget?: number;
  description?: string;
}

// --- Feature 8: Referral Tracking ---
export type LeadSource = 'referral' | 'website' | 'cold_outreach' | 'event' | 'social_media' | 'partner' | 'other';

export interface Referral {
  id: string;
  referrerCompanyId?: string;
  referrerName: string;
  referredCompanyId: string;
  date: string;
  dealValue?: number;
  status: 'pending' | 'converted' | 'lost';
}

// --- Feature 9: KPI Goals ---
export interface KPIGoal {
  id: string;
  label: string;
  metric: 'revenue' | 'new_clients' | 'meetings_held' | 'contracts_signed' | 'deals_won' | 'tickets_resolved';
  target: number;
  current: number;
  period: 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
}

// --- Feature 10: Quick Quotes ---
export interface QuoteLineItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Quote {
  id: string;
  companyId: string;
  title: string;
  items: QuoteLineItem[];
  discount: number;
  totalValue: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  validUntil: string;
  createdAt: string;
  notes?: string;
}

// ====== ROUND 2 FEATURES ======

// --- R2-1: Time Tracking ---
export interface TimeEntry {
  id: string;
  userId: string;
  companyId?: string;
  projectId?: string;
  description: string;
  date: string;
  hours: number;
  billable: boolean;
  rate?: number;
}

// --- R2-2: Competitor Battle Cards ---
export interface Competitor {
  id: string;
  name: string;
  website?: string;
  strengths: string[];
  weaknesses: string[];
  differentiators: string[];
  commonObjections: string[];
  pricingNotes?: string;
  lastUpdated: string;
}

// --- R2-3: CSAT Surveys ---
export interface CSATResponse {
  id: string;
  companyId: string;
  respondentName: string;
  score: number; // 1-10
  feedback?: string;
  date: string;
  projectId?: string;
}

// --- R2-4: Email Sequences ---
export interface SequenceStep {
  id: string;
  subject: string;
  body: string;
  delayDays: number;
  order: number;
}

export interface EmailSequence {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'draft';
  steps: SequenceStep[];
  enrolledCount: number;
  completedCount: number;
  createdAt: string;
}

// --- R2-6: Vendor Management ---
export interface Vendor {
  id: string;
  name: string;
  contactEmail: string;
  phone?: string;
  skills: string[];
  hourlyRate: number;
  rating: number; // 1-5
  status: 'active' | 'inactive' | 'preferred';
  certifications?: string[];
  notes?: string;
}

// --- R2-7: Document Version Control ---
export interface DocVersion {
  id: string;
  documentId: string;
  documentTitle: string;
  version: number;
  author: string;
  timestamp: number;
  changeNotes: string;
  companyId?: string;
}

// --- R2-9: Expense Tracker ---
export type ExpenseCategory = 'software' | 'travel' | 'equipment' | 'training' | 'hosting' | 'subcontractor' | 'office' | 'other';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  companyId?: string;
  projectId?: string;
  receipt?: boolean;
  approvedBy?: string;
  status: 'pending' | 'approved' | 'rejected';
}

// --- R2-10: Compliance Checklist ---
export interface ComplianceItem {
  id: string;
  framework: 'SOC2' | 'HIPAA' | 'GDPR' | 'ISO27001' | 'PCI-DSS' | 'NIST';
  control: string;
  description: string;
  status: 'compliant' | 'in_progress' | 'non_compliant' | 'not_applicable';
  dueDate?: string;
  assignedTo?: string;
  evidenceLink?: string;
  lastAuditDate?: string;
}

// ====== ROUND 3 FEATURES ======

// --- R3-1: Invoice Builder ---
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'void';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  companyId: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: InvoiceStatus;
  notes?: string;
}

// --- R3-2: Client Org Chart ---
export interface OrgContact {
  id: string;
  companyId: string;
  name: string;
  title: string;
  reportsToId?: string; // Id of the manager
  email?: string;
  phone?: string;
  department?: string;
  isDecisionMaker: boolean;
}

// --- R3-3: E-Signature Tracker ---
export interface EsignRequest {
  id: string;
  documentTitle: string;
  companyId: string;
  sentDate: string;
  signerEmail: string;
  status: 'draft' | 'sent' | 'viewed' | 'signed' | 'declined';
  completedDate?: string;
}

// --- R3-6: IT Asset Tracker ---
export type AssetType = 'laptop' | 'server' | 'mobile' | 'license' | 'networking' | 'other';

export interface Asset {
  id: string;
  companyId: string;
  name: string;
  type: AssetType;
  serialNumber?: string;
  purchaseDate?: string;
  value?: number;
  assignedTo?: string; // User/Contact Name
  status: 'active' | 'deployed' | 'maintenance' | 'retired';
  notes?: string; // General notes for any asset
  // License-specific fields
  licenseKey?: string;
  expirationDate?: string;
}

// --- R3-7: Client Feedback / Roadmap ---
export interface FeatureRequest {
  id: string;
  companyId: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'backlog' | 'planned' | 'in_progress' | 'shipped' | 'closed';
  voteCount: number;
  createdAt: string;
}

// --- R3-8: Knowledge Base / Wiki ---
export interface WikiPage {
  id: string;
  title: string;
  content: string; // Markdown
  category: 'sop' | 'technical' | 'client_specific' | 'internal';
  companyId?: string;
  author: string;
  lastModified: string;
}

// --- R3-9: Partner & Affiliate ---
export interface Partner {
  id: string;
  name: string;
  type: 'technology' | 'referral' | 'reseller' | 'implementation';
  commissionRate: number; // percentage
  contactName: string;
  contactEmail: string;
  totalReferrals: number;
  totalPayout: number;
  status: 'active' | 'inactive';
}

// --- R3-10: Custom Fields ---
export interface CustomField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'dropdown';
  options?: string[]; // For dropdown
  entity: 'company' | 'deal' | 'contact' | 'project';
}

export interface CustomFieldValue {
  fieldId: string;
  entityId: string;
  value: any;
}
