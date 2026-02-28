import React, { useMemo } from 'react';
import { Task, Meeting, User } from '../types';

interface UtilizationViewProps {
    tasks: Task[];
    meetings: Meeting[];
    users: User[];
}

const UtilizationView: React.FC<UtilizationViewProps> = ({ tasks, meetings, users }) => {
    // Calculate utilization for the current week (simplified mock logic)
    const utilizationData = useMemo(() => {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());

        return users.map(user => {
            // Mock allocated hours based on tasks and meetings
            const userTasks = tasks.filter(t => t.assignedTo === user.id && t.status !== 'done');
            const userMeetings = meetings.filter(m => m.attendees.includes(user.name));

            const taskHours = userTasks.length * 4; // Estimate 4h per task
            const meetingHours = userMeetings.length * 1; // Estimate 1h per meeting
            const totalAllocated = taskHours + meetingHours;
            const capacity = 40;
            const utilization = Math.min(Math.round((totalAllocated / capacity) * 100), 120);

            return {
                id: user.id,
                name: user.name,
                role: user.role,
                allocated: totalAllocated,
                capacity,
                utilization,
                daily: [
                    Math.floor(Math.random() * 8), // Mon
                    Math.floor(Math.random() * 8), // Tue
                    Math.floor(Math.random() * 8), // Wed
                    Math.floor(Math.random() * 8), // Thu
                    Math.floor(Math.random() * 6), // Fri
                ]
            };
        });
    }, [tasks, meetings, users]);

    const getHeatColor = (hours: number) => {
        if (hours === 0) return 'bg-slate-800';
        if (hours < 4) return 'bg-cyan-900/40 text-cyan-400';
        if (hours < 7) return 'bg-cyan-600/60 text-white';
        if (hours < 9) return 'bg-orange-500/80 text-white';
        return 'bg-red-600 text-white';
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Resource Utilization</h2>

            <div className="bg-slate-800 rounded-xl border border-white/5 overflow-hidden">
                <div className="p-6 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="pb-4 font-bold text-xs uppercase text-slate-500">Team Member</th>
                                <th className="pb-4 font-bold text-xs uppercase text-slate-500 w-32">Utilization</th>
                                <th className="pb-4 font-bold text-xs uppercase text-slate-500 text-center">Mon</th>
                                <th className="pb-4 font-bold text-xs uppercase text-slate-500 text-center">Tue</th>
                                <th className="pb-4 font-bold text-xs uppercase text-slate-500 text-center">Wed</th>
                                <th className="pb-4 font-bold text-xs uppercase text-slate-500 text-center">Thu</th>
                                <th className="pb-4 font-bold text-xs uppercase text-slate-500 text-center">Fri</th>
                                <th className="pb-4 font-bold text-xs uppercase text-slate-500 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {utilizationData.map(row => (
                                <tr key={row.id} className="hover:bg-white/5 transition-colors">
                                    <td className="py-4">
                                        <div className="font-bold text-sm">{row.name}</div>
                                        <div className="text-[10px] text-slate-500 uppercase font-bold">{row.role}</div>
                                    </td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${row.utilization > 100 ? 'bg-red-500' : row.utilization > 80 ? 'bg-orange-500' : 'bg-cyan-500'}`}
                                                    style={{ width: `${Math.min(row.utilization, 100)}%` }}
                                                ></div>
                                            </div>
                                            <span className={`text-[10px] font-bold font-mono ${row.utilization > 100 ? 'text-red-400' : 'text-slate-400'}`}>{row.utilization}%</span>
                                        </div>
                                    </td>
                                    {row.daily.map((hours, i) => (
                                        <td key={i} className="py-4 text-center">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center m-auto text-xs font-bold border border-white/5 ${getHeatColor(hours)}`}>
                                                {hours}h
                                            </div>
                                        </td>
                                    ))}
                                    <td className="py-4 text-right font-mono font-bold text-white">
                                        {row.allocated}h
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-800 p-6 rounded-xl border border-white/5">
                    <h3 className="font-bold text-sm uppercase text-slate-500 mb-4">Legend</h3>
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-slate-800 border border-white/5"></div>
                            <span className="text-xs text-slate-400">Available</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-cyan-900/40 border border-white/5"></div>
                            <span className="text-xs text-slate-400">Light (1-3h)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-cyan-600/60 border border-white/5"></div>
                            <span className="text-xs text-slate-400">Normal (4-6h)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-orange-500/80 border border-white/5"></div>
                            <span className="text-xs text-slate-400">Target (7-8h)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-red-600 border border-white/5"></div>
                            <span className="text-xs text-slate-400">Overloaded (9h+)</span>
                        </div>
                    </div>
                </div>
                <div className="bg-slate-800 p-6 rounded-xl border border-white/5 flex flex-col justify-center">
                    <div className="text-sm text-slate-400 italic">
                        "Resource utilization is calculated based on active tasks (estimated 4h each) and scheduled meetings (1h each). Target utilization is 80-90% to prevent burnout while maintaining project profitability."
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UtilizationView;
