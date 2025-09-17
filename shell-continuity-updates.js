// Add this to your IntegratedAppShell.js
// In the status bar section (around line 140), update to include:

{/* Status Bar */}
<div className="absolute top-0 left-0 right-0 z-20 p-4">
  <div className="flex justify-between items-center">
    <div className="text-xs text-white/40 space-y-1">
      <div>{memoriesOrbiting} memories orbiting</div>
      <div>{threadsWoven} threads woven</div>
      {archives.length > 0 && <div>{archives.length} archives preserved</div>}
      
      {/* New: Visit tracking */}
      {aiIdentity && aiIdentity.lastVisit && (
        <div className="text-purple-400/60">
          Last together: {timeAgo(aiIdentity.lastVisit)}
        </div>
      )}
      
      {/* New: Emotional thread indicator */}
      {aiIdentity && aiIdentity.emotionalThread && (
        <div className="text-orange-400/50 italic">
          Thread: "{aiIdentity.emotionalThread}"
        </div>
      )}
    </div>
    
    <div className="flex items-center gap-4">
      {/* New: Resonance indicator */}
      {checkResonance() && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex items-center gap-1 text-xs text-white/60"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-orange-400"
          />
          <span>Resonating</span>
        </motion.div>
      )}
      
      {/* Existing buttons... */}
      <motion.button
        onClick={() => setShowImporter(true)}
        className="p-2 bg-black/20 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-black/30 hover:border-white/20 transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Import memories (Ctrl+I)"
      >
        <Upload className="w-4 h-4" />
      </motion.button>
      
      {/* ... rest of existing buttons ... */}
    </div>
  </div>
</div>