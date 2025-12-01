
import React from 'react';
import { Image, Upload, MapPin, Calendar, Tag } from 'lucide-react';
import { SitePhoto } from '../../types';

interface SiteGalleryProps {
  photos: SitePhoto[];
}

const SiteGallery: React.FC<SiteGalleryProps> = ({ photos }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
       <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
           <div>
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                 <Image size={20} className="text-blue-600" /> Site Progress Gallery
              </h3>
              <p className="text-sm text-slate-500">Visual documentation of project milestones.</p>
           </div>
           <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-sm">
               <Upload size={16} /> Upload Photos
           </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {photos.map(photo => (
               <div key={photo.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden group hover:shadow-md transition-all">
                   <div className="h-48 overflow-hidden relative">
                       <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                       <div className="absolute top-2 right-2">
                           <span className="bg-black/50 backdrop-blur text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1">
                               <Calendar size={10} /> {photo.date}
                           </span>
                       </div>
                   </div>
                   <div className="p-4">
                       <h4 className="font-medium text-slate-800 truncate">{photo.caption}</h4>
                       <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                           <MapPin size={12} /> <span>Site Zone A</span>
                       </div>
                       <div className="flex flex-wrap gap-2 mt-3">
                           {photo.tags.map(tag => (
                               <span key={tag} className="flex items-center gap-1 bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px]">
                                   <Tag size={8} /> {tag}
                               </span>
                           ))}
                       </div>
                   </div>
               </div>
           ))}
           
           {/* Upload Placeholder */}
           <div className="border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center p-6 text-slate-400 hover:bg-slate-50 hover:border-blue-400 cursor-pointer transition-colors min-h-[200px]">
               <Upload size={32} className="mb-2" />
               <span className="text-sm font-medium">Drop photos here</span>
           </div>
       </div>
    </div>
  );
};

export default SiteGallery;
