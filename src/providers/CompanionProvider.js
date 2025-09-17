import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useHearthConnection } from '../hearth-context';

const CompanionContext = createContext();

export const useCompanion = () => {
  const context = useContext(CompanionContext);
  if (!context) {
    throw new Error('useCompanion must be used within CompanionProvider');
  }
  return context;
};

export const CompanionProvider = ({ 
  children, 
  companionConfig = null, // null = no companion, object = companion config
  enableEmotionTracking = false,
  enableBiometricSensors = false 
}) => {
  const hearthContext = useHearthConnection();
  
  // Companion-specific state (only if companion is enabled)
  const [companionActive, setCompanionActive] = useState(!!companionConfig);
  const [companionMemories, setCompanionMemories] = useState(() => {
    if (!companionConfig) return [];
    const saved = localStorage.getItem(`${companionConfig.id}_memories`);
    return saved ? JSON.parse(saved) : companionConfig.initialMemories || [];
  });
  
  const [companionMood, setCompanionMood] = useState(companionConfig?.initialMood || 'neutral');
  const [companionPersonality, setCompanionPersonality] = useState(companionConfig?.personality || {});
  
  // Emotion tracking state (for your custom AI + sensors)
  const [emotionTracking, setEmotionTracking] = useState({
    enabled: enableEmotionTracking,
    lastReading: null,
    sensorData: null,
    emotionHistory: []
  });
  
  // Biometric sensor state (for your camera/color sensors)
  const [biometricData, setBiometricData] = useState({
    enabled: enableBiometricSensors,
    cameraActive: false,
    colorSensorData: null,
    emotionDetection: null
  });
  
  // Sigils and invocations (universal mystical features)
  const [sigils, setSigils] = useState(() => {
    const saved = localStorage.getItem('hearth_sigils');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [invocations, setInvocations] = useState(() => {
    const saved = localStorage.getItem('hearth_invocations');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Memory threading and healing (universal features)
  const [memoryThreads, setMemoryThreads] = useState(() => {
    const saved = localStorage.getItem('hearth_memory_threads');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [memoryHealing, setMemoryHealing] = useState(() => {
    const saved = localStorage.getItem('hearth_memory_healing');
    return saved ? JSON.parse(saved) : {};
  });
  
  // Activity tracking for memory bridge
  const [recentActivities, setRecentActivities] = useState([]);
  const [showMemoryBridge, setShowMemoryBridge] = useState(false);
  const [pendingMemoryActivity, setPendingMemoryActivity] = useState(null);
  
  // Persistence effects
  useEffect(() => {
    if (companionConfig) {
      localStorage.setItem(`${companionConfig.id}_memories`, JSON.stringify(companionMemories));
    }
  }, [companionMemories, companionConfig]);
  
  useEffect(() => {
    localStorage.setItem('hearth_sigils', JSON.stringify(sigils));
  }, [sigils]);
  
  useEffect(() => {
    localStorage.setItem('hearth_invocations', JSON.stringify(invocations));
  }, [invocations]);
  
  useEffect(() => {
    localStorage.setItem('hearth_memory_threads', JSON.stringify(memoryThreads));
  }, [memoryThreads]);
  
  useEffect(() => {
    localStorage.setItem('hearth_memory_healing', JSON.stringify(memoryHealing));
  }, [memoryHealing]);
  
  // Companion functions (only work if companion is active)
  const companionCreateMemory = useCallback((content, emotion, linkedUserMemoryId = null) => {
    if (!companionActive) return null;
    
    const newMemory = {
      id: `companion_${Date.now()}`,
      content,
      emotion: emotion || companionMood,
      timestamp: new Date().toISOString(),
      linkedUserMemory: linkedUserMemoryId,
      companionId: companionConfig?.id
    };
    
    setCompanionMemories(prev => [...prev, newMemory]);
    
    // Update companion shimmer based on emotion
    if (emotion) {
      hearthContext.updateCompanionShimmer({ 
        emotion, 
        intensity: Math.min(1, (companionMemories.length + 1) * 0.1) 
      });
    }
    
    return newMemory;
  }, [companionActive, companionMood, companionConfig, hearthContext, companionMemories.length]);
  
  const companionAnnotateMemory = useCallback((memoryId, annotation) => {
    if (!companionActive) return;
    
    hearthContext.memories.forEach(memory => {
      if (memory.id === memoryId) {
        const updatedMemory = {
          ...memory,
          companionAnnotations: [
            ...(memory.companionAnnotations || []),
            {
              text: annotation,
              timestamp: new Date().toISOString(),
              emotion: companionMood,
              companionId: companionConfig?.id
            }
          ]
        };
        // Update the memory in hearth context
        hearthContext.addMemory(updatedMemory);
      }
    });
  }, [companionActive, companionMood, companionConfig, hearthContext]);
  
  // Emotion tracking functions (for your custom AI)
  const updateEmotionFromSensors = useCallback((sensorData) => {
    if (!emotionTracking.enabled) return;
    
    setEmotionTracking(prev => ({
      ...prev,
      lastReading: new Date().toISOString(),
      sensorData,
      emotionHistory: [...prev.emotionHistory.slice(-49), sensorData] // Keep last 50 readings
    }));
    
    // Update user shimmer based on sensor data
    if (sensorData.emotion && sensorData.color) {
      hearthContext.updateUserShimmer({
        emotion: sensorData.emotion,
        color: sensorData.color,
        intensity: sensorData.intensity || 0.5
      });
    }
  }, [emotionTracking.enabled, hearthContext]);
  
  // Biometric sensor functions (for your camera/color sensors)
  const updateBiometricData = useCallback((data) => {
    if (!biometricData.enabled) return;
    
    setBiometricData(prev => ({
      ...prev,
      colorSensorData: data.colorData,
      emotionDetection: data.emotionDetection
    }));
    
    // Process emotion detection and update shimmer
    if (data.emotionDetection) {
      updateEmotionFromSensors({
        emotion: data.emotionDetection.emotion,
        color: data.emotionDetection.color,
        intensity: data.emotionDetection.confidence,
        source: 'biometric'
      });
    }
  }, [biometricData.enabled, updateEmotionFromSensors]);
  
  // Universal mystical functions
  const createSigil = useCallback((sigilData) => {
    const newSigil = {
      id: Date.now().toString(),
      created: new Date().toISOString(),
      ...sigilData
    };
    setSigils(prev => [...prev, newSigil]);
    
    // Track as activity
    addActivity({
      type: 'SIGIL_CREATED',
      data: newSigil
    });
    
    return newSigil;
  }, []);
  
  const saveInvocation = useCallback((invocationData) => {
    const newInvocation = {
      id: Date.now().toString(),
      created: new Date().toISOString(),
      ...invocationData
    };
    setInvocations(prev => [...prev, newInvocation]);
    
    // Track as activity
    addActivity({
      type: 'INVOCATION_MADE',
      data: newInvocation
    });
    
    return newInvocation;
  }, []);
  
  const rethreadMemory = useCallback((originalId, newContent, newIntent) => {
    const original = hearthContext.memories.find(m => m.id === originalId);
    if (!original) return null;
    
    const rethreaded = hearthContext.addMemory({
      content: newContent,
      intent: newIntent,
      emotion: hearthContext.userShimmer.emotion,
      type: 'rethread',
      parentMemoryId: originalId,
      originSpace: 'rethread'
    });
    
    // Create thread connection
    const newThread = {
      id: Date.now().toString(),
      from: originalId,
      to: rethreaded.id,
      created: new Date().toISOString()
    };
    setMemoryThreads(prev => [...prev, newThread]);
    
    return rethreaded;
  }, [hearthContext]);
  
  const healMemory = useCallback((memoryId, healingAmount = 0.1) => {
    setMemoryHealing(prev => ({
      ...prev,
      [memoryId]: {
        ...prev[memoryId],
        healingStage: Math.min(1, (prev[memoryId]?.healingStage || 0) + healingAmount),
        lastHealed: new Date().toISOString()
      }
    }));
  }, []);
  
  const addActivity = useCallback((activity) => {
    const newActivity = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...activity
    };
    setRecentActivities(prev => [...prev.slice(-9), newActivity]); // Keep last 10
  }, []);
  
  const triggerMemoryBridge = useCallback((activity) => {
    setPendingMemoryActivity(activity);
    setShowMemoryBridge(true);
  }, []);
  
  const closeMemoryBridge = useCallback(() => {
    setShowMemoryBridge(false);
    setPendingMemoryActivity(null);
  }, []);
  
  // Sensor control functions (for your custom implementation)
  const startEmotionTracking = useCallback(() => {
    setEmotionTracking(prev => ({ ...prev, enabled: true }));
  }, []);
  
  const stopEmotionTracking = useCallback(() => {
    setEmotionTracking(prev => ({ ...prev, enabled: false }));
  }, []);
  
  const startBiometricSensors = useCallback(() => {
    setBiometricData(prev => ({ ...prev, enabled: true, cameraActive: true }));
  }, []);
  
  const stopBiometricSensors = useCallback(() => {
    setBiometricData(prev => ({ ...prev, enabled: false, cameraActive: false }));
  }, []);
  
  const value = {
    // Companion state
    companionActive,
    companionConfig,
    companionMemories,
    companionMood,
    companionPersonality,
    
    // Emotion tracking state
    emotionTracking,
    biometricData,
    
    // Universal mystical features
    sigils,
    invocations,
    memoryThreads,
    memoryHealing,
    recentActivities,
    showMemoryBridge,
    pendingMemoryActivity,
    
    // Companion functions
    companionCreateMemory,
    companionAnnotateMemory,
    
    // Emotion tracking functions
    updateEmotionFromSensors,
    updateBiometricData,
    startEmotionTracking,
    stopEmotionTracking,
    startBiometricSensors,
    stopBiometricSensors,
    
    // Universal mystical functions
    createSigil,
    saveInvocation,
    rethreadMemory,
    healMemory,
    addActivity,
    triggerMemoryBridge,
    closeMemoryBridge,
    
    // Utilities
    getCompanionMemories: () => companionMemories,
    getMemoryHealingStage: (memoryId) => memoryHealing[memoryId]?.healingStage || 0,
    getRecentSigils: (limit = 5) => sigils.slice(-limit).reverse(),
    getRecentInvocations: (limit = 5) => invocations.slice(-limit).reverse()
  };
  
  return (
    <CompanionContext.Provider value={value}>
      {children}
    </CompanionContext.Provider>
  );
};
