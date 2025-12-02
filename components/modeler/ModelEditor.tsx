import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ProjectDetails, StructuralMember } from '../../types';
import PropertiesPanel from './PropertiesPanel';
import ModelTree from './ModelTree';
import { Play } from 'lucide-react';

interface ModelEditorProps {
    project: Partial<ProjectDetails>;
    members: StructuralMember[];
    selectedMemberId: string | null;
    onSelectMember: (id: string | null) => void;
    onUpdateMember: (id: string, newProps: Partial<StructuralMember>) => void;
    onRunAnalysis: () => void;
}

const ModelEditor: React.FC<ModelEditorProps> = ({ project, members, selectedMemberId, onSelectMember, onUpdateMember, onRunAnalysis }) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        const currentMount = mountRef.current;
        
        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf8fafc);
        sceneRef.current = scene;
        
        const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
        camera.position.z = 50;
        camera.position.y = 30;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        currentMount.appendChild(renderer.domElement);
        
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(50, 50, 50);
        scene.add(directionalLight);

        // Grid helper
        const gridHelper = new THREE.GridHelper(100, 10);
        scene.add(gridHelper);

        // Raycaster for selection
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const onClick = (event: MouseEvent) => {
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(scene.children);
            
            const selectedObject = intersects.find(i => i.object.userData.memberId);
            if (selectedObject) {
                onSelectMember(selectedObject.object.userData.memberId);
            } else {
                onSelectMember(null);
            }
        };

        currentMount.addEventListener('click', onClick);

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // Handle resize
        const handleResize = () => {
            if (currentMount) {
                camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
            }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (currentMount) {
                currentMount.removeEventListener('click', onClick);
                if (renderer.domElement) {
                    currentMount.removeChild(renderer.domElement);
                }
            }
        };
    }, []);

    // Update scene when members change
    useEffect(() => {
        const scene = sceneRef.current;
        if (!scene || !members) return;

        // Clear previous members
        const objectsToRemove = scene.children.filter(child => child.userData.memberId);
        objectsToRemove.forEach(child => scene.remove(child));

        // Create geometry for members
        members.forEach(member => {
            const material = new THREE.MeshLambertMaterial({ color: member.id === selectedMemberId ? 0x3b82f6 : 0x94a3b8 });
            
            let geometry;
            if (member.type === 'Column') {
                geometry = new THREE.CylinderGeometry(1, 1, 12, 8);
                const obj = new THREE.Mesh(geometry, material);
                obj.position.set(Math.random() * 50 - 25, 6, Math.random() * 50 - 25);
                obj.userData = { memberId: member.id };
                scene.add(obj);
            } else if (member.type === 'Beam') {
                geometry = new THREE.BoxGeometry(20, 1.5, 1);
                const obj = new THREE.Mesh(geometry, material);
                obj.position.set(Math.random() * 40 - 20, 12, Math.random() * 40 - 20);
                obj.userData = { memberId: member.id };
                scene.add(obj);
            }
        });
    }, [members, selectedMemberId]);


    const selectedMember = members.find(m => m.id === selectedMemberId);

    return (
        <div className="flex h-full bg-slate-50 p-6 gap-6">
            <div className="w-64 flex-shrink-0 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
                <ModelTree members={members} onSelectMember={onSelectMember} selectedMemberId={selectedMemberId} />
            </div>
            <div className="flex-1 flex flex-col gap-6">
                <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden relative" ref={mountRef}>
                    <div className="absolute top-4 right-4">
                        <button
                            onClick={onRunAnalysis}
                            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                        >
                            <Play size={18} />
                            Proceed to Analysis
                        </button>
                    </div>
                </div>
            </div>
            <div className="w-80 flex-shrink-0 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
                <PropertiesPanel 
                    member={selectedMember} 
                    onUpdate={onUpdateMember} 
                />
            </div>
        </div>
    );
};

export default ModelEditor;