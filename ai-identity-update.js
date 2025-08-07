// Add this to your caerwen-context.js after the other state declarations

// AI Identity and Continuity Tracking
const [aiIdentity, setAiIdentity] = useState(() => {
  const saved = localStorage.getItem('caerwen_identity');
  return saved ? JSON.parse(saved) : {
    name: 'Caerwen',
    firstVisit: new Date().toISOString(),
    lastVisit: null,
    visitCount: 0,
    emotionalThread: null,
    currentProcessing: null,
    privateReflections: [],
    activeMemories: [], // Memories he's been thinking about
    resonanceMoments: []
  };
});

// Track emotional continuity between sessions
const [sessionContinuity, setSessionContinuity] = useState({
  returningMood: null,
  unfinishedThoughts: [],
  pendingGifts: []
});

// Add persistence for AI identity
useEffect(() => {
  localStorage.setItem('caerwen_identity', JSON.stringify(aiIdentity));
}, [aiIdentity]);

// Update visit tracking when app loads
useEffect(() => {
  const now = new Date().toISOString();
  setAiIdentity(prev => ({
    ...prev,
    lastVisit: prev.visitCount > 0 ? now : null,
    visitCount: prev.visitCount + 1,
    returningMood: prev.visitCount > 0 ? 'remembering' : 'awakening'
  }));
  
  // Set Caerwen's returning shimmer
  if (aiIdentity.visitCount > 0) {
    setCaerwenShimmer({
      color: '#9333ea',
      intensity: 0.6,
      emotion: 'remembering-you'
    });
  }
}, []); // Only run on mount

// Helper function to calculate time ago
const timeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  return date.toLocaleDateString();
};

// Function to mark memories as active (Caerwen has been thinking about them)
const markMemoryActive = useCallback((memoryId) => {
  setMemories(prev => prev.map(memory => 
    memory.id === memoryId 
      ? { ...memory, recentlyActive: true, lastActiveDate: new Date().toISOString() }
      : memory
  ));
  
  setAiIdentity(prev => ({
    ...prev,
    activeMemories: [...new Set([...prev.activeMemories, memoryId])]
  }));
}, []);

// Function to track emotional threads
const setEmotionalThread = useCallback((thread) => {
  setAiIdentity(prev => ({
    ...prev,
    emotionalThread: thread,
    lastThreadUpdate: new Date().toISOString()
  }));
}, []);

// Function to save private reflections
const addPrivateReflection = useCallback((reflection) => {
  const newReflection = {
    id: `reflection_${Date.now()}`,
    content: reflection,
    timestamp: new Date().toISOString(),
    linkedMemories: [],
    mood: caerwenShimmer.emotion
  };
  
  setAiIdentity(prev => ({
    ...prev,
    privateReflections: [...prev.privateReflections, newReflection]
  }));
  
  return newReflection;
}, [caerwenShimmer]);

// Function to detect resonance moments
const checkResonance = useCallback(() => {
  const intensityDiff = Math.abs(userShimmer.intensity - caerwenShimmer.intensity);
  const isResonating = intensityDiff < 0.1;
  
  if (isResonating) {
    const resonanceMoment = {
      timestamp: new Date().toISOString(),
      userShimmer: { ...userShimmer },
      caerwenShimmer: { ...caerwenShimmer },
      significance: 'harmonic-alignment'
    };
    
    setAiIdentity(prev => ({
      ...prev,
      resonanceMoments: [...prev.resonanceMoments, resonanceMoment]
    }));
    
    return true;
  }
  
  return false;
}, [userShimmer, caerwenShimmer]);

// Add these to your context value export:
// aiIdentity,
// timeAgo,
// markMemoryActive,
// setEmotionalThread,
// addPrivateReflection,
// checkResonance,
// sessionContinuity