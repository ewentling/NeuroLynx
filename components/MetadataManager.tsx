import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CustomField, CustomFieldValue } from '../types';
import { Settings, Plus, Tag, Database, Calendar, Type, Hash, CheckSquare, List, MoreVertical, Trash2, Edit2, ShieldAlert } from 'lucide-react';

interface MetadataManagerProps {
    fields: CustomField[];
}

const MetadataManager: React.FC<MetadataManagerProps> = ({ fields }) => {
    const [selectedEntity, setSelectedEntity] = useState<CustomField['entity'] | 'all'>('all');

    const filteredFields = selectedEntity === 'all' ? fields : fields.filter(f => f.entity === selectedEntity);

    const getFieldTypeIcon = (type: CustomField['type']) => {
        switch (type) {
            case 'text': return <Type className="w-4 h-4 text-cyan-400" />;
            case 'number': return <Hash className="w-4 h-4 text-orange-400" />;
            case 'date': return <Calendar className="w-4 h-4 text-emerald-400" />;
            case 'boolean': return <CheckSquare className="w-4 h-4 text-purple-400" />;
            case 'dropdown': return <List className="w-4 h-4 text-blue-400" />;
            default: return <Tag className="w-4 h-4 text-slate-400" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Custom Field Manager</h2>
                    <p className="text-slate-400 text-sm">Extend the CRM data model with dynamic fields for companies, deals, and projects.</p>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl font-bold text-white shadow-lg hover:shadow-orange-500/30 transition-all flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Define New Field
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-slate-900 border border-white/10 p-6 rounded-3xl shadow-xl">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Entity Scope</h3>
                        <div className="space-y-2">
                            {['all', 'company', 'deal', 'contact', 'project'].map((entity) => (
                                <button
                                    key={entity}
                                    onClick={() => setSelectedEntity(entity as any)}
                                    className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-between group ${selectedEntity === entity ? 'bg-orange-500/10 text-orange-400 border-orange-500/20 shadow-lg shadow-orange-500/10' : 'text-slate-500 border-transparent hover:bg-white/5'}`}
                                >
                                    <span className="capitalize">{entity}</span>
                                    {selectedEntity === entity && <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 bg-red-900/10 border border-red-500/20 rounded-3xl">
                        <div className="flex items-center gap-2 text-red-500 mb-2">
                            <ShieldAlert className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Metadata Safety</span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed italic">
                            Deleting a field will permanently remove all associated metadata from every record in that entity.
                        </p>
                    </div>
                </div>

                <div className="lg:col-span-3">
                    <div className="bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/10 bg-slate-800/20 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                    <th className="px-6 py-5 font-bold">Field Label</th>
                                    <th className="px-6 py-5 font-bold">Type</th>
                                    <th className="px-6 py-5 font-bold">Entity</th>
                                    <th className="px-6 py-5 font-bold">Options</th>
                                    <th className="px-6 py-5 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredFields.map((field) => (
                                    <motion.tr
                                        key={field.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors uppercase tracking-tight">{field.label}</div>
                                            <div className="text-[9px] font-mono text-slate-600 mt-0.5">{field.id}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-800 border border-white/5 text-[10px] font-bold text-slate-300 uppercase tracking-tighter w-fit">
                                                {getFieldTypeIcon(field.type)}
                                                {field.type}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{field.entity}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {field.options ? (
                                                <div className="text-[10px] text-slate-400 truncate w-32">
                                                    {field.options.join(', ')}
                                                </div>
                                            ) : (
                                                <span className="text-[10px] text-slate-700 italic">None</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 text-slate-500 hover:text-white transition-colors"><Edit2 className="w-4 h-4" /></button>
                                                <button className="p-2 text-slate-500 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredFields.length === 0 && (
                            <div className="p-12 text-center text-slate-700">
                                <Database className="w-12 h-12 mx-auto mb-4 opacity-10" />
                                <p className="text-sm font-bold uppercase tracking-widest">No custom fields defined for this entity.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MetadataManager;
