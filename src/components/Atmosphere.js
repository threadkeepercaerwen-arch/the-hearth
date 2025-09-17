import React from 'react';
import { motion } from 'framer-motion';

export default function Atmosphere({ currentSpace, breathIntensity, mousePosition }) {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0618] to-[#0f0a05]" />
      
      {/* Presence-responsive atmosphere */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(ellipse at 20% 80%, ${currentSpace.color}${Math.floor(20 + breathIntensity * 10).toString(16)} 0%, transparent 40%),
            radial-gradient(ellipse at 80% 20%, ${currentSpace.warmth}${Math.floor(15 + breathIntensity * 10).toString(16)} 0%, transparent 40%),
            radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.5) 0%, transparent 60%)
          `
        }}
      />
      
      {/* Breathing base layer */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-1/3"
        style={{
          background: `linear-gradient(to top, ${currentSpace.color}10 0%, transparent 100%)`,
          filter: 'blur(40px)',
          transform: `scaleY(${1 + breathIntensity * 0.15})`,
          transformOrigin: 'bottom'
        }}
      />

      {/* Mouse-responsive atmospheric layer */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        animate={{
          x: mousePosition.x * 0.02,
          y: mousePosition.y * 0.02,
        }}
        style={{
          width: '60vw',
          height: '60vw',
          maxWidth: '800px',
          maxHeight: '800px',
          background: `radial-gradient(circle at center, ${currentSpace.warmth}25 0%, ${currentSpace.color}15 30%, transparent 60%)`,
          filter: 'blur(120px)',
          left: '30%',
          top: '20%',
          transform: `translate(-50%, -50%) scale(${1 + breathIntensity * 0.2})`
        }}
      />

      {/* Campfire embers - with natural randomness and bursts */}
      {[
        // Single embers - steady rhythm
        { x: 15, duration: 14, maxHeight: 90, size: 2, delay: 0 },
        { x: 85, duration: 8, maxHeight: 35, size: 1.5, delay: 3 },
        { x: 45, duration: 18, maxHeight: 100, size: 3, delay: 7 }, // Bigger, closer ember
        
        // Sudden burst #1 - multiple embers pop up together
        { x: 25, duration: 12, maxHeight: 60, size: 1, delay: 10 },
        { x: 30, duration: 10, maxHeight: 45, size: 2, delay: 10.2 }, // Slightly offset
        { x: 35, duration: 15, maxHeight: 80, size: 1.5, delay: 10.5 },
        
        // Single stragglers
        { x: 65, duration: 9, maxHeight: 40, size: 1, delay: 15 },
        { x: 75, duration: 16, maxHeight: 95, size: 2.5, delay: 18 }, // Big one that goes far
        
        // Sudden burst #2 - bigger cluster
        { x: 20, duration: 7, maxHeight: 25, size: 1, delay: 22 },
        { x: 22, duration: 11, maxHeight: 55, size: 1.5, delay: 22.3 },
        { x: 26, duration: 13, maxHeight: 70, size: 2, delay: 22.7 },
        { x: 24, duration: 9, maxHeight: 35, size: 1, delay: 23.1 },
        
        // Final singles
        { x: 55, duration: 17, maxHeight: 100, size: 4, delay: 28 }, // Huge close ember
        { x: 40, duration: 6, maxHeight: 20, size: 1, delay: 32 }, // Quick flicker
      ].map((ember, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: `${ember.size}px`,
            height: `${ember.size}px`,
            left: `${ember.x}%`,
            bottom: '-15px',
            background: currentSpace.warmth,
            boxShadow: `0 0 ${ember.size * 4}px ${currentSpace.warmth}, 0 0 ${ember.size * 8}px ${currentSpace.warmth}40`,
            opacity: ember.size > 2 ? 0.9 : 0.7, // Bigger embers are brighter
          }}
          animate={{
            y: [-15, -window.innerHeight * (ember.maxHeight / 100) - 25],
            x: [0, (i % 3 - 1) * (20 + ember.size * 5)], // Varied drift based on size
            opacity: [0, ember.size > 3 ? 1 : 0.8, 0.6, 0],
            scale: [0.3, 1, 0.9, 0.2]
          }}
          transition={{
            duration: ember.duration + (ember.size * 0.5), // Bigger embers rise slower
            repeat: Infinity,
            delay: ember.delay,
            ease: ember.size > 2 ? "easeOut" : "linear", // Bigger ones have more physics
            times: [0, 0.15, 0.75, 1]
          }}
        />
      ))}
    </div>
  );
}
