

import React, { useState, useEffect } from 'react';
import { Activity, Thermometer, Wifi, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { generateSensorData } from '../../services/calculationService';
// FIX: Corrected import path from ../../types to ../../types/index to be explicit
import { SensorData } from '../../types/index';

const Monitoring: React.FC = () => {
  const [sensors, setSensors] = useState<SensorData[]>([]);

  useEffect(() => {
    // Simulate live data updates
    const interval = setInterval(() => {
      setSensors(generateSensorData('all'));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <Wifi size={20} className="text-blue-600 animate-pulse" /> Digital Twin Monitor
          </h3>
          <p className="text-sm text-slate-500">Real-time IoT sensor feeds from site.</p>
        </div>
        <div className="flex gap-2 text-xs">
           <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100"><CheckCircle2 size={12}/> System Healthy</span>
           <span className="flex items-center gap-1 bg-slate-100 text-slate-600 px-3 py-1 rounded-full">Last Sync: Just now</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sensors.map((sensor) => (
          <div key={sensor.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
               <div className="flex items-center gap-2">
                  {sensor.type === 'Temperature' ? <Thermometer size={18} className="text-orange-500"/> : <Activity size={18} className="text-blue-500"/>}
                  <span className="font-semibold text-slate-700">{sensor.type} - {sensor.location}</span>
               </div>
               <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                   sensor.status === 'Normal' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
               }`}>
                   {sensor.status}
               </span>
            </div>
            
            <div className="p-6">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <p className="text-xs text-slate-500">Current Reading</p>
                        <h4 className="text-3xl font-bold text-slate-800">{sensor.value.toFixed(2)} <span className="text-lg font-medium text-slate-400">{sensor.unit}</span></h4>
                    </div>
                    {sensor.status === 'Warning' && (
                        <div className="flex items-center gap-1 text-amber-600 text-xs bg-amber-50 px-2 py-1 rounded">
                            <AlertTriangle size={12} /> Threshold Near
                        </div>
                    )}
                </div>
                
                <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={sensor.history}>
                            <defs>
                                <linearGradient id={`grad-${sensor.id}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={sensor.status === 'Warning' ? '#f59e0b' : '#3b82f6'} stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor={sensor.status === 'Warning' ? '#f59e0b' : '#3b82f6'} stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="time" hide />
                            <YAxis hide domain={['auto', 'auto']} />
                            <Tooltip />
                            <Area 
                                type="monotone" 
                                dataKey="value" 
                                stroke={sensor.status === 'Warning' ? '#f59e0b' : '#3b82f6'} 
                                fill={`url(#grad-${sensor.id})`} 
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Monitoring;