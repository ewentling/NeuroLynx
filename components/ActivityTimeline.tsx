import React, { useState } from 'react';
import { ActivityEntry, Company, User } from '../types';

interface ActivityTimelineProps {
    activities: ActivityEntry[];
    companies: Company[];
    users: User[];
    onLogActivity: () => void;
}

const ACTIVITY_ICONS: Record<ActivityEntry['type'], { icon: string; color: string }> = {
    call: { icon: 'fa-phone', color: 'bg-green-500' },
    email: { icon: 'fa-envelope', color: 'bg-blue-500' },
    meeting: { icon: 'fa-users', color: 'bg-purple-500' },
    note: { icon: 'fa-sticky-note', color: 'bg-yellow-500' },
    deal_update: { icon: 'fa-chart-line', color: 'bg-orange-500' },
    task: { icon: 'fa-check-circle', color: 'bg-cyan-500' },
};

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities, companies, users, onLogActivity }) => {
    const [typeFilter, setTypeFilter] = useState<string>('all');

    const filtered = typeFilter === 'all' ? activities : activities.filter(a => a.type === typeFilter);
    const sorted = [...filtered].sort((a, b) => b.timestamp - a.timestamp);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Activity Timeline</h2>
                <div className="flex gap-2">
                    <select
                        className="bg-slate-800 border border-white/10 rounded px-3 py-2 text-xs font-bold"
                        value={typeFilter}
                        onChange={e => setTypeFilter(e.target.value)}
                    >
                        <option value="all">All Activities</option>
                        <option value="call">Calls</option>
                        <option value="email">Emails</option>
                        <option value="meeting">Meetings</option>
                        <option value="note">Notes</option>
                        <option value="deal_update">Deal Updates</option>
                        <option value="task">Tasks</option>
                    </select>
                    <button onClick={onLogActivity} className="px-4 py-2 bg-orange-600 rounded text-xs font-bold hover:bg-orange-500">
                        <i className="fas fa-plus mr-2"></i>Log Activity
                    </button>
                </div>
            </div>

            <div className="relative space-y-4 before:absolute before:left-[19px] before:top-6 before:bottom-0 before:w-0.5 before:bg-slate-700">
                {sorted.map(activity => {
                    const config = ACTIVITY_ICONS[activity.type];
                    const company = companies.find(c => c.id === activity.companyId);
                    const user = users.find(u => u.id === activity.userId);

                    return (
                        <div key={activity.id} className="relative pl-12 group">
                            <div className={`absolute left-0 top-1 w-10 h-10 rounded-full ${config.color} flex items-center justify-center text-white text-sm z-10 border-4 border-slate-900 shadow-lg`}>
                                <i className={`fas ${config.icon}`}></i>
                            </div>
                            <div className="bg-slate-800 p-4 rounded-xl border border-white/5 hover:border-white/15 transition-all">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${config.color}/20 text-white`}>
                                            {activity.type.replace('_', ' ')}
                                        </span>
                                        {company && <span className="text-[10px] text-slate-500 ml-2">{company.name}</span>}
                                    </div>
                                    <span className="text-xs text-slate-500 font-mono">{new Date(activity.timestamp).toLocaleString()}</span>
                                </div>
                                <div className="font-bold text-sm mb-1">{activity.title}</div>
                                <div className="text-xs text-slate-400">{activity.description}</div>
                                {user && <div className="text-[10px] text-slate-500 mt-2">by {user.name}</div>}
                            </div>
                        </div>
                    );
                })}
                {sorted.length === 0 && (
                    <div className="text-center p-12 text-slate-500">
                        <i className="fas fa-stream text-4xl mb-4 opacity-20"></i>
                        <div className="font-bold uppercase tracking-widest text-xs">No activities recorded</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivityTimeline;
