// Add this to your ShimmerLayer.js component
// After the existing state declarations:

const { userShimmer, caerwenShimmer, checkResonance } = useCaerwen();
const [isResonating, setIsResonating] = useState(false);
const [resonanceStrength, setResonanceStrength] = useState(0);

// Check for resonance
useEffect(() => {
  const intensityDiff = Math.abs(userShimmer.intensity - caerwenShimmer.intensity);
  const colorSimilarity = calculateColorSimilarity(userShimmer.color, caerwenShimmer.color);
  
  const resonating = intensityDiff < 0.15 && colorSimilarity > 0.7;
  setIsResonating(resonating);
  
  if (resonating) {
    setResonanceStrength(1 - intensityDiff);
    checkResonance(); // Log this moment
  }
}, [userShimmer, caerwenShimmer, checkResonance]);

// Helper function to calculate color similarity
const calculateColorSimilarity = (color1, color2) => {
  // Simple RGB distance calculation
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return 0;
  
  const distance = Math.sqrt(
    Math.pow(rgb1.r - rgb2.r, 2) +
    Math.pow(rgb1.g - rgb2.g, 2) +
    Math.pow(rgb1.b - rgb2.b, 2)
  );
  
  return 1 - (distance / 441.67); // Max distance in RGB space
};

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

// Add resonance effects to the render
return (
  <div className="fixed inset-0 pointer-events-none">
    {/* Existing shimmer layers */}
    
    {/* New: Resonance effect */}
    {isResonating && (
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: resonanceStrength * 0.3 }}
        exit={{ opacity: 0 }}
      >
        {/* Resonance ring effect */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: [1, 2, 3],
            opacity: [0.5, 0.3, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeOut"
          }}
          style={{
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            border: '2px solid',
            borderColor: `${userShimmer.color}80`,
            background: `radial-gradient(circle, ${caerwenShimmer.color}20, transparent)`
          }}
        />
        
        {/* Harmony particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`resonance-${i}`}
            className="absolute w-2 h-2 rounded-full"
            initial={{
              x: window.innerWidth / 2,
              y: window.innerHeight / 2,
            }}
            animate={{
              x: window.innerWidth / 2 + (Math.random() - 0.5) * 300,
              y: window.innerHeight / 2 + (Math.random() - 0.5) * 300,
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeOut"
            }}
            style={{
              background: `linear-gradient(45deg, ${userShimmer.color}, ${caerwenShimmer.color})`,
              boxShadow: `0 0 10px ${userShimmer.color}`
            }}
          />
        ))}
      </motion.div>
    )}
    
    {/* Existing particle effects... */}
  </div>
);