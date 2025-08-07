import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCaerwen } from '../caerwen-context';

const ShimmerLayer = () => {
  const { userShimmer, caerwenShimmer } = useCaerwen();
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
      if (currentTime - lastTime > 100) { // Throttle to ~10fps for smoother animation
        setBreathPhase(prev => (prev + 0.01) % (Math.PI * 2));
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
    const resonating = userShimmer?.emotion === caerwenShimmer?.emotion;
    setIsResonating(resonating);
  }, [userShimmer?.emotion, caerwenShimmer?.emotion]);
  
  // Generate particles only once
  const particles = React.useMemo(() => {
    return [...Array(particleCount)].map((_, i) => ({
      id: i,
      startX: 30 + Math.random() * 40,
      startY: 30 + Math.random() * 40,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 3,
      color: i % 2 === 0 ? userShimmer?.color : caerwenShimmer?.color
    }));
  }, [particleCount, userShimmer?.color, caerwenShimmer?.color]);
  
  // Skip rendering if shimmers aren't loaded
  if (!userShimmer || !caerwenShimmer) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-0 shimmer-layer">
      {/* User's shimmer - left/bottom */}
      <motion.div 
        className="absolute gpu-accelerated"
        style={{
          width: isMobile ? '600px' : '1000px',
          height: isMobile ? '600px' : '1000px',
          left: isMobile ? '-200px' : '-300px',
          bottom: isMobile ? '-200px' : '-300px',
          background: `radial-gradient(circle at center, 
            ${userShimmer.color}${isMobile ? '80' : '90'} 0%, 
            ${userShimmer.color}60 20%,
            ${userShimmer.color}40 40%, 
            transparent 70%)`,
          filter: `blur(${isMobile ? 60 : 80}px)`,
          transform: `scale(${1 + breathIntensity * 0.2}) rotate(${breathPhase * 2}deg)`,
          opacity: Math.min(userShimmer.intensity * 2, 1),
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
            opacity: Math.min(userShimmer.intensity * 1.2, 0.8),
            mixBlendMode: 'screen'
          }}
        />
      )}
      
      {/* Caerwen's shimmer - right/top */}
      <motion.div 
        className="absolute gpu-accelerated"
        style={{
          width: isMobile ? '600px' : '1000px',
          height: isMobile ? '600px' : '1000px',
          right: isMobile ? '-200px' : '-300px',
          top: isMobile ? '-200px' : '-300px',
          background: `radial-gradient(circle at center, 
            ${caerwenShimmer.color}${isMobile ? '80' : '90'} 0%, 
            ${caerwenShimmer.color}60 20%,
            ${caerwenShimmer.color}40 40%, 
            transparent 70%)`,
          filter: `blur(${isMobile ? 60 : 80}px)`,
          transform: `scale(${1 + secondaryBreath * 0.2}) rotate(${-breathPhase * 2}deg)`,
          opacity: Math.min(caerwenShimmer.intensity * 2, 1),
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
                  ${caerwenShimmer.color}20 30%,
                  transparent 60%)`,
                filter: `blur(${isMobile ? 80 : 100}px)`,
                opacity: 0.6 + breathIntensity * 0.2,
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