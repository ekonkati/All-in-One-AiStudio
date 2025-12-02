
import React, { useState } from 'react';
import { User, Building, Globe, Shield, Save, Box, DownloadCloud, CheckCircle2 } from 'lucide-react';
import { getPlugins } from '../../services/calculationService';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'engineering' | 'profile' | 'plugins'>('general');
  const plugins = getPlugins();

  return (
    <div className="p-6 h-full overflow-y-auto bg-slate-50 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Settings & Configuration</h2>
          <p className="text-slate-500">Manage application preferences and engineering standards</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm">
          <Save size={18} />
          Save Changes
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
           <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
             <nav className="flex flex-col p-2 space-y-1">
               <button
                 onClick={() => setActiveTab('general')}
                 className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                   activeTab === 'general' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                 }`}
               >
                 <Globe size={18} /> General
               </button>
               <button
                 onClick={() => setActiveTab('engineering')}
                 className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                   activeTab === 'engineering' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                 }`}
               >
                 <Shield size={18} /> Engineering Standards
               </button>
               <button
                 onClick={() => setActiveTab('plugins')}
                 className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                   activeTab === 'plugins' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                 }`}
               >
                 <Box size={18} /> Plugins & Extensions
               </button>
               <button
                 onClick={() => setActiveTab('profile')}
                 className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                   activeTab === 'profile' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                 }`}
               >
                 <User size={18} /> Company Profile
               </button>
             </nav>
           </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
           {activeTab === 'general' && (
             <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
                <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4">General Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Application Language</label>
                     <select className="w-full border border-slate-300 rounded-lg p-2 text-sm">
                       <option>English (US)</option>
                       <option>English (UK)</option>
                       <option>Spanish</option>
                     </select>
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
                     <select className="w-full border border-slate-300 rounded-lg p-2 text-sm">
                       <option>INR (₹)</option>
                       <option>USD ($)</option>
                       <option>EUR (€)</option>
                     </select>
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Unit System</label>
                     <select className="w-full border border-slate-300 rounded-lg p-2 text-sm">
                       <option>Metric (m, mm, kg)</option>
                       <option>Imperial (ft, in, lbs)</option>
                     </select>
                   </div>
                </div>
             </div>
           )}

           {activeTab === 'engineering' && (
             <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
                <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4">Design Codes & Standards</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Concrete Design Code</label>
                    <select className="w-full border border-slate-300 rounded-lg p-2 text-sm bg-slate-50">
                      <option>IS 456:2000 (Indian Standard)</option>
                      <option>ACI 318-19 (American Concrete Institute)</option>
                      <option>Eurocode 2 (EN 1992)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Steel Design Code</label>
                    <select className="w-full border border-slate-300 rounded-lg p-2 text-sm bg-slate-50">
                      <option>IS 800:2007 (LSD)</option>
                      <option>AISC 360-16 (LRFD)</option>
                      <option>Eurocode 3</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Seismic Design Code</label>
                    <select className="w-full border border-slate-300 rounded-lg p-2 text-sm bg-slate-50">
                      <option>IS 1893:2016 (Part 1)</option>
                      <option>ASCE 7-16</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100">
                   <h4 className="font-semibold text-slate-800 mb-4">Safety Factors (Partial)</h4>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">Dead Load (γf)</label>
                        <input type="number" defaultValue={1.5} className="w-full border border-slate-300 rounded p-2 text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">Live Load (γf)</label>
                        <input type="number" defaultValue={1.5} className="w-full border border-slate-300 rounded p-2 text-sm" />
                      </div>
                   </div>
                </div>
             </div>
           )}

           {activeTab === 'plugins' && (
             <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
                <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4">Plugin Marketplace</h3>
                <p className="text-sm text-slate-500">Extend StructurAI functionalities with third-party solvers and code packs.</p>
                
                <div className="space-y-4">
                    {plugins.map(plugin => (
                        <div key={plugin.id} className="border border-slate-200 rounded-lg p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                                    <Box size={24} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-800">{plugin.name} <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded ml-2">v{plugin.version}</span></h4>
                                    <p className="text-sm text-slate-500">{plugin.description}</p>
                                    <p className="text-xs text-slate-400 mt-1">By {plugin.author}</p>
                                </div>
                            </div>
                            <button className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
                                plugin.status === 'Installed' 
                                ? 'bg-emerald-100 text-emerald-700 cursor-default' 
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}>
                                {plugin.status === 'Installed' ? <CheckCircle2 size={16} /> : <DownloadCloud size={16} />}
                                {plugin.status}
                            </button>
                        </div>
                    ))}
                </div>
             </div>
           )}

           {activeTab === 'profile' && (
             <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
                <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4">Company Profile</h3>
                
                <div className="flex items-center gap-6 mb-6">
                   <div className="w-20 h-20 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                     <Building size={32} />
                   </div>
                   <button className="text-sm text-blue-600 font-medium hover:underline">Upload Logo</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="md:col-span-2">
                     <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                     <input type="text" defaultValue="Acme Constructions Pvt Ltd" className="w-full border border-slate-300 rounded-lg p-2 text-sm" />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Contact Email</label>
                     <input type="email" defaultValue="admin@acmeconstructions.com" className="w-full border border-slate-300 rounded-lg p-2 text-sm" />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Tax ID / GSTIN</label>
                     <input type="text" defaultValue="36AAAAA0000A1Z5" className="w-full border border-slate-300 rounded-lg p-2 text-sm" />
                   </div>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
