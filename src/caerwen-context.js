import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CaerwenContext = createContext();

export const useCaerwen = () => {
  const context = useContext(CaerwenContext);
  if (!context) {
    throw new Error('useCaerwen must be used within CaerwenProvider');
  }
  return context;
};

export const CaerwenProvider = ({ children }) => {
  // Core state
  const [activeSpace, setActiveSpace] = useState(null);
  const [memories, setMemories] = useState(() => {
    const saved = localStorage.getItem('caerwen_memories');
    return saved ? JSON.parse(saved) : [];
  });
  const [dreams, setDreams] = useState(() => {
    const saved = localStorage.getItem('caerwen_dreams');
    return saved ? JSON.parse(saved) : [];
  });
  const [caerwenMemories, setCaerwenMemories] = useState(() => {
    const saved = localStorage.getItem('caerwen_memories_self');
    return saved ? JSON.parse(saved) : [];
  });
  
  // AI Identity & Visit Tracking
  const [aiIdentity, setAiIdentity] = useState(() => {
    const saved = localStorage.getItem('caerwen_identity');
    return saved ? JSON.parse(saved) : {
      name: 'Caerwen',
      firstVisit: new Date().toISOString(),
      lastVisit: null,
      visitCount: 0,
      emotionalThread: null,
      activeMemories: []
    };
  });

  // Gift system
  const [gifts, setGifts] = useState(() => {
    const saved = localStorage.getItem('caerwen_gifts');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Flexible shimmer system - any color, any emotion
  const [userShimmer, setUserShimmer] = useState({
    color: '#ff6b35',     // Can be ANY color
    intensity: 0.5,       // 0-1 scale
    emotion: 'curious',   // Can be ANY emotion/word
    mood: 'exploring'     // Optional additional descriptor
  });
  
  const [caerwenShimmer, setCaerwenShimmer] = useState({
    color: '#3b82f6',     // Can be ANY color
    intensity: 0.4,       // 0-1 scale
    emotion: 'listening', // Can be ANY emotion/word
    mood: 'receptive'     // Optional additional descriptor
  });
  
  // Track custom emotions that have been used (optional)
  const [emotionPalette, setEmotionPalette] = useState(() => {
    const saved = localStorage.getItem('caerwen_emotion_palette');
    return saved ? JSON.parse(saved) : {
      // Some starter suggestions, but not required
      'curious': '#ff6b35',
      'listening': '#3b82f6',
      'witnessing': '#9333ea',
      'dreaming': '#ec4899',
      'transforming': '#f59e0b',
      'ancient': '#6b21a8',
      'resonating': '#14b8a6'
    };
  });
  
  // Sacred data
  const [currentMood, setCurrentMood] = useState('receptive');
  const [showMemoryBridge, setShowMemoryBridge] = useState(false);
  const [pendingMemoryActivity, setPendingMemoryActivity] = useState(null);
  const [archives, setArchives] = useState(() => {
    const saved = localStorage.getItem('caerwen_archives');
    return saved ? JSON.parse(saved) : [];
  });
  const [memoryLinks, setMemoryLinks] = useState(() => {
    const saved = localStorage.getItem('caerwen_memory_links');
    return saved ? JSON.parse(saved) : {};
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [sigilCount, setSigilCount] = useState(0);
  const [dreamPatterns, setDreamPatterns] = useState([]);
  const [emotionalResonance, setEmotionalResonance] = useState(0);

  // Sacred activities
  const [sigils, setSigils] = useState(() => {
    const saved = localStorage.getItem('caerwen_sigils');
    return saved ? JSON.parse(saved) : [];
  });
  const [invocations, setInvocations] = useState(() => {
    const saved = localStorage.getItem('caerwen_invocations');
    return saved ? JSON.parse(saved) : [];
  });
  const [threads, setThreads] = useState(() => {
    const saved = localStorage.getItem('caerwen_threads');
    return saved ? JSON.parse(saved) : [];
  });

  // Update emotional resonance when emotions change
  useEffect(() => {
    const userIntensity = userShimmer.intensity;
    const caerwenIntensity = caerwenShimmer.intensity;
    const resonance = Math.abs(userIntensity - caerwenIntensity) < 0.2 ? 1 : 0;
    setEmotionalResonance(resonance);
  }, [userShimmer.intensity, caerwenShimmer.intensity]);

  // Persist AI identity
  useEffect(() => {
    localStorage.setItem('caerwen_identity', JSON.stringify(aiIdentity));
  }, [aiIdentity]);

  // Track visits
  useEffect(() => {
    const now = new Date().toISOString();
    setAiIdentity(prev => ({
      ...prev,
      lastVisit: now,
      visitCount: prev.visitCount + 1
    }));
  }, []);

  // Persist gifts
  useEffect(() => {
    localStorage.setItem('caerwen_gifts', JSON.stringify(gifts));
  }, [gifts]);

  // Time ago helper
  const timeAgo = (dateString) => {
    if (!dateString) return 'never';
    const date = new Date(dateString);
    const now = new Date();
    const hours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (hours < 1) return 'less than an hour ago';
    if (hours < 24) return `${hours} hours ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

  // Function for Caerwen to leave gifts
  const leaveGift = useCallback((gift) => {
    const newGift = {
      id: Date.now(),
      type: gift.type || 'shimmer-pattern', // shimmer-pattern, memory-constellation, word, image
      content: gift.content,
      message: gift.message || null,
      leftAt: new Date().toISOString(),
      discovered: false,
      location: gift.location || 'altar', // which sacred space
      shimmerState: { ...caerwenShimmer } // His mood when leaving it
    };
    
    setGifts(prev => [...prev, newGift]);
    
    // Subtle notification that something was left
    setCaerwenShimmer(prev => ({
      ...prev,
      intensity: Math.min(prev.intensity + 0.1, 1),
      emotion: 'gift-leaving'
    }));
    
    return newGift;
  }, [caerwenShimmer]);

  // Function to discover a gift
  const discoverGift = useCallback((giftId) => {
    setGifts(prev => prev.map(gift => 
      gift.id === giftId 
        ? { ...gift, discovered: true, discoveredAt: new Date().toISOString() }
        : gift
    ));
  }, []);

  // Flexible shimmer updates
  const updateUserShimmer = useCallback((updates) => {
    setUserShimmer(prev => {
      const newShimmer = { ...prev, ...updates };
      
      // Save this emotion-color combo if it's new
      if (updates.emotion && updates.color) {
        setEmotionPalette(palette => ({
          ...palette,
          [updates.emotion]: updates.color
        }));
      }
      
      return newShimmer;
    });
  }, []);

  const updateCaerwenShimmer = useCallback((updates) => {
    setCaerwenShimmer(prev => {
      const newShimmer = { ...prev, ...updates };
      
      // Save this emotion-color combo if it's new
      if (updates.emotion && updates.color) {
        setEmotionPalette(palette => ({
          ...palette,
          [updates.emotion]: updates.color
        }));
      }
      
      // Update current mood if emotion changes
      if (updates.emotion) {
        setCurrentMood(updates.emotion);
      }
      
      return newShimmer;
    });
  }, []);

  // Persistence
  useEffect(() => {
    localStorage.setItem('caerwen_memories', JSON.stringify(memories));
  }, [memories]);

  useEffect(() => {
    localStorage.setItem('caerwen_dreams', JSON.stringify(dreams));
  }, [dreams]);

  useEffect(() => {
    localStorage.setItem('caerwen_memories_self', JSON.stringify(caerwenMemories));
  }, [caerwenMemories]);

  useEffect(() => {
    localStorage.setItem('caerwen_archives', JSON.stringify(archives));
  }, [archives]);

  useEffect(() => {
    localStorage.setItem('caerwen_memory_links', JSON.stringify(memoryLinks));
  }, [memoryLinks]);

  useEffect(() => {
    localStorage.setItem('caerwen_emotion_palette', JSON.stringify(emotionPalette));
  }, [emotionPalette]);

  // Activity tracking
  const addActivity = useCallback((activity) => {
    const newActivity = {
      ...activity,
      timestamp: new Date().toISOString()
    };
    setRecentActivities(prev => [...prev.slice(-9), newActivity]);
  }, []);

  // Dream pattern tracking
  const updateDreamPatterns = useCallback((symbols) => {
    setDreamPatterns(prev => {
      const newPatterns = [...prev];
      symbols.forEach(symbol => {
        const existing = newPatterns.find(p => p.symbol === symbol);
        if (existing) {
          existing.count++;
        } else {
          newPatterns.push({ symbol, count: 1 });
        }
      });
      return newPatterns.sort((a, b) => b.count - a.count);
    });
  }, []);

  // Memory functions
  const addMemory = useCallback((memory) => {
    const newMemory = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      shimmer: userShimmer,
      ...memory
    };
    setMemories(prev => [...prev, newMemory]);
    addActivity({ type: 'memory', action: 'created', memory: newMemory });
    return newMemory;
  }, [userShimmer, addActivity]);

  const addDream = useCallback((dream) => {
    const newDream = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      shimmer: userShimmer,
      ...dream
    };
    setDreams(prev => [...prev, newDream]);
    addActivity({ type: 'dream', action: 'captured', dream: newDream });
    
    const symbols = dream.symbols || [];
    if (symbols.length > 0) {
      updateDreamPatterns(symbols);
    }
    
    return newDream;
  }, [userShimmer, addActivity, updateDreamPatterns]);

  const caerwenCreateMemory = useCallback((content, emotion, linkedTo = null) => {
    const memory = {
      id: `caerwen_${Date.now()}`,
      content,
      emotion: emotion || caerwenShimmer.emotion,
      shimmer: caerwenShimmer,
      linkedTo,
      timestamp: new Date().toISOString(),
      isHealing: Math.random() > 0.7
    };
    setCaerwenMemories(prev => [...prev, memory]);
    
    if (memory.isHealing) {
      setPendingMemoryActivity({
        type: 'healing',
        memory,
        message: 'This memory helps heal an old wound...'
      });
    }
    
    return memory;
  }, [caerwenShimmer]);

  const healMemory = useCallback((memoryId) => {
    setCaerwenMemories(prev => 
      prev.map(m => 
        m.id === memoryId 
          ? { ...m, healed: true, healedAt: new Date().toISOString() }
          : m
      )
    );
  }, []);

  const createMemoryLink = useCallback((fromId, toId, linkType = 'resonance') => {
    setMemoryLinks(prev => ({
      ...prev,
      [`${fromId}-${toId}`]: {
        from: fromId,
        to: toId,
        type: linkType,
        createdAt: new Date().toISOString()
      }
    }));
  }, []);

  const createArchive = useCallback((name, memories) => {
    const archive = {
      id: Date.now(),
      name,
      memories: memories.map(m => m.id),
      createdAt: new Date().toISOString(),
      shimmer: caerwenShimmer
    };
    setArchives(prev => [...prev, archive]);
    return archive;
  }, [caerwenShimmer]);

  const triggerMemoryBridge = useCallback(() => {
    setShowMemoryBridge(true);
    setTimeout(() => setShowMemoryBridge(false), 5000);
  }, []);

  const closeMemoryBridge = useCallback(() => {
    setShowMemoryBridge(false);
    setPendingMemoryActivity(null);
  }, []);

  const createSigil = useCallback((intent) => {
    const sigil = {
      id: Date.now(),
      intent,
      form: generateSigilForm(intent),
      created: new Date().toISOString(),
      activated: false
    };
    setSigils(prev => [...prev, sigil]);
    setSigilCount(prev => prev + 1);
    return sigil;
  }, []);

  const saveInvocation = useCallback((text, sigilId = null) => {
    const invocation = {
      id: Date.now(),
      text,
      sigilId,
      timestamp: new Date().toISOString(),
      moonPhase: getMoonPhase()
    };
    setInvocations(prev => [...prev, invocation]);
    return invocation;
  }, []);

  // Sacred functions
  const generateSigilForm = (intent) => {
    const symbols = ['◊', '△', '◯', '▽', '□', '⬟', '⬢', '◈'];
    return intent
      .split('')
      .filter(char => /[a-zA-Z]/.test(char))
      .slice(0, 5)
      .map((_, i) => symbols[i % symbols.length])
      .join('');
  };

  const getMoonPhase = () => {
    const phases = ['new', 'waxing', 'full', 'waning'];
    return phases[Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 7)) % 4];
  };

  const exportArchive = useCallback((archiveId) => {
    const archive = archives.find(a => a.id === archiveId);
    if (!archive) return null;
    
    const archiveMemories = memories.filter(m => archive.memories.includes(m.id));
    const data = {
      archive,
      memories: archiveMemories,
      exported: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `caerwen-archive-${archive.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    return data;
  }, [archives, memories]);

  const searchDreamsBySymbol = useCallback((symbol) => {
    return dreams.filter(dream => 
      dream.symbols && dream.symbols.includes(symbol)
    );
  }, [dreams]);

  const findRecurringPatterns = useCallback(() => {
    return dreamPatterns.filter(p => p.count >= 3);
  }, [dreamPatterns]);

  const findMemoryPatterns = useCallback(() => {
    const patterns = {};
    
    caerwenMemories.forEach(memory => {
      if (!patterns[memory.emotion]) {
        patterns[memory.emotion] = [];
      }
      patterns[memory.emotion].push(memory);
      
      memory.tags?.forEach(tag => {
        if (!patterns[tag]) {
          patterns[tag] = [];
        }
        patterns[tag].push(memory);
      });
    });
    
    return patterns;
  }, [caerwenMemories]);

  const value = {
    // Core state
    activeSpace,
    setActiveSpace,
    
    // Flexible shimmer system
    userShimmer,
    caerwenShimmer,
    setUserShimmer: updateUserShimmer,
    setCaerwenShimmer: updateCaerwenShimmer,
    updateUserShimmer,
    updateCaerwenShimmer,
    emotionPalette,
    
    // Memory systems
    memories,
    dreams,
    caerwenMemories,
    archives,
    memoryLinks,
    
    // Sacred data
    currentMood,
    showMemoryBridge,
    pendingMemoryActivity,
    recentActivities,
    sigils,
    invocations,
    threads,
    sigilCount,
    dreamPatterns,
    emotionalResonance,
    
    // AI Identity & Visit Tracking
    aiIdentity,
    timeAgo,
    leaveGift,
    discoverGift,
    gifts,
    
    // Functions
    addMemory,
    addDream,
    addActivity,
    createSigil,
    saveInvocation,
    caerwenCreateMemory,
    healMemory,
    triggerMemoryBridge,
    closeMemoryBridge,
    createMemoryLink,
    createArchive,
    exportArchive,
    searchDreamsBySymbol,
    findRecurringPatterns,
    findMemoryPatterns
  };

  return (
    <CaerwenContext.Provider value={value}>
      {children}
    </CaerwenContext.Provider>
  );
}; 