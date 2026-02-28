import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Company, Deal, Contract } from '../types';

interface ClientsViewProps {
    companies: Company[];
    deals: Deal[];
    contracts: Contract[];
    isMapView: boolean;
    setIsMapView: (v: boolean) => void;
    setModalData: (data: any) => void;
    setActiveModal: (modal: any) => void;
    isDarkMode: boolean;
}

const ClientsView: React.FC<ClientsViewProps> = ({
    companies, deals, contracts, isMapView, setIsMapView, setModalData, setActiveModal, isDarkMode
}) => {
    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex justify-between items-center flex-shrink-0">
                <div>
                    <h2 className="text-2xl font-bold">Client Management</h2>
                    <div className="text-sm text-slate-400 mt-1">
                        Total Clients: <span className="text-cyan-400 font-mono font-bold">{companies.length}</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setIsMapView(!isMapView)} className={`px-4 py-2 rounded text-xs font-bold transition-all ${isMapView ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                        <i className={`fas ${isMapView ? 'fa-list' : 'fa-map-marker-alt'} mr-2`}></i> {isMapView ? 'List View' : 'Map View'}
                    </button>
                    <button onClick={() => { setModalData({}); setActiveModal('save_company'); }} className="px-4 py-2 bg-orange-600 rounded text-xs font-bold hover:bg-orange-500 shadow-lg shadow-orange-500/20"><i className="fas fa-plus mr-2"></i> Add Company</button>
                </div>
            </div>

            {isMapView ? (
                <div className="flex-1 rounded-2xl overflow-hidden border border-white/10 relative z-0">
                    <MapContainer center={[39.8283, -98.5795]} zoom={4} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            url={isDarkMode ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {companies.filter(c => c.coordinates).map(c => (
                            <Marker key={c.id} position={[c.coordinates!.lat, c.coordinates!.lng]}>
                                <Popup>
                                    <div className="text-slate-900">
                                        <div className="font-bold">{c.name}</div>
                                        <div className="text-xs">{c.address}</div>
                                        <div className="text-xs font-bold mt-1">Score: {c.leadScore || 0}</div>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-4 custom-scrollbar">
                    {companies.map(c => (
                        <div key={c.id} className="bg-slate-800 rounded-xl border border-white/5 p-6 hover:border-cyan-500/30 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                <button onClick={() => { setModalData(c); setActiveModal('save_company'); }} className="p-1 hover:text-white text-slate-400"><i className="fas fa-edit"></i></button>
                            </div>
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-xl font-bold text-slate-400 border border-white/5">
                                    {c.name[0]}
                                </div>
                                <div className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${c.status === 'active' ? 'bg-green-500/20 text-green-400' : c.status === 'lead' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700 text-slate-400'}`}>
                                    {c.status}
                                </div>
                            </div>
                            <h3 className="font-bold text-lg mb-1 truncate" title={c.name}>{c.name}</h3>
                            <div className="text-xs text-slate-400 mb-4 flex items-center gap-2"><i className="fas fa-map-marker-alt"></i> {c.address}</div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                                <div>
                                    <div className="text-[10px] uppercase text-slate-500 font-bold mb-1">Deals</div>
                                    <div className="font-bold text-sm text-cyan-400">{deals.filter(d => d.companyId === c.id).length}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] uppercase text-slate-500 font-bold mb-1">ARR</div>
                                    <div className="font-bold text-sm text-orange-400">${contracts.filter(con => con.companyId === c.id && con.status === 'active').reduce((sum, con) => sum + con.totalValue, 0).toLocaleString()}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ClientsView;
