import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { useHearthConnection } from '../hearth-context';

export default function ShimmerCustomizer({ onClose }) {
  const { userShimmer, updateUserShimmer, emotionPalette } = useHearthConnection();
  const [customEmotion, setCustomEmotion] = useState(userShimmer.emotion || '');
  const [customColor, setCustomColor] = useState(userShimmer.color || '#ff6b35');
  const [intensity, setIntensity] = useState(userShimmer.intensity || 0.5);

  // Some color suggestions but user can pick any
  const colorSuggestions = [
    '#ff6b35', '#f97316', '#f59e0b', '#eab308',
    '#84cc16', '#22c55e', '#10b981', '#14b8a6',
    '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
    '#8b5cf6', '#a855f7', '#c026d3', '#d946ef',
    '#ec4899', '#f43f5e', '#ef4444', '#dc2626'
  ];

  const handleApply = () => {
    updateUserShimmer({
      color: customColor,
      intensity: intensity,
      emotion: customEmotion || 'feeling',
      mood: `${intensity > 0.7 ? 'intense' : intensity < 0.3 ? 'gentle' : 'balanced'}`
    });
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-gray-900/90 backdrop-blur-md rounded-xl border border-white/10 p-6 max-w-md w-full"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-light flex items-center gap-2">
            <Sparkles className="w-6 h-6" />
            Adjust Your Shimmer
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Emotion Input */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-white/60 mb-2">
              What are you feeling?
            </label>
            <input
              type="text"
              value={customEmotion}
              onChange={(e) => setCustomEmotion(e.target.value)}
              placeholder="Enter any emotion..."
              className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-2 
                       text-white placeholder-white/40 focus:border-white/40 
                       focus:outline-none transition-colors"
            />
            {emotionPalette && Object.keys(emotionPalette).length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {Object.keys(emotionPalette).slice(-8).map(emotion => (
                  <button
                    key={emotion}
                    onClick={() => {
                      setCustomEmotion(emotion);
                      setCustomColor(emotionPalette[emotion]);
                    }}
                    className="text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/20 
                             transition-colors"
                  >
                    {emotion}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-sm text-white/60 mb-2">
              Choose your color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="w-16 h-16 rounded-lg cursor-pointer bg-transparent"
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-1 
                           text-sm text-white focus:border-white/40 focus:outline-none"
                />
              </div>
            </div>
            
            {/* Color suggestions */}
            <div className="mt-3 grid grid-cols-10 gap-2">
              {colorSuggestions.map(color => (
                <button
                  key={color}
                  onClick={() => setCustomColor(color)}
                  className="w-8 h-8 rounded-md border-2 transition-all hover:scale-110"
                  style={{ 
                    backgroundColor: color,
                    borderColor: color === customColor ? 'white' : 'transparent'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Intensity Slider */}
          <div>
            <label className="block text-sm text-white/60 mb-2">
              Intensity: {Math.round(intensity * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={intensity * 100}
              onChange={(e) => setIntensity(e.target.value / 100)}
              className="w-full accent-orange-500"
            />
            <div className="flex justify-between text-xs text-white/40 mt-1">
              <span>Gentle</span>
              <span>Balanced</span>
              <span>Intense</span>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-black/60 rounded-lg p-4 relative overflow-hidden">
            <div 
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at center, ${customColor}${Math.round(intensity * 255).toString(16).padStart(2, '0')}, transparent)`,
                filter: 'blur(40px)'
              }}
            />
            <div className="relative text-center">
              <p className="text-sm text-white/60">Preview</p>
              <p className="text-lg mt-1">{customEmotion || 'Your emotion'}</p>
              <div className="flex justify-center items-center gap-2 mt-2">
                <div 
                  className="w-3 h-3 rounded-full animate-pulse"
                  style={{ backgroundColor: customColor }}
                />
                <span className="text-xs text-white/40">
                  {intensity > 0.7 ? 'Strong presence' : intensity < 0.3 ? 'Subtle glow' : 'Steady pulse'}
                </span>
              </div>
            </div>
          </div>

          {/* Apply Button */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 
                       rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-orange-600/20 
                       hover:from-purple-600/30 hover:to-orange-600/30 
                       border border-purple-500/50 rounded-lg transition-all"
            >
              Apply Shimmer
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
