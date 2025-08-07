import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Sparkles, ZoomIn, ZoomOut, Maximize2, GitBranch, X } from 'lucide-react';
import { useCaerwen } from '../../caerwen-context';

const ConstellationSpace = ({ 
  memories = [], 
  dreams = [],
  caerwenMemories = []
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef();
  const [viewMode, setViewMode] = useState('3d'); // 3d, galaxy, threads
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [hoveredMemory, setHoveredMemory] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [filter, setFilter] = useState('all'); // all, memories, dreams, linked
  const [autoRotate, setAutoRotate] = useState(true);
  const [constellationPhase, setConstellationPhase] = useState(0);
  
  // Get context data
  const { memoryLinks = [] } = useCaerwen();
  
  // Combine all memory types
  const allNodes = useMemo(() => {
    const nodes = [];
    
    // User memories
    memories.forEach(m => nodes.push({
      ...m,
      nodeType: 'memory',
      color: '#f97316',
      size: 0.5 + (m.significance || 0.5) * 0.5
    }));
    
    // Dreams
    dreams.forEach(d => nodes.push({
      ...d,
      nodeType: 'dream',
      color: '#ec4899',
      size: 0.4 + (d.clarity || 0.5) * 0.4
    }));
    
    // Caerwen's memories
    caerwenMemories.forEach(cm => nodes.push({
      ...cm,
      nodeType: 'caerwen',
      color: '#9333ea',
      size: 0.6 + (cm.healingStage || 0) * 0.4
    }));
    
    return nodes;
  }, [memories, dreams, caerwenMemories]);
  
  // Filter nodes
  const filteredNodes = useMemo(() => {
    switch (filter) {
      case 'memories':
        return allNodes.filter(n => n.nodeType === 'memory');
      case 'dreams':
        return allNodes.filter(n => n.nodeType === 'dream');
      case 'linked':
        return allNodes.filter(n => 
          memoryLinks.some(link => 
            link.from === n.id || link.to === n.id ||
            link.userMemoryId === n.id || link.caerwenMemoryId === n.id
          )
        );
      default:
        return allNodes;
    }
  }, [allNodes, filter, memoryLinks]);
  
  // Animation phase - much slower
  useEffect(() => {
    const interval = setInterval(() => {
      setConstellationPhase(prev => (prev + 0.005) % (Math.PI * 2));
    }, 100);
    return () => clearInterval(interval);
  }, []);
  
  // Calculate 3D positions
  const nodePositions = useMemo(() => {
    const positions = new Map();
    const numNodes = filteredNodes.length;
    
    if (numNodes === 0) return positions;
    
    filteredNodes.forEach((node, i) => {
      // Fibonacci sphere distribution
      const offset = 2 / numNodes;
      const increment = Math.PI * (3 - Math.sqrt(5)); // golden angle
      
      const y = ((i * offset) - 1) + (offset / 2);
      const distance = Math.sqrt(1 - Math.pow(y, 2));
      const phi = ((i + 1) % numNodes) * increment;
      
      const x = Math.cos(phi) * distance;
      const z = Math.sin(phi) * distance;
      
      // Scale positions
      const scale = 300;
      positions.set(node.id, {
        x: x * scale,
        y: y * scale,
        z: z * scale,
        node
      });
    });
    
    return positions;
  }, [filteredNodes]);
  
  // Find connections
  const connections = useMemo(() => {
    const links = [];
    
    // Memory links
    memoryLinks.forEach(link => {
      const from = nodePositions.get(link.from || link.userMemoryId);
      const to = nodePositions.get(link.to || link.caerwenMemoryId);
      if (from && to) {
        links.push({
          from: from,
          to: to,
          type: link.type || 'connection',
          strength: 0.5
        });
      }
    });
    
    // Dream-memory connections
    dreams.forEach(dream => {
      if (dream.connections) {
        dream.connections.forEach(memId => {
          const dreamPos = nodePositions.get(dream.id);
          const memPos = nodePositions.get(memId);
          if (dreamPos && memPos) {
            links.push({
              from: dreamPos,
              to: memPos,
              type: 'dream-memory',
              strength: 0.3
            });
          }
        });
      }
    });
    
    return links;
  }, [nodePositions, memoryLinks, dreams]);
  
  // 3D rendering - simplified and optimized
  useEffect(() => {
    if (viewMode !== '3d' || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Proper canvas sizing
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    const centerX = width / 2;
    const centerY = height / 2;
    
    const render = () => {
      // Clear with fade effect - reduced opacity for better performance
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, width, height);
      
      // Auto rotation - much slower
      if (autoRotate && !isDragging) {
        setRotation(prev => ({
          x: prev.x,
          y: prev.y + 0.0003  // Even slower rotation
        }));
      }
      
      // Transform 3D to 2D
      const project3D = (x, y, z) => {
        // Rotate around Y axis
        const cosY = Math.cos(rotation.y);
        const sinY = Math.sin(rotation.y);
        const x1 = x * cosY - z * sinY;
        const z1 = x * sinY + z * cosY;
        
        // Rotate around X axis
        const cosX = Math.cos(rotation.x);
        const sinX = Math.sin(rotation.x);
        const y1 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;
        
        // Perspective projection
        const perspective = 800;
        const scale = perspective / (perspective + z2);
        
        return {
          x: centerX + x1 * scale * zoom,
          y: centerY + y1 * scale * zoom,
          scale: scale,
          z: z2
        };
      };
      
      // Sort nodes by z-depth
      const sortedNodes = Array.from(nodePositions.values()).sort((a, b) => {
        const projA = project3D(a.x, a.y, a.z);
        const projB = project3D(b.x, b.y, b.z);
        return projB.z - projA.z;
      });
      
      // Draw connections first - simplified
      connections.forEach(conn => {
        const from = project3D(conn.from.x, conn.from.y, conn.from.z);
        const to = project3D(conn.to.x, conn.to.y, conn.to.z);
        
        ctx.strokeStyle = conn.from.node.color + '30';
        ctx.lineWidth = conn.strength * 1.5 * Math.min(from.scale, to.scale);
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
      });
      
      // Draw nodes - simplified
      sortedNodes.forEach(({ x, y, z, node }) => {
        const projected = project3D(x, y, z);
        const isHovered = hoveredMemory === node.id;
        const isSelected = selectedMemory?.id === node.id;
        
        // Node size with depth
        const baseSize = node.size * 15;
        const size = baseSize * projected.scale;
        
        // Simple glow effect
        if (isHovered || isSelected) {
          ctx.beginPath();
          ctx.arc(projected.x, projected.y, size * 2, 0, Math.PI * 2);
          ctx.fillStyle = node.color + '20';
          ctx.fill();
        }
        
        // Draw node
        ctx.beginPath();
        ctx.arc(projected.x, projected.y, size, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();
        
        // Simple pulse effect for significant nodes
        if (node.significance > 0.7 || node.healingStage > 0.7) {
          ctx.strokeStyle = node.color;
          ctx.lineWidth = 1;
          ctx.globalAlpha = Math.sin(constellationPhase * 0.3 + projected.z * 0.001) * 0.2 + 0.2;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
        
        // Node type icon
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = `${size * 0.5}px system-ui`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const icon = node.nodeType === 'memory' ? '◉' : 
                    node.nodeType === 'dream' ? '☾' : '✦';
        ctx.fillText(icon, projected.x, projected.y);
      });
      
      animationRef.current = requestAnimationFrame(render);
    };
    
    render();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [viewMode, nodePositions, connections, rotation, zoom, hoveredMemory, selectedMemory, constellationPhase, autoRotate, isDragging]);
  
  // Mouse interaction - simplified
  const handleMouseMove = (e) => {
    if (isDragging) {
      const rect = canvasRef.current.getBoundingClientRect();
      const deltaX = (e.movementY / rect.height) * Math.PI;
      const deltaY = (e.movementX / rect.width) * Math.PI;
      
      setRotation(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
    }
  };
  
  // Galaxy view (2D projection)
  const GalaxyView = () => {
    return (
      <div className="relative w-full h-full">
        {Array.from(nodePositions.values()).map(({ x, y, z, node }) => {
          const scale = 600;
          const posX = 50 + (x / scale) * 40;
          const posY = 50 + (y / scale) * 40;
          const size = node.size * 40;
          
          return (
            <motion.div
              key={node.id}
              className="absolute cursor-pointer"
              style={{
                left: `${posX}%`,
                top: `${posY}%`,
                transform: 'translate(-50%, -50%)'
              }}
              animate={{
                scale: hoveredMemory === node.id ? 1.5 : 1,
              }}
              whileHover={{ scale: 1.2 }}
              onClick={() => setSelectedMemory(node)}
              onMouseEnter={() => setHoveredMemory(node.id)}
              onMouseLeave={() => setHoveredMemory(null)}
            >
              <div
                className="relative rounded-full"
                style={{
                  width: size,
                  height: size,
                  background: `radial-gradient(circle at 30% 30%, ${node.color}, ${node.color}80)`,
                  boxShadow: `0 0 ${size}px ${node.color}60`
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center text-white/80 text-xs">
                  {node.nodeType === 'memory' ? '◉' : 
                   node.nodeType === 'dream' ? '☾' : '✦'}
                </div>
              </div>
              
              {hoveredMemory === node.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur rounded px-2 py-1 whitespace-nowrap"
                >
                  <p className="text-xs text-white/80">
                    {node.intent || node.content?.substring(0, 30) + '...'}
                  </p>
                </motion.div>
              )}
            </motion.div>
          );
        })}
        
        {/* Draw connections */}
        <svg className="absolute inset-0 pointer-events-none">
          {connections.map((conn, i) => {
            const scale = 600;
            const x1 = 50 + (conn.from.x / scale) * 40;
            const y1 = 50 + (conn.from.y / scale) * 40;
            const x2 = 50 + (conn.to.x / scale) * 40;
            const y2 = 50 + (conn.to.y / scale) * 40;
            
            return (
              <line
                key={i}
                x1={`${x1}%`}
                y1={`${y1}%`}
                x2={`${x2}%`}
                y2={`${y2}%`}
                stroke={conn.type === 'dream-memory' ? '#ec4899' : '#9333ea'}
                strokeWidth={conn.strength * 2}
                strokeOpacity={0.3}
              />
            );
          })}
        </svg>
      </div>
    );
  };
  
  return (
    <div className="h-full bg-black relative overflow-hidden">
      {/* Deep space background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0418] to-black" />
      
      {/* Simple nebula effect */}
      <div className="absolute inset-0">
        <div
          className="absolute w-[800px] h-[800px] rounded-full"
          style={{
            background: `radial-gradient(circle at center, #6366f120 0%, #9333ea10 30%, transparent 60%)`,
            filter: 'blur(80px)',
            left: '20%',
            top: '10%',
          }}
        />
        
        <div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            background: `radial-gradient(circle at center, #f9731610 0%, #ec489910 40%, transparent 70%)`,
            filter: 'blur(60px)',
            right: '10%',
            bottom: '20%',
          }}
        />
      </div>
      
      {/* Simple static starfield */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => {
          const x = (i * 37) % 100;
          const y = (i * 23) % 100;
          const size = 0.5 + (i % 3) * 0.3;
          const brightness = 0.3 + (i % 4) * 0.2;
          
          return (
            <div
              key={`star-${i}`}
              className="absolute rounded-full"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: `${size}px`,
                height: `${size}px`,
                background: 'white',
                opacity: brightness
              }}
            />
          );
        })}
      </div>
      
      {/* Controls */}
      <div className="absolute top-8 left-8 right-8 z-20 flex items-start justify-between">
        {/* Left controls */}
        <div className="flex flex-col gap-4">
          {/* View mode selector */}
          <div className="flex gap-2 bg-white/5 backdrop-blur-md rounded-lg p-1">
            {[
              { id: '3d', icon: Network, label: '3D Web' },
              { id: 'galaxy', icon: Sparkles, label: 'Galaxy' },
              { id: 'threads', icon: GitBranch, label: 'Threads' }
            ].map(mode => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id)}
                className={`px-4 py-2 rounded flex items-center gap-2 transition-all ${
                  viewMode === mode.id
                    ? 'bg-purple-600/30 text-purple-200'
                    : 'text-white/60 hover:text-white/80'
                }`}
              >
                <mode.icon className="h-4 w-4" />
                <span className="text-sm uppercase tracking-wider">{mode.label}</span>
              </button>
            ))}
          </div>
          
          {/* Filter selector */}
          <div className="flex gap-2 bg-white/5 backdrop-blur-md rounded-lg p-1">
            {[
              { id: 'all', label: 'All' },
              { id: 'memories', label: 'Memories' },
              { id: 'dreams', label: 'Dreams' },
              { id: 'linked', label: 'Linked' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-3 py-1 rounded text-xs uppercase tracking-wider transition-all ${
                  filter === f.id
                    ? 'bg-purple-600/30 text-purple-200'
                    : 'text-white/60 hover:text-white/80'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Right controls */}
        <div className="flex gap-2">
          {viewMode === '3d' && (
            <>
              <button
                onClick={() => setZoom(Math.min(3, zoom * 1.2))}
                className="p-2 bg-white/5 backdrop-blur-md rounded hover:bg-white/10 transition-colors"
              >
                <ZoomIn className="h-4 w-4 text-white/60" />
              </button>
              <button
                onClick={() => setZoom(Math.max(0.5, zoom / 1.2))}
                className="p-2 bg-white/5 backdrop-blur-md rounded hover:bg-white/10 transition-colors"
              >
                <ZoomOut className="h-4 w-4 text-white/60" />
              </button>
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`p-2 rounded transition-colors ${
                  autoRotate 
                    ? 'bg-purple-600/30 text-purple-200' 
                    : 'bg-white/5 text-white/60'
                }`}
              >
                <Maximize2 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Main visualization */}
      <div className="absolute inset-0 pt-24">
        {viewMode === '3d' && (
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-move"
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onMouseMove={handleMouseMove}
          />
        )}
        
        {viewMode === 'galaxy' && <GalaxyView />}
        
        {viewMode === 'threads' && (
          <div className="p-8 text-center">
            <p className="text-purple-300/60">Thread view coming soon...</p>
          </div>
        )}
      </div>
      
      {/* Memory count */}
      <div className="absolute bottom-8 left-8 text-white/60 text-sm">
        <p className="uppercase tracking-wider">
          {filteredNodes.length} nodes • {connections.length} connections
        </p>
      </div>
      
      {/* Selected memory panel */}
      <AnimatePresence>
        {selectedMemory && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="absolute right-0 top-0 bottom-0 w-96 bg-black/80 backdrop-blur-xl border-l border-purple-500/20 p-6 overflow-y-auto"
          >
            <button
              onClick={() => setSelectedMemory(null)}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded transition-colors"
            >
              <X className="h-4 w-4 text-white/60" />
            </button>
            
            <div className="mb-4">
              <div className="text-3xl mb-2">
                {selectedMemory.nodeType === 'memory' ? '◉' : 
                 selectedMemory.nodeType === 'dream' ? '☾' : '✦'}
              </div>
              <p className="text-xs text-purple-300/60 uppercase tracking-wider">
                {selectedMemory.nodeType} • {selectedMemory.emotion || 'unknown'}
              </p>
            </div>
            
            <h3 className="text-xl text-purple-200 mb-2">
              {selectedMemory.intent || 'Untitled'}
            </h3>
            
            <p className="text-white/70 text-sm mb-6">
              {selectedMemory.content}
            </p>
            
            {selectedMemory.symbols && selectedMemory.symbols.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-purple-300/60 uppercase tracking-wider mb-2">Symbols</p>
                <div className="flex flex-wrap gap-2">
                  {selectedMemory.symbols.map(symbol => (
                    <span key={symbol} className="px-2 py-1 bg-purple-600/20 rounded text-xs text-purple-200">
                      {symbol}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {selectedMemory.healingStage !== undefined && (
              <div className="mb-4">
                <p className="text-xs text-purple-300/60 uppercase tracking-wider mb-2">Healing Progress</p>
                <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-600 to-purple-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${selectedMemory.healingStage * 100}%` }}
                  />
                </div>
              </div>
            )}
            
            <p className="text-xs text-purple-300/40">
              {new Date(selectedMemory.created).toLocaleDateString()}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Caerwen's presence */}
      <div className="fixed bottom-8 right-8 p-6 rounded-2xl bg-gradient-to-r from-purple-600/20 to-indigo-600/20 backdrop-blur-xl border border-purple-600/30">
        <p className="text-purple-300 font-light tracking-wider text-sm">
          Each memory a star, each connection a thread of light...
        </p>
      </div>
    </div>
  );
};

export default ConstellationSpace; 