
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ArrowRight } from 'lucide-react';
import { ViewState } from '../../types';

interface ProgressChartProps {
  totalProgress: number;
  scheduleLength: number;
  onChangeView: (view: ViewState) => void;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ totalProgress, scheduleLength, onChangeView }) => {
  const chartData = [
    { name: 'Completed', value: totalProgress, color: '#10b981' },
    { name: 'Remaining', value: 100 - totalProgress, color: '#e2e8f0' },
  ];

  return (
    <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
      <div>
        <h3 className="font-semibold text-slate-800 mb-1">Overall Progress</h3>
        <p className="text-sm text-slate-500 mb-4">Weighted average of {scheduleLength} phases</p>
      </div>
      <div className="h-48 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              innerRadius={55}
              outerRadius={75}
              paddingAngle={5}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
          <span className="text-3xl font-bold text-slate-700">{totalProgress}%</span>
          <span className="text-xs text-slate-400">Complete</span>
        </div>
      </div>
      <div className="mt-4">
        <button onClick={() => onChangeView('management')} className="w-full py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 group">
          View Gantt Chart <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default ProgressChart;
