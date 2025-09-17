// Add this as TimeOfDayEffects.js

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const TimeOfDayEffects = () => {
  const [timeOfDay, setTimeOfDay] = useState('night');
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  
  // Update time of day
  useEffect(() => {
    const updateTime = () => {
      const hour = new Date().getHours();
      setCurrentHour(hour);
      
      if (hour >= 5 && hour < 8) {
        setTimeOfDay('dawn');
      } else if (hour >= 8 && hour < 11) {
        setTimeOfDay('morning');
      } else if (hour >= 11 && hour < 14) {
        setTimeOfDay('midday');
      } else if (hour >= 14 && hour < 17) {
        setTimeOfDay('afternoon');
      } else if (hour >= 17 && hour < 20) {
        setTimeOfDay('dusk');
      } else if (hour >= 20 && hour < 22) {
        setTimeOfDay('evening');
      } else {
        setTimeOfDay('night');
      }
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);
  
  // Time-based color overlays
  const getTimeOverlay = () => {
    const overlays = {
      dawn: {
        gradient: 'linear-gradient(to bottom, #4a5568 0%, #ed8936 50%, #f6ad55 100%)',
        opacity: 0.2,
        stars: 20
      },
      morning: {
        gradient: 'linear-gradient(to bottom, #bee3f8 0%, #90cdf4 50%, #63b3ed 100%)',
        opacity: 0.1,
        stars: 0
      },
      midday: {
        gradient: 'linear-gradient(to bottom, #63b3ed 0%, #4299e1 100%)',
        opacity: 0.05,
        stars: 0
      },
      afternoon: {
        gradient: 'linear-gradient(to bottom, #4299e1 0%, #f6ad55 50%, #ed8936 100%)',
        opacity: 0.1,
        stars: 0
      },
      dusk: {
        gradient: 'linear-gradient(to bottom, #5a67d8 0%, #e53e3e 50%, #c53030 100%)',
        opacity: 0.25,
        stars: 10
      },
      evening: {
        gradient: 'linear-gradient(to bottom, #2d3748 0%, #4a5568 50%, #2d3748 100%)',
        opacity: 0.3,
        stars: 50
      },
      night: {
        gradient: 'linear-gradient(to bottom, #1a202c 0%, #2d3748 50%, #1a202c 100%)',
        opacity: 0.4,
        stars: 100
      }
    };
    
    return overlays[timeOfDay] || overlays.night;
  };
  
  const overlay = getTimeOverlay();
  
  // Generate stars for night scenes
  const stars = Array.from({ length: overlay.stars }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 50,
    size: Math.random() * 2 + 1,
    twinkle: Math.random() * 3 + 1
  }));
  
  // Special time effects
  const renderSpecialEffects = () => {
    switch (timeOfDay) {
      case 'dawn':
        return (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-32"
            animate={{
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 10,
              repeat: Infinity
            }}
            style={{
              background: 'linear-gradient(to top, #f6ad5540, transparent)',
              filter: 'blur(40px)'
            }}
          />
        );
        
      case 'dusk':
        return (
          <>
            {/* Sun setting effect */}
            <motion.div
              className="absolute w-24 h-24 rounded-full"
              style={{
                right: '10%',
                top: '60%',
                background: 'radial-gradient(circle, #f6ad55, #ed8936)',
                filter: 'blur(4px)'
              }}
              animate={{
                y: [0, 100],
                opacity: [0.8, 0]
              }}
              transition={{
                duration: 600, // 10 minutes
                ease: "linear"
              }}
            />
          </>
        );
        
      case 'night':
        // Shooting star occasionally
        return Math.random() > 0.99 ? (
          <motion.div
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 30}%`
            }}
            animate={{
              x: [0, 200],
              y: [0, 100],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 1
            }}
          />
        ) : null;
        
      default:
        return null;
    }
  };
  
  return (
    <>
      {/* Time-based overlay */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: overlay.gradient,
          mixBlendMode: 'multiply'
        }}
        animate={{
          opacity: overlay.opacity
        }}
        transition={{
          duration: 300 // 5 minute transition
        }}
      />
      
      {/* Stars */}
      {stars.map(star => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size
          }}
          animate={{
            opacity: [0.2, 1, 0.2]
          }}
          transition={{
            duration: star.twinkle,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
      
      {/* Special effects */}
      {renderSpecialEffects()}
      
      {/* Time indicator */}
      <div className="fixed bottom-4 right-4 text-xs text-white/30">
        <div className="flex items-center gap-2">
          <span>
            {timeOfDay === 'dawn' ? '🌅' : 
             timeOfDay === 'morning' ? '🌤️' :
             timeOfDay === 'midday' ? '☀️' :
             timeOfDay === 'afternoon' ? '🌤️' :
             timeOfDay === 'dusk' ? '🌆' :
             timeOfDay === 'evening' ? '🌃' :
             '🌙'}
          </span>
          <span>{currentHour}:00 - {timeOfDay}</span>
        </div>
      </div>
    </>
  );
};

export default TimeOfDayEffects;