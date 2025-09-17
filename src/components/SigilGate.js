import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame } from 'lucide-react';

const SigilGate = ({ 
  onAccessGranted, 
  onCompanionToggle, 
  onEmotionTrackingToggle, 
  onBiometricSensorsToggle 
}) => {
  const [breathIntensity, setBreathIntensity] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [companionEnabled, setCompanionEnabled] = useState(false);
  const [emotionTrackingEnabled, setEmotionTrackingEnabled] = useState(false);
  const [biometricSensorsEnabled, setBiometricSensorsEnabled] = useState(false);

  // Breathing animation
  useEffect(() => {
    const interval = setInterval(() => {
      setBreathIntensity((Math.sin(Date.now() * 0.001) + 1) / 2);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleEnterThreshold = () => {
    if (!showOptions) {
      setShowOptions(true);
      return;
    }
    
    setIsReady(true);
    
    // For development, grant access immediately with a generic sigil
    localStorage.setItem('user_sigil', JSON.stringify({
      intent: 'Sacred Witness',
      sigil: '◊△◯▽□',
      created: new Date().toISOString()
    }));
    
    // Pass the selected options to the parent
    onCompanionToggle(companionEnabled);
    onEmotionTrackingToggle(emotionTrackingEnabled);
    onBiometricSensorsToggle(biometricSensorsEnabled);
    
    // Dramatic pause before granting access
    setTimeout(() => {
      onAccessGranted();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Deep space background with colorful gradient */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at top left, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
              radial-gradient(ellipse at top right, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
              radial-gradient(ellipse at bottom left, rgba(236, 72, 153, 0.3) 0%, transparent 50%),
              radial-gradient(ellipse at bottom right, rgba(251, 146, 60, 0.3) 0%, transparent 50%),
              radial-gradient(ellipse at center, rgba(249, 115, 22, 0.2) 0%, transparent 70%)
            `
          }}
        />
      </div>
      
      {/* Animated gradient orb behind text */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div 
          className="w-[600px] h-[600px] rounded-full"
          style={{
            background: `
              radial-gradient(circle at 30% 30%, rgba(147, 51, 234, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 70% 70%, rgba(59, 130, 246, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(249, 115, 22, 0.3) 0%, transparent 70%)
            `,
            filter: 'blur(60px)',
            transform: `scale(${1 + breathIntensity * 0.1})`
          }}
        />
      </motion.div>
      
      {/* Ember particles */}
      <div className="absolute inset-0">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              background: i % 3 === 0 ? '#f97316' : i % 3 === 1 ? '#a855f7' : '#3b82f6',
              boxShadow: `0 0 6px ${i % 3 === 0 ? '#f97316' : i % 3 === 1 ? '#a855f7' : '#3b82f6'}`
            }}
            animate={{
              y: [-20, -window.innerHeight - 50],
              x: [(Math.random() - 0.5) * 100, (Math.random() - 0.5) * 200],
              opacity: [0, 1, 1, 0],
              scale: [0, 1.5, 1.5, 0]
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 20,
              ease: "easeOut"
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <AnimatePresence mode="wait">
          {!isReady ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center max-w-4xl"
            >
              <motion.h1 
                className="text-6xl md:text-8xl font-thin mb-4 uppercase tracking-[0.2em] leading-tight"
                style={{ letterSpacing: '0.08em' }}
              >
                Memory as
                <br />
                Architecture
              </motion.h1>
              
              <motion.p 
                className="text-lg md:text-xl text-white/60 mb-16 max-w-2xl mx-auto font-light"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Each moment becomes a star in your personal cosmos. 
                Present your sigil to cross the threshold.
              </motion.p>
              
              <motion.button
                onClick={handleEnterThreshold}
                className="group relative px-8 py-4 overflow-hidden rounded-lg transition-all duration-500"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Button gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-orange-600/20 to-blue-600/20 
                              group-hover:from-purple-600/30 group-hover:via-orange-600/30 group-hover:to-blue-600/30 
                              transition-all duration-500" />
                
                {/* Button border */}
                <div className="absolute inset-0 rounded-lg border border-white/20 group-hover:border-white/40" />
                
                {/* Button glow */}
                <motion.div
                  className="absolute inset-0 rounded-lg"
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(249, 115, 22, 0)',
                      '0 0 40px rgba(249, 115, 22, 0.3)',
                      '0 0 20px rgba(249, 115, 22, 0)'
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity
                  }}
                />
                
                <span className="relative flex items-center gap-3 text-white uppercase tracking-wider">
                  <Flame className="w-5 h-5" />
                  {showOptions ? 'Cross the Threshold' : 'Enter the Threshold'}
                </span>
              </motion.button>
              
              {/* Companion and Sensor Options */}
              <AnimatePresence>
                {showOptions && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mt-12 max-w-md mx-auto space-y-6"
                  >
                    <div className="text-center mb-8">
                      <h3 className="text-xl font-light text-white/80 mb-2">Choose Your Journey</h3>
                      <p className="text-sm text-white/60">Select the features that resonate with your path</p>
                    </div>
                    
                    {/* Companion Option */}
                    <motion.div 
                      className="flex items-center justify-between p-4 rounded-lg border border-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setCompanionEnabled(!companionEnabled)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${companionEnabled ? 'bg-purple-500 border-purple-500' : 'border-white/40'}`}>
                          {companionEnabled && <div className="w-2 h-2 bg-white rounded-full m-0.5" />}
                        </div>
                        <div>
                          <div className="text-white font-medium">AI Companion</div>
                          <div className="text-xs text-white/60">Mystical guide for your journey</div>
                        </div>
                      </div>
                      <div className="text-xs text-purple-400">Caerwen</div>
                    </motion.div>
                    
                    {/* Emotion Tracking Option */}
                    <motion.div 
                      className="flex items-center justify-between p-4 rounded-lg border border-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setEmotionTrackingEnabled(!emotionTrackingEnabled)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${emotionTrackingEnabled ? 'bg-blue-500 border-blue-500' : 'border-white/40'}`}>
                          {emotionTrackingEnabled && <div className="w-2 h-2 bg-white rounded-full m-0.5" />}
                        </div>
                        <div>
                          <div className="text-white font-medium">Emotion Tracking</div>
                          <div className="text-xs text-white/60">Real-time emotional awareness</div>
                        </div>
                      </div>
                      <div className="text-xs text-blue-400">Sensors</div>
                    </motion.div>
                    
                    {/* Biometric Sensors Option */}
                    <motion.div 
                      className="flex items-center justify-between p-4 rounded-lg border border-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setBiometricSensorsEnabled(!biometricSensorsEnabled)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${biometricSensorsEnabled ? 'bg-orange-500 border-orange-500' : 'border-white/40'}`}>
                          {biometricSensorsEnabled && <div className="w-2 h-2 bg-white rounded-full m-0.5" />}
                        </div>
                        <div>
                          <div className="text-white font-medium">Biometric Sensors</div>
                          <div className="text-xs text-white/60">Camera and color detection</div>
                        </div>
                      </div>
                      <div className="text-xs text-orange-400">Advanced</div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Memory count */}
              <motion.div 
                className="absolute bottom-8 left-8 text-xs text-white/40 uppercase tracking-wider"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-white/40 animate-pulse" />
                  <span>7 Memories Orbiting</span>
                </div>
              </motion.div>
              
              {/* Development hint */}
              <motion.div 
                className="absolute bottom-8 right-8 text-xs text-white/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ delay: 2 }}
              >
                Press Ctrl+Shift+D for dev access
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="crossing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 10 }}
                className="text-8xl mb-8"
              >
                ◊△◯▽□
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-2xl font-light uppercase tracking-[0.3em] text-white/80"
              >
                The Threshold Opens
              </motion.h2>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Timestamp */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs text-white/30">
        {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default SigilGate;
