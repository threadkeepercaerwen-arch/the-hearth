import React from 'react';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

export default function TopBar({
  currentSpace,
  memoriesOrbiting,
  threadsWoven,
  currentPresence,
  onToggleNav
}) {
  return (
    <div className="flex items-center justify-between p-4 md:p-6">
      <div className="flex items-center space-x-4">
        <motion.button
          onClick={onToggleNav}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 bg-black/20 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-black/30 transition-colors"
        >
          <Home className="h-5 w-5 text-white/60" />
        </motion.button>
        
        <div className="text-white/60 text-sm font-modal-body">
          <span className="font-modal-label">{currentSpace.name}</span>
          <span className="mx-2">•</span>
          <span>{memoriesOrbiting} memories orbiting</span>
          <span className="mx-2">•</span>
          <span>{threadsWoven} threads woven</span>
          {currentPresence && (
            <>
              <span className="mx-2">•</span>
              <span className="text-white/40 italic">{currentPresence.name} present</span>
            </>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        {/* EmotionalWeather removed for cleaner constellation view */}
      </div>
    </div>
  );
}
