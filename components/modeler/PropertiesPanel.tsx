import React, { useState, useEffect } from 'react';
import { SelectedEntity, Node, Member, Support, Plate } from '../../types/index';
import { Edit, Save, X, ArrowLeft, Ruler, Box, Zap, BarChart3, CheckCircle, XCircle } from 'lucide-react';

interface PropertiesPanelProps {
    entity: Node | Member | Support | Plate | null;
    entityType: 'node' | 'member' | 'support' | 'plate' | null;
    onUpdate: (newProps: any) => void;
    onDeselect: () => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ entity, entityType, onUpdate, onDeselect }) => {
    const [activeTab, setActiveTab] = useState<'geometry' | 'props' | 'loads' | 'results'>('geometry');
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        if (entity) {
            setFormData(entity);
            if ('designResult' in entity && entity.designResult) setActiveTab('results');
            else setActiveTab('geometry');
        }
    }, [entity]);
    
    if (!entity) return <div className="p-6 text-center text-slate-400">Select an entity to view its properties.</div>;

    const TabButton: React.FC<any> = ({ id, label, icon: Icon, disabled = false }) => (
        <button onClick={() => setActiveTab(id)} disabled={disabled} className={`flex-1 py-2 text-xs font-medium border-b-2 flex items-center justify-center gap-1 ${activeTab === id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'} ${disabled ? 'opacity-50' : ''}`}>
            <Icon size={14} /> {label}
        </button>
    );

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <button onClick={onDeselect} className="p-1.5 rounded-md hover:bg-slate-200"><ArrowLeft size={16} /></button>
                    <h3 className="font-bold text-slate-800 text-sm capitalize">{entityType} #{'id' in entity ? entity.id : ''}</h3>
                </div>
            </div>
            <div className="flex border-b border-slate-200">
                <TabButton id="geometry" label="Geo" icon={Ruler} />
                <TabButton id="props" label="Prop" icon={Box} />
                <TabButton id="results" label="Results" icon={BarChart3} disabled={!('designResult' in entity && entity.designResult)}/>
            </div>
            <div className="p-4 space-y-4 flex-1 overflow-y-auto">
                {activeTab === 'geometry' && entityType === 'node' && (
                    <>
                        <PropertyItem label="X Coordinate" value={(entity as Node).x} />
                        <PropertyItem label="Y Coordinate" value={(entity as Node).y} />
                        <PropertyItem label="Z Coordinate" value={(entity as Node).z} />
                    </>
                )}
                 {activeTab === 'props' && entityType === 'member' && (
                    <>
                         <PropertyItem label="Section Profile" value={(entity as Member).sectionId} />
                         <PropertyItem label="Material" value={(entity as Member).materialId} />
                    </>
                )}
                {activeTab === 'results' && 'designResult' in entity && entity.designResult && (
                    <div className="space-y-3">
                        <PropertyItem label="Utilization Ratio" value={entity.designResult.utilization} />
                        <PropertyItem label="Status" value={entity.designResult.status} />
                         <PropertyItem label="Governing Combination" value={entity.designResult.governingCombo} />
                    </div>
                )}
            </div>
        </div>
    );
};

const PropertyItem: React.FC<{label: string; value: any}> = ({ label, value }) => (
    <div>
        <label className="block text-[10px] text-slate-500 font-bold uppercase">{label}</label>
        <p className="text-sm text-slate-800 font-medium bg-slate-50 p-2 rounded">{value}</p>
    </div>
);

export default PropertiesPanel;