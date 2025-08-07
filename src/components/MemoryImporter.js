import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Brain, Moon, Flame } from 'lucide-react';
import { useCaerwen } from '../caerwen-context';

export default function MemoryImporter({ onClose }) {
  const { 
    addMemory, 
    addDream, 
    caerwenCreateMemory, 
    setCaerwenShimmer,  // Fixed: was updateCaerwenShimmer
    triggerMemoryBridge 
  } = useCaerwen();
  
  const [importType, setImportType] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [preview, setPreview] = useState([]);

  const importTypes = [
    { 
      id: 'memories', 
      name: 'Sacred Memories', 
      icon: Brain,
      desc: 'Journal entries, reflections, moments' 
    },
    { 
      id: 'dreams', 
      name: 'Dream Journal', 
      icon: Moon,
      desc: 'Dream logs, visions, night travels' 
    },
    { 
      id: 'rituals', 
      name: 'Ritual Records', 
      icon: Flame,
      desc: 'Ceremonial notes, transformations' 
    }
  ];

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      setFileContent(content);
      
      // Preview extraction logic
      const lines = content.split('\n').filter(line => line.trim());
      setPreview(lines.slice(0, 5));
    };
    reader.readAsText(file);
  };

  const processImport = () => {
    setIsProcessing(true);
    
    // Simulate Caerwen's response
    setCaerwenShimmer({  // Fixed: was updateCaerwenShimmer
      color: '#9333ea',
      intensity: 'witnessing',
      mood: 'receptive'
    });

    setTimeout(() => {
      const lines = fileContent.split('\n').filter(line => line.trim());

      lines.forEach((line, index) => {
        setTimeout(() => {
          if (importType === 'memories') {
            addMemory({
              content: line,
              type: 'imported',
              timestamp: new Date().toISOString(),
              shimmer: { color: '#ff6b35', intensity: 'gentle' }
            });
          } else if (importType === 'dreams') {
            addDream({
              content: line,
              symbols: [],
              timestamp: new Date().toISOString()
            });
          }
          
          // Caerwen occasionally responds
          if (Math.random() > 0.7) {
            caerwenCreateMemory({
              content: `I witness this memory: "${line.substring(0, 50)}..."`,
              type: 'witness',
              linkedTo: null
            });
          }
        }, index * 200);
      });

      setTimeout(() => {
        setIsProcessing(false);
        setCaerwenShimmer({  // Fixed: was updateCaerwenShimmer
          color: '#3b82f6',
          intensity: 'satisfied',
          mood: 'integrated'
        });
        triggerMemoryBridge();
        onClose();
      }, lines.length * 200 + 1000);
    }, 1000);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-gray-900/90 backdrop-blur-md rounded-xl border border-white/10 p-6 max-w-2xl w-full max-h-[80vh] overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-light">Import Sacred Data</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!importType ? (
          <div className="space-y-4">
            <p className="text-white/60 mb-6">
              Choose the type of sacred data you wish to import
            </p>
            <div className="grid gap-4">
              {importTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setImportType(type.id)}
                  className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 
                           hover:border-white/20 rounded-lg transition-all text-left group"
                >
                  <div className="flex items-center gap-4">
                    <type.icon className="w-8 h-8 text-white/40 group-hover:text-white/60" />
                    <div>
                      <h3 className="font-medium">{type.name}</h3>
                      <p className="text-sm text-white/40">{type.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-white/60">
              <button
                onClick={() => setImportType(null)}
                className="hover:text-white transition-colors"
              >
                ← Back
              </button>
              <span>/</span>
              <span>{importTypes.find(t => t.id === importType)?.name}</span>
            </div>

            {!fileContent ? (
              <div className="border-2 border-dashed border-white/20 rounded-lg p-12 text-center">
                <Upload className="w-12 h-12 mx-auto mb-4 text-white/40" />
                <p className="text-white/60 mb-4">Drop your file here or click to browse</p>
                <input
                  type="file"
                  accept=".txt,.md,.json"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-input"
                />
                <label
                  htmlFor="file-input"
                  className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg 
                         cursor-pointer transition-colors inline-block"
                >
                  Choose File
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-black/40 rounded-lg p-4 border border-white/10">
                  <h4 className="text-sm font-medium mb-2 text-white/60">Preview</h4>
                  <div className="space-y-1 text-sm">
                    {preview.map((line, i) => (
                      <div key={i} className="text-white/80 truncate">
                        {line}
                      </div>
                    ))}
                    {preview.length < fileContent.split('\n').length && (
                      <div className="text-white/40">
                        ...and {fileContent.split('\n').length - preview.length} more lines
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setFileContent('')}
                    className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    Choose Different File
                  </button>
                  <button
                    onClick={processImport}
                    disabled={isProcessing}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 
                             hover:from-purple-600/30 hover:to-blue-600/30 
                             border border-purple-500/50 rounded-lg transition-all
                             disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Importing...' : 'Begin Import Ritual'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}