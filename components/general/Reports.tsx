

import React, { useMemo, useState } from 'react';
import { FileText, Download, FileSpreadsheet, Package, RefreshCw, Eye, Briefcase, HardHat, ShoppingCart, Shield } from 'lucide-react';
// FIX: Corrected import path from ../../types to ../../types/index to be explicit
import { ProjectDetails, ReportItem, EngineeringStatusKPI, ProcurementKPI, SafetyKPI } from '../../types/index';
import { generateReports, generateMISData } from '../../services/calculationService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface ReportsProps {
  project: Partial<ProjectDetails>;
}

const Reports: React.FC<ReportsProps> = ({ project }) => {
  const [activeTab, setActiveTab] = useState<'engineering' | 'procurement' | 'safety' | 'downloads'>('engineering');
  const reports = useMemo(() => generateReports(project), [project]);
  const misData = useMemo(() => generateMISData(project), [project]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'PDF': return <FileText size={24} className="text-red-500" />;
      case 'XLSX': return <FileSpreadsheet size={24} className="text-green-500" />;
      case 'ZIP': return <Package size={24} className="text-amber-500" />;
      default: return <FileText size={24} className="text-slate-500" />;
    }
  };

  const EngineeringDashboard: React.FC<{ data: EngineeringStatusKPI }> = ({ data }) => (
      <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border border-slate-200"><p className="text-xs text-slate-500">Designs Done</p><p className="text-2xl font-bold">{data.designsCompleted}</p></div>
              <div className="bg-white p-4 rounded-lg border border-slate-200"><p className="text-xs text-slate-500">Designs Pending</p><p className="text-2xl font-bold">{data.designsPending}</p></div>
              <div className="bg-white p-4 rounded-lg border border-slate-200"><p className="text-xs text-slate-500">Drawings Issued</p><p className="text-2xl font-bold">{data.drawingsIssued}</p></div>
              <div className="bg-white p-4 rounded-lg border border-slate-200"><p className="text-xs text-slate-500">Revisions</p><p className="text-2xl font-bold">{data.revisions}</p></div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-slate-200 h-80">
              <h4 className="font-semibold mb-4 text-slate-700">Design Progress by Element</h4>
              <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.designProgress} layout="vertical" margin={{ left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" width={80} />
                      <Tooltip />
                      <Bar dataKey="completed" stackId="a" fill="#3b82f6" name="Completed" />
                      <Bar dataKey="total" stackId="a" fill="#e2e8f0" name="Total" />
                  </BarChart>
              </ResponsiveContainer>
          </div>
      </div>
  );
  
  const ProcurementDashboard: React.FC<{ data: ProcurementKPI }> = ({ data }) => (
       <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border border-slate-200"><p className="text-xs text-slate-500">Total POs</p><p className="text-2xl font-bold">{data.totalPOs}</p></div>
              <div className="bg-white p-4 rounded-lg border border-slate-200"><p className="text-xs text-slate-500">PO Value</p><p className="text-2xl font-bold">₹{(data.totalValue / 100000).toFixed(1)}L</p></div>
              <div className="bg-white p-4 rounded-lg border border-slate-200"><p className="text-xs text-slate-500">Active Vendors</p><p className="text-2xl font-bold">{data.activeVendors}</p></div>
              <div className="bg-white p-4 rounded-lg border border-slate-200"><p className="text-xs text-slate-500">Delayed</p><p className="text-2xl font-bold text-red-500">{data.delayedDeliveries}</p></div>
          </div>
           <div className="bg-white p-6 rounded-lg border border-slate-200 h-80">
              <h4 className="font-semibold mb-4 text-slate-700">Vendor Performance Rating</h4>
              <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.vendorPerformance}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 5]}/>
                      <Tooltip />
                      <Bar dataKey="rating" fill="#8b5cf6" name="Rating (out of 5)" />
                  </BarChart>
              </ResponsiveContainer>
          </div>
      </div>
  );

  const SafetyDashboard: React.FC<{ data: SafetyKPI }> = ({ data }) => {
      const pieData = [{ name: 'Passed', value: data.passed, color: '#10b981' }, { name: 'Failed', value: data.failed, color: '#ef4444' }];
      return (
           <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-slate-200"><p className="text-xs text-slate-500">Inspections</p><p className="text-2xl font-bold">{data.totalInspections}</p></div>
                  <div className="bg-white p-4 rounded-lg border border-slate-200"><p className="text-xs text-slate-500">Open NCRs</p><p className="text-2xl font-bold text-amber-500">{data.ncrOpen}</p></div>
                  <div className="bg-white col-span-2 p-4 rounded-lg border-slate-200"><p className="text-xs text-slate-500">Compliance Score</p><p className="text-2xl font-bold text-emerald-600">{data.complianceScore}%</p></div>
              </div>
              <div className="bg-white p-6 rounded-lg border border-slate-200 h-80">
                  <h4 className="font-semibold mb-4 text-slate-700">Inspection Status</h4>
                  <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                          <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                               {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                          </Pie>
                          <Tooltip />
                          <Legend />
                      </PieChart>
                  </ResponsiveContainer>
              </div>
          </div>
      );
  };
  
  const DownloadCenter: React.FC = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <div key={report.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between h-48">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="p-3 bg-slate-50 rounded-lg h-fit">
                  {getIcon(report.type)}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 line-clamp-1" title={report.title}>{report.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{report.category} • {report.size}</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-600 line-clamp-2 mb-4">{report.description}</p>
              <div className="flex gap-2">
                <button 
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <Download size={16} />
                  Download
                </button>
              </div>
            </div>
          </div>
        ))}
    </div>
  );

  return (
    <div className="p-6 h-full overflow-y-auto bg-slate-50 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">MIS Dashboards & Reports</h2>
          <p className="text-slate-500">Live KPIs and downloadable project documentation (Part 14).</p>
        </div>
      </div>

      <div className="flex space-x-1 border-b border-slate-200 mb-6">
          <button onClick={() => setActiveTab('engineering')} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'engineering' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'}`}><HardHat size={16}/> Engineering</button>
          <button onClick={() => setActiveTab('procurement')} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'procurement' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'}`}><ShoppingCart size={16}/> Procurement</button>
          <button onClick={() => setActiveTab('safety')} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'safety' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'}`}><Shield size={16}/> QHSE</button>
          <button onClick={() => setActiveTab('downloads')} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'downloads' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'}`}><Download size={16}/> Download Center</button>
      </div>
      
      {activeTab === 'engineering' && <EngineeringDashboard data={misData.eng} />}
      {activeTab === 'procurement' && <ProcurementDashboard data={misData.proc} />}
      {activeTab === 'safety' && <SafetyDashboard data={misData.safe} />}
      {activeTab === 'downloads' && <DownloadCenter />}
    </div>
  );
};

export default Reports;