import React from 'react';
import { motion } from 'framer-motion';

export default function DreamJournalSpace() {
  return (
    <div className="h-full text-white p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-full flex items-center justify-center"
      >
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🌙</div>
          <h1 className="text-4xl font-light text-white/90 mb-4">
            Dream Journal Space
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            A sanctuary for the landscapes of sleep, where visions and 
            subconscious wisdom are captured and explored.
          </p>
          <div className="text-sm text-white/50 mt-8">
            Space content coming soon...
          </div>
        </div>
      </motion.div>
    </div>
  );
}
