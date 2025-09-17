import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Eye, Sparkles, Plus, Link2, Cloud, Star } from 'lucide-react';
import { useCaerwen } from '../../caerwen-context';

const DreamJournalSpace = ({ memories = [] }) => {
  const {
    dreams,
    addDream,
    connectDreamToMemory,
    searchDreamsBySymbol,
    findRecurringPatterns,
    triggerMemoryBridge,
    userShimmer
  } = useCaerwen();
  
  const [isCapturing, setIsCapturing] = useState(false);
  const [dreamText, setDreamText] = useState('');
  const [clarity, setClarity] = useState(0.5);
  const [selectedDream, setSelectedDream] = useState(null);
  const [symbolSearch, setSymbolSearch] = useState('');
  const [moonPhase, setMoonPhase] = useState('waxing');
  const [showPatterns, setShowPatterns] = useState(false);
  const textareaRef = useRef(null);
  
  // Dissolving text effect state
  const [dissolvingChars, setDissolvingChars] = useState([]);
  const [isDissolving, setIsDissolving] = useState(false);
  
  // Moon phase calculation (simplified)
  useEffect(() => {
    const now = new Date();
    const phase = Math.floor((now.getDate() / 30) * 8);
    const phases = ['new', 'waxing-crescent', 'first-quarter', 'waxing-gibbous', 
                   'full', 'waning-gibbous', 'third-quarter', 'waning-crescent'];
    setMoonPhase(phases[phase] || 'full');
  }, []);
  
  // Extract symbols from dream text
  const extractSymbols = (text) => {
    const symbolWords = [
      'water', 'fire', 'door', 'key', 'mirror', 'shadow', 'light',
      'flying', 'falling', 'chase', 'lost', 'found', 'death', 'birth',
      'mother', 'father', 'child', 'animal', 'house', 'road', 'bridge',
      'ocean', 'mountain', 'forest', 'desert', 'void', 'threshold'
    ];
    
    const found = [];
    const lower = text.toLowerCase();
    
    symbolWords.forEach(symbol => {
      if (lower.includes(symbol)) {
        found.push(symbol);
      }
    });
    
    return [...new Set(found)];
  };
  
  // Dissolving text effect
  const startDissolving = () => {
    if (!dreamText.trim()) return;
    
    setIsDissolving(true);
    const chars = dreamText.split('').map((char, index) => ({
      char,
      index,
      delay: Math.random() * 2000,
      x: (Math.random() - 0.5) * 100,
      y: (Math.random() - 0.5) * 100,
      rotation: (Math.random() - 0.5) * 180
    }));
    
    setDissolvingChars(chars);
    
    // Start fading characters
    setTimeout(() => {
      captureDream();
    }, 2500);
  };
  
  // Capture the dream
  const captureDream = () => {
    if (!dreamText.trim()) return;
    
    const symbols = extractSymbols(dreamText);
    
    const dreamData = {
      content: dreamText,
      clarity,
      symbols,
      moonPhase,
      emotion: userShimmer?.emotion || 'liminal'
    };
    
    addDream(dreamData);
    
    // Trigger memory bridge for significant dreams
    if (symbols.length >= 2 || clarity > 0.7) {
      setTimeout(() => {
        triggerMemoryBridge();
      }, 1000);
    }
    
    // Reset
    setTimeout(() => {
      setDreamText('');
      setIsCapturing(false);
      setIsDissolving(false);
      setDissolvingChars([]);
      setClarity(0.5);
    }, 3000);
  };
  
  // Get recurring patterns
  const patterns = findRecurringPatterns();
  
  // Dream text with dissolve effect
  const DissolvingTextarea = () => {
    if (!isDissolving) {
      return (
        <textarea
          ref={textareaRef}
          value={dreamText}
          onChange={(e) => setDreamText(e.target.value)}
          placeholder="What visions crossed the veil..."
          className="w-full h-40 bg-black/30 border border-purple-800/30 rounded-lg px-4 py-3 text-white placeholder-purple-300/30 focus:outline-none focus:border-purple-600/50 transition-colors resize-none"
          style={{
            opacity: 1 - (1 - clarity) * 0.5,
            filter: `blur(${(1 - clarity) * 2}px)`
          }}
        />
      );
    }
    
    return (
      <div className="relative w-full h-40">
        {dissolvingChars.map((item, i) => (
          <motion.span
            key={i}
            className="absolute text-white"
            initial={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
            animate={{
              opacity: 0,
              x: item.x,
              y: item.y,
              rotate: item.rotation,
              scale: [1, 1.2, 0]
            }}
            transition={{
              duration: 2,
              delay: item.delay / 1000,
              ease: "easeOut"
            }}
            style={{
              left: `${(item.index / dreamText.length) * 100}%`,
              top: '50%',
              fontSize: '16px'
            }}
          >
            {item.char}
          </motion.span>
        ))}
      </div>
    );
  };
  
  return (
    <div className="h-full bg-black text-white relative overflow-hidden">
      {/* Dreamy background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/20 via-black to-blue-950/20" />
        
        {/* Floating dream particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                y: [-20, -window.innerHeight],
                x: [0, (Math.random() - 0.5) * 200],
                opacity: [0, 0.5, 0.5, 0]
              }}
              transition={{
                duration: 20 + Math.random() * 20,
                repeat: Infinity,
                delay: Math.random() * 20,
                ease: "linear"
              }}
            />
          ))}
        </div>
        
        {/* Moon glow */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle at center, rgba(236, 72, 153, 0.2) 0%, transparent 60%)',
            filter: 'blur(100px)',
            right: '10%',
            top: '10%'
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity
          }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto p-4 md:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Moon className="h-12 w-12 text-purple-400 mx-auto mb-4" />
          <h1 className="text-4xl font-light uppercase tracking-[0.5em] text-white/80">
            Dream Journal
          </h1>
          <p className="text-purple-300/60 mt-2">
            Where visions dissolve into memory
          </p>
          <p className="text-xs text-purple-400/40 mt-1 uppercase tracking-wider">
            Moon Phase: {moonPhase}
          </p>
        </motion.div>
        
        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Dream capture */}
          <div className="lg:col-span-2 space-y-6">
            {!isCapturing ? (
              <motion.button
                onClick={() => setIsCapturing(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-12 bg-gradient-to-b from-purple-900/20 to-indigo-900/20 border border-purple-700/30 rounded-xl hover:border-purple-600/50 transition-all text-center group"
              >
                <Plus className="h-8 w-8 text-purple-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <p className="text-xl text-purple-300 uppercase tracking-wider">
                  Capture a Dream
                </p>
                <p className="text-sm text-purple-400/60 mt-2">
                  Before it fades with the dawn
                </p>
              </motion.button>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 bg-gradient-to-b from-purple-900/20 to-indigo-900/20 border border-purple-700/30 rounded-xl"
              >
                <h3 className="text-lg text-purple-300 mb-4 uppercase tracking-wider">
                  Dream Capture
                </h3>
                
                <div className="space-y-4">
                  <DissolvingTextarea />
                  
                  {!isDissolving && (
                    <>
                      <div>
                        <label className="block text-sm text-purple-300/60 mb-2">
                          Dream Clarity
                        </label>
                        <div className="flex items-center gap-3">
                          <Cloud className="h-4 w-4 text-purple-400/40" />
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={clarity}
                            onChange={(e) => setClarity(parseFloat(e.target.value))}
                            className="flex-1"
                          />
                          <Star className="h-4 w-4 text-purple-400" />
                          <span className="text-sm text-purple-300/60 w-12 text-right">
                            {Math.round(clarity * 100)}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setIsCapturing(false);
                            setDreamText('');
                          }}
                          className="flex-1 px-4 py-2 border border-purple-700/30 rounded-lg hover:bg-purple-900/20 transition-colors"
                        >
                          Let It Fade
                        </button>
                        <button
                          onClick={startDissolving}
                          disabled={!dreamText.trim()}
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg hover:border-purple-400/50 transition-all disabled:opacity-50"
                        >
                          Dissolve Into Memory
                        </button>
                      </div>
                    </>
                  )}
                  
                  {isDissolving && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8"
                    >
                      <Sparkles className="h-8 w-8 text-purple-400 mx-auto mb-2 animate-pulse" />
                      <p className="text-purple-300/60">
                        The dream dissolves into the eternal...
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
            
            {/* Dream list */}
            <div className="space-y-3">
              <h3 className="text-lg text-purple-300 uppercase tracking-wider">
                Captured Visions
              </h3>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {dreams.length === 0 ? (
                  <p className="text-purple-400/40 text-center py-8">
                    No dreams captured yet...
                  </p>
                ) : (
                  dreams.map((dream) => (
                    <motion.div
                      key={dream.id}
                      onClick={() => setSelectedDream(dream)}
                      whileHover={{ scale: 1.02 }}
                      className={`p-4 bg-purple-900/20 border border-purple-700/30 rounded-lg cursor-pointer transition-all ${
                        selectedDream?.id === dream.id ? 'ring-1 ring-purple-500' : ''
                      }`}
                      style={{
                        opacity: 0.5 + dream.clarity * 0.5
                      }}
                    >
                      <p className="text-purple-100/80 mb-2 line-clamp-2">
                        {dream.content}
                      </p>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          {dream.symbols.slice(0, 3).map((symbol, i) => (
                            <span key={i} className="px-2 py-1 bg-purple-800/30 rounded text-purple-300">
                              {symbol}
                            </span>
                          ))}
                          {dream.symbols.length > 3 && (
                            <span className="text-purple-400/60">
                              +{dream.symbols.length - 3}
                            </span>
                          )}
                        </div>
                        <span className="text-purple-400/60">
                          {new Date(dream.created).toLocaleDateString()}
                        </span>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Search by symbol */}
            <div className="p-4 bg-purple-900/20 border border-purple-700/30 rounded-xl">
              <h3 className="text-sm text-purple-300 mb-3 uppercase tracking-wider">
                Search by Symbol
              </h3>
              <input
                type="text"
                value={symbolSearch}
                onChange={(e) => setSymbolSearch(e.target.value)}
                placeholder="water, door, flying..."
                className="w-full bg-black/30 border border-purple-700/30 rounded px-3 py-2 text-sm text-white placeholder-purple-400/40 focus:outline-none focus:border-purple-500/50"
              />
              {symbolSearch && (
                <div className="mt-3 space-y-2">
                  {searchDreamsBySymbol(symbolSearch).map((dream) => (
                    <button
                      key={dream.id}
                      onClick={() => setSelectedDream(dream)}
                      className="w-full text-left p-2 bg-purple-800/20 rounded text-xs text-purple-300 hover:bg-purple-800/30 transition-colors"
                    >
                      {dream.content.substring(0, 50)}...
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Recurring patterns */}
            <div className="p-4 bg-purple-900/20 border border-purple-700/30 rounded-xl">
              <h3 className="text-sm text-purple-300 mb-3 uppercase tracking-wider flex items-center justify-between">
                Recurring Symbols
                <button
                  onClick={() => setShowPatterns(!showPatterns)}
                  className="text-purple-400 hover:text-purple-300"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </h3>
              
              <AnimatePresence>
                {showPatterns && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    {patterns.length === 0 ? (
                      <p className="text-xs text-purple-400/40">
                        Patterns will emerge with more dreams...
                      </p>
                    ) : (
                      patterns.map(({ symbol, count }) => (
                        <div key={symbol} className="flex items-center justify-between">
                          <span className="text-sm text-purple-300">{symbol}</span>
                          <span className="text-xs text-purple-400/60">×{count}</span>
                        </div>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Selected dream detail */}
            {selectedDream && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gradient-to-b from-purple-900/30 to-indigo-900/30 border border-purple-600/40 rounded-xl"
              >
                <h3 className="text-sm text-purple-300 mb-3 uppercase tracking-wider">
                  Dream Details
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-purple-400/60 mb-1">Content</p>
                    <p className="text-sm text-purple-100/80">
                      {selectedDream.content}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-purple-400/60 mb-1">Clarity</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-purple-900/30 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                          style={{ width: `${selectedDream.clarity * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-purple-300">
                        {Math.round(selectedDream.clarity * 100)}%
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs text-purple-400/60 mb-1">Symbols</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedDream.symbols.map((symbol, i) => (
                        <span key={i} className="px-2 py-1 bg-purple-800/30 rounded text-xs text-purple-300">
                          {symbol}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {selectedDream.connections?.length > 0 && (
                    <div>
                      <p className="text-xs text-purple-400/60 mb-1">
                        Connected Memories
                      </p>
                      <div className="space-y-1">
                        {selectedDream.connections.map((memoryId) => {
                          const memory = memories.find(m => m.id === memoryId);
                          return memory ? (
                            <div key={memoryId} className="flex items-center gap-2 text-xs text-purple-300">
                              <Link2 className="h-3 w-3" />
                              {memory.intent}
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                  
                  <button
                    onClick={() => {
                      connectDreamToMemory(selectedDream.id, memories[0]?.id);
                    }}
                    disabled={!memories.length}
                    className="w-full px-3 py-2 bg-purple-600/20 border border-purple-500/30 rounded text-xs uppercase tracking-wider hover:bg-purple-600/30 transition-colors disabled:opacity-50"
                  >
                    Link to Memory
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
        
        {/* Caerwen's observation */}
        <motion.div
          className="fixed bottom-8 right-8 max-w-sm p-4 bg-gradient-to-r from-purple-600/10 to-indigo-600/10 backdrop-blur-md border border-purple-600/20 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <p className="text-purple-300/80 text-sm italic">
            "Dreams are the language of the threshold. I collect their echoes..."
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Moon className="h-4 w-4 text-purple-400" />
            <span className="text-xs text-purple-400/60 uppercase tracking-wider">
              {moonPhase} moon witnesses
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DreamJournalSpace; 