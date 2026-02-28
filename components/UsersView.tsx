import React from 'react';
import { User } from '../types';
import { Lock, Trash2 } from 'lucide-react';

interface UsersViewProps {
    users: User[];
    onAddUser: () => void;
    onResetPassword: (u: User) => void;
    onDeleteUser: (id: string) => void;
}

const UsersView: React.FC<UsersViewProps> = ({
    users, onAddUser, onResetPassword, onDeleteUser
}) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">User Management</h2>
                <button onClick={onAddUser} className="px-4 py-2 bg-orange-600 rounded text-xs font-bold shadow-lg shadow-orange-500/20">Add Member</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
                {users.map(u => (
                    <div key={u.id} className="bg-slate-800 p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-orange-500/20 transition-all">
                        <div className="flex items-center gap-4 mb-4">
                            <img src={u.avatar} alt={u.name} className="w-12 h-12 rounded-full border-2 border-orange-500/30" />
                            <div>
                                <div className="font-bold">{u.name}</div>
                                <div className="text-xs text-slate-400 font-mono">{u.email}</div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
                            <div className="text-[10px] uppercase font-bold text-orange-500 tracking-widest">{u.role}</div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                <button onClick={() => onResetPassword(u)} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors" title="Reset Password"><Lock className="w-4 h-4" /></button>
                                <button onClick={() => onDeleteUser(u.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-400 transition-colors" title="Delete User"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UsersView;
