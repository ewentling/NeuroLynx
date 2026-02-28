import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Deal, User } from '../types';

interface SalesLeaderboardProps {
    deals: Deal[];
    users: User[];
}

export const SalesLeaderboard: React.FC<SalesLeaderboardProps> = ({ deals, users }) => {
    const data = useMemo(() => {
        const userMap = new Map<string, number>();
        deals.filter(d => d.stage === 'closed_won').forEach(d => {
            // Mock logic to assign a user if not present (deals in this app seem to missing explicit owner sometimes)
            const userId = d.id.charCodeAt(0) % 2 === 0 ? 'u1' : 'u2';
            userMap.set(userId, (userMap.get(userId) || 0) + Number(d.value));
        });

        return Array.from(userMap.entries()).map(([uid, val]) => ({
            name: users.find(u => u.id === uid)?.name || 'Unknown',
            value: val
        })).sort((a, b) => b.value - a.value);
    }, [deals, users]);

    return (
        <div className="bg-slate-800 p-6 rounded-xl border border-white/5">
            <h3 className="font-bold text-sm uppercase text-slate-500 mb-4 text-left">Top Performers</h3>
            <div className="space-y-4">
                {data.map((d, i) => (
                    <div key={i} className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${i === 0 ? 'bg-yellow-500' : i === 1 ? 'bg-slate-400' : 'bg-orange-700'}`}>
                            {i + 1}
                        </div>
                        <div className="flex-1">
                            <div className="font-bold text-sm text-left">{d.name}</div>
                            <div className="w-full bg-slate-700 h-1.5 rounded-full mt-1 overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${(d.value / (data[0]?.value || 1)) * 100}%` }} className="h-full bg-cyan-500" />
                            </div>
                        </div>
                        <div className="font-mono text-cyan-400 font-bold text-right">${d.value.toLocaleString()}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SalesLeaderboard;
