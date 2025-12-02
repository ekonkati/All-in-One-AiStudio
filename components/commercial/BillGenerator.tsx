
import React, { useState } from 'react';
import { FileText, Calculator, Save, Plus, Trash2 } from 'lucide-react';
import { BillLineItem } from '../../types/index';

interface BillGeneratorProps {
  onClose: () => void;
}

const BillGenerator: React.FC<BillGeneratorProps> = ({ onClose }) => {
  const [billNo, setBillNo] = useState('RA/24/004');
  const [items, setItems] = useState<BillLineItem[]>([
      { id: 'ITM-01', description: 'RCC Concrete M25', qty: 0, unit: 'Cum', rate: 7200, prevQty: 120, amount: 0 }
  ]);

  const updateItem = (idx: number, field: keyof BillLineItem, value: any) => {
      const newItems = [...items];
      (newItems[idx] as any)[field] = value;
      if(field === 'qty' || field === 'rate') {
          newItems[idx].amount = newItems[idx].qty * newItems[idx].rate;
      }
      setItems(newItems);
  };

  const totalAmount = items.reduce((sum, i) => sum + i.amount, 0);
  const retention = totalAmount * 0.05;
  const tds = totalAmount * 0.02;
  const gst = totalAmount * 0.18;
  const netPayable = totalAmount + gst - retention - tds;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
       <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
          <div className="bg-slate-900 text-white p-4 flex justify-between items-center flex-shrink-0">
             <h3 className="font-bold flex items-center gap-2">
                <Calculator size={18} /> RA Bill Generator (Part 25)
             </h3>
             <button onClick={onClose} className="text-slate-400 hover:text-white">&times;</button>
          </div>

          <div className="p-6 overflow-y-auto flex-1">
             <div className="grid grid-cols-2 gap-6 mb-6">
                 <div>
                     <label className="block text-xs text-slate-500 mb-1">Bill Number</label>
                     <input type="text" value={billNo} onChange={(e) => setBillNo(e.target.value)} className="w-full border border-slate-300 rounded p-2 text-sm" />
                 </div>
                 <div>
                     <label className="block text-xs text-slate-500 mb-1">Bill Date</label>
                     <input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full border border-slate-300 rounded p-2 text-sm" />
                 </div>
             </div>

             {/* Table for bill items */}
             <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                        <tr>
                            <th className="p-2 text-left">Description</th>
                            <th className="p-2 text-center w-20">Unit</th>
                            <th className="p-2 text-right w-24">Prev Qty</th>
                            <th className="p-2 text-right w-24">Current Qty</th>
                            <th className="p-2 text-right w-28">Rate (₹)</th>
                            <th className="p-2 text-right w-32">Amount (₹)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {items.map((item, idx) => (
                            <tr key={item.id}>
                                <td className="p-2">{item.description}</td>
                                <td className="p-2 text-center">{item.unit}</td>
                                <td className="p-2 text-right text-slate-500">{item.prevQty}</td>
                                <td className="p-2"><input type="number" value={item.qty} onChange={e => updateItem(idx, 'qty', parseFloat(e.target.value))} className="w-full text-right border-slate-300 rounded p-1"/></td>
                                <td className="p-2"><input type="number" value={item.rate} onChange={e => updateItem(idx, 'rate', parseFloat(e.target.value))} className="w-full text-right border-slate-300 rounded p-1"/></td>
                                <td className="p-2 text-right font-semibold">{item.amount.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
             
             {/* Calculation Summary */}
             <div className="grid grid-cols-2 gap-x-8 mt-6 max-w-sm ml-auto">
                 <div className="text-right text-sm text-slate-600 space-y-2">
                     <p>Gross Amount:</p>
                     <p>Add: GST @ 18%:</p>
                     <p>Less: Retention @ 5%:</p>
                     <p>Less: TDS @ 2%:</p>
                     <p className="font-bold text-base text-slate-800 border-t pt-2 mt-2 border-slate-200">Net Payable:</p>
                 </div>
                 <div className="text-right text-sm font-mono space-y-2">
                     <p>{totalAmount.toLocaleString()}</p>
                     <p>{gst.toLocaleString()}</p>
                     <p>({retention.toLocaleString()})</p>
                     <p>({tds.toLocaleString()})</p>
                     <p className="font-bold text-base text-blue-700 border-t pt-2 mt-2 border-slate-200">₹ {netPayable.toLocaleString()}</p>
                 </div>
             </div>
          </div>
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg flex items-center gap-2 hover:bg-blue-700">
                  <Save size={16}/> Save & Generate Bill
              </button>
          </div>
       </div>
    </div>
  );
};

export default BillGenerator;
