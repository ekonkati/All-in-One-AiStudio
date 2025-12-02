
import React, { useEffect, useRef, useState } from 'react';
import { Download, Maximize, ZoomIn, ZoomOut, Grid } from 'lucide-react';
import { ProjectDetails } from '../../types';

interface DetailingViewerProps {
  project: Partial<ProjectDetails>;
}

const DetailingViewer: React.FC<DetailingViewerProps> = ({ project }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [detailType, setDetailType] = useState<string>('primary');

  // Drawing Logic
  const drawDetail = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Grid Background
    ctx.strokeStyle = '#f0f9ff';
    ctx.lineWidth = 1;
    const gridSize = 20;
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    const cx = width / 2;
    const cy = height / 2;

    if (project.type === 'PEB' || project.type === 'Steel') {
        drawPEBConnection(ctx, cx, cy);
    } else if (project.type === 'Retaining Wall') {
        drawWallReinforcement(ctx, cx, cy);
    } else {
        drawRCCBeamSection(ctx, cx, cy);
    }

    // Title Block
    drawTitleBlock(ctx, width, height);
  };

  const drawRCCBeamSection = (ctx: CanvasRenderingContext2D, cx: number, cy: number) => {
      // Beam Longitudinal Section
      const beamL = 600;
      const beamD = 100;
      const x = cx - beamL/2;
      const y = cy - 50;

      // Concrete Outline
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, beamL, beamD);
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(x, y, beamL, beamD);

      // Supports (Columns)
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(x - 20, y, 20, 150); // Left Col
      ctx.fillRect(x + beamL, y, 20, 150); // Right Col
      ctx.strokeRect(x - 20, y, 20, 150);
      ctx.strokeRect(x + beamL, y, 20, 150);

      // Rebar - Top (Main)
      ctx.beginPath();
      ctx.strokeStyle = '#dc2626'; // Red
      ctx.lineWidth = 4;
      ctx.moveTo(x - 15, y + 15);
      ctx.lineTo(x + beamL + 15, y + 15);
      // L-bends
      ctx.lineTo(x + beamL + 15, y + 60);
      ctx.moveTo(x - 15, y + 15);
      ctx.lineTo(x - 15, y + 60);
      ctx.stroke();

      // Rebar - Bottom (Main)
      ctx.beginPath();
      ctx.strokeStyle = '#1d4ed8'; // Blue
      ctx.lineWidth = 4;
      ctx.moveTo(x - 15, y + beamD - 15);
      ctx.lineTo(x + beamL + 15, y + beamD - 15);
      // L-bends
      ctx.lineTo(x + beamL + 15, y + beamD - 60);
      ctx.moveTo(x - 15, y + beamD - 15);
      ctx.lineTo(x - 15, y + beamD - 60);
      ctx.stroke();

      // Stirrups
      ctx.strokeStyle = '#059669'; // Green
      ctx.lineWidth = 1;
      const spacing = 20;
      for(let i=10; i<beamL; i+=spacing) {
          // Closer spacing near supports
          let s = spacing;
          if(i < 150 || i > beamL - 150) s = 10;
          
          ctx.beginPath();
          ctx.moveTo(x + i, y + 10);
          ctx.lineTo(x + i, y + beamD - 10);
          ctx.stroke();
      }

      // Labels
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 14px Inter';
      ctx.fillText('TYP. BEAM LONGITUDINAL SECTION', x, y - 40);
      
      ctx.font = '12px Inter';
      ctx.fillStyle = '#dc2626';
      ctx.fillText('2-20Φ Top (Through)', x + beamL/2 - 40, y + 10);
      
      ctx.fillStyle = '#1d4ed8';
      ctx.fillText('3-20Φ Bot (Main)', x + beamL/2 - 40, y + beamD + 20);

      ctx.fillStyle = '#059669';
      ctx.fillText('8Φ @ 100c/c (Support)', x + 20, y + beamD + 40);
      ctx.fillText('8Φ @ 150c/c (Mid)', x + beamL/2 - 20, y + beamD + 40);
  };

  const drawPEBConnection = (ctx: CanvasRenderingContext2D, cx: number, cy: number) => {
      // Knee Joint (Column to Rafter)
      const scale = 1.5;
      
      ctx.translate(cx - 100, cy + 100);
      ctx.scale(scale, scale);

      // Column (Tapered)
      ctx.beginPath();
      ctx.fillStyle = '#e2e8f0';
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2;
      ctx.moveTo(0, 0); // Base
      ctx.lineTo(0, -200); // Top outer
      ctx.lineTo(40, -200); // Top Inner
      ctx.lineTo(20, 0); // Bottom Inner
      ctx.closePath();
      ctx.fill(); ctx.stroke();

      // Rafter (Tapered)
      ctx.beginPath();
      ctx.moveTo(42, -200); // Connection Point
      ctx.lineTo(250, -250); // Ridge
      ctx.lineTo(250, -280); 
      ctx.lineTo(42, -240); // Top Connection
      ctx.closePath();
      ctx.fill(); ctx.stroke();

      // End Plate
      ctx.fillStyle = '#475569';
      ctx.fillRect(40, -250, 4, 60);

      // Bolts
      ctx.fillStyle = '#ef4444';
      for(let i=0; i<4; i++) {
          ctx.beginPath();
          ctx.arc(42, -240 + (i*12), 2, 0, Math.PI*2);
          ctx.fill();
      }

      // Haunch Reinforcement (Stiffener)
      ctx.beginPath();
      ctx.strokeStyle = '#64748b';
      ctx.moveTo(42, -220);
      ctx.lineTo(80, -225);
      ctx.stroke();

      // Reset Transform
      ctx.scale(1/scale, 1/scale);
      ctx.translate(-(cx - 100), -(cy + 100));

      // Annotations
      ctx.font = 'bold 16px Inter';
      ctx.fillStyle = '#0f172a';
      ctx.fillText('PEB EAVE KNEE CONNECTION', cx - 120, cy - 150);

      ctx.font = '12px Inter';
      ctx.fillStyle = '#334155';
      ctx.fillText('Column ISMB 450 (Tapered)', cx - 180, cy + 50);
      ctx.fillText('Rafter ISMB 350', cx + 100, cy - 100);
      
      ctx.fillStyle = '#ef4444';
      ctx.fillText('8x M24 HSFG Bolts (8.8 Grade)', cx, cy - 40);
  };

  const drawWallReinforcement = (ctx: CanvasRenderingContext2D, cx: number, cy: number) => {
      // Retaining Wall Section
      const scale = 2;
      ctx.translate(cx, cy + 50);
      ctx.scale(scale, scale);

      // Concrete Outline
      ctx.beginPath();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      // Stem
      ctx.moveTo(0, 0);
      ctx.lineTo(15, 0);
      ctx.lineTo(15, -100);
      ctx.lineTo(0, -100);
      ctx.closePath();
      // Base
      ctx.rect(-20, 0, 60, 10);
      ctx.stroke();

      // Rebar - Stem Main
      ctx.beginPath();
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 1;
      ctx.moveTo(12, -95);
      ctx.lineTo(12, 5);
      ctx.lineTo(35, 5); // Development length into toe
      ctx.stroke();

      // Rebar - Base Mesh
      ctx.beginPath();
      ctx.strokeStyle = '#1d4ed8';
      ctx.moveTo(-15, 5);
      ctx.lineTo(35, 5);
      ctx.stroke();

      ctx.scale(1/scale, 1/scale);
      ctx.translate(-cx, -(cy + 50));

      ctx.font = 'bold 14px Inter';
      ctx.fillStyle = '#0f172a';
      ctx.fillText('WALL REINFORCEMENT DETAIL', cx - 80, cy - 120);
      ctx.font = '12px Inter';
      ctx.fillText('Main Bar: 16Φ @ 150 c/c', cx + 40, cy - 40);
  };

  const drawTitleBlock = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      const boxH = 60;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, h - boxH, w, boxH);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, h - boxH, w, boxH);

      ctx.fillStyle = '#000000';
      ctx.font = 'bold 14px Inter';
      ctx.fillText('StructurAI Generated Drawing', 20, h - 35);
      
      ctx.font = '12px Inter';
      ctx.fillText(`Project: ${project.name || 'Untitled'}`, 20, h - 15);
      
      ctx.textAlign = 'right';
      ctx.fillText(`Date: ${new Date().toLocaleDateString()}`, w - 20, h - 35);
      ctx.fillText('Scale: NTS', w - 20, h - 15);
      ctx.textAlign = 'left';
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const parent = canvas.parentElement;
      if (parent) {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = parent.clientWidth * dpr;
        canvas.height = parent.clientHeight * dpr;
        canvas.style.width = `${parent.clientWidth}px`;
        canvas.style.height = `${parent.clientHeight}px`;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.scale(dpr, dpr);
            drawDetail(ctx, parent.clientWidth, parent.clientHeight);
        }
      }
    }
  }, [project, detailType]);

  return (
    <div className="flex flex-col h-full bg-slate-50 p-6">
      <div className="mb-4 flex justify-between items-center">
         <div className="flex gap-2">
             <button 
                onClick={() => setDetailType('primary')}
                className={`px-3 py-1 text-sm rounded transition-colors ${detailType === 'primary' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-300'}`}
             >
                {project.type === 'PEB' ? 'Knee Connection' : 'Beam Section'}
             </button>
             <button 
                onClick={() => setDetailType('secondary')}
                className={`px-3 py-1 text-sm rounded transition-colors ${detailType === 'secondary' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-300'}`}
             >
                {project.type === 'PEB' ? 'Base Plate' : 'Column Section'}
             </button>
         </div>
         <div className="flex gap-2">
            <button className="p-2 bg-white border border-slate-300 rounded hover:bg-slate-100 text-slate-600"><ZoomIn size={18} /></button>
            <button className="p-2 bg-white border border-slate-300 rounded hover:bg-slate-100 text-slate-600"><ZoomOut size={18} /></button>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow-sm">
                <Download size={16} /> Export DXF
            </button>
         </div>
      </div>
      <div className="flex-1 bg-white border border-slate-300 shadow-lg rounded overflow-hidden">
         <canvas ref={canvasRef} className="block" />
      </div>
    </div>
  );
};

export default DetailingViewer;
