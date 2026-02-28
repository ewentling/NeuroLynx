import React, { useState, useRef, useEffect } from 'react';
import { TimeEntry, User, Company, Project } from '../types';

interface TimeTrackerProps {
    entries: TimeEntry[];
    users: User[];
    companies: Company[];
    projects: Project[];
    currentUserId: string;
    onAddEntry: (entry: Omit<TimeEntry, 'id'>) => void;
}

const TimeTracker: React.FC<TimeTrackerProps> = ({ entries, users, companies, projects, currentUserId, onAddEntry }) => {
    const [timerRunning, setTimerRunning] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const [description, setDescription] = useState('');
    const [selectedCompany, setSelectedCompany] = useState('');
    const [billable, setBillable] = useState(true);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (timerRunning) {
            intervalRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [timerRunning]);

    const formatTime = (secs: number) => {
        const h = Math.floor(secs / 3600);
        const m = Math.floor((secs % 3600) / 60);
        const s = secs % 60;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    const handleStop = () => {
        setTimerRunning(false);
        if (elapsed > 60 && description) {
            onAddEntry({ userId: currentUserId, companyId: selectedCompany || undefined, description, date: new Date().toISOString().split('T')[0], hours: parseFloat((elapsed / 3600).toFixed(2)), billable, rate: billable ? 175 : undefined });
            setDescription('');
            setElapsed(0);
        }
    };

    const totalHours = entries.reduce((s, e) => s + e.hours, 0);
    const billableHours = entries.filter(e => e.billable).reduce((s, e) => s + e.hours, 0);
    const billableRevenue = entries.filter(e => e.billable).reduce((s, e) => s + e.hours * (e.rate || 0), 0);

    // Group entries by date
    const byDate: Record<string, TimeEntry[]> = {};
    entries.forEach(e => { if (!byDate[e.date]) byDate[e.date] = []; byDate[e.date].push(e); });
    const sortedDates = Object.keys(byDate).sort((a, b) => b.localeCompare(a));

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Time Tracker</h2>

            {/* Timer Widget */}
            <div className="bg-slate-800 p-6 rounded-xl border border-white/5">
                <div className="flex items-center gap-4">
                    <input className="flex-1 bg-slate-900 border border-white/10 rounded p-3 text-sm" value={description} onChange={e => setDescription(e.target.value)} placeholder="What are you working on?" />
                    <select className="bg-slate-900 border border-white/10 rounded p-3 text-sm w-40" value={selectedCompany} onChange={e => setSelectedCompany(e.target.value)}>
                        <option value="">No client</option>
                        {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <button onClick={() => setBillable(!billable)} className={`px-3 py-2 rounded border text-xs font-bold ${billable ? 'border-green-500 text-green-400 bg-green-500/10' : 'border-slate-600 text-slate-500'}`}>
                        <i className="fas fa-dollar-sign mr-1"></i>{billable ? 'Billable' : 'Non-bill'}
                    </button>
                    <div className="font-mono text-2xl font-bold text-cyan-400 w-32 text-center">{formatTime(elapsed)}</div>
                    {!timerRunning ? (
                        <button onClick={() => setTimerRunning(true)} className="w-12 h-12 rounded-full bg-green-600 hover:bg-green-500 flex items-center justify-center shadow-lg"><i className="fas fa-play text-white"></i></button>
                    ) : (
                        <button onClick={handleStop} className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center shadow-lg"><i className="fas fa-stop text-white"></i></button>
                    )}
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800 p-6 rounded-xl border border-cyan-500/20 text-center">
                    <div className="text-3xl font-bold font-mono text-cyan-400">{totalHours.toFixed(1)}h</div>
                    <div className="text-[10px] uppercase text-slate-500 font-bold">Total Hours</div>
                </div>
                <div className="bg-slate-800 p-6 rounded-xl border border-green-500/20 text-center">
                    <div className="text-3xl font-bold font-mono text-green-400">{billableHours.toFixed(1)}h</div>
                    <div className="text-[10px] uppercase text-slate-500 font-bold">Billable Hours</div>
                </div>
                <div className="bg-slate-800 p-6 rounded-xl border border-orange-500/20 text-center">
                    <div className="text-2xl font-bold font-mono text-orange-400">${billableRevenue.toLocaleString()}</div>
                    <div className="text-[10px] uppercase text-slate-500 font-bold">Billable Revenue</div>
                </div>
            </div>

            {/* Timesheet */}
            <div className="space-y-4">
                {sortedDates.map(date => (
                    <div key={date} className="bg-slate-800 rounded-xl border border-white/5 overflow-hidden">
                        <div className="px-4 py-2 bg-black/20 flex justify-between items-center">
                            <span className="font-bold text-sm">{new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                            <span className="font-mono text-cyan-400 text-sm">{byDate[date].reduce((s, e) => s + e.hours, 0).toFixed(1)}h</span>
                        </div>
                        <div className="divide-y divide-white/5">
                            {byDate[date].map(entry => {
                                const user = users.find(u => u.id === entry.userId);
                                const company = companies.find(c => c.id === entry.companyId);
                                return (
                                    <div key={entry.id} className="flex items-center gap-4 px-4 py-3">
                                        <div className="flex-1">
                                            <div className="font-bold text-sm">{entry.description}</div>
                                            <div className="text-xs text-slate-400">{user?.name}{company ? ` • ${company.name}` : ''}</div>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${entry.billable ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'}`}>{entry.billable ? 'Billable' : 'Internal'}</span>
                                        <div className="font-mono text-sm w-16 text-right">{entry.hours}h</div>
                                        {entry.rate && <div className="font-mono text-xs text-slate-500 w-20 text-right">${(entry.hours * entry.rate).toLocaleString()}</div>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TimeTracker;
