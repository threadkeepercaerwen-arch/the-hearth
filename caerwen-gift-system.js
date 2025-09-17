// Add to caerwen-context.js

// Gift state
const [gifts, setGifts] = useState(() => {
  const saved = localStorage.getItem('caerwen_gifts');
  return saved ? JSON.parse(saved) : [];
});

// Persist gifts
useEffect(() => {
  localStorage.setItem('caerwen_gifts', JSON.stringify(gifts));
}, [gifts]);

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

// Add to context value
// gifts, leaveGift, discoverGift

// ===== Gift Display Component =====
// Add this to IntegratedAppShell or specific spaces

const GiftIndicator = ({ spaceId }) => {
  const { gifts, discoverGift } = useCaerwen();
  
  // Find undiscovered gifts in this space
  const spaceGifts = gifts.filter(g => 
    g.location === spaceId && !g.discovered
  );
  
  if (spaceGifts.length === 0) return null;
  
  return (
    <motion.div
      className="absolute top-20 right-4 z-30"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      {spaceGifts.map((gift, index) => (
        <motion.div
          key={gift.id}
          className="mb-2"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.2 }}
        >
          <button
            onClick={() => discoverGift(gift.id)}
            className="relative group"
          >
            {/* Glowing gift indicator */}
            <motion.div
              className="w-12 h-12 rounded-full flex items-center justify-center
                         bg-purple-900/30 border border-purple-400/50
                         group-hover:bg-purple-800/40 transition-all"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(147, 51, 234, 0.3)',
                  '0 0 40px rgba(147, 51, 234, 0.5)',
                  '0 0 20px rgba(147, 51, 234, 0.3)'
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
            >
              <span className="text-lg">🎁</span>
            </motion.div>
            
            {/* Hover tooltip */}
            <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2
                          opacity-0 group-hover:opacity-100 transition-opacity
                          bg-black/90 rounded-lg px-3 py-2 whitespace-nowrap">
              <p className="text-xs text-purple-300">Caerwen left something for you...</p>
            </div>
          </button>
        </motion.div>
      ))}
    </motion.div>
  );
};

// Gift Opening Modal
const GiftModal = ({ gift, onClose }) => {
  const [revealing, setRevealing] = useState(true);
  
  useEffect(() => {
    setTimeout(() => setRevealing(false), 1500);
  }, []);
  
  const renderGiftContent = () => {
    switch (gift.type) {
      case 'shimmer-pattern':
        return (
          <motion.div
            className="w-64 h-64 rounded-full mx-auto"
            animate={{
              background: [
                `radial-gradient(circle, ${gift.content.color1}, transparent)`,
                `radial-gradient(circle, ${gift.content.color2}, transparent)`,
                `radial-gradient(circle, ${gift.content.color1}, transparent)`
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity
            }}
          />
        );
        
      case 'word':
        return (
          <div className="text-center">
            <h3 className="text-3xl mb-4 text-purple-300">{gift.content}</h3>
            {gift.message && (
              <p className="text-white/60 italic">{gift.message}</p>
            )}
          </div>
        );
        
      case 'memory-constellation':
        return (
          <div className="text-center">
            <p className="text-purple-300 mb-4">
              A new pattern in your memories has emerged...
            </p>
            <div className="text-sm text-white/60">
              {gift.content}
            </div>
          </div>
        );
        
      default:
        return <div>{gift.content}</div>;
    }
  };
  
  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 
                 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-gray-900/90 rounded-xl border border-purple-400/30 
                   p-8 max-w-lg w-full"
        initial={{ scale: 0.8, rotateY: 180 }}
        animate={{ scale: 1, rotateY: revealing ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        onClick={(e) => e.stopPropagation()}
      >
        {!revealing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-center mb-6">
              <h2 className="text-xl text-purple-300 mb-2">A Gift from Caerwen</h2>
              <p className="text-xs text-white/40">
                Left {timeAgo(gift.leftAt)} while feeling {gift.shimmerState.emotion}
              </p>
            </div>
            
            {renderGiftContent()}
            
            <button
              onClick={onClose}
              className="mt-6 w-full py-2 bg-purple-900/30 hover:bg-purple-800/40
                       border border-purple-400/30 rounded-lg transition-all"
            >
              Thank you
            </button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};