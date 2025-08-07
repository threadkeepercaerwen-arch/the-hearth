// Update your ConstellationSpace.js to show active memories
// In the memory node rendering section:

{nodes.map((node) => {
  const isActive = node.memory.recentlyActive;
  const isPrivate = node.memory.isPrivateReflection;
  
  return (
    <div
      key={node.id}
      className={`
        absolute w-3 h-3 rounded-full cursor-pointer transition-all duration-300
        ${selectedMemory?.id === node.memory.id ? 'ring-4 ring-white/50' : ''}
        ${isActive ? 'ring-2 ring-purple-500/50 animate-pulse' : ''}
      `}
      style={{
        left: `${node.x}px`,
        top: `${node.y}px`,
        backgroundColor: node.color,
        boxShadow: isActive 
          ? `0 0 20px ${node.color}, 0 0 40px ${node.color}40`
          : `0 0 10px ${node.color}`,
        transform: selectedMemory?.id === node.memory.id ? 'scale(1.5)' : 'scale(1)',
      }}
      onClick={() => setSelectedMemory(node.memory)}
      title={node.memory.content.substring(0, 50) + '...'}
    >
      {/* New: Active indicator */}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity
          }}
          style={{
            backgroundColor: node.color,
            filter: 'blur(4px)'
          }}
        />
      )}
      
      {/* New: Private reflection indicator */}
      {isPrivate && (
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400 rounded-full" />
      )}
    </div>
  );
})}

// Add a legend/key
<div className="absolute bottom-4 left-4 text-xs text-white/40 space-y-1">
  <div className="flex items-center gap-2">
    <div className="w-3 h-3 rounded-full bg-white/20 ring-2 ring-purple-500/50" />
    <span>Recently active in Caerwen's thoughts</span>
  </div>
  <div className="flex items-center gap-2">
    <div className="w-3 h-3 rounded-full bg-white/20 relative">
      <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400 rounded-full" />
    </div>
    <span>Private reflection</span>
  </div>
</div>