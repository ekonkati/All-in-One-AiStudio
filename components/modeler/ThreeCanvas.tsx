import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Node, Member, SelectedEntity, ModelerTool, Support, StructuralLoad, Plate, AnalysisResults } from '../../types/index';

interface ThreeCanvasProps {
    nodes: Node[]; members: Member[]; plates: Plate[]; supports: Support[]; loads: StructuralLoad[];
    selectedEntity: SelectedEntity | null;
    analysisResults: AnalysisResults | null;
    showDiagram: 'none' | 'moment' | 'shear';
    onSelectEntity: (entity: SelectedEntity | null) => void;
    activeTool: ModelerTool;
    onModelAction: (action: string, payload: any) => void;
    logMessage: (message: string) => void;
}

const ThreeCanvas: React.FC<ThreeCanvasProps> = (props) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);

    useEffect(() => {
        if (!mountRef.current) return;
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf8fafc);
        sceneRef.current = scene;
        const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 2000);
        camera.position.set(30, 30, 30);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        mountRef.current.appendChild(renderer.domElement);
        const controls = new OrbitControls(camera, renderer.domElement);
        scene.add(new THREE.AmbientLight(0xffffff, 0.8));
        scene.add(new THREE.GridHelper(100, 20, 0xcbd5e1, 0xe2e8f0));
        const animate = () => { requestAnimationFrame(animate); controls.update(); renderer.render(scene, camera); };
        animate();
        return () => { mountRef.current?.removeChild(renderer.domElement); };
    }, []);

    useEffect(() => {
        const scene = sceneRef.current;
        if (!scene) return;
        scene.children.filter(c => c.userData.isEntity).forEach(c => scene.remove(c));

        props.nodes.forEach(node => {
            const isSelected = props.selectedEntity?.type === 'node' && props.selectedEntity.id === node.id;
            const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshLambertMaterial({ color: isSelected ? 0x2563eb : 0x64748b }));
            sphere.position.set(node.x, node.y, node.z);
            sphere.userData = { type: 'node', id: node.id, isEntity: true };
            scene.add(sphere);
        });

        props.members.forEach(member => {
            const isSelected = props.selectedEntity?.type === 'member' && props.selectedEntity.id === member.id;
            const start = props.nodes.find(n => n.id === member.startNode);
            const end = props.nodes.find(n => n.id === member.endNode);
            if (start && end) {
                const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(start.x, start.y, start.z), new THREE.Vector3(end.x, end.y, end.z)]), new THREE.LineBasicMaterial({ color: isSelected ? 0x3b82f6 : 0x475569, linewidth: isSelected ? 4 : 2 }));
                line.userData = { type: 'member', id: member.id, isEntity: true };
                scene.add(line);
            }
        });
        
        props.plates.forEach(plate => {
            const isSelected = props.selectedEntity?.type === 'plate' && props.selectedEntity.id === plate.id;
            const plateNodes = plate.nodes.map(nodeId => props.nodes.find(n => n.id === nodeId));
            if (plateNodes.every(n => n)) {
                const shape = new THREE.Shape(plateNodes.map(n => new THREE.Vector2(n!.x, n!.z)));
                const geometry = new THREE.ShapeGeometry(shape);
                geometry.translate(0, plateNodes[0]!.y, 0); // Position slab at correct height
                const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: isSelected ? 0x3b82f6 : 0x93c5fd, side: THREE.DoubleSide, transparent: true, opacity: 0.5 }));
                mesh.userData = { type: 'plate', id: plate.id, isEntity: true };
                scene.add(mesh);
            }
        });

        // Render Supports
        props.supports.forEach(support => {
            const node = props.nodes.find(n => n.id === support.nodeId);
            if(node) {
                const geometry = new THREE.BoxGeometry(1, 0.5, 1);
                const material = new THREE.MeshBasicMaterial({ color: 0x10b981 });
                const cube = new THREE.Mesh(geometry, material);
                cube.position.set(node.x, node.y - 0.25, node.z);
                cube.userData = { type: 'support', id: support.id, isEntity: true };
                scene.add(cube);
            }
        });

        // Render Loads
        props.loads.forEach(load => {
            if (load.entityType === 'node') {
                const node = props.nodes.find(n => n.id === load.entityId);
                if(node){
                    const dir = new THREE.Vector3(0, -1, 0); // Assuming Gravity
                    const origin = new THREE.Vector3(node.x, node.y, node.z);
                    const arrow = new THREE.ArrowHelper(dir, origin, 3, 0xf43f5e, 1, 0.5);
                    arrow.userData = { isEntity: true };
                    scene.add(arrow);
                }
            }
        });

        // Render Analysis Diagrams
        if (props.analysisResults && props.showDiagram !== 'none') {
            props.members.forEach(member => {
                const forces = props.analysisResults?.memberForces[member.id];
                if (!forces) return;
                const diagramValue = props.showDiagram === 'moment' ? forces.Mz : forces.Vy;
                const diagramColor = props.showDiagram === 'moment' ? 0xef4444 : 0x22c55e;
                //... (complex logic to draw diagram shapes) ...
            });
        }

    }, [props.nodes, props.members, props.plates, props.supports, props.loads, props.selectedEntity, props.analysisResults, props.showDiagram]);

    return <div ref={mountRef} className="w-full h-full cursor-crosshair" />;
};

export default ThreeCanvas;