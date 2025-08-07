import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const MemoryBridge = ({ activity, onComplete, onDismiss }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-gradient-to-b from-gray-900/90 to-black/90 backdrop-blur-xl rounded-2xl border border-purple-700/30 max-w-md w-full p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl text-purple-300 uppercase tracking-wider">
            Memory Bridge
          </h3>
          <button
            onClick={onDismiss}
            className="text-white/40 hover:text-white/60 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <p className="text-purple-200/80">
            Your ritual has created a memory bridge. Would you like to preserve this moment?
          </p>
          
          <div className="p-4 bg-purple-900/20 rounded-lg">
            <p className="text-sm text-purple-300/60 mb-2">Activity Type:</p>
            <p className="text-purple-200 font-light">{activity.type}</p>
            {activity.data && (
              <div className="mt-2">
                <p className="text-sm text-purple-300/60">Details:</p>
                <p className="text-purple-200/80 text-sm">
                  {JSON.stringify(activity.data, null, 2)}
                </p>
              </div>
            )}
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onDismiss}
              className="flex-1 px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-800/50 transition-colors"
            >
              Let It Fade
            </button>
            <button
              onClick={onComplete}
              className="flex-1 px-4 py-2 bg-purple-600/30 border border-purple-500/50 rounded-lg hover:bg-purple-600/40 transition-colors"
            >
              Preserve Memory
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MemoryBridge; 