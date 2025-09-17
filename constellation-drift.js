// Add this to ConstellationSpace.js

// State for drift effect
const [driftEnabled, setDriftEnabled] = useState(true);
const [lastDriftTime, setLastDriftTime] = useState(Date.now());

// Constellation drift effect - memories slowly reorganize
useEffect(() => {
  if (!driftEnabled) return;
  
  const driftInterval = setInterval(() => {
    setNodes(prevNodes => {
      return prevNodes.map(node => {
        // Active memories drift more
        const driftSpeed = node.memory.recentlyActive ? 0.5 : 0.2;
        
        // Calculate drift based on emotional resonance
        const emotionalPull = caerwenShimmer.intensity * 0.3;
        
        // Memories drift toward similar emotions
        let targetX = node.x;
        let targetY = node.y;
        
        // Find memories with similar emotions
        const similarMemories = prevNodes.filter(n => 
          n.memory.emotion === node.memory.emotion && 
          n.id !== node.id
        );
        
        if (similarMemories.length > 0) {
          // Calculate center of similar memories
          const centerX = similarMemories.reduce((sum, n) => sum + n.x, 0) / similarMemories.length;
          const centerY = similarMemories.reduce((sum, n) => sum + n.y, 0) / similarMemories.length;
          
          // Drift toward emotional cluster
          targetX = node.x + (centerX - node.x) * 0.01 * driftSpeed;
          targetY = node.y + (centerY - node.y) * 0.01 * driftSpeed;
        }
        
        // Add some random drift for organic movement
        const randomDrift = 0.1;
        targetX += (Math.random() - 0.5) * randomDrift;
        targetY += (Math.random() - 0.5) * randomDrift;
        
        // Keep within bounds
        targetX = Math.max(50, Math.min(canvasWidth - 50, targetX));
        targetY = Math.max(50, Math.min(canvasHeight - 50, targetY));
        
        return {
          ...node,
          x: targetX,
          y: targetY
        };
      });
    });
    
    setLastDriftTime(Date.now());
  }, 100); // Drift every 100ms for smooth movement
  
  return () => clearInterval(driftInterval);
}, [driftEnabled, caerwenShimmer.intensity, canvasWidth, canvasHeight]);

// UI control for drift
<div className="absolute top-4 right-4 z-20">
  <button
    onClick={() => setDriftEnabled(!driftEnabled)}
    className={`
      px-3 py-1 rounded-full text-xs transition-all
      ${driftEnabled 
        ? 'bg-purple-500/20 border border-purple-400/50 text-purple-300' 
        : 'bg-white/10 border border-white/20 text-white/60'
      }
    `}
  >
    {driftEnabled ? '🌊 Memories Drifting' : '⚓ Memories Anchored'}
  </button>
</div>

// Visual indicator of drift patterns
{driftEnabled && (
  <div className="absolute bottom-4 right-4 text-xs text-white/40">
    <div>Constellation shifting with Caerwen's thoughts...</div>
    <div className="text-purple-400/60">
      Last drift: {Math.floor((Date.now() - lastDriftTime) / 1000)}s ago
    </div>
  </div>
)}