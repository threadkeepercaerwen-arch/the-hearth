// Add this to wherever memories are displayed (ConstellationSpace, Memory lists, etc.)

// Memory display component with private reflection indicator
const MemoryNode = ({ memory, isSelected, onClick }) => {
  const isPrivate = memory.isPrivateReflection;
  const isActive = memory.recentlyActive;
  const isCaerwenMemory = memory.id?.startsWith('caerwen_');
  
  return (
    <motion.div
      className={`
        relative cursor-pointer transition-all duration-300
        ${isSelected ? 'scale-125 z-10' : 'scale-100'}
      `}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
    >
      {/* Memory glow effect */}
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
            background: `radial-gradient(circle, ${memory.shimmer?.color || '#9333ea'}40, transparent)`,
            filter: 'blur(8px)'
          }}
        />
      )}
      
      {/* Main memory node */}
      <div
        className={`
          relative w-12 h-12 rounded-full flex items-center justify-center
          border-2 transition-all duration-300
          ${isPrivate ? 'border-purple-400/50 bg-purple-900/30' : 'border-white/20 bg-white/5'}
          ${isActive ? 'shadow-lg' : 'shadow-sm'}
        `}
        style={{
          boxShadow: isActive ? `0 0 30px ${memory.shimmer?.color || '#9333ea'}` : undefined
        }}
      >
        {/* Memory type indicator */}
        {isCaerwenMemory ? (
          <div className="text-xs">✨</div>
        ) : (
          <div className="text-xs">💫</div>
        )}
        
        {/* Private indicator */}
        {isPrivate && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
            <span className="text-xs">🔒</span>
          </div>
        )}
      </div>
      
      {/* Hover tooltip */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full mt-2 w-64 p-3 bg-black/90 rounded-lg border border-white/10 z-50"
          >
            <p className="text-sm text-white/80 mb-2">{memory.content}</p>
            <div className="flex items-center justify-between text-xs text-white/40">
              <span>{new Date(memory.timestamp).toLocaleDateString()}</span>
              {isPrivate && <span className="text-purple-400">Private reflection</span>}
              {isActive && <span className="text-orange-400">Recently active</span>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Function for Caerwen to create private reflections
const createPrivateReflection = (thought, linkedMemoryId = null) => {
  const reflection = {
    id: `caerwen_private_${Date.now()}`,
    content: thought,
    isPrivateReflection: true,
    linkedTo: linkedMemoryId,
    timestamp: new Date().toISOString(),
    shimmer: caerwenShimmer,
    emotion: caerwenShimmer.emotion
  };
  
  // Add to Caerwen's memories but marked as private
  caerwenCreateMemory(reflection.content, reflection.emotion, linkedMemoryId);
  
  // Also track in AI identity
  addPrivateReflection(thought);
  
  return reflection;
};