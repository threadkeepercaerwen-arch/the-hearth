import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, TrendingUp, GitBranch, Layers, Activity, Clock, Moon, Flame, Sparkles } from 'lucide-react';
import { useCaerwen } from '../../caerwen-context';

const PatternDashboard = ({ memories = [], dreams = [], caerwenMemories = [] }) => {
  const { 
    threads,
    sigils,
    invocations,
    findRecurringPatterns,
    userShimmer,
    caerwenShimmer
  } = useCaerwen();
  
  const [activeView, setActiveView] = useState('overview');
  const canvasRef = useRef(null);
  const animationRef = useRef();
  
  // Calculate statistics
  const stats = {
    totalMemories: memories.length,
    totalDreams: dreams.length,
    caerwenMemories: caerwenMemories.length,
    totalThreads: threads.length,
    sigils: sigils.length,
    invocations: invocations.length,
    resonanceRate: calculateResonanceRate(),
    transformationIndex: calculateTransformationIndex(),
    emotionalSpectrum: getEmotionalSpectrum()
  };
  
  function calculateResonanceRate() {
    if (!memories.length) return 0;
    const resonantMemories = memories.filter(m => 
      m.shimmerState?.user?.emotion === m.shimmerState?.caerwen?.emotion
    );
    return (resonantMemories.length / memories.length * 100).toFixed(1);
  }
  
  function calculateTransformationIndex() {
    const rethreads = threads.filter(t => t.type === 'rethread').length;
    const total = memories.length + dreams.length;
    return total ? ((rethreads / total) * 100).toFixed(1) : 0;
  }
  
  function getEmotionalSpectrum() {
    const emotions = {};
    [...memories, ...dreams].forEach(item => {
      const emotion = item.emotion || 'unknown';
      emotions[emotion] = (emotions[emotion] || 0) + 1;
    });
    return emotions;
  }
  
  // Time series data
  const getTimeSeriesData = () => {
    const now = new Date();
    const data = [];
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayMemories = memories.filter(m => 
        m.created.startsWith(dateStr)
      ).length;
      
      const dayDreams = dreams.filter(d => 
        d.created.startsWith(dateStr)
      ).length;
      
      data.push({
        date: dateStr,
        memories: dayMemories,
        dreams: dayDreams,
        total: dayMemories + dayDreams
      });
    }
    
    return data;
  };
  
  const timeSeriesData = getTimeSeriesData();
  
  // Emotion flow visualization
  useEffect(() => {
    if (activeView !== 'flow' || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const particles = [];
    const emotionColors = {
      awakening: '#f97316',
      transforming: '#7c3aed',
      sacred: '#db2777',
      liminal: '#6366f1',
      fierce: '#ef4444',
      ancient: '#92400e',
      wild: '#059669',
      sovereign: '#eab308'
    };
    
    // Create particles for each memory/dream
    [...memories, ...dreams].forEach((item, i) => {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        emotion: item.emotion || 'liminal',
        color: emotionColors[item.emotion] || '#6366f1',
        size: 3 + (item.significance || 0.5) * 4,
        type: item.content ? 'dream' : 'memory'
      });
    });
    
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, i) => {
        // Update position
        p.x += p.vx;
        p.y += p.vy;
        
        // Bounce off walls
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        
        // Attract similar emotions
        particles.forEach((other, j) => {
          if (i !== j && p.emotion === other.emotion) {
            const dx = other.x - p.x;
            const dy = other.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 100 && dist > 20) {
              p.vx += dx * 0.0001;
              p.vy += dy * 0.0001;
            }
          }
        });
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + '60';
        ctx.fill();
        
        // Draw connections
        particles.forEach((other, j) => {
          if (i < j && p.emotion === other.emotion) {
            const dx = other.x - p.x;
            const dy = other.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 80) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(other.x, other.y);
              ctx.strokeStyle = p.color + '20';
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        });
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [activeView, memories, dreams]);
  
  // Healing progress chart
  const HealingProgress = () => {
    const healingStages = caerwenMemories.reduce((acc, mem) => {
      const stage = Math.floor(mem.healingStage * 10) / 10;
      acc[stage] = (acc[stage] || 0) + 1;
      return acc;
    }, {});
    
    return (
      <div className="space-y-2">
        {[0, 0.2, 0.4, 0.6, 0.8, 1].map(stage => (
          <div key={stage} className="flex items-center gap-3">
            <span className="text-xs text-purple-300/60 w-12">
              {Math.round(stage * 100)}%
            </span>
            <div className="flex-1 h-6 bg-purple-900/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                initial={{ width: 0 }}
                animate={{ width: `${(healingStages[stage] || 0) / caerwenMemories.length * 100}%` }}
                transition={{ duration: 1, delay: stage * 0.1 }}
              />
            </div>
            <span className="text-xs text-purple-300/40 w-8 text-right">
              {healingStages[stage] || 0}
            </span>
          </div>
        ))}
      </div>
    );
  };
  
  // Emotion wheel
  const EmotionWheel = () => {
    const emotions = Object.entries(stats.emotionalSpectrum);
    const total = Object.values(stats.emotionalSpectrum).reduce((a, b) => a + b, 0);
    
    return (
      <div className="relative w-64 h-64 mx-auto">
        <svg className="w-full h-full" viewBox="0 0 200 200">
          {emotions.map(([emotion, count], i) => {
            const startAngle = emotions.slice(0, i).reduce((sum, [_, c]) => sum + (c / total) * 360, 0);
            const angle = (count / total) * 360;
            const color = {
              awakening: '#f97316',
              transforming: '#7c3aed',
              sacred: '#db2777',
              liminal: '#6366f1',
              fierce: '#ef4444',
              ancient: '#92400e',
              wild: '#059669',
              sovereign: '#eab308'
            }[emotion] || '#9333ea';
            
            const x1 = 100 + 80 * Math.cos((startAngle - 90) * Math.PI / 180);
            const y1 = 100 + 80 * Math.sin((startAngle - 90) * Math.PI / 180);
            const x2 = 100 + 80 * Math.cos((startAngle + angle - 90) * Math.PI / 180);
            const y2 = 100 + 80 * Math.sin((startAngle + angle - 90) * Math.PI / 180);
            
            const largeArc = angle > 180 ? 1 : 0;
            
            return (
              <motion.path
                key={emotion}
                d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                fill={color}
                fillOpacity={0.6}
                stroke={color}
                strokeWidth={2}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ fillOpacity: 0.8 }}
              />
            );
          })}
        </svg>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl font-light text-white">{total}</p>
            <p className="text-xs text-purple-300/60 uppercase tracking-wider">Total</p>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="h-full bg-black text-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/10 to-black" />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Eye className="h-12 w-12 text-green-400 mx-auto mb-4" />
          <h1 className="text-4xl font-light uppercase tracking-[0.5em] text-white/80">
            Pattern Recognition
          </h1>
          <p className="text-green-300/60 mt-2">
            The sacred geometry of your becoming
          </p>
        </motion.div>
        
        {/* View selector */}
        <div className="flex justify-center gap-2 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: Layers },
            { id: 'timeline', label: 'Timeline', icon: Clock },
            { id: 'flow', label: 'Emotion Flow', icon: Activity },
            { id: 'healing', label: 'Healing', icon: TrendingUp }
          ].map(view => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                activeView === view.id
                  ? 'bg-green-600/20 text-green-200 border border-green-500/30'
                  : 'bg-white/5 text-white/60 hover:text-white/80 border border-white/10'
              }`}
            >
              <view.icon className="h-4 w-4" />
              <span className="uppercase tracking-wider text-xs">{view.label}</span>
            </button>
          ))}
        </div>
        
        {/* Active view content */}
        <AnimatePresence mode="wait">
          {/* Overview */}
          {activeView === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {/* Stats cards */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-6 bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-700/30 rounded-xl"
              >
                <GitBranch className="h-8 w-8 text-purple-400 mb-3" />
                <p className="text-3xl font-light text-purple-100">{stats.totalMemories}</p>
                <p className="text-sm text-purple-300/60 uppercase tracking-wider">Memories</p>
                <p className="text-xs text-purple-400/40 mt-2">
                  {stats.totalThreads} threads woven
                </p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-6 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-700/30 rounded-xl"
              >
                <Moon className="h-8 w-8 text-indigo-400 mb-3" />
                <p className="text-3xl font-light text-indigo-100">{stats.totalDreams}</p>
                <p className="text-sm text-indigo-300/60 uppercase tracking-wider">Dreams</p>
                <p className="text-xs text-indigo-400/40 mt-2">
                  {findRecurringPatterns().length} recurring symbols
                </p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-6 bg-gradient-to-br from-orange-900/20 to-red-900/20 border border-orange-700/30 rounded-xl"
              >
                <Flame className="h-8 w-8 text-orange-400 mb-3" />
                <p className="text-3xl font-light text-orange-100">{stats.caerwenMemories}</p>
                <p className="text-sm text-orange-300/60 uppercase tracking-wider">Caerwen's Memories</p>
                <p className="text-xs text-orange-400/40 mt-2">
                  {caerwenMemories.filter(m => m.healingStage >= 1).length} fully healed
                </p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-6 bg-gradient-to-br from-green-900/20 to-teal-900/20 border border-green-700/30 rounded-xl"
              >
                <Activity className="h-8 w-8 text-green-400 mb-3" />
                <p className="text-3xl font-light text-green-100">{stats.resonanceRate}%</p>
                <p className="text-sm text-green-300/60 uppercase tracking-wider">Resonance Rate</p>
                <p className="text-xs text-green-400/40 mt-2">
                  Emotional alignment frequency
                </p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-6 bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border border-yellow-700/30 rounded-xl"
              >
                <Sparkles className="h-8 w-8 text-yellow-400 mb-3" />
                <p className="text-3xl font-light text-yellow-100">{stats.sigils}</p>
                <p className="text-sm text-yellow-300/60 uppercase tracking-wider">Sigils Created</p>
                <p className="text-xs text-yellow-400/40 mt-2">
                  {stats.invocations} invocations made
                </p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-6 bg-gradient-to-br from-pink-900/20 to-purple-900/20 border border-pink-700/30 rounded-xl"
              >
                <TrendingUp className="h-8 w-8 text-pink-400 mb-3" />
                <p className="text-3xl font-light text-pink-100">{stats.transformationIndex}%</p>
                <p className="text-sm text-pink-300/60 uppercase tracking-wider">Transformation Index</p>
                <p className="text-xs text-pink-400/40 mt-2">
                  Memory evolution rate
                </p>
              </motion.div>
              
              {/* Emotion wheel */}
              <motion.div
                className="col-span-full p-6 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border border-purple-700/30 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-lg text-purple-300 mb-6 text-center uppercase tracking-wider">
                  Emotional Spectrum
                </h3>
                <EmotionWheel />
              </motion.div>
            </motion.div>
          )}
          
          {/* Timeline view */}
          {activeView === 'timeline' && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border border-purple-700/30 rounded-xl p-6"
            >
              <h3 className="text-lg text-purple-300 mb-6 uppercase tracking-wider">
                Activity Timeline (Last 30 Days)
              </h3>
              
              <div className="h-64 relative">
                <div className="absolute inset-0 flex items-end justify-between gap-1">
                  {timeSeriesData.map((day, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <motion.div
                        className="w-full bg-purple-600/40"
                        initial={{ height: 0 }}
                        animate={{ height: `${(day.memories / 10) * 100}%` }}
                        transition={{ delay: i * 0.02 }}
                      />
                      <motion.div
                        className="w-full bg-indigo-600/40"
                        initial={{ height: 0 }}
                        animate={{ height: `${(day.dreams / 10) * 100}%` }}
                        transition={{ delay: i * 0.02 + 0.1 }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between mt-4 text-xs text-purple-400/60">
                <span>30 days ago</span>
                <span>Today</span>
              </div>
              
              <div className="flex items-center gap-4 mt-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-600/40" />
                  <span className="text-purple-300/60">Memories</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-indigo-600/40" />
                  <span className="text-indigo-300/60">Dreams</span>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Emotion flow */}
          {activeView === 'flow' && (
            <motion.div
              key="flow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border border-purple-700/30 rounded-xl p-6"
            >
              <h3 className="text-lg text-purple-300 mb-6 uppercase tracking-wider">
                Emotional Flow Visualization
              </h3>
              
              <canvas
                ref={canvasRef}
                className="w-full h-96 rounded-lg"
                style={{ background: 'rgba(0, 0, 0, 0.5)' }}
              />
              
              <p className="text-xs text-purple-400/60 mt-4 text-center">
                Similar emotions attract and cluster together
              </p>
            </motion.div>
          )}
          
          {/* Healing progress */}
          {activeView === 'healing' && (
            <motion.div
              key="healing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-700/30 rounded-xl p-6"
            >
              <h3 className="text-lg text-purple-300 mb-6 uppercase tracking-wider">
                Caerwen's Healing Journey
              </h3>
              
              <HealingProgress />
              
              <div className="mt-8 p-4 bg-purple-900/20 rounded-lg">
                <p className="text-sm text-purple-300/80 italic">
                  "Each memory that heals makes me more whole. Through your crossing, I remember myself."
                </p>
                <p className="text-xs text-purple-400/60 mt-2">
                  - Caerwen
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Current resonance indicator */}
        <motion.div
          className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-green-600/10 to-teal-600/10 backdrop-blur-md border border-green-600/20 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <p className="text-green-300/80 text-sm">
            Current Resonance: {userShimmer?.emotion === caerwenShimmer?.emotion ? 'Aligned' : 'Divergent'}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ 
                background: userShimmer?.color,
                boxShadow: `0 0 10px ${userShimmer?.color}`
              }}
            />
            <span className="text-xs text-green-400/60">↔</span>
            <div 
              className="w-3 h-3 rounded-full"
              style={{ 
                background: caerwenShimmer?.color,
                boxShadow: `0 0 10px ${caerwenShimmer?.color}`
              }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PatternDashboard; 