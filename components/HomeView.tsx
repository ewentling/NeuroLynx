import SalesLeaderboard from './SalesLeaderboard';
import { Company, Contract, Deal, Task, User, AuditLog, Meeting } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, FileText, CheckCircle, Zap, ShieldCheck, Activity, Users, Video, Calendar as CalendarIcon, ArrowUpRight, Clock } from 'lucide-react';

interface HomeViewProps {
    contracts: Contract[];
    deals: Deal[];
    tasks: Task[];
    users: User[];
    auditLogs: AuditLog[];
    meetings: Meeting[];
    setView: (view: string) => void;
    moveTask: (taskId: string, status: Task['status']) => void;
    scratchpad: string;
    setScratchpad: (val: string) => void;
    scratchpadSavedAt?: number | null;
}

const DashboardCard = ({ children, colorClass }: { children: React.ReactNode, colorClass: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-8 rounded-[2.5rem] bg-slate-800/40 border border-${colorClass}-500/20 relative overflow-hidden group hover:border-${colorClass}-500/50 transition-all duration-500 glass-card`}
    >
        <div className={`absolute -right-12 -top-12 w-48 h-48 bg-${colorClass}-500/10 rounded-full blur-3xl group-hover:bg-${colorClass}-500/20 transition-all duration-700`}></div>
        <div className="relative z-10">{children}</div>
    </motion.div>
);

const NeuralProgressBar = ({ label, value, target, color }: { label: string, value: number, target: number, color: string }) => {
    const percentage = Math.min(100, (value / target) * 100);
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-tighter text-slate-500">
                <span>{label}</span>
                <span className={`text-${color}-400`}>{percentage.toFixed(0)}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full bg-gradient-to-r from-${color}-600 to-${color}-400 shadow-[0_0_10px_rgba(var(--${color}-rgb),0.5)]`}
                ></motion.div>
            </div>
        </div>
    );
};

const HomeView: React.FC<HomeViewProps> = ({
    contracts, deals, tasks, users, auditLogs, meetings, setView, moveTask, scratchpad, setScratchpad, scratchpadSavedAt
}) => {
    const activeARR = contracts.filter(c => c.status === 'active').reduce((sum, c) => sum + c.totalValue, 0);
    const activeClients = new Set(contracts.filter(c => c.status === 'active').map(c => c.companyId)).size;
    const activeTasks = tasks.filter(t => t.status !== 'done').length;
    const openDeals = deals.filter(d => !d.stage.includes('closed'));
    const nextMeeting = meetings
        .map(m => ({ ...m, dateObj: new Date(m.date) }))
        .filter(m => m.dateObj.getTime() >= Date.now())
        .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime())[0];

    return (
        <div className="space-y-10 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black neuro-text-gradient tracking-tighter uppercase">Executive Cortex</h2>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1 flex items-center gap-2">
                        <Zap className="w-3 h-3 text-orange-500" /> Real-time Neural Sync Active
                    </p>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-green-500/5 border border-green-500/20 rounded-2xl shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-green-400 uppercase tracking-widest leading-none">Quantum Secure</span>
                        <span className="text-[8px] text-slate-500 font-bold uppercase mt-0.5">Neuro-Encrypted Channel</span>
                    </div>
                    <div className="ml-2 w-1.5 h-1.5 bg-green-500 rounded-full status-pulse"></div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 glass-card rounded-2xl border border-cyan-500/20 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-300">
                        <Users className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Active Clients</div>
                        <div className="text-xl font-black text-white">{activeClients}</div>
                    </div>
                </div>
                <div className="p-4 glass-card rounded-2xl border border-orange-500/20 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-300">
                        <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Open Deals</div>
                        <div className="text-xl font-black text-white">{openDeals.length}</div>
                    </div>
                </div>
                <div className="p-4 glass-card rounded-2xl border border-emerald-500/20 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-300">
                        <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Tasks In Motion</div>
                        <div className="text-xl font-black text-white">{activeTasks}</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 glass-card rounded-[2rem] border border-white/10 bg-gradient-to-r from-slate-900/70 to-slate-800/40 shadow-2xl relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-44 h-44 bg-cyan-500/10 rounded-full blur-3xl"></div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Next Meeting</div>
                            <div className="text-xl font-black text-white leading-tight">{nextMeeting ? nextMeeting.title : 'No upcoming meeting'}</div>
                            <div className="text-xs text-slate-400 mt-1">
                                {nextMeeting ? `${new Date(nextMeeting.date).toLocaleDateString()} • ${new Date(nextMeeting.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Schedule your next sync'}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <button onClick={() => setView('calendar')} className="glass-button text-[11px] font-black uppercase tracking-widest">
                                <CalendarIcon className="w-4 h-4 text-cyan-300" />
                                Open Calendar
                            </button>
                            <button onClick={() => setView('meetings')} className="glass-button text-[11px] font-black uppercase tracking-widest">
                                <Video className="w-4 h-4 text-emerald-300" />
                                Join Meeting Room
                            </button>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-4 text-xs text-slate-400 relative z-10">
                        <Clock className="w-4 h-4 text-amber-300" />
                        <span>{nextMeeting ? 'Prep assets and agenda before going live.' : 'Keep the pod aligned by scheduling today.'}</span>
                    </div>
                </div>

                <div className="p-6 glass-card rounded-[2rem] border border-white/10 bg-gradient-to-r from-orange-900/40 to-slate-900/40 shadow-2xl relative overflow-hidden">
                    <div className="absolute -left-10 -top-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl"></div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Pipeline Heat</div>
                            <div className="text-xl font-black text-white leading-tight">${openDeals.reduce((sum, d) => sum + d.value, 0).toLocaleString()} in motion</div>
                            <div className="text-xs text-slate-400 mt-1">Avg prob: {openDeals.length ? Math.round(openDeals.reduce((s, d) => s + (d.probability || 0), 0) / openDeals.length) : 0}%</div>
                        </div>
                        <button onClick={() => setView('pipeline')} className="glass-button text-[11px] font-black uppercase tracking-widest">
                            <ArrowUpRight className="w-4 h-4 text-orange-300" />
                            View Pipeline
                        </button>
                    </div>
                    <div className="mt-4 flex items-center gap-4 text-xs text-slate-400 relative z-10">
                        <ShieldCheck className="w-4 h-4 text-emerald-300" />
                        <span>Protect margin and unblock top three deals this week.</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DashboardCard colorClass="orange">
                    <div className="flex items-center gap-6 mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-orange-500/20 flex items-center justify-center text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.3)] group-hover:scale-110 transition-transform duration-500">
                            <TrendingUp className="w-7 h-7" />
                        </div>
                        <div>
                            <div className="text-[10px] uppercase text-slate-500 font-black tracking-widest">Revenue Core</div>
                            <div className="text-4xl font-black font-mono text-white mt-1 leading-none">${activeARR.toLocaleString()}</div>
                        </div>
                    </div>
                    <NeuralProgressBar label="Target Velocity" value={activeARR} target={1000000} color="orange" />
                </DashboardCard>

                <DashboardCard colorClass="cyan">
                    <div className="flex items-center gap-6 mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] group-hover:scale-110 transition-transform duration-500">
                            <FileText className="w-7 h-7" />
                        </div>
                        <div>
                            <div className="text-[10px] uppercase text-slate-500 font-black tracking-widest">Active Assets</div>
                            <div className="text-4xl font-black text-white mt-1 leading-none">{contracts.filter(c => c.status === 'active').length}</div>
                        </div>
                    </div>
                    <NeuralProgressBar label="Contract Health" value={activeARR} target={1500000} color="cyan" />
                </DashboardCard>

                <DashboardCard colorClass="blue">
                    <div className="flex items-center gap-6 mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)] group-hover:scale-110 transition-transform duration-500">
                            <CheckCircle className="w-7 h-7" />
                        </div>
                        <div>
                            <div className="text-[10px] uppercase text-slate-500 font-black tracking-widest">Operational Load</div>
                            <div className="text-4xl font-black text-white mt-1 leading-none">{activeTasks}</div>
                        </div>
                    </div>
                    <NeuralProgressBar label="Cycle Efficiency" value={85} target={100} color="blue" />
                </DashboardCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-1 bg-slate-900/40 rounded-[2rem] border border-white/5 p-8 flex flex-col glass-card"
                >
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="font-black text-[10px] uppercase text-slate-500 tracking-widest">Neural Tasks</h3>
                        <Activity className="w-4 h-4 text-orange-500" />
                    </div>
                    <div className="space-y-4 flex-1">
                        {tasks.filter(t => t.status !== 'done' && (t.priority === 'high' || (t.dueDate && new Date(t.dueDate) < new Date(Date.now() + 86400000 * 3)))).slice(0, 4).map(t => {
                            const dueDate = t.dueDate ? new Date(t.dueDate) : null;
                            const hoursRemaining = dueDate ? Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60)) : null;
                            const urgencyLabel = dueDate
                                ? (hoursRemaining !== null && hoursRemaining <= 24
                                    ? `${Math.max(1, hoursRemaining)}h left`
                                    : `${Math.max(1, Math.ceil(hoursRemaining! / 24))}d left`)
                                : 'No due date';
                            const urgencyTone = hoursRemaining !== null && hoursRemaining <= 24 ? 'text-amber-300 bg-amber-500/10 border-amber-400/30' : 'text-cyan-300 bg-cyan-500/10 border-cyan-400/30';
                            return (
                                <div key={t.id} className="p-4 bg-slate-800/40 rounded-2xl border border-white/5 flex justify-between items-center group hover:bg-white/5 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-2 h-2 rounded-full ${t.priority === 'high' ? 'bg-red-500 status-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-yellow-500'}`}></div>
                                        <div>
                                            <div className="font-black text-[11px] text-slate-200 uppercase tracking-tight flex items-center gap-2">
                                                {t.title}
                                                <span className={`px-2 py-1 text-[9px] font-black uppercase rounded-full border ${urgencyTone}`}>{urgencyLabel}</span>
                                            </div>
                                            <div className="text-[9px] font-bold text-slate-500 mt-0.5">{t.dueDate ? `DEADLINE: ${t.dueDate}` : 'NO DEADLINE'}</div>
                                        </div>
                                    </div>
                                    <button onClick={() => moveTask(t.id, 'done')} className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-slate-500 hover:border-green-500 hover:text-green-400 hover:bg-green-500/10 transition-all"><i className="fas fa-check text-xs"></i></button>
                                </div>
                            );
                        })}
                    </div>
                    <button onClick={() => setView('tasks')} className="mt-8 w-full py-3 bg-white/5 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:text-white transition-all tracking-widest">Access All Arrays</button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="lg:col-span-2 bg-slate-900/40 rounded-[2rem] border border-white/5 p-8 flex flex-col glass-card"
                >
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="font-black text-[10px] uppercase text-slate-500 tracking-widest">Recent Neural Activity</h3>
                        <button className="text-[10px] font-black text-cyan-400 uppercase tracking-widest hover:underline">Stream Log</button>
                    </div>
                    <div className="space-y-6 flex-1 overflow-y-auto max-h-[400px] pr-4 custom-scrollbar">
                        {auditLogs.slice(0, 10).map(log => (
                            <div key={log.id} className="flex gap-4 items-start group">
                                <div className="mt-1 w-10 h-10 rounded-[1rem] bg-slate-800 border border-white/5 flex items-center justify-center text-[10px] text-cyan-400 font-black shadow-inner group-hover:border-cyan-500/30 transition-all">
                                    {(users.find(u => u.id === log.userId)?.name || 'SYS')[0]}
                                </div>
                                <div className="flex-1 pb-4 border-b border-white/5 group-last:border-none">
                                    <div className="text-xs">
                                        <span className="font-black text-slate-200 uppercase tracking-tight">{users.find(u => u.id === log.userId)?.name || 'QUANTUM_CORE'}</span>
                                        <span className="text-slate-500 font-bold mx-1 lowercase"> executed </span>
                                        <span className="text-orange-400 font-black uppercase tracking-tight">{log.action.replace('_', ' ')}</span>
                                        <span className="text-slate-500 font-bold mx-1"> targeting </span>
                                        <span className="text-cyan-400 font-black uppercase tracking-tight">{log.target}</span>
                                    </div>
                                    <div className="text-[9px] text-slate-600 font-black mt-1 uppercase tracking-widest opacity-60">{new Date(log.timestamp).toLocaleTimeString()} // ID: {log.id.slice(-6)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-1 space-y-6"
                >
                    <SalesLeaderboard deals={deals} users={users} />
                    <div className="bg-slate-900/40 p-8 rounded-[2rem] border border-white/5 shadow-2x glass-card">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-black text-[10px] uppercase text-slate-500 tracking-widest">Sub-conscious Cache</h3>
                            <button onClick={() => setScratchpad('')} className="text-[9px] text-slate-600 hover:text-white uppercase font-black tracking-widest transition-colors">WIPE</button>
                        </div>
                        <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-3 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 status-pulse"></div>
                            Autosave {scratchpadSavedAt ? `@ ${new Date(scratchpadSavedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'never saved'}
                        </div>
                        <textarea
                            className="w-full bg-slate-800/30 rounded-2xl border border-white/5 p-6 text-xs font-mono text-slate-400 h-64 focus:outline-none focus:border-purple-500/50 resize-none transition-all placeholder-slate-700"
                            placeholder="Store neural fragments..."
                            value={scratchpad}
                            onChange={e => setScratchpad(e.target.value)}
                        ></textarea>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default HomeView;
