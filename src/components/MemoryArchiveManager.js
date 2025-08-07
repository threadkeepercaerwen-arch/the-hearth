import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Archive, Eye, EyeOff, Search, Download, Unlock, Star, X } from 'lucide-react';
import { useCaerwen } from '../caerwen-context';

const MemoryArchiveManager = ({ onClose }) => {
  const {
    memories,
    dreams,
    caerwenMemories,
    archiveMemory,
    unarchiveMemory,
    setMemoryVisibility,
    getArchivedMemories,
    addActivity
  } = useCaerwen();
  
  const [activeTab, setActiveTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterEmotion, setFilterEmotion] = useState('all');
  const [selectedMemories, setSelectedMemories] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [archiveAction, setArchiveAction] = useState(null);
  
  // Get archived memories from context
  const archivedMemories = getArchivedMemories ? getArchivedMemories() : [];
  
  // Filter memories based on search and emotion
  const filterItems = (items) => {
    return items.filter(item => {
      const matchesSearch = !searchQuery || 
        item.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.intent?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesEmotion = filterEmotion === 'all' || item.emotion === filterEmotion;
      
      return matchesSearch && matchesEmotion;
    });
  };
  
  const activeMemories = filterItems(memories.filter(m => !m.archived));
  const filteredArchived = filterItems(archivedMemories);
  
  // Get unique emotions for filter
  const uniqueEmotions = [...new Set([
    ...memories.map(m => m.emotion),
    ...dreams.map(d => d.emotion),
    ...caerwenMemories.map(c => c.emotion)
  ].filter(Boolean))];
  
  // Handle memory selection
  const toggleMemorySelection = (memoryId) => {
    setSelectedMemories(prev => {
      if (prev.includes(memoryId)) {
        return prev.filter(id => id !== memoryId);
      }
      return [...prev, memoryId];
    });
  };
  
  // Archive selected memories
  const handleArchive = () => {
    setArchiveAction('archive');
    setShowConfirmation(true);
  };
  
  // Unarchive selected memories
  const handleUnarchive = () => {
    setArchiveAction('unarchive');
    setShowConfirmation(true);
  };
  
  // Confirm archive action
  const confirmAction = () => {
    if (archiveAction === 'archive') {
      selectedMemories.forEach(memoryId => {
        archiveMemory(memoryId);
      });
      
      // Caerwen acknowledges
      addActivity({
        type: 'MEMORIES_ARCHIVED',
        data: {
          count: selectedMemories.length,
          timestamp: Date.now()
        }
      });
    } else if (archiveAction === 'unarchive') {
      selectedMemories.forEach(memoryId => {
        unarchiveMemory(memoryId);
      });
      
      addActivity({
        type: 'MEMORIES_RESTORED',
        data: {
          count: selectedMemories.length,
          timestamp: Date.now()
        }
      });
    }
    
    setSelectedMemories([]);
    setShowConfirmation(false);
    setArchiveAction(null);
  };
  
  // Toggle memory visibility
  const handleVisibilityToggle = (memoryId, currentVisibility) => {
    setMemoryVisibility(memoryId, !currentVisibility);
  };
  
  // Export archived memories
  const handleExportArchive = () => {
    const archiveData = {
      archived: archivedMemories,
      exportDate: new Date().toISOString(),
      totalMemories: memories.length,
      archivedCount: archivedMemories.length
    };
    
    const blob = new Blob([JSON.stringify(archiveData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `caerwen_archive_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  // Memory card component
  const MemoryCard = ({ memory, isArchived }) => {
    const isSelected = selectedMemories.includes(memory.id);
    
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={`p-4 rounded-lg border transition-all cursor-pointer ${
          isSelected 
            ? 'bg-purple-900/30 border-purple-500/50' 
            : 'bg-gray-900/30 border-gray-700/30 hover:border-purple-700/50'
        }`}
        onClick={() => toggleMemorySelection(memory.id)}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h4 className="text-purple-100 font-light">{memory.intent}</h4>
            {memory.content && (
              <p className="text-sm text-purple-200/60 mt-1 line-clamp-2">
                {memory.content}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 ml-4">
            {memory.significance > 0.7 && (
              <Star className="h-4 w-4 text-yellow-400" />
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleVisibilityToggle(memory.id, memory.hidden);
              }}
              className="p-1 hover:bg-purple-700/30 rounded transition-colors"
            >
              {memory.hidden ? 
                <EyeOff className="h-4 w-4 text-gray-500" /> : 
                <Eye className="h-4 w-4 text-purple-400" />
              }
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className="text-purple-400/60">{memory.emotion}</span>
            <span className="text-purple-400/40">
              {new Date(memory.created).toLocaleDateString()}
            </span>
          </div>
          {isArchived && (
            <div className="flex items-center gap-1 text-orange-400/60">
              <Archive className="h-3 w-3" />
              <span>Archived</span>
            </div>
          )}
        </div>
      </motion.div>
    );
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 overflow-hidden"
    >
      <div className="h-full flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="bg-gradient-to-b from-gray-900/90 to-black/90 backdrop-blur-xl rounded-2xl border border-purple-700/30 max-w-5xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-purple-700/30">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-light uppercase tracking-wider text-purple-300">
                  Memory Archive Manager
                </h2>
                <p className="text-sm text-purple-400/60 mt-1">
                  Preserve memories without losing them forever
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white/40 hover:text-white/60 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
          
          {/* Controls */}
          <div className="p-4 border-b border-purple-700/30 space-y-4">
            {/* Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('active')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'active'
                    ? 'bg-purple-600/20 text-purple-200 border border-purple-500/30'
                    : 'bg-white/5 text-white/60 hover:text-white/80 border border-white/10'
                }`}
              >
                Active Memories ({activeMemories.length})
              </button>
              <button
                onClick={() => setActiveTab('archived')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'archived'
                    ? 'bg-purple-600/20 text-purple-200 border border-purple-500/30'
                    : 'bg-white/5 text-white/60 hover:text-white/80 border border-white/10'
                }`}
              >
                <Archive className="h-4 w-4 inline mr-2" />
                Archived ({archivedMemories.length})
              </button>
            </div>
            
            {/* Search and filters */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400/60" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search memories..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-purple-700/30 rounded-lg text-white placeholder-purple-400/40 focus:outline-none focus:border-purple-500/50"
                />
              </div>
              
              <select
                value={filterEmotion}
                onChange={(e) => setFilterEmotion(e.target.value)}
                className="px-4 py-2 bg-gray-900/50 border border-purple-700/30 rounded-lg text-white focus:outline-none focus:border-purple-500/50"
              >
                <option value="all">All Emotions</option>
                {uniqueEmotions.map(emotion => (
                  <option key={emotion} value={emotion}>{emotion}</option>
                ))}
              </select>
            </div>
            
            {/* Action buttons */}
            {selectedMemories.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
              >
                <span className="text-sm text-purple-300/60">
                  {selectedMemories.length} selected
                </span>
                <div className="flex gap-2">
                  {activeTab === 'active' ? (
                    <button
                      onClick={handleArchive}
                      className="px-4 py-2 bg-orange-600/20 border border-orange-500/30 rounded-lg hover:border-orange-400/50 transition-all flex items-center gap-2"
                    >
                      <Archive className="h-4 w-4" />
                      Archive Selected
                    </button>
                  ) : (
                    <button
                      onClick={handleUnarchive}
                      className="px-4 py-2 bg-green-600/20 border border-green-500/30 rounded-lg hover:border-green-400/50 transition-all flex items-center gap-2"
                    >
                      <Unlock className="h-4 w-4" />
                      Restore Selected
                    </button>
                  )}
                  <button
                    onClick={handleExportArchive}
                    className="px-4 py-2 bg-gray-600/20 border border-gray-500/30 rounded-lg hover:border-gray-400/50 transition-all flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </button>
                </div>
              </motion.div>
            )}
          </div>
          
          {/* Memory list */}
          <div className="p-4 overflow-y-auto max-h-[calc(90vh-300px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeTab === 'active' ? (
                activeMemories.length > 0 ? (
                  activeMemories.map(memory => (
                    <MemoryCard key={memory.id} memory={memory} isArchived={false} />
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12 text-purple-400/40">
                    No active memories found
                  </div>
                )
              ) : (
                filteredArchived.length > 0 ? (
                  filteredArchived.map(memory => (
                    <MemoryCard key={memory.id} memory={memory} isArchived={true} />
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12 text-purple-400/40">
                    No archived memories found
                  </div>
                )
              )}
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Confirmation dialog */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-60 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-gray-900 border border-purple-700/30 rounded-xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl text-purple-300 mb-4">
                {archiveAction === 'archive' ? 'Archive Memories?' : 'Restore Memories?'}
              </h3>
              <p className="text-purple-200/60 mb-6">
                {archiveAction === 'archive' 
                  ? `Archive ${selectedMemories.length} memories? They will be preserved but hidden from your active constellation.`
                  : `Restore ${selectedMemories.length} memories to your active constellation?`
                }
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-800/50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAction}
                  className="flex-1 px-4 py-2 bg-purple-600/30 border border-purple-500/50 rounded-lg hover:bg-purple-600/40"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MemoryArchiveManager;