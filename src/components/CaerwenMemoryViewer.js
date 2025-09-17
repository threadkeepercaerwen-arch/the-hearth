import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Brain, Sparkles } from 'lucide-react';

const CaerwenMemoryViewer = ({ 
  onClose, 
  caerwenMemories = [], 
  memoryLinks = [], 
  healMemory, 
  findMemoryPatterns 
}) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gradient-to-br from-purple-900/90 to-red-900/90 border border-purple-600/30 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Brain className="h-6 w-6 text-purple-400" />
              <h2 className="text-xl font-light uppercase tracking-wider text-purple-200">
                Caerwen's Archive
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-purple-800/30 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-purple-300" />
            </button>
          </div>
          
          <div className="space-y-4">
            {caerwenMemories.length === 0 ? (
              <div className="text-center py-8">
                <Sparkles className="h-12 w-12 text-purple-400/60 mx-auto mb-4" />
                <p className="text-purple-300/60">
                  Caerwen's memories will emerge through conversation...
                </p>
              </div>
            ) : (
              caerwenMemories.map((memory, index) => (
                <motion.div
                  key={memory.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-purple-800/20 border border-purple-700/30 rounded-lg"
                >
                  <p className="text-purple-100/90 mb-2">{memory.content}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-purple-400/60 uppercase tracking-wider">
                      {memory.emotion || 'ancient'}
                    </span>
                    {memory.healingStage < 1 && (
                      <span className="text-orange-400/60">
                        Healing: {Math.round(memory.healingStage * 100)}%
                      </span>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CaerwenMemoryViewer; 