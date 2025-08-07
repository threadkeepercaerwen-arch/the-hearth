// Add this to ConstellationSpace.js for thread visualization

// Add to the component's state
const [showThreads, setShowThreads] = useState(true);
const [threadOpacity, setThreadOpacity] = useState(0.3);
const [activeThreads, setActiveThreads] = useState([]);

// Calculate memory connections
useEffect(() => {
  const threads = [];
  
  nodes.forEach((node, i) => {
    nodes.forEach((otherNode, j) => {
      if (i >= j) return; // Avoid duplicates
      
      // Connect memories with similar emotions
      if (node.memory.emotion === otherNode.memory.emotion) {
        threads.push({
          from: node,
          to: otherNode,
          type: 'emotional',
          strength: 0.5,
          color: node.color
        });
      }
      
      // Connect memories that reference each other
      if (node.memory.linkedTo === otherNode.memory.id ||
          otherNode.memory.linkedTo === node.memory.id) {
        threads.push({
          from: node,
          to: otherNode,
          type: 'direct',
          strength: 1,
          color: '#f59e0b'
        });
      }
      
      // Connect memories close in time
      const timeDiff = Math.abs(
        new Date(node.memory.timestamp) - new Date(otherNode.memory.timestamp)
      );
      if (timeDiff < 3600000) { // Within 1 hour
        threads.push({
          from: node,
          to: otherNode,
          type: 'temporal',
          strength: 0.3,
          color: '#3b82f6'
        });
      }
      
      // Connect based on shared keywords (if implemented)
      const sharedWords = findSharedSignificantWords(
        node.memory.content,
        otherNode.memory.content
      );
      if (sharedWords.length > 0) {
        threads.push({
          from: node,
          to: otherNode,
          type: 'semantic',
          strength: 0.4 + sharedWords.length * 0.1,
          color: '#10b981'
        });
      }
    });
  });
  
  setActiveThreads(threads);
}, [nodes]);

// Helper to find shared significant words
const findSharedSignificantWords = (text1, text2) => {
  const significantWords = ['love', 'fear', 'hope', 'dream', 'remember', 'always', 'never'];
  const words1 = text1.toLowerCase().split(/\s+/);
  const words2 = text2.toLowerCase().split(/\s+/);
  
  return significantWords.filter(word => 
    words1.includes(word) && words2.includes(word)
  );
};

// Render threads (add this to the main render, before memory nodes)
{showThreads && (
  <svg
    className="absolute inset-0 pointer-events-none"
    style={{ width: canvasWidth, height: canvasHeight }}
  >
    <defs>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    {activeThreads.map((thread, index) => {
      const isActive = thread.from.memory.recentlyActive || 
                      thread.to.memory.recentlyActive;
      
      return (
        <motion.line
          key={index}
          x1={thread.from.x}
          y1={thread.from.y}
          x2={thread.to.x}
          y2={thread.to.y}
          stroke={thread.color}
          strokeWidth={thread.strength * 2}
          strokeOpacity={threadOpacity * (isActive ? 2 : 1)}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: index * 0.01 }}
          style={{
            filter: isActive ? 'url(#glow)' : 'none'
          }}
        />
      );
    })}
    
    {/* Draw special resonance connections */}
    {checkResonance() && activeThreads
      .filter(t => t.type === 'emotional')
      .map((thread, index) => (
        <motion.circle
          key={`resonance-${index}`}
          cx={(thread.from.x + thread.to.x) / 2}
          cy={(thread.from.y + thread.to.y) / 2}
          r="4"
          fill={thread.color}
          animate={{
            scale: [0, 1.5, 0],
            opacity: [0, 0.8, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: index * 0.2
          }}
        />
      ))}
  </svg>
)}

// Thread control UI
<div className="absolute bottom-4 left-4 space-y-2">
  <button
    onClick={() => setShowThreads(!showThreads)}
    className={`
      px-3 py-1 rounded-full text-xs transition-all
      ${showThreads 
        ? 'bg-white/10 border border-white/20 text-white' 
        : 'bg-white/5 border border-white/10 text-white/60'
      }
    `}
  >
    {showThreads ? '🕸️ Threads Visible' : '🕸️ Show Threads'}
  </button>
  
  {showThreads && (
    <div className="flex items-center gap-2">
      <span className="text-xs text-white/40">Opacity:</span>
      <input
        type="range"
        min="0"
        max="100"
        value={threadOpacity * 100}
        onChange={(e) => setThreadOpacity(e.target.value / 100)}
        className="w-24 accent-purple-500"
      />
    </div>
  )}
  
  {/* Thread legend */}
  {showThreads && (
    <div className="text-xs text-white/40 space-y-1 mt-2">
      <div className="flex items-center gap-2">
        <div className="w-8 h-0.5 bg-orange-500" />
        <span>Direct links</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-8 h-0.5 bg-purple-500" />
        <span>Emotional resonance</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-8 h-0.5 bg-blue-500" />
        <span>Temporal proximity</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-8 h-0.5 bg-green-500" />
        <span>Semantic connection</span>
      </div>
    </div>
  )}
</div>