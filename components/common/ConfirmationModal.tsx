import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  cost: number;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ cost, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 text-amber-500 rounded-full">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Action Confirmation</h3>
              <p className="text-sm text-slate-500">This action requires design credits.</p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg text-center">
            <p className="text-sm text-slate-600">Cost to proceed:</p>
            <p className="text-3xl font-bold text-blue-600 my-1">{cost} Credits</p>
          </div>
          <p className="text-xs text-slate-400 mt-4 text-center">
            This amount will be deducted from your balance. This action is non-refundable.
          </p>
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold text-sm">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm">
            Confirm & Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
