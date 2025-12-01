
import React from 'react';
import { DollarSign, TrendingUp, Archive, HardHat } from 'lucide-react';

interface CostSummaryCardsProps {
  totalCost: number;
  costPerSqFt: number;
  projectType: string | undefined;
}

const CostSummaryCards: React.FC<CostSummaryCardsProps> = ({ totalCost, costPerSqFt, projectType }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-slate-500 mb-1">Total Estimated Cost</p>
            <h3 className="text-3xl font-bold text-slate-800">₹ {(totalCost / 100000).toFixed(2)} L</h3>
          </div>
          <div className="p-3 bg-green-100 text-green-600 rounded-full">
            <DollarSign size={24} />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-xs text-green-600 font-medium">+5.2% market adjustment applied</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-slate-500 mb-1">Cost Per Sq. Ft.</p>
            <h3 className="text-3xl font-bold text-slate-800">₹ {costPerSqFt.toFixed(0)}</h3>
          </div>
          <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
            <TrendingUp size={24} />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-500">Based on built-up area</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-slate-500 mb-1">Primary Material</p>
            <h3 className="text-3xl font-bold text-slate-800 truncate">
              {projectType === 'PEB' || projectType === 'Steel' ? 'Structural Steel' : 'RCC Concrete'}
            </h3>
          </div>
          <div className="p-3 bg-orange-100 text-orange-600 rounded-full">
            {projectType === 'PEB' || projectType === 'Steel' ? <Archive size={24} /> : <HardHat size={24} />}
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-500">Top cost contributor</p>
        </div>
      </div>
    </div>
  );
};

export default CostSummaryCards;
