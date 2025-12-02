
import React, { useMemo, useState } from 'react';
import { ShoppingCart, Users, Package, Truck, Search, Plus, Filter, FileText, Gavel, ArrowRight, Calculator } from 'lucide-react';
import { ProjectDetails } from '../../types';
import { generateProcurementData } from '../../services/calculationService';
import PurchaseOrderForm from './PurchaseOrderForm';
import BillGenerator from './BillGenerator';

interface ProcurementProps {
  project: Partial<ProjectDetails>;
}

type Tab = 'orders' | 'tendering' | 'vendors';

const Procurement: React.FC<ProcurementProps> = ({ project }) => {
  const [activeTab, setActiveTab] = useState<Tab>('orders');
  const [showPOForm, setShowPOForm] = useState(false);
  const [showBillGen, setShowBillGen] = useState(false);
  const { vendors, orders, rfqs } = useMemo(() => generateProcurementData(project), [project]);

  const totalPOValue = orders.reduce((sum, po) => sum + po.amount, 0);
  const pendingOrders = orders.filter(po => po.status !== 'Delivered').length;

  return (
    <div className="p-6 h-full overflow-y-auto bg-slate-50 animate-in fade-in duration-500 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Procurement & Supply Chain</h2>
          <p className="text-slate-500">Manage Material Purchase Orders and Tendering</p>
        </div>
        <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
           <button
             onClick={() => setActiveTab('orders')}
             className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
               activeTab === 'orders' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
             }`}
           >
             <ShoppingCart size={16} />
             <span>Purchase Orders</span>
           </button>
           <button
             onClick={() => setActiveTab('tendering')}
             className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
               activeTab === 'tendering' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
             }`}
           >
             <Gavel size={16} />
             <span>Tendering (RFQ)</span>
           </button>
           <button
             onClick={() => setActiveTab('vendors')}
             className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
               activeTab === 'vendors' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
             }`}
           >
             <Users size={16} />
             <span>Vendors</span>
           </button>
        </div>
      </div>

      {activeTab === 'orders' && (
        <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><ShoppingCart size={24} /></div>
                <div>
                    <p className="text-sm text-slate-500">Total PO Value</p>
                    <h3 className="text-2xl font-bold text-slate-800">₹ {(totalPOValue / 100000).toFixed(2)} L</h3>
                </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-orange-100 text-orange-600 rounded-lg"><Package size={24} /></div>
                <div>
                    <p className="text-sm text-slate-500">Active Orders</p>
                    <h3 className="text-2xl font-bold text-slate-800">{orders.length}</h3>
                </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg"><Truck size={24} /></div>
                <div>
                    <p className="text-sm text-slate-500">Pending Delivery</p>
                    <h3 className="text-2xl font-bold text-slate-800">{pendingOrders}</h3>
                </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => setShowBillGen(true)}>
                <div className="p-3 bg-purple-100 text-purple-600 rounded-lg"><Calculator size={24} /></div>
                <div>
                    <p className="text-sm text-slate-500">Pending Bills</p>
                    <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-1">Generate <ArrowRight size={16} /></h3>
                </div>
                </div>
            </div>

            {/* Purchase Orders Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <FileText size={18} className="text-slate-500" /> Recent Purchase Orders
                    </h3>
                    <div className="flex gap-2">
                    <button 
                        onClick={() => setShowPOForm(true)}
                        className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        <Plus size={16} /> New PO
                    </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
                        <tr>
                        <th className="px-4 py-3">PO No.</th>
                        <th className="px-4 py-3">Vendor / Material</th>
                        <th className="px-4 py-3 text-right">Qty</th>
                        <th className="px-4 py-3 text-right">Amount (₹)</th>
                        <th className="px-4 py-3 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {orders.map(po => (
                        <tr key={po.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 font-mono text-xs text-slate-500">{po.poNumber}</td>
                            <td className="px-4 py-3">
                            <p className="font-medium text-slate-800">{po.vendorName}</p>
                            <p className="text-xs text-slate-500 truncate max-w-[180px]">{po.material}</p>
                            </td>
                            <td className="px-4 py-3 text-right font-mono">
                                {po.quantity} <span className="text-slate-400 text-xs">{po.unit}</span>
                            </td>
                            <td className="px-4 py-3 text-right font-medium">{po.amount.toLocaleString()}</td>
                            <td className="px-4 py-3 flex justify-center">
                                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide ${
                                po.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                                po.status === 'Sent' ? 'bg-blue-100 text-blue-700' :
                                po.status === 'Partial' ? 'bg-amber-100 text-amber-700' :
                                'bg-slate-100 text-slate-500'
                                }`}>
                                {po.status}
                                </span>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            </div>
        </>
      )}

      {activeTab === 'tendering' && (
         <div className="space-y-6">
            <div className="flex justify-between items-center bg-blue-50 p-4 rounded-xl border border-blue-100">
                <div>
                   <h3 className="font-bold text-blue-900">Request for Quotation (RFQ) Manager</h3>
                   <p className="text-sm text-blue-600">Float tenders, receive bids, and compare vendors to find the best rate.</p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 shadow-sm">
                    <Plus size={18} /> Float New RFQ
                </button>
            </div>

            {rfqs.map(rfq => (
                <div key={rfq.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-3">
                                <h4 className="font-bold text-slate-800 text-lg">{rfq.title}</h4>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                    rfq.status === 'Evaluated' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                                }`}>{rfq.status}</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Ref: {rfq.rfqNo} • Floated: {rfq.floatDate} • Due: {rfq.dueDate}</p>
                        </div>
                        <div className="text-right">
                             <p className="text-xs text-slate-500">Total Bids</p>
                             <p className="font-bold text-slate-800">{rfq.bids.length}</p>
                        </div>
                    </div>
                    
                    <div className="p-4">
                        <h5 className="text-sm font-semibold text-slate-700 mb-3">Comparative Statement (CS)</h5>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-slate-600 border border-slate-100 rounded-lg">
                                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                                    <tr>
                                        <th className="px-4 py-2 text-left">Vendor</th>
                                        <th className="px-4 py-2 text-center">Submission Date</th>
                                        <th className="px-4 py-2 text-right">Quoted Rate (₹)</th>
                                        <th className="px-4 py-2 text-center">Rank</th>
                                        <th className="px-4 py-2 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rfq.bids.sort((a,b) => a.amount - b.amount).map((bid, idx) => (
                                        <tr key={idx} className={`border-t border-slate-100 ${bid.rank === 'L1' ? 'bg-emerald-50/50' : ''}`}>
                                            <td className="px-4 py-3 font-medium text-slate-800">{bid.vendorName}</td>
                                            <td className="px-4 py-3 text-center text-slate-500">{bid.submissionDate}</td>
                                            <td className="px-4 py-3 text-right font-mono">{bid.amount}</td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                                                    bid.rank === 'L1' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                    {bid.rank}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {bid.rank === 'L1' && (
                                                    <button className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 flex items-center gap-1 mx-auto">
                                                        Award PO <ArrowRight size={10} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ))}
         </div>
      )}

      {activeTab === 'vendors' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
           <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
             <h3 className="font-semibold text-slate-800 flex items-center gap-2">
               <Users size={18} className="text-slate-500" /> Approved Vendor List (AVL)
             </h3>
             <Search size={16} className="text-slate-400" />
           </div>
           <div className="divide-y divide-slate-100">
             {vendors.map(vendor => (
               <div key={vendor.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                 <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-slate-800">{vendor.name}</h4>
                        <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">{vendor.rating} ★</span>
                    </div>
                    <p className="text-xs text-slate-500">{vendor.category} • {vendor.contact}</p>
                 </div>
                 <div className="flex items-center gap-2 text-xs">
                    <span className={`px-2 py-0.5 rounded-full ${vendor.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {vendor.status}
                    </span>
                    <button className="text-blue-600 hover:underline">Edit</button>
                 </div>
               </div>
             ))}
           </div>
        </div>
      )}

      {/* Modal PO Form */}
      {showPOForm && <PurchaseOrderForm onClose={() => setShowPOForm(false)} />}
      {/* Modal Bill Generator */}
      {showBillGen && <BillGenerator onClose={() => setShowBillGen(false)} />}
    </div>
  );
};

export default Procurement;
