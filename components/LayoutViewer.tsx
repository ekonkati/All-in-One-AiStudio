import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Download, Maximize, ZoomIn, ZoomOut, RefreshCw, Layers, ArrowRight, Upload, ShieldCheck, XCircle, AlertTriangle, Box, Activity, Zap, CheckSquare, Wand2, ScanLine, BrainCircuit, Info, Grid } from 'lucide-react';
import { ProjectDetails, ViewState } from '../types';
import { checkCompliance, generateMEP } from '../services/calculationService';

interface LayoutViewerProps {
  project: Partial<ProjectDetails>;
  onChangeView?: (view: ViewState) => void;
}

const LayoutViewer: React.FC<LayoutViewerProps> = ({ project, onChangeView }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [viewMode, setViewMode] = useState<'architectural' | 'structural' | 'isometric' | 'mep'>('structural');
  const [showCompliance, setShowCompliance] = useState(false);
  const [showReasoning, setShowReasoning] = useState(false); // SWIL State
  const [clashResolved, setClashResolved] = useState(false);
  const [isTracing, setIsTracing] = useState(false);
  
  const complianceChecks = useMemo(() => checkCompliance(project), [project]);
  
  // Generate MEP items based on layout dimensions (mock logic)
  const initialMepItems = useMemo(() => {
      return generateMEP(800, 600); 
  }, []);

  const [mepItems, setMepItems] = useState(initialMepItems);

  const handleResolveClash = () => {
      setMepItems(prev => prev.map(item => {
          if (item.clash) {
              // Simple reroute logic simulation
              return {
                  ...item,
                  clash: false,
                  color: '#10b981', // Turn green
                  start: { ...item.start, x: item.start.x + 20 }, // Shift position
                  end: { ...item.end, x: item.end.x + 20 }
              };
          }
          return item;
      }));
      setClashResolved(true);
  };

  const handleTraceSketch = () => {
    setIsTracing(true);
    // Simulate AI processing time
    setTimeout(() => {
        setIsTracing(false);
        setViewMode('architectural'); // Switch to the generated view
        alert("AI Vectorization Complete: Hand-sketch converted to parametric plan.");
    }, 2500);
  };

  const drawLayout = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);

    if (viewMode === 'isometric') {
        drawIsometric(ctx, width, height);
        return;
    }

    // Background Grid
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    const gridSize = 40;
    
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    const pType = project.type || 'RCC';

    if (pType === 'Retaining Wall') {
        drawRetainingWall(ctx, width, height);
        return;
    }
    if (pType === 'Water Tank') {
        drawWaterTank(ctx, width, height);
        return;
    }
    if (pType === 'Landfill') {
        drawLandfill(ctx, width, height);
        return;
    }

    // Standard Buildings (RCC/PEB)
    const pLength = project.dimensions?.length || 60;
    const pWidth = project.dimensions?.width || 40;
    
    const scale = Math.min((width - 150) / pLength, (height - 150) / pWidth);
    const drawW = pWidth * scale;
    const drawL = pLength * scale;
    const startX = (width - drawL) / 2;
    const startY = (height - drawW) / 2;

    // Shadow/Base
    ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(startX, startY, drawL, drawW);
    ctx.shadowBlur = 0;

    // Plot Boundary
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3;
    ctx.strokeRect(startX, startY, drawL, drawW);

    if (viewMode === 'structural') {
        if (pType === 'PEB' || pType === 'Steel') {
            drawPEBStructure(ctx, startX, startY, drawL, drawW, pLength, pWidth);
        } else {
            drawRCCStructure(ctx, startX, startY, drawL, drawW, pLength, pWidth);
        }
    } else if (viewMode === 'architectural') {
        drawArchitectural(ctx, startX, startY, drawL, drawW);
    } else if (viewMode === 'mep') {
        // Draw basic architectural context first
        ctx.globalAlpha = 0.3;
        drawArchitectural(ctx, startX, startY, drawL, drawW);
        ctx.globalAlpha = 1.0;
        // Use MEP items
        drawMEP(ctx, startX, startY, drawL, drawW);
    }

    // Dimensions
    drawDimensionLines(ctx, startX, startY, drawL, drawW, pLength, pWidth);
  };

  const drawIsometric = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      // Simple Isometric Projection Logic (2.5D)
      const cx = w / 2;
      const cy = h / 2 - 100;
      const scale = 0.8;
      
      const pLength = (project.dimensions?.length || 60) * 2;
      const pWidth = (project.dimensions?.width || 40) * 2;
      const pHeight = (project.stories || 1) * 40;

      // Isometric transformations
      const toIso = (x: number, y: number, z: number) => {
          return {
              x: cx + (x - y) * Math.cos(Math.PI / 6) * scale,
              y: cy + (x + y) * Math.sin(Math.PI / 6) * scale - z * scale
          };
      };

      // Draw Grid (Floor)
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      const step = 40;
      for (let x = -pLength/2; x <= pLength/2; x += step) {
          const start = toIso(x, -pWidth/2, 0);
          const end = toIso(x, pWidth/2, 0);
          ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(end.x, end.y); ctx.stroke();
      }
      for (let y = -pWidth/2; y <= pWidth/2; y += step) {
          const start = toIso(-pLength/2, y, 0);
          const end = toIso(pLength/2, y, 0);
          ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(end.x, end.y); ctx.stroke();
      }

      // Draw Structure (Columns & Beams)
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.fillStyle = '#94a3b8';

      // Columns
      for (let x = -pLength/2; x <= pLength/2; x += step) {
          for (let y = -pWidth/2; y <= pWidth/2; y += step) {
              const base = toIso(x, y, 0);
              const top = toIso(x, y, pHeight);
              ctx.beginPath(); ctx.moveTo(base.x, base.y); ctx.lineTo(top.x, top.y); ctx.stroke();
              
              // Draw node
              ctx.beginPath(); ctx.arc(top.x, top.y, 2, 0, Math.PI*2); ctx.fill();
          }
      }

      // Roof Beams (Top Floor)
      ctx.strokeStyle = '#3b82f6';
      for (let x = -pLength/2; x <= pLength/2; x += step) {
          const start = toIso(x, -pWidth/2, pHeight);
          const end = toIso(x, pWidth/2, pHeight);
          ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(end.x, end.y); ctx.stroke();
      }
      for (let y = -pWidth/2; y <= pWidth/2; y += step) {
          const start = toIso(-pLength/2, y, pHeight);
          const end = toIso(pLength/2, y, pHeight);
          ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(end.x, end.y); ctx.stroke();
      }

      ctx.fillStyle = '#0f172a';
      ctx.font = '14px Inter';
      ctx.textAlign = 'center';
      ctx.fillText('3D Isometric View (Wireframe)', cx, h - 30);
  };

  const drawWaterTank = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      const cx = w / 2;
      const cy = h / 2;
      const radius = 120;

      // Plan View
      ctx.beginPath();
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 3;
      ctx.arc(cx, cy, radius, 0, 2 * Math.PI); // Outer Wall
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.arc(cx, cy, radius - 20, 0, 2 * Math.PI); // Inner Water Line
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.fillStyle = 'rgba(14, 165, 233, 0.1)';
      ctx.arc(cx, cy, radius - 20, 0, 2 * Math.PI); 
      ctx.fill();

      // Columns
      const numCols = 8;
      for(let i=0; i<numCols; i++) {
          const angle = (i * 2 * Math.PI) / numCols;
          const x = cx + (radius * Math.cos(angle));
          const y = cy + (radius * Math.sin(angle));
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(x-6, y-6, 12, 12);
      }

      ctx.fillStyle = '#0c4a6e';
      ctx.font = '16px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(`Overhead Water Tank`, cx, cy + radius + 40);
      ctx.font = '12px Inter';
      ctx.fillText(`Dia: ${project.dimensions?.length} ft`, cx, cy + radius + 60);
  };

  const drawLandfill = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      const scale = 0.8;
      const cx = w/2;
      const cy = h/2;
      const drawW = w * scale;
      const drawH = h * scale;
      const sx = (w - drawW)/2;
      const sy = (h - drawH)/2;

      // Draw Cells
      const cellsX = 3;
      const cellsY = 3;
      const cellW = drawW / cellsX;
      const cellH = drawH / cellsY;

      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;

      for(let i=0; i<cellsX; i++) {
          for(let j=0; j<cellsY; j++) {
              ctx.strokeRect(sx + i*cellW, sy + j*cellH, cellW, cellH);
              
              // Fill Pattern for Waste
              if((i+j)%2 === 0) {
                  ctx.fillStyle = '#f1f5f9';
                  ctx.fillRect(sx + i*cellW + 5, sy + j*cellH + 5, cellW - 10, cellH - 10);
                  ctx.fillStyle = '#64748b';
                  ctx.font = '12px Inter';
                  ctx.fillText(`Cell ${i+1}-${j+1}`, sx + i*cellW + cellW/2, sy + j*cellH + cellH/2);
              }
          }
      }

      // Berms
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 4;
      ctx.strokeRect(sx, sy, drawW, drawH);
      ctx.fillText('Perimeter Berm / Anchor Trench', sx + drawW/2, sy - 10);
  };

  const drawRetainingWall = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      // Draw Cantilever Retaining Wall Cross Section
      const cx = w / 2;
      const cy = h / 2 + 100;
      const scale = 15;

      const wallHeight = (project.dimensions?.width || 12) * scale; 
      const baseWidth = (wallHeight * 0.6); // Base is roughly 0.6H
      const toeWidth = baseWidth / 3;
      const stemBot = 18 * scale / 12; // 18 inches
      const slabThk = 20 * scale / 12; // 20 inches

      ctx.beginPath();
      ctx.fillStyle = '#cbd5e1'; 
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;

      // Draw Base Slab
      ctx.rect(cx - toeWidth, cy, baseWidth, slabThk);
      ctx.fill(); ctx.stroke();

      // Draw Stem
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + stemBot, cy);
      ctx.lineTo(cx + stemBot, cy - wallHeight); 
      ctx.lineTo(cx, cy - wallHeight);
      ctx.closePath();
      ctx.fill(); ctx.stroke();

      // Soil Wedge
      ctx.beginPath();
      ctx.moveTo(cx + stemBot, cy);
      ctx.lineTo(cx + baseWidth - toeWidth, cy); 
      ctx.lineTo(cx + baseWidth - toeWidth, cy - wallHeight); 
      ctx.lineTo(cx + stemBot, cy - wallHeight / 2); 
      ctx.fillStyle = 'rgba(217, 119, 6, 0.2)'; 
      ctx.fill();

      ctx.fillStyle = '#334155';
      ctx.font = '14px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(`Retaining Wall H=${project.dimensions?.width || 12}ft`, cx, cy - wallHeight - 20);
  };

  const drawRCCStructure = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, realW: number, realH: number) => {
      const colSpan = 15; // ft
      const colsX = Math.floor(realW / colSpan) + 1;
      const colsY = Math.floor(realH / colSpan) + 1;
      const spanX = w / (colsX - 1);
      const spanY = h / (colsY - 1);

      ctx.beginPath();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      for(let j=0; j<colsY; j++) {
        ctx.moveTo(x, y + (j * spanY));
        ctx.lineTo(x + w, y + (j * spanY));
      }
      for(let i=0; i<colsX; i++) {
        ctx.moveTo(x + (i * spanX), y);
        ctx.lineTo(x + (i * spanX), y + h);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#ef4444';
      for(let i=0; i<colsX; i++) {
          for(let j=0; j<colsY; j++) {
              const cx = x + (i * spanX);
              const cy = y + (j * spanY);
              ctx.fillRect(cx - 5, cy - 5, 10, 10);
              ctx.fillStyle = '#64748b';
              ctx.font = '10px Inter';
              ctx.fillText(`C${i}${j}`, cx + 8, cy + 8);
              ctx.fillStyle = '#ef4444';
          }
      }
  };

  const drawPEBStructure = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, realW: number, realH: number) => {
    const baySpacing = 20; 
    const numBays = Math.floor(realW / baySpacing);
    const bayPx = w / numBays;

    ctx.strokeStyle = '#2563eb'; 
    ctx.lineWidth = 4;
    for(let i=0; i<=numBays; i++) {
        ctx.beginPath();
        ctx.moveTo(x + (i * bayPx), y);
        ctx.lineTo(x + (i * bayPx), y + h);
        ctx.stroke();
        
        ctx.fillStyle = '#1e3a8a';
        ctx.fillRect(x + (i * bayPx) - 6, y - 6, 12, 12); 
        ctx.fillRect(x + (i * bayPx) - 6, y + h - 6, 12, 12); 
    }

    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    const numPurlins = 4;
    const purlinSpacing = h / (numPurlins + 1);
    
    for(let j=1; j<=numPurlins; j++) {
        ctx.beginPath();
        ctx.moveTo(x, y + (j * purlinSpacing));
        ctx.lineTo(x + w, y + (j * purlinSpacing));
        ctx.stroke();
    }
  };

  const drawArchitectural = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 4;
      ctx.strokeRect(x, y, w, h);

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.moveTo(x + w/2, y);
      ctx.lineTo(x + w/2, y + h); 
      ctx.moveTo(x, y + h/3);
      ctx.lineTo(x + w/2, y + h/3); 
      ctx.moveTo(x + w/2, y + 2*h/3);
      ctx.lineTo(x + w, y + 2*h/3); 
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '12px Inter';
      ctx.textAlign = 'left';
      ctx.fillText('Hall / Work Area', x + 20, y + h/2);
      ctx.fillText('Room 1', x + 20, y + 20);
      ctx.fillText('Office', x + w/2 + 20, y + h - 20);
  };

  const drawMEP = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
      // Use generated data but scale to current view
      const scaleX = w / 800; 
      const scaleY = h / 600;

      mepItems.forEach(item => {
          // Scale coordinates relative to current box
          const startX = x + (item.start.x * scaleX);
          const startY = y + (item.start.y * scaleY);
          const endX = x + (item.end.x * scaleX);
          const endY = y + (item.end.y * scaleY);
          
          ctx.strokeStyle = item.color;
          ctx.lineWidth = item.width * Math.min(scaleX, scaleY) * 0.5; // Scale width too
          if (item.type === 'Tray') ctx.setLineDash([10, 5]);
          else ctx.setLineDash([]);

          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.stroke();

          // Label
          ctx.fillStyle = item.color;
          ctx.font = '10px Inter';
          ctx.fillText(item.description, startX + 5, startY - 5);

          // Clash Indicator
          if (item.clash) {
              const midX = (startX + endX) / 2;
              const midY = (startY + endY) / 2;
              
              ctx.beginPath();
              ctx.arc(midX, midY, 10, 0, Math.PI * 2);
              ctx.fillStyle = 'rgba(239, 68, 68, 0.5)'; // Red halo
              ctx.fill();
              ctx.strokeStyle = '#ef4444';
              ctx.lineWidth = 2;
              ctx.stroke();
              
              ctx.fillStyle = '#ef4444';
              ctx.font = 'bold 12px Inter';
              ctx.fillText('CLASH!', midX + 12, midY + 4);
          }
      });
  };

  const drawDimensionLines = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, realW: number, realH: number) => {
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#475569';
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';

    ctx.beginPath(); ctx.moveTo(x, y - 20); ctx.lineTo(x + w, y - 20); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x, y - 15); ctx.lineTo(x, y - 25); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + w, y - 15); ctx.lineTo(x + w, y - 25); ctx.stroke();
    ctx.fillText(`${realW} ft`, x + w/2, y - 30);

    ctx.beginPath(); ctx.moveTo(x - 20, y); ctx.lineTo(x - 20, y + h); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x - 15, y); ctx.lineTo(x - 25, y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x - 15, y + h); ctx.lineTo(x - 25, y + h); ctx.stroke();
    
    ctx.save();
    ctx.translate(x - 30, y + h/2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`${realH} ft`, 0, 0);
    ctx.restore();
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
            drawLayout(ctx, parent.clientWidth, parent.clientHeight);
        }
      }
    }
  }, [project, viewMode, mepItems, isTracing]);

  return (
    <div className="flex flex-col h-full bg-slate-50 p-6 relative">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">
                {['Retaining Wall', 'Water Tank', 'Landfill'].includes(project.type || '') ? 'Section / Plan Viewer' : 'Concept Layout'}
            </h2>
            <p className="text-slate-500">Auto-generated geometry for {project.type} structure.</p>
        </div>
        <div className="flex flex-wrap gap-2">
            {!['Retaining Wall', 'Water Tank', 'Landfill'].includes(project.type || '') && (
                <div className="bg-white border border-slate-300 rounded flex p-1 mr-2">
                    <button 
                        onClick={() => setViewMode('structural')}
                        className={`px-3 py-1 text-sm rounded transition-colors ${viewMode === 'structural' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        Structural
                    </button>
                    <button 
                        onClick={() => setViewMode('architectural')}
                        className={`px-3 py-1 text-sm rounded transition-colors ${viewMode === 'architectural' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        Architectural
                    </button>
                    <button 
                        onClick={() => setViewMode('mep')}
                        className={`px-3 py-1 text-sm rounded transition-colors flex items-center gap-1 ${viewMode === 'mep' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        <Activity size={14} /> MEP
                    </button>
                    <button 
                        onClick={() => setViewMode('isometric')}
                        className={`px-3 py-1 text-sm rounded transition-colors flex items-center gap-1 ${viewMode === 'isometric' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        <Box size={14} /> 3D (Iso)
                    </button>
                </div>
            )}
            <button 
               onClick={() => setShowReasoning(!showReasoning)}
               className={`flex items-center gap-2 px-3 py-2 border rounded text-sm shadow-sm transition-colors ${showReasoning ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-purple-600 border-purple-200 hover:bg-purple-50'}`}
            >
               <BrainCircuit size={16} /> <span className="hidden sm:inline">Explain Design</span>
            </button>
            <button 
              onClick={() => setShowCompliance(!showCompliance)}
              className={`flex items-center gap-2 px-3 py-2 border rounded text-sm shadow-sm transition-colors ${showCompliance ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}`}
            >
                <ShieldCheck size={16} /> <span className="hidden sm:inline">Check Bylaws</span>
            </button>
             <button 
                onClick={handleTraceSketch}
                disabled={isTracing}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 rounded text-slate-600 hover:bg-slate-50 shadow-sm transition-colors text-sm disabled:opacity-70"
             >
                {isTracing ? <RefreshCw size={16} className="animate-spin" /> : <Upload size={16} />} 
                <span className="hidden sm:inline">{isTracing ? 'Vectorizing...' : 'Trace Sketch'}</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 shadow-sm text-sm">
                <Download size={16} /> <span className="hidden sm:inline">Export CAD</span>
            </button>
            {onChangeView && (
              <button 
                onClick={() => onChangeView('structure')}
                className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 shadow-sm text-sm"
              >
                <span>Analyze</span> <ArrowRight size={16} />
              </button>
            )}
        </div>
      </div>
      
      <div className="flex-1 flex gap-4 overflow-hidden">
         <div className="flex-1 bg-white border border-slate-200 shadow-sm rounded-lg overflow-hidden relative">
            <canvas ref={canvasRef} className="block" />
            
            {isTracing && (
                <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center backdrop-blur-sm">
                    <ScanLine size={48} className="text-blue-600 animate-pulse mb-4" />
                    <h3 className="text-xl font-bold text-slate-800">AI Vectorization in Progress</h3>
                    <p className="text-slate-500">Converting raster image to parametric CAD model (Part 32)</p>
                </div>
            )}

            {viewMode === 'mep' && (
                <div className="absolute top-4 left-4 bg-white/90 p-3 rounded-lg border border-slate-200 text-xs shadow-md backdrop-blur-sm">
                    <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2"><Activity size={14} /> MEP Coordination</h4>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-full"></div> HVAC Duct</div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-full"></div> Fire Pipe</div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-500 rounded-full"></div> Elec Tray</div>
                    </div>
                    
                    {mepItems.some(i => i.clash) && !clashResolved && (
                        <div className="mt-3 pt-3 border-t border-slate-200">
                            <div className="flex items-center gap-2 text-red-600 font-bold mb-2"><AlertTriangle size={14} /> 1 Clash Detected</div>
                            <button 
                                onClick={handleResolveClash}
                                className="w-full bg-indigo-600 text-white py-1.5 rounded flex items-center justify-center gap-1 hover:bg-indigo-700 shadow-sm animate-pulse"
                            >
                                <Wand2 size={12} /> AI Auto-Resolve
                            </button>
                        </div>
                    )}
                    {clashResolved && (
                        <div className="mt-3 pt-3 border-t border-slate-200 text-emerald-600 font-bold flex items-center gap-2">
                            <CheckSquare size={14} /> All Clashes Resolved
                        </div>
                    )}
                </div>
            )}
         </div>

         {/* AI Design Reasoning Panel (Part 23) */}
         {showReasoning && (
            <div className="w-80 bg-white border border-purple-200 rounded-lg shadow-xl p-0 overflow-hidden animate-in slide-in-from-right-10 duration-300 flex flex-col">
               <div className="bg-purple-50 p-4 border-b border-purple-100">
                   <h3 className="font-bold text-purple-900 flex items-center gap-2">
                     <BrainCircuit size={20} /> AI Design Logic
                   </h3>
                   <p className="text-xs text-purple-700 mt-1">Why the system chose this layout:</p>
               </div>
               <div className="p-4 space-y-4 overflow-y-auto flex-1">
                   <div className="text-sm">
                       <h4 className="font-semibold text-slate-800 mb-1 flex items-center gap-2"><Grid size={14}/> Grid Spacing</h4>
                       <p className="text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                           Selected <strong>15ft spans</strong> to optimize for RCC Beam depth (L/12 rule) and avoid deep beams that reduce headroom.
                       </p>
                   </div>
                   <div className="text-sm">
                       <h4 className="font-semibold text-slate-800 mb-1 flex items-center gap-2"><Layers size={14}/> Structural System</h4>
                       <p className="text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                           <strong>Moment Resisting Frame (SMRF)</strong> chosen because location is in Seismic Zone III. Shear walls not required for G+{project.stories}.
                       </p>
                   </div>
                    <div className="text-sm">
                       <h4 className="font-semibold text-slate-800 mb-1 flex items-center gap-2"><Info size={14}/> Foundation</h4>
                       <p className="text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                           <strong>Isolated Footings</strong> assumed due to "Medium Soil" input. If SBC &lt; 100 kN/m², raft would be auto-suggested.
                       </p>
                   </div>
               </div>
            </div>
         )}

         {/* Compliance Sidebar */}
         {showCompliance && !showReasoning && (
            <div className="w-80 bg-white border border-slate-200 rounded-lg shadow-xl p-4 overflow-y-auto animate-in slide-in-from-right-10 duration-300">
               <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                 <ShieldCheck className="text-indigo-600" size={20} /> Regulatory Check
               </h3>
               <div className="space-y-4">
                  {complianceChecks.map(check => (
                    <div key={check.id} className={`p-3 rounded-lg border ${
                        check.status === 'Pass' ? 'bg-emerald-50 border-emerald-100' : 
                        check.status === 'Warning' ? 'bg-amber-50 border-amber-100' : 
                        'bg-red-50 border-red-100'
                    }`}>
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-sm font-semibold text-slate-800">{check.parameter}</span>
                            {check.status === 'Pass' && <ShieldCheck size={16} className="text-emerald-600" />}
                            {check.status === 'Warning' && <AlertTriangle size={16} className="text-amber-600" />}
                            {check.status === 'Fail' && <XCircle size={16} className="text-red-600" />}
                        </div>
                        <div className="flex justify-between text-xs mt-2">
                             <span className="text-slate-500">Allowed: <strong>{check.allowed}</strong></span>
                             <span className={`font-bold ${
                                 check.status === 'Pass' ? 'text-emerald-700' : 
                                 check.status === 'Warning' ? 'text-amber-700' : 'text-red-700'
                             }`}>{check.actual}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-2 italic border-t border-black/5 pt-2">
                            {check.description}
                        </p>
                    </div>
                  ))}
               </div>
               <div className="mt-4 p-3 bg-slate-50 rounded text-[10px] text-slate-500 text-center">
                  Based on local bylaws for Zone III. <br/> Consult a licensed architect for approval.
               </div>
            </div>
         )}
      </div>
    </div>
  );
};

export default LayoutViewer;