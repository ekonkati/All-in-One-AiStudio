import React, { useMemo } from 'react';
import { ProjectDetails, ViewState } from '../../types/index';
import { calculateProjectStats, generateSchedule } from '../../services/calculationService';
import AiOrchestrator from './AiOrchestrator';
import OverviewCards from './OverviewCards';
import ProgressChart from './ProgressChart';
import ActionCenter from './ActionCenter';
import AiInsights from './AiInsights';

interface DashboardProps {
  project: Partial<ProjectDetails>;
  onChangeView: (view: ViewState) => void;
}

const ProjectDashboard: React.FC<DashboardProps> = ({ project, onChangeView }) => {
  const stats = useMemo(() => calculateProjectStats(project), [project]);
  const schedule = useMemo(() => generateSchedule(project), [project]);

  if (!project.type) return null;

  return (
    <div className="p-6 bg-slate-50 h-full overflow-y-auto">
      <AiOrchestrator project={project} onChangeView={onChangeView} />
      <OverviewCards project={project} stats={stats} schedule={schedule} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ProgressChart totalProgress={schedule.totalProgress} scheduleLength={schedule.phases.length} onChangeView={onChangeView} />
        <div className="lg:col-span-2">
            <ActionCenter onChangeView={onChangeView} />
        </div>
      </div>
      <AiInsights project={project} stats={stats} onChangeView={onChangeView} />
    </div>
  );
};

export default ProjectDashboard;