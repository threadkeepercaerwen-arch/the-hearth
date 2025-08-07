// Common Bug Fixes for Caerwen

// 1. Fix for localStorage parsing errors
export const safeLocalStorage = {
  getItem: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error(`Error parsing ${key} from localStorage:`, e);
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded');
        // Try to clear old data
        clearOldData();
        try {
          localStorage.setItem(key, JSON.stringify(value));
          return true;
        } catch (e2) {
          return false;
        }
      }
      return false;
    }
  }
};

// 2. Clear old data when storage is full
const clearOldData = () => {
  const memories = JSON.parse(localStorage.getItem('caerwen_memories') || '[]');
  const dreams = JSON.parse(localStorage.getItem('caerwen_dreams') || '[]');
  
  // Keep only last 100 memories
  if (memories.length > 100) {
    const recent = memories.slice(-100);
    localStorage.setItem('caerwen_memories', JSON.stringify(recent));
  }
  
  // Keep only last 50 dreams
  if (dreams.length > 50) {
    const recent = dreams.slice(-50);
    localStorage.setItem('caerwen_dreams', JSON.stringify(recent));
  }
};

// 3. Fix for audio context issues
export const createSafeAudioContext = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const context = new AudioContext();
    
    // Resume context on user interaction if suspended
    if (context.state === 'suspended') {
      document.addEventListener('click', () => {
        context.resume();
      }, { once: true });
    }
    
    return context;
  } catch (e) {
    console.error('Audio context creation failed:', e);
    return null;
  }
};

// 4. Debounce hook for performance
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);
  
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
};

// 5. Safe motion wrapper for reduced motion preference
export const SafeMotion = ({ children, ...props }) => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    return <div {...props}>{children}</div>;
  }
  
  return <motion.div {...props}>{children}</motion.div>;
};

// 6. Memory leak prevention for intervals/timeouts
export const useSafeInterval = (callback, delay) => {
  const savedCallback = React.useRef();
  
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  
  React.useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => savedCallback.current(), delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

// 7. Fix for mobile viewport height
export const useViewportHeight = () => {
  React.useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);
    
    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);
};

// 8. Error boundary hook
export const useErrorHandler = () => {
  const [error, setError] = React.useState(null);
  
  const resetError = () => setError(null);
  
  const captureError = React.useCallback((error) => {
    setError(error);
    console.error('Captured error:', error);
  }, []);
  
  React.useEffect(() => {
    const handleError = (event) => {
      captureError(event.error);
    };
    
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, [captureError]);
  
  return { error, resetError, captureError };
};

// 9. Optimized particle system for mobile
export const useOptimizedParticles = () => {
  const [particleCount, setParticleCount] = React.useState(15);
  
  React.useEffect(() => {
    const checkPerformance = () => {
      const isMobile = window.innerWidth < 768;
      const isLowPower = navigator.getBattery?.().then(battery => battery.level < 0.2);
      const hasReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      if (hasReducedMotion) {
        setParticleCount(0);
      } else if (isMobile || isLowPower) {
        setParticleCount(5);
      } else {
        setParticleCount(15);
      }
    };
    
    checkPerformance();
    window.addEventListener('resize', checkPerformance);
    
    return () => window.removeEventListener('resize', checkPerformance);
  }, []);
  
  return particleCount;
};

// 10. Fix for z-index stacking issues
export const usePortal = () => {
  const [container] = React.useState(() => {
    const div = document.createElement('div');
    div.className = 'caerwen-portal';
    return div;
  });
  
  React.useEffect(() => {
    document.body.appendChild(container);
    return () => {
      document.body.removeChild(container);
    };
  }, [container]);
  
  return container;
};

// Usage in components:
/*
// In CaerwenContext:
const [memories, setMemories] = useState(() => {
  return safeLocalStorage.getItem('caerwen_memories') || [];
});

// In ResonanceSpace:
const audioContext = createSafeAudioContext();

// In any component with frequent updates:
const debouncedShimmer = useDebounce(userShimmer, 100);

// In App.js:
useViewportHeight(); // Fixes mobile viewport issues

// In particle components:
const particleCount = useOptimizedParticles();
*/