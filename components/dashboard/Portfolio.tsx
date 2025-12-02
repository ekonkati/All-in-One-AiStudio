

import React, { useMemo } from 'react';
import { LayoutDashboard, MapPin, AlertTriangle, CheckCircle2, Clock, DollarSign, BarChart3 } from 'lucide-react';
import { generatePortfolioData } from '../../services/calculationService';
// FIX: Corrected import path from ../../types to ../../types/index to be explicit
import { ProjectSummary } from '../../types/index';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const Portfolio: React.FC = () => {
  const projects = useMemo(() => generatePortfolioData(), []);
  
  const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);
  const totalSpent = projects.reduce((acc, p) => acc + p.spent, 0);
  const activeProjects = projects.filter(p => p.progress < 100).length;
  const delayedProjects = projects.filter(p => p.status === 'Delayed').length;

  const statusData = [
      { name: 'On Track', value: projects.filter(p => p.status === 'On Track').length, color: '#10b981' },
      { name: 'Delayed', value: projects.filter(p => p.status === 'Delayed').length, color: '#f59e0b' },
      { name: 'Critical', value: projects.filter(p => p.status === 'Critical').length, color: '#ef4444' },
  ];

  return (
    <div className="p-6 h-full overflow-y-auto bg-slate-50 animate-in fade-in duration-500">
       <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Portfolio Dashboard (Part 35)</h2>
          <p className="text-slate-500">Executive Overview of All Projects</p>
       </div>

       {/* KPI Cards */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                 <p className="text-sm text-slate-500">Total Portfolio Value</p>
                 <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><DollarSign size={18}/></div>
              </div>
              <h3 className="text-2xl font-bold text-slate-800">₹ {(totalBudget/10000000).toFixed(2)} Cr</h3>
              <p className="text-xs text-slate-400">Across {projects.length} projects</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                 <p className="text-sm text-slate-500">Total Spent</p>
                 <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><BarChart3 size={18}/></div>
              </div>
              <h3 className="text-2xl font-bold text-slate-800">₹ {(totalSpent/10000000).toFixed(2)} Cr</h3>
              <p className="text-xs text-slate-400">{((totalSpent/totalBudget)*100).toFixed(1)}% Utilized</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                 <p className="text-sm text-slate-500">Active Sites</p>
                 <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><LayoutDashboard size={18}/></div>
              </div>
              <h3 className="text-2xl font-bold text-slate-800">{activeProjects}</h3>
              <p className="text-xs text-slate-400">Running Projects</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                 <p className="text-sm text-slate-500">Risk Alerts</p>
                 <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><AlertTriangle size={18}/></div>
              </div>
              <h3 className="text-2xl font-bold text-slate-800">{delayedProjects}</h3>
              <p className="text-xs text-slate-400">Projects Delayed</p>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Project List */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-4 border-b border-slate-200 bg-slate-50">
                <h3 className="font-semibold text-slate-800">Active Projects</h3>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                   <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
                      <tr>
                         <th className="px-6 py-3">Project Name</th>
                         <th className="px-6 py-3">Type</th>
                         <th className="px-6 py-3">Location</th>
                         <th className="px-6 py-3">Progress</th>
                         <th className="px-6 py-3 text-center">Status</th>
                         <th className="px-6 py-3 text-center">Risk</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {projects.map(project => (
                         <tr key={project.id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                            <td className="px-6 py-4">
                               <div className="font-medium text-slate-800">{project.name}</div>
                               <div className="text-xs text-slate-400">{project.id}</div>
                            </td>
                            <td className="px-6 py-4"><span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">{project.type}</span></td>
                            <td className="px-6 py-4 text-slate-500 flex items-center gap-1"><MapPin size={12}/> {project.location}</td>
                            <td className="px-6 py-4">
                               <div className="flex items-center gap-2">
                                  <div className="w-24 bg-slate-200 rounded-full h-2">
                                     <div className="bg-blue-600 h-2 rounded-full" style={{width: `${project.progress}%`}}></div>
                                  </div>
                                  <span className="text-xs font-bold">{project.progress}%</span>
                               </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                               <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                                  project.status === 'On Track' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                               }`}>
                                  {project.status}
                               </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                               <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                                  project.riskLevel === 'Low' ? 'bg-slate-100 text-slate-600' : 
                                  project.riskLevel === 'Medium' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                               }`}>
                                  {project.riskLevel}
                               </span>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>

          {/* Status Distribution */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col items-center justify-center">
             <h3 className="font-semibold text-slate-800 mb-4 w-full text-left">Project Health</h3>
             <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                      <Pie data={statusData} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value" stroke="none">
                         {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                         ))}
                      </Pie>
                      <Tooltip />
                   </PieChart>
                </ResponsiveContainer>
             </div>
             <div className="flex gap-4 text-xs mt-4">
                 {statusData.map((entry, idx) => (
                    <div key={idx} className="flex items-center gap-1">
                       <div className="w-2 h-2 rounded-full" style={{backgroundColor: entry.color}}></div>
                       <span>{entry.name}</span>
                    </div>
                 ))}
             </div>
          </div>
       </div>
    </div>
  );
};

export default Portfolio;