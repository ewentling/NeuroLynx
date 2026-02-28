import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WikiPage, Company } from '../types';
import { Book, FileText, Search, Plus, Edit2, Clock, User, ChevronRight, Tag, BookOpen, Share2, Clipboard } from 'lucide-react';

interface WikiViewProps {
    pages: WikiPage[];
    companies: Company[];
}

const WikiView: React.FC<WikiViewProps> = ({ pages, companies }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<WikiPage['category'] | 'all'>('all');
    const [selectedPage, setSelectedPage] = useState<WikiPage | null>(pages[0] || null);

    const categories = ['all', 'sop', 'technical', 'internal', 'client_specific'];

    const filteredPages = pages.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Knowledge Base</h2>
                    <p className="text-slate-400 text-sm">Centralized repository for SOPs, technical guides, and internal wikis.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-slate-900 border border-white/5 rounded-xl font-bold text-slate-300 hover:bg-slate-800 transition-all flex items-center gap-2">
                        <Share2 className="w-4 h-4" /> Share
                    </button>
                    <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-bold text-white shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2">
                        <Plus className="w-4 h-4" /> New Page
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[75vh]">
                <div className="lg:col-span-1 space-y-6 flex flex-col overflow-hidden">
                    <div className="bg-slate-900 border border-white/10 p-5 rounded-3xl shadow-xl space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search wiki..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-800 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all"
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat as any)}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border ${selectedCategory === cat ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-800 text-slate-500 border-transparent hover:border-white/10'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                        {filteredPages.map((page) => (
                            <motion.div
                                key={page.id}
                                layoutId={page.id}
                                onClick={() => setSelectedPage(page)}
                                className={`p-4 rounded-2xl border cursor-pointer transition-all group ${selectedPage?.id === page.id ? 'bg-slate-800 border-blue-500/40 shadow-xl' : 'bg-slate-900 border-white/5 hover:border-white/10'}`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`p-2 rounded-lg ${selectedPage?.id === page.id ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                                        <FileText className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className={`text-sm font-bold truncate ${selectedPage?.id === page.id ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>{page.title}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[9px] font-black uppercase text-blue-500 tracking-tighter">{page.category}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-3 bg-slate-900 border border-white/10 rounded-3xl shadow-2xl relative flex flex-col overflow-hidden">
                    {selectedPage ? (
                        <>
                            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-slate-800/10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400">
                                        <BookOpen className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-white tracking-tighter leading-none mb-2">{selectedPage.title}</h3>
                                        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                            <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {selectedPage.author}</span>
                                            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Updated {new Date(selectedPage.lastModified).toLocaleDateString()}</span>
                                            {selectedPage.companyId && <span className="flex items-center gap-1.5 text-blue-400"><Tag className="w-3.5 h-3.5" /> {companies.find(c => c.id === selectedPage.companyId)?.name}</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors border border-white/5"><Clipboard className="w-5 h-5" /></button>
                                    <button className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors border border-white/5"><Edit2 className="w-5 h-5" /></button>
                                </div>
                            </div>

                            <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                                <div className="prose prose-invert max-w-none prose-sm">
                                    <div className="text-slate-300 leading-relaxed whitespace-pre-wrap font-medium">
                                        {selectedPage.content}
                                    </div>
                                </div>

                                <div className="mt-12 pt-8 border-t border-white/5 grid grid-cols-3 gap-6">
                                    <div className="bg-slate-800/30 p-4 rounded-2xl border border-white/5">
                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Related Docs</div>
                                        <div className="text-xs text-blue-400 font-bold hover:underline cursor-pointer">Security Policy V2.pdf</div>
                                    </div>
                                    <div className="bg-slate-800/30 p-4 rounded-2xl border border-white/5">
                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Viewed By</div>
                                        <div className="flex -space-x-2 mt-2">
                                            {[1, 2, 3].map(i => <div key={i} className="w-6 h-6 rounded-full border border-slate-900 bg-slate-700 flex items-center justify-center text-[8px] font-bold">U{i}</div>)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-700 p-12 text-center">
                            <Book className="w-20 h-20 mb-6 opacity-10" />
                            <h3 className="text-xl font-bold text-slate-500 mb-2 uppercase tracking-[0.2em]">Select a Page</h3>
                            <p className="text-slate-600 max-w-xs text-sm">Choose a wiki page from the list to view its contents.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WikiView;
