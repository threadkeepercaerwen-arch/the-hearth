// Add this as a new component: EmotionalWeather.js

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCaerwen } from '../caerwen-context';

const EmotionalWeather = () => {
  const { userShimmer, caerwenShimmer, memories, checkResonance } = useCaerwen();
  const [weather, setWeather] = useState('clear');
  const [particles, setParticles] = useState([]);

  // Determine weather based on emotional climate
  useEffect(() => {
    const userMood = userShimmer.emotion;
    const caerwenMood = caerwenShimmer.emotion;
    const combinedIntensity = (userShimmer.intensity + caerwenShimmer.intensity) / 2;
    
    // Weather patterns based on emotional states
    if (checkResonance()) {
      setWeather('aurora'); // Special resonance weather
    } else if (userMood?.includes('void') || caerwenMood?.includes('void')) {
      setWeather('void-mist');
    } else if (userMood?.includes('electric') || combinedIntensity > 0.8) {
      setWeather('lightning');
    } else if (userMood?.includes('sorrow') || caerwenMood?.includes('sorrow')) {
      setWeather('rain');
    } else if (userMood?.includes('serene') && caerwenMood?.includes('serene')) {
      setWeather('starfall');
    } else if (userMood?.includes('nostalgic')) {
      setWeather('memory-snow');
    } else if (caerwenMood?.includes('contemplating')) {
      setWeather('nebula');
    } else {
      setWeather('gentle-glow');
    }
  }, [userShimmer, caerwenShimmer]);

  // Generate weather particles
  useEffect(() => {
    const newParticles = [];
    const particleCount = weather === 'void-mist' ? 50 : 30;
    
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 4 + 1,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 5
      });
    }
    
    setParticles(newParticles);
  }, [weather]);

  const renderWeatherEffect = () => {
    switch (weather) {
      case 'aurora':
        return (
          <div className="fixed inset-0 pointer-events-none">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className="absolute inset-0"
                animate={{
                  background: [
                    `linear-gradient(${i * 45}deg, transparent, ${userShimmer.color}20, transparent)`,
                    `linear-gradient(${i * 45 + 180}deg, transparent, ${caerwenShimmer.color}20, transparent)`,
                    `linear-gradient(${i * 45}deg, transparent, ${userShimmer.color}20, transparent)`
                  ]
                }}
                transition={{
                  duration: 10 + i * 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  mixBlendMode: 'screen'
                }}
              />
            ))}
          </div>
        );
        
      case 'rain':
        return (
          <div className="fixed inset-0 pointer-events-none">
            {particles.map(p => (
              <motion.div
                key={p.id}
                className="absolute w-0.5 h-8 bg-gradient-to-b from-transparent via-blue-400/30 to-transparent"
                initial={{ x: p.x, y: -20 }}
                animate={{
                  y: window.innerHeight + 20,
                  x: p.x + Math.random() * 50 - 25
                }}
                transition={{
                  duration: p.duration / 10,
                  repeat: Infinity,
                  delay: p.delay,
                  ease: "linear"
                }}
              />
            ))}
          </div>
        );
        
      case 'memory-snow':
        return (
          <div className="fixed inset-0 pointer-events-none">
            {particles.map(p => (
              <motion.div
                key={p.id}
                className="absolute rounded-full bg-purple-200/20"
                style={{
                  width: p.size * 2,
                  height: p.size * 2,
                  filter: 'blur(1px)'
                }}
                initial={{ x: p.x, y: -20 }}
                animate={{
                  y: window.innerHeight + 20,
                  x: [p.x, p.x + 30, p.x - 20, p.x]
                }}
                transition={{
                  duration: p.duration,
                  repeat: Infinity,
                  delay: p.delay,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        );
        
      case 'lightning':
        return (
          <AnimatePresence>
            {Math.random() > 0.98 && (
              <motion.div
                className="fixed inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  background: `radial-gradient(circle at ${Math.random() * 100}% ${Math.random() * 50}%, 
                    ${userShimmer.color}40, transparent)`
                }}
              />
            )}
          </AnimatePresence>
        );
        
      case 'void-mist':
        return (
          <div className="fixed inset-0 pointer-events-none">
            <motion.div
              className="absolute inset-0"
              animate={{
                background: [
                  'radial-gradient(circle at 20% 80%, #1a1a2e40, transparent)',
                  'radial-gradient(circle at 80% 20%, #1a1a2e40, transparent)',
                  'radial-gradient(circle at 50% 50%, #1a1a2e40, transparent)',
                  'radial-gradient(circle at 20% 80%, #1a1a2e40, transparent)'
                ]
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>
        );
        
      case 'nebula':
        return (
          <div className="fixed inset-0 pointer-events-none">
            <motion.div
              className="absolute inset-0"
              style={{
                background: `
                  radial-gradient(circle at 30% 30%, ${caerwenShimmer.color}10, transparent),
                  radial-gradient(circle at 70% 70%, ${userShimmer.color}10, transparent),
                  radial-gradient(circle at 50% 50%, #6366f110, transparent)
                `,
                filter: 'blur(60px)'
              }}
              animate={{
                rotate: [0, 360]
              }}
              transition={{
                duration: 200,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>
        );
        
      default:
        return null;
    }
  };

  // Weather status indicator
  const weatherDescriptions = {
    'aurora': 'Resonance Aurora',
    'rain': 'Emotional Rain',
    'memory-snow': 'Memory Snow',
    'lightning': 'Electric Storm',
    'void-mist': 'Void Mist',
    'nebula': 'Thought Nebula',
    'starfall': 'Serene Starfall',
    'gentle-glow': 'Gentle Atmosphere'
  };

  return (
    <>
      {renderWeatherEffect()}
      
      {/* Weather indicator */}
      <motion.div
        className="fixed top-20 left-4 text-xs text-white/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center gap-2">
          <span>{weather === 'aurora' ? '🌈' : weather === 'rain' ? '🌧️' : weather === 'lightning' ? '⚡' : '☁️'}</span>
          <span>{weatherDescriptions[weather]}</span>
        </div>
      </motion.div>
    </>
  );
};

export default EmotionalWeather;