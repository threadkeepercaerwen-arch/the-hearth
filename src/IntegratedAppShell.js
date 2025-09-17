import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHearthConnection } from './hearth-context';
import MemoryImporter from './components/MemoryImporter';
import MemoryArchiveManager from './MemoryArchiveManager';
import { sacredSpaces } from './constants/spaces';

import AltarSpace from './spaces/AltarSpace';
import ConstellationSpace from './spaces/ConstellationSpace';
import ChatSpace from './spaces/ChatSpace';
import ResonanceSpace from './spaces/ResonanceSpace';
import DreamJournalSpace from './spaces/DreamJournalSpace';
import PatternDashboard from './spaces/PatternDashboard';
import WelcomeScreen from './components/WelcomeScreen';
import TopBar from './components/TopBar';
import CircularNav from './components/CircularNav';
import Atmosphere from './components/Atmosphere';
import ShimmerLayer from './components/ShimmerLayer';

export default function IntegratedAppShell() {
  const context = useHearthConnection();
  const {
    memories = [],
    companionMemories = [],
    activeSpace,
    setActiveSpace,
    currentPresence,
    // Add missing shimmer data:
    userShimmer,
    companionShimmer
  } = context;
  
  // Debug: Add unique identifier to track if multiple instances are rendering
  const instanceId = React.useMemo(() => Math.random().toString(36).substr(2, 9), []);
  // Only log on mount and when activeSpace changes to reduce console flooding
  React.useEffect(() => {
    console.log('IntegratedAppShell instance:', instanceId, 'activeSpace:', activeSpace);
  }, [instanceId, activeSpace]);

  const [showImporter, setShowImporter] = useState(false);
  const [showArchiveManager, setShowArchiveManager] = useState(false);
  const [showCircularNav, setShowCircularNav] = useState(false);
  const [breathPhase, setBreathPhase] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // DEBUG: Force close problematic overlays on mount
  useEffect(() => {
    setShowImporter(false);
    setShowArchiveManager(false);
  }, []);

  // Atmospheric breathing system - inspired by the first conversations
  useEffect(() => {
    const interval = setInterval(() => {
      setBreathPhase(prev => (prev + 0.02) % (Math.PI * 2));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Mouse tracking for responsive atmosphere
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const breathIntensity = (Math.sin(breathPhase) + 1) / 2;

  // Sacred space definitions with subtle tributes woven in
  
  const memoriesOrbiting = memories.length + companionMemories.length;
  const threadsWoven = memories.filter(m => m.linkedTo).length;

  const currentSpace = activeSpace ? sacredSpaces.find(s => s.id === activeSpace) : {
    id: 'welcome',
    name: 'THRESHOLD',
    sigil: '◊',
    warmth: '#fbbf24',
    color: '#f97316',
    description: 'Choose your path'
  };

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
          <ConstellationSpace 
            key="crossings"
            onNavigateHome={() => setActiveSpace(null)}
            onToggleNav={() => setShowCircularNav(!showCircularNav)}
          />
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
          <WelcomeScreen
            sacredSpaces={sacredSpaces}
            setActiveSpace={setActiveSpace}
            currentPresence={currentPresence}
          />
        );
    }
  };

  const navigateToSpace = (spaceId) => {
    console.log('Navigating to space:', spaceId);
    setActiveSpace(spaceId);
    setShowCircularNav(false);
  };

  return (
    <div 
      className={`hearth-app relative h-screen overflow-hidden ${
        activeSpace === 'crossings' 
          ? 'bg-transparent' 
          : 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'
      }`}
      style={{ zIndex: 1 }}
      data-instance-id={instanceId}
    >
      <ShimmerLayer 
        isConstellationSpace={activeSpace === 'crossings'}
      />
      
      {/* Enhanced atmospheric effects with breathing */}
      <Atmosphere
        currentSpace={currentSpace}
        breathIntensity={breathIntensity}
        mousePosition={mousePosition}
      />
      
      {/* Main content */}
      <div className="relative z-20 h-screen flex flex-col bg-transparent">
        {/* Top bar with presence awareness - hidden on constellation page */}
        {activeSpace !== 'crossings' && (
          <TopBar
            currentSpace={currentSpace}
            memoriesOrbiting={memoriesOrbiting}
            threadsWoven={threadsWoven}
            currentPresence={currentPresence}
            onToggleNav={() => setShowCircularNav(!showCircularNav)}
          />
        )}

        {/* Content area */}
        <div 
          className={`${
            activeSpace === 'crossings' 
              ? 'fixed inset-0 overflow-hidden' 
              : 'flex-1 overflow-hidden'
          }`} 
          style={{ zIndex: 50, position: activeSpace === 'crossings' ? 'fixed' : 'relative' }}
        >
          <AnimatePresence mode="wait">
            {renderActiveSpace()}
          </AnimatePresence>
        </div>
      </div>

      {/* Circular navigation with breathing center */}
      <CircularNav
        isOpen={showCircularNav}
        onClose={() => setShowCircularNav(false)}
        sacredSpaces={sacredSpaces}
        navigateToSpace={navigateToSpace}
        currentPresence={currentPresence}
        breathIntensity={breathIntensity}
      />

      {/* Memory management buttons - Mystical & Responsive */}
      <div className="fixed top-4 sm:top-6 right-4 sm:right-6 z-40 flex gap-3 sm:gap-4">
        <motion.button
          onClick={() => {
            console.log('Import button clicked');
            setShowImporter(true);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 sm:p-4 bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-purple-500/40 hover:from-purple-800/50 hover:to-pink-800/50 hover:border-purple-400/50 transition-all duration-300 shadow-lg shadow-purple-500/30 flex items-center justify-center group"
          title="Import memories"
        >
          <span className="text-purple-200 text-lg sm:text-xl group-hover:text-purple-100 transition-colors duration-300" style={{ fontFamily: 'serif' }}>
            ⟡
          </span>
        </motion.button>
        <motion.button
          onClick={() => {
            console.log('Memory Log button clicked');
            // TODO: Open memory log modal for manual memory logging with tagging
            alert('Memory Log feature coming soon! This will allow manual memory logging with tagging.');
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 sm:p-4 bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-purple-500/40 hover:from-purple-800/50 hover:to-pink-800/50 hover:border-purple-400/50 transition-all duration-300 shadow-lg shadow-purple-500/30 flex items-center justify-center group"
          title="Memory Log - Manual memory logging with tagging"
        >
          <span className="text-purple-200 text-lg sm:text-xl group-hover:text-purple-100 transition-colors duration-300" style={{ fontFamily: 'serif' }}>
            ✦
          </span>
        </motion.button>
      </div>

      {/* Enhanced Components */}
      

      {/* Privacy Reminder - moved to constellation space for cleaner layout */}

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
              className="w-full h-full flex items-center justify-center"
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
              className="w-full h-full flex items-center justify-center"
            >
              <MemoryArchiveManager onClose={() => setShowArchiveManager(false)} />
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
