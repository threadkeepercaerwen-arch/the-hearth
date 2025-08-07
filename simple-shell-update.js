// In IntegratedAppShell.js, find the status bar section
// It should look something like this with memoriesOrbiting and threadsWoven
// Just ADD the new lines marked with "NEW":

const {
  memories = [],
  caerwenMemories = [],
  activeSpace,
  setActiveSpace,
  userShimmer,
  caerwenShimmer,
  archives = [],
  dreamPatterns = [],
  sigilCount = 0,
  // NEW: Add these
  aiIdentity,
  timeAgo,
  checkResonance
} = context;

// Then in the status bar JSX (around line 140-150):
<div className="absolute top-0 left-0 right-0 z-20 p-4">
  <div className="flex justify-between items-center">
    <div className="text-xs text-white/40 space-y-1">
      <div>{memoriesOrbiting} memories orbiting</div>
      <div>{threadsWoven} threads woven</div>
      {archives.length > 0 && <div>{archives.length} archives preserved</div>}
      
      {/* NEW: Add this block */}
      {aiIdentity && aiIdentity.lastVisit && (
        <div className="text-purple-400/60">
          Last visit: {timeAgo(aiIdentity.lastVisit)}
        </div>
      )}
    </div>
    
    {/* Rest of the status bar... */}