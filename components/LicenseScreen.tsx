import React, { useState } from 'react';
import { LicenseStatus } from '../types';

interface LicenseScreenProps {
    status: LicenseStatus;
    onValidate: (key: string) => void;
}

const LicenseScreen: React.FC<LicenseScreenProps> = ({ status, onValidate }) => {
    const [keyInput, setKeyInput] = useState('');
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { setKeyInput(e.target.value); };
    const handlePaste = async () => { try { const text = await navigator.clipboard.readText(); if (text) setKeyInput(text.trim()); } catch (e) { } };
    const isValidFormat = keyInput.trim().length === 25;

    return (
        <div className="min-h-screen flex items-center justify-center circuit-pattern relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black opacity-90 z-0"></div>
            <div className="w-full max-w-lg p-10 rounded-3xl glass-panel border border-cyan-500/20 relative z-10 backdrop-blur-2xl text-center shadow-pulse-green">
                <div className="mb-8">
                    <h1 className="text-4xl font-black mb-2 tracking-tight">SYSTEM <span className="text-cyan-400">ACTIVATION</span></h1>
                    <p className="text-slate-400 text-sm">Enter your 25-character license key to initialize NeuroLynx.</p>
                </div>
                {status === 'invalid' && (<div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm font-bold flex items-center justify-center gap-2 animate-pulse"><i className="fas fa-triangle-exclamation"></i> INVALID LICENSE KEY</div>)}
                {status === 'offline' && (<div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-xl text-yellow-400 text-sm font-bold flex items-center justify-center gap-2"><i className="fas fa-wifi"></i> UNABLE TO CONNECT. PLEASE RETRY.</div>)}
                <div className="relative mb-8 group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><i className={`fas fa-key ${isValidFormat ? 'text-cyan-400' : 'text-slate-600'}`}></i></div>
                    <input
                        value={keyInput}
                        onChange={handleChange}
                        disabled={status === 'checking'}
                        className={`w-full py-4 pl-12 pr-12 rounded-xl bg-slate-900/80 border-2 ${status === 'invalid' ? 'border-red-500 text-red-400' : 'border-slate-700 text-white focus:border-cyan-500'} text-center font-mono text-lg tracking-widest outline-none transition-all shadow-inner`}
                        placeholder="Enter License Key"
                    />
                    <button onClick={handlePaste} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-cyan-400 transition-colors" title="Paste from Clipboard"><i className="fas fa-paste"></i></button>
                </div>
                <button
                    onClick={() => onValidate(keyInput.trim())}
                    disabled={!isValidFormat || status === 'checking'}
                    className={`w-full py-4 rounded-xl font-bold text-white tracking-widest transition-all transform active:scale-95 ${!isValidFormat ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-[0_0_20px_rgba(6,182,212,0.4)]'}`}
                >
                    {status === 'checking' ? (<span className="flex items-center justify-center gap-3"><i className="fas fa-circle-notch fa-spin"></i> VERIFYING...</span>) : 'ACTIVATE TERMINAL'}
                </button>
                <div className="mt-8 text-[10px] text-slate-600 uppercase tracking-widest">Secured by NeuroSyntax Media &bull; v2.5.0</div>
            </div>
        </div>
    );
};

export default LicenseScreen;
