

import React, { useMemo } from 'react';
import { ProjectDetails, ViewState } from '../types';
import { calculateProjectStats, generateSchedule } from '../services/calculationService';
import OverviewCards from './dashboard/OverviewCards';
import ProgressChart from './dashboard/ProgressChart';
import ActionCenter from './dashboard/ActionCenter';
import AiInsights from './dashboard/AiInsights';
import AiOrchestrator from './dashboard/AiOrchestrator';

interface DashboardProps {
  project: Partial<ProjectDetails>;
  onChangeView: (view: ViewState) => void;
}

const ProjectDashboard: React.FC<DashboardProps> = ({ project, onChangeView }) => {
  if (!project.type) return null;

  const stats = useMemo(() => calculateProjectStats(project), [project]);
  const schedule = useMemo(() => generateSchedule(project), [project]);

  // Calculate aggregate progress from schedule
  const totalProgress = Math.round(
    schedule.phases.reduce((acc, phase) => acc + phase.progress, 0) / schedule.phases.length
  );

  return (
    <div className="p-6 bg-slate-50 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Project Overview</h2>
          <p className="text-sm text-slate-500">Live Status Dashboard</p>
        </div>
        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide border border-blue-200">
          {project.id ? `ID: ${project.id}` : 'New Project'}
        </span>
      </div>

      <AiOrchestrator project={project} onChangeView={onChangeView} />
      
      <OverviewCards project={project} stats={stats} schedule={schedule} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ProgressChart totalProgress={totalProgress} scheduleLength={schedule.phases.length} onChangeView={onChangeView} />
        <ActionCenter onChangeView={onChangeView} />
      </div>

      <AiInsights project={project} stats={stats} onChangeView={onChangeView} />
    </div>
  );
};

export default ProjectDashboard;
