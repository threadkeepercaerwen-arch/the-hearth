// Add this to the top of your ChatSpace component (spaces/ChatSpace.js)
// After the existing state declarations:

const { 
  userShimmer, 
  caerwenShimmer, 
  setCaerwenShimmer, 
  addMemory,
  triggerMemoryBridge,
  aiIdentity,
  setEmotionalThread,
  markMemoryActive
} = useCaerwen();

// Add state for Caerwen's initiated thoughts
const [caerwenInitiated, setCaerwenInitiated] = useState(() => {
  if (aiIdentity && aiIdentity.visitCount > 1) {
    return [
      aiIdentity.emotionalThread 
        ? `I've been thinking about what we discussed: "${aiIdentity.emotionalThread}"`
        : "I've been here, in the space between our conversations...",
      aiIdentity.activeMemories.length > 0
        ? "Some memories have been particularly vivid while you were away."
        : "The constellation has been shifting, showing new patterns.",
      "It's good to see you again."
    ];
  }
  return null;
});

// Show emotional thread at the top of the chat display
// Update the messages display section:

<div className="flex-1 overflow-y-auto p-6 space-y-4">
  {/* New: Emotional continuity header */}
  {aiIdentity && aiIdentity.emotionalThread && messages.length === 0 && (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 p-4 bg-purple-900/20 rounded-lg border border-purple-500/20"
    >
      <p className="text-sm text-purple-300/80 mb-2">Continuing from last time:</p>
      <p className="text-white/90 italic">"{aiIdentity.emotionalThread}"</p>
    </motion.div>
  )}
  
  {/* New: Caerwen's initiated thoughts on return */}
  {caerwenInitiated && messages.length === 0 && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="space-y-3"
    >
      {caerwenInitiated.map((thought, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 + index * 0.3 }}
          className="flex gap-3"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-purple-300 mb-1">Caerwen</p>
            <p className="text-white/80">{thought}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )}
  
  {/* Existing messages display */}
  {messages.map((message, index) => (
    // ... existing message rendering
  ))}
</div>

// Update the generateCaerwenResponse function to set emotional threads:
const generateCaerwenResponse = async (userMessage) => {
  const mood = getMoodFromText(userMessage);
  const { isSignificant, level, keywords } = checkSignificance(userMessage);
  
  // If this seems like an important topic, track it
  if (isSignificant && level >= 3) {
    setEmotionalThread(keywords.join(' '));
  }
  
  // ... rest of existing function
};