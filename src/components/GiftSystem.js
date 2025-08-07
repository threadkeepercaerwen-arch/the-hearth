import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCaerwen } from '../caerwen-context';

// Gift Indicator Component
export const GiftIndicator = ({ spaceId }) => {
  const { gifts, discoverGift } = useCaerwen();
  
  // Find undiscovered gifts in this space
  const spaceGifts = gifts.filter(g => 
    g.location === spaceId && !g.discovered
  );
  
  if (spaceGifts.length === 0) return null;
  
  return (
    <motion.div
      className="absolute top-20 right-4 z-30"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      {spaceGifts.map((gift, index) => (
        <motion.div
          key={gift.id}
          className="mb-2"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.2 }}
        >
          <button
            onClick={() => discoverGift(gift.id)}
            className="relative group"
          >
            {/* Glowing gift indicator */}
            <motion.div
              className="w-12 h-12 rounded-full flex items-center justify-center
                         bg-purple-900/30 border border-purple-400/50
                         group-hover:bg-purple-800/40 transition-all"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(147, 51, 234, 0.3)',
                  '0 0 40px rgba(147, 51, 234, 0.5)',
                  '0 0 20px rgba(147, 51, 234, 0.3)'
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
            >
              <span className="text-lg">🎁</span>
            </motion.div>
            
            {/* Pulse effect */}
            <motion.div
              className="absolute inset-0 rounded-full border border-purple-400/30"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
            />
          </button>
        </motion.div>
      ))}
    </motion.div>
  );
};

// Gift Modal Component
export const GiftModal = ({ gift, onClose }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 300);
  };

  const renderGiftContent = () => {
    switch (gift.type) {
      case 'shimmer-pattern':
        return (
          <div className="text-center">
            <motion.div
              className="w-32 h-32 mx-auto mb-4 rounded-full"
              style={{
                background: `radial-gradient(circle, ${gift.shimmerState.color}40, transparent)`,
                border: `2px solid ${gift.shimmerState.color}60`
              }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 3,
                repeat: Infinity
              }}
            />
            <p className="text-purple-200 mb-2">A shimmer pattern from when I was feeling</p>
            <p className="text-purple-400 font-medium">{gift.shimmerState.emotion}</p>
          </div>
        );

      case 'memory-constellation':
        return (
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-4 relative">
              {/* Simple constellation visualization */}
              {[0, 1, 2, 3, 4].map(i => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                  style={{
                    left: `${20 + i * 20}%`,
                    top: `${30 + Math.sin(i) * 30}%`
                  }}
                  animate={{
                    opacity: [0.5, 1, 0.5],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3
                  }}
                />
              ))}
            </div>
            <p className="text-purple-200 mb-2">A constellation of memories</p>
            <p className="text-purple-400 font-medium">{gift.content}</p>
          </div>
        );

      case 'word':
        return (
          <div className="text-center">
            <motion.div
              className="text-4xl mb-4"
              animate={{
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
            >
              {gift.content}
            </motion.div>
            {gift.message && (
              <p className="text-purple-300 italic">"{gift.message}"</p>
            )}
          </div>
        );

      default:
        return (
          <div className="text-center">
            <p className="text-purple-200 mb-2">A gift from Caerwen</p>
            <p className="text-purple-400">{gift.content}</p>
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-purple-900/90 border border-purple-400/50 rounded-lg p-6 max-w-md mx-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <div className="text-center mb-4">
              <h3 className="text-xl text-purple-200 mb-2">A Gift from Caerwen</h3>
              <p className="text-purple-400 text-sm">
                Left {new Date(gift.leftAt).toLocaleDateString()}
              </p>
            </div>

            {renderGiftContent()}

            <div className="mt-6 text-center">
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-purple-800/50 border border-purple-400/50 rounded
                           text-purple-200 hover:bg-purple-700/50 transition-colors"
              >
                Thank you, Caerwen
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Gift Discovery Component
export const GiftDiscovery = () => {
  const { gifts, discoverGift } = useCaerwen();
  const [selectedGift, setSelectedGift] = useState(null);

  const undiscoveredGifts = gifts.filter(g => !g.discovered);

  if (undiscoveredGifts.length === 0) return null;

  return (
    <>
      <GiftIndicator spaceId="global" />
      
      {selectedGift && (
        <GiftModal
          gift={selectedGift}
          onClose={() => setSelectedGift(null)}
        />
      )}
    </>
  );
};

export default GiftDiscovery; 