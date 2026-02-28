import React from 'react';

const HelpView: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Help & Support</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                <div className="bg-slate-800 p-6 rounded-2xl border border-white/5">
                    <h3 className="font-bold mb-4 flex items-center gap-2"><i className="fas fa-keyboard text-cyan-400"></i> Keyboard Shortcuts</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm"><span className="text-slate-400">Global Search</span> <kbd className="bg-slate-700 px-2 py-1 rounded text-[10px] font-mono">Ctrl + K</kbd></div>
                        <div className="flex justify-between text-sm"><span className="text-slate-400">Quick Command</span> <kbd className="bg-slate-700 px-2 py-1 rounded text-[10px] font-mono">{'>'} Command</kbd></div>
                        <div className="flex justify-between text-sm"><span className="text-slate-400">Toggle Sidebar</span> <kbd className="bg-slate-700 px-2 py-1 rounded text-[10px] font-mono">Ctrl + B</kbd></div>
                    </div>
                </div>
                <div className="bg-slate-800 p-6 rounded-2xl border border-white/5">
                    <h3 className="font-bold mb-4 flex items-center gap-2"><i className="fas fa-robot text-orange-400"></i> AI Guide</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">NeuroLynx uses advanced neural processing. You can chat with your data, generate documents, and automate workflows using natural language commands.</p>
                    <button className="mt-4 text-xs text-orange-400 font-bold hover:underline">Read Documentation →</button>
                </div>
            </div>
        </div>
    );
};

export default HelpView;
