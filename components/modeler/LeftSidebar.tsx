import React from 'react';
import { Node, Member, SelectedEntity, Support, StructuralLoad, Material, Section, Plate } from '../../types/index';
import ModelExplorer from './ModelExplorer';
import PropertiesPanel from './PropertiesPanel';

interface LeftSidebarProps {
    nodes: Node[]; members: Member[]; plates: Plate[]; supports: Support[]; loads: StructuralLoad[]; materials: Material[]; sections: Section[];
    selectedEntity: SelectedEntity | null;
    onSelectEntity: (entity: SelectedEntity | null) => void;
    onUpdateEntity: (id: any, type: 'node' | 'member' | 'support' | 'plate', newProps: any) => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ nodes, members, plates, supports, materials, sections, selectedEntity, onSelectEntity, onUpdateEntity }) => {
    
    const getEntityObject = () => {
        if (!selectedEntity) return null;
        switch (selectedEntity.type) {
            case 'node': return nodes.find(e => e.id === selectedEntity.id);
            case 'member': return members.find(e => e.id === selectedEntity.id);
            case 'plate': return plates.find(e => e.id === selectedEntity.id);
            case 'support': return supports.find(e => e.id === selectedEntity.id);
            default: return null;
        }
    };
    const entityObject = getEntityObject();

    return (
        <aside className="w-72 bg-white border-r border-slate-200 flex flex-col">
            {selectedEntity && entityObject ? (
                 <PropertiesPanel 
                    entity={entityObject} 
                    entityType={selectedEntity.type}
                    onUpdate={(newProps) => onUpdateEntity(selectedEntity.id, selectedEntity.type, newProps)}
                    onDeselect={() => onSelectEntity(null)}
                />
            ) : (
                <ModelExplorer 
                    nodes={nodes} members={members} plates={plates} supports={supports} materials={materials} sections={sections}
                    onSelectEntity={onSelectEntity}
                />
            )}
        </aside>
    );
};

export default LeftSidebar;