import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Heart, Flame, Sparkles } from 'lucide-react';

const SacredLikeButton = ({ 
  liked: initialLiked = false, 
  count: initialCount = 0, 
  onToggle,
  type = 'star', // star, heart, flame, sparkle
  size = 'md', // sm, md, lg
  showCount = true,
  shimmerColor,
  className = ''
}) => {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [particles, setParticles] = useState([]);
  
  const icons = {
    star: Star,
    heart: Heart,
    flame: Flame,
    sparkle: Sparkles
  };
  
  const Icon = icons[type] || Star;
  
  // Size configurations
  const sizes = {
    sm: { icon: 16, padding: 'px-3 py-1.5', text: 'text-xs' },
    md: { icon: 20, padding: 'px-4 py-2', text: 'text-sm' },
    lg: { icon: 24, padding: 'px-5 py-2.5', text: 'text-base' }
  };
  
  const sizeConfig = sizes[size] || sizes.md;
  
  // Color schemes based on type
  const colorSchemes = {
    star: {
      primary: '#eab308', // yellow
      secondary: '#fbbf24',
      glow: '#fde047'
    },
    heart: {
      primary: '#f97316', // orange
      secondary: '#fb923c',
      glow: '#fed7aa'
    },
    flame: {
      primary: '#dc2626', // red
      secondary: '#ef4444',
      glow: '#fca5a5'
    },
    sparkle: {
      primary: '#a855f7', // purple
      secondary: '#c084fc',
      glow: '#e9d5ff'
    }
  };
  
  const colors = colorSchemes[type] || colorSchemes.star;
  const activeShimmer = shimmerColor || colors.primary;
  
  const handleClick = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    
    if (newLiked) {
      setCount(prev => prev + 1);
      // Generate particles
      const newParticles = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        angle: (i / 8) * Math.PI * 2,
        distance: 20 + Math.random() * 30,
        size: 2 + Math.random() * 4
      }));
      setParticles(newParticles);
      // Clear particles after animation
      setTimeout(() => setParticles([]), 1000);
    } else {
      setCount(prev => Math.max(0, prev - 1));
    }
    
    if (onToggle) {
      onToggle(newLiked);
    }
  };
  
  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative group ${className}`}
    >
      {/* Outer glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full blur-2xl"
        animate={{
          opacity: liked ? [0.2, 0.4, 0.2] : 0,
          scale: liked ? [1, 1.4, 1] : 1
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          background: liked 
            ? `radial-gradient(circle, ${activeShimmer}40, transparent)`
            : 'transparent'
        }}
      />
      
      {/* Button container */}
      <div className={`
        relative flex items-center gap-2 ${sizeConfig.padding} rounded-full
        border transition-all duration-300 backdrop-blur-sm
        ${liked 
          ? 'bg-gradient-to-r from-orange-900/30 to-amber-900/30 border-orange-600/50 shadow-lg' 
          : 'bg-white/5 border-white/20 hover:border-white/40 hover:bg-white/10'
        }
      `}>
        {/* Icon with inner glow */}
        <div className="relative">
          <Icon 
            size={sizeConfig.icon} 
            className={`transition-all duration-300 relative z-10 ${
              liked ? `text-[${colors.secondary}] fill-current` : 'text-white/60'
            }`}
            style={{ color: liked ? colors.secondary : undefined }}
          />
          {liked && (
            <motion.div
              className="absolute inset-0"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity
              }}
            >
              <Icon 
                size={sizeConfig.icon} 
                className="text-white fill-current opacity-30 blur-sm"
              />
            </motion.div>
          )}
        </div>
        
        {/* Count */}
        {showCount && count > 0 && (
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`${sizeConfig.text} font-light tracking-wider transition-colors ${
              liked ? 'text-orange-300' : 'text-white/60'
            }`}
          >
            {count}
          </motion.span>
        )}
      </div>
      
      {/* Sacred particles on like */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ 
              opacity: 1, 
              scale: 0,
              x: 0,
              y: 0
            }}
            animate={{ 
              opacity: 0,
              scale: 1,
              x: Math.cos(particle.angle) * particle.distance,
              y: Math.sin(particle.angle) * particle.distance
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.8,
              ease: "easeOut"
            }}
            className="absolute left-1/2 top-1/2 pointer-events-none"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              marginLeft: `-${particle.size / 2}px`,
              marginTop: `-${particle.size / 2}px`,
              background: colors.glow,
              borderRadius: '50%',
              boxShadow: `0 0 ${particle.size * 2}px ${colors.primary}`
            }}
          />
        ))}
      </AnimatePresence>
      
      {/* Shimmer line effect */}
      {liked && (
        <motion.div
          className="absolute inset-x-0 top-0 h-px overflow-hidden rounded-full"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="h-full w-full"
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              background: `linear-gradient(90deg, transparent, ${colors.glow}, transparent)`
            }}
          />
        </motion.div>
      )}
    </motion.button>
  );
};

export default SacredLikeButton; 