
import React from 'react';
import { Settings2, Wind, Activity, Play } from 'lucide-react';

interface AnalysisConfigProps {
  projectType: string | undefined;
  materials: any;
  setMaterials: (m: any) => void;
  loads: any;
  setLoads: (l: any) => void;
  runAnalysis: () => void;
}

const AnalysisConfig: React.FC<AnalysisConfigProps> = ({ projectType, materials, setMaterials, loads, setLoads, runAnalysis }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Settings2 size={20} className="text-blue-600" />
          Analysis Configuration
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Material Properties */}
          <div>
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Material Specs</h4>
            <div className="space-y-4">
              {projectType === 'RCC' || projectType === 'Other' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Concrete Grade</label>
                    <select
                      value={materials.concrete}
                      onChange={(e) => setMaterials({ ...materials, concrete: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option>M20</option>
                      <option>M25</option>
                      <option>M30</option>
                      <option>M35</option>
                      <option>M40</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Rebar Grade</label>
                    <select
                      value={materials.steel}
                      onChange={(e) => setMaterials({ ...materials, steel: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option>Fe415</option>
                      <option>Fe500</option>
                      <option>Fe550</option>
                      <option>Fe550D</option>
                    </select>
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Structural Steel Grade</label>
                  <select
                    value={materials.grade}
                    onChange={(e) => setMaterials({ ...materials, grade: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option>E250 (Fe410W)</option>
                    <option>E300</option>
                    <option>E350 (High Strength)</option>
                  </select>
                  <p className="text-xs text-slate-500 mt-1">Applicable for PEB Rafters & Columns</p>
                </div>
              )}
            </div>
          </div>

          {/* Load Cases */}
          <div>
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Load Cases (IS:875 / IS:1893)</h4>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg bg-slate-50 cursor-not-allowed">
                <input type="checkbox" checked disabled className="w-4 h-4 text-blue-600 rounded" />
                <span className="text-slate-700">Self Weight (DL)</span>
              </label>
              <label className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg bg-slate-50 cursor-not-allowed">
                <input type="checkbox" checked disabled className="w-4 h-4 text-blue-600 rounded" />
                <span className="text-slate-700">Imposed Load (LL)</span>
              </label>
              <label className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={loads.wind}
                  onChange={(e) => setLoads({ ...loads, wind: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <div className="flex items-center gap-2">
                  <span className="text-slate-700">Wind Load (WL)</span>
                  <Wind size={16} className="text-slate-400" />
                </div>
              </label>
              <label className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={loads.seismic}
                  onChange={(e) => setLoads({ ...loads, seismic: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <div className="flex items-center gap-2">
                  <span className="text-slate-700">Seismic Load (EQ)</span>
                  <Activity size={16} className="text-slate-400" />
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={runAnalysis}
          className="flex items-center space-x-3 px-8 py-4 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-700 hover:shadow-xl transition-all hover:scale-105 active:scale-95"
        >
          <Play fill="currentColor" size={24} />
          <span>Initialize Solver & Run</span>
        </button>
      </div>
    </div>
  );
};

export default AnalysisConfig;
