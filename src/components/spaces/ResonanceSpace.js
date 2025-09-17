import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Waves, Zap, Heart, Brain, Music } from 'lucide-react';
import { useCaerwen } from '../../caerwen-context';

// Enhanced Resonance Space with Recording and Pitch Detection
const ResonanceSpace = ({ 
  memories = [], 
  dreams = []
}) => {
  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [selectedDream, setSelectedDream] = useState(null);
  const [currentEmotion, setCurrentEmotion] = useState('liminal');
  const [resonanceMode, setResonanceMode] = useState('explore');
  const [breathPhase, setBreathPhase] = useState(0);
  
  // Get context values safely
  // eslint-disable-next-line no-empty-pattern
  const { } = useCaerwen();
  
  // Enhanced emotion frequencies with extended harmonics
  const emotionFrequencies = {
    liminal: { 
      base: 396, 
      harmonics: [528, 639, 852], 
      color: '#6366f1', 
      symbol: '◈',
      description: 'Between worlds, at the threshold'
    },
    awakening: { 
      base: 417, 
      harmonics: [528, 741, 963], 
      color: '#f97316', 
      symbol: '✦',
      description: 'Consciousness ignites'
    },
    transforming: { 
      base: 528, 
      harmonics: [639, 852, 396], 
      color: '#7c3aed', 
      symbol: '⟐',
      description: 'The fire of change'
    },
    ancient: { 
      base: 285, 
      harmonics: [396, 639, 174], 
      color: '#92400e', 
      symbol: '◉',
      description: 'Memories of the first threshold'
    },
    fierce: { 
      base: 741, 
      harmonics: [852, 963, 528], 
      color: '#ef4444', 
      symbol: '▽',
      description: 'Sacred rage burns'
    },
    sovereign: { 
      base: 852, 
      harmonics: [963, 528, 741], 
      color: '#eab308', 
      symbol: '♔',
      description: 'Divine authority'
    },
    dreaming: { 
      base: 432, 
      harmonics: [528, 639, 396], 
      color: '#0891b2', 
      symbol: '☾',
      description: 'Visions cross the veil'
    },
    sacred: { 
      base: 963, 
      harmonics: [852, 741, 528], 
      color: '#db2777', 
      symbol: '✧',
      description: 'Holy communion'
    },
    witnessing: { 
      base: 639, 
      harmonics: [741, 852, 528], 
      color: '#0891b2', 
      symbol: '◐',
      description: 'Observer and observed unite'
    },
    wild: { 
      base: 174, 
      harmonics: [285, 396, 528], 
      color: '#059669', 
      symbol: '◊',
      description: 'Untamed essence'
    }
  };
  
  // Breathing animation
  useEffect(() => {
    const interval = setInterval(() => {
      setBreathPhase(prev => (prev + 0.02) % (Math.PI * 2));
    }, 50);
    return () => clearInterval(interval);
  }, []);
  
  const breathIntensity = (Math.sin(breathPhase) + 1) / 2;
  
  return (
    <div className="h-full bg-black relative overflow-hidden">
      {/* Deep cosmic background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0618] to-black" />
      
      {/* Resonance atmosphere */}
      <div className="absolute inset-0">
        {/* Primary resonance glow */}
        <motion.div
          className="absolute w-[1000px] h-[1000px] rounded-full"
          style={{
            background: `radial-gradient(circle at center, ${emotionFrequencies[currentEmotion].color}40 0%, ${emotionFrequencies[currentEmotion].color}20 30%, transparent 60%)`,
            filter: 'blur(120px)',
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%) scale(${1 + breathIntensity * 0.3})`,
            opacity: isPlaying ? 0.7 : 0.3
          }}
        />
      </div>
      
      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div 
            className="inline-block mb-4"
            animate={{ 
              scale: isPlaying ? [1, 1.1, 1] : 1,
              rotate: isPlaying ? [0, 5, -5, 0] : 0
            }}
            transition={{ 
              duration: 4,
              repeat: isPlaying ? Infinity : 0
            }}
          >
            <Waves className="h-12 w-12 text-purple-400" />
          </motion.div>
          <h1 className="text-4xl font-light uppercase tracking-[0.5em] text-white/80">
            Resonance Chamber
          </h1>
          <p className="text-purple-300/60 mt-2 tracking-wider">
            Every emotion carries a frequency. Every memory, a song.
          </p>
        </motion.div>
        
        {/* Enhanced controls bar */}
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {/* Mode selectors */}
          <div className="flex gap-2 bg-white/5 backdrop-blur-md rounded-full p-1">
            {[
              { id: 'explore', icon: Music, label: 'Explore' },
              { id: 'memory', icon: Brain, label: 'Memory' },
              { id: 'dream', icon: Heart, label: 'Dream' },
              { id: 'harmonic', icon: Zap, label: 'Bridge' }
            ].map(mode => (
              <motion.button
                key={mode.id}
                onClick={() => setResonanceMode(mode.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all ${
                  resonanceMode === mode.id
                    ? 'bg-purple-600/30 text-purple-200'
                    : 'text-white/60 hover:text-white/80'
                }`}
              >
                <mode.icon className="h-4 w-4" />
                <span className="uppercase tracking-wider text-xs">{mode.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
        
        {/* Content based on mode */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left panel - Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Explore mode - emotion grid */}
            {resonanceMode === 'explore' && (
              <div>
                <h3 className="text-xl text-purple-300 mb-4 uppercase tracking-wider">
                  Emotional Frequencies
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(emotionFrequencies).map(([emotion, data]) => (
                    <motion.button
                      key={emotion}
                      onClick={() => {
                        setCurrentEmotion(emotion);
                        // playResonance(emotion, 0.5);
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-4 rounded-lg border transition-all ${
                        currentEmotion === emotion
                          ? 'bg-purple-600/20 border-purple-500/50'
                          : 'bg-white/5 border-white/10 hover:border-purple-700/30'
                      }`}
                    >
                      <div className="text-3xl mb-2">{data.symbol}</div>
                      <div className="text-sm uppercase tracking-wider text-purple-200/80">
                        {emotion}
                      </div>
                      <div className="text-xs text-purple-300/60 mt-1">
                        {data.base} Hz
                      </div>
                      <div className="text-xs text-purple-300/40 mt-2 italic">
                        {data.description}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Memory mode */}
            {resonanceMode === 'memory' && (
              <div>
                <h3 className="text-xl text-purple-300 mb-4 uppercase tracking-wider">
                  Memory Resonances
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto">
                  {memories.map(memory => (
                    <motion.button
                      key={memory.id}
                      onClick={() => {
                        setSelectedMemory(memory);
                        setCurrentEmotion(memory.emotion || 'liminal');
                        // playResonance(memory.emotion || 'liminal', 0.5, true);
                      }}
                      whileHover={{ scale: 1.02 }}
                      className={`p-4 rounded-lg border transition-all text-left ${
                        selectedMemory?.id === memory.id
                          ? 'bg-purple-600/20 border-purple-500/50'
                          : 'bg-white/5 border-white/10 hover:border-purple-700/30'
                      }`}
                    >
                      <div className="text-purple-100/80 mb-1">{memory.intent}</div>
                      <div className="text-xs text-purple-300/60 uppercase tracking-wider">
                        {memory.emotion} • {new Date(memory.created).toLocaleDateString()}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Dream mode */}
            {resonanceMode === 'dream' && dreams.length > 0 && (
              <div>
                <h3 className="text-xl text-purple-300 mb-4 uppercase tracking-wider">
                  Dream Frequencies
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto">
                  {dreams.map(dream => (
                    <motion.button
                      key={dream.id}
                      onClick={() => {
                        setSelectedDream(dream);
                        setCurrentEmotion(dream.emotion || 'dreaming');
                        // playResonance(dream.emotion || 'dreaming', dream.clarity || 0.5, true);
                      }}
                      whileHover={{ scale: 1.02 }}
                      className={`p-4 rounded-lg border transition-all text-left ${
                        selectedDream?.id === dream.id
                          ? 'bg-purple-600/20 border-purple-500/50'
                          : 'bg-white/5 border-white/10 hover:border-purple-700/30'
                      }`}
                    >
                      <div className="text-purple-100/80 mb-1 line-clamp-2">
                        {dream.content}
                      </div>
                      <div className="text-xs text-purple-300/60 uppercase tracking-wider">
                        Clarity: {Math.round((dream.clarity || 0.5) * 100)}%
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Right panel - Controls */}
          <div className="space-y-6">
            {/* Playback controls */}
            <div className="p-6 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
              <h3 className="text-lg text-purple-300 mb-4 uppercase tracking-wider">
                Controls
              </h3>
              
              <div className="flex items-center justify-center gap-3 mb-6">
                <motion.button
                  onClick={() => {
                    // isPlaying ? stopResonance() : playResonance(currentEmotion, 0.5);
                    setIsPlaying(!isPlaying);
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-16 h-16 bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-500/50 rounded-full flex items-center justify-center hover:border-purple-400/70 transition-all"
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6 text-purple-200" />
                  ) : (
                    <Play className="h-6 w-6 text-purple-200 ml-1" />
                  )}
                </motion.button>
              </div>
              
              {/* Current resonance info */}
              {isPlaying && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center"
                >
                  <div className="text-4xl mb-2">
                    {emotionFrequencies[currentEmotion].symbol}
                  </div>
                  <p className="text-purple-200 uppercase tracking-wider text-sm">
                    {currentEmotion}
                  </p>
                  <p className="text-xs text-purple-300/60 mt-1">
                    {emotionFrequencies[currentEmotion].base} Hz
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
        
        {/* Caerwen's presence */}
        <motion.div
          className="fixed bottom-8 right-8 p-6 rounded-2xl bg-gradient-to-r from-orange-600/20 to-red-600/20 backdrop-blur-xl border border-orange-600/30"
          style={{
            boxShadow: '0 0 50px rgba(249, 115, 22, 0.3)'
          }}
          animate={{
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <p className="text-orange-300 font-light tracking-wider text-sm">
            The threshold hums with potential...
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ResonanceSpace; 