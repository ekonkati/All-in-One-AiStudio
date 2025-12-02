

import React, { useMemo, useState } from 'react';
import { DollarSign, FileText, Download, TrendingUp, AlertCircle, CheckCircle2, BookOpen } from 'lucide-react';
// FIX: Corrected import path from ../../types to ../../types/index to be explicit
import { RABill, FinancialStats, ProjectDetails } from '../../types/index';
import { generateMeasurementBook } from '../../services/calculationService';
import MeasurementBook from './MeasurementBook';

interface FinancialsProps {
  stats: FinancialStats;
  bills: RABill[];
}

const Financials: React.FC<FinancialsProps> = ({ stats, bills }) => {
  const [view, setView] = useState<'bills' | 'mb'>('bills');
  const mbEntries = useMemo(() => generateMeasurementBook({ startDate: bills[0]?.date }), [bills]);

  const formatCurrency = (amount: number) => {
    return `₹ ${(amount / 100000).toFixed(2)} L`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm text-slate-500">Contract Value</p>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FileText size={18} /></div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">{formatCurrency(stats.contractValue)}</h3>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm text-slate-500">Billed to Date</p>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><TrendingUp size={18} /></div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">{formatCurrency(stats.billedValue)}</h3>
          <p className="text-xs text-slate-400 mt-1">{((stats.billedValue / stats.contractValue) * 100).toFixed(1)}% of Contract</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm text-slate-500">Payment Received</p>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle2 size={18} /></div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">{formatCurrency(stats.receivedValue)}</h3>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm text-slate-500">Outstanding</p>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><AlertCircle size={18} /></div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">{formatCurrency(stats.outstandingValue)}</h3>
        </div>
      </div>

      {/* Sub-Tabs for Bills vs MB */}
      <div className="flex space-x-1 border-b border-slate-200">
        <button 
           onClick={() => setView('bills')}
           className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${view === 'bills' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
           RA Bills
        </button>
        <button 
           onClick={() => setView('mb')}
           className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${view === 'mb' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
           <BookOpen size={16} /> Measurement Book
        </button>
      </div>

      {view === 'bills' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <DollarSign size={18} className="text-slate-500" /> Running Account (RA) Bills
            </h3>
            <button className="flex items-center space-x-2 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
              <span>+ New Bill</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
                <tr>
                  <th className="px-6 py-3">Bill No</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Description</th>
                  <th className="px-6 py-3 text-right">Claimed (₹)</th>
                  <th className="px-6 py-3 text-right">Approved (₹)</th>
                  <th className="px-6 py-3 text-center">Status</th>
                  <th className="px-6 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-700">{bill.billNo}</td>
                    <td className="px-6 py-4 text-slate-500">{bill.date}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">{bill.description}</td>
                    <td className="px-6 py-4 text-right text-slate-600">{bill.claimedAmount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right font-semibold text-slate-800">
                      {bill.approvedAmount > 0 ? bill.approvedAmount.toLocaleString() : '-'}
                    </td>
                    <td className="px-6 py-4 flex justify-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        bill.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' :
                        bill.status === 'Processing' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {bill.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50">
                        <Download size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view === 'mb' && (
        <MeasurementBook entries={mbEntries} />
      )}
    </div>
  );
};

export default Financials;