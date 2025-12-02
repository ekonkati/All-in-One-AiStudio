import React, { useEffect, useRef, useState } from 'react';
import { Download, Maximize, ZoomIn, ZoomOut, Grid, Layout, FileType, Loader2 } from 'lucide-react';
import { ProjectDetails, ActionCost } from '../../types/index';

interface DetailingViewerProps {
  project: Partial<ProjectDetails>;
  onActionRequest?: (action: () => void, costKey: keyof ActionCost) => void;
}

const DetailingViewer: React.FC<DetailingViewerProps> = ({ project, onActionRequest }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentSheet, setCurrentSheet] = useState<string>('GA-01');
  const [isExporting, setIsExporting] = useState(false);

  const sheets = [
      { id: 'GA-01', title: 'General Arrangement' },
      { id: 'BM-01', title: 'Beam Reinforcement Details' },
      { id: 'COL-01', title: 'Column Layout & Schedule' },
      { id: 'FT-01', title: 'Foundation Details' },
      { id: 'ST-01', title: 'Staircase Section' }
  ];

  const exportAction = () => {
      setIsExporting(true);
      setTimeout(() => {
          setIsExporting(false);
          alert("Drawing Package (PDF + DXF) generated successfully!");
      }, 2000);
  };

  const handleExport = () => {
    if (onActionRequest) {
      onActionRequest(exportAction, 'drawingSheet');
    } else {
      exportAction();
    }
  };

  // Drawing Logic (Simplified for demo)
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

    // Dynamic Drawing based on Sheet Selection
    if (currentSheet === 'BM-01') {
        drawRCCBeamSection(ctx, cx, cy);
    } else if (currentSheet === 'GA-01') {
        drawGALayout(ctx, cx, cy);
    } else {
        // Generic Placeholder for other sheets
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '20px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(`${sheets.find(s => s.id === currentSheet)?.title} - Placeholder`, cx, cy);
    }

    // Title Block
    drawTitleBlock(ctx, width, height);
  };

  const drawGALayout = (ctx: CanvasRenderingContext2D, cx: number, cy: number) => {
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      // Simple Grid
      const size = 200;
      ctx.strokeRect(cx - size, cy - size, size*2, size*2);
      ctx.beginPath();
      ctx.moveTo(cx, cy - size); ctx.lineTo(cx, cy + size);
      ctx.moveTo(cx - size, cy); ctx.lineTo(cx + size, cy);
      ctx.stroke();
      
      // Columns
      ctx.fillStyle = '#ef4444';
      [cx-size, cx, cx+size].forEach(x => {
          [cy-size, cy, cy+size].forEach(y => {
              ctx.fillRect(x - 5, y - 5, 10, 10);
          });
      });
      
      ctx.fillStyle = '#0f172a';
      ctx.font = '14px Inter';
      ctx.textAlign = 'center';
      ctx.fillText('STRUCTURAL LAYOUT PLAN', cx, cy + size + 30);
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

  const drawTitleBlock = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      const boxH = 60;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, h - boxH, w, boxH);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, h - boxH, w, boxH);

      ctx.fillStyle = '#000000';
      ctx.font = 'bold 14px Inter';
      ctx.textAlign = 'left';
      ctx.fillText('StructurAI Generated Drawing', 20, h - 35);
      
      ctx.font = '12px Inter';
      ctx.fillText(`Project: ${project.name || 'Untitled'} - Sheet: ${currentSheet}`, 20, h - 15);
      
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
  }, [project, currentSheet]);

  return (
    <div className="flex h-full bg-slate-50 p-6 gap-4">
      
      {/* Sheet Selector Sidebar */}
      <div className="w-64 bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col">
          <div className="p-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                  <Layout size={16} /> Drawing Sheets
              </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {sheets.map(sheet => (
                  <button
                      key={sheet.id}
                      onClick={() => setCurrentSheet(sheet.id)}
                      className={`w-full text-left px-3 py-2 rounded text-sm transition-colors flex items-center gap-2 ${
                          currentSheet === sheet.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                  >
                      <FileType size={14} className="opacity-70" />
                      <div className="truncate">
                          <span className="font-mono text-xs mr-2 opacity-70">{sheet.id}</span>
                          {sheet.title}
                      </div>
                  </button>
              ))}
          </div>
          <div className="p-4 border-t border-slate-100">
              <button 
                onClick={handleExport}
                disabled={isExporting}
                className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-70"
              >
                  {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                  {isExporting ? 'Packaging...' : 'Export All (DXF/PDF)'}
              </button>
          </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex flex-col bg-white border border-slate-300 shadow-lg rounded overflow-hidden">
         <div className="p-2 bg-slate-100 border-b border-slate-200 flex justify-end gap-2">
            <button className="p-1.5 bg-white border border-slate-300 rounded hover:bg-slate-50 text-slate-600"><ZoomIn size={16} /></button>
            <button className="p-1.5 bg-white border border-slate-300 rounded hover:bg-slate-50 text-slate-600"><ZoomOut size={16} /></button>
         </div>
         <div className="flex-1 relative">
            <canvas ref={canvasRef} className="block w-full h-full" />
         </div>
      </div>
    </div>
  );
};

export default DetailingViewer;
