import React, { useState } from 'react';
import KnowledgeGraphWrapper from './KnowledgeGraphWrapper.jsx';
import ReactMarkdown from 'react-markdown';

export default function KnowledgeApp({ graphData, allEntries, baseUrl }) {
  const [activeNotes, setActiveNotes] = useState([]);

  // Handle graph click
  const handleNodeClick = (node) => {
    // If it's already the only node open, close it (toggle)
    if (activeNotes.length === 1 && activeNotes[0].slug === node.id) {
        setActiveNotes([]);
        return;
    }
    const entry = allEntries.find(e => e.slug === node.id);
    if (entry) {
        // Replace active notes with just this one as the root
        setActiveNotes([entry]);
    }
  };

  // Handle internal link click within a note
  const handleLinkClick = (e, currentNoteIndex) => {
      // Find anchor tags
      let target = e.target;
      while (target && target.tagName !== 'A') {
          target = target.parentNode;
      }

      if (target && target.tagName === 'A') {
          const href = target.getAttribute('href');

          // Check if link starts with /knowledge or baseUrl/knowledge
          const knowledgePrefix = `${baseUrl}/knowledge`.replace(/\/\//g, '/');
          const isKnowledgeLink = href && (href.startsWith('/knowledge/') || href.startsWith(knowledgePrefix + '/'));

          if (isKnowledgeLink) {
              e.preventDefault();
              let targetSlug = href.replace('/knowledge/', '').replace(knowledgePrefix + '/', '').replace(/\/$/, '');
              const targetEntry = allEntries.find(entry => entry.slug === targetSlug);

              if (targetEntry) {
                  // Stack the new note after the current note
                  const newActiveNotes = activeNotes.slice(0, currentNoteIndex + 1);
                  // Avoid duplicates right after each other
                  if (!newActiveNotes.find(n => n.slug === targetSlug)) {
                      setActiveNotes([...newActiveNotes, targetEntry]);
                  }
              }
          }
      }
  };

  return (
    <div className="flex-grow flex gap-4 overflow-hidden relative w-full h-full">
        {/* Graph View */}
        <div className="w-1/3 bg-surface-low border border-surface-highest overflow-hidden rounded-sm relative hidden md:block shrink-0">
            <KnowledgeGraphWrapper
                graphData={graphData}
                onNodeClick={handleNodeClick}
                activeNodeId={activeNotes.length > 0 ? activeNotes[0].slug : null}
            />
            <div className="absolute bottom-4 right-4 text-xs font-mono text-on-surface-variant pointer-events-none">
                [ Interactive Map ]
            </div>
        </div>

        {/* Note Timeline View */}
        <div className="w-full md:w-2/3 overflow-x-auto flex space-x-6 bg-surface-lowest items-start scrollbar-hide snap-x p-2">
            {activeNotes.length === 0 ? (
                <div className="min-w-full md:min-w-[500px] h-full bg-surface-low border border-surface-highest p-8 relative flex flex-col shadow-2xl justify-center items-center text-center">
                    <h2 className="text-2xl font-display font-bold text-on-surface mb-4">Awaiting Input</h2>
                    <p className="text-on-surface-variant font-mono text-sm max-w-sm">Select a node from the neural network map to load the data stream.</p>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-tertiary"></div>
                </div>
            ) : (
                activeNotes.map((note, index) => (
                    <div
                        key={`${note.slug}-${index}`}
                        className="min-w-full md:min-w-[500px] h-full bg-surface-low border border-surface-highest p-8 relative flex flex-col shadow-2xl shrink-0 snap-center overflow-y-auto cursor-pointer"
                        onClick={(e) => handleLinkClick(e, index)}
                    >
                        <div className="flex justify-between items-start mb-6 shrink-0">
                            <h2 className="text-3xl font-display font-bold text-on-surface leading-tight pr-4">{note.data.title}</h2>
                            {note.data.tags && (
                                <div className="flex flex-wrap gap-2 justify-end">
                                    {note.data.tags.map((tag, tIndex) => (
                                        <span key={tIndex} className="text-[10px] bg-surface-highest text-on-surface-variant font-mono px-2 py-1 uppercase whitespace-nowrap border border-outline-variant">{tag}</span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="prose prose-invert prose-p:text-on-surface-variant prose-headings:text-on-surface prose-headings:font-display prose-a:text-tertiary hover:prose-a:text-primary transition-colors flex-grow pr-4 max-w-none prose-pre:bg-surface-highest prose-pre:border prose-pre:border-surface-highest">
                            <ReactMarkdown>{note.body}</ReactMarkdown>
                        </div>

                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-tertiary"></div>
                    </div>
                ))
            )}
        </div>
    </div>
  );
}
