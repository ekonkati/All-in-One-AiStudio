
import React from 'react';
import { CheckSquare, ChevronRight } from 'lucide-react';
import { TaskItem } from '../../types';

interface TaskListProps {
  tasks: TaskItem[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <CheckSquare size={18} className="text-slate-500" /> Site Tasks
        </h3>
        <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">{tasks.filter(t => t.status !== 'Done').length} Active</span>
      </div>
      <div className="divide-y divide-slate-100">
        {tasks.map((task) => (
          <div key={task.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer">
            <div className="flex items-start gap-3">
              <div className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${task.status === 'Done' ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 bg-white'
                }`}>
                {task.status === 'Done' && <CheckSquare size={12} className="text-white" />}
              </div>
              <div>
                <p className={`text-sm font-medium transition-colors ${task.status === 'Done' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                  {task.title}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">Due: {task.due}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${task.priority === 'High' ? 'bg-rose-100 text-rose-700' :
                  task.priority === 'Medium' ? 'bg-amber-100 text-amber-700' :
                    'bg-blue-100 text-blue-700'
                }`}>
                {task.priority}
              </span>
              <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
