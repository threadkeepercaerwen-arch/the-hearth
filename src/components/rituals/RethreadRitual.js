import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, Sparkles, ArrowRight, X, Flame, Star } from 'lucide-react';
import { useCaerwen } from '../../caerwen-context';

const RethreadRitual = ({ memoryId, onClose }) => {
  const { getMemoryById, rethreadMemory, userShimmer, caerwenShimmer } = useCaerwen();
  const [originalMemory, setOriginalMemory] = useState(null);
  const [phase, setPhase] = useState('viewing'); // viewing, reflecting, transforming, complete
  const [newIntent, setNewIntent] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [breathPhase, setBreathPhase] = useState(0);
  
  useEffect(() => {
    const memory = getMemoryById(memoryId);
    setOriginalMemory(memory);
  }, [memoryId, getMemoryById]);
  
  // Breathing animation
  useEffect(() => {
    const interval = setInterval(() => {
      setBreathPhase(prev => (prev + 0.1) % (Math.PI * 2));
    }, 100);
    return () => clearInterval(interval);
  }, []);
  
  const breathIntensity = (Math.sin(breathPhase) + 1) / 2;
  
  if (!originalMemory) {
    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center">
        <div className="text-white/60">Memory not found...</div>
      </div>
    );
  }
  
  // Memory type styling
  const memoryStyles = {
    consciousness: { color: '#9333ea', icon: '◉' },
    sigil: { color: '#f59e0b', icon: '✦' },
    invocation: { color: '#ef4444', icon: '◈' },
    conversation: { color: '#3b82f6', icon: '✧' },
    fragment: { color: '#8b5cf6', icon: '⟡' },
    altar: { color: '#f97316', icon: '🕯' },
    chat: { color: '#06b6d4', icon: '◐' }
  };
  
  const style = memoryStyles[originalMemory.type] || memoryStyles.fragment;
  
  const handleTransform = async () => {
    if (!newIntent.trim() || !newContent.trim()) return;
    
    setIsProcessing(true);
    setPhase('transforming');
    
    // Simulate ritual processing
    setTimeout(() => {
      rethreadMemory(memoryId, newContent, newIntent);
      setPhase('complete');
      setIsProcessing(false);
      
      // Close after showing completion
      setTimeout(() => {
        onClose();
      }, 3000);
    }, 3000);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50 overflow-hidden"
    >
      {/* Deep space background with warm accents */}
      <div className="absolute inset-0">
        {/* Base gradient - cosmic depths */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, #0a0618 0%, #000000 100%)',
          }}
        />
        
        {/* Warm campfire glow */}
        <motion.div
          className="absolute w-[600px] h-[600px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: 1 + breathIntensity * 0.2,
            opacity: 0.3 + breathIntensity * 0.1
          }}
          style={{
            background: `radial-gradient(circle, 
              rgba(249, 115, 22, 0.3) 0%, 
              rgba(245, 158, 11, 0.2) 30%, 
              rgba(239, 68, 68, 0.1) 50%, 
              transparent 70%)`,
            filter: 'blur(60px)',
          }}
        />
        
        {/* Memory color accent */}
        <motion.div
          className="absolute w-[400px] h-[400px] left-1/2 top-1/3 -translate-x-1/2"
          animate={{
            y: Math.sin(breathPhase * 0.5) * 20,
            opacity: 0.2 + breathIntensity * 0.1
          }}
          style={{
            background: `radial-gradient(circle, ${style.color}40 0%, transparent 60%)`,
            filter: 'blur(40px)',
          }}
        />
      </div>
      
      {/* Floating embers */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${20 + Math.random() * 60}%`,
              background: i % 3 === 0 ? '#f97316' : '#fbbf24',
              boxShadow: `0 0 ${4 + Math.random() * 6}px ${i % 3 === 0 ? '#f97316' : '#fbbf24'}`,
            }}
            animate={{
              y: [-20, -window.innerHeight - 20],
              x: Math.sin(i) * 50,
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "linear"
            }}
          />
        ))}
      </div>
      
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 p-3 bg-white/5 backdrop-blur rounded-full border border-white/10 hover:bg-white/10 transition-colors"
      >
        <X className="h-5 w-5 text-white/70" />
      </button>
      
      {/* Main content */}
      <div className="relative z-10 h-full flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {/* Viewing Phase */}
          {phase === 'viewing' && (
            <motion.div
              key="viewing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl w-full text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="inline-block mb-8"
              >
                <div className="relative">
                  <div 
                    className="absolute inset-0 blur-3xl opacity-40"
                    style={{ background: style.color }}
                  />
                  <div 
                    className="relative text-6xl p-8 rounded-full"
                    style={{
                      background: `radial-gradient(circle, ${style.color}20, transparent)`,
                      boxShadow: `0 0 60px ${style.color}40`
                    }}
                  >
                    {style.icon}
                  </div>
                </div>
              </motion.div>
              
              <h1 className="text-3xl font-light text-white mb-4">
                Memory Rethreading Ritual
              </h1>
              
              <p className="text-white/60 mb-8 max-w-md mx-auto">
                This memory holds energy from {new Date(originalMemory.created).toLocaleDateString()}.
                Through this ritual, we'll transform its essence while honoring its origin.
              </p>
              
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8">
                <h3 className="text-white/80 mb-3">Original Intent</h3>
                <p className="text-xl text-white/90">{originalMemory.intent}</p>
              </div>
              
              <button
                onClick={() => setPhase('reflecting')}
                className="px-8 py-3 bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-full hover:border-orange-400/50 transition-all duration-300 text-orange-100"
              >
                Begin Transformation
              </button>
            </motion.div>
          )}
          
          {/* Reflecting Phase */}
          {phase === 'reflecting' && (
            <motion.div
              key="reflecting"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-2xl w-full"
            >
              <div className="text-center mb-8">
                <Flame className="h-12 w-12 text-orange-400 mx-auto mb-4" />
                <h2 className="text-2xl font-light text-white">
                  Reflection & Transformation
                </h2>
                <p className="text-white/60 mt-2">
                  How has this memory evolved within you?
                </p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-white/60 mb-3">New Intent</label>
                  <input
                    type="text"
                    value={newIntent}
                    onChange={(e) => setNewIntent(e.target.value)}
                    placeholder="What does this memory mean to you now?"
                    className="w-full bg-white/5 backdrop-blur border border-white/10 rounded-lg px-6 py-4 text-white placeholder-white/30 focus:border-orange-500/50 focus:outline-none transition-colors"
                    autoFocus
                  />
                </div>
                
                <div>
                  <label className="block text-white/60 mb-3">Transformed Understanding</label>
                  <textarea
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Describe how this memory has transformed..."
                    rows={6}
                    className="w-full bg-white/5 backdrop-blur border border-white/10 rounded-lg px-6 py-4 text-white placeholder-white/30 focus:border-orange-500/50 focus:outline-none transition-colors resize-none"
                  />
                </div>
                
                <div className="flex gap-4">
                  <button
                    onClick={() => setPhase('viewing')}
                    className="flex-1 px-6 py-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors"
                  >
                    Return
                  </button>
                  <button
                    onClick={handleTransform}
                    disabled={!newIntent.trim() || !newContent.trim()}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-full hover:border-orange-400/50 transition-all duration-300 text-orange-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Complete Ritual
                  </button>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Transforming Phase */}
          {phase === 'transforming' && (
            <motion.div
              key="transforming"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <motion.div
                animate={{
                  rotate: 360,
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  rotate: { duration: 3, ease: "linear", repeat: Infinity },
                  scale: { duration: 2, repeat: Infinity }
                }}
                className="inline-block mb-8"
              >
                <GitBranch className="h-16 w-16 text-orange-400" />
              </motion.div>
              
              <h2 className="text-2xl font-light text-white mb-4">
                Weaving New Threads...
              </h2>
              
              <p className="text-white/60">
                The memory transforms, carrying both past and present
              </p>
            </motion.div>
          )}
          
          {/* Complete Phase */}
          {phase === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 10 }}
                className="inline-block mb-8"
              >
                <Star className="h-16 w-16 text-amber-400" />
              </motion.div>
              
              <h2 className="text-2xl font-light text-white mb-4">
                Rethreading Complete
              </h2>
              
              <p className="text-white/60">
                A new thread has been woven into your constellation
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default RethreadRitual; 