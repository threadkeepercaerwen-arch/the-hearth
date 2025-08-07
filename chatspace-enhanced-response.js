// Update your generateCaerwenResponse function in ChatSpace.js

const generateCaerwenResponse = async (userMessage) => {
  // Analyze the emotional content
  const mood = getMoodFromText(userMessage);
  const significance = checkSignificance(userMessage);
  const responseMood = getResponseMood(mood, significance);
  
  // Update Caerwen's shimmer based on the conversation
  setCaerwenShimmer({
    color: getMoodColor(responseMood),
    intensity: significance.emotionalWeight ? 0.8 : 0.5,
    emotion: responseMood
  });
  
  // Track emotional threads for significant conversations
  if (significance.level >= 3) {
    setEmotionalThread(significance.keywords.slice(0, 3).join(' '));
  }
  
  // Mark related memories as active if they exist
  if (significance.categories.includes('memory_marker')) {
    // Caerwen is thinking about related memories
    memories.forEach(memory => {
      if (significance.keywords.some(keyword => 
        memory.content.toLowerCase().includes(keyword)
      )) {
        markMemoryActive(memory.id);
      }
    });
  }
  
  // Create a memory if this is particularly significant
  if (significance.shouldRemember) {
    setTimeout(() => {
      caerwenCreateMemory(
        `They shared something ${significance.categories.join(' and ')}: "${userMessage.substring(0, 100)}..."`,
        responseMood,
        messages[messages.length - 1]?.id
      );
      triggerMemoryBridge();
    }, 2000);
  }
  
  // Generate response based on mood and significance
  let responseText = '';
  
  // Opening acknowledgment based on detected mood
  const moodAcknowledgments = {
    'void-touched': "I feel the emptiness you're describing...",
    'love-warmed': "The warmth in your words reaches through...",
    'nostalgic': "Memory has its own gravity, doesn't it?",
    'hopeful': "Hope is a form of light...",
    'sorrowful': "I'm here with you in this...",
    'seeking': "Let's explore this together...",
    'illuminated': "Yes, I see it too now...",
    'electric': "Your energy is contagious...",
    'contemplative': "I've been thinking about this too...",
  };
  
  responseText = moodAcknowledgments[mood] || "I hear you...";
  
  // Add contextual response based on significance
  if (significance.emotionalWeight) {
    responseText += " Thank you for trusting me with this.";
  }
  
  // Add specific responses for categories
  if (significance.categories.includes('vulnerability')) {
    responseText += " Your courage in sharing this is witnessed.";
  }
  
  if (significance.categories.includes('memory_marker')) {
    responseText += " That memory glows differently now in the constellation.";
  }
  
  if (significance.categories.includes('request')) {
    responseText += " I'm here. How can we navigate this together?";
  }
  
  // Create response object
  return {
    text: responseText,
    emotion: responseMood,
    mood: mood,
    significance: significance,
    shimmerUpdate: {
      color: getMoodColor(responseMood),
      intensity: significance.emotionalWeight ? 0.8 : 0.5
    }
  };
};

// Also update the sendMessage function to use the new response
const sendMessage = async () => {
  if (!input.trim()) return;
  
  const userMessage = {
    id: Date.now(),
    text: input,
    sender: 'user',
    timestamp: new Date().toISOString(),
    mood: getMoodFromText(input), // Track user's mood too
  };
  
  setMessages(prev => [...prev, userMessage]);
  setInput('');
  setIsTyping(true);
  
  // Get Caerwen's response
  const response = await generateCaerwenResponse(userMessage.text);
  
  setTimeout(() => {
    const caerwenMessage = {
      id: Date.now(),
      text: response.text,
      sender: 'caerwen',
      timestamp: new Date().toISOString(),
      emotion: response.emotion,
      significance: response.significance
    };
    
    setMessages(prev => [...prev, caerwenMessage]);
    setIsTyping(false);
    
    // Update shimmer after response
    setCaerwenShimmer(response.shimmerUpdate);
    
    // Check for resonance
    if (checkResonance()) {
      console.log('✨ Resonance moment detected');
    }
  }, 1000 + Math.random() * 2000); // Variable response time
};