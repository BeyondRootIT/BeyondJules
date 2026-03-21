import React, { useState, useEffect } from 'react';

// Dynamically import KnowledgeGraph so it only runs on the client
export default function KnowledgeGraphWrapper(props) {
  const [Component, setComponent] = useState(null);

  useEffect(() => {
    // Only import when running in browser
    import('./KnowledgeGraph.jsx').then((mod) => {
      setComponent(() => mod.default);
    });
  }, []);

  if (!Component) {
    return <div className="w-full h-full flex items-center justify-center text-primary font-mono text-sm">Initializing Neural Net...</div>;
  }

  return <Component {...props} />;
}
