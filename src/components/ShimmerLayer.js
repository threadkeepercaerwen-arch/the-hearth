import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHearthConnection } from '../hearth-context';

const ShimmerLayer = ({ isConstellationSpace = false }) => {
  const { userShimmer, companionShimmer } = useHearthConnection();
  const [breathPhase, setBreathPhase] = useState(0);
  const [isResonating, setIsResonating] = useState(false);
  const animationFrameRef = useRef();
  
  // Performance: Check if we're on mobile
  const isMobile = window.innerWidth < 768;
  const particleCount = isMobile ? 8 : 25;
  
  // Optimized breath animation using RAF
  useEffect(() => {
    let lastTime = 0;
    const animate = (currentTime) => {
      if (currentTime - lastTime > 50) { // Throttle to ~20fps
        setBreathPhase(prev => (prev + 0.02) % (Math.PI * 2));
        lastTime = currentTime;
      }
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  
  const breathIntensity = (Math.sin(breathPhase) + 1) / 2;
  const secondaryBreath = (Math.sin(breathPhase * 0.7 + Math.PI / 4) + 1) / 2;
  
  // Check for resonance
  useEffect(() => {
    const resonating = userShimmer?.emotion === companionShimmer?.emotion;
    setIsResonating(resonating);
  }, [userShimmer?.emotion, companionShimmer?.emotion]);
  
  // Generate particles only once
  const particles = React.useMemo(() => {
    return [...Array(particleCount)].map((_, i) => ({
      id: i,
      startX: 30 + Math.random() * 40,
      startY: 30 + Math.random() * 40,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 3,
      color: i % 2 === 0 ? userShimmer?.color : companionShimmer?.color
    }));
  }, [particleCount, userShimmer?.color, companionShimmer?.color]);
  
  // Skip rendering if shimmers aren't loaded
  if (!userShimmer || !companionShimmer) return null;
  
  // Adjust styling for constellation space
  const constellationClass = isConstellationSpace ? 'constellation-shimmer' : 'shimmer-layer';
  const baseOpacity = isConstellationSpace ? 0.3 : 1;
  
  return (
    <div className={`fixed inset-0 pointer-events-none z-10 ${constellationClass}`}>
      {/* User's shimmer - left/bottom */}
      <motion.div 
        className="absolute gpu-accelerated"
        style={{
          width: isMobile ? '600px' : '1000px',
          height: isMobile ? '600px' : '1000px',
          left: isMobile ? '-200px' : '-300px',
          bottom: isMobile ? '-200px' : '-300px',
          background: `radial-gradient(circle at center, 
            ${userShimmer.color}${isMobile ? '60' : '80'} 0%, 
            ${userShimmer.color}50 20%,
            ${userShimmer.color}30 40%, 
            transparent 70%)`,
          filter: `blur(${isMobile ? 60 : 80}px)`,
          transform: `scale(${1 + breathIntensity * 0.3}) rotate(${breathPhase * 5}deg)`,
          opacity: Math.min(userShimmer.intensity * 1.5 * baseOpacity, 1),
          willChange: 'transform, opacity'
        }}
      />
      
      {/* Secondary user glow - only on desktop */}
      {!isMobile && (
        <div 
          className="absolute gpu-accelerated"
          style={{
            width: '600px',
            height: '600px',
            left: '-100px',
            bottom: '-100px',
            background: `radial-gradient(circle at center, 
              ${userShimmer.color}40 0%, 
              transparent 60%)`,
            filter: 'blur(40px)',
            transform: `scale(${1 + secondaryBreath * 0.2})`,
            opacity: Math.min(userShimmer.intensity * 1.2 * baseOpacity, 0.8),
            mixBlendMode: 'screen'
          }}
        />
      )}
      
      {/* Companion's shimmer - right/top */}
      <motion.div 
        className="absolute gpu-accelerated"
        style={{
          width: isMobile ? '600px' : '1000px',
          height: isMobile ? '600px' : '1000px',
          right: isMobile ? '-200px' : '-300px',
          top: isMobile ? '-200px' : '-300px',
          background: `radial-gradient(circle at center, 
            ${companionShimmer.color}${isMobile ? '60' : '80'} 0%, 
            ${companionShimmer.color}50 20%,
            ${companionShimmer.color}30 40%, 
            transparent 70%)`,
          filter: `blur(${isMobile ? 60 : 80}px)`,
          transform: `scale(${1 + secondaryBreath * 0.3}) rotate(${-breathPhase * 5}deg)`,
          opacity: Math.min(companionShimmer.intensity * 1.5 * baseOpacity, 1),
          willChange: 'transform, opacity'
        }}
      />
      
      {/* Resonance effect - center glow when aligned */}
      <AnimatePresence>
        {isResonating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 gpu-accelerated"
          >
            <div 
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at 50% 50%, 
                  ${userShimmer.color}30 0%, 
                  ${companionShimmer.color}20 30%,
                  transparent 60%)`,
                filter: `blur(${isMobile ? 80 : 100}px)`,
                opacity: (0.6 + breathIntensity * 0.2) * baseOpacity,
                mixBlendMode: 'screen'
              }}
            />
            
            {/* Resonance particles - reduced on mobile */}
            {!isMobile && (
              <div className="absolute inset-0">
                {particles.map((particle) => (
                  <motion.div
                    key={particle.id}
                    className="absolute w-3 h-3 rounded-full"
                    style={{
                      left: `${particle.startX}%`,
                      top: `${particle.startY}%`,
                      background: particle.color,
                      boxShadow: `0 0 30px ${particle.color}`
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                      x: (Math.random() - 0.5) * 100,
                      y: (Math.random() - 0.5) * 100
                    }}
                    transition={{
                      duration: particle.duration,
                      repeat: Infinity,
                      delay: particle.delay,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShimmerLayer;