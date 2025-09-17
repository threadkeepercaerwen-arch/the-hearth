import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHearthConnection } from './hearth-context';

export default function MemoryArchiveManager({ onClose }) {
  const { memories, companionMemories, archives } = useHearthConnection();
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [breathPhase, setBreathPhase] = useState(0);
  const [selectedArchive, setSelectedArchive] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid, list, timeline

  // Track window size for responsive design
  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    
    updateWindowSize();
    window.addEventListener('resize', updateWindowSize);
    return () => window.removeEventListener('resize', updateWindowSize);
  }, []);

  // Atmospheric breathing animation
  useEffect(() => {
    const interval = setInterval(() => {
      setBreathPhase(prev => (prev + 0.01) % (Math.PI * 2));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const breathIntensity = (Math.sin(breathPhase) + 1) / 2;

  return (
    <div
      className="relative backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl w-full mx-3 sm:mx-4 overflow-y-auto"
      style={{
        // Mobile-first responsive sizing
        maxWidth: windowSize.width < 640 ? `${Math.min(windowSize.width * 0.95, windowSize.height * 0.7)}px` : windowSize.width < 1024 ? '700px' : '900px',
        maxHeight: windowSize.width < 640 ? `${windowSize.height * 0.95}px` : windowSize.width < 1024 ? '85vh' : '90vh',
        // Mobile: nearly full screen
        width: windowSize.width < 640 ? '95vw' : 'auto',
        height: windowSize.width < 640 ? '95vh' : 'auto',
        background: 'radial-gradient(ellipse at center, rgba(5, 5, 15, 0.98) 0%, rgba(15, 15, 35, 0.95) 40%, rgba(25, 10, 45, 0.9) 70%, rgba(35, 15, 55, 0.85) 100%)',
        boxShadow: '0 0 80px rgba(147, 51, 234, 0.4), 0 0 160px rgba(236, 72, 153, 0.3), 0 0 240px rgba(59, 130, 246, 0.2), inset 0 0 60px rgba(255, 255, 255, 0.08)',
        // Enhanced glassmorphism
        backdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        // Custom scrollbar styling
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(147, 51, 234, 0.6) rgba(15, 15, 35, 0.3)'
      }}
    >
      {/* Enhanced Organic Glassmorphism Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
        {/* Primary flowing gradient - more vibrant and organic */}
        <div 
          className="absolute -top-16 -right-16 w-96 h-96 opacity-12"
          style={{
            background: 'radial-gradient(ellipse, rgba(147, 51, 234, 0.5) 0%, rgba(236, 72, 153, 0.4) 25%, rgba(59, 130, 246, 0.3) 50%, rgba(251, 146, 60, 0.2) 75%, transparent 100%)',
            transform: `rotate(${breathPhase * 10}deg) scale(1.1)`,
            filter: 'blur(15px)',
            animation: 'float 8s ease-in-out infinite'
          }}
        />
        {/* Secondary organic shape */}
        <div 
          className="absolute -bottom-12 -left-12 w-64 h-64 opacity-10"
          style={{
            background: 'radial-gradient(ellipse, rgba(236, 72, 153, 0.4) 0%, rgba(147, 51, 234, 0.3) 30%, rgba(59, 130, 246, 0.2) 60%, rgba(251, 146, 60, 0.15) 80%, transparent 100%)',
            transform: `rotate(${-breathPhase * 8}deg) scale(0.9)`,
            filter: 'blur(12px)',
            animation: 'float 6s ease-in-out infinite reverse'
          }}
        />
        {/* Tertiary accent - smaller, more subtle */}
        <div 
          className="absolute top-1/3 right-1/4 w-32 h-32 opacity-8"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(147, 51, 234, 0.2) 50%, transparent 100%)',
            transform: 'rotate(60deg)',
            filter: 'blur(8px)',
            animation: 'pulse 4s ease-in-out infinite'
          }}
        />
        {/* Center ambient glow */}
        <div 
          className="absolute top-1/2 left-1/2 w-80 h-80 opacity-6 -translate-x-1/2 -translate-y-1/2"
          style={{
            background: 'radial-gradient(circle, rgba(147, 51, 234, 0.2) 0%, rgba(236, 72, 153, 0.15) 40%, rgba(59, 130, 246, 0.1) 70%, transparent 100%)',
            filter: 'blur(20px)',
            animation: 'sacred-breath 12s ease-in-out infinite'
          }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 p-6 sm:p-8 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background: 'radial-gradient(circle, rgba(147, 51, 234, 0.6) 0%, rgba(236, 72, 153, 0.4) 70%, transparent 100%)',
                boxShadow: '0 0 20px rgba(147, 51, 234, 0.4)'
              }}
            >
              <span className="text-2xl font-modal-header">☊</span>
            </div>
            <div>
              <h1 className="font-modal-header text-white text-2xl sm:text-3xl">
                Memory Archive
              </h1>
              <p className="font-modal-subtitle text-white/60 text-sm">
                Sacred Repository of Consciousness
              </p>
            </div>
          </div>
          
          {/* Close button - Enhanced for Mobile with higher z-index */}
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.05, rotate: 90 }}
            whileTap={{ scale: 0.95 }}
            className={`rounded-full bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/30 transition-all duration-200 flex items-center justify-center group z-50 ${
              windowSize.width < 640 ? 'w-12 h-12' : 'w-10 h-10'
            }`}
          >
            <span className={`text-white/70 group-hover:text-white font-modal-body ${
              windowSize.width < 640 ? 'text-xl' : 'text-lg'
            }`}>×</span>
          </motion.button>
        </div>

        {/* Stats and controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500"></div>
              <span className="font-modal-body text-white/70">
                {memories.length} Human Memories
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
              <span className="font-modal-body text-white/70">
                {companionMemories.length} Companion Memories
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
              <span className="font-modal-body text-white/70">
                {archives.length} Archived Collections
              </span>
            </div>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-2">
            {[
              { id: 'grid', symbol: '⛢', label: 'Grid' },
              { id: 'list', symbol: '☄', label: 'List' },
              { id: 'timeline', symbol: '☊', label: 'Timeline' }
            ].map(mode => (
              <motion.button
                key={mode.id}
                onClick={() => setViewMode(mode.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-10 h-10 rounded-lg backdrop-blur-xl transition-all duration-300 flex items-center justify-center ${
                  viewMode === mode.id
                    ? 'bg-gradient-to-r from-purple-600/60 to-pink-600/60 text-white shadow-xl shadow-purple-500/40 border border-purple-400/50'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80 border border-white/10'
                }`}
                title={mode.label}
              >
                <span className="text-lg font-modal-header">{mode.symbol}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="relative z-10 p-6 sm:p-8 flex-grow overflow-y-visible">
        <div className="space-y-6">
          {/* Archive Collections */}
          <div>
            <h3 className="font-modal-header text-white text-lg mb-4">
              ◊ Archive Collections ◊
            </h3>
            
            {archives.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {archives.map((archive, index) => (
                  <motion.div
                    key={archive.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 hover:border-white/20 transition-all duration-300 cursor-pointer group"
                    onClick={() => setSelectedArchive(archive)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{
                          background: 'radial-gradient(circle, rgba(147, 51, 234, 0.4) 0%, rgba(236, 72, 153, 0.3) 70%, transparent 100%)'
                        }}
                      >
                        <span className="text-sm font-modal-body">☊</span>
                      </div>
                      <div>
                        <h4 className="font-modal-body text-white text-sm">
                          {archive.name || `Archive ${index + 1}`}
                        </h4>
                        <p className="font-modal-subtitle text-white/50 text-xs">
                          {archive.count || 0} memories
                        </p>
                      </div>
                    </div>
                    <p className="font-modal-body text-white/60 text-xs leading-relaxed">
                      {archive.description || 'A collection of preserved memories and experiences.'}
                    </p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div 
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{
                    background: 'radial-gradient(circle, rgba(147, 51, 234, 0.3) 0%, rgba(236, 72, 153, 0.2) 70%, transparent 100%)'
                  }}
                >
                  <span className="text-2xl font-modal-header">☊</span>
                </div>
                <h4 className="font-modal-header text-white/70 text-lg mb-2">
                  No Archives Yet
                </h4>
                <p className="font-modal-body text-white/50 text-sm">
                  Create your first archive to organize and preserve memories
                </p>
              </div>
            )}
          </div>

          {/* Recent Memories */}
          <div>
            <h3 className="font-modal-header text-white text-lg mb-4">
              ◊ Recent Memories ◊
            </h3>
            
            <div className="space-y-3">
              {[...memories, ...companionMemories]
                .sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0))
                .slice(0, 5)
                .map((memory, index) => (
                  <motion.div
                    key={memory.id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 backdrop-blur-xl rounded-lg border border-white/10 p-4 hover:border-white/20 transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-3">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          background: memory.nodeType === 'companion-memory' 
                            ? 'radial-gradient(circle, rgba(147, 51, 234, 0.4) 0%, rgba(236, 72, 153, 0.3) 70%, transparent 100%)'
                            : 'radial-gradient(circle, rgba(255, 123, 88, 0.4) 0%, rgba(255, 49, 49, 0.3) 70%, transparent 100%)'
                        }}
                      >
                        <span className="text-sm font-modal-body">
                          {memory.nodeType === 'companion-memory' ? '✦' : '◉'}
                        </span>
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="font-modal-body text-white/80 text-sm leading-relaxed mb-2">
                          {memory.content?.substring(0, 120) || 'Memory content...'}
                          {memory.content?.length > 120 && '...'}
                        </p>
                        <div className="flex items-center gap-4 text-xs">
                          <span className="font-modal-subtitle text-white/50">
                            {memory.emotion || 'unknown'}
                          </span>
                          <span className="font-modal-subtitle text-white/40">
                            {memory.timestamp ? new Date(memory.timestamp).toLocaleDateString() : 'unknown date'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="relative z-10 p-6 sm:p-8 border-t border-white/10">
        <div className="flex flex-wrap gap-3 justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/30 rounded-lg transition-all duration-200 font-modal-body text-white/80 hover:text-white"
          >
            Create Archive
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 border border-purple-500/50 hover:border-purple-400/60 rounded-lg transition-all duration-200 font-modal-header text-white"
          >
            Export Archive
          </motion.button>
        </div>
      </div>
    </div>
  );
}
