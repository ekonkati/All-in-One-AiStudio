
import React, { useState } from 'react';
import { Camera, Save, Calendar, Users, Briefcase } from 'lucide-react';

const DailyLogForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [activity, setActivity] = useState('');
  const [progress, setProgress] = useState(0);
  const [labor, setLabor] = useState({ skilled: 0, unskilled: 0 });
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to DB
    alert("Daily Progress Report Submitted Successfully!");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
          <h3 className="font-bold flex items-center gap-2">
            <Calendar size={18} /> Daily Site Log (DPR)
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Activity (WBS Item)</label>
            <select 
              value={activity} 
              onChange={(e) => setActivity(e.target.value)} 
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select Activity</option>
              <option value="EXC">Excavation & Earthwork</option>
              <option value="PCC">PCC / Foundation Bed</option>
              <option value="RFT">Reinforcement Fixing</option>
              <option value="SHT">Shuttering / Formwork</option>
              <option value="CON">Concrete Pouring</option>
              <option value="MAS">Masonry Work</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Work Done Today (%)</label>
            <div className="flex items-center gap-3">
               <input 
                 type="range" min="0" max="100" 
                 value={progress} 
                 onChange={(e) => setProgress(Number(e.target.value))} 
                 className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
               />
               <span className="w-12 text-right font-mono font-bold text-slate-700">{progress}%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Skilled Labor</label>
                <div className="relative">
                   <Users size={16} className="absolute left-3 top-2.5 text-slate-400" />
                   <input 
                     type="number" 
                     value={labor.skilled} 
                     onChange={(e) => setLabor({...labor, skilled: Number(e.target.value)})}
                     className="w-full pl-9 border border-slate-300 rounded-lg p-2 text-sm" 
                     placeholder="0"
                   />
                </div>
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Unskilled Labor</label>
                <div className="relative">
                   <Briefcase size={16} className="absolute left-3 top-2.5 text-slate-400" />
                   <input 
                     type="number" 
                     value={labor.unskilled} 
                     onChange={(e) => setLabor({...labor, unskilled: Number(e.target.value)})}
                     className="w-full pl-9 border border-slate-300 rounded-lg p-2 text-sm" 
                     placeholder="0"
                   />
                </div>
             </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Site Photos</label>
             <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 cursor-pointer">
                <Camera size={24} className="mb-2" />
                <span className="text-xs">Tap to upload proof of work</span>
             </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Issues / Remarks</label>
             <textarea 
               rows={2}
               value={notes}
               onChange={(e) => setNotes(e.target.value)}
               className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
               placeholder="Any hindrance or safety issue?"
             ></textarea>
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
          >
            <Save size={18} /> Submit Log
          </button>
        </form>
      </div>
    </div>
  );
};

export default DailyLogForm;
