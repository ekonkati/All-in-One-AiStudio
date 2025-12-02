
import React from 'react';
import { FileText, Image, Table, CheckCircle2, Clock, Download, FileCode } from 'lucide-react';
// FIX: Corrected import path from ../../types to ../../types/index to be explicit
import { DocumentItem } from '../../types/index';

interface DocumentListProps {
  documents: DocumentItem[];
}

const DocumentList: React.FC<DocumentListProps> = ({ documents }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'DWG': return <FileCode size={20} className="text-blue-600" />;
      case 'PDF': return <FileText size={20} className="text-red-600" />;
      case 'XLSX': return <Table size={20} className="text-green-600" />;
      case 'JPG': return <Image size={20} className="text-purple-600" />;
      default: return <FileText size={20} className="text-slate-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return <span className="flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full"><CheckCircle2 size={12} /> Approved</span>;
      case 'Pending':
        return <span className="flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full"><Clock size={12} /> Pending</span>;
      default:
        return <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <FileText size={18} className="text-slate-500" /> Project Documents (DMS)
        </h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Upload New</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Size</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-white transition-colors border border-slate-200">
                      {getIcon(doc.type)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{doc.name}</p>
                      <p className="text-xs text-slate-400">{doc.id} • {doc.type}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-500">{doc.category}</td>
                <td className="px-4 py-3 text-slate-500">{doc.date}</td>
                <td className="px-4 py-3 text-right font-mono text-xs">{doc.size}</td>
                <td className="px-4 py-3 flex justify-center">{getStatusBadge(doc.status)}</td>
                <td className="px-4 py-3 text-center">
                  <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                    <Download size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocumentList;