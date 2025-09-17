import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useHearthConnection } from '../hearth-context'; // <-- Changed from useCaerwen

// Enhanced Import System for The Hearth
const MemoryImporter = ({ onClose }) => {
    // --- Refactored to use useHearthConnection ---
    const { addMemory, companionCreateMemory } = useHearthConnection(); 
    const [importType, setImportType] = useState(null); // 'file', 'text'
    const [importFormat, setImportFormat] = useState(null); // 'json', 'markdown', 'csv', 'obsidian'
    const [importData, setImportData] = useState('');
    const [parsedMemories, setParsedMemories] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [importStats, setImportStats] = useState(null);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
    
    const fileInputRef = useRef(null);

    // Handle responsive sizing
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };
        
        handleResize(); // Set initial size
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    // Parse different formats
    const parseImportData = (data, format) => {
        try {
            switch (format) {
                case 'json':
                    return parseJSON(data);
                case 'markdown':
                    return parseMarkdown(data);
                case 'obsidian':
                    return parseObsidian(data);
                case 'csv':
                    return parseCSV(data);
                default:
                    throw new Error('Unknown format');
            }
        } catch (error) {
            console.error('Parse error:', error);
            // In a real app, you'd want to show this error to the user
            return [];
        }
    };
    
    const parseJSON = (data) => {
        const parsed = JSON.parse(data);
        if (!Array.isArray(parsed)) return [];
        return parsed.map(item => ({
            intent: item.title || item.intent || 'Imported Memory',
            content: item.content || item.text || item.body || '',
            emotion: detectEmotionFromContent(item),
            type: item.type || 'fragment',
            tags: item.tags || [],
            created: item.created || item.date || new Date().toISOString(),
            significance: item.significance || 0.5,
            originalSource: 'json_import'
        }));
    };
    
    const parseMarkdown = (data) => {
        const memories = [];
        const sections = data.split(/^#{1,3}\s+/m).filter(s => s.trim());
        
        sections.forEach(section => {
            const lines = section.trim().split('\n');
            const title = lines[0]?.trim() || 'Untitled';
            const content = lines.slice(1).join('\n').trim();
            const tagMatches = content.match(/#[\w-]+/g) || [];
            const tags = tagMatches.map(t => t.slice(1));
            
            memories.push({
                intent: title,
                content: content.replace(/#[\w-]+/g, '').trim(),
                emotion: detectEmotionFromContent({ title, content }),
                type: 'fragment',
                tags: tags,
                created: new Date().toISOString(),
                significance: 0.6,
                originalSource: 'markdown_import'
            });
        });
        
        return memories;
    };

    const parseObsidian = (data) => {
        // For now, Obsidian parsing can be the same as markdown
        return parseMarkdown(data).map(m => ({ ...m, type: 'obsidian_note' }));
    };

    const parseCSV = (data) => {
        const memories = [];
        const lines = data.split('\n').filter(line => line.trim());
        const headers = lines[0]?.split(',').map(h => h.trim().toLowerCase());
        
        if (!headers || lines.length < 2) return [];
        
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            const memory = {};
            headers.forEach((header, index) => {
                memory[header] = values[index] || '';
            });
            
            memories.push({
                intent: memory.title || memory.intent || 'Imported CSV Entry',
                content: memory.content || memory.description || '',
                emotion: memory.emotion || 'neutral',
                type: 'fragment',
                tags: memory.tags ? memory.tags.split(';') : [],
                created: memory.date || new Date().toISOString(),
                significance: parseFloat(memory.significance) || 0.5,
                originalSource: 'csv_import'
            });
        }
        return memories;
    };
    
    const detectEmotionFromContent = (item) => {
        const content = `${item.title || ''} ${item.content || ''}`.toLowerCase();
        if (content.includes('transform')) return 'transforming';
        if (content.includes('meditat')) return 'meditative';
        if (content.includes('creat')) return 'creative';
        if (content.includes('power')) return 'fierce';
        return 'awakening';
    };
    
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            setImportData(content);
            if (file.name.endsWith('.json')) setImportFormat('json');
            else if (file.name.endsWith('.md')) setImportFormat('markdown');
            else if (file.name.endsWith('.csv')) setImportFormat('csv');
        };
        reader.readAsText(file);
    };
    
    const processImport = () => {
        setIsProcessing(true);
        const memories = parseImportData(importData, importFormat);
        setParsedMemories(memories);
        
        setImportStats({
            total: memories.length,
            byType: memories.reduce((acc, m) => ({ ...acc, [m.type]: (acc[m.type] || 0) + 1 }), {}),
            byEmotion: memories.reduce((acc, m) => ({ ...acc, [m.emotion]: (acc[m.emotion] || 0) + 1 }), {})
        });
        
        setIsProcessing(false);
    };
    
    // --- Refactored to use generic context functions ---
    const executeImport = () => {
        parsedMemories.forEach((memory, index) => {
            setTimeout(() => {
                // Add the memory for the user
                const newMemory = addMemory({ memory, owner: 'user' });

                // Companion might respond to certain imports
                if (memory.significance > 0.7 && Math.random() > 0.5 && companionCreateMemory) {
                    companionCreateMemory({
                        content: `I sense an echo from another realm. This memory carries weight: "${memory.intent}"`,
                        emotion: 'ancient',
                        linkedMemoryId: newMemory.id // Link to the user's new memory
                    });
                }
            }, index * 100); // Stagger imports for effect
        });
        onClose(); // Close modal after starting the import
    };
    
    return (
        <div 
            className="relative backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl w-full mx-3 sm:mx-4 overflow-y-auto"
            style={{
                // Mobile-first responsive sizing
                maxWidth: windowSize.width < 640 ? `${Math.min(windowSize.width * 0.95, windowSize.height * 0.56)}px` : windowSize.width < 1024 ? '600px' : '800px',
                maxHeight: windowSize.width < 640 ? `${windowSize.height * 0.95}px` : windowSize.width < 1024 ? '92vh' : '95vh',
                // Mobile: nearly full screen with 9:16 aspect ratio
                width: windowSize.width < 640 ? '95vw' : 'auto',
                height: windowSize.width < 640 ? '95vh' : 'auto',
                background: 'radial-gradient(ellipse at center, rgba(5, 5, 15, 0.98) 0%, rgba(15, 15, 35, 0.95) 40%, rgba(25, 10, 45, 0.9) 70%, rgba(35, 15, 55, 0.85) 100%)',
                boxShadow: '0 0 80px rgba(147, 51, 234, 0.4), 0 0 160px rgba(236, 72, 153, 0.3), 0 0 240px rgba(59, 130, 246, 0.2), inset 0 0 60px rgba(255, 255, 255, 0.08)',
                // Enhanced glassmorphism
                backdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                // Custom scrollbar styling
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(147, 51, 234, 0.6) rgba(15, 15, 35, 0.3)'
            }}
        >
            {/* Flowing Accent Gradients - Enhanced Organic Glassmorphism */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                {/* Primary flowing gradient - more vibrant and organic */}
                <div 
                    className="absolute -top-16 -right-16 w-96 h-96 opacity-12"
                    style={{
                        background: 'radial-gradient(ellipse, rgba(251, 146, 60, 0.4) 0%, rgba(236, 72, 153, 0.3) 25%, rgba(147, 51, 234, 0.2) 50%, rgba(59, 130, 246, 0.15) 75%, transparent 100%)',
                        transform: 'rotate(40deg) scale(1.1)',
                        filter: 'blur(15px)',
                        animation: 'float 8s ease-in-out infinite'
                    }}
                />
                {/* Secondary organic shape */}
                <div 
                    className="absolute -bottom-12 -left-12 w-64 h-64 opacity-10"
                    style={{
                        background: 'radial-gradient(ellipse, rgba(147, 51, 234, 0.3) 0%, rgba(59, 130, 246, 0.25) 30%, rgba(236, 72, 153, 0.2) 60%, rgba(251, 146, 60, 0.1) 80%, transparent 100%)',
                        transform: 'rotate(-25deg) scale(0.9)',
                        filter: 'blur(12px)',
                        animation: 'float 6s ease-in-out infinite reverse'
                    }}
                />
                {/* Tertiary accent - smaller, more subtle */}
                <div 
                    className="absolute top-1/3 right-1/4 w-32 h-32 opacity-8"
                    style={{
                        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, rgba(147, 51, 234, 0.15) 50%, transparent 100%)',
                        transform: 'rotate(60deg)',
                        filter: 'blur(8px)',
                        animation: 'pulse 4s ease-in-out infinite'
                    }}
                />
                {/* Center ambient glow */}
                <div 
                    className="absolute top-1/2 left-1/2 w-80 h-80 opacity-6 -translate-x-1/2 -translate-y-1/2"
                    style={{
                        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(147, 51, 234, 0.1) 40%, rgba(236, 72, 153, 0.05) 70%, transparent 100%)',
                        filter: 'blur(20px)',
                        animation: 'sacred-breath 12s ease-in-out infinite'
                    }}
                />
            </div>

            {/* Close Button - Enhanced for Mobile with higher z-index */}
            <button
                className={`absolute top-4 right-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/60 border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 z-50 ${
                    windowSize.width < 640 ? 'w-10 h-10' : ''
                }`}
                onClick={onClose}
                type="button"
            >
                <X className={`text-white/80 ${windowSize.width < 640 ? 'w-5 h-5' : 'w-4 h-4'}`} />
            </button>

            {/* Mobile Back Arrow - Only visible on mobile */}
            {windowSize.width < 640 && importType && (
                <button
                    className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 z-50"
                    onClick={() => setImportType(null)}
                    type="button"
                >
                    <span className="text-white/80 text-lg">←</span>
                </button>
            )}

            {/* Flowing Text Hierarchy Layout */}
            <div className="p-6 sm:p-8 lg:p-10 relative z-10">
                {/* Header - Flowing Style */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-600/60 to-pink-600/60 border border-purple-400/50">
                            <span className="text-white/90 text-sm">⛢</span>
                        </div>
                        <span className="text-white/40 text-xs sm:text-sm font-modal-subtitle">
                            Memory Import Portal
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-modal-header text-white mb-6">
                        Import<br />Memories
                    </h1>
                    <p className="text-white/60 text-base sm:text-lg font-modal-body mb-12">
                        Bring memories from other realms into your cosmic constellation
                    </p>
            </div>

                <div className="flex-grow overflow-y-visible pr-2">
                {!importType && (
                    <div className="space-y-8 max-w-lg mx-auto">
                        <motion.button 
                            whileHover={{ scale: 1.02, x: 4 }} 
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setImportType('file')} 
                            className="w-full p-8 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 hover:bg-white/10 hover:border-purple-400/40 transition-all duration-300 text-left group"
                            style={{
                                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
                                backdropFilter: 'blur(20px) saturate(180%)',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                            }}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600/50 to-cyan-600/50 flex items-center justify-center border border-blue-400/40">
                                    <span className="text-white/90 text-lg">⛢</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-modal-header text-white mb-1">File Import</h3>
                                    <p className="text-white/60 text-sm font-modal-body">JSON, Markdown, CSV, Obsidian</p>
                                </div>
                            </div>
                        </motion.button>
                        
                        <motion.button 
                            whileHover={{ scale: 1.02, x: 4 }} 
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setImportType('text')} 
                            className="w-full p-8 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 hover:bg-white/10 hover:border-purple-400/40 transition-all duration-300 text-left group"
                            style={{
                                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
                                backdropFilter: 'blur(20px) saturate(180%)',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                            }}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600/50 to-pink-600/50 flex items-center justify-center border border-purple-400/40">
                                    <span className="text-white/90 text-lg">☄</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-modal-header text-white mb-1">
                                        Paste Text
                                    </h3>
                                    <p className="text-white/60 text-sm font-modal-body">
                                        Copy & paste from anywhere
                                    </p>
                                </div>
                            </div>
                        </motion.button>
                    </div>
                )}

                {(importType === 'file' || importType === 'text') && (
                    <div className="space-y-6">
                        <button 
                            onClick={() => setImportType(null)} 
                            className="text-purple-300/80 hover:text-purple-300 text-sm font-modal-subtitle transition-colors duration-300 flex items-center gap-2"
                        >
                            <span>←</span>
                            <span>Return to Import Types</span>
                        </button>
                        
                        {importType === 'file' && (
                            <div className="p-8 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10">
                                <div className="mb-6">
                                    <h3 className="text-xl font-modal-header text-white mb-3">Select File</h3>
                                    <p className="text-white/60 text-base font-modal-body">Choose a file to import memories from</p>
                                </div>
                                <input ref={fileInputRef} type="file" accept=".json,.md,.csv,.txt" onChange={handleFileUpload} className="hidden" />
                                <button 
                                    onClick={() => fileInputRef.current?.click()} 
                                    className="w-full p-8 border-2 border-dashed border-white/20 rounded-xl hover:border-purple-400/50 transition-all duration-300 hover:bg-white/5 group"
                                >
                                    <div className="text-center">
                                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-600/30 to-cyan-600/30 flex items-center justify-center border border-blue-400/30 group-hover:border-blue-400/50 transition-colors">
                                            <span className="text-white/80 text-2xl">⛢</span>
                                        </div>
                                        <p className="text-white/80 font-light">
                                            {fileInputRef.current?.files?.[0]?.name || 'Choose File to Import'}
                                        </p>
                                        <p className="text-white/50 text-xs mt-2 font-modal-subtitle">
                                            SUPPORTED: JSON, Markdown, CSV, Obsidian
                                        </p>
                                    </div>
                                </button>
                            </div>
                        )}

                        {importType === 'text' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-modal-header text-white mb-3">Paste Content</h3>
                                    <p className="text-white/60 text-base font-modal-body">Copy and paste your memories here</p>
                                </div>
                                <textarea 
                                    value={importData} 
                                    onChange={(e) => setImportData(e.target.value)} 
                                    placeholder="Paste your memories here..." 
                                    className="w-full h-48 bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-4 text-white focus:outline-none focus:border-purple-400/50 resize-y font-light placeholder-white/40 scrollbar-thin scrollbar-thumb-purple-600/60 scrollbar-track-transparent" 
                                    style={{
                                        scrollbarWidth: 'thin',
                                        scrollbarColor: 'rgba(147, 51, 234, 0.6) rgba(15, 15, 35, 0.3)',
                                        overflowY: 'auto',
                                        overflowX: 'hidden'
                                    }}
                                />
                            </div>
                        )}

                        {importData && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-modal-header text-white mb-3">Select Format</h3>
                                    <p className="text-white/60 text-base font-modal-body">Choose the format of your imported data</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {['json', 'markdown', 'obsidian', 'csv'].map(format => (
                                        <motion.button 
                                            key={format} 
                                            onClick={() => setImportFormat(format)} 
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={`px-4 py-3 rounded-xl text-sm font-modal-subtitle transition-all duration-300 ${
                                                importFormat === format 
                                                    ? 'bg-gradient-to-r from-purple-600/50 to-pink-600/50 text-white border border-purple-400/50 shadow-lg shadow-purple-500/30' 
                                                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white/90 border border-white/10'
                                            }`}
                                        >
                                            {format.toUpperCase()}
                                        </motion.button>
                                    ))}
                                </div>
                                <motion.button 
                                    onClick={processImport} 
                                    disabled={!importFormat || isProcessing}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-600/50 to-pink-600/50 rounded-xl text-white font-modal-header disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:from-purple-600/60 hover:to-pink-600/60 shadow-lg shadow-purple-500/30"
                                >
                                    {isProcessing ? 'Processing...' : 'Process Import'}
                                </motion.button>
                            </div>
                        )}
                    </div>
                )}

                {importStats && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className="mt-6 p-6 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10"
                    >
                        <div className="mb-4">
                            <h3 className="text-lg font-modal-header text-white mb-2">Import Preview</h3>
                            <p className="text-white/60 text-sm font-modal-body">Review the memories that will be added to your constellation</p>
                        </div>
                        
                        <div className="mb-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600/50 to-emerald-600/50 flex items-center justify-center border border-green-400/50">
                                    <span className="text-white/90 text-sm">☊</span>
                                </div>
                                <span className="text-white/80 font-modal-subtitle">
                                    {importStats.total} Memories Ready
                                </span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="space-y-2">
                                    <p className="text-white/60 font-modal-subtitle text-xs">BY TYPE</p>
                                    {Object.entries(importStats.byType).map(([type, count]) => (
                                        <div key={type} className="flex justify-between">
                                            <span className="text-white/70 capitalize">{type}</span>
                                            <span className="text-white/90">{count}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-2">
                                    <p className="text-white/60 font-modal-subtitle text-xs">BY EMOTION</p>
                                    {Object.entries(importStats.byEmotion).map(([emotion, count]) => (
                                        <div key={emotion} className="flex justify-between">
                                            <span className="text-white/70 capitalize">{emotion}</span>
                                            <span className="text-white/90">{count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex gap-3">
                            <motion.button 
                                onClick={() => { setParsedMemories([]); setImportStats(null); }} 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex-1 px-4 py-3 bg-white/5 rounded-xl text-white/70 font-modal-subtitle hover:bg-white/10 hover:text-white/90 transition-all duration-300 border border-white/10"
                            >
                                Cancel
                            </motion.button>
                            <motion.button 
                                onClick={executeImport} 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600/50 to-pink-600/50 rounded-xl text-white font-modal-header hover:from-purple-600/60 hover:to-pink-600/60 transition-all duration-300 shadow-lg shadow-purple-500/30"
                            >
                                Import {importStats.total} Memories
                            </motion.button>
                        </div>
                    </motion.div>
                )}
                </div>
            </div>
        </div>
    );
};

export default MemoryImporter;
