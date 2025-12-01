
import React, { useMemo } from 'react';
import { FileText, Download, FileSpreadsheet, Package, RefreshCw, Eye } from 'lucide-react';
import { ProjectDetails, ReportItem } from '../../types';
import { generateReports } from '../../services/calculationService';

interface ReportsProps {
  project: Partial<ProjectDetails>;
}

const Reports: React.FC<ReportsProps> = ({ project }) => {
  const reports = useMemo(() => generateReports(project), [project]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'PDF': return <FileText size={24} className="text-red-500" />;
      case 'XLSX': return <FileSpreadsheet size={24} className="text-green-500" />;
      case 'ZIP': return <Package size={24} className="text-amber-500" />;
      default: return <FileText size={24} className="text-slate-500" />;
    }
  };

  return (
    <div className="p-6 h-full overflow-y-auto bg-slate-50 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Reports & Deliverables</h2>
          <p className="text-slate-500">Download generated project documentation</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-slate-300 px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-50 shadow-sm transition-colors">
          <RefreshCw size={16} />
          <span>Refresh All</span>
        </button>
      </div>

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
              {report.status === 'Generating' && (
                <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded animate-pulse">
                  GENERATING
                </span>
              )}
            </div>

            <div>
              <p className="text-sm text-slate-600 line-clamp-2 mb-4">{report.description}</p>
              
              <div className="flex gap-2">
                <button 
                  disabled={report.status === 'Generating'}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                >
                  <Download size={16} />
                  Download
                </button>
                <button className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                  <Eye size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Generate Custom Report Card */}
        <div className="bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 p-5 flex flex-col items-center justify-center h-48 text-center hover:bg-slate-100 transition-colors cursor-pointer group">
          <div className="p-3 bg-white rounded-full mb-3 shadow-sm group-hover:scale-110 transition-transform">
             <FileText size={24} className="text-blue-600" />
          </div>
          <h3 className="font-semibold text-slate-700">Custom Report</h3>
          <p className="text-xs text-slate-500 mt-1">Combine modules to create a custom export</p>
        </div>
      </div>
    </div>
  );
};

export default Reports;
