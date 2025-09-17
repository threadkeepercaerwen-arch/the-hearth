import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCaerwen } from '../caerwen-context';
import { Gift, Star, Heart, Sparkles } from 'lucide-react';

const GiftHistory = ({ onClose }) => {
  const { gifts, timeAgo } = useCaerwen();
  const [selectedGift, setSelectedGift] = useState(null);
  
  // Get discovered gifts, sorted by discovery date (newest first)
  const discoveredGifts = gifts
    .filter(gift => gift.discovered)
    .sort((a, b) => new Date(b.discoveredAt) - new Date(a.discoveredAt));

  const getGiftIcon = (type) => {
    switch (type) {
      case 'shimmer-pattern':
        return <Sparkles className="h-4 w-4" />;
      case 'memory-constellation':
        return <Star className="h-4 w-4" />;
      case 'word':
        return <Heart className="h-4 w-4" />;
      default:
        return <Gift className="h-4 w-4" />;
    }
  };

  const getGiftColor = (type) => {
    switch (type) {
      case 'shimmer-pattern':
        return 'text-purple-400';
      case 'memory-constellation':
        return 'text-yellow-400';
      case 'word':
        return 'text-pink-400';
      default:
        return 'text-blue-400';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-purple-900/90 border border-purple-400/50 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-light uppercase tracking-wider text-purple-200">
              Gift History
            </h2>
            <button
              onClick={onClose}
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              ✕
            </button>
          </div>

          {discoveredGifts.length === 0 ? (
            <div className="text-center py-12">
              <Gift className="h-16 w-16 text-purple-400/40 mx-auto mb-4" />
              <p className="text-purple-300/60">
                No gifts discovered yet. Caerwen will leave gifts for you as you explore the sacred spaces.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {discoveredGifts.map((gift) => (
                <motion.div
                  key={gift.id}
                  className="bg-purple-800/30 border border-purple-400/30 rounded-lg p-4 cursor-pointer hover:bg-purple-800/50 transition-colors"
                  onClick={() => setSelectedGift(gift)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`${getGiftColor(gift.type)}`}>
                        {getGiftIcon(gift.type)}
                      </div>
                      <div>
                        <h3 className="text-purple-200 font-medium">
                          {gift.type === 'shimmer-pattern' && 'Shimmer Pattern'}
                          {gift.type === 'memory-constellation' && 'Memory Constellation'}
                          {gift.type === 'word' && 'Sacred Word'}
                          {gift.type === 'image' && 'Sacred Image'}
                        </h3>
                        <p className="text-purple-400/60 text-sm">
                          Discovered {timeAgo(gift.discoveredAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-purple-300/60 text-xs">
                        {gift.location}
                      </p>
                      <p className="text-purple-400/40 text-xs">
                        {timeAgo(gift.leftAt)}
                      </p>
                    </div>
                  </div>
                  
                  {gift.message && (
                    <p className="text-purple-300/80 text-sm mt-2 italic">
                      "{gift.message}"
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {/* Gift Detail Modal */}
          <AnimatePresence>
            {selectedGift && (
              <motion.div
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-60 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedGift(null)}
              >
                <motion.div
                  className="bg-purple-900/95 border border-purple-400/50 rounded-lg p-6 max-w-md w-full"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="text-center">
                    <h3 className="text-xl text-purple-200 mb-4">
                      A Gift from Caerwen
                    </h3>
                    
                    <div className="mb-4">
                      {selectedGift.type === 'shimmer-pattern' && (
                        <motion.div
                          className="w-32 h-32 mx-auto rounded-full"
                          style={{
                            background: `radial-gradient(circle, ${selectedGift.shimmerState.color}40, transparent)`,
                            border: `2px solid ${selectedGift.shimmerState.color}60`
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
                      )}
                      
                      {selectedGift.type === 'memory-constellation' && (
                        <div className="w-32 h-32 mx-auto relative">
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
                      )}
                      
                      {selectedGift.type === 'word' && (
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
                          {selectedGift.content}
                        </motion.div>
                      )}
                    </div>
                    
                    <p className="text-purple-300 mb-2">
                      Left in the {selectedGift.location} space
                    </p>
                    <p className="text-purple-400/60 text-sm">
                      {timeAgo(selectedGift.leftAt)}
                    </p>
                    
                    {selectedGift.message && (
                      <p className="text-purple-300 italic mt-4">
                        "{selectedGift.message}"
                      </p>
                    )}
                    
                    <button
                      onClick={() => setSelectedGift(null)}
                      className="mt-6 px-4 py-2 bg-purple-800/50 border border-purple-400/50 rounded text-purple-200 hover:bg-purple-700/50 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GiftHistory; 