import React, { useMemo, useState } from 'react';
import { ProjectDetails, ViewState } from '../../types/index';
import { Printer, Download, ArrowRight, Eye, List } from 'lucide-react';
import { generateBOQ, generateRateAnalysis } from '../../services/calculationService';
import CostSummaryCards from './CostSummaryCards';
import BoqTable from './BoqTable';
import RateAnalysis from './RateAnalysis';

interface EstimationViewProps {
  project: Partial<ProjectDetails>;
  onChangeView?: (view: ViewState) => void;
}

const EstimationView: React.FC<EstimationViewProps> = ({ project, onChangeView }) => {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const boq = useMemo(() => generateBOQ(project), [project]);
  const rateAnalysis = useMemo(() => generateRateAnalysis(project.type), [project.type]);

  const totalCost = boq.reduce((acc, item) => acc + item.amount, 0);
  const totalArea = (project.dimensions?.length || 0) * (project.dimensions?.width || 0) * (project.stories || 1);
  const costPerSqFt = totalArea > 0 ? totalCost / totalArea : 0;

  return (
    <div className="p-6 h-full overflow-y-auto bg-slate-50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Estimation & Costing</h2>
          <p className="text-slate-500">
            {project.type === 'PEB' ? 'Industrial Standard Rates (PEB/Steel)' : 'CPWD / DSR Standard Rates (Civil Works)'}
          </p>
        </div>
        <div className="flex gap-2">
          <button 
             onClick={() => setShowAnalysis(!showAnalysis)}
             className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors ${
                 showAnalysis ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
             }`}
          >
            {showAnalysis ? <List size={18} /> : <Eye size={18} />}
            <span className="hidden sm:inline">{showAnalysis ? 'Show BOQ' : 'Rate Analysis'}</span>
          </button>

          <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
            <Printer size={18} /> <span className="hidden sm:inline">Print</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
            <Download size={18} /> <span className="hidden sm:inline">Export CSV</span>
          </button>
          {onChangeView && (
            <button 
              onClick={() => onChangeView('management')}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <span>Project Execution</span> <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>

      <CostSummaryCards totalCost={totalCost} costPerSqFt={costPerSqFt} projectType={project.type} />
      
      {showAnalysis ? (
          <RateAnalysis analysis={rateAnalysis} />
      ) : (
          <BoqTable boq={boq} totalCost={totalCost} />
      )}
    </div>
  );
};

export default EstimationView;