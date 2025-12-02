
import React, { useState } from 'react';
import { ShoppingCart, Send, Calendar, Package, DollarSign } from 'lucide-react';

const PurchaseOrderForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [vendor, setVendor] = useState('');
  const [item, setItem] = useState('');
  const [qty, setQty] = useState('');
  const [rate, setRate] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Purchase Order for ${item} placed with ${vendor}!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
          <h3 className="font-bold flex items-center gap-2">
            <ShoppingCart size={18} /> Raise Purchase Order (PO)
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Select Vendor</label>
            <select 
              value={vendor} 
              onChange={(e) => setVendor(e.target.value)} 
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Choose Vendor...</option>
              <option value="UltraTech">UltraTech Cement</option>
              <option value="Tata Steel">Tata Steel</option>
              <option value="Local Aggregates">Local Aggregates Co.</option>
              <option value="Asian Paints">Asian Paints</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Material / Item</label>
            <div className="relative">
                <Package size={16} className="absolute left-3 top-2.5 text-slate-400" />
                <input 
                type="text" 
                value={item} 
                onChange={(e) => setItem(e.target.value)} 
                className="w-full pl-9 border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. OPC 53 Grade Cement"
                />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                <input 
                  type="number" 
                  value={qty} 
                  onChange={(e) => setQty(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm" 
                  placeholder="0.00"
                />
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Unit Rate (₹)</label>
                <div className="relative">
                   <DollarSign size={16} className="absolute left-3 top-2.5 text-slate-400" />
                   <input 
                     type="number" 
                     value={rate} 
                     onChange={(e) => setRate(e.target.value)}
                     className="w-full pl-9 border border-slate-300 rounded-lg p-2.5 text-sm" 
                     placeholder="0.00"
                   />
                </div>
             </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Required Delivery Date</label>
             <div className="relative">
                <Calendar size={16} className="absolute left-3 top-2.5 text-slate-400" />
                <input 
                  type="date" 
                  value={deliveryDate} 
                  onChange={(e) => setDeliveryDate(e.target.value)} 
                  className="w-full pl-9 border border-slate-300 rounded-lg p-2.5 text-sm" 
                />
             </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg flex justify-between items-center text-sm">
             <span className="text-blue-800 font-medium">Total Amount:</span>
             <span className="font-bold text-blue-900">₹ {(Number(qty) * Number(rate)).toLocaleString()}</span>
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
          >
            <Send size={18} /> Issue Purchase Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default PurchaseOrderForm;
