import React, { useState } from 'react';
import { User } from '../types';

interface LoginScreenProps {
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    onLogin: (user: User) => void;
    onClearLicense: () => void;
    isValidating: boolean;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ users, setUsers, onLogin, onClearLicense, isValidating }) => {
    const [email, setEmail] = useState('admin@neurolynx.ai');
    const [password, setPassword] = useState('password');
    const [error, setError] = useState('');

    const handleLogin = () => {
        if (isValidating) return;
        const userIndex = users.findIndex(u => u.email === email);
        if (userIndex === -1) { setError('User not found'); return; }
        const user = users[userIndex];
        const now = Date.now();
        if (user.lockoutUntil && user.lockoutUntil > now) {
            const minutesLeft = Math.ceil((user.lockoutUntil - now) / 60000);
            setError(`Account locked. Try again in ${minutesLeft} minutes.`);
            return;
        }
        if (user.password !== password) {
            const attempts = (user.failedAttempts || 0) + 1;
            const updatedUsers = [...users];
            if (attempts >= 3) {
                updatedUsers[userIndex] = { ...user, failedAttempts: attempts, lockoutUntil: now + 15 * 60000 };
                setError('Account locked for 15 minutes due to too many failed attempts.');
            } else {
                updatedUsers[userIndex] = { ...user, failedAttempts: attempts };
                setError(`Invalid password. Attempt ${attempts}/3`);
            }
            setUsers(updatedUsers);
            return;
        }
        const updatedUsers = [...users];
        updatedUsers[userIndex] = { ...user, failedAttempts: 0, lockoutUntil: 0 };
        setUsers(updatedUsers);
        onLogin(updatedUsers[userIndex]);
    };

    return (
        <div className="min-h-screen flex items-center justify-center circuit-pattern">
            <div className="w-full max-w-md p-8 rounded-3xl glass-panel border border-white/10 relative z-10 backdrop-blur-xl text-center shadow-pulse-orange">
                <h1 className="text-3xl font-black mb-4">NEURO<span className="text-cyan-400">LYNX</span></h1>
                {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-200 text-sm">{error}</div>}
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isValidating}
                    className="w-full p-3 rounded mb-4 bg-slate-800 border border-white/10 text-white disabled:opacity-50"
                    placeholder="Email"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isValidating}
                    className="w-full p-3 rounded mb-4 bg-slate-800 border border-white/10 text-white disabled:opacity-50"
                    placeholder="Password"
                />
                <button
                    onClick={handleLogin}
                    disabled={isValidating}
                    className={`w-full py-3 rounded font-bold text-white transition-colors ${isValidating ? 'bg-slate-700 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-500'}`}
                >
                    {isValidating ? (<span className="flex items-center justify-center gap-2"><i className="fas fa-circle-notch fa-spin"></i> Checking License...</span>) : 'Login'}
                </button>
                <div className="mt-6 border-t border-white/10 pt-4">
                    <button
                        onClick={onClearLicense}
                        disabled={isValidating}
                        className="text-xs text-slate-500 hover:text-red-400 transition-colors flex items-center justify-center gap-2 w-full disabled:opacity-50"
                    >
                        <i className="fas fa-trash-alt"></i> Reset System License (Clear Cache)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;
