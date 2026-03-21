import React, { useRef, useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

export default function KnowledgeGraph({ graphData, onNodeClick, activeNodeId }) {
  const fgRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef();

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight
      });
    }

    const fg = fgRef.current;
    if (fg) {
      fg.d3Force('charge').strength(-200);
    }
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      {dimensions.width > 0 && (
        <ForceGraph2D
          ref={fgRef}
          width={dimensions.width}
          height={dimensions.height}
          graphData={graphData}
          nodeColor={(node) => node.id === activeNodeId ? '#00eab7' : '#a9ffdf'} // highlight active node
          linkColor={() => '#81ecff'}
          backgroundColor="#0e0e0e"
          nodeLabel="name"
          nodeRelSize={6}
          onNodeClick={(node) => {
            if (onNodeClick) onNodeClick(node);
          }}
          // Auto-center on active node if it changes (optional)
        />
      )}
    </div>
  );
}
