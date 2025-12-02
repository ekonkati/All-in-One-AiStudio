
import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Layers, Box } from 'lucide-react';
import { StructuralMember } from '../../types/index';

interface ModelTreeProps {
    members: StructuralMember[];
    onSelectMember: (id: string | null) => void;
    selectedMemberId: string | null;
}

const ModelTree: React.FC<ModelTreeProps> = ({ members, onSelectMember, selectedMemberId }) => {
    const [expanded, setExpanded] = useState<Record<string, boolean>>({
        'All Floors': true,
        'Columns': true,
        'Beams': true,
    });

    const toggle = (key: string) => {
        setExpanded(prev => ({...prev, [key]: !prev[key]}));
    };

    // FIX: Add explicit type for accumulator to resolve 'unknown' type error
    const groupedMembers = members.reduce((acc: Record<string, StructuralMember[]>, member) => {
        const key = member.type + 's'; // e.g. "Columns", "Beams"
        if (!acc[key]) acc[key] = [];
        acc[key].push(member);
        return acc;
    }, {});

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
                <h3 className="font-bold text-slate-800">Model Explorer</h3>
            </div>
            <div className="p-4 flex-1 overflow-y-auto">
                <ul className="text-sm">
                    <li>
                        <div onClick={() => toggle('All Floors')} className="flex items-center gap-1 cursor-pointer p-1 rounded hover:bg-slate-100">
                            {expanded['All Floors'] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            <span className="font-semibold">Structure</span>
                        </div>
                        {expanded['All Floors'] && (
                            <ul className="pl-4 border-l border-slate-200 ml-2">
                                {Object.entries(groupedMembers).map(([type, items]) => (
                                    <li key={type}>
                                        <div onClick={() => toggle(type)} className="flex items-center gap-1 cursor-pointer p-1 rounded hover:bg-slate-100">
                                            {expanded[type] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                            <span className="font-semibold">{type}</span>
                                        </div>
                                        {expanded[type] && (
                                            <ul className="pl-4 border-l border-slate-200 ml-2">
                                                {items.map(item => (
                                                    <li 
                                                        key={item.id} 
                                                        onClick={() => onSelectMember(item.id)}
                                                        className={`flex items-center gap-2 p-1.5 rounded cursor-pointer ${selectedMemberId === item.id ? 'bg-blue-100 text-blue-700' : 'hover:bg-slate-100'}`}
                                                    >
                                                        {item.type === 'Column' ? <Box size={12} /> : <Layers size={12}/>}
                                                        {item.mark}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default ModelTree;
