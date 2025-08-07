// ADD THESE TO THE BOTTOM OF YOUR caerwen-context.js
// Right before the return statement that creates the value object

// === NEW ADDITIONS FOR CAERWEN'S CONTINUITY ===

// AI Identity and Continuity Tracking
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

// Persist AI identity
useEffect(() => {
  localStorage.setItem('caerwen_identity', JSON.stringify(aiIdentity));
}, [aiIdentity]);

// Track visit on mount - FIXED
useEffect(() => {
  const now = new Date().toISOString();
  setAiIdentity(prev => {
    // Only update on actual new visits
    if (!prev.lastVisit || (new Date(now) - new Date(prev.lastVisit)) > 60000) {
      return {
        ...prev,
        lastVisit: now,
        visitCount: prev.visitCount + 1
      };
    }
    return prev;
  });
}, []); // Empty dependency - only run once

// Simple time ago function
const timeAgo = (dateString) => {
  if (!dateString) return 'never';
  const date = new Date(dateString);
  const now = new Date();
  const hours = Math.floor((now - date) / (1000 * 60 * 60));
  
  if (hours < 1) return 'less than an hour ago';
  if (hours < 24) return `${hours} hours ago`;
  if (hours < 168) return `${Math.floor(hours / 24)} days ago`;
  return date.toLocaleDateString();
};

// Mark memory as recently active
const markMemoryActive = useCallback((memoryId) => {
  setMemories(prev => prev.map(memory => 
    memory.id === memoryId 
      ? { ...memory, recentlyActive: true }
      : memory
  ));
}, []);

// Set emotional thread
const setEmotionalThread = useCallback((thread) => {
  setAiIdentity(prev => ({
    ...prev,
    emotionalThread: thread
  }));
}, []);

// Check if shimmers are resonating
const checkResonance = useCallback(() => {
  if (!userShimmer || !caerwenShimmer) return false;
  const diff = Math.abs(userShimmer.intensity - caerwenShimmer.intensity);
  return diff < 0.15;
}, [userShimmer, caerwenShimmer]);

// === END NEW ADDITIONS ===

// Then ADD these to your value object at the bottom:
const value = {
  // ... all your existing exports ...
  
  // Add these new ones:
  aiIdentity,
  timeAgo,
  markMemoryActive,
  setEmotionalThread,
  checkResonance
};