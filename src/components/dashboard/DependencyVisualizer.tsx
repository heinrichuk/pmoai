
import React, { useEffect, useRef } from 'react';
import { Dependency, Workstream } from '@/types/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DependencyVisualizerProps {
  dependencies: Dependency[];
  workstreams: Workstream[];
}

const DependencyVisualizer: React.FC<DependencyVisualizerProps> = ({ 
  dependencies,
  workstreams
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Get workstream name by ID
  const getWorkstreamName = (id: string): string => {
    const workstream = workstreams.find(ws => ws.id === id);
    return workstream ? workstream.name : 'Unknown';
  };

  // Get status color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'red': return '#ea384c';
      case 'amber': return '#f59e0b';
      case 'green': return '#10b981';
      default: return '#8a898c';
    }
  };
  
  // This is a placeholder for visualization - in a real implementation,
  // you would use a proper graph visualization library like D3.js or vis.js
  useEffect(() => {
    if (!canvasRef.current || dependencies.length === 0 || workstreams.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Simple circular layout
    const radius = Math.min(canvas.width, canvas.height) * 0.35;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Draw workstreams as nodes
    const nodePositions: Record<string, {x: number, y: number}> = {};
    
    workstreams.forEach((workstream, index) => {
      const angle = (2 * Math.PI * index) / workstreams.length;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      nodePositions[workstream.id] = { x, y };
      
      // Draw node
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, 2 * Math.PI);
      ctx.fillStyle = getStatusColor(workstream.status);
      ctx.fill();
      
      // Draw node label
      ctx.font = '12px Arial';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(workstream.name.substring(0, 10), x, y + 5);
    });
    
    // Draw dependencies as edges
    dependencies.forEach(dependency => {
      const source = nodePositions[dependency.sourceWorkstreamId];
      const target = nodePositions[dependency.targetWorkstreamId];
      
      if (source && target) {
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        
        // Style based on dependency status
        switch(dependency.status) {
          case 'at_risk':
            ctx.strokeStyle = '#ea384c';
            ctx.lineWidth = 2;
            break;
          case 'pending':
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 1.5;
            break;
          case 'met':
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 1;
            break;
          default:
            ctx.strokeStyle = '#8a898c';
            ctx.lineWidth = 1;
        }
        
        ctx.stroke();
        
        // Draw arrow at the end of the line
        const angle = Math.atan2(target.y - source.y, target.x - source.x);
        const arrowLength = 10;
        
        ctx.beginPath();
        ctx.moveTo(target.x, target.y);
        ctx.lineTo(
          target.x - arrowLength * Math.cos(angle - Math.PI / 6),
          target.y - arrowLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
          target.x - arrowLength * Math.cos(angle + Math.PI / 6),
          target.y - arrowLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fillStyle = ctx.strokeStyle;
        ctx.fill();
      }
    });
    
  }, [dependencies, workstreams]);

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>Workstream Dependencies</CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-[400px]">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full"
          style={{ maxHeight: '400px' }}
        />
      </CardContent>
    </Card>
  );
};

export default DependencyVisualizer;
