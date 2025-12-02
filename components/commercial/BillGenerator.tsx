
import React, { useState } from 'react';
import { FileText, Calculator, Save, Plus, Trash2 } from 'lucide-react';
import { BillLineItem } from '../../types';

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
                     <input type="date" className="w-full border border-slate-300 rounded p-2 text-sm" />
                 </div>
             </div>

             <table className="w-full text-left text-sm mb-6">
                 <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase">
                     <tr>
                         <th className="p-2">Description</th>
                         <th className="p-2 w-20 text-center">Unit</th>
                         <th className="p-2 w-24 text-right">Rate</th>
                         <th className="p-2 w-24 text-right">Prev Qty</th>
                         <th className="p-2 w-24 text-right">Curr Qty</th>
                         <th className="p-2 w-32 text-right">Amount</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                     {items.map((item, idx) => (
                         <tr key={idx}>
                             <td className="p-2"><input type="text" value={item.description} onChange={(e) => updateItem(idx, 'description', e.target.value)} className="w-full border-none focus:ring-0 text-sm" /></td>
                             <td className="p-2 text-center">{item.unit}</td>
                             <td className="p-2 text-right">{item.rate}</td>
                             <td className="p-2 text-right text-slate-400">{item.prevQty}</td>
                             <td className="p-2 text-right"><input type="number" value={item.qty} onChange={(e) => updateItem(idx, 'qty', Number(e.target.value))} className="w-20 border border-blue-200 rounded p-1 text-right" /></td>
                             <td className="p-2 text-right font-bold">{item.amount.toLocaleString()}</td>
                         </tr>
                     ))}
                 </tbody>
             </table>
             
             <div className="flex justify-end">
                 <div className="w-64 space-y-2 text-sm">
                     <div className="flex justify-between">
                         <span className="text-slate-500">Gross Amount</span>
                         <span className="font-medium">₹ {totalAmount.toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between text-red-600">
                         <span>Less: Retention (5%)</span>
                         <span>- {retention.toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between text-red-600">
                         <span>Less: TDS (2%)</span>
                         <span>- {tds.toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between text-blue-600">
                         <span>Add: GST (18%)</span>
                         <span>+ {gst.toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between border-t border-slate-300 pt-2 text-base font-bold text-slate-900">
                         <span>Net Payable</span>
                         <span>₹ {netPayable.toLocaleString()}</span>
                     </div>
                 </div>
             </div>
          </div>

          <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 flex-shrink-0">
             <button onClick={onClose} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-100">Cancel</button>
             <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-sm">
                 <FileText size={16} /> Generate Invoice
             </button>
          </div>
       </div>
    </div>
  );
};

export default BillGenerator;
