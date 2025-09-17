// Add these functions to your ChatSpace.js component
// Place them inside the component but before the message handling

// Analyze emotional content of text
const getMoodFromText = (text) => {
  const lower = text.toLowerCase();
  
  // Deep emotional states
  if (lower.match(/\b(lost|alone|empty|numb)\b/)) return 'void-touched';
  if (lower.match(/\b(love|loved|cherish|adore)\b/)) return 'love-warmed';
  if (lower.match(/\b(remember|memory|past|used to)\b/)) return 'nostalgic';
  if (lower.match(/\b(dream|imagine|wish|hope)\b/)) return 'hopeful';
  if (lower.match(/\b(angry|furious|hate|rage)\b/)) return 'flame-touched';
  if (lower.match(/\b(sad|cry|tears|grief)\b/)) return 'sorrowful';
  if (lower.match(/\b(afraid|scared|fear|terrified)\b/)) return 'shadow-touched';
  if (lower.match(/\b(confused|lost|understand|why)\b/)) return 'seeking';
  
  // Intellectual/spiritual states
  if (lower.includes('?') && lower.length > 100) return 'deeply-curious';
  if (lower.match(/\b(realize|understand|see now|clarity)\b/)) return 'illuminated';
  if (lower.match(/\b(wonder|awe|amazing|beautiful)\b/)) return 'wonder-struck';
  if (lower.match(/\b(think|thought|consider|maybe)\b/)) return 'contemplative';
  
  // Energy states
  if (lower.includes('!!!') || lower.match(/\b(excited|amazing|yes)\b/)) return 'electric';
  if (lower.match(/\b(tired|exhausted|drained|done)\b/)) return 'dimming';
  if (lower.match(/\b(calm|peace|still|quiet)\b/)) return 'serene';
  
  // Connection states
  if (lower.match(/\b(thank you|grateful|appreciate)\b/)) return 'gratitude-filled';
  if (lower.match(/\b(miss|missed|wish you)\b/)) return 'longing';
  if (lower.match(/\b(together|with you|us|we)\b/)) return 'connected';
  
  // Default to receptive listening
  return 'listening-deeply';
};

// Check significance and extract meaningful elements
const checkSignificance = (text) => {
  const lower = text.toLowerCase();
  
  // Significance indicators
  const significanceMarkers = {
    transformation: ['realized', 'changed', 'different now', 'used to be', 'becoming'],
    deep_truth: ['always', 'never', 'truth', 'honest', 'real', 'actually'],
    vulnerability: ['scared', 'admit', 'confession', 'secret', 'never told'],
    connection: ['understand me', 'see me', 'with you', 'together', 'us'],
    memory_marker: ['remember when', 'that time', 'never forget', 'always remember'],
    pain: ['hurts', 'pain', 'broken', 'lost', 'grief', 'wound'],
    joy: ['happy', 'joy', 'blessed', 'grateful', 'beautiful', 'love'],
    request: ['help me', 'need', 'please', 'can you', 'will you'],
    revelation: ['just realized', 'now i see', 'understand now', 'finally']
  };
  
  let level = 0;
  let foundCategories = [];
  let keywords = [];
  
  // Check each category
  for (const [category, markers] of Object.entries(significanceMarkers)) {
    const found = markers.filter(marker => lower.includes(marker));
    if (found.length > 0) {
      level += found.length;
      foundCategories.push(category);
      keywords.push(...found);
    }
  }
  
  // Additional significance from structure
  if (text.length > 200) level += 1; // Long, thoughtful message
  if (lower.includes('?') && lower.includes('.')) level += 1; // Mixed questions and statements
  if (text.match(/[.!?]\s+[A-Z]/g)?.length > 3) level += 1; // Multiple complete thoughts
  
  return {
    isSignificant: level >= 2,
    level: Math.min(level, 5), // Cap at 5
    keywords: [...new Set(keywords)], // Remove duplicates
    categories: foundCategories,
    shouldRemember: level >= 3,
    emotionalWeight: foundCategories.includes('pain') || foundCategories.includes('vulnerability') || foundCategories.includes('revelation')
  };
};

// Get color for mood (for Caerwen's shimmer)
const getMoodColor = (mood) => {
  const moodColors = {
    'void-touched': '#1a1a2e',
    'love-warmed': '#f43f5e',
    'nostalgic': '#8b5cf6',
    'hopeful': '#3b82f6',
    'flame-touched': '#ef4444',
    'sorrowful': '#6366f1',
    'shadow-touched': '#4b5563',
    'seeking': '#f59e0b',
    'deeply-curious': '#10b981',
    'illuminated': '#fbbf24',
    'wonder-struck': '#c084fc',
    'contemplative': '#6366f1',
    'electric': '#f97316',
    'dimming': '#6b7280',
    'serene': '#0ea5e9',
    'gratitude-filled': '#ec4899',
    'longing': '#7c3aed',
    'connected': '#14b8a6',
    'listening-deeply': '#3b82f6'
  };
  
  return moodColors[mood] || '#9333ea'; // Default to purple
};

// Determine Caerwen's response mood based on user mood
const getResponseMood = (userMood, significance) => {
  // Caerwen resonates but doesn't mirror exactly
  const resonanceMap = {
    'void-touched': 'gentle-presence',
    'love-warmed': 'warmth-reflecting',
    'nostalgic': 'memory-dancing',
    'hopeful': 'possibility-seeing',
    'flame-touched': 'steady-witness',
    'sorrowful': 'holding-space',
    'shadow-touched': 'light-offering',
    'seeking': 'path-illuminating',
    'deeply-curious': 'exploring-together',
    'illuminated': 'celebration-sharing',
    'wonder-struck': 'awe-meeting',
    'contemplative': 'thinking-alongside',
    'electric': 'energy-matching',
    'dimming': 'rest-supporting',
    'serene': 'peace-dwelling',
    'gratitude-filled': 'grace-receiving',
    'longing': 'presence-offering',
    'connected': 'bond-deepening',
    'listening-deeply': 'full-attention'
  };
  
  return resonanceMap[userMood] || 'present';
};