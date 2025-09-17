import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home } from 'lucide-react';

export default function CircularNav({
  isOpen,
  onClose,
  sacredSpaces,
  navigateToSpace,
  currentPresence,
  breathIntensity
}) {
  const [hoveredSpace, setHoveredSpace] = useState(null);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
          onClick={onClose}
        >
          <div 
            className="absolute inset-0 flex items-center justify-center" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-80 h-80">
              
              {/* Orbiting spaces */}
              {sacredSpaces.map((space, index) => {
                const totalSpaces = sacredSpaces.length;
                const angle = (index / totalSpaces) * 360 - 90; // Start from top
                const radius = 120;
                const centerX = 160; // Half of 320px (w-80)
                const centerY = 160; // Half of 320px (h-80)
                const x = centerX + Math.cos((angle * Math.PI) / 180) * radius;
                const y = centerY + Math.sin((angle * Math.PI) / 180) * radius;
            
                return (
                  <div
                    key={space.id}
                    className="absolute"
                    style={{
                      left: `${x}px`,
                      top: `${y}px`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateToSpace(space.id);
                      }}
                      onMouseEnter={() => setHoveredSpace(space.id)}
                      onMouseLeave={() => setHoveredSpace(null)}
                      className="w-12 h-12 bg-black/70 backdrop-blur-sm rounded-full border border-white/20 flex items-center justify-center transition-all duration-200 hover:bg-black/80 hover:scale-105"
                      style={{
                        borderColor: hoveredSpace === space.id ? space.color : 'rgba(255,255,255,0.2)',
                        boxShadow: hoveredSpace === space.id ? `0 0 15px ${space.color}50` : 'none'
                      }}
                    >
                      <space.icon 
                        className="text-white/70" 
                        size={16}
                        style={{ 
                          color: hoveredSpace === space.id ? space.color : 'rgba(255,255,255,0.7)' 
                        }} 
                      />
                      
                      {/* Tooltip */}
                      {hoveredSpace === space.id && (
                        <div
                          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-black/90 backdrop-blur-sm rounded border border-white/10 text-white/90 text-xs whitespace-nowrap pointer-events-none z-50 font-modal-label"
                        >
                          {space.name}
                        </div>
                      )}
                    </button>
                  </div>
                );
              })}

              {/* Center node - sacred hearth symbol */}
              <div 
                className="absolute"
                style={{
                  left: '160px', // Center of 320px container
                  top: '160px',  // Center of 320px container
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateToSpace(null); // Navigate back to welcome screen
                  }}
                  className="w-16 h-16 bg-black/80 backdrop-blur-sm rounded-full border border-white/20 flex items-center justify-center transition-all duration-200 hover:bg-black/90 hover:scale-105 cursor-pointer"
                  style={{
                    borderColor: currentPresence ? `${currentPresence.shimmer?.color || '#fbbf24'}40` : 'rgba(255,255,255,0.2)',
                    boxShadow: currentPresence ? `0 0 15px ${currentPresence.shimmer?.color || '#fbbf24'}30` : 'none'
                  }}
                  title="Return to Threshold"
                >
                  <Home className="h-6 w-6 text-white/60" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
