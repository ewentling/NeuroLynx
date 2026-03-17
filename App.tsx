import React, { useState, useEffect, useRef, useCallback, useMemo, Suspense } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import * as pdfjsLib from 'pdfjs-dist';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import JSZip from 'jszip';
import confetti from 'canvas-confetti';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Search, Calendar as CalendarIcon, Users, FileText, Settings, Bell, LogOut, Plus, Upload, Download, Mic, MicOff, Play, Pause, ChevronLeft, ChevronRight, X, Check, AlertCircle, Clock, Tag, Briefcase, DollarSign, TrendingUp, Activity, Mail, Phone, MapPin, Globe, Linkedin, Trash2, Edit2, Save, MoreVertical, Filter, ArrowUpRight, Copy, Share2, Printer, Eye, EyeOff, Lock, Unlock, Shield, ShieldAlert, ShieldCheck, Database, Server, Cpu, HardDrive, Wifi, WifiOff, Battery, BatteryCharging, BatteryFull, BatteryLow, BatteryMedium, BatteryWarning, Bluetooth, BluetoothConnected, BluetoothOff, BluetoothSearching, Cast, Cloud, CloudDrizzle, CloudLightning, CloudOff, CloudRain, CloudSnow, CloudSun, Command, Compass, Copyleft, Copyright, CornerDownLeft, CornerDownRight, CornerLeftDown, CornerLeftUp, CornerRightDown, CornerRightUp, CornerUpLeft, CornerUpRight, CreditCard, Crop, Crosshair, DatabaseBackup, Disc, Divide, DivideCircle, DivideSquare, DownloadCloud, Dribbble, Droplet, Edit, Edit3, ExternalLink, EyeOff as EyeOffIcon, Facebook, FastForward, Feather, Figma, File, FileMinus, FilePlus, FileText as FileTextIcon, Film, Filter as FilterIcon, Flag, Folder, FolderMinus, FolderPlus, Framer, Frown, Gift, GitBranch, GitCommit, GitMerge, GitPullRequest, Github, Gitlab, Globe as GlobeIcon, Grid, HardDrive as HardDriveIcon, Hash, Headphones, Heart, HelpCircle, Hexagon, Home, Image, Inbox, Info, Instagram, Italic, Key, Layers, Layout, LifeBuoy, Link, Link2, Linkedin as LinkedinIcon, List, Loader, Lock as LockIcon, LogIn, LogOut as LogOutIcon, Mail as MailIcon, MapPin as MapPinIcon, Maximize, Maximize2, Meh, Menu, MessageCircle, MessageSquare, Mic as MicIcon, MicOff as MicOffIcon, Minimize, Minimize2, Minus, MinusCircle, MinusSquare, Monitor, Moon, MoreHorizontal, MoreVertical as MoreVerticalIcon, MousePointer, Move, Music, Navigation, Navigation2, Octagon, Package, Paperclip, Pause as PauseIcon, PauseCircle, PenTool, Percent, Phone as PhoneIcon, PhoneCall, PhoneForwarded, PhoneIncoming, PhoneMissed, PhoneOff, PhoneOutgoing, PieChart as PieChartIcon, Play as PlayIcon, PlayCircle, Plus as PlusIcon, PlusCircle, PlusSquare, Pocket, Power, Printer as PrinterIcon, Radio, RefreshCcw, RefreshCw, Repeat, Rewind, RotateCcw, RotateCw, Rss, Save as SaveIcon, Scissors, Search as SearchIcon, Send, Server as ServerIcon, Settings as SettingsIcon, Share, Share2 as Share2Icon, Shield as ShieldIcon, ShieldOff, ShoppingBag, ShoppingCart, Shuffle, Sidebar, SkipBack, SkipForward, Slack, Slash, Sliders, Smartphone, Smile, Speaker, Square, Star, StopCircle, Sun, Sunrise, Sunset, Tablet, Tag as TagIcon, Target, Terminal, Thermometer, ThumbsDown, ThumbsUp, ToggleLeft, ToggleRight, Trash, Trash2 as Trash2Icon, Trello, TrendingDown, TrendingUp as TrendingUpIcon, Triangle, Truck, Tv, Twitch, Twitter, Type, Umbrella, Underline, Unlock as UnlockIcon, Upload as UploadIcon, UploadCloud, User as UserIcon, UserCheck, UserMinus, UserPlus, UserX, Users as UsersIcon, Video, VideoOff, Voicemail, Volume, Volume1, Volume2, VolumeX, Watch, Wifi as WifiIcon, WifiOff as WifiOffIcon, Wind, X as XIcon, XCircle, XOctagon, XSquare, Youtube, Zap, ZapOff, ZoomIn, ZoomOut, Sparkles, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issue
// @ts-ignore
import icon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

import { Message, WorkspaceItem, MemoryEntry, Integration, Toast, ToolCallLog, Meeting, Client, Template, QuickLink, Product, Contract, ContractItem, Task, ClientNote, BattleCard, User, BillingRecord, Company, LicenseStatus, Deal, DealStage, AutomationRule, AutomationEvent, AuditLog, Notification, TestResult, ActivityEntry, SupportTicket, OnboardingChecklist, Project, Referral, KPIGoal, Quote, TimeEntry, Competitor, CSATResponse, EmailSequence, SequenceStep, Vendor, DocVersion, Expense, ComplianceItem, Invoice, OrgContact, EsignRequest, Asset, FeatureRequest, WikiPage, Partner, CustomField, CustomFieldValue } from './types';
import { MOCK_WORKSPACE_DATA, MOCK_CLIENTS, MOCK_TEMPLATES, DEFAULT_QUICK_LINKS, MOCK_PRODUCTS, MOCK_CONTRACTS, SYSTEM_INSTRUCTION, MOCK_INTEGRATIONS, PLATFORM_OPTIONS, MOCK_MEETINGS, MOCK_TASKS, HELP_DOCS, MOCK_CLIENT_NOTES, MOCK_USERS, MOCK_COMPANIES, POPULAR_LLMS, APP_FEATURES, MOCK_DEALS, MOCK_AUDIT_LOGS, MOCK_NOTIFICATIONS, MOCK_ACTIVITIES, MOCK_TICKETS, DEFAULT_ONBOARDING_STEPS, MOCK_PROJECTS, MOCK_REFERRALS, MOCK_KPI_GOALS, MOCK_TIME_ENTRIES, MOCK_COMPETITORS, MOCK_CSAT, MOCK_SEQUENCES, MOCK_VENDORS, MOCK_DOC_VERSIONS, MOCK_EXPENSES, MOCK_COMPLIANCE, MOCK_INVOICES, MOCK_ORG_CONTACTS, MOCK_ESIGN_REQUESTS, MOCK_ASSETS, MOCK_FEATURE_REQUESTS, MOCK_WIKI_PAGES, MOCK_PARTNERS, MOCK_CUSTOM_FIELDS } from './constants';
import { NeuroLynxService } from './services/geminiService';
import { transcribeAudio } from './services/openaiService';
import { extractTextFromPDF, configurePdfWorker } from './services/pdfService';
import { GoogleWorkspaceService } from './services/googleService';
import { VectorService } from './services/vectorService';
import { CryptoService } from './services/cryptoService';
import { TestService } from './services/testService';
import { LicenseService } from './services/licenseService';
import { calculateClientHealth } from './services/analyticsService';
import { processAutomationTrigger } from './services/automationService';
import { useAudio, encode, decode, decodeAudioData } from './hooks/useAudio';
import { OfflineService } from './services/offlineService';
import { EsignService } from './services/esignService';
import { VoiceService } from './services/voiceService';
import { VisualizationService } from './services/vizService';

import LicenseScreen from './components/LicenseScreen';
import LoginScreen from './components/LoginScreen';
import ContractBuilder from './components/ContractBuilder';
import ManagementPanel from './components/ManagementPanel';
import HomeView from './components/HomeView';
import ClientsView from './components/ClientsView';
import TasksView from './components/TasksView';
import CalendarView from './components/CalendarView';
import CommunicationsView from './components/CommunicationsView';
import MemoryView from './components/MemoryView';
import UsersView from './components/UsersView';
import HelpView from './components/HelpView';
import SalesLeaderboard from './components/SalesLeaderboard';
import ActivityTimeline from './components/ActivityTimeline';
import ForecastView from './components/ForecastView';
import TicketView from './components/TicketView';
import AlertsPanel from './components/AlertsPanel';
import OnboardingView from './components/OnboardingView';
import WinLossView from './components/WinLossView';
import ProjectsView from './components/ProjectsView';
import ReferralView from './components/ReferralView';
import KPIView from './components/KPIView';
import QuoteBuilder from './components/QuoteBuilder';
import TimeTracker from './components/TimeTracker';
import CompetitorView from './components/CompetitorView';
import CSATView from './components/CSATView';
import SequenceView from './components/SequenceView';
import UtilizationView from './components/UtilizationView';
import VendorView from './components/VendorView';
import DocVersionsView from './components/DocVersionsView';
import ClientPortal from './components/ClientPortal';
import ExpenseView from './components/ExpenseView';
import ComplianceView from './components/ComplianceView';
import InvoiceBuilder from './components/InvoiceBuilder';
import OrgChartView from './components/OrgChartView';
import EsignTracker from './components/EsignTracker';
import ProfitabilityView from './components/ProfitabilityView';
import VelocityView from './components/VelocityView';
import AssetTracker from './components/AssetTracker';
import RoadmapView from './components/RoadmapView';
import WikiView from './components/WikiView';
import PartnerView from './components/PartnerView';
import MetadataManager from './components/MetadataManager';

configurePdfWorker();

const SCRATCHPAD_AUTOSAVE_DELAY_MS = 400;
const SidebarItem = React.memo(({ active, icon, label, onClick }: { active: boolean, icon: string, label: string, onClick: () => void }) => (
    <button onClick={onClick} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group relative overflow-hidden flex-shrink-0 ${active ? 'glass-card border-orange-500/30 text-orange-400 glow-orange' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}>
        {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-400 to-orange-600 shadow-[0_0_15px_rgba(249,115,22,0.6)]"></div>}
        <div className={`w-8 flex items-center justify-center transition-transform group-hover:scale-110 ${active ? 'text-orange-400' : 'text-slate-500 group-hover:text-cyan-400'}`}>
            <i className={`fas ${icon} text-lg`}></i>
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] flex-1 text-left line-clamp-1">{label}</span>
        {!active && <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />}
    </button>
));

const SidebarSubItem = React.memo(({ active, label, onClick }: { active: boolean, label: string, onClick: () => void }) => (
    <button onClick={onClick} className={`w-full text-left py-2.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ml-2 flex-shrink-0 ${active ? 'text-cyan-400 bg-cyan-400/5 border-l-2 border-cyan-400' : 'text-slate-500 hover:text-slate-300 border-l-2 border-transparent hover:border-slate-700 hover:bg-white/5'}`}>
        {label}
    </button>
));

const SidebarGroupToggle = React.memo(({ isOpen, label, onClick }: { isOpen: boolean, label: string, onClick: () => void }) => (
    <button onClick={onClick} className="w-full flex justify-between items-center py-2 px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider hover:text-slate-300 transition-colors mt-2 flex-shrink-0">
        <span>{label}</span>
        <i className={`fas fa-chevron-right transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}></i>
    </button>
));

const SimpleMarkdown = React.memo(({ content }: { content: string }) => {
    if (!content) return null;
    const lines = content.split('\n');
    return (
        <div className="space-y-3">
            {lines.map((line, idx) => {
                const trimmed = line.trim();
                if (trimmed.startsWith('### ')) return <h3 key={idx} className="text-lg font-bold mt-4 mb-2 text-inherit">{trimmed.replace('### ', '')}</h3>;
                if (trimmed.startsWith('#### ')) return <h4 key={idx} className="text-md font-bold text-orange-400 mt-3 mb-1">{trimmed.replace('#### ', '')}</h4>;
                if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                    return <div key={idx} className="flex gap-2 ml-2 opacity-90"><span className="text-orange-500">•</span><span>{trimmed.replace(/^[-*] /, '')}</span></div>;
                }
                const parts = line.split(/(\*\*.*?\*\*)/g);
                return (
                    <p key={idx} className="opacity-90 leading-relaxed text-sm min-h-[1em] text-inherit">
                        {parts.map((part, i) => {
                            if (part.startsWith('**') && part.endsWith('**')) return <strong key={i} className="font-bold opacity-100">{part.slice(2, -2)}</strong>;
                            return <span key={i} >{part}</span>;
                        })}
                    </p>
                );
            })}
        </div>
    );
});

const Skeleton = ({ className }: { className?: string }) => (
    <div className={`animate-pulse bg-slate-800/50 rounded-lg ${className}`}></div>
);

const KeyboardShortcuts = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => (
    <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="glass-card w-full max-w-2xl p-8 rounded-3xl border-white/10 shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-8">
                        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
                    </div>
                    <div className="text-2xl font-black uppercase tracking-widest neuro-text-gradient mb-8">Command Center Shortcuts</div>
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="text-[10px] font-black text-orange-400 uppercase tracking-widest border-b border-orange-500/20 pb-2">Navigation</div>
                            <div className="flex justify-between items-center text-sm font-bold"><span className="text-slate-400">Search / Commands</span><kbd className="px-2 py-1 bg-slate-800 rounded border border-white/10 text-[10px]">Ctrl + K</kbd></div>
                            <div className="flex justify-between items-center text-sm font-bold"><span className="text-slate-400">Quick Actions</span><kbd className="px-2 py-1 bg-slate-800 rounded border border-white/10 text-[10px]">Alt + Q</kbd></div>
                            <div className="flex justify-between items-center text-sm font-bold"><span className="text-slate-400">Shortcuts Help</span><kbd className="px-2 py-1 bg-slate-800 rounded border border-white/10 text-[10px]">Ctrl + /</kbd></div>
                        </div>
                        <div className="space-y-4">
                            <div className="text-[10px] font-black text-cyan-400 uppercase tracking-widest border-b border-cyan-500/20 pb-2">Voice & Input</div>
                            <div className="flex justify-between items-center text-sm font-bold"><span className="text-slate-400">Voice Transcribe</span><kbd className="px-2 py-1 bg-slate-800 rounded border border-white/10 text-[10px]">Hold Alt</kbd></div>
                            <div className="flex justify-between items-center text-sm font-bold"><span className="text-slate-400">Focus Mode</span><kbd className="px-2 py-1 bg-slate-800 rounded border border-white/10 text-[10px]">Ctrl + F</kbd></div>
                            <div className="flex justify-between items-center text-sm font-bold"><span className="text-slate-400">Toggle Theme</span><kbd className="px-2 py-1 bg-slate-800 rounded border border-white/10 text-[10px]">Ctrl + D</kbd></div>
                        </div>
                    </div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
);

const EmptyState = ({ icon, title, description, actionLabel, onAction }: { icon: string, title: string, description: string, actionLabel?: string, onAction?: () => void }) => (
    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-700">
        <div className="w-24 h-24 rounded-full bg-slate-800/50 flex items-center justify-center mb-6 relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <i className={`fas ${icon} text-4xl text-slate-600 group-hover:text-orange-400 transition-colors`}></i>
        </div>
        <h3 className="text-xl font-extrabold text-slate-200 mb-2 uppercase tracking-widest">{title}</h3>
        <p className="text-slate-500 max-w-sm mb-8 leading-relaxed font-medium">{description}</p>
        {actionLabel && (
            <button
                onClick={onAction}
                className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all hover:border-orange-500/50 hover:text-orange-400 flex items-center gap-2"
            >
                <i className="fas fa-plus"></i> {actionLabel}
            </button>
        )}
    </div>
);

const Breadcrumbs = ({ view, companyName }: { view: string, companyName?: string }) => (
    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">
        <Home className="w-3 h-3" />
        <span className="hover:text-slate-300 cursor-pointer" onClick={() => window.dispatchEvent(new CustomEvent('nav', { detail: 'home' }))}>Dashboard</span>
        <ChevronRight className="w-3 h-3 opacity-30" />
        <span className={`${!companyName ? 'text-orange-400' : 'hover:text-slate-300 cursor-pointer'}`}>{view}</span>
        {companyName && (
            <>
                <ChevronRight className="w-3 h-3 opacity-30" />
                <span className="text-orange-400">{companyName}</span>
            </>
        )}
    </div>
);

// Side navigation components moved to components folder soon...


const CommandPalette = ({ isOpen, onClose, onCommand, isVoiceMode, onToggleVoice, isRecording, isQuickActionOpen, onToggleQuickAction }: { isOpen: boolean, onClose: () => void, onCommand: (cmd: string) => void, isVoiceMode: boolean, onToggleVoice: (v: boolean) => void, isRecording: boolean, isQuickActionOpen: boolean, onToggleQuickAction: (v: boolean) => void }) => {
    const [input, setInput] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[300] flex items-start justify-center pt-[20vh]" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="w-full max-w-2xl glass-card rounded-3xl overflow-hidden border-white/10"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center p-6 border-b border-white/5 bg-white/5">
                    {isRecording ? (
                        <div className="flex items-center gap-3 mr-3">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Listening...</span>
                        </div>
                    ) : (
                        <Search className="text-slate-400 mr-4 w-5 h-5" />
                    )}
                    <input
                        ref={inputRef}
                        className="flex-1 bg-transparent outline-none text-xl text-white placeholder-slate-500 font-medium"
                        placeholder={isVoiceMode ? "Speak now (Hold ALT)..." : "Search everything or type /command..."}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter') {
                                onCommand(input);
                                setInput('');
                            }
                            if (e.key === 'Escape') onClose();
                        }}
                    />
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => onToggleVoice(!isVoiceMode)} className={`p-2 rounded-xl border transition-all relative group ${isVoiceMode ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400 glow-cyan' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}>
                            {isVoiceMode ? <Mic className="w-4 h-4 fill-current" /> : <MicOff className="w-4 h-4" />}
                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-800 text-[10px] px-2 py-1 rounded border border-white/10 whitespace-nowrap z-50">Voice Mode (Alt+V)</div>
                        </button>
                        <button onClick={() => onToggleQuickAction(!isQuickActionOpen)} className="p-2 rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-500/20 hover:bg-orange-400 transition-all relative group">
                            <Plus className="w-4 h-4" />
                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-800 text-[10px] px-2 py-1 rounded border border-white/10 whitespace-nowrap z-50">Quick Add (Alt+Q)</div>
                        </button>
                    </div>
                </div>
                <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
                    <div className="text-[10px] font-black text-slate-500 uppercase px-2 mb-2 tracking-[0.2em]">Quick Navigation</div>
                    {[
                        { cmd: '> create deal', icon: Plus, label: 'Create New Deal', color: 'text-orange-500' },
                        { cmd: '> go home', icon: Home, label: 'Go to Dashboard', color: 'text-cyan-500' },
                        { cmd: '> set focus', icon: Target, label: 'Toggle Focus Mode', color: 'text-purple-500' },
                        { cmd: '> theme toggle', icon: Moon, label: 'Switch Dark/Light', color: 'text-yellow-500' },
                    ].map((item, i) => (
                        <button
                            key={i}
                            onClick={() => { onCommand(item.cmd); onClose(); }}
                            className="w-full text-left px-4 py-3 hover:bg-white/5 rounded-2xl flex items-center justify-between group transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-xl bg-slate-800 border border-white/5 ${item.color} group-hover:scale-110 transition-transform`}>
                                    <item.icon className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{item.label}</span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity uppercase">{item.cmd}</span>
                        </button>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};
const EmptyStateModal = React.memo(({ isOpen, onClose, view, onAction }: { isOpen: boolean, onClose: () => void, view: string, onAction: (action: string) => void }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-lg p-8 glass-card border border-white/10 rounded-3xl shadow-2xl text-center relative"
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
                <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center mx-auto mb-6">
                    <i className="fas fa-ghost text-3xl text-slate-600"></i>
                </div>
                <h3 className="text-xl font-black uppercase tracking-widest text-slate-200 mb-2">No data in {view}</h3>
                <p className="text-sm text-slate-500 mb-8">It looks like this section is currently empty. Start by adding your first record or importing existing data.</p>
                <div className="space-y-3">
                    <button onClick={() => onAction(`add_${view.replace(/s$/, '')}`)} className="w-full py-4 bg-orange-600/20 border border-orange-500/30 rounded-2xl text-[10px] font-black uppercase tracking-widest text-orange-400 hover:bg-orange-600/40 transition-all flex items-center justify-center gap-2">
                        <Plus className="w-3 h-3" /> Create New Record
                    </button>
                    <button onClick={onClose} className="w-full py-4 hover:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400">Dimiss for now</button>
                </div>
            </motion.div>
        </div>
    );
});

const NotificationToast = React.memo(({ type, message, onClose }: { type: 'success' | 'error' | 'info' | 'warning', message: string, onClose: () => void }) => (
    <motion.div
        initial={{ opacity: 0, x: 20, y: 20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`fixed bottom-6 right-6 z-[200] px-6 py-4 rounded-2xl glass-card flex items-center gap-4 border shadow-2xl ${type === 'success' ? 'border-green-500/30' : type === 'error' ? 'border-red-500/30' : 'border-cyan-500/30'}`}
    >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${type === 'success' ? 'bg-green-500/20 text-green-500' : type === 'error' ? 'bg-red-500/20 text-red-500' : 'bg-cyan-500/20 text-cyan-400'}`}>
            {type === 'success' ? <Check className="w-4 h-4" /> : type === 'error' ? <AlertCircle className="w-4 h-4" /> : <Info className="w-4 h-4" />}
        </div>
        <div className="flex-1">
            <div className={`text-[10px] font-black uppercase tracking-widest ${type === 'success' ? 'text-green-500' : type === 'error' ? 'text-red-500' : 'text-cyan-400'}`}>{type}</div>
            <div className="text-xs font-bold text-slate-200">{message}</div>
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
    </motion.div>
));

const NotificationDropdown = ({ isOpen, notifications, onClose, onMarkRead }: { isOpen: boolean, notifications: Notification[], onClose: () => void, onMarkRead: (id: string) => void }) => {
    if (!isOpen) return null;
    return (
        <div className="absolute top-12 right-4 w-80 bg-slate-900 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
            <div className="p-3 border-b border-white/10 flex justify-between items-center">
                <h3 className="font-bold text-sm">Notifications</h3>
                <button onClick={onClose} className="text-slate-500 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 && <div className="p-4 text-center text-slate-500 text-sm">No notifications</div>}
                {notifications.map(n => (
                    <div key={n.id} className={`p-3 border-b border-white/5 hover:bg-white/5 transition-colors ${n.read ? 'opacity-50' : 'bg-blue-500/5'}`}>
                        <div className="flex justify-between items-start mb-1">
                            <div className="font-bold text-xs text-white">{n.title}</div>
                            <div className="text-[10px] text-slate-500">{new Date(n.timestamp).toLocaleTimeString()}</div>
                        </div>
                        <div className="text-xs text-slate-400 mb-2">{n.message}</div>
                        {!n.read && (
                            <button onClick={() => onMarkRead(n.id)} className="text-[10px] text-cyan-400 hover:underline">Mark as Read</button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};




interface ConnectedModel {
    id: string; // unique internal id
    name: string; // e.g. "Google Gemini 3.0 Pro"
    modelId: string; // e.g. "gemini-3-pro" from POPULAR_LLMS
    provider: string;
    apiKey: string;
}

export const App: React.FC = () => {
    const [licenseStatus, setLicenseStatus] = useState<LicenseStatus>('checking');
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [view, setView] = useState<'home' | 'chat' | 'workspace' | 'pipeline' | 'memory' | 'meetings' | 'clients' | 'communications' | 'tasks' | 'calendar' | 'help' | 'users' | 'activity' | 'forecast' | 'tickets' | 'alerts' | 'onboarding' | 'winloss' | 'projects' | 'referrals' | 'kpis' | 'time' | 'competitors' | 'csat' | 'sequences' | 'utilization' | 'vendors' | 'versions' | 'portal' | 'expenses' | 'compliance' | 'invoices' | 'orgchart' | 'esign' | 'profitability' | 'velocity' | 'assets' | 'roadmap' | 'wiki' | 'partners' | 'customfields'>('home');
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [modalData, setModalData] = useState<any>({});
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isVerifyingLogin, setIsVerifyingLogin] = useState(false);
    const [input, setInput] = useState('');
    const [maxUsers, setMaxUsers] = useState<number>(5);

    // Business Settings
    const [businessProfile, setBusinessProfile] = useState({ name: 'NeuroSyntax Media', address: '100 Innovation Drive, Philadelphia, PA 19104', phone: '555-0199', website: 'www.neurosyntax.media' });
    const [configuredModels, setConfiguredModels] = useState<ConnectedModel[]>([{ id: 'default', name: 'Gemini 3.0 Flash (System)', modelId: 'gemini-3-flash-preview', provider: 'Google', apiKey: '' }]);
    const [featureMapping, setFeatureMapping] = useState<{ [key: string]: string }>({ 'chat': 'default', 'meetings': 'default', 'contracts': 'default', 'coding': 'default', 'search': 'default' });
    const [automationRules, setAutomationRules] = useState<AutomationRule[]>([]
    );

    // NEW FEATURES STATE
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);
    const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
    const [searchQuery, setSearchQuery] = useState('');
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
    const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
    const [isLiveMeeting, setIsLiveMeeting] = useState(false);
    const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
    const [isMapView, setIsMapView] = useState(false);
    const [isVoiceMode, setIsVoiceMode] = useState(false);
    const [isPTTActive, setIsPTTActive] = useState(false);
    const voiceService = useRef<VoiceService>(new VoiceService());
    const lynxService = useRef<NeuroLynxService>(new NeuroLynxService());
    const licenseService = useRef<LicenseService>(new LicenseService());
    const testService = useRef<TestService>(new TestService());
    const cryptoService = useRef<CryptoService>(new CryptoService());
    const chatEndRef = useRef<HTMLDivElement>(null);
    const { isRecording, startRecording, stopRecording, startFileRecording, stopFileRecording } = useAudio();

    // NEW IMPROVEMENTS STATE
    const [scratchpad, setScratchpad] = useState(localStorage.getItem('neurolynx_scratchpad') || '');
    const [scratchpadSavedAt, setScratchpadSavedAt] = useState<number | null>(() => {
        const savedTs = localStorage.getItem('neurolynx_scratchpad_ts');
        return savedTs ? parseInt(savedTs, 10) : null;
    });
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [draggedDealId, setDraggedDealId] = useState<string | null>(null);
    const [recentItems, setRecentItems] = useState<{ label: string, view: string, timestamp: number }[]>([]);
    const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

    const [newModelSelection, setNewModelSelection] = useState(POPULAR_LLMS[1].id); // Use index 1 (gemini flash preview) as default
    const [newModelKey, setNewModelKey] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [adminPasswordInput, setAdminPasswordInput] = useState('');
    const [selectedExportCompanyId, setSelectedExportCompanyId] = useState<string>('');
    const [isVoiceContinuityEnabled, setIsVoiceContinuityEnabled] = useState(false);
    const [chatMode, setChatMode] = useState<'internal' | 'all' | 'client'>('internal');
    const [chatClientSelection, setChatClientSelection] = useState<string>('');

    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [meetings, setMeetings] = useState<Meeting[]>(MOCK_MEETINGS);
    const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
    const [memories, setMemories] = useState<MemoryEntry[]>(MOCK_WORKSPACE_DATA.map(item => ({ id: item.id, key: item.title, value: item.snippet, timestamp: Date.now(), type: 'text', createdBy: 'user1' })));
    const [messages, setMessages] = useState<Message[]>([]);
    const [documents, setDocuments] = useState<any[]>([]);
    const [selectedCompanyId, setSelectedCompanyId] = useState<string | 'all'>('all');
    const [clientStatusFilter, setClientStatusFilter] = useState<'all' | 'active' | 'inactive' | 'lead'>('all');
    const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(true);
    const [isInternalMgmtOpen, setIsInternalMgmtOpen] = useState(true);
    const [isClientWorkspaceOpen, setIsClientWorkspaceOpen] = useState(true);
    const [isTasksMenuOpen, setIsTasksMenuOpen] = useState(false);
    const [isAnalyticsMenuOpen, setIsAnalyticsMenuOpen] = useState(false);
    const [isBusinessSuiteOpen, setIsBusinessSuiteOpen] = useState(false);
    const [isChatPopupOpen, setIsChatPopupOpen] = useState(false);
    const [workspaceMode, setWorkspaceMode] = useState<'internal' | 'client'>('internal');
    const [internalTab, setInternalTab] = useState<'offerings' | 'team' | 'profile' | 'system' | 'data' | 'automations'>('offerings');
    const [clientWorkspaceTab, setClientWorkspaceTab] = useState<'overview' | 'documents' | 'contracts' | 'billing'>('overview');
    const [taskFilter, setTaskFilter] = useState<'all' | 'my'>('all');
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [editingContractId, setEditingContractId] = useState<string | null>(null);
    const [automations, setAutomations] = useState<AutomationRule[]>(MOCK_INTEGRATIONS.map(i => ({ id: i.id, name: i.name, event: 'DEAL_WON', webhookUrl: '', active: i.status === 'connected' })));
    const [salesPipeline, setSalesPipeline] = useState<any[]>(MOCK_DEALS.map(d => ({ id: d.id, stage: d.stage, value: d.value })));
    const [tickets, setTickets] = useState<SupportTicket[]>(MOCK_TICKETS);
    const [companies, setCompanies] = useState<Company[]>(MOCK_COMPANIES);
    const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
    const [contracts, setContracts] = useState<Contract[]>(MOCK_CONTRACTS);
    const [deals, setDeals] = useState<Deal[]>(MOCK_DEALS);
    const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
    const [workspaceItems, setWorkspaceItems] = useState<WorkspaceItem[]>(MOCK_WORKSPACE_DATA);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isEmptyStateModalOpen, setIsEmptyStateModalOpen] = useState(false);

    // Meeting Detail State
    const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
    const [meetingRecommendationsSelected, setMeetingRecommendationsSelected] = useState<Set<string>>(new Set());
    const [meetingRecommendationDates, setMeetingRecommendationDates] = useState<Record<string, string>>({});

    // Contract Builder State
    const [contractBuilderItems, setContractBuilderItems] = useState<ContractItem[]>([]);
    const [contractBuilderTitle, setContractBuilderTitle] = useState('');
    const [contractStartDate, setContractStartDate] = useState('');
    const [contractEndDate, setContractEndDate] = useState('');
    const [contractPaymentTerms, setContractPaymentTerms] = useState<'immediate' | 'net15' | 'net30' | 'net60'>('net30');
    const [contractTerms, setContractTerms] = useState('');
    const [contractPreviewMode, setContractPreviewMode] = useState(false);
    const [contractDiscount, setContractDiscount] = useState<number>(0);
    const [contractProductSearch, setContractProductSearch] = useState('');
    const [contractTaxRate] = useState(0.06);

    // Diagnostics
    const [testResults, setTestResults] = useState<TestResult[]>([]);

    const [commFolder, setCommFolder] = useState<'inbox' | 'sent' | 'drafts'>('inbox');

    // --- NEW CRM FEATURES STATE ---
    const [activities, setActivities] = useState<ActivityEntry[]>(MOCK_ACTIVITIES);
    const [billingRecords, setBillingRecords] = useState<BillingRecord[]>([]);
    const [onboardingChecklists, setOnboardingChecklists] = useState<OnboardingChecklist[]>([]);
    const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
    const [referrals, setReferrals] = useState<Referral[]>(MOCK_REFERRALS);
    const [kpiGoals, setKpiGoals] = useState<KPIGoal[]>(MOCK_KPI_GOALS);
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [showQuoteBuilder, setShowQuoteBuilder] = useState(false);

    // --- ROUND 2 FEATURES STATE ---
    const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(MOCK_TIME_ENTRIES);
    const [competitors, setCompetitors] = useState<Competitor[]>(MOCK_COMPETITORS);
    const [csatResponses, setCsatResponses] = useState<CSATResponse[]>(MOCK_CSAT);
    const [emailSequences, setEmailSequences] = useState<EmailSequence[]>(MOCK_SEQUENCES);
    const [vendors, setVendors] = useState<Vendor[]>(MOCK_VENDORS);
    const [docVersions, setDocVersions] = useState<DocVersion[]>(MOCK_DOC_VERSIONS);
    const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES);
    const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>(MOCK_COMPLIANCE);

    // --- ROUND 3 FEATURES STATE ---
    const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
    const [orgContacts, setOrgContacts] = useState<OrgContact[]>(MOCK_ORG_CONTACTS);
    const [esignRequests, setEsignRequests] = useState<EsignRequest[]>(MOCK_ESIGN_REQUESTS);
    const [assets, setAssets] = useState<Asset[]>(MOCK_ASSETS);
    const [featureRequests, setFeatureRequests] = useState<FeatureRequest[]>(MOCK_FEATURE_REQUESTS);
    const [wikiPages, setWikiPages] = useState<WikiPage[]>(MOCK_WIKI_PAGES);
    const [partners, setPartners] = useState<Partner[]>(MOCK_PARTNERS);
    const [customFields, setCustomFields] = useState<CustomField[]>(MOCK_CUSTOM_FIELDS);
    const [customValues, setCustomValues] = useState<CustomFieldValue[]>([]);

    const offerings = MOCK_PRODUCTS;
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const TOOL_CALL_LOG_LIMIT = 50;
    // Transient MCP/tool call log buffer for future backend/diagnostics fan-out.
    // Not rendered; capped to prevent unbounded growth in long sessions.
    const [toolCalls, setToolCalls] = useState<ToolCallLog[]>([]);

    useEffect(() => {
        const checkLicense = async () => {
            try {
                const storedKey = await licenseService.current.getStoredLicense();
                if (storedKey) {
                    setLicenseStatus('checking');
                    const result = await licenseService.current.validateLicense(storedKey);
                    if (result.valid) {
                        setLicenseStatus('valid');
                        setMaxUsers(result.allowedUsers);
                    } else if (result.offline) {
                        setLicenseStatus('offline');
                    } else {
                        licenseService.current.clearLicense();
                        setLicenseStatus('invalid');
                    }
                } else {
                    setLicenseStatus('none');
                }
            } catch (e) {
                setLicenseStatus('offline');
            }
        };
        checkLicense();
    }, []);

    const handleActivation = async (rawKey: string) => {
        setLicenseStatus('checking');
        try {
            const result = await licenseService.current.validateLicense(rawKey);
            if (result.offline) {
                setLicenseStatus('offline');
                addToast('error', 'Connection failed. Please check internet.');
            } else if (result.valid) {
                await licenseService.current.saveLicense(rawKey);
                setLicenseStatus('valid');
                setMaxUsers(result.allowedUsers);
                addToast('success', 'System Activated Successfully');
            } else {
                setLicenseStatus('invalid');
            }
        } catch (e) {
            console.error('Activation error', e);
            setLicenseStatus('offline');
            addToast('error', 'Activation failed. Please try again.');
        }
    };

    const handleClearLicense = () => { licenseService.current.clearLicense(); setLicenseStatus('none'); setCurrentUser(null); };

    const handleUpdateTask = (updatedTask: Task) => {
        setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
        addToast('success', 'Task Updated');
    };

    const handleMoveTask = (taskId: string, status: any) => {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            handleUpdateTask({ ...task, status });
        }
    };

    const deleteAutomation = (id: string) => {
        setAutomations(prev => prev.filter(a => a.id !== id));
        addToast('success', 'Automation Removed');
    };

    const toggleAutomation = (id: string) => {
        setAutomations(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
        addToast('info', 'Automation Updated');
    };

    const deleteContract = (id: string) => {
        setContracts(prev => prev.filter(c => c.id !== id));
        addToast('success', 'Contract Deleted');
    };

    const updateDocument = (id: string, updates: any) => {
        setDocuments(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
    };

    const deleteDocument = (id: string) => {
        setDocuments(prev => prev.filter(d => d.id !== id));
        addToast('success', 'Document Deleted');
    };

    const handleUserLogin = (user: User) => {
        setCurrentUser(user);
    };

    useEffect(() => {
        lynxService.current = new NeuroLynxService();
        const savedProfile = localStorage.getItem('neurolynx_biz_profile'); if (savedProfile) setBusinessProfile(JSON.parse(savedProfile));

        const loadEncryptedData = async () => {
            const savedModels = localStorage.getItem('neurolynx_models');
            if (savedModels) {
                const decrypted = await cryptoService.current.decrypt(savedModels);
                if (decrypted && typeof decrypted !== 'string') {
                    setConfiguredModels(decrypted);
                } else if (typeof decrypted === 'string') {
                    try { setConfiguredModels(JSON.parse(decrypted)); } catch { }
                }
            }
        };
        loadEncryptedData();

        const savedFeatures = localStorage.getItem('neurolynx_features'); if (savedFeatures) setFeatureMapping(JSON.parse(savedFeatures));
        const savedAutomations = localStorage.getItem('neurolynx_automations'); if (savedAutomations) setAutomationRules(JSON.parse(savedAutomations));
    }, []);

    useEffect(() => { localStorage.setItem('neurolynx_biz_profile', JSON.stringify(businessProfile)); }, [businessProfile]);
    useEffect(() => {
        const saveModels = async () => {
            if (configuredModels.length > 0) {
                const encrypted = await cryptoService.current.encrypt(configuredModels);
                localStorage.setItem('neurolynx_models', encrypted);
            }
        };
        saveModels();
        localStorage.setItem('neurolynx_features', JSON.stringify(featureMapping));
    }, [configuredModels, featureMapping]);
    useEffect(() => { localStorage.setItem('neurolynx_automations', JSON.stringify(automationRules)); }, [automationRules]);
    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    const addToast = (type: Toast['type'], message: string) => {
        const id = Date.now().toString(); setToasts(prev => [...prev, { id, type, message }]); setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
    };

    // --- NEW HELPER FUNCTIONS ---
    const logAction = (action: string, target: string, details?: string) => {
        const newLog: AuditLog = {
            id: Date.now().toString(),
            action,
            target,
            userId: currentUser?.id || 'system',
            timestamp: Date.now(),
            details
        };
        setAuditLogs(prev => [newLog, ...prev]);
    };

    const addNotification = (title: string, message: string, type: Notification['type'] = 'info') => {
        const newNotif: Notification = {
            id: Date.now().toString(),
            title,
            message,
            type,
            timestamp: Date.now(),
            read: false
        };
        setNotifications(prev => [newNotif, ...prev]);
        addToast(type, title);
    };

    const handleGlobalSearch = (query: string) => {
        setSearchQuery(query);
        // Logic to filter views could be implemented here or inline in render
    };

    const getFilteredItems = <T extends { name?: string, title?: string }>(items: T[]) => {
        if (!searchQuery) return items;
        const lower = searchQuery.toLowerCase();
        return items.filter(i => (i.name?.toLowerCase().includes(lower) || i.title?.toLowerCase().includes(lower)));
    };

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsCommandPaletteOpen(prev => !prev);
            }
            if ((e.ctrlKey || e.metaKey) && e.key === '/') {
                e.preventDefault();
                setIsShortcutsOpen(prev => !prev);
            }
            if (e.altKey && e.key === 'q') {
                e.preventDefault();
                setIsQuickActionOpen(prev => !prev);
            }
            if (e.key === 'Alt') {
                e.preventDefault();
                setIsPTTActive(true);
                if (isCommandPaletteOpen || isVoiceMode) {
                    startFileRecording();
                }
            }
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'Alt') {
                setIsPTTActive(false);
                if (isRecording) {
                    stopFileRecording().then(blob => {
                        if (blob.size > 0 && currentUser) {
                            // Process voice command
                            handleVoiceCommand(blob);
                        }
                    });
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        }
    }, [isPTTActive, isCommandPaletteOpen, isVoiceMode, isRecording, currentUser]);

    const handleVoiceCommand = async (blob: Blob) => {
        if (!currentUser) return;
        setIsLoading(true);
        try {
            const apiKey = configuredModels.find(m => m.provider === 'OpenAI')?.apiKey || process.env.API_KEY || '';
            const text = await transcribeAudio(blob, apiKey);
            if (text.trim()) {
                setInput(text);
                const response = await lynxService.current?.sendMessage(text);
                if (response?.text) {
                    setMessages(prev => [...prev,
                    { id: Date.now().toString(), role: 'user', content: text, timestamp: Date.now(), type: 'text' },
                    { id: (Date.now() + 1).toString(), role: 'assistant', content: response.text, timestamp: Date.now() + 1, type: 'voice' }
                    ]);

                    // Plays response automatically as requested
                    await voiceService.current.speak(response.text);

                    // If continuity is on, maybe highlight that we are ready for next Alt hold
                    if (isVoiceContinuityEnabled) {
                        addToast('info', 'Ready for next command (Hold ALT)');
                    }
                }
            }
        } catch (e) {
            addToast('error', 'Voice Processing Failed');
        } finally {
            setIsLoading(false);
        }
    };

    // Theme Persistence
    useEffect(() => {
        const savedTheme = localStorage.getItem('neurolynx_theme');
        if (savedTheme) setIsDarkMode(savedTheme === 'dark');
    }, []);

    useEffect(() => {
        localStorage.setItem('neurolynx_theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    // Recent Items Tracking
    useEffect(() => {
        if (view !== 'home') {
            setRecentItems(prev => {
                const filtered = prev.filter(item => item.view !== view);
                const newItem = { label: view.charAt(0).toUpperCase() + view.slice(1), view, timestamp: Date.now() };
                return [newItem, ...filtered].slice(0, 5);
            });
        }
    }, [view]);

    // Scratchpad Persistence
    useEffect(() => {
        const timer = setTimeout(() => {
            const ts = Date.now();
            try {
                localStorage.setItem('neurolynx_scratchpad', scratchpad);
                localStorage.setItem('neurolynx_scratchpad_ts', ts.toString());
                setScratchpadSavedAt(ts);
            } catch (e) {
                console.error('Autosave failed', e);
                const reason = e instanceof Error ? e.message : 'storage issue';
                addToast('error', `Autosave failed: ${reason}. Reduce note size and retry.`);
            }
        }, SCRATCHPAD_AUTOSAVE_DELAY_MS);
        return () => clearTimeout(timer);
    }, [scratchpad]);

    const nextMeeting = useMemo(() => {
        const upcoming = meetings
            .map(m => ({ ...m, dateObj: new Date(m.date) }))
            .filter(m => m.dateObj.getTime() >= Date.now())
            .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
        return upcoming[0] || null;
    }, [meetings]);

    // Command Palette Logic
    const handleCommand = (cmd: string) => {
        const lower = cmd.toLowerCase().trim();
        if (lower.startsWith('>')) {
            const action = lower.substring(1).trim();
            if (action.includes('create deal')) { setModalData({}); setActiveModal('save_deal'); }
            else if (action.includes('create task')) { setModalData({}); setActiveModal('save_task'); }
            else if (action.includes('go to home')) setView('home');
            else if (action.includes('go to pipeline')) setView('pipeline');
            else if (action.includes('go to settings')) { setView('workspace'); setWorkspaceMode('internal'); setInternalTab('system'); }
            else if (action.includes('toggle dark')) setIsDarkMode(!isDarkMode);
            else if (action.includes('focus')) setIsFocusMode(!isFocusMode);
            else addToast('info', 'Unknown Command');
            setSearchQuery('');
        } else {
            handleGlobalSearch(cmd);
        }
    };

    const getSelectedCompany = () => companies.find(c => c.id === selectedCompanyId);

    const getMonthlyRunRate = useCallback((companyId: string) => {
        const activeContracts = contracts.filter(c => c.status === 'active' && (companyId === 'all' || c.companyId === companyId));
        return activeContracts.reduce((sum, c) => sum + c.totalValue, 0);
    }, [contracts]);

    const runEOMBilling = (companyId: string) => {
        const amount = getMonthlyRunRate(companyId); if (amount <= 0) return addToast('error', 'No active billing amount');
        setBillingRecords(prev => [{ id: `inv-${Date.now()}`, clientId: companyId, date: new Date().toISOString(), amount, status: 'pending', breakdown: 'Consolidated Billing for Active Contracts' }, ...prev]);
        addToast('success', 'Invoice Generated');
    };

    const handleClientExport = async () => {
        if (!selectedExportCompanyId) return addToast('error', 'Select a client to export');
        setIsLoading(true);
        try {
            const zip = new JSZip();
            const client = companies.find(c => c.id === selectedExportCompanyId);
            const clientName = client?.name.replace(/[^a-z0-9]/gi, '_') || 'client_export';
            zip.file('client_metadata.json', JSON.stringify({ company: client, contacts: clients.filter(c => c.companyId === selectedExportCompanyId), notes: MOCK_CLIENT_NOTES.filter(n => n.clientId === selectedExportCompanyId), billing: billingRecords.filter(b => b.clientId === selectedExportCompanyId) }, null, 2));
            const contractsFolder = zip.folder("contracts");
            if (contractsFolder) { contractsFolder.file('contracts_data.json', JSON.stringify(contracts.filter(c => c.companyId === selectedExportCompanyId), null, 2)); }
            const meetingsFolder = zip.folder("meetings");
            if (meetingsFolder) { meetings.filter(m => m.clientId === selectedExportCompanyId).forEach(m => { meetingsFolder.file(`meeting_${new Date(m.date).toISOString().split('T')[0]}_${m.id}.json`, JSON.stringify(m, null, 2)); }); }
            zip.file('tasks.json', JSON.stringify(tasks.filter(t => t.clientId === selectedExportCompanyId), null, 2));
            const content = await zip.generateAsync({ type: "blob" });
            const url = URL.createObjectURL(content); const link = document.createElement("a"); link.href = url; link.download = `${clientName}_archive.zip`; document.body.appendChild(link); link.click(); document.body.removeChild(link); URL.revokeObjectURL(url);
            addToast('success', 'Export Complete');
        } catch (e) { console.error(e); addToast('error', 'Export Failed'); } finally { setIsLoading(false); }
    };

    // --- AUTOMATION ENGINE ---
    const triggerAutomation = async (event: AutomationEvent, payload: any) => {
        const results = await processAutomationTrigger(event, payload, automationRules);
        results.triggered.forEach(name => addToast('success', `Automation Triggered: ${name}`));
        results.failed.forEach(name => addToast('error', `Automation Failed: ${name}`));

        if (results.triggered.length > 0) {
            // Update last triggered timestamps
            const now = Date.now();
            setAutomationRules(prev => prev.map(r =>
                results.triggered.includes(r.name) ? { ...r, lastTriggered: now } : r
            ));
        }
    };

    const saveAutomationRule = () => {
        if (!modalData.name || !modalData.webhookUrl) return addToast('error', 'Name and URL required');
        const newRule: AutomationRule = {
            id: modalData.id || Date.now().toString(),
            name: modalData.name,
            event: modalData.event || 'DEAL_WON',
            webhookUrl: modalData.webhookUrl,
            active: modalData.active !== undefined ? modalData.active : true,
            lastTriggered: modalData.lastTriggered
        };
        setAutomationRules(prev => {
            if (modalData.id) return prev.map(r => r.id === modalData.id ? newRule : r);
            return [...prev, newRule];
        });
        setActiveModal(null);
        addToast('success', 'Automation Rule Saved');
    };

    const deleteAutomationRule = (id: string) => {
        setAutomationRules(prev => prev.filter(r => r.id !== id));
        addToast('success', 'Rule Deleted');
    };

    // --- HEALTH SCORE CALCULATION ---
    // Using the standalone service
    const clientHealth = useMemo(() => {
        if (!selectedCompanyId || selectedCompanyId === 'all') return { score: 0, trend: 'stable' as const };
        return calculateClientHealth(selectedCompanyId, meetings, billingRecords, contracts);
    }, [selectedCompanyId, meetings, billingRecords, contracts]);

    // --- CONTRACT & DOC GENERATION ---
    const openContractBuilder = (contract?: Contract) => {
        setContractPreviewMode(false); setContractProductSearch('');
        if (contract) {
            setEditingContractId(contract.id); setContractBuilderTitle(contract.title); setContractStartDate(contract.startDate || ''); setContractEndDate(contract.endDate || ''); setContractPaymentTerms(contract.paymentTerms || 'net30'); setContractTerms(contract.terms || ''); setContractBuilderItems(JSON.parse(JSON.stringify(contract.items))); setContractDiscount(contract.discount || 0);
        } else {
            setEditingContractId(null); setContractBuilderTitle('New Contract'); setContractStartDate(''); setContractEndDate(''); setContractPaymentTerms('net30'); setContractTerms(''); setContractBuilderItems([]); setContractDiscount(0);
        }
        setActiveModal('contract_builder');
    };

    const handleAddToContract = (product: Product) => { setContractBuilderItems(prev => [...prev, { productId: product.id, productName: product.name, quantity: 1, unitPrice: product.price, billingTiming: product.billingTiming }]); };
    const handleRemoveFromContract = (idx: number) => { setContractBuilderItems(prev => prev.filter((_, i) => i !== idx)); };
    const handleQuantityChange = (index: number, newQty: string) => { const qty = parseInt(newQty); if (isNaN(qty) || qty < 1) return; setContractBuilderItems(prev => prev.map((item, i) => i === index ? { ...item, quantity: qty } : item)); };

    const handleSaveContract = (newContract: Contract, pdfBlob: Blob) => {
        const id = newContract.id;
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const newDoc: WorkspaceItem = {
            id: `doc-${Date.now()}`,
            type: 'contract',
            title: `${newContract.title}.pdf`,
            snippet: 'Generated Contract PDF',
            date: new Date().toLocaleDateString(),
            link: pdfUrl,
            clientId: newContract.companyId,
            summary: 'Auto-generated PDF contract.'
        };
        setWorkspaceItems(prev => [newDoc, ...prev]);
        setContracts(prev => {
            if (editingContractId) return prev.map(c => c.id === editingContractId ? { ...c, ...newContract, status: c.status } : c);
            return [...prev, newContract];
        });
        setActiveModal(null);
        addToast('success', 'Contract Saved & Download Started');
        triggerAutomation('CONTRACT_CREATED', newContract);
    };

    const handleDraftTerms = async (clientName: string, items: any[]) => {
        setIsLoading(true);
        const terms = await lynxService.current?.draftContractTerms(clientName, items);
        setIsLoading(false);
        return terms;
    };

    // --- DEAL MANAGEMENT ---
    const getProbabilityByStage = (stage: DealStage): number => {
        switch (stage) {
            case 'qualification': return 20;
            case 'proposal': return 50;
            case 'negotiation': return 80;
            case 'closed_won': return 100;
            case 'closed_lost': return 0;
            default: return 20;
        }
    };

    const saveDeal = () => {
        if (!modalData.title) return addToast('error', 'Deal Title required');
        const stage = modalData.stage || 'qualification';
        const probability = modalData.probability ? Number(modalData.probability) : getProbabilityByStage(stage);

        const newDeal: Deal = {
            id: modalData.id || Date.now().toString(),
            title: modalData.title,
            companyId: modalData.companyId || (selectedCompanyId !== 'all' ? selectedCompanyId : companies[0].id),
            value: Number(modalData.value) || 0,
            stage: stage,
            probability: probability,
            expectedCloseDate: modalData.expectedCloseDate || '',
            notes: modalData.notes || '',
            lastUpdated: new Date().toISOString()
        };
        setDeals(prev => {
            if (modalData.id) return prev.map(d => d.id === modalData.id ? newDeal : d);
            return [...prev, newDeal];
        });
        setActiveModal(null);
        addToast('success', 'Deal Saved');
        logAction(modalData.id ? 'UPDATE_DEAL' : 'CREATE_DEAL', newDeal.title, `Stage: ${newDeal.stage}, Value: $${newDeal.value}`);
    };

    const moveDeal = (dealId: string, newStage: DealStage) => {
        setDeals(prev => prev.map(d => {
            if (d.id === dealId) {
                // Trigger automation if moving to Won
                if (d.stage !== 'closed_won' && newStage === 'closed_won') {
                    const company = companies.find(c => c.id === d.companyId);
                    const payload = {
                        ...d,
                        stage: newStage,
                        companyName: company?.name,
                        companyEmail: clients.find(c => c.companyId === d.companyId)?.email // Fallback logic
                    };
                    triggerAutomation('DEAL_WON', payload);
                    logAction('DEAL_WON', d.title, `Value: $${d.value}`);
                    confetti({
                        particleCount: 150,
                        spread: 70,
                        origin: { y: 0.6 }
                    });
                }
                return { ...d, stage: newStage, probability: getProbabilityByStage(newStage), lastUpdated: new Date().toISOString() };
            }
            return d;
        }));
    };

    const handleDealDragStart = (e: React.DragEvent, dealId: string) => {
        e.dataTransfer.setData('dealId', dealId);
        setDraggedDealId(dealId);
    };

    const handleDealDrop = (e: React.DragEvent, stage: DealStage) => {
        e.preventDefault();
        const dealId = e.dataTransfer.getData('dealId');
        if (dealId) {
            moveDeal(dealId, stage);
            if (stage === 'closed_won') {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
                addToast('success', 'Deal Won! 🎉');
            }
        }
        setDraggedDealId(null);
    };

    const handleDealDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDealExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(deals, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "deals_export.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        addToast('success', 'Deals Exported');
    };

    const handleTaskExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "tasks_export.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        addToast('success', 'Tasks Exported');
    };

    // --- MANAGEMENT FUNCTIONS ---
    const handleAddModel = () => { if (!newModelKey && !newModelSelection.includes('gemini') && !newModelSelection.includes('gpt')) return addToast('error', 'API Key required'); const template = POPULAR_LLMS.find(m => m.id === newModelSelection); if (!template) return; setConfiguredModels(prev => [...prev, { id: Date.now().toString(), name: template.name, modelId: template.id, provider: template.provider, apiKey: newModelKey }]); setNewModelKey(''); addToast('success', 'Model Added'); };
    const removeModel = (id: string) => { if (id === 'default') return addToast('error', 'Cannot remove system default'); setConfiguredModels(prev => prev.filter(m => m.id !== id)); };
    const addUser = () => { if (users.length >= maxUsers) return addToast('error', `Limit Reached`); if (!modalData.name || !modalData.email || !adminPasswordInput) return addToast('error', 'Fields required'); setUsers(prev => [...prev, { id: Date.now().toString(), name: modalData.name, email: modalData.email, role: modalData.role || 'worker', avatar: `https://ui-avatars.com/api/?name=${modalData.name}&background=random&color=fff`, password: adminPasswordInput }]); setActiveModal(null); setAdminPasswordInput(''); addToast('success', 'Member Added'); };
    const deleteUser = (id: string) => { setUsers(prev => prev.filter(u => u.id !== id)); addToast('success', 'User Removed'); };
    const unlockUser = (id: string) => { setUsers(prev => prev.map(u => u.id === id ? { ...u, failedAttempts: 0, lockoutUntil: 0 } : u)); addToast('success', 'Account Unlocked'); };
    const adminResetPassword = () => { if (adminPasswordInput.length < 8) return addToast('error', 'Short password'); setUsers(prev => prev.map(u => u.id === modalData.id ? { ...u, password: adminPasswordInput } : u)); setAdminPasswordInput(''); setActiveModal(null); addToast('success', 'Password Updated'); };
    const generateSecurePassword = () => { const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"; let pass = ""; for (let i = 0; i < 12; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length)); setAdminPasswordInput(pass); };
    const handleChangePassword = () => { if (newPassword.length < 8) return addToast('error', 'Short password'); setUsers(prev => prev.map(u => u.id === currentUser?.id ? { ...u, password: newPassword } : u)); setNewPassword(''); setActiveModal(null); addToast('success', 'Password Changed'); };
    const saveCompany = () => {
        if (!modalData.name) return addToast('error', 'Company Name required');
        const newCompany: Company = {
            id: modalData.id || Date.now().toString(),
            name: modalData.name,
            address: modalData.address || '',
            phone: modalData.phone || '',
            website: modalData.website || '',
            industry: modalData.industry || 'Unknown',
            status: modalData.status || 'active',
            revenue: Number(modalData.revenue) || 0
        };
        setCompanies(prev => {
            if (modalData.id) {
                return prev.map(c => c.id === modalData.id ? newCompany : c);
            }
            return [...prev, newCompany];
        });
        setActiveModal(null);
        addToast('success', modalData.id ? 'Company Updated' : 'Company Added');
    };

    const saveProduct = () => { if (!modalData.name || !modalData.price) return addToast('error', 'Name/Price required'); const newProduct: Product = { id: modalData.id || Date.now().toString(), sku: modalData.sku || `SKU-${Date.now()}`, name: modalData.name, description: modalData.description || '', price: Number(modalData.price), category: modalData.category || 'service', billingTiming: modalData.billingTiming || 'net_term', status: modalData.status || 'active', recurringInterval: modalData.recurringInterval || 'one_time' }; setProducts(prev => { if (modalData.id) return prev.map(p => p.id === modalData.id ? newProduct : p); return [...prev, newProduct]; }); setActiveModal(null); addToast('success', 'Product Saved'); };
    const deleteProduct = (id: string) => { setProducts(prev => prev.filter(p => p.id !== id)); addToast('success', 'Product Removed'); };

    const saveClient = () => { if (!modalData.companyId) return addToast('error', 'Company Required'); const newClient: Client = { id: modalData.id || Date.now().toString(), companyId: modalData.companyId, name: modalData.name, role: modalData.role, email: modalData.email, phone: modalData.phone, status: modalData.status || 'active', avatarColor: 'bg-blue-500', notes: '', lastContactDate: new Date().toISOString(), nextActionDate: '' }; setClients(prev => { if (modalData.id) return prev.map(c => c.id === modalData.id ? newClient : c); return [...prev, newClient]; }); setActiveModal(null); addToast('success', 'Contact Saved'); triggerAutomation('CLIENT_ADDED', newClient); };

    const dispatchMcpEnvelope = (toolId: string, payload: any): ToolCallLog => {
        const envelope: ToolCallLog = {
            id: `log-${Date.now()}`,
            toolName: toolId,
            args: payload,
            status: 'queued',
            timestamp: Date.now()
        };
        setToolCalls(prev => {
            const next = [envelope, ...prev.filter(l => l.id !== envelope.id)];
            return next.slice(0, TOOL_CALL_LOG_LIMIT);
        });
        return envelope;
    };

    const runMcpTool = (toolId: string, payload: any, clientContext?: string): { result: string, log: ToolCallLog } => {
        const queued = dispatchMcpEnvelope(toolId, payload);

        if (toolId === 'create_task') {
            const title = payload?.title || 'Follow up';
            const priority = payload?.priority || 'high';
            const dueDate = payload?.dueDate || new Date(Date.now() + 86400000).toISOString().split('T')[0];
            const newTask: Task = { id: `task-${Date.now()}`, title, description: payload?.description || '', status: 'todo', priority, dueDate, clientId: clientContext };
            setTasks(prev => [newTask, ...prev]);
            return { result: `Task created: "${title}" due ${dueDate}`, log: { ...queued, status: 'success' } };
        }
        if (toolId === 'complete_task') {
            const keyword = (payload?.title || payload?.keyword || '').toLowerCase();
            const taskToComplete = tasks.find(
                t => keyword && t.title.toLowerCase().includes(keyword) && t.status !== 'done'
            );
            if (taskToComplete) {
                setTasks(prev =>
                    prev.map(t => t.id === taskToComplete.id ? { ...t, status: 'done' } : t)
                );
            }
            const resultText = taskToComplete ? `Task marked done (first match only): ${taskToComplete.title}` : 'No matching task found to complete';
            return { result: resultText, log: { ...queued, status: 'success' } };
        }
        if (toolId === 'list_tasks') {
            const buckets = tasks.reduce((acc: Record<string, string[]>, t) => {
                acc[t.status] = acc[t.status] || [];
                acc[t.status].push(t.title);
                return acc;
            }, {});
            const summary = Object.entries(buckets).map(([status, list]) => `${status}: ${(list as string[]).slice(0, 5).join(', ')}`).join(' | ');
            return { result: `Tasks overview -> ${summary || 'no tasks yet'}`, log: { ...queued, status: 'success' } };
        }
        if (toolId === 'schedule_meeting') {
            const title = payload?.title || 'Client Sync';
            const start = payload?.date ? new Date(payload.date).getTime() : Date.now() + 3600000;
            const newMeeting: Meeting = {
                id: `meet-${Date.now()}`,
                title,
                date: start,
                duration: payload?.duration || 30,
                summary: payload?.agenda || 'Quick sync',
                transcript: '',
                status: 'scheduled',
                attendees: payload?.attendees || [],
                clientId: clientContext,
                link: payload?.link || 'https://meet.neurolynx.ai/room',
                type: 'video'
            };
            setMeetings(prev => [newMeeting, ...prev]);
            return { result: `Meeting scheduled: ${title} on ${new Date(start).toLocaleString()}`, log: { ...queued, status: 'success' } };
        }
        if (toolId === 'summarize_client') {
            const comps = companies.map(c => `${c.name} (${c.status})`).join(', ');
            return { result: `Clients summary: ${comps}`, log: { ...queued, status: 'success' } };
        }
        if (toolId === 'export_deals') {
            const escapeCsv = (value: string | number): string => {
                const str = String(value);
                const escaped = str.replace(/"/g, '""');
                if (/[",\n\r]/.test(escaped)) {
                    return `"${escaped}"`;
                }
                return escaped;
            };
            const openDeals = deals.filter(d => d.stage !== 'closed_won' && d.stage !== 'closed_lost');
            const csv = openDeals.map(d => `${escapeCsv(d.title)},${escapeCsv(d.value)},${escapeCsv(d.stage)}`).join('\n');
            return { result: `Exported ${openDeals.length} deals:\n${csv}`, log: { ...queued, status: 'success' } };
        }
        return { result: 'Unknown tool', log: { ...queued, status: 'error' } };
    };

    const detectMcpIntent = (text: string): { toolId: string; args: any } | null => {
        const lower = text.toLowerCase();
        if (lower.includes('create') && lower.includes('task')) {
            const match = text.match(/(?:create|add|new)\s+(?:a\s+)?(?:new\s+)?task\s+(.*)/i);
            const title = match?.[1]?.trim() || 'Follow up';
            return { toolId: 'create_task', args: { title } };
        }
        if ((lower.includes('complete') || lower.includes('mark done') || lower.includes('finish')) && lower.includes('task')) {
            const match = text.match(/(?:complete|finish|mark done)\s+(?:the\s+)?(?:a\s+)?task\s+(.*)/i);
            const keyword = match?.[1]?.trim() || text.replace(/complete|finish|mark done|task/gi, '').trim() || 'task';
            return { toolId: 'complete_task', args: { title: keyword } };
        }
        if (lower.includes('list tasks') || lower.includes('show tasks') || lower.includes('open tasks')) {
            return { toolId: 'list_tasks', args: {} };
        }
        if ((lower.includes('schedule') || lower.includes('book') || lower.includes('set up')) && (lower.includes('meeting') || lower.includes('call'))) {
            const match = text.match(/(?:schedule|book|set up)\s+(?:a\s+)?(?:meeting|call)(?:\s+(?:about|regarding|to discuss)\s+(.*)|\s+(.*))/i);
            const title = (match?.[1] || match?.[2])?.trim() || 'Client Sync';
            return { toolId: 'schedule_meeting', args: { title } };
        }
        if (lower.includes('summary') && lower.includes('client')) {
            return { toolId: 'summarize_client', args: {} };
        }
        if (lower.includes('export') && lower.includes('deal')) {
            return { toolId: 'export_deals', args: {} };
        }
        return null;
    };

    const executeMcp = (toolId: string, args: any, clientContext?: string, invocationSource: 'command' | 'intent' = 'command') => {
        const { result, log } = runMcpTool(toolId, args, clientContext);
        setToolCalls(prev => {
            const next = [log, ...prev.filter(l => l.id !== log.id)];
            return next.slice(0, TOOL_CALL_LOG_LIMIT);
        });
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: result, timestamp: Date.now(), type: 'text', toolCalls: [log], clientId: clientContext }]);
        addToast('success', `MCP ${invocationSource === 'intent' ? 'intent' : 'command'}: ${toolId}`);
        return true;
    };

    const handleMcpCommand = (text: string, clientContext?: string) => {
        const lower = text.toLowerCase().trim();
        if (!lower.startsWith('/tool') && !lower.startsWith('/mcp')) return false;
        const parts = text.split(' ').filter(Boolean);
        const toolId = parts[1];
        if (!toolId) { addToast('error', 'Specify tool id after /tool'); return true; }
        let args: any = {};
        try {
            const argText = parts.slice(2).join(' ');
            args = argText ? JSON.parse(argText) : {};
        } catch {
            args = { prompt: parts.slice(2).join(' ') };
        }
        return executeMcp(toolId, args, clientContext);
    };

    const submitMessage = async () => {
        if (!input.trim() || isLoading) return;

        // Derive client context from selected company (for MCP tool scoping)
        const clientContext = selectedCompanyId !== 'all' ? selectedCompanyId : undefined;

        // Add user message to chat
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: input, timestamp: Date.now(), type: 'text' }]);
        const currentInput = input;
        setInput('');

        // Check for MCP commands first (pass clientContext so tools create scoped items)
        if (handleMcpCommand(currentInput, clientContext)) {
            return;
        }

        // Check for natural language intents (pass clientContext for tool scoping)
        const detectedIntent = detectMcpIntent(currentInput);
        if (detectedIntent) {
            executeMcp(detectedIntent.toolId, detectedIntent.args, clientContext, 'intent');
            return;
        }

        setIsLoading(true);

        // Token budget for context data (prevent exceeding LLM limits)
        const MAX_CONTEXT_CHARS = 8000;
        const MAX_ITEMS_PER_SECTION = 20;

        // Build comprehensive context with truncation for large datasets
        const truncateList = (items: string[], maxItems: number, label: string) => {
            if (items.length <= maxItems) return items.join('\n');
            const shown = items.slice(0, maxItems).join('\n');
            return `${shown}\n... and ${items.length - maxItems} more ${label}`;
        };

        const allCompanies = truncateList(
            companies.map(c => `- ${c.name} (Status: ${c.status}, Revenue: $${c.revenue.toLocaleString()})`),
            MAX_ITEMS_PER_SECTION, 'companies'
        );
        const allContracts = truncateList(
            contracts.map(c => {
                const compName = companies.find(comp => comp.id === c.companyId)?.name || 'Unknown';
                return `- Contract "${c.title}" for ${compName}: $${c.totalValue.toLocaleString()} (${c.status})`;
            }),
            MAX_ITEMS_PER_SECTION, 'contracts'
        );
        const allTasks = truncateList(
            tasks.map(t => `- Task "${t.title}": ${t.status}`),
            MAX_ITEMS_PER_SECTION, 'tasks'
        );
        const allDeals = truncateList(
            deals.map(d => {
                const compName = companies.find(c => c.id === d.companyId)?.name || 'Unknown';
                return `- Deal "${d.title}" for ${compName}: $${d.value.toLocaleString()} (Stage: ${d.stage}, Probability: ${d.probability}%)`;
            }),
            MAX_ITEMS_PER_SECTION, 'deals'
        );
        const productsList = truncateList(
            products.map(p => `- ${p.name}: $${p.price}`),
            MAX_ITEMS_PER_SECTION, 'products'
        );

        let contextData = `
[NEUROLYNX INTERNAL DATABASE]
You have access to all company data. Base your answers strictly on this data.

COMPANIES/CLIENTS (${companies.length} total):
${allCompanies}

DEALS/OPPORTUNITIES (${deals.length} total):
${allDeals}

CONTRACTS & REVENUE (${contracts.length} total):
${allContracts}

TASKS (${tasks.length} total):
${allTasks}

PRODUCTS/OFFERINGS (${products.length} total):
${productsList}

INSTRUCTIONS: 
You are NeuroLynx, an AI assistant with 500+ skills for business operations.
- Answer questions based on the data provided above
- You can create tasks, schedule meetings, and more via natural language
- Be helpful, concise, and professional
- If asked about "highest paying customer", use the Revenue figures
- If the data doesn't contain the answer, say so honestly
`;

        // Final truncation if still too large
        if (contextData.length > MAX_CONTEXT_CHARS) {
            contextData = contextData.substring(0, MAX_CONTEXT_CHARS) + '\n... [Context truncated due to size]';
        }

        const activeModelId = featureMapping['chat'] || 'default';
        const modelConfig = configuredModels.find(m => m.id === activeModelId) || configuredModels[0];

        try {
            await lynxService.current?.configure({
                provider: modelConfig.provider,
                model: modelConfig.modelId,
                apiKey: modelConfig.apiKey,
                systemInstruction: `You are NeuroLynx. ${contextData.substring(0, 2000)}... (Context Truncated for System Prompt, see full context in message).`
            });

            const res = await lynxService.current?.sendMessage(currentInput, contextData);

            if (res) {
                const responseText = res.text || 'Error';
                setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: responseText, timestamp: Date.now(), type: 'text' }]);

                // Detect if the user requested generated content (proposals, reports, plans, etc.)
                const contentKeywords = ['proposal', 'report', 'plan', 'summary', 'analysis', 'strategy', 'recommendation', 'document', 'draft', 'outline', 'brief', 'memo', 'presentation'];
                const requestKeywords = ['create', 'write', 'draft', 'generate', 'make', 'prepare', 'build', 'develop'];
                // Exclude informational queries that aren't content generation requests
                const excludeKeywords = ['explain', 'what is', 'what are', 'how to', 'how do', 'tell me about', 'describe', 'define'];
                
                const inputLower = currentInput.toLowerCase();
                const isExcludedQuery = excludeKeywords.some(ek => inputLower.includes(ek));
                const isContentRequest = !isExcludedQuery &&
                                        requestKeywords.some(rk => inputLower.includes(rk)) && 
                                        contentKeywords.some(ck => inputLower.includes(ck));
                
                // Check if response is substantial (more than a simple answer)
                const SUBSTANTIAL_RESPONSE_LENGTH = 500;
                const MEMORY_PREVIEW_LENGTH = 500;
                const isSubstantialResponse = responseText.length > SUBSTANTIAL_RESPONSE_LENGTH;

                if (isContentRequest && isSubstantialResponse && responseText !== 'Error') {
                    // Determine document type from user request
                    const docType = contentKeywords.find(ck => inputLower.includes(ck)) || 'document';
                    const clientName = companies.find(c => c.id === clientContext)?.name || 'General';
                    const docTitle = `${docType.charAt(0).toUpperCase() + docType.slice(1)} - ${clientName}`;
                    const timestamp = Date.now();
                    const dateStr = new Date().toISOString().split('T')[0];

                    // Add to Memory (long-term storage)
                    setMemories(prev => [{
                        id: `mem-${timestamp}`,
                        key: docTitle,
                        value: responseText.substring(0, MEMORY_PREVIEW_LENGTH) + (responseText.length > MEMORY_PREVIEW_LENGTH ? '...' : ''),
                        timestamp: timestamp,
                        type: 'text',
                        createdBy: 'AI Assistant',
                        clientId: clientContext
                    }, ...prev]);

                    // Add to Workspace Items (Documents tab)
                    setWorkspaceItems(prev => [{
                        id: `doc-${timestamp}`,
                        type: 'doc',
                        title: docTitle,
                        snippet: responseText.length > 150 ? responseText.substring(0, 150) + '...' : responseText,
                        date: dateStr,
                        link: '#', // Link to view in-app; full content stored in summary
                        clientId: clientContext,
                        summary: responseText
                    }, ...prev]);

                    addToast('success', `${docTitle} saved to Memory & Documents`);
                }
            }
        } catch (e: any) {
            console.error(e);
            const errorMsg = e.message || 'AI Error - Check API Key';
            addToast('error', errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    // --- Real Document Generation ---
    const handleCreateDocument = (template: Template) => {
        const doc = new jsPDF();
        const company = companies.find(c => c.id === (selectedCompanyId !== 'all' ? selectedCompanyId : companies[0].id));
        const clientName = clients.find(c => c.companyId === company?.id)?.name || 'Client Name';
        const companyName = company?.name || 'Company Name';
        const date = new Date().toLocaleDateString();

        // Simple variable replacement
        let content = template.content
            .replace(/\[Client\]/g, clientName)
            .replace(/\[Company\]/g, companyName)
            .replace(/\[Date\]/g, date)
            .replace(/\[Amount\]/g, '$0.00'); // Placeholder

        doc.setFontSize(18);
        doc.text(template.title, 20, 20);

        doc.setFontSize(12);
        const splitText = doc.splitTextToSize(content, 170);
        doc.text(splitText, 20, 40);

        doc.save(`${template.title.replace(/\s+/g, '_')}_${date}.pdf`);

        addToast('success', `Generated & Downloaded ${template.title}`);

        // Add to workspace
        setWorkspaceItems(prev => [{
            id: `doc-${Date.now()}`,
            type: 'doc',
            title: `${template.title} - ${clientName}`,
            snippet: `Generated from template: ${template.title}`,
            date: new Date().toISOString().split('T')[0],
            link: '#', // In a real app, this would be the upload URL
            clientId: activeClient?.id
        }, ...prev]);
    };

    // --- Real Speech Recognition ---
    const [transcript, setTranscript] = useState<string[]>([]);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (isLiveMeeting) {
            if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = true;
                recognitionRef.current.interimResults = true;

                recognitionRef.current.onresult = (event: any) => {
                    let interimTranscript = '';
                    let finalTranscript = '';

                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        if (event.results[i].isFinal) {
                            finalTranscript += event.results[i][0].transcript;
                            setTranscript(prev => [...prev, `You: "${event.results[i][0].transcript}"`]);
                        } else {
                            interimTranscript += event.results[i][0].transcript;
                        }
                    }
                };

                recognitionRef.current.start();
            } else {
                addToast('error', 'Speech Recognition not supported in this browser.');
                setIsLiveMeeting(false);
            }
        } else {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        }
    }, [isLiveMeeting]);

    // --- Real AI Email Draft ---
    const handleGenerateEmail = async () => {
        if (!modalData.recipient || !modalData.topic) return;

        setIsLoading(true);
        try {
            const draft = await lynxService.current?.generateEmailDraft(
                modalData.recipient,
                modalData.topic,
                modalData.tone || 'Professional',
                modalData.keyPoints || ''
            );

            if (draft) {
                setModalData(prev => ({ ...prev, content: draft }));
                addToast('success', 'Email draft generated!');
            }
        } catch (error) {
            addToast('error', 'Failed to generate draft. Check API Key.');
        } finally {
            setIsLoading(false);
        }
    };

    const processVoiceCommand = (cmd: string, arg: string) => {
        if (cmd === 'save') {
            setMemories(prev => [{ id: Date.now().toString(), key: 'Voice Note', value: arg, timestamp: Date.now(), type: 'text' }, ...prev]);
            addToast('success', 'Memory Saved');
        }
    };

    const moveTask = (taskId: string, newStatus: Task['status']) => {
        setTasks(prev => {
            const task = prev.find(t => t.id === taskId);
            if (task && newStatus === 'done' && task.recurring && task.recurringInterval) {
                // Create next occurrence
                const nextDate = new Date();
                if (task.recurringInterval === 'daily') nextDate.setDate(nextDate.getDate() + 1);
                if (task.recurringInterval === 'weekly') nextDate.setDate(nextDate.getDate() + 7);
                if (task.recurringInterval === 'monthly') nextDate.setMonth(nextDate.getMonth() + 1);

                const nextTask: Task = {
                    ...task,
                    id: Date.now().toString(),
                    status: 'todo',
                    dueDate: nextDate.toISOString().split('T')[0],
                    title: `${task.title} (Recurring)`
                };
                addToast('success', 'Recurring Task Created');
                return [...prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t), nextTask];
            }
            return prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t);
        });
    };
    const saveTask = () => {
        if (!modalData.title) return addToast('error', 'Title required');
        const newTask: Task = {
            id: modalData.id || Date.now().toString(),
            title: modalData.title,
            description: modalData.description || '',
            status: modalData.status || 'todo',
            priority: modalData.priority || 'medium',
            clientId: modalData.clientId,
            dealId: modalData.dealId, // Added dealId
            assignedTo: modalData.assignedTo || currentUser?.id,
            startDate: modalData.startDate,
            dueDate: modalData.dueDate,
            source: 'manual',
            recurring: modalData.recurring,
            recurringInterval: modalData.recurringInterval
        };
        setTasks(prev => {
            if (modalData.id) return prev.map(t => t.id === modalData.id ? newTask : t);
            return [...prev, newTask];
        });
        setActiveModal(null);
        addToast('success', 'Task Saved');
        logAction(modalData.id ? 'UPDATE_TASK' : 'CREATE_TASK', newTask.title, `Assigned to ${newTask.assignedTo}`);
    };

    const generateEmailDraft = async () => {
        if (!modalData.topic || !modalData.recipient) return addToast('error', 'Topic and Recipient required');
        setIsLoading(true);
        try {
            const client = companies.find(c => c.id === modalData.recipient);
            const contact = clients.find(c => c.companyId === modalData.recipient);
            const context = `Draft an email to ${contact?.name || 'Client'} at ${client?.name || 'Company'}. 
          Topic: ${modalData.topic}. 
          Tone: ${modalData.tone || 'Professional'}. 
          Key points: ${modalData.points || 'None'}.`;

            await lynxService.current?.configure({
                provider: 'Google',
                model: 'gemini-3-flash-preview',
                apiKey: configuredModels.find(m => m.provider === 'Google')?.apiKey || ''
            });

            const res = await lynxService.current?.sendMessage(context, "You are an expert email copywriter.");
            setModalData(prev => ({ ...prev, content: res?.text || 'Failed to generate.' }));
            addToast('success', 'Draft Generated');
        } catch (e) {
            console.error(e);
            addToast('error', 'Generation Failed');
        } finally {
            setIsLoading(false);
        }
    };

    const saveDraftEmail = () => {
        if (!modalData.content) return;
        const newEmail: WorkspaceItem = {
            id: `draft-${Date.now()}`,
            type: 'email',
            title: modalData.topic || 'New Draft',
            snippet: modalData.content.substring(0, 50) + '...',
            date: new Date().toLocaleDateString(),
            link: '#',
            folder: 'drafts',
            to: modalData.recipientName || 'Client',
            clientId: modalData.recipient,
            contentData: modalData.content
        };
        setWorkspaceItems(prev => [newEmail, ...prev]);
        setActiveModal(null);
        addToast('success', 'Draft Saved');
        logAction('CREATE_DRAFT', 'Email', `Draft created for ${modalData.recipient}`);
    };
    const handleMeetingClick = (meeting: Meeting) => { setSelectedMeeting(meeting); setMeetingRecommendationsSelected(new Set()); setMeetingRecommendationDates({}); };
    const handleAddRecommendationsToTasks = () => { if (!selectedMeeting) return; const tasksToAdd: Task[] = Array.from(meetingRecommendationsSelected).map((recText: string) => ({ id: Date.now().toString() + Math.random(), title: recText, description: `Generated from meeting: ${selectedMeeting.title}`, status: 'todo', priority: 'medium', clientId: selectedMeeting.clientId || 'comp1', assignedTo: currentUser?.id, source: 'meeting', dueDate: meetingRecommendationDates[recText] })); setTasks(prev => [...prev, ...tasksToAdd]); addToast('success', `${tasksToAdd.length} tasks added`); setMeetingRecommendationsSelected(new Set()); setMeetingRecommendationDates({}); };
    const handleMemoryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (!file) return; const text = await extractTextFromPDF(file); setMemories(prev => [{ id: Date.now().toString(), key: file.name, value: text.substring(0, 200) + '...', timestamp: Date.now(), createdBy: currentUser?.name || 'User', type: 'file', fileName: file.name, clientId: selectedCompanyId !== 'all' ? selectedCompanyId : undefined }, ...prev]); addToast('success', 'Memory Uploaded'); };
    const saveManualMemory = () => { if (!modalData.content) return; setMemories(prev => [{ id: Date.now().toString(), key: 'Manual Note', value: modalData.content, timestamp: Date.now(), createdBy: currentUser?.name || 'User', type: 'text', clientId: selectedCompanyId !== 'all' ? selectedCompanyId : undefined }, ...prev]); setActiveModal(null); addToast('success', 'Note Added'); };

    const calculateContractTotals = () => { const subtotal = contractBuilderItems.reduce((acc, i) => acc + (i.quantity * i.unitPrice), 0); const taxable = Math.max(0, subtotal - contractDiscount); const tax = taxable * contractTaxRate; const total = taxable + tax; return { subtotal, tax, total }; };
    const totals = calculateContractTotals();

    const runDiagnostics = async () => {
        setActiveModal('diagnostics');
        setTestResults([]);

        const addResult = (name: string, status: 'pass' | 'fail' | 'warn', message: string, category: string) => {
            setTestResults(prev => [...prev, { id: Date.now().toString(), name, status, message, category, timestamp: Date.now() }]);
        };

        // 1. API Key Check
        if (process.env.GEMINI_API_KEY) {
            addResult('Gemini API Key', 'pass', 'API Key is configured.', 'Config');
        } else {
            addResult('Gemini API Key', 'fail', 'Missing GEMINI_API_KEY environment variable.', 'Config');
        }

        // 2. Browser Capabilities
        if ('speechSynthesis' in window) {
            addResult('Text-to-Speech', 'pass', 'Browser supports Speech Synthesis.', 'System');
        } else {
            addResult('Text-to-Speech', 'warn', 'Speech Synthesis not supported.', 'System');
        }

        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            addResult('Speech Recognition', 'pass', 'Browser supports Speech Recognition.', 'System');
        } else {
            addResult('Speech Recognition', 'fail', 'Speech Recognition not supported.', 'System');
        }

        // 3. Storage Check
        try {
            const storageUsage = JSON.stringify(localStorage).length;
            const usageKB = (storageUsage / 1024).toFixed(2);
            addResult('Local Storage', 'pass', `Using ${usageKB} KB of storage.`, 'Storage');
        } catch (e) {
            addResult('Local Storage', 'fail', 'Unable to access Local Storage.', 'Storage');
        }

        // 4. Network Status
        if (navigator.onLine) {
            addResult('Network Connectivity', 'pass', 'System is online.', 'Network');
        } else {
            addResult('Network Connectivity', 'fail', 'System is offline.', 'Network');
        }

        // 5. PDF Engine Check
        try {
            new jsPDF();
            addResult('PDF Engine', 'pass', 'jsPDF is initialized and ready.', 'System');
        } catch (e) {
            addResult('PDF Engine', 'fail', 'Failed to initialize PDF engine.', 'System');
        }
    };

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        return { days, firstDay, year, month };
    };

    const { days, firstDay, year: calYear, month: calMonth } = getDaysInMonth(currentDate);
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const getViewMood = () => {
        switch (view) {
            case 'home': return 'from-slate-900 via-slate-900 to-cyan-900/10';
            case 'pipeline': return 'from-slate-900 via-slate-900 to-orange-900/10';
            case 'clients': return 'from-slate-900 via-slate-900 to-emerald-900/10';
            case 'tasks': return 'from-slate-900 via-slate-900 to-purple-900/10';
            case 'calendar': return 'from-slate-900 via-slate-900 to-rose-900/10';
            case 'communications': return 'from-slate-900 via-slate-900 to-blue-900/10';
            case 'workspace': return 'from-slate-900 via-slate-900 to-indigo-900/10';
            case 'memory': return 'from-slate-900 via-slate-900 to-cyan-900/10';
            default: return 'from-slate-900 via-slate-900 to-slate-900';
        }
    };

    // NOTE: clientHealth logic moved to useMemo wrapping the new service
    const activeClient = getSelectedCompany();

    return (
        <div className={`relative flex h-screen w-full overflow-hidden transition-colors duration-1000 bg-gradient-to-br ${getViewMood()} ${isDarkMode ? 'text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
            <div className="neuro-grid-overlay"></div>
            <AnimatePresence mode="wait">
                {!currentUser && (
                    <motion.div
                        key="auth"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-xl"
                    >
                        {licenseStatus !== 'valid'
                            ? <LicenseScreen status={licenseStatus} onValidate={handleActivation} />
                            : <LoginScreen users={users} setUsers={setUsers} onLogin={handleUserLogin} onClearLicense={handleClearLicense} isValidating={false} />
                        }
                    </motion.div>
                )}
            </AnimatePresence>

            <aside className={`relative w-64 flex-shrink-0 border-r flex flex-col items-center py-6 h-full transition-all duration-300 ${isDarkMode ? 'bg-slate-900 border-white/5' : 'bg-white border-gray-200'} ${isFocusMode ? '-ml-64' : ''}`}>
                <img src="/neurolynx-logo.png" alt="NeuroLynx Logo" className="w-40 h-auto mb-4 cursor-pointer opacity-90 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded" tabIndex={0} onClick={() => setView('home')} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setView('home'); } }} role="button" />
                <nav className="flex-1 w-full px-4 space-y-2 overflow-y-auto custom-scrollbar">
                    <SidebarItem active={view === 'home'} icon="fa-house" label="Home" onClick={() => setView('home')} />
                    <SidebarItem active={view === 'chat'} icon="fa-comment-dots" label="Chat" onClick={() => setView('chat')} />
                    <SidebarItem active={view === 'clients'} icon="fa-building" label="Companies" onClick={() => setView('clients')} />

                    <div className="space-y-1">
                        <button onClick={() => setIsWorkspaceMenuOpen(!isWorkspaceMenuOpen)} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group relative overflow-hidden flex-shrink-0 ${view === 'workspace' || view === 'activity' || view === 'vendors' || view === 'expenses' || view === 'compliance' || view === 'versions' || view === 'tickets' || view === 'onboarding' || view === 'sequences' || view === 'portal' || view === 'pipeline' || view === 'meetings' || view === 'invoices' || view === 'esign' || view === 'assets' || view === 'wiki' || view === 'orgchart' || view === 'roadmap' || view === 'partners' || view === 'customfields' ? 'glass-card border-orange-500/20 text-orange-400 glow-orange' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}>
                            <div className={`w-8 flex items-center justify-center transition-transform ${view === 'workspace' || view === 'activity' || view === 'vendors' || view === 'expenses' || view === 'compliance' || view === 'versions' || view === 'tickets' || view === 'onboarding' || view === 'sequences' || view === 'portal' || view === 'pipeline' || view === 'meetings' || view === 'invoices' || view === 'esign' || view === 'assets' || view === 'wiki' || view === 'orgchart' || view === 'roadmap' || view === 'partners' || view === 'customfields' ? 'text-orange-400' : 'text-slate-500'}`}>
                                <i className="fas fa-briefcase text-lg"></i>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] flex-1 text-left">Workspace</span>
                            <ChevronRight className={`w-3 h-3 transition-transform duration-300 ${isWorkspaceMenuOpen ? 'rotate-90' : 'opacity-30'}`} />
                        </button>
                        <AnimatePresence>
                            {isWorkspaceMenuOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden pl-10 space-y-1 border-l border-white/5 ml-6 py-1"
                                >
                                    <SidebarGroupToggle isOpen={isInternalMgmtOpen} label="Internal Mgmt" onClick={() => setIsInternalMgmtOpen(!isInternalMgmtOpen)} />
                                    {isInternalMgmtOpen && (
                                        <div className="space-y-1 mt-1 pl-2 transition-all">
                                            <SidebarSubItem active={view === 'workspace' && workspaceMode === 'internal' && internalTab === 'offerings'} label="Offerings" onClick={() => { setView('workspace'); setWorkspaceMode('internal'); setSelectedCompanyId('all'); setInternalTab('offerings'); }} />
                                            {currentUser?.role === 'admin' && (
                                                <>
                                                    <SidebarSubItem active={view === 'workspace' && workspaceMode === 'internal' && internalTab === 'team'} label="Team" onClick={() => { setView('workspace'); setWorkspaceMode('internal'); setSelectedCompanyId('all'); setInternalTab('team'); }} />
                                                    <SidebarSubItem active={view === 'workspace' && workspaceMode === 'internal' && internalTab === 'system'} label="System" onClick={() => { setView('workspace'); setWorkspaceMode('internal'); setSelectedCompanyId('all'); setInternalTab('system'); }} />
                                                </>
                                            )}
                                            <SidebarSubItem active={view === 'workspace' && workspaceMode === 'internal' && internalTab === 'profile'} label="Profile" onClick={() => { setView('workspace'); setWorkspaceMode('internal'); setSelectedCompanyId('all'); setInternalTab('profile'); }} />
                                            <SidebarSubItem active={view === 'workspace' && workspaceMode === 'internal' && internalTab === 'automations'} label="Automations" onClick={() => { setView('workspace'); setWorkspaceMode('internal'); setSelectedCompanyId('all'); setInternalTab('automations'); }} />
                                            <SidebarSubItem active={view === 'workspace' && workspaceMode === 'internal' && internalTab === 'data'} label="Data & Export" onClick={() => { setView('workspace'); setWorkspaceMode('internal'); setSelectedCompanyId('all'); setInternalTab('data'); }} />
                                            <SidebarSubItem active={view === 'activity'} label="Activity" onClick={() => setView('activity')} />
                                            <SidebarSubItem active={view === 'vendors'} label="Vendors" onClick={() => setView('vendors')} />
                                            <SidebarSubItem active={view === 'expenses'} label="Expenses" onClick={() => setView('expenses')} />
                                            <SidebarSubItem active={view === 'compliance'} label="Compliance" onClick={() => setView('compliance')} />
                                            <SidebarSubItem active={view === 'versions'} label="Versions" onClick={() => setView('versions')} />
                                            <SidebarSubItem active={view === 'forecast'} label="Flash Forecast" onClick={() => setView('forecast')} />
                                            <SidebarSubItem active={view === 'alerts'} label="Risk Radar" onClick={() => setView('alerts')} />
                                            <SidebarSubItem active={view === 'winloss'} label="Win/Loss Lab" onClick={() => setView('winloss')} />
                                            <SidebarSubItem active={view === 'kpis'} label="Neural KPIs" onClick={() => setView('kpis')} />
                                            <SidebarSubItem active={view === 'velocity'} label="Deal Velocity" onClick={() => setView('velocity')} />
                                            <SidebarSubItem active={view === 'profitability'} label="ROI Analysis" onClick={() => setView('profitability')} />
                                            <SidebarSubItem active={view === 'utilization'} label="Resource Ops" onClick={() => setView('utilization')} />
                                            <SidebarSubItem active={view === 'csat'} label="Sentience/CSAT" onClick={() => setView('csat')} />
                                        </div>
                                    )}
                                    <SidebarGroupToggle isOpen={isClientWorkspaceOpen} label="Client Workspace" onClick={() => setIsClientWorkspaceOpen(!isClientWorkspaceOpen)} />
                                    {isClientWorkspaceOpen && (
                                        <div className="space-y-1 mt-1 pl-2 transition-all">
                                            <SidebarSubItem active={view === 'workspace' && workspaceMode === 'client' && clientWorkspaceTab === 'overview'} label="Overview" onClick={() => { setView('workspace'); setWorkspaceMode('client'); setClientWorkspaceTab('overview'); if (selectedCompanyId === 'all') setSelectedCompanyId(companies[0]?.id || 'comp1'); }} />
                                            <SidebarSubItem active={view === 'workspace' && workspaceMode === 'client' && clientWorkspaceTab === 'documents'} label="Documents" onClick={() => { setView('workspace'); setWorkspaceMode('client'); setClientWorkspaceTab('documents'); if (selectedCompanyId === 'all') setSelectedCompanyId(companies[0]?.id || 'comp1'); }} />
                                            <SidebarSubItem active={view === 'workspace' && workspaceMode === 'client' && clientWorkspaceTab === 'contracts'} label="Contracts" onClick={() => { setView('workspace'); setWorkspaceMode('client'); setClientWorkspaceTab('contracts'); if (selectedCompanyId === 'all') setSelectedCompanyId(companies[0]?.id || 'comp1'); }} />
                                            <SidebarSubItem active={view === 'workspace' && workspaceMode === 'client' && clientWorkspaceTab === 'billing'} label="Billing" onClick={() => { setView('workspace'); setWorkspaceMode('client'); setClientWorkspaceTab('billing'); if (selectedCompanyId === 'all') setSelectedCompanyId(companies[0]?.id || 'comp1'); }} />
                                            <SidebarSubItem active={view === 'pipeline'} label="Pipeline" onClick={() => { setView('pipeline'); if (selectedCompanyId === 'all') setSelectedCompanyId(companies[0]?.id || 'comp1'); }} />
                                            <SidebarSubItem active={view === 'meetings'} label="Meetings" onClick={() => { setView('meetings'); if (selectedCompanyId === 'all') setSelectedCompanyId(companies[0]?.id || 'comp1'); }} />
                                            <SidebarSubItem active={view === 'tickets'} label="Tickets" onClick={() => setView('tickets')} />
                                            <SidebarSubItem active={view === 'onboarding'} label="Onboarding" onClick={() => setView('onboarding')} />
                                            <SidebarSubItem active={view === 'sequences'} label="Sequences" onClick={() => setView('sequences')} />
                                            <SidebarSubItem active={view === 'portal'} label="Portal" onClick={() => setView('portal')} />
                                            <SidebarSubItem active={view === 'invoices'} label="Billing Core" onClick={() => setView('invoices')} />
                                            <SidebarSubItem active={view === 'esign'} label="E-Signature" onClick={() => setView('esign')} />
                                            <SidebarSubItem active={view === 'assets'} label="IT Inventory" onClick={() => setView('assets')} />
                                            <SidebarSubItem active={view === 'wiki'} label="Brain / Wiki" onClick={() => setView('wiki')} />
                                            <SidebarSubItem active={view === 'orgchart'} label="Org Viz" onClick={() => setView('orgchart')} />
                                            <SidebarSubItem active={view === 'roadmap'} label="Product Ops" onClick={() => setView('roadmap')} />
                                            <SidebarSubItem active={view === 'partners'} label="Partner Net" onClick={() => setView('partners')} />
                                            <SidebarSubItem active={view === 'customfields'} label="Data Schema" onClick={() => setView('customfields')} />
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <SidebarItem active={view === 'memory'} icon="fa-brain" label="Memory" onClick={() => setView('memory')} />

                    {/* Task Engine Section */}
                    <div className="space-y-1">
                        <button onClick={() => setIsTasksMenuOpen(!isTasksMenuOpen)} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group relative overflow-hidden flex-shrink-0 ${view === 'tasks' ? 'glass-card border-orange-500/20 text-orange-400 glow-orange' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}>
                            <div className={`w-8 flex items-center justify-center transition-transform ${view === 'tasks' ? 'text-orange-400' : 'text-slate-500'}`}>
                                <Check className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] flex-1 text-left">Task Engine</span>
                            <ChevronRight className={`w-3 h-3 transition-transform duration-300 ${isTasksMenuOpen ? 'rotate-90' : 'opacity-30'}`} />
                        </button>
                        <AnimatePresence>
                            {isTasksMenuOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden pl-10 space-y-1 border-l border-white/5 ml-6 py-1"
                                >
                                    <SidebarSubItem active={taskFilter === 'all'} label="All Tasks" onClick={() => { setTaskFilter('all'); setView('tasks'); }} />
                                    <SidebarSubItem active={taskFilter === 'my'} label="My Priority" onClick={() => { setTaskFilter('my'); setView('tasks'); }} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <SidebarItem active={view === 'calendar'} icon="fa-calendar" label="Calendar" onClick={() => setView('calendar')} />

                    <SidebarItem active={view === 'communications'} icon="fa-envelope" label="Comms" onClick={() => setView('communications')} />

                    <SidebarItem active={view === 'help'} icon="fa-circle-question" label="Help" onClick={() => setView('help')} />

                    <div className="mt-auto px-4 w-full pt-8 pb-4">
                        <div className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-2">Mental Scratchpad</div>
                        <textarea
                            className="w-full h-28 bg-slate-800/30 rounded-2xl border border-white/5 p-4 text-[11px] text-slate-400 resize-none focus:outline-none focus:border-orange-500/50 transition-all placeholder-slate-600"
                            placeholder="Note for the sub-conscious..."
                            value={scratchpad}
                            onChange={(e) => setScratchpad(e.target.value)}
                        ></textarea>
                    </div>
                </nav>

                <div className="absolute bottom-6 left-4 right-4 z-50">
                    <AnimatePresence>
                        {isQuickActionOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                className="mb-4 p-3 glass-card rounded-2xl border-white/10 shadow-2xl space-y-1"
                            >
                                <button onClick={() => { setModalData({}); setActiveModal('save_task'); setIsQuickActionOpen(false); }} className="w-full text-left p-3 hover:bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-3 text-slate-300 hover:text-orange-400 transition-all"><i className="fas fa-check-square text-orange-500"></i> New Task</button>
                                <button onClick={() => { setModalData({}); setActiveModal('save_deal'); setIsQuickActionOpen(false); }} className="w-full text-left p-3 hover:bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-3 text-slate-300 hover:text-green-400 transition-all"><i className="fas fa-dollar-sign text-green-500"></i> New Deal</button>
                                <button onClick={() => { setModalData({}); setActiveModal('save_memory'); setIsQuickActionOpen(false); }} className="w-full text-left p-3 hover:bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-3 text-slate-300 hover:text-purple-400 transition-all"><i className="fas fa-sticky-note text-purple-500"></i> New Note</button>
                                <button onClick={() => { setModalData({}); setActiveModal('draft_email'); setIsQuickActionOpen(false); }} className="w-full text-left p-3 hover:bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-3 text-slate-300 hover:text-blue-400 transition-all"><i className="fas fa-envelope text-blue-500"></i> Draft Email</button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <button
                        onClick={() => setIsQuickActionOpen(!isQuickActionOpen)}
                        className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-white shadow-xl transition-all flex items-center justify-center gap-3 ${isQuickActionOpen ? 'bg-slate-900 border border-white/10' : 'bg-gradient-to-r from-orange-600 to-red-600 hover:scale-[1.02] active:scale-[0.98] glow-orange'}`}
                    >
                        <i className={`fas ${isQuickActionOpen ? 'fa-times' : 'fa-bolt'} transition-transform ${isQuickActionOpen ? 'rotate-90' : ''}`}></i>
                        {isQuickActionOpen ? 'Close Menu' : 'Quick Actions'}
                    </button>
                </div>
            </aside>

            <main className="flex-1 flex flex-col overflow-hidden relative">
                <header className={`h-20 border-b flex items-center justify-between px-8 flex-shrink-0 z-40 ${isDarkMode ? 'bg-slate-900/60 border-white/5 backdrop-blur-md' : 'bg-white/80 border-gray-200 backdrop-blur-md'}`}>
                    <div className="flex items-center gap-6 flex-1">
                        <div className="flex flex-col">
                            <Breadcrumbs view={view} companyName={selectedCompanyId !== 'all' ? companies.find(c => c.id === selectedCompanyId)?.name : undefined} />
                            <h1 className="font-extrabold text-2xl neuro-text-gradient uppercase hidden md:block leading-tight">{view}</h1>
                        </div>

                        <div className="relative flex-1 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Intelligence Search... (Ctrl+K)"
                                className={`w-full bg-slate-900/50 border border-white/10 rounded-2xl py-3 pl-12 pr-12 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all placeholder:text-slate-600 ${isPTTActive ? 'border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]' : ''}`}
                                value={searchQuery}
                                onChange={(e) => handleGlobalSearch(e.target.value)}
                                onFocus={() => setIsCommandPaletteOpen(true)}
                            />
                            {isPTTActive && (
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                                />
                            )}
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                                {!isPTTActive && <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold text-slate-500 bg-slate-800 border border-white/10 rounded-md">ALT</kbd>}
                            </div>
                        </div>
                        <div className="hidden xl:flex items-center gap-2">
                            <div className="glass-chip">
                                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                                {licenseStatus === 'valid' ? 'License Active' : `License: ${licenseStatus}`}
                            </div>
                            <div className="glass-chip">
                                <Activity className={`w-3 h-3 ${isFocusMode ? 'text-orange-400' : 'text-cyan-400'}`} />
                                {isFocusMode ? 'Focus Mode' : 'Full UI'}
                            </div>
                            <div className="glass-chip">
                                {isVoiceMode ? <Mic className="w-3 h-3 text-cyan-400" /> : <MicOff className="w-3 h-3 text-slate-500" />}
                                {isVoiceMode ? 'Voice Ready' : 'Voice Off'}
                            </div>
                            <div className="glass-chip" title="Model Context Protocol tools ready for natural requests (e.g. 'create a task for tomorrow')">
                                <Sparkles className="w-3 h-3 text-purple-300" />
                                MCP Connected · Just ask
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 items-center">
                        <div className="hidden md:flex items-center gap-2">
                            <button onClick={() => setIsFocusMode(!isFocusMode)} className="glass-button text-[11px] font-black uppercase tracking-widest">
                                <Target className="w-4 h-4" />
                                {isFocusMode ? 'Exit Focus' : 'Focus'}
                            </button>
                            <button onClick={() => setIsDarkMode(!isDarkMode)} className="glass-button text-[11px] font-black uppercase tracking-widest">
                                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-500" />}
                                {isDarkMode ? 'Light' : 'Dark'}
                            </button>
                            <button onClick={() => setIsCommandPaletteOpen(true)} className="glass-button text-[11px] font-black uppercase tracking-widest">
                                <Sparkles className="w-4 h-4 text-cyan-400" />
                                Command
                            </button>
                            <button onClick={() => setIsQuickActionOpen(!isQuickActionOpen)} className="glass-button text-[11px] font-black uppercase tracking-widest">
                                <PlusCircle className="w-4 h-4 text-orange-400" />
                                Quick Add
                            </button>
                        </div>
                        <div className="relative">
                            <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="relative p-2 text-slate-400 hover:text-white transition-colors">
                                <Bell className="w-5 h-5" />
                                {notifications.some(n => !n.read) && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900"></span>}
                            </button>
                            <NotificationDropdown
                                isOpen={isNotificationsOpen}
                                notifications={notifications}
                                onClose={() => setIsNotificationsOpen(false)}
                                onMarkRead={(id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))}
                            />
                        </div>

                        {(view === 'workspace' || view === 'meetings' || view === 'pipeline' || view === 'tasks' || view === 'calendar' || view === 'clients' || view === 'memory') && (
                            <select
                                value={selectedCompanyId}
                                onChange={(e) => { setSelectedCompanyId(e.target.value); if (view === 'workspace') setWorkspaceMode(e.target.value === 'all' ? 'internal' : 'client'); }}
                                className="bg-slate-800 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500 max-w-[150px] truncate"
                            >
                                <option value="all">Internal / All</option>
                                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        )}
                        <div className="relative">
                            <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center font-bold text-white hover:bg-orange-400">{currentUser?.name[0]}</button>
                            {isUserMenuOpen && (
                                <div className="absolute right-0 top-10 w-48 bg-slate-800 border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
                                    <div className="px-4 py-3 border-b border-white/5">
                                        <div className="font-bold text-sm truncate">{currentUser?.name}</div>
                                        <div className="text-[10px] text-slate-400 truncate">{currentUser?.email}</div>
                                    </div>
                                    <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-full text-left px-4 py-3 hover:bg-white/5 text-sm flex items-center gap-2">
                                        <i className={`fas ${isDarkMode ? 'fa-sun text-yellow-400' : 'fa-moon text-slate-400'}`}></i> {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                                    </button>
                                    <button onClick={() => setIsFocusMode(!isFocusMode)} className="w-full text-left px-4 py-3 hover:bg-white/5 text-sm flex items-center gap-2">
                                        <i className={`fas ${isFocusMode ? 'fa-expand' : 'fa-compress'} text-blue-400`}></i> {isFocusMode ? 'Exit Focus' : 'Focus Mode'}
                                    </button>
                                    <button onClick={() => { setActiveModal('my_security'); setIsUserMenuOpen(false); setNewPassword(''); }} className="w-full text-left px-4 py-3 hover:bg-white/5 text-sm flex items-center gap-2 transition-all"><i className="fas fa-shield-alt text-cyan-400"></i> My Security</button>
                                    <div className="px-4 py-2 border-t border-white/5">
                                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Voice Assistant</div>
                                        <select
                                            className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-[10px] text-white focus:outline-none focus:border-cyan-500 custom-scrollbar"
                                            value={voiceService.current?.getVoice()?.name || ''}
                                            onChange={(e) => {
                                                voiceService.current.setVoice(e.target.value);
                                                addToast('info', `Voice: ${e.target.value.split(' ')[0]}`);
                                            }}
                                        >
                                            <option value="">Default Neural</option>
                                            {voiceService.current?.getVoices().map(v => (
                                                <option key={v.name} value={v.name}>{v.name.replace('Google', 'LYNX').replace('Microsoft', 'NEURAL')} ({v.lang})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <button onClick={() => { runDiagnostics(); setIsUserMenuOpen(false); }} className="w-full text-left px-4 py-3 hover:bg-white/5 text-sm flex items-center gap-2 transition-all"><i className="fas fa-stethoscope text-pink-400"></i> System Diagnostics</button>
                                    <button onClick={handleClearLicense} className="w-full text-left px-4 py-3 hover:bg-white/5 text-sm flex items-center gap-2 text-slate-400 hover:text-white"><i className="fas fa-key text-yellow-500"></i> Change License</button>
                                    <button onClick={() => { setCurrentUser(null); setIsUserMenuOpen(false); }} className="w-full text-left px-4 py-3 hover:bg-white/5 text-sm text-red-400 flex items-center gap-2"><i className="fas fa-sign-out-alt"></i> Logout</button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <div className="px-8 pt-3 pb-2 border-b border-white/5 hidden md:flex items-center gap-2 bg-gradient-to-r from-slate-900/40 to-slate-800/20 backdrop-blur-md">
                    {[
                        { label: 'Home', view: 'home' },
                        { label: 'Pipeline', view: 'pipeline' },
                        { label: 'Tasks', view: 'tasks' },
                        { label: 'Calendar', view: 'calendar' },
                        { label: 'Clients', view: 'clients' },
                        { label: 'Meetings', view: 'meetings' }
                    ].map(item => (
                        <button
                            key={item.view}
                            onClick={() => setView(item.view as any)}
                            className={`glass-chip hover:border-cyan-500/50 transition-all ${view === item.view ? 'text-orange-300 border-orange-500/40' : ''}`}
                        >
                            {item.label}
                        </button>
                    ))}
                    <div className="flex items-center gap-2 ml-auto">
                        <div className="glass-chip">
                            <Clock className="w-3 h-3 text-amber-300" />
                            {nextMeeting ? `Next: ${new Date(nextMeeting.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'No upcoming meeting'}
                        </div>
                        <div className="glass-chip">
                            <Sparkles className="w-3 h-3 text-cyan-300" />
                            Command: Ctrl + K
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 scroll-smooth relative">
                    <Suspense fallback={<div className="flex items-center justify-center h-full"><i className="fas fa-spinner fa-spin text-cyan-400 text-2xl"></i></div>}>
                        <AnimatePresence mode="wait">
                            {(() => {
                                const commonPanelProps = {
                                    companies,
                                    deals,
                                    tasks,
                                    auditLogs,
                                    users,
                                    currentUser,
                                    selectedCompanyId,
                                    activeClient,
                                    isDarkMode,
                                    isLoading,
                                    onSetView: (v: any) => setView(v),
                                    onLogAction: (action: string, target: string) => setAuditLogs(prev => [{ id: Date.now().toString(), userId: currentUser?.id || 'system', action, target, timestamp: Date.now() }, ...prev] as any),
                                    onAddToast: addToast,
                                    isVoiceContinuityEnabled,
                                    onToggleVoiceContinuity: setIsVoiceContinuityEnabled,
                                    messages,
                                    input,
                                    onSetInput: setInput,
                                    onSubmitMessage: submitMessage,
                                    messagesEndRef: chatEndRef,
                                    billingRecords,
                                    contracts,
                                    onMoveTask: handleMoveTask,
                                    onSetModalData: setModalData,
                                    onSetActiveModal: setActiveModal,
                                    isMapView,
                                    onSetIsMapView: setIsMapView,
                                    offerings: MOCK_PRODUCTS,
                                    meetings,
                                    calYear: currentDate.getFullYear(),
                                    calMonth: currentDate.getMonth(),
                                    monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                                    firstDay: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(),
                                    days: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate(),
                                    onSetCurrentDate: setCurrentDate,
                                    onMeetingClick: handleMeetingClick,
                                    onMemoryUpload: handleMemoryUpload,
                                    // Additional props for extended views
                                    tickets,
                                    onUpdateTicket: (id: string, updates: any) => setTickets(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t)),
                                    kpiGoals,
                                    onUpdateKpiGoal: (id: string, current: number) => setKpiGoals(prev => prev.map(g => g.id === id ? { ...g, current } : g)),
                                    projects,
                                    expenses,
                                    timeEntries,
                                    csatResponses,
                                    onSendSurvey: () => addToast('info', 'Survey feature coming soon'),
                                    invoices,
                                    onSaveInvoice: (inv: any) => setInvoices(prev => [...prev, inv]),
                                    esignRequests,
                                    assets,
                                    wikiPages,
                                    orgContacts,
                                    featureRequests,
                                    partners,
                                    customFields,
                                    activities,
                                    onLogActivity: () => setActiveModal('log_activity'),
                                    onboardingChecklists,
                                    onToggleOnboardingItem: (checklistId: string, itemId: string) => {
                                        setOnboardingChecklists(prev => prev.map(c => 
                                            c.id === checklistId 
                                                ? { ...c, items: c.items.map(i => i.id === itemId ? { ...i, completed: !i.completed } : i) }
                                                : c
                                        ));
                                    },
                                    onCreateOnboardingChecklist: () => setActiveModal('create_onboarding'),
                                    emailSequences,
                                    onCreateSequence: () => setActiveModal('create_sequence'),
                                    onToggleSequenceStatus: (id: string) => setEmailSequences(prev => prev.map(s => s.id === id ? { ...s, status: s.status === 'active' ? 'paused' : 'active' } : s)),
                                    vendors,
                                    onAddVendor: () => setActiveModal('add_vendor'),
                                    complianceItems,
                                    docVersions,
                                    onRestoreVersion: (versionId: string) => addToast('info', `Restored version ${versionId}`),
                                    onAddExpense: () => setActiveModal('add_expense'),
                                    workspaceItems,
                                } as any;

                                return (
                                    <motion.div
                                        key={view === 'workspace' ? `workspace-${selectedCompanyId}` : view}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                        className="h-full"
                                    >
                                        {view === 'home' && (
                                            <HomeView
                                                contracts={contracts}
                                                deals={deals}
                                                tasks={tasks}
                                                users={users}
                                                auditLogs={auditLogs}
                                                meetings={meetings}
                                                nextMeeting={nextMeeting}
                                                setView={(v: any) => setView(v)}
                                                moveTask={(id: string, stage: any) => handleMoveTask(id, stage)}
                                                scratchpad={scratchpad}
                                                setScratchpad={setScratchpad}
                                                scratchpadSavedAt={scratchpadSavedAt}
                                            />
                                        )}

                                        {view === 'workspace' && workspaceMode === 'internal' && (
                                            <ManagementPanel
                                                {...commonPanelProps}
                                                view="workspace"
                                                workspaceMode="internal"
                                                internalTab={internalTab}
                                                onSetInternalTab={setInternalTab}
                                                products={products}
                                                salesPipeline={salesPipeline}
                                                onMoveTask={handleMoveTask}
                                                onSaveDeal={(d) => { setModalData(d); setActiveModal('save_deal'); }}
                                                onSaveTask={(t) => { setModalData(t); setActiveModal('save_task'); }}
                                                onSaveProduct={(p) => { setModalData(p); setActiveModal('save_product'); }}
                                                onSaveOffering={(o) => { setModalData(o); setActiveModal('save_offering'); }}
                                                onSaveUser={(u) => { setModalData(u); setActiveModal('save_user'); }}
                                                businessProfile={businessProfile}
                                                onUpdateProfile={setBusinessProfile}
                                                automations={automations}
                                                onSaveAutomation={(a) => { setModalData(a); setActiveModal('save_automation'); }}
                                                onDeleteAutomation={deleteAutomation}
                                                onToggleAutomation={toggleAutomation}
                                                onResetPassword={(u) => { setModalData(u); setAdminPasswordInput(''); setActiveModal('admin_reset_password'); }}
                                            />
                                        )}

                                        {view === 'workspace' && workspaceMode === 'client' && selectedCompanyId !== 'all' && (
                                            <ManagementPanel
                                                {...commonPanelProps}
                                                view="workspace"
                                                workspaceMode="client"
                                                clientWorkspaceTab={clientWorkspaceTab}
                                                onSetClientWorkspaceTab={setClientWorkspaceTab}
                                                onSetWorkspaceMode={setWorkspaceMode}
                                                onRunEOMBilling={runEOMBilling}
                                            />
                                        )}

                                        {view === 'clients' && <ClientsView companies={companies} deals={deals} contracts={contracts} isMapView={isMapView} setIsMapView={setIsMapView} setModalData={setModalData} setActiveModal={setActiveModal} isDarkMode={isDarkMode} />}
                                        {view === 'pipeline' && <ManagementPanel view="pipeline" {...commonPanelProps} draggedDealId={draggedDealId} onDealDragStart={(e, id) => setDraggedDealId(id)} onDealDragOver={(e) => e.preventDefault()} onDealDrop={(e, stage) => { const deal = deals.find(d => d.id === draggedDealId); if (deal) setDeals(deals.map(d => d.id === draggedDealId ? { ...d, stage } : d)); setDraggedDealId(null); }} onMoveDeal={(id, stage) => setDeals(deals.map(d => d.id === id ? { ...d, stage } : d))} onAddDeal={() => setActiveModal('save_deal')} onDealExport={() => { }} />}
                                        {view === 'tasks' && <TasksView tasks={tasks} setTasks={setTasks} currentUser={currentUser} selectedCompanyId={selectedCompanyId} taskFilter={taskFilter} selectedTasks={selectedTasks} setSelectedTasks={setSelectedTasks} moveTask={handleMoveTask} handleTaskExport={() => { }} addToast={addToast} setModalData={setModalData} setActiveModal={setActiveModal} />}
                                        {view === 'meetings' && <ManagementPanel view="meetings" {...commonPanelProps} />}
                                        {view === 'calendar' && <CalendarView calYear={currentDate.getFullYear()} calMonth={currentDate.getMonth()} monthNames={['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']} firstDay={new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()} days={new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()} onSetCurrentDate={setCurrentDate} meetings={meetings} onMeetingClick={handleMeetingClick} />}
                                        {view === 'chat' && (
                                            <ManagementPanel
                                                view="chat"
                                                {...commonPanelProps}
                                            />
                                        )}
                                        {view === 'memory' && <MemoryView memory={memories} onMemoryUpload={handleMemoryUpload} onSetActiveModal={setActiveModal} />}
                                        {view === 'tickets' && <ManagementPanel view="tickets" tickets={tickets} onSaveTicket={(t) => { setModalData(t); setActiveModal('save_ticket'); }} setInternalTab={setInternalTab} {...commonPanelProps} />}
                                        {['forecast', 'alerts', 'winloss', 'kpis', 'velocity', 'profitability', 'utilization', 'csat'].includes(view) && (
                                            <ManagementPanel
                                                {...commonPanelProps}
                                                view={view}
                                                tab={view as any}
                                                salesPipeline={salesPipeline}
                                                tickets={tickets}
                                            />
                                        )}
                                        {['invoices', 'esign', 'assets', 'wiki', 'orgchart', 'roadmap', 'partners', 'customfields'].includes(view) && (
                                            <ManagementPanel
                                                {...commonPanelProps}
                                                view={view}
                                                tab={view as any}
                                                businessProfile={businessProfile}
                                            />
                                        )}
                                        {['activity', 'onboarding', 'sequences', 'vendors', 'portal', 'expenses', 'compliance', 'versions'].includes(view) && (
                                            <ManagementPanel
                                                {...commonPanelProps}
                                                view={view}
                                                tab={view as any}
                                            />
                                        )}
                                    </motion.div>
                                );
                            })()}
                        </AnimatePresence>
                    </Suspense>
                </div>
            </main>

            <AnimatePresence>
                {activeModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 rounded-3xl glass-card border border-white/10 shadow-2xl relative ${isDarkMode ? 'bg-slate-900/40 text-white' : 'bg-white text-slate-800'}`}
                        >
                            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X className="w-6 h-6" /></button>

                            {activeModal === 'save_automation' && (
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold">New Automation Workflow</h3>
                                    <input className="w-full p-3 bg-black/20 rounded border border-white/10" placeholder="Rule Name (e.g. QuickBooks Invoice)" value={modalData.name || ''} onChange={e => setModalData({ ...modalData, name: e.target.value })} />
                                    <div>
                                        <label className="text-xs text-slate-500 uppercase mb-1 block">Trigger Event</label>
                                        <select className="w-full p-3 bg-black/20 rounded border border-white/10 text-slate-300" value={modalData.event || 'deal_won'} onChange={e => setModalData({ ...modalData, event: e.target.value })}>
                                            <option value="DEAL_WON">Deal Won</option>
                                            <option value="CONTRACT_CREATED">Contract Created</option>
                                            <option value="CLIENT_ADDED">Client Added</option>
                                        </select>
                                    </div>
                                    <input className="w-full p-3 bg-black/20 rounded border border-white/10 font-mono text-sm" placeholder="n8n Webhook URL" value={modalData.webhookUrl || ''} onChange={e => setModalData({ ...modalData, webhookUrl: e.target.value })} />
                                    <button onClick={saveAutomationRule} className="w-full py-3 bg-cyan-600 rounded font-bold text-white mt-4">Save & Activate</button>
                                </div>
                            )}

                            {activeModal === 'save_deal' && (
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold">New Deal Opportunity</h3>
                                    <input className="w-full p-3 bg-black/20 rounded border border-white/10" placeholder="Deal Title (e.g. Q3 Migration)" value={modalData.title || ''} onChange={e => setModalData({ ...modalData, title: e.target.value })} />
                                    <select className="w-full p-3 bg-black/20 rounded border border-white/10 text-slate-300" value={modalData.companyId || (selectedCompanyId !== 'all' ? selectedCompanyId : '')} onChange={e => setModalData({ ...modalData, companyId: e.target.value })}>
                                        <option value="">Select Client...</option>
                                        {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="number" className="p-3 bg-black/20 rounded border border-white/10" placeholder="Value ($)" value={modalData.value || ''} onChange={e => setModalData({ ...modalData, value: e.target.value })} />
                                        <input type="number" className="p-3 bg-black/20 rounded border border-white/10" placeholder="Probability (%)" value={modalData.probability || '20'} onChange={e => setModalData({ ...modalData, probability: e.target.value })} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <select className="p-3 bg-black/20 rounded border border-white/10 text-slate-300" value={modalData.stage || 'qualification'} onChange={e => setModalData({ ...modalData, stage: e.target.value })}>
                                            <option value="qualification">Qualification</option>
                                            <option value="proposal">Proposal</option>
                                            <option value="negotiation">Negotiation</option>
                                            <option value="closed_won">Closed Won</option>
                                            <option value="closed_lost">Closed Lost</option>
                                        </select>
                                        <input type="date" className="p-3 bg-black/20 rounded border border-white/10 text-slate-300" value={modalData.expectedCloseDate || ''} onChange={e => setModalData({ ...modalData, expectedCloseDate: e.target.value })} />
                                    </div>
                                    <textarea className="w-full p-3 bg-black/20 rounded border border-white/10 h-24" placeholder="Notes / Next Steps" value={modalData.notes || ''} onChange={e => setModalData({ ...modalData, notes: e.target.value })} />
                                    <button onClick={saveDeal} className="w-full py-3 bg-orange-600 rounded font-bold text-white">Create Deal</button>
                                </div>
                            )
                            }

                            {
                                activeModal === 'diagnostics' && (
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold mb-4">System Diagnostics</h3>
                                        <div className="space-y-3">
                                            {testResults.map((result) => (
                                                <div key={result.id} className="flex items-center gap-4 p-3 bg-black/30 rounded border border-white/5">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${result.status === 'pass' ? 'bg-green-500' : result.status === 'fail' ? 'bg-red-500' : 'bg-yellow-500'}`}>
                                                        {result.status === 'pass' ? <Check className="w-4 h-4" /> : result.status === 'fail' ? <XIcon className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-bold text-sm">{result.name}</div>
                                                        <div className="text-xs text-slate-400">{result.message}</div>
                                                    </div>
                                                    <div className="text-[10px] uppercase font-bold text-slate-500">{result.category}</div>
                                                </div>
                                            ))}
                                            {testResults.length === 0 && <div className="text-center text-slate-500 py-4"><Loader className="w-6 h-6 animate-spin mx-auto mb-2" /> Initializing Tests...</div>}
                                        </div>
                                        <button onClick={() => setActiveModal(null)} className="w-full py-3 bg-slate-700 rounded font-bold text-white mt-4">Close Report</button>
                                    </div>
                                )
                            }

                            {
                                activeModal === 'add_user' && (
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold">Add Team Member</h3>
                                        <input className="w-full p-3 bg-black/20 rounded border border-white/10" placeholder="Full Name" value={modalData.name || ''} onChange={e => setModalData({ ...modalData, name: e.target.value })} />
                                        <input className="w-full p-3 bg-black/20 rounded border border-white/10" placeholder="Email Address" value={modalData.email || ''} onChange={e => setModalData({ ...modalData, email: e.target.value })} />
                                        <select className="w-full p-3 bg-black/20 rounded border border-white/10 text-slate-300" value={modalData.role || 'worker'} onChange={e => setModalData({ ...modalData, role: e.target.value })}>
                                            <option value="worker">Worker</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                        <input className="w-full p-3 bg-black/20 rounded border border-white/10" type="password" placeholder="Set Password" value={adminPasswordInput} onChange={e => setAdminPasswordInput(e.target.value)} />
                                        <button onClick={generateSecurePassword} className="text-xs text-cyan-400 hover:underline">Generate Secure Password</button>
                                        <button onClick={addUser} className="w-full py-3 bg-orange-600 rounded font-bold text-white mt-4">Create Account</button>
                                    </div>
                                )
                            }

                            {
                                activeModal === 'draft_email' && (
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold">AI Email Drafter</h3>
                                        <select className="w-full p-3 bg-black/20 rounded border border-white/10 text-slate-300" value={modalData.recipient || ''} onChange={e => setModalData({ ...modalData, recipient: e.target.value, recipientName: companies.find(c => c.id === e.target.value)?.name })}>
                                            <option value="">Select Recipient...</option>
                                            {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                        <input className="w-full p-3 bg-black/20 rounded border border-white/10" placeholder="Topic / Subject" value={modalData.topic || ''} onChange={e => setModalData({ ...modalData, topic: e.target.value })} />
                                        <div className="grid grid-cols-2 gap-4">
                                            <select className="p-3 bg-black/20 rounded border border-white/10 text-slate-300" value={modalData.tone || 'Professional'} onChange={e => setModalData({ ...modalData, tone: e.target.value })}>
                                                <option value="Professional">Professional</option>
                                                <option value="Friendly">Friendly</option>
                                                <option value="Urgent">Urgent</option>
                                                <option value="Sales">Sales</option>
                                            </select>
                                            <input className="p-3 bg-black/20 rounded border border-white/10" placeholder="Key Points (comma sep)" value={modalData.keyPoints || ''} onChange={e => setModalData({ ...modalData, keyPoints: e.target.value })} />
                                        </div>
                                        <div className="flex justify-end">
                                            <button onClick={handleGenerateEmail} disabled={isLoading} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded text-xs font-bold text-white hover:shadow-lg transition-all">
                                                {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <><Sparkles className="w-4 h-4 mr-2" /> Generate Draft</>}
                                            </button>
                                        </div>
                                        <textarea className="w-full p-4 bg-black/20 rounded border border-white/10 h-48 font-mono text-sm" placeholder="Generated content will appear here..." value={modalData.content || ''} onChange={e => setModalData({ ...modalData, content: e.target.value })} />
                                        <div className="flex gap-4">
                                            <button onClick={saveDraftEmail} className="flex-1 py-3 bg-slate-700 rounded font-bold text-white">Save Draft</button>
                                            <button onClick={() => { saveDraftEmail(); addToast('success', 'Email Sent!'); }} className="flex-1 py-3 bg-green-600 rounded font-bold text-white"><Send className="w-4 h-4 mr-2" /> Send Now</button>
                                        </div>
                                    </div>
                                )
                            }

                            {
                                activeModal === 'manage_templates' && (
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold">Manage Templates</h3>
                                        <div className="space-y-2 max-h-64 overflow-y-auto">
                                            {MOCK_TEMPLATES.map(tpl => (
                                                <div key={tpl.id} className="flex justify-between items-center p-3 bg-black/20 rounded border border-white/10">
                                                    <div>
                                                        <div className="font-bold text-sm">{tpl.title}</div>
                                                        <div className="text-xs text-slate-500">{tpl.category}</div>
                                                    </div>
                                                    <button className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                            ))}
                                        </div>
                                        <button className="w-full py-3 bg-slate-700 rounded font-bold text-white mt-4"><Plus className="w-4 h-4 mr-2" /> Add New Template</button>
                                    </div>
                                )
                            }

                            {
                                activeModal === 'save_memory' && (
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold">Add Mental Note</h3>
                                        <textarea className="w-full p-4 bg-black/20 rounded border border-white/10 h-32" placeholder="Enter note content..." value={modalData.content || ''} onChange={e => setModalData({ ...modalData, content: e.target.value })}></textarea>
                                        <button onClick={saveManualMemory} className="w-full py-3 bg-purple-600 rounded font-bold text-white">Save Note</button>
                                    </div>
                                )
                            }

                            {
                                activeModal === 'save_task' && (
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold">New Task</h3>
                                        <input className="w-full p-3 bg-black/20 rounded border border-white/10" placeholder="Task Title" value={modalData.title || ''} onChange={e => setModalData({ ...modalData, title: e.target.value })} />
                                        <div className="grid grid-cols-2 gap-4">
                                            <select className="w-full p-3 bg-black/20 rounded border border-white/10 text-slate-300" value={modalData.clientId || ''} onChange={e => setModalData({ ...modalData, clientId: e.target.value })}>
                                                <option value="">Select Client...</option>
                                                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                            <select className="w-full p-3 bg-black/20 rounded border border-white/10 text-slate-300" value={modalData.dealId || ''} onChange={e => setModalData({ ...modalData, dealId: e.target.value })} disabled={!modalData.clientId}>
                                                <option value="">Link to Deal (Optional)</option>
                                                {deals.filter(d => d.companyId === modalData.clientId).map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input type="date" className="w-full p-3 bg-black/20 rounded border border-white/10 text-slate-300" value={modalData.dueDate || ''} onChange={e => setModalData({ ...modalData, dueDate: e.target.value })} />
                                            <select className="w-full p-3 bg-black/20 rounded border border-white/10 text-slate-300" value={modalData.priority || 'medium'} onChange={e => setModalData({ ...modalData, priority: e.target.value })}>
                                                <option value="low">Low Priority</option>
                                                <option value="medium">Medium Priority</option>
                                                <option value="high">High Priority</option>
                                            </select>
                                        </div>
                                        <div className="flex items-center gap-2 p-2 bg-black/20 rounded border border-white/10">
                                            <input type="checkbox" checked={modalData.recurring || false} onChange={e => setModalData({ ...modalData, recurring: e.target.checked })} />
                                            <span className="text-sm text-slate-300">Recurring?</span>
                                            {modalData.recurring && (
                                                <select className="ml-auto bg-slate-700 rounded text-xs p-1" value={modalData.recurringInterval || 'weekly'} onChange={e => setModalData({ ...modalData, recurringInterval: e.target.value })}>
                                                    <option value="daily">Daily</option>
                                                    <option value="weekly">Weekly</option>
                                                    <option value="monthly">Monthly</option>
                                                </select>
                                            )}
                                        </div>
                                        <button onClick={saveTask} className="w-full py-3 bg-orange-600 rounded font-bold text-white">Create Task</button>
                                    </div>
                                )
                            }

                            {
                                activeModal === 'save_company' && (
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold">{modalData.id ? 'Edit Company' : 'New Company'}</h3>
                                        <input className="w-full p-3 bg-black/20 rounded border border-white/10" placeholder="Company Name" value={modalData.name || ''} onChange={e => setModalData({ ...modalData, name: e.target.value })} />
                                        <input className="w-full p-3 bg-black/20 rounded border border-white/10" placeholder="Address" value={modalData.address || ''} onChange={e => setModalData({ ...modalData, address: e.target.value })} />
                                        <div className="grid grid-cols-2 gap-4">
                                            <input className="p-3 bg-black/20 rounded border border-white/10" placeholder="Phone" value={modalData.phone || ''} onChange={e => setModalData({ ...modalData, phone: e.target.value })} />
                                            <input className="p-3 bg-black/20 rounded border border-white/10" placeholder="Website" value={modalData.website || ''} onChange={e => setModalData({ ...modalData, website: e.target.value })} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input className="p-3 bg-black/20 rounded border border-white/10" placeholder="Industry" value={modalData.industry || ''} onChange={e => setModalData({ ...modalData, industry: e.target.value })} />
                                            <input className="p-3 bg-black/20 rounded border border-white/10" type="number" placeholder="Annual Revenue" value={modalData.revenue || ''} onChange={e => setModalData({ ...modalData, revenue: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-500 uppercase mb-1 block">Status</label>
                                            <select className="w-full p-3 bg-black/20 rounded border border-white/10 text-white" value={modalData.status || 'active'} onChange={e => setModalData({ ...modalData, status: e.target.value })}>
                                                <option value="active">Active</option>
                                                <option value="lead">Lead</option>
                                                <option value="inactive">Inactive</option>
                                            </select>
                                        </div>
                                        <button onClick={saveCompany} className="w-full py-3 bg-blue-600 rounded font-bold text-white mt-2">Save Company</button>
                                    </div>
                                )
                            }

                            {
                                activeModal === 'save_client' && (
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold">New Contact</h3>
                                        <select className="w-full p-3 bg-black/20 rounded border border-white/10 text-slate-300" value={modalData.companyId || ''} onChange={e => setModalData({ ...modalData, companyId: e.target.value })}>
                                            <option value="">Select Company...</option>
                                            {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                        <input className="w-full p-3 bg-black/20 rounded border border-white/10" placeholder="Full Name" value={modalData.name || ''} onChange={e => setModalData({ ...modalData, name: e.target.value })} />
                                        <input className="w-full p-3 bg-black/20 rounded border border-white/10" placeholder="Email" value={modalData.email || ''} onChange={e => setModalData({ ...modalData, email: e.target.value })} />
                                        <input className="w-full p-3 bg-black/20 rounded border border-white/10" placeholder="Role / Position" value={modalData.role || ''} onChange={e => setModalData({ ...modalData, role: e.target.value })} />
                                        <button onClick={saveClient} className="w-full py-3 bg-cyan-600 rounded font-bold text-white">Save Contact</button>
                                    </div>
                                )
                            }

                            {
                                activeModal === 'reset_password' && (
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold">Reset Password for {modalData.name}</h3>
                                        <input className="w-full p-3 bg-black/20 rounded border border-white/10" type="password" placeholder="New Password" value={adminPasswordInput} onChange={e => setAdminPasswordInput(e.target.value)} />
                                        <button onClick={generateSecurePassword} className="text-xs text-cyan-400 hover:underline">Generate Secure Password</button>
                                        <button onClick={adminResetPassword} className="w-full py-3 bg-yellow-600 rounded font-bold text-white mt-4">Update Password</button>
                                    </div>
                                )
                            }

                            {
                                activeModal === 'my_security' && (
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold">Update My Security</h3>
                                        <input className="w-full p-3 bg-black/20 rounded border border-white/10" type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                                        <button onClick={handleChangePassword} className="w-full py-3 bg-green-600 rounded font-bold text-white mt-4">Change Password</button>
                                    </div>
                                )
                            }

                            {
                                activeModal === 'add_product' && (
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold">{modalData.id ? 'Edit Product' : 'Add New Product'}</h3>
                                        <input className="w-full p-3 bg-black/20 rounded border border-white/10" placeholder="Product Name" value={modalData.name || ''} onChange={e => setModalData({ ...modalData, name: e.target.value })} />
                                        <div className="flex gap-4">
                                            <input className="w-1/2 p-3 bg-black/20 rounded border border-white/10" placeholder="SKU" value={modalData.sku || ''} onChange={e => setModalData({ ...modalData, sku: e.target.value })} />
                                            <input className="w-1/2 p-3 bg-black/20 rounded border border-white/10" type="number" placeholder="Price" value={modalData.price || ''} onChange={e => setModalData({ ...modalData, price: e.target.value })} />
                                        </div>
                                        <textarea className="w-full p-3 bg-black/20 rounded border border-white/10 h-24" placeholder="Description" value={modalData.description || ''} onChange={e => setModalData({ ...modalData, description: e.target.value })} />
                                        <div className="grid grid-cols-3 gap-4">
                                            <select className="p-3 bg-black/20 rounded border border-white/10 text-slate-300" value={modalData.category || 'service'} onChange={e => setModalData({ ...modalData, category: e.target.value })}>
                                                <option value="service">Service</option>
                                                <option value="software">Software</option>
                                                <option value="hardware">Hardware</option>
                                            </select>
                                            <select className="p-3 bg-black/20 rounded border border-white/10 text-slate-300" value={modalData.billingTiming || 'net_term'} onChange={e => setModalData({ ...modalData, billingTiming: e.target.value })}>
                                                <option value="net_term">Net Terms</option>
                                                <option value="immediate">Immediate</option>
                                            </select>
                                            <select className="p-3 bg-black/20 rounded border border-white/10 text-slate-300" value={modalData.recurringInterval || 'one_time'} onChange={e => setModalData({ ...modalData, recurringInterval: e.target.value })}>
                                                <option value="one_time">One Time</option>
                                                <option value="monthly">Monthly</option>
                                                <option value="yearly">Yearly</option>
                                            </select>
                                        </div>
                                        <button onClick={saveProduct} className="w-full py-3 bg-cyan-600 rounded font-bold text-white mt-4">Save Product</button>
                                    </div>
                                )
                            }

                            {
                                activeModal === 'contract_builder' && (
                                    <ContractBuilder
                                        isOpen={true}
                                        onClose={() => setActiveModal(null)}
                                        selectedCompanyId={selectedCompanyId !== 'all' ? selectedCompanyId : 'unknown'}
                                        companies={companies}
                                        products={products}
                                        businessProfile={businessProfile}
                                        contractTaxRate={contractTaxRate}
                                        editingContractId={editingContractId}
                                        initialData={{
                                            title: contractBuilderTitle,
                                            startDate: contractStartDate,
                                            endDate: contractEndDate,
                                            paymentTerms: contractPaymentTerms,
                                            items: contractBuilderItems,
                                            discount: contractDiscount,
                                            terms: contractTerms
                                        }}
                                        onSave={handleSaveContract}
                                        onDraftTerms={handleDraftTerms}
                                        isLoading={isLoading}
                                    />
                                )
                            }
                        </motion.div >
                    </motion.div >
                )
                }
            </AnimatePresence>

            <CommandPalette
                isOpen={isCommandPaletteOpen}
                onClose={() => setIsCommandPaletteOpen(false)}
                onCommand={handleCommand}
                isVoiceMode={isVoiceMode}
                onToggleVoice={(v) => {
                    setIsVoiceMode(v);
                    if (v) setIsPTTActive(true);
                    else setIsPTTActive(false);
                }}
                isRecording={isPTTActive}
                isQuickActionOpen={isQuickActionOpen}
                onToggleQuickAction={setIsQuickActionOpen}
            />

            <KeyboardShortcuts isOpen={isShortcutsOpen} onClose={() => setIsShortcutsOpen(false)} />

            <AnimatePresence>
                {isEmptyStateModalOpen && (
                    <EmptyStateModal
                        isOpen={isEmptyStateModalOpen}
                        onClose={() => setIsEmptyStateModalOpen(false)}
                        view={view}
                        onAction={(action) => {
                            if (action === 'add_company') setActiveModal('save_company');
                            if (action === 'add_deal') setActiveModal('save_deal');
                            if (action === 'add_task') setActiveModal('save_task');
                            setIsEmptyStateModalOpen(false);
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Floating Chat Popup - shown on all views except chat */}
            {view !== 'chat' && (
                <>
                    {/* Chat Popup Window */}
                    <AnimatePresence>
                        {isChatPopupOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                                className="fixed bottom-24 right-6 w-96 h-[500px] bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-[100] flex flex-col overflow-hidden"
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-slate-800/50">
                                    <div className="flex items-center gap-2">
                                        <i className="fas fa-brain text-cyan-400"></i>
                                        <span className="text-sm font-black uppercase tracking-widest text-slate-300">NeuroLynx AI</span>
                                    </div>
                                    <button
                                        onClick={() => setIsChatPopupOpen(false)}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                                    {messages.length === 0 && (
                                        <div className="flex flex-col items-center justify-center h-full text-center">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500/20 to-cyan-500/20 flex items-center justify-center mb-3">
                                                <i className="fas fa-comments text-xl text-cyan-400"></i>
                                            </div>
                                            <p className="text-slate-400 text-xs">Ask NeuroLynx anything...</p>
                                        </div>
                                    )}
                                    {messages.map((msg, i) => (
                                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`p-3 rounded-xl max-w-[85%] text-sm ${msg.role === 'user' ? 'bg-orange-600' : 'bg-slate-800 border border-white/10'}`}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={chatEndRef}></div>
                                </div>

                                {/* Input */}
                                <div className="p-3 border-t border-white/10 bg-slate-800/30">
                                    <div className="flex gap-2">
                                        <input
                                            className="flex-1 p-3 rounded-xl bg-slate-800 border border-white/10 focus:border-cyan-500 outline-none text-white placeholder-slate-500 text-sm"
                                            value={input}
                                            onChange={e => setInput(e.target.value)}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    submitMessage();
                                                }
                                            }}
                                            placeholder="Type a message..."
                                        />
                                        <button
                                            onClick={submitMessage}
                                            className="px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 transition-all text-white"
                                            disabled={!input.trim()}
                                        >
                                            <i className="fas fa-paper-plane"></i>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Floating Chat Button */}
                    <button
                        onClick={() => setIsChatPopupOpen(!isChatPopupOpen)}
                        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-xl z-[100] flex items-center justify-center transition-all ${
                            isChatPopupOpen
                                ? 'bg-slate-800 border border-white/10 hover:bg-slate-700'
                                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:scale-110 shadow-cyan-500/30'
                        }`}
                    >
                        <i className={`fas ${isChatPopupOpen ? 'fa-times' : 'fa-comment-dots'} text-white text-lg`}></i>
                    </button>
                </>
            )}

            {toasts.map(toast => (
                <NotificationToast
                    key={toast.id}
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                />
            ))}
        </div>
    );
};

export default App;
