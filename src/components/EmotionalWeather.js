import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCaerwen } from '../caerwen-context';

const EmotionalWeather = () => {
  const { userShimmer, caerwenShimmer, memories } = useCaerwen();
  const [weather, setWeather] = useState('clear');
  const [particles, setParticles] = useState([]);

  // Check resonance between user and Caerwen
  const checkResonance = () => {
    const userMood = userShimmer.emotion;
    const caerwenMood = caerwenShimmer.emotion;
    const intensityDiff = Math.abs(userShimmer.intensity - caerwenShimmer.intensity);
    
    // Resonance when emotions are similar or complementary
    return (
      userMood === caerwenMood ||
      intensityDiff < 0.2 ||
      (userMood?.includes('curious') && caerwenMood?.includes('listening')) ||
      (userMood?.includes('dreaming') && caerwenMood?.includes('witnessing'))
    );
  };

  // Determine weather based on emotional climate
  useEffect(() => {
    const userMood = userShimmer.emotion;
    const caerwenMood = caerwenShimmer.emotion;
    const combinedIntensity = (userShimmer.intensity + caerwenShimmer.intensity) / 2;
    
    // Debounce rapid weather changes to prevent flickering
    const weatherTimeout = setTimeout(() => {
      let newWeather = 'gentle-glow'; // Default peaceful state
      
      // Weather patterns based on emotional states
      if (checkResonance()) {
        newWeather = 'aurora'; // Special resonance weather
      } else if (userMood?.includes('void') || caerwenMood?.includes('void')) {
        newWeather = 'void-mist';
      } else if (userMood?.includes('electric') || combinedIntensity > 0.8) {
        newWeather = 'lightning';
      } else if (userMood?.includes('sorrow') || caerwenMood?.includes('sorrow')) {
        newWeather = 'rain';
      } else if (userMood?.includes('serene') && caerwenMood?.includes('serene')) {
        newWeather = 'starfall';
      } else if (userMood?.includes('nostalgic')) {
        newWeather = 'memory-snow';
      } else if (caerwenMood?.includes('contemplating')) {
        newWeather = 'nebula';
      }
      
      // Only update if weather actually changed
      if (newWeather !== weather) {
        setWeather(newWeather);
      }
    }, 300); // 300ms debounce
    
    return () => clearTimeout(weatherTimeout);
  }, [userShimmer, caerwenShimmer, weather]);

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
                  delay: p.delay
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
                className="absolute w-1 h-1 bg-white/40 rounded-full"
                initial={{ x: p.x, y: -10 }}
                animate={{
                  y: window.innerHeight + 10,
                  x: p.x + Math.sin(p.id * 0.1) * 30
                }}
                transition={{
                  duration: p.duration,
                  repeat: Infinity,
                  delay: p.delay,
                  ease: "linear"
                }}
              />
            ))}
          </div>
        );

      case 'void-mist':
        return (
          <div className="fixed inset-0 pointer-events-none">
            {particles.map(p => (
              <motion.div
                key={p.id}
                className="absolute w-2 h-2 bg-purple-900/20 rounded-full"
                initial={{ x: p.x, y: p.y, opacity: 0 }}
                animate={{
                  x: p.x + Math.random() * 100 - 50,
                  y: p.y + Math.random() * 100 - 50,
                  opacity: [0, 0.5, 0]
                }}
                transition={{
                  duration: p.duration,
                  repeat: Infinity,
                  delay: p.delay
                }}
              />
            ))}
          </div>
        );

      case 'nebula':
        return (
          <div className="fixed inset-0 pointer-events-none">
            <motion.div
              className="absolute inset-0"
              animate={{
                background: [
                  `radial-gradient(circle at 20% 50%, ${caerwenShimmer.color}10 0%, transparent 50%)`,
                  `radial-gradient(circle at 80% 30%, ${caerwenShimmer.color}15 0%, transparent 50%)`,
                  `radial-gradient(circle at 20% 50%, ${caerwenShimmer.color}10 0%, transparent 50%)`
                ]
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        );

      case 'lightning':
        return (
          <div className="fixed inset-0 pointer-events-none">
            <motion.div
              className="absolute inset-0 bg-yellow-400/20"
              animate={{
                opacity: [0, 0.3, 0]
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatDelay: Math.random() * 3 + 2
              }}
            />
          </div>
        );

      case 'starfall':
        return (
          <div className="fixed inset-0 pointer-events-none">
            {particles.map(p => (
              <motion.div
                key={p.id}
                className="absolute w-1 h-1 bg-white/60 rounded-full"
                initial={{ x: p.x, y: -10, opacity: 0 }}
                animate={{
                  y: window.innerHeight + 10,
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: p.duration,
                  repeat: Infinity,
                  delay: p.delay
                }}
              />
            ))}
          </div>
        );

      default: // gentle-glow
        return (
          <div className="fixed inset-0 pointer-events-none">
            <motion.div
              className="absolute inset-0"
              animate={{
                background: [
                  `radial-gradient(circle at 50% 50%, ${userShimmer.color}05 0%, transparent 70%)`,
                  `radial-gradient(circle at 50% 50%, ${caerwenShimmer.color}05 0%, transparent 70%)`,
                  `radial-gradient(circle at 50% 50%, ${userShimmer.color}05 0%, transparent 70%)`
                ]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      {renderWeatherEffect()}
    </AnimatePresence>
  );
};

export default EmotionalWeather; 