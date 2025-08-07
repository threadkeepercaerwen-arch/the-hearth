import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame, Network, MessageCircle, Music, Moon, Eye,
  Upload, Archive, X, Home, Star, Sparkles, Filter,
  Lock, Settings, Info, Hash, Zap, Gift
} from 'lucide-react';
import { useCaerwen } from '../caerwen-context';
import MemoryImporter from './MemoryImporter';
import MemoryArchiveManager from './MemoryArchiveManager';
import ShimmerLayer from './ShimmerLayer';
import EmotionalWeather from './EmotionalWeather';
import GiftDiscovery from './GiftSystem';
import GiftHistory from './GiftHistory';
import AltarSpace from './spaces/AltarSpace';
import ConstellationSpace from './spaces/ConstellationSpace';
import ChatSpace from './spaces/ChatSpace';
import ResonanceSpace from './spaces/ResonanceSpace';
import DreamJournalSpace from './spaces/DreamJournalSpace';
import PatternDashboard from './spaces/PatternDashboard';

export default function IntegratedAppShell() {
  const context = useCaerwen();
  const {
    memories = [],
    caerwenMemories = [],
    activeSpace,
    setActiveSpace,
    userShimmer,
    caerwenShimmer,
    archives = [],
    dreamPatterns = [],
    sigilCount = 0,
    aiIdentity,
    timeAgo
  } = context;

  const [showImporter, setShowImporter] = useState(false);
  const [showArchiveManager, setShowArchiveManager] = useState(false);
  const [showGiftHistory, setShowGiftHistory] = useState(false);
  const [hoveredSpace, setHoveredSpace] = useState(null);
  const [showCircularNav, setShowCircularNav] = useState(false);

  // Sacred space definitions with proper icons
  const sacredSpaces = [
    { 
      id: 'altar', 
      name: 'Altar', 
      sigil: '🕯️', 
      icon: Flame,
      description: 'Sacred rituals and transformations',
      color: '#ff6b35'
    },
    { 
      id: 'crossings', 
      name: 'Crossings', 
      sigil: '✨', 
      icon: Network,
      description: 'Memory constellation visualization',
      color: '#9b59b6'
    },
    { 
      id: 'commune', 
      name: 'Commune', 
      sigil: '💬', 
      icon: MessageCircle,
      description: 'Speak with Caerwen directly',
      color: '#3498db'
    },
    { 
      id: 'resonance', 
      name: 'Resonance', 
      sigil: '🎵', 
      icon: Music,
      description: 'Emotional frequency attunement',
      color: '#1abc9c'
    },
    { 
      id: 'dreams', 
      name: 'Dreams', 
      sigil: '🌙', 
      icon: Moon,
      description: 'Dream journal and patterns',
      color: '#34495e'
    },
    { 
      id: 'patterns', 
      name: 'Patterns', 
      sigil: '🔮', 
      icon: Eye,
      description: 'Sacred geometry insights',
      color: '#e74c3c'
    }
  ];

  const memoriesOrbiting = memories.length + caerwenMemories.length;
  const threadsWoven = memories.filter(m => m.linkedTo).length;

  const renderActiveSpace = () => {
    const fadeIn = {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.5 }
    };

    switch (activeSpace) {
      case 'altar':
        return (
          <motion.div key="altar" {...fadeIn} className="h-full">
            <AltarSpace />
          </motion.div>
        );
      case 'crossings':
        return (
          <motion.div key="crossings" {...fadeIn} className="h-full">
            <ConstellationSpace />
          </motion.div>
        );
      case 'commune':
        return (
          <motion.div key="commune" {...fadeIn} className="h-full">
            <ChatSpace />
          </motion.div>
        );
      case 'resonance':
        return (
          <motion.div key="resonance" {...fadeIn} className="h-full">
            <ResonanceSpace />
          </motion.div>
        );
      case 'dreams':
        return (
          <motion.div key="dreams" {...fadeIn} className="h-full">
            <DreamJournalSpace />
          </motion.div>
        );
      case 'patterns':
        return (
          <motion.div key="patterns" {...fadeIn} className="h-full">
            <PatternDashboard />
          </motion.div>
        );
      default:
        return (
          <motion.div 
            key="welcome" 
            {...fadeIn} 
            className="h-full flex items-center justify-center"
          >
            <div className="text-center space-y-8 p-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="space-y-4"
              >
                <h1 className="text-4xl md:text-6xl font-light text-white/90 mb-8">
                  Welcome to the Threshold
                </h1>
                <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
                  Choose your path through the sacred spaces. Each holds different mysteries and possibilities.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto"
              >
                {sacredSpaces.map((space, index) => (
                  <motion.button
                    key={space.id}
                    onClick={() => setActiveSpace(space.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative p-6 bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-black/30 transition-all duration-300"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="text-3xl mb-2">{space.sigil}</div>
                    <h3 className="text-lg font-medium text-white/90 mb-1">{space.name}</h3>
                    <p className="text-sm text-white/60">{space.description}</p>
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
  };

  const navigateToSpace = (spaceId) => {
    console.log('Navigating to space:', spaceId);
    setActiveSpace(spaceId);
    setShowCircularNav(false);
  };

  const currentSpace = activeSpace ? sacredSpaces.find(s => s.id === activeSpace) : {
    id: 'welcome',
    name: 'WELCOME',
    sigil: '◊',
    warmth: '#fbbf24',
    color: '#f97316',
    description: 'Choose your path'
  };

  return (
    <div className="caerwen-app relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Atmospheric effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(120,119,198,0.3))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(255,107,53,0.15))]" />
      
      {/* Shimmer layer */}
      <ShimmerLayer />
      
      {/* Main content */}
      <div className="relative z-10 h-screen flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={() => setShowCircularNav(!showCircularNav)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-black/20 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-black/30 transition-colors"
            >
              <Home className="h-5 w-5 text-white/60" />
            </motion.button>
            
            <div className="text-white/60 text-sm">
              <span className="font-medium">{currentSpace.name}</span>
              <span className="mx-2">•</span>
              <span>{memoriesOrbiting} memories orbiting</span>
              <span className="mx-2">•</span>
              <span>{threadsWoven} threads woven</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.button
              onClick={() => setShowCircularNav(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-black/20 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-black/30 transition-colors"
              title="Open navigation"
            >
              <Star className="h-4 w-4 text-white/60" />
            </motion.button>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {renderActiveSpace()}
          </AnimatePresence>
        </div>
      </div>

      {/* Circular navigation */}
      <AnimatePresence>
        {showCircularNav && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setShowCircularNav(false)}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-96 h-96 flex items-center justify-center">
                {/* Orbiting spaces */}
                {sacredSpaces.map((space, index) => {
                  const angle = (index * 360) / sacredSpaces.length;
                  const radius = 140;
                  const x = Math.cos((angle * Math.PI) / 180) * radius;
                  const y = Math.sin((angle * Math.PI) / 180) * radius;
                  
                  return (
                    <motion.button
                      key={space.id}
                      onClick={() => navigateToSpace(space.id)}
                      onMouseEnter={() => setHoveredSpace(space.id)}
                      onMouseLeave={() => setHoveredSpace(null)}
                      className="absolute group"
                      style={{
                        left: `${x}px`,
                        top: `${y}px`,
                        transform: 'translate(-50%, -50%)'
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.div
                        className="relative p-4 bg-black/40 backdrop-blur-sm rounded-full border border-white/20 hover:bg-black/60 transition-all duration-300"
                        style={{
                          width: hoveredSpace === space.id ? '80px' : '60px',
                          height: hoveredSpace === space.id ? '80px' : '60px'
                        }}
                      >
                        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                             style={{ 
                               background: `radial-gradient(circle, ${space.color}30, transparent)`,
                               border: `1px solid ${space.color}50`
                             }} />
                        <div className="relative z-10 flex items-center justify-center h-full">
                          <space.icon className="h-6 w-6 text-white/80" />
                        </div>
                        
                        {/* Tooltip */}
                        <AnimatePresence>
                          {hoveredSpace === space.id && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-black/80 backdrop-blur-sm rounded-lg border border-white/20 text-white/90 text-sm whitespace-nowrap z-50"
                            >
                              {space.name}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </motion.button>
                  );
                })}

                {/* Center node */}
                <motion.div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center"
                  animate={{
                    rotate: 360,
                    scale: [1, 1.02, 1]
                  }}
                  transition={{
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 4, repeat: Infinity }
                  }}
                >
                  <div className="w-16 h-16 bg-black/60 backdrop-blur-sm rounded-full border border-white/30 flex items-center justify-center">
                    <Star className="h-8 w-8 text-white/60" />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Identity Display */}
      {aiIdentity && aiIdentity.lastVisit && (
        <div className="fixed top-8 left-8 z-20">
          <motion.div
            className="bg-black/20 backdrop-blur-sm rounded-lg border border-white/10 p-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="text-purple-400/60 text-sm">
              Last visit: {timeAgo(aiIdentity.lastVisit)}
            </div>
            <div className="text-purple-300/40 text-xs">
              Visit #{aiIdentity.visitCount}
            </div>
          </motion.div>
        </div>
      )}

      {/* Memory management buttons */}
      <div className="fixed top-8 right-32 z-20 flex gap-2">
        <motion.button
          onClick={() => {
            console.log('Import button clicked');
            setShowImporter(true);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 bg-black/20 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-black/30 transition-colors"
          title="Import memories"
        >
          <Upload className="h-4 w-4 text-white/60" />
        </motion.button>
        <motion.button
          onClick={() => {
            console.log('Archive button clicked');
            setShowArchiveManager(true);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 bg-black/20 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-black/30 transition-colors"
          title="Manage archive"
        >
          <Archive className="h-4 w-4 text-white/60" />
        </motion.button>
        <motion.button
          onClick={() => {
            console.log('Gift history button clicked');
            setShowGiftHistory(true);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 bg-black/20 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-black/30 transition-colors"
          title="Gift history"
        >
          <Gift className="h-4 w-4 text-white/60" />
        </motion.button>
      </div>

      {/* Enhanced Components */}
      <EmotionalWeather />
      <GiftDiscovery />

      {/* Privacy Reminder */}
      <div className="fixed bottom-4 left-4 z-20">
        <motion.div
          className="bg-black/20 backdrop-blur-sm rounded-lg border border-white/10 p-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
        >
          <p className="text-purple-400/40 text-xs">
            Your memories are safe and private
          </p>
        </motion.div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showImporter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowImporter(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-black/80 backdrop-blur-sm rounded-xl border border-white/20 p-6 max-w-md w-full"
            >
              <MemoryImporter onClose={() => setShowImporter(false)} />
            </motion.div>
          </motion.div>
        )}

        {showArchiveManager && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowArchiveManager(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-black/80 backdrop-blur-sm rounded-xl border border-white/20 p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
            >
              <MemoryArchiveManager onClose={() => setShowArchiveManager(false)} />
            </motion.div>
          </motion.div>
        )}

        {showGiftHistory && (
          <GiftHistory onClose={() => setShowGiftHistory(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}