
import React, { useMemo, useState } from 'react';
import { FileText, Calendar, HardHat, DollarSign, ShieldCheck, Image, PlayCircle, Activity } from 'lucide-react';
import { ProjectDetails } from '../types';
import { generateSchedule, generateDocuments, generateFinancials, generateQualityData, generateSitePhotos } from '../services/calculationService';
import GanttChart from './management/GanttChart';
import SiteResources from './management/SiteResources';
import TaskList from './management/TaskList';
import DocumentList from './management/DocumentList';
import Financials from './management/Financials';
import QualitySafety from './management/QualitySafety';
import SiteGallery from './management/SiteGallery';
import ConstructionSequence from './management/ConstructionSequence';
import Monitoring from './management/Monitoring';

interface ProjectManagementProps {
  project: Partial<ProjectDetails>;
}

type ManagementTab = 'execution' | 'simulation' | 'financials' | 'quality' | 'gallery' | 'monitoring';

const ProjectManagement: React.FC<ProjectManagementProps> = ({ project }) => {
  const [activeTab, setActiveTab] = useState<ManagementTab>('execution');

  const { phases, tasks } = useMemo(() => generateSchedule(project), [project]);
  const documents = useMemo(() => generateDocuments(project), [project]);
  const financials = useMemo(() => generateFinancials(project), [project]);
  const qualityData = useMemo(() => generateQualityData(project), [project]);
  const sitePhotos = useMemo(() => generateSitePhotos(project), [project]);

  return (
    <div className="p-6 h-full overflow-y-auto bg-slate-50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Project Management</h2>
          <p className="text-slate-500">Execution Plan for {project.type} Construction</p>
        </div>
        <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm overflow-x-auto">
          <button
            onClick={() => setActiveTab('execution')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'execution' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <HardHat size={16} />
            <span>Site Execution</span>
          </button>
          <button
            onClick={() => setActiveTab('simulation')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'simulation' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <PlayCircle size={16} />
            <span>4D Simulation</span>
          </button>
          <button
            onClick={() => setActiveTab('quality')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'quality' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <ShieldCheck size={16} />
            <span>QHSE</span>
          </button>
          <button
            onClick={() => setActiveTab('monitoring')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'monitoring' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Activity size={16} />
            <span>Digital Twin</span>
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
             className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'gallery' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
             <Image size={16} />
             <span>Photos</span>
          </button>
          <button
            onClick={() => setActiveTab('financials')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'financials' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <DollarSign size={16} />
            <span>Commercials</span>
          </button>
        </div>
      </div>

      {activeTab === 'execution' && (
        <div className="animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <GanttChart phases={phases} />
            <SiteResources project={project} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <TaskList tasks={tasks} />
            <DocumentList documents={documents} />
          </div>
        </div>
      )}

      {activeTab === 'simulation' && (
        <ConstructionSequence phases={phases} />
      )}

      {activeTab === 'monitoring' && (
        <Monitoring />
      )}

      {activeTab === 'financials' && (
        <Financials stats={financials.stats} bills={financials.bills} />
      )}

      {activeTab === 'quality' && (
        <QualitySafety checklists={qualityData.checklists} stats={qualityData.stats} />
      )}

      {activeTab === 'gallery' && (
        <SiteGallery photos={sitePhotos} />
      )}
    </div>
  );
};

export default ProjectManagement;
