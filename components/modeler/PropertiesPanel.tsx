import React, { useState, useEffect } from 'react';
import { StructuralMember } from '../../types';
import { Edit, Save, X, Info } from 'lucide-react';

interface PropertiesPanelProps {
    member: StructuralMember | null | undefined;
    onUpdate: (id: string, newProps: Partial<StructuralMember>) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ member, onUpdate }) => {
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState<Partial<StructuralMember>>({});

    useEffect(() => {
        if (member) {
            setFormData(member);
            setEditMode(false);
        }
    }, [member]);

    const handleSave = () => {
        if (member) {
            onUpdate(member.id, formData);
        }
        setEditMode(false);
    };

    if (!member) {
        return (
            <div className="p-6 text-center text-slate-500 flex flex-col items-center justify-center h-full">
                <Info size={32} className="mb-4 text-slate-300" />
                <h3 className="font-semibold">No Member Selected</h3>
                <p className="text-sm mt-1">Click on a member in the 3D view or Model Tree to see its properties.</p>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Properties: {member.mark}</h3>
                {!editMode ? (
                    <button onClick={() => setEditMode(true)} className="p-1.5 rounded-md hover:bg-slate-200 text-slate-500">
                        <Edit size={16} />
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button onClick={() => setEditMode(false)} className="p-1.5 rounded-md hover:bg-slate-200 text-slate-500">
                            <X size={16} />
                        </button>
                        <button onClick={handleSave} className="p-1.5 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200">
                            <Save size={16} />
                        </button>
                    </div>
                )}
            </div>
            <div className="p-6 space-y-4 flex-1 overflow-y-auto">
                <PropertyItem label="Member ID" value={member.id} />
                <PropertyItem label="Mark" value={formData.mark || ''} editable={editMode} onChange={val => setFormData({...formData, mark: val})} />
                <PropertyItem label="Type" value={member.type} />
                <PropertyItem label="Level" value={member.level} />
                <PropertyItem label="Dimensions" value={formData.dimensions || ''} editable={editMode} onChange={val => setFormData({...formData, dimensions: val})} />
                <PropertyItem label="Reinforcement" value={formData.reinforcement || ''} editable={editMode} onChange={val => setFormData({...formData, reinforcement: val})} />
                <PropertyItem label="Concrete Vol." value={`${member.concreteVol.toFixed(2)} m³`} />
                <PropertyItem label="Steel Weight" value={`${member.steelWeight.toFixed(1)} kg`} />
            </div>
        </div>
    );
};

const PropertyItem: React.FC<{label: string; value: string; editable?: boolean; onChange?: (val: string) => void}> = ({ label, value, editable, onChange }) => {
    return (
        <div>
            <label className="block text-xs text-slate-500 font-medium mb-1">{label}</label>
            {!editable ? (
                <p className="text-sm text-slate-800 font-semibold bg-slate-50 p-2 rounded border border-slate-100">{value}</p>
            ) : (
                <input 
                    type="text" 
                    value={value}
                    onChange={(e) => onChange && onChange(e.target.value)}
                    className="w-full text-sm text-slate-800 font-semibold border-blue-300 border-2 p-1.5 rounded focus:outline-none"
                />
            )}
        </div>
    );
};

export default PropertiesPanel;