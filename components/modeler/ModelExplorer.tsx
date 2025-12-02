import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Layers, Box, Target, Anchor, Zap, Database, Square } from 'lucide-react';
import { Node, Member, SelectedEntity, Support, Material, Section, Plate } from '../../types/index';

interface ModelExplorerProps {
    nodes: Node[]; members: Member[]; plates: Plate[]; supports: Support[]; materials: Material[]; sections: Section[];
    onSelectEntity: (entity: SelectedEntity | null) => void;
}

const ModelExplorer: React.FC<ModelExplorerProps> = ({ nodes, members, plates, supports, materials, sections, onSelectEntity }) => {
    const [expanded, setExpanded] = useState<Record<string, boolean>>({ 'structure': true, 'members': true, 'plates': true });

    const toggle = (key: string) => setExpanded(prev => ({...prev, [key]: !prev[key]}));

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
                <h3 className="font-bold text-slate-800">Model Explorer</h3>
            </div>
            <div className="p-4 flex-1 overflow-y-auto">
                <ul className="text-sm space-y-1">
                    <TreeGroup title="Nodes" count={nodes.length} icon={Target} color="text-blue-600" expanded={expanded['nodes']} onToggle={() => toggle('nodes')}>
                        {nodes.map(node => <TreeItem key={node.id} label={`Node ${node.id}`} onClick={() => onSelectEntity({type: 'node', id: node.id})} />)}
                    </TreeGroup>
                    <TreeGroup title="Members" count={members.length} icon={Layers} color="text-orange-600" expanded={expanded['members']} onToggle={() => toggle('members')}>
                        {members.map(member => <TreeItem key={member.id} label={`Member ${member.id}`} onClick={() => onSelectEntity({type: 'member', id: member.id})} />)}
                    </TreeGroup>
                    <TreeGroup title="Plates" count={plates.length} icon={Square} color="text-cyan-600" expanded={expanded['plates']} onToggle={() => toggle('plates')}>
                        {plates.map(plate => <TreeItem key={plate.id} label={`Plate ${plate.id}`} onClick={() => onSelectEntity({type: 'plate', id: plate.id})} />)}
                    </TreeGroup>
                    <TreeGroup title="Supports" count={supports.length} icon={Anchor} color="text-emerald-600" expanded={expanded['supports']} onToggle={() => toggle('supports')}>
                         {supports.map(support => <TreeItem key={support.id} label={`${support.type} @ N${support.nodeId}`} onClick={() => onSelectEntity({type: 'support', id: support.id})} />)}
                    </TreeGroup>
                </ul>
            </div>
        </div>
    );
};

const TreeGroup: React.FC<any> = ({ title, count, icon: Icon, color, expanded, onToggle, children }) => (
    <li>
        <div onClick={onToggle} className="flex items-center gap-1 cursor-pointer p-1 rounded hover:bg-slate-100 text-slate-600">
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            <Icon size={14} className={color}/>
            <span>{title} ({count})</span>
        </div>
        {expanded && <ul className="pl-4 border-l border-slate-200 ml-2 max-h-32 overflow-y-auto text-xs">{children}</ul>}
    </li>
);
const TreeItem: React.FC<any> = ({ label, onClick }) => <li onClick={onClick} className="p-1 rounded cursor-pointer hover:bg-blue-50 text-slate-500">{label}</li>;

export default ModelExplorer;