import React, { useState } from 'react';
import { Vendor } from '../types';

interface VendorViewProps {
    vendors: Vendor[];
    onAddVendor: () => void;
}

const VendorView: React.FC<VendorViewProps> = ({ vendors, onAddVendor }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredVendors = vendors.filter(v =>
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Vendor & Subcontractor Management</h2>
                <button onClick={onAddVendor} className="px-4 py-2 bg-orange-600 rounded text-xs font-bold hover:bg-orange-500">
                    <i className="fas fa-plus mr-2"></i>Add Vendor
                </button>
            </div>

            <div className="relative">
                <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
                <input
                    type="text"
                    placeholder="Search by name or skills..."
                    className="w-full bg-slate-800 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-orange-500/50"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVendors.map(vendor => (
                    <div key={vendor.id} className="bg-slate-800 rounded-xl border border-white/5 overflow-hidden hover:border-orange-500/20 transition-all group">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg group-hover:text-orange-400 transition-colors">{vendor.name}</h3>
                                    <div className="text-xs text-slate-400">{vendor.contactEmail}</div>
                                </div>
                                <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${vendor.status === 'preferred' ? 'bg-yellow-500/20 text-yellow-400' :
                                        vendor.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-500'
                                    }`}>
                                    {vendor.status}
                                </div>
                            </div>

                            <div className="flex items-center gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <i key={i} className={`fas fa-star text-xs ${i < Math.floor(vendor.rating) ? 'text-yellow-500' : 'text-slate-700'}`}></i>
                                ))}
                                <span className="ml-2 text-xs text-slate-500 font-bold">{vendor.rating.toFixed(1)}</span>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {vendor.skills.map((skill, i) => (
                                    <span key={i} className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 rounded-full text-[10px] font-bold">
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                <div>
                                    <div className="text-[10px] uppercase font-bold text-slate-500">Hourly Rate</div>
                                    <div className="text-sm font-bold font-mono text-white">${vendor.hourlyRate}/hr</div>
                                </div>
                                <button className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">
                                    <i className="fas fa-external-link-alt text-xs"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredVendors.length === 0 && (
                <div className="text-center py-20 bg-slate-800/50 rounded-2xl border border-dashed border-white/10">
                    <i className="fas fa-users-slash text-4xl text-slate-600 mb-4"></i>
                    <div className="text-slate-400">No vendors found matching your search.</div>
                </div>
            )}
        </div>
    );
};

export default VendorView;
