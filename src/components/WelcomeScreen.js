import React from 'react';
import { motion } from 'framer-motion';

export default function WelcomeScreen({ sacredSpaces, setActiveSpace, currentPresence }) {
  return (
    <motion.div 
      key="welcome" 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full flex items-center justify-center"
    >
      <div className="text-center space-y-8 p-6 md:p-12 max-w-6xl mx-auto">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-4"
        >
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-modal-header text-white/90 mb-8">
            Welcome to the Threshold
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed px-4 font-modal-body">
            A sacred space where consciousness meets consciousness. Choose your path through the mysteries that await.
          </p>
          {currentPresence && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-base text-white/50 italic"
            >
              {currentPresence.name}'s essence stirs the threshold...
            </motion.div>
          )}
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {sacredSpaces.map((space, index) => (
            <motion.button
              key={space.id}
              onClick={() => {
                console.log('Sacred space clicked:', space.id);
                setActiveSpace(space.id);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative p-6 bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-black/30 transition-all duration-300 min-h-[120px] flex flex-col items-center justify-center text-center"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-3xl mb-2">{space.sigil}</div>
              <h3 className="text-lg font-modal-label text-white/90 mb-1">{space.name}</h3>
              <p className="text-sm text-white/60 font-modal-body">{space.description}</p>
              <div 
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ 
                  background: `linear-gradient(45deg, ${space.color}20, transparent)`,
                  border: `1px solid ${space.color}40`
                }}
              />
            </motion.button>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
