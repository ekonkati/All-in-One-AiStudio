
import React, { useState, useEffect } from 'react';
import { Wind, Activity, MapPin, Info, Layers } from 'lucide-react';
import { calculateWindLoad, calculateSeismicLoad, generateLoadCombinations } from '../../services/loadService';
import { WindParams, SeismicParams, LoadCombination } from '../../types';

interface LoadGeneratorProps {
  location: string;
  height: number; // in meters
  activeLoads?: { dead: boolean; live: boolean; wind: boolean; seismic: boolean };
}

const LoadGenerator: React.FC<LoadGeneratorProps> = ({ location, height, activeLoads = { dead: true, live: true, wind: false, seismic: false } }) => {
  const [city, setCity] = useState(location.split(',')[0].trim() || 'Hyderabad');
  const [windData, setWindData] = useState<WindParams | null>(null);
  const [seismicData, setSeismicData] = useState<SeismicParams | null>(null);
  const [combinations, setCombinations] = useState<LoadCombination[]>([]);

  useEffect(() => {
    // Auto-calculate on mount or change
    setWindData(calculateWindLoad(city, height));
    setSeismicData(calculateSeismicLoad(city));
    setCombinations(generateLoadCombinations(activeLoads));
  }, [city, height, activeLoads]);

  const cities = ['Hyderabad', 'Mumbai', 'Delhi', 'Chennai', 'Bangalore', 'Kolkata', 'Pune', 'Ahmedabad', 'Bhubaneswar', 'Visakhapatnam'];

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-in fade-in duration-500">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <MapPin size={20} className="text-blue-600" />
        Automated Load Engine (Part 7)
      </h3>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">Project Location</label>
        <select 
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        >
          {cities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <p className="text-xs text-slate-500 mt-1">This auto-selects Wind Zone (IS 875) & Seismic Zone (IS 1893).</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Wind Load Card */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-3 text-blue-800">
            <Wind size={20} />
            <h4 className="font-semibold">Wind Load Parameters</h4>
          </div>
          {windData && (
            <div className="space-y-2 text-sm text-blue-900">
              <div className="flex justify-between">
                <span>Basic Speed (Vb):</span>
                <span className="font-bold">{windData.basicWindSpeed} m/s</span>
              </div>
              <div className="flex justify-between">
                <span>Terrain Factor (k2):</span>
                <span>{windData.k2}</span>
              </div>
              <div className="flex justify-between border-t border-blue-200 pt-2 mt-2">
                <span>Design Speed (Vz):</span>
                <span className="font-bold">{windData.designWindSpeed} m/s</span>
              </div>
              <div className="flex justify-between">
                <span>Design Pressure (Pz):</span>
                <span className="font-bold text-lg">{windData.windPressure} N/m²</span>
              </div>
            </div>
          )}
          <div className="absolute top-2 right-2 opacity-10"><Wind size={80} /></div>
        </div>

        {/* Seismic Load Card */}
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-3 text-orange-800">
            <Activity size={20} />
            <h4 className="font-semibold">Seismic Parameters</h4>
          </div>
          {seismicData && (
            <div className="space-y-2 text-sm text-orange-900">
              <div className="flex justify-between">
                <span>Seismic Zone:</span>
                <span className="font-bold">Zone {seismicData.zone} (Z={seismicData.zoneFactor})</span>
              </div>
              <div className="flex justify-between">
                <span>Importance (I):</span>
                <span>{seismicData.importanceFactor}</span>
              </div>
              <div className="flex justify-between">
                <span>Response Red. (R):</span>
                <span>{seismicData.responseReduction} (SMRF)</span>
              </div>
              <div className="flex justify-between border-t border-orange-200 pt-2 mt-2">
                <span>Base Shear Coeff (Ah):</span>
                <span className="font-bold text-lg">{seismicData.baseShearCoeff}</span>
              </div>
            </div>
          )}
          <div className="absolute top-2 right-2 opacity-10"><Activity size={80} /></div>
        </div>
      </div>

      {/* Load Combinations Table */}
      <div>
          <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Layers size={16} className="text-indigo-600"/> Auto-Generated Load Combinations (IS 875 Part 5)
          </h4>
          <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-xs uppercase">
                      <tr>
                          <th className="px-4 py-2">ID</th>
                          <th className="px-4 py-2">Combination Name</th>
                          <th className="px-4 py-2 text-center">Type</th>
                          <th className="px-4 py-2 text-right">Factors</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                      {combinations.map(combo => (
                          <tr key={combo.id} className="hover:bg-slate-50">
                              <td className="px-4 py-2 font-mono text-xs">{combo.id}</td>
                              <td className="px-4 py-2 font-medium text-slate-800">{combo.name}</td>
                              <td className="px-4 py-2 text-center">
                                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${combo.type === 'ULS' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                      {combo.type}
                                  </span>
                              </td>
                              <td className="px-4 py-2 text-right text-xs text-slate-500 font-mono">
                                  {JSON.stringify(combo.factors).replace(/"/g,'').replace(/{|}/g,'').replace(/,/g,', ')}
                              </td>
                          </tr>
                      ))}
                      {combinations.length === 0 && (
                          <tr><td colSpan={4} className="px-4 py-4 text-center text-slate-400">Select loads in Analysis Config to generate combinations.</td></tr>
                      )}
                  </tbody>
              </table>
          </div>
      </div>
      
      <div className="mt-4 flex items-start gap-2 text-xs text-slate-500 bg-slate-50 p-2 rounded">
         <Info size={14} className="mt-0.5 flex-shrink-0" />
         <p>
           Calculation Method: <strong>IS 875 (Part 3) : 2015</strong> for Wind and <strong>IS 1893 (Part 1) : 2016</strong> for Earthquake. 
           Factors assumed: 50yr design life, Terrain Category 2, Medium Soil.
         </p>
      </div>
    </div>
  );
};

export default LoadGenerator;
