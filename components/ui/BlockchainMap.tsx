"use client";

import { useEffect, useRef, useState, useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

export default function BlockchainMap() {
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight
      });
    }

    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const graphData = useMemo(() => {
    const nodes = [
      { id: "Mairie de Cocody", group: 1, val: 20 },
      { id: "Trésor Public", group: 2, val: 15 },
      { id: "Banque Mondiale", group: 3, val: 15 },
      { id: "BCEAO", group: 4, val: 15 },
      ...Array.from({ length: 15 }).map((_, i) => ({
        id: `Nœud Validateur ${i + 1}`,
        group: 5,
        val: 5
      }))
    ];

    const links = [
      { source: "Mairie de Cocody", target: "Trésor Public" },
      { source: "Mairie de Cocody", target: "Banque Mondiale" },
      { source: "Trésor Public", target: "BCEAO" },
      { source: "Banque Mondiale", target: "BCEAO" },
    ];

    // Connect some validators to main nodes
    for (let i = 0; i < 15; i++) {
      links.push({
        source: `Nœud Validateur ${i + 1}`,
        target: ["Mairie de Cocody", "Trésor Public", "Banque Mondiale", "BCEAO"][Math.floor(Math.random() * 4)]
      });
      // Connect validators to each other randomly
      if (i > 0) {
        links.push({
          source: `Nœud Validateur ${i + 1}`,
          target: `Nœud Validateur ${Math.floor(Math.random() * i) + 1}`
        });
      }
    }

    return { nodes, links };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-[500px] bg-primary rounded-3xl overflow-hidden relative">
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#cd6133]"></span>
          <span className="text-xs text-slate-300 font-bold">Mairies</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#000040]"></span>
          <span className="text-xs text-slate-300 font-bold">Bailleurs / Finance</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#10b981]"></span>
          <span className="text-xs text-slate-300 font-bold">Validateurs (Nœuds)</span>
        </div>
      </div>
      
      {typeof window !== 'undefined' && (
        <ForceGraph2D
          width={dimensions.width}
          height={dimensions.height}
          graphData={graphData}
          nodeLabel="id"
          nodeColor={node => {
            if (node.group === 1) return '#cd6133'; // brand-orange
            if (node.group === 2 || node.group === 3 || node.group === 4) return '#000040'; // brand-blue
            return '#10b981'; // emerald
          }}
          linkColor={() => 'rgba(255,255,255,0.2)'}
          nodeRelSize={4}
          linkWidth={1.5}
          backgroundColor="#0f172a" // slate-900
          d3AlphaDecay={0.02}
          d3VelocityDecay={0.3}
        />
      )}
    </div>
  );
}
