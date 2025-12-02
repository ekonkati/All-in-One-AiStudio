
import React, { useState } from 'react';
import { Upload, FileCode, Image, Download, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { getImportJobs } from '../../services/calculationService';

const DataExchange: React.FC = () => {
  const [jobs, setJobs] = useState(getImportJobs());
  const [isUploading, setIsUploading] = useState(false);

  const simulateUpload = () => {
      setIsUploading(true);
      setTimeout(() => {
          setIsUploading(false);
          setJobs(prev => [
              { id: `IMP-${Date.now()}`, fileName: 'New_Floor_Plan_Scan.jpg', type: 'Sketch', date: new Date().toISOString().split('T')[0], status: 'Processing', details: 'Analyzing vectors...' },
              ...prev
          ]);
      }, 1500);
  };

  return (
    <div className="p-6 h-full overflow-y-auto bg-slate-50 animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Interoperability Hub</h2>
        <p className="text-slate-500">Import/Export Engineering Data (STAAD, ETABS, CAD, IFC)</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Upload Card */}
          <div className="lg:col-span-2 bg-white p-8 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors">
             <div className="p-4 bg-blue-50 rounded-full mb-4">
                 <Upload size={32} className={`text-blue-600 ${isUploading ? 'animate-bounce' : ''}`} />
             </div>
             <h3 className="text-lg font-semibold text-slate-800">Upload Project Files</h3>
             <p className="text-sm text-slate-500 max-w-md mt-2 mb-6">
                 Drag and drop your STAAD (.std), ETABS (.edb), DXF, or Hand-drawn Sketches (.jpg) here to auto-convert into StructurAI models.
             </p>
             <div className="flex gap-3">
                 <button onClick={simulateUpload} disabled={isUploading} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50">
                    {isUploading ? 'Processing...' : 'Select File'}
                 </button>
                 <button className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors">
                    Download Sample
                 </button>
             </div>
          </div>

          {/* Supported Formats Info */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 text-white">
             <h3 className="font-bold text-lg mb-4">Supported Formats</h3>
             <ul className="space-y-4">
                 <li className="flex items-center gap-3">
                     <div className="bg-white/10 p-2 rounded"><FileCode size={20} className="text-orange-400"/></div>
                     <div>
                         <p className="font-medium text-sm">STAAD.Pro / ETABS</p>
                         <p className="text-xs text-slate-400">Full Structural Model Import</p>
                     </div>
                 </li>
                 <li className="flex items-center gap-3">
                     <div className="bg-white/10 p-2 rounded"><Image size={20} className="text-emerald-400"/></div>
                     <div>
                         <p className="font-medium text-sm">Sketch-to-BIM</p>
                         <p className="text-xs text-slate-400">AI Vectorization of Images</p>
                     </div>
                 </li>
                 <li className="flex items-center gap-3">
                     <div className="bg-white/10 p-2 rounded"><Download size={20} className="text-blue-400"/></div>
                     <div>
                         <p className="font-medium text-sm">IFC Export</p>
                         <p className="text-xs text-slate-400">OpenBIM Standard</p>
                     </div>
                 </li>
             </ul>
          </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
             <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <RefreshCw size={18} className="text-slate-500" /> Recent Jobs
             </h3>
             <button className="text-sm text-blue-600 hover:underline">View All History</button>
          </div>
          <table className="w-full text-left text-sm text-slate-600">
             <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
                <tr>
                   <th className="px-6 py-3">File Name</th>
                   <th className="px-6 py-3">Type</th>
                   <th className="px-6 py-3">Date</th>
                   <th className="px-6 py-3">Status</th>
                   <th className="px-6 py-3">Details</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
                {jobs.map(job => (
                    <tr key={job.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-800">{job.fileName}</td>
                        <td className="px-6 py-4">
                            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">{job.type}</span>
                        </td>
                        <td className="px-6 py-4 text-slate-500">{job.date}</td>
                        <td className="px-6 py-4">
                            <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full w-fit ${
                                job.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                                job.status === 'Processing' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                            }`}>
                                {job.status === 'Completed' && <CheckCircle2 size={12}/>}
                                {job.status === 'Processing' && <RefreshCw size={12} className="animate-spin"/>}
                                {job.status === 'Failed' && <AlertCircle size={12}/>}
                                {job.status}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 italic">{job.details}</td>
                    </tr>
                ))}
             </tbody>
          </table>
      </div>
    </div>
  );
};

export default DataExchange;
