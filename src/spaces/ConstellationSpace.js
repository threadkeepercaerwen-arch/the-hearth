import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Sparkles, X, Home } from 'lucide-react';
import { useHearthConnection } from '../hearth-context';

const ConstellationSpace = ({ onNavigateHome, onToggleNav }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef();
  const [viewMode, setViewMode] = useState('3d'); // 3d, galaxy, threads
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [hoveredMemory, setHoveredMemory] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 }); // Camera position
  const [isDragging, setIsDragging] = useState(false);
  const [filter, setFilter] = useState('all'); // all, memories, dreams, linked
  const [autoRotate, setAutoRotate] = useState(true);
  const [constellationPhase, setConstellationPhase] = useState(0);
  const [showNavigationMenu, setShowNavigationMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showInfoMenu, setShowInfoMenu] = useState(false);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 }); // Will be set by canvas resize handler
  
  // Get context data - dual memory system
  const { 
    memories = [], // Human memories
    companionMemories = [], // AI companion memories
    dreams = [], // Human dreams
    memoryLinks = [], // Links between human and AI memories
  } = useHearthConnection();
  
  
  // Combine all memory types with dual memory system
  const allNodes = useMemo(() => {
    const nodes = [];
    
    // Human memories - Rustic orange gradient for warmth and human presence
    memories.forEach(m => nodes.push({
      ...m,
      nodeType: 'human-memory',
      color: '#BD591A', // Rustic orange
      gradient: 'radial-gradient(circle, #F4A261 0%, #BD591A 30%, #8B4513 100%)', // More dramatic rustic gradient
      size: 0.8 + (m.significance || 0.5) * 0.7, // Larger size to show gradient
      shimmer: '#D46A1F', // Slightly lighter rustic shimmer
      id: m.id || `human-${Date.now()}-${Math.random()}`
    }));
    
    // AI companion memories - Vibrant purple gradient for consciousness and depth
    companionMemories.forEach(cm => nodes.push({
      ...cm,
      nodeType: 'companion-memory',
      color: '#941AE6', // Vibrant mystical purple
      gradient: 'radial-gradient(circle, #D946EF 0%, #941AE6 30%, #6B1A8B 100%)', // More dramatic mystical gradient
      size: 0.9 + (cm.significance || 0.5) * 0.6, // Larger size to show gradient
      shimmer: '#B847F0', // Slightly lighter vibrant purple shimmer
      id: cm.id || `companion-${Date.now()}-${Math.random()}`
    }));
    
    // Human dreams - Pink/magenta for the ethereal
    dreams.forEach(d => nodes.push({
      ...d,
      nodeType: 'dream',
      color: '#ec4899', // Pink/magenta
      size: 0.4 + (d.clarity || 0.5) * 0.4,
      shimmer: '#f472b6', // Soft pink shimmer
      id: d.id || `dream-${Date.now()}-${Math.random()}`
    }));
    
    return nodes;
  }, [memories, companionMemories, dreams]);
  
  // Filter nodes with dual memory system
  const filteredNodes = useMemo(() => {
    switch (filter) {
      case 'human-memories':
        return allNodes.filter(n => n.nodeType === 'human-memory');
      case 'companion-memories':
        return allNodes.filter(n => n.nodeType === 'companion-memory');
      case 'dreams':
        return allNodes.filter(n => n.nodeType === 'dream');
      case 'linked':
        return allNodes.filter(n => 
          memoryLinks.some(link => 
            link.humanMemoryId === n.id || link.companionMemoryId === n.id ||
            link.from === n.id || link.to === n.id
          )
        );
      case 'human-only':
        return allNodes.filter(n => n.nodeType === 'human-memory' || n.nodeType === 'dream');
      case 'companion-only':
        return allNodes.filter(n => n.nodeType === 'companion-memory');
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
  
  // Auto rotation - separate from render loop
  useEffect(() => {
    if (!autoRotate || isDragging) return;
    
    const interval = setInterval(() => {
      setRotation(prev => ({
        x: prev.x,
        y: prev.y + 0.001  // Slow, steady rotation
      }));
    }, 50);
    
    return () => clearInterval(interval);
  }, [autoRotate, isDragging]);
  
  // Viewport change listener - removed to prevent conflicts with 3D canvas resize handler
  
  // Calculate 3D positions - this will be used by ALL views
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
      
      // Scale positions - fixed scale to prevent infinite loops
      const scale = 150;
      positions.set(node.id, {
        x: x * scale,
        y: y * scale,
        z: z * scale,
        node
      });
    });
    
    return positions;
  }, [filteredNodes]);
  
  // Helper function to project 3D positions to 2D for Galaxy and Thread views
  const projectTo2D = useCallback((x, y, z, viewType = 'galaxy') => {
    const centerX = 50;
    const centerY = 50;
    
    if (viewType === 'galaxy') {
      // Galaxy view: simple 2D projection with better scaling
      const scale = 400; // Reduced scale for better visibility
      const spread = 30; // Increased spread for better distribution
      return {
        x: Math.max(10, Math.min(90, centerX + (x / scale) * spread)),
        y: Math.max(10, Math.min(90, centerY + (y / scale) * spread))
      };
    } else if (viewType === 'thread') {
      // Thread view: slightly different projection for organic feel
      const scale = 400; // Reduced scale for better visibility
      const spread = 25; // Increased spread for better distribution
      return {
        x: Math.max(10, Math.min(90, centerX + (x / scale) * spread)),
        y: Math.max(10, Math.min(90, centerY + (y / scale) * spread))
      };
    }
    
    return { x: centerX, y: centerY };
  }, []);
  
  // Get projected position of hovered node for 3D tooltip
  const getHoveredNodeProjectedPosition = useCallback(() => {
    if (!hoveredMemory || !canvasRef.current) return null;
    
    const hoveredNodePos = nodePositions.get(hoveredMemory);
    if (!hoveredNodePos) return null;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const centerX = width / 2;
    const centerY = height / 2;
    
    const { x, y, z } = hoveredNodePos;
    
    // Apply same transformations as in render
    const offsetX = x - position.x;
    const offsetY = y - position.y;
    const offsetZ = z - position.z;
    
    // Rotate around Y axis
    const cosY = Math.cos(rotation.y);
    const sinY = Math.sin(rotation.y);
    const x1 = offsetX * cosY - offsetZ * sinY;
    const z1 = offsetX * sinY + offsetZ * cosY;
    
    // Rotate around X axis
    const cosX = Math.cos(rotation.x);
    const sinX = Math.sin(rotation.x);
    const y1 = offsetY * cosX - z1 * sinX;
    const z2 = offsetY * sinX + z1 * cosX;
    
    // Project to 2D
    const perspective = 800;
    const scale = perspective / (perspective + z2);
    
    const projectedX = centerX + x1 * scale * zoom;
    const projectedY = centerY + y1 * scale * zoom;
    
    return {
      x: projectedX + rect.left, // Convert to screen coordinates
      y: projectedY + rect.top
    };
  }, [hoveredMemory, nodePositions, position, rotation, zoom]);
  
  // Find connections
  const connections = useMemo(() => {
    const links = [];
    
    // Memory links
    memoryLinks.forEach(link => {
      const from = nodePositions.get(link.from || link.userMemoryId);
      const to = nodePositions.get(link.to || link.companionMemoryId);
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
    
    // Debug: Log when 3D rendering starts (disabled to prevent console flooding)
    // console.log('🎯 3D Rendering Start:', {
    //   viewMode,
    //   viewportSize,
    //   canvasRect: canvasRef.current.getBoundingClientRect(),
    //   zoom,
    //   position,
    //   nodeCount: filteredNodes.length
    // });
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Proper canvas sizing - use window dimensions for consistency
    const resizeCanvas = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    
    resizeCanvas();
    
    // Initialize viewportSize with window dimensions
    setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    
    // Add viewport change listener to trigger re-render
    const handleResize = () => {
      resizeCanvas();
      // Update viewportSize using window dimensions for consistency
      setViewportSize({ width: window.innerWidth, height: window.innerHeight });
      // Force a re-render by updating constellation phase
      setConstellationPhase(prev => prev + 0.001);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Canvas setup complete
    
    const render = () => {
      // Get current canvas dimensions dynamically
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      // const centerX = width / 2;
      // const centerY = height / 2;
      
      // Clear canvas completely to prevent flicker
      ctx.clearRect(0, 0, width, height);
      
      // Rendering nodes
      
      // Auto rotation handled separately - don't update state in render
      
      // Transform 3D to 2D with camera position - using current canvas dimensions
      const project3D = (x, y, z) => {
        // Get current canvas display dimensions for accurate projection
        const rect = canvas.getBoundingClientRect();
        const currentWidth = rect.width;
        const currentHeight = rect.height;
        const currentCenterX = currentWidth / 2;
        const currentCenterY = currentHeight / 2;
        
        // Apply camera position offset
        const offsetX = x - position.x;
        const offsetY = y - position.y;
        const offsetZ = z - position.z;
        
        // Rotate around Y axis
        const cosY = Math.cos(rotation.y);
        const sinY = Math.sin(rotation.y);
        const x1 = offsetX * cosY - offsetZ * sinY;
        const z1 = offsetX * sinY + offsetZ * cosY;
        
        // Rotate around X axis
        const cosX = Math.cos(rotation.x);
        const sinX = Math.sin(rotation.x);
        const y1 = offsetY * cosX - z1 * sinX;
        const z2 = offsetY * sinX + z1 * cosX;
        
        // Perspective projection - adaptive to current canvas size
        const basePerspective = 600;
        const canvasFactor = Math.min(currentWidth, currentHeight) / 400;
        const perspective = basePerspective * Math.max(0.3, Math.min(3, canvasFactor));
        const scale = perspective / (perspective + z2);
        
        return {
          x: currentCenterX + x1 * scale * zoom,
          y: currentCenterY + y1 * scale * zoom,
          scale: scale,
          z: z2
        };
      };
      
      // Calculate 3D positions dynamically for current canvas size
      const dynamicNodePositions = new Map();
      filteredNodes.forEach((node, i) => {
        // Fibonacci sphere distribution
        const offset = 2 / filteredNodes.length;
        const increment = Math.PI * (3 - Math.sqrt(5)); // golden angle
        
        const y = ((i * offset) - 1) + (offset / 2);
        const distance = Math.sqrt(1 - Math.pow(y, 2));
        const phi = ((i + 1) % filteredNodes.length) * increment;
        
        const x = Math.cos(phi) * distance;
        const z = Math.sin(phi) * distance;
        
        // Scale positions - responsive to current canvas size
        const scale = 150;
        dynamicNodePositions.set(node.id, {
          x: x * scale,
          y: y * scale,
          z: z * scale,
          node
        });
      });

      // Sort nodes by z-depth
      const sortedNodes = Array.from(dynamicNodePositions.values()).sort((a, b) => {
        const projA = project3D(a.x, a.y, a.z);
        const projB = project3D(b.x, b.y, b.z);
        return projB.z - projA.z;
      });
      
      // Draw connections first - simplified
      connections.forEach(conn => {
        const from = project3D(conn.from.x, conn.from.y, conn.from.z);
        const to = project3D(conn.to.x, conn.to.y, conn.to.z);
        
        ctx.strokeStyle = conn.from.node.color + '30';
        const viewportScale = Math.min(viewportSize.width, viewportSize.height) / 600; // Less aggressive scaling
        const clampedScale = Math.max(0.5, Math.min(2, viewportScale)); // Clamp between 0.5 and 2
        ctx.lineWidth = conn.strength * 1.5 * Math.min(from.scale, to.scale) * clampedScale;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
      });
      
      // Draw nodes - simplified
      sortedNodes.forEach(({ x, y, z, node }, i) => {
        const projected = project3D(x, y, z);
        const isHovered = hoveredMemory === node.id;
        const isSelected = selectedMemory?.id === node.id;
        
        // Project node to 2D
        
        // Node size with depth and zoom - simplified approach
        const baseSize = node.size * 20; // Consistent base size
        const size = Math.max(6, baseSize * projected.scale * zoom); // Minimum size of 6px
        
        // Zoom applied to node size
        
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
        if (node.significance > 0.7) {
          ctx.strokeStyle = node.color;
          ctx.lineWidth = 1;
          ctx.globalAlpha = Math.sin(constellationPhase * 0.3 + projected.z * 0.001) * 0.2 + 0.2;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
        
        // Node type icon
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = `${size * 0.6}px system-ui`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const icon = node.nodeType === 'memory' ? '◉' : 
                    node.nodeType === 'dream' ? '☾' : 
                    node.nodeType === 'companion' ? '✦' : '◈';
        ctx.fillText(icon, projected.x, projected.y);
      });
      
      animationRef.current = requestAnimationFrame(render);
    };
    
    render();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [viewMode, nodePositions, connections, rotation, position, zoom, hoveredMemory, selectedMemory, constellationPhase, autoRotate, isDragging]);
  
  // Viewport change listener for 2D views (Galaxy and Thread)
  useEffect(() => {
    if (viewMode === 'galaxy' || viewMode === 'threads') {
      const handleViewportChange = () => {
        // Force re-render of 2D views when viewport changes
        setConstellationPhase(prev => prev + 0.001);
      };
      
      window.addEventListener('resize', handleViewportChange);
      
      return () => {
        window.removeEventListener('resize', handleViewportChange);
      };
    }
  }, [viewMode]);
  
  // Mouse interaction - improved
  const handleMouseMove = (e) => {
    // Update mouse position for 3D tooltip
    
    if (isDragging) {
      const sensitivity = 0.005; // Reduced sensitivity for smoother control
      const deltaX = e.movementY * sensitivity;
      const deltaY = e.movementX * sensitivity;
      
      setRotation(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
    }
  };



  // Add non-passive wheel event listener to prevent console errors
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && viewMode === '3d') {
      const wheelHandler = (e) => {
        e.preventDefault();
        const zoomSensitivity = 0.001;
        const deltaZoom = e.deltaY * zoomSensitivity;
        setZoom(prev => Math.max(0.5, Math.min(3, prev - deltaZoom)));
      };
      
      canvas.addEventListener('wheel', wheelHandler, { passive: false });
      
      return () => {
        canvas.removeEventListener('wheel', wheelHandler);
      };
    }
  }, [viewMode]);

  // Close expandable menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showFilterMenu || showNavigationMenu || showInfoMenu) {
        // Check if click is outside the menu areas
        const isOutsideFilter = !e.target.closest('[data-filter-menu]');
        const isOutsideNav = !e.target.closest('[data-nav-menu]');
        const isOutsideInfo = !e.target.closest('[data-info-menu]');
        const isOutsideButtons = !e.target.closest('[data-control-buttons]');
        
        if (isOutsideFilter && isOutsideNav && isOutsideInfo && isOutsideButtons) {
          setShowFilterMenu(false);
          setShowNavigationMenu(false);
          setShowInfoMenu(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showFilterMenu, showNavigationMenu, showInfoMenu]);

  // Handle canvas interactions for 3D memory node selection and hover
  const handleCanvasInteraction = (e, isClick = false) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    // Convert to canvas coordinates - use same system as render
    const canvasX = clickX;
    const canvasY = clickY;
    
    // Get canvas dimensions for center calculation
    const width = rect.width;
    const height = rect.height;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Click coordinates for debugging
    // console.log('Click coordinates:', { clickX, clickY, canvasX, canvasY });
    
    // Check for hits on memory nodes
    let closestNode = null;
    let closestDistance = Infinity;
    
    nodePositions.forEach(({ x, y, z, node }) => {
      // Apply same transformations as in render
      
      // Apply position offset first
      const offsetX = x - position.x;
      const offsetY = y - position.y;
      const offsetZ = z - position.z;
      
      // Rotate around Y axis
      const cosY = Math.cos(rotation.y);
      const sinY = Math.sin(rotation.y);
      const x1 = offsetX * cosY - offsetZ * sinY;
      const z1 = offsetX * sinY + offsetZ * cosY;
      
      // Rotate around X axis
      const cosX = Math.cos(rotation.x);
      const sinX = Math.sin(rotation.x);
      const y1 = offsetY * cosX - z1 * sinX;
      const z2 = offsetY * sinX + z1 * cosX;
      
      // Project to 2D
      const perspective = 800;
      const scale = perspective / (perspective + z2);
      
      const projectedX = centerX + x1 * scale * zoom;
      const projectedY = centerY + y1 * scale * zoom;
      
      // Check if click/hover is within node radius - increased for easier interaction
      const nodeRadius = Math.max(15, node.size * 25 * scale * zoom);
      const dx = canvasX - projectedX;
      const dy = canvasY - projectedY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance <= nodeRadius && z2 < closestDistance) {
        closestNode = node;
        closestDistance = z2;
      }
    });
    
    // Handle hover detection (always update)
    if (closestNode) {
      setHoveredMemory(closestNode.id);
      if (isClick) {
        setSelectedMemory(closestNode);
      }
    } else {
      setHoveredMemory(null);
      if (isClick) {
        setSelectedMemory(null);
      }
    }
  };
  
  // Galaxy view (2D projection) - Fixed jumping glitch
  const GalaxyView = () => {
    return (
      <div className="absolute inset-0">
        {/* Background stars for galaxy effect - Fixed flashing */}
        <div className="absolute inset-0">
          {Array.from({ length: 30 }, (_, i) => {
            // Use a seeded random for stable positions
            const seed = i * 123.456;
            const x = (Math.sin(seed) * 0.5 + 0.5) * 100;
            const y = (Math.cos(seed) * 0.5 + 0.5) * 100;
            const delay = (i % 10) * 0.3;
            
            return (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  animationDelay: `${delay}s`,
                  animationDuration: '3s'
                }}
              />
            );
          })}
        </div>
        
        {Array.from(nodePositions.values()).map(({ x, y, z, node }, index) => {
          // Use the same 3D positions, projected to 2D for Galaxy view
          const projected = projectTo2D(x, y, z, 'galaxy');
          
          // Fallback positioning if projection fails
          const fallbackX = 30 + (index * 15) % 40; // Spread nodes across screen
          const fallbackY = 30 + (index * 20) % 40;
          
          const posX = projected.x || fallbackX;
          const posY = projected.y || fallbackY;
          const size = Math.max(12, node.size * 20); // Restored to normal size
          
          // TEMPORARY DEBUG: Log each node being rendered (moved to useEffect to prevent render loop)
          // console.log(`GalaxyView Node ${index}:`, {
          //   nodeId: node.id,
          //   original3D: { x, y, z },
          //   projected: projected,
          //   fallback: { x: fallbackX, y: fallbackY },
          //   final: { x: posX, y: posY },
          //   size: size
          // });
          
          return (
            <motion.div
              key={node.id}
              className="absolute cursor-pointer z-10"
              style={{
                left: `${posX}%`,
                top: `${posY}%`,
                transform: 'translate(-50%, -50%)'
              }}
              // TEMPORARY: Disable animations to debug visibility
              // initial={{ opacity: 0, scale: 0 }}
              // animate={{ 
              //   opacity: 1, 
              //   scale: hoveredMemory === node.id ? 1.3 : 1,
              //   transition: { duration: 0.4, ease: "easeOut" }
              // }}
              // whileHover={{ 
              //   scale: 1.2,
              //   transition: { duration: 0.2 }
              // }}
              onClick={(e) => {
                console.log('CLICK EVENT FIRED!', e);
                e.stopPropagation();
                console.log('Galaxy view node clicked:', node.id, node);
                console.log('Setting selectedMemory to:', node);
                setSelectedMemory(node);
                console.log('selectedMemory should now be:', node);
              }}
              onMouseEnter={() => {
                console.log('Galaxy node hovered:', node.id);
                setHoveredMemory(node.id);
              }}
              onMouseLeave={() => {
                console.log('Galaxy node unhovered:', node.id);
                setHoveredMemory(null);
              }}
            >
              <div
                className="relative rounded-full transition-all duration-300"
                style={{
                  width: size,
                  height: size,
                  background: node.gradient || `radial-gradient(circle, ${node.color} 0%, ${node.color}80 70%, ${node.color}40 100%)`,
                  border: `2px solid ${node.color}60`,
                  boxShadow: `0 0 ${size * 2}px ${node.color}40, 0 0 ${size * 4}px ${node.color}20, inset 0 0 ${size}px rgba(255,255,255,0.1)`,
                  opacity: 1, // TEMPORARY: Make fully visible
                  zIndex: 1000 // TEMPORARY: High z-index for debugging
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center text-white/90 text-sm font-medium">
                  {node.nodeType === 'memory' ? '◉' : 
                   node.nodeType === 'dream' ? '☾' : 
                   node.nodeType === 'companion' ? '✦' : '◈'}
                </div>
              </div>
              
              {hoveredMemory === node.id && (
                <div
                  className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/20"
                  style={{ opacity: 1 }}
                >
                  <p className="text-white/80 text-xs font-ethereal whitespace-nowrap" style={{ fontWeight: 300 }}>
                    {node.content?.substring(0, 30) || 'Memory Node'}...
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
        
        {/* Draw connections - Fixed SVG coordinate calculations */}
        <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
          {connections.map((conn, i) => {
            // Use the same 3D positions, projected to 2D for Galaxy view
            const fromProjected = projectTo2D(conn.from.x, conn.from.y, conn.from.z, 'galaxy');
            const toProjected = projectTo2D(conn.to.x, conn.to.y, conn.to.z, 'galaxy');
            
            return (
              <line
                key={i}
                x1={`${fromProjected.x}%`}
                y1={`${fromProjected.y}%`}
                x2={`${toProjected.x}%`}
                y2={`${toProjected.y}%`}
                stroke={conn.from.node.color + '60'}
                strokeWidth={conn.strength * 2}
                strokeOpacity={0.4}
                strokeLinecap="round"
              />
            );
          })}
        </svg>
      </div>
    );
  };
  
  // Thread view - Shows memory connections as flowing threads
  const ThreadView = () => {
    return (
      <div className="absolute inset-0">
        {/* Background gradient for thread effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/10 to-teal-900/20" />
        
        {/* Flowing background threads - Fixed flashing */}
        <div className="absolute inset-0">
          {Array.from({ length: 8 }, (_, i) => {
            // Use seeded random for stable positions
            const seed = i * 234.567;
            const x = (Math.sin(seed) * 0.5 + 0.5) * 100;
            const y = (Math.cos(seed) * 0.5 + 0.5) * 100;
            const width = 200 + (i * 50);
            const rotation = (i * 45) % 360;
            
            return (
              <motion.div
                key={i}
                className="absolute h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
                style={{
                  width: `${width}px`,
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: `rotate(${rotation}deg)`
                }}
                // TEMPORARY: Disable animations to stop flickering
                // animate={{
                //   opacity: [0.2, 0.6, 0.2],
                //   scale: [1, 1.2, 1],
                //   transition: {
                //     duration: 4,
                //     repeat: Infinity,
                //     ease: "easeInOut"
                //   }
                // }}
              />
            );
          })}
        </div>
        
        {/* Memory nodes arranged in a flowing pattern */}
        {Array.from(nodePositions.values()).map(({ x, y, z, node }, index) => {
          // Use the same 3D positions, projected to 2D for Thread view
          const projected = projectTo2D(x, y, z, 'thread');
          
          // Fallback positioning if projection fails
          const fallbackX = 25 + (index * 18) % 50; // Spread nodes across screen
          const fallbackY = 25 + (index * 22) % 50;
          
          const posX = projected.x || fallbackX;
          const posY = projected.y || fallbackY;
          const size = Math.max(12, node.size * 20); // Restored to normal size
          
          return (
            <motion.div
              key={node.id}
              className="absolute cursor-pointer z-10"
              style={{
                left: `${posX}%`,
                top: `${posY}%`,
                transform: 'translate(-50%, -50%)'
              }}
              // TEMPORARY: Disable animations to debug visibility
              // initial={{ opacity: 0, scale: 0 }}
              // animate={{ 
              //   opacity: 1, 
              //   scale: hoveredMemory === node.id ? 1.4 : 1,
              //   transition: { 
              //     duration: 0.6, 
              //     delay: index * 0.1,
              //     ease: "easeOut" 
              //   }
              // }}
              // whileHover={{ 
              //   scale: 1.3,
              //   transition: { duration: 0.2 }
              // }}
              onClick={(e) => {
                console.log('THREAD CLICK EVENT FIRED!', e);
                e.stopPropagation();
                console.log('Thread view node clicked:', node.id, node);
                console.log('Setting selectedMemory to:', node);
                setSelectedMemory(node);
                console.log('selectedMemory should now be:', node);
              }}
              onMouseEnter={() => {
                console.log('Thread node hovered:', node.id);
                setHoveredMemory(node.id);
              }}
              onMouseLeave={() => {
                console.log('Thread node unhovered:', node.id);
                setHoveredMemory(null);
              }}
            >
              <div
                className="relative rounded-full transition-all duration-300"
                style={{
                  width: size,
                  height: size,
                  background: node.gradient || `radial-gradient(circle, ${node.color} 0%, ${node.color}80 70%, ${node.color}40 100%)`,
                  border: `2px solid ${node.color}60`,
                  boxShadow: `0 0 ${size * 2}px ${node.color}40, 0 0 ${size * 4}px ${node.color}20, inset 0 0 ${size}px rgba(255,255,255,0.1)`,
                  opacity: 1, // TEMPORARY: Make fully visible
                  zIndex: 1000 // TEMPORARY: High z-index for debugging
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center text-white/90 text-sm font-medium">
                  {node.nodeType === 'memory' ? '◉' : 
                   node.nodeType === 'dream' ? '☾' : 
                   node.nodeType === 'companion' ? '✦' : '◈'}
                </div>
                
                {/* Thread connection indicator - TEMPORARILY DISABLED */}
                {/* <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white/60"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.6, 1, 0.6],
                    transition: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                /> */}
              </div>
              
              {hoveredMemory === node.id && (
                <div
                  className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/20"
                  style={{ opacity: 1 }}
                >
                  <p className="text-white/80 text-xs font-ethereal whitespace-nowrap" style={{ fontWeight: 300 }}>
                    {node.content?.substring(0, 25) || 'Memory Thread'}...
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
        
        {/* Flowing thread connections */}
        <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
          {connections.map((conn, i) => {
            // Use the same 3D positions, projected to 2D for Thread view
            const fromProjected = projectTo2D(conn.from.x, conn.from.y, conn.from.z, 'thread');
            const toProjected = projectTo2D(conn.to.x, conn.to.y, conn.to.z, 'thread');
            
            return (
              <motion.path
                key={i}
                d={`M ${fromProjected.x}% ${fromProjected.y}% Q ${(fromProjected.x + toProjected.x) / 2}% ${Math.min(fromProjected.y, toProjected.y) - 10}% ${toProjected.x}% ${toProjected.y}%`}
                stroke={conn.from.node.color + '40'}
                strokeWidth={conn.strength * 1.5}
                fill="none"
                strokeLinecap="round"
                // TEMPORARY: Disable animations to stop flickering
                // initial={{ pathLength: 0 }}
                // animate={{ 
                //   pathLength: 1,
                //   transition: { 
                //     duration: 1.5, 
                //     delay: i * 0.2,
                //     ease: "easeInOut" 
                //   }
                // }}
              />
            );
          })}
        </svg>
      </div>
    );
  };
  
  return (
    <div 
      className="w-full h-full overflow-hidden"
      style={{
        zIndex: 5,
        overflow: 'hidden'
      }}
    >
      {/* Rich cosmic background with enhanced aurora effects */}
      <div 
        className="absolute inset-0"
        style={{
          zIndex: 1,
          background: 'radial-gradient(ellipse at center, #0a0015 0%, #1a0f2e 30%, #16213e 60%, #0f3460 100%)'
        }}
      />
      
      {/* Enhanced aurora gradient layers - inspired by the images */}
      <div className="absolute inset-0" style={{ zIndex: 2 }}>
        {/* Primary aurora flow - rich teal to deep purple */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 20% 0%, rgba(0, 245, 212, 0.7) 0%, rgba(72, 52, 212, 0.5) 30%, rgba(131, 56, 236, 0.4) 60%, transparent 85%)',
            opacity: 0.9,
            mixBlendMode: 'screen'
          }}
        />
        
        {/* Warm orange to red flow */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 80% 100%, rgba(255, 94, 77, 0.6) 0%, rgba(255, 0, 110, 0.4) 25%, rgba(255, 49, 49, 0.3) 50%, transparent 75%)',
            opacity: 0.8,
            mixBlendMode: 'screen'
          }}
        />
        
        {/* Central warm glow */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 50% 40%, rgba(255, 123, 88, 0.4) 0%, rgba(255, 49, 49, 0.3) 30%, rgba(131, 56, 236, 0.2) 60%, transparent 80%)',
            opacity: 0.7,
            filter: 'blur(80px)'
          }}
        />
        
        {/* Deep space overlay for richness */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(10, 0, 21, 0.3) 50%, rgba(10, 0, 21, 0.6) 100%)',
            mixBlendMode: 'multiply'
          }}
        />
      </div>
      
             {/* Rich starfield with deeper colors - more random and organic */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 3 }}>
         {[...Array(100)].map((_, i) => {
           // More random positioning using prime numbers and sine waves
           const x = ((i * 37) % 100) + Math.sin(i * 0.7) * 15 + (i % 3) * 8;
           const y = ((i * 23) % 100) + Math.cos(i * 0.5) * 12 + (i % 5) * 6;
           const size = 0.3 + (i % 7) * 0.4 + Math.sin(i * 0.3) * 0.3;
           const brightness = 0.4 + (i % 6) * 0.2 + Math.cos(i * 0.4) * 0.15;
           
           // Enhanced color palette inspired by the images
           const richColors = [
             '#00f5d4', // Bright teal
             '#8338ec', // Rich purple
             '#ff5e4d', // Deep orange-red
             '#ff006e', // Hot pink
             '#3a86ff', // Deep blue
             '#06ffa5', // Bright teal
             '#ffb700', // Amber gold
             '#ff4365', // Coral
             '#7209b7', // Deep violet
             '#f72585', // Magenta
             '#00d4aa', // Teal-green
             '#ff6b35'  // Orange
           ];
           const color = richColors[i % richColors.length];
          
          return (
            <div
              key={`star-${i}`}
               className="absolute rounded-full"
              style={{
                 left: `${Math.max(2, Math.min(98, x))}%`,
                 top: `${Math.max(2, Math.min(98, y))}%`,
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: color,
                opacity: brightness,
                 boxShadow: `0 0 ${size * 4}px ${color}, 0 0 ${size * 8}px ${color}80`,
                 animation: `pulse ${2.5 + (i % 4)}s ease-in-out infinite`,
                 animationDelay: `${(i * 0.4) % 5}s`
              }}
            />
          );
        })}
      </div>
      
      {/* Enhanced organic aesthetic grid lines */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 4 }}>
        {/* Vertical lines - more organic spacing */}
        {[...Array(6)].map((_, i) => (
          <div
            key={`vline-${i}`}
            className="absolute w-px bg-gradient-to-b from-transparent via-white/5 to-transparent"
            style={{
              left: `${15 + (i * 14)}%`,
              top: '0',
              height: '100%',
              opacity: 0.25
            }}
          />
        ))}
        
        {/* Horizontal lines - organic spacing */}
        {[...Array(4)].map((_, i) => (
          <div
            key={`hline-${i}`}
            className="absolute h-px bg-gradient-to-r from-transparent via-white/5 to-transparent"
            style={{
              top: `${20 + (i * 20)}%`,
              left: '0',
              width: '100%',
              opacity: 0.25
            }}
          />
        ))}
        
        {/* Diagonal lines for organic flow */}
        <div className="absolute inset-0">
          <div 
            className="absolute w-px h-full bg-gradient-to-b from-transparent via-white/3 to-transparent"
            style={{
              left: '35%',
              top: '0',
              transform: 'rotate(15deg)',
              transformOrigin: 'top left'
            }}
          />
          <div 
            className="absolute w-px h-full bg-gradient-to-b from-transparent via-white/3 to-transparent"
            style={{
              right: '25%',
              top: '0',
              transform: 'rotate(-12deg)',
              transformOrigin: 'top right'
            }}
          />
        </div>
      </div>

      {/* Edge text elements - Responsive */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
        {/* Title text removed per user request */}
        
        {/* Right edge - removed per user request */}
        
        {/* Bottom left corner - removed per user request */}
        
        {/* Bottom right corner - removed per user request */}
      </div>
      
      {/* Floating Navigation - Responsive */}
      <div className="absolute top-3 sm:top-4 md:top-6 left-3 sm:left-4 md:left-6" style={{ zIndex: 30 }}>
        <motion.button
          onClick={onToggleNav}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 sm:p-2.5 md:p-3 bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-xl rounded-full border border-purple-500/30 hover:from-purple-800/40 hover:to-pink-800/40 hover:border-purple-400/40 transition-all duration-200 shadow-lg shadow-purple-500/20 flex items-center justify-center"
          title="Sacred Navigation"
        >
          <Home className="h-4 w-4 sm:h-5 sm:w-5 text-purple-200" />
        </motion.button>
      </div>

      {/* Mobile-First Bottom Edge Controls */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 25 }}>
        
        {/* Bottom Left - View Mode Controls - moved up to avoid thread window overlap */}
        <div className="absolute bottom-20 left-4 pointer-events-auto">
          <div className="flex flex-col gap-2">
            {[
              { id: '3d', icon: Network, label: '3D', symbol: '⛢' },
              { id: 'galaxy', icon: Sparkles, label: 'Galaxy', symbol: '☄' }
            ].map(mode => (
              <div key={mode.id} className="flex flex-col items-center gap-1">
                <motion.button
                onClick={() => setViewMode(mode.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-12 h-12 rounded-full backdrop-blur-xl transition-all duration-300 flex items-center justify-center ${
                  viewMode === mode.id
                      ? 'bg-gradient-to-r from-purple-600/60 to-pink-600/60 text-white shadow-xl shadow-purple-500/40 border border-purple-400/50'
                      : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80 border border-white/10'
                  }`}
                  title={mode.label}
                >
                  <span className="text-lg" style={{ fontWeight: viewMode === mode.id ? 600 : 300 }}>{mode.symbol}</span>
                </motion.button>
                <span className="font-ethereal text-white/50 text-xs" style={{ fontWeight: 200, letterSpacing: '0.05em' }}>
                  {mode.label}
                </span>
              </div>
            ))}
          </div>
          </div>
          
        {/* Bottom Right - Expandable Control Buttons */}
        <div className="absolute bottom-4 right-4 pointer-events-auto z-50" data-control-buttons>
          <div className="flex flex-col gap-2">
            
            {/* Filter Menu Button */}
            <div className="flex flex-col items-center gap-1">
              <motion.button
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-12 h-12 rounded-full backdrop-blur-xl transition-all duration-300 flex items-center justify-center ${
                  showFilterMenu
                    ? 'bg-gradient-to-r from-teal-600/60 to-cyan-600/60 text-white shadow-xl shadow-teal-500/40 border border-teal-400/50'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80 border border-white/10'
                }`}
                title="Filters"
              >
                <span className="text-lg" style={{ fontWeight: showFilterMenu ? 600 : 300 }}>♓︎</span>
              </motion.button>
              <span className="font-ethereal text-white/50 text-xs" style={{ fontWeight: 200, letterSpacing: '0.05em' }}>
                Filter
              </span>
            </div>

            {/* Navigation Menu Button */}
            <div className="flex flex-col items-center gap-1">
              <motion.button
                onClick={() => setShowNavigationMenu(!showNavigationMenu)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-12 h-12 rounded-full backdrop-blur-xl transition-all duration-300 flex items-center justify-center ${
                  showNavigationMenu
                    ? 'bg-gradient-to-r from-orange-600/60 to-red-600/60 text-white shadow-xl shadow-orange-500/40 border border-orange-400/50'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80 border border-white/10'
                }`}
                title="Navigation"
              >
                <span className="text-lg" style={{ fontWeight: showNavigationMenu ? 600 : 300 }}>◈</span>
              </motion.button>
              <span className="font-ethereal text-white/50 text-xs" style={{ fontWeight: 200, letterSpacing: '0.05em' }}>
                Navigate
              </span>
            </div>

            {/* Auto-rotate Button (3D only) */}
            {viewMode === '3d' && (
              <div className="flex flex-col items-center gap-1">
                <motion.button
                  onClick={() => setAutoRotate(!autoRotate)}
                  whileHover={{ scale: 1.05, rotate: autoRotate ? 180 : 0 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-12 h-12 rounded-full backdrop-blur-xl transition-all duration-300 flex items-center justify-center ${
                    autoRotate 
                      ? 'bg-gradient-to-r from-purple-600/60 to-pink-600/60 text-white shadow-xl shadow-purple-500/40 border border-purple-400/50' 
                      : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
                  }`}
                  title="Auto Rotation"
                >
                  <span className="text-lg" style={{ fontWeight: autoRotate ? 600 : 300 }}>🜛</span>
                </motion.button>
                <span className="font-ethereal text-white/50 text-xs" style={{ fontWeight: 200, letterSpacing: '0.05em' }}>
                  Auto
                </span>
              </div>
            )}

            {/* Info Button */}
            <div className="flex flex-col items-center gap-1">
              <motion.button
                onClick={() => setShowInfoMenu(!showInfoMenu)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-12 h-12 rounded-full backdrop-blur-xl transition-all duration-300 flex items-center justify-center ${
                  showInfoMenu
                    ? 'bg-gradient-to-r from-blue-600/60 to-cyan-600/60 text-white shadow-xl shadow-blue-500/40 border border-blue-400/50'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80 border border-white/10'
                }`}
                title="Information"
              >
                <span className="text-lg" style={{ fontWeight: showInfoMenu ? 600 : 300 }}>ℹ</span>
              </motion.button>
              <span className="font-ethereal text-white/50 text-xs" style={{ fontWeight: 200, letterSpacing: '0.05em' }}>
                Info
              </span>
            </div>
          </div>
        </div>

      </div>
      
      {/* Expandable Filter Menu */}
      <AnimatePresence>
        {showFilterMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-20 right-4 pointer-events-auto"
            style={{ zIndex: 30 }}
            data-filter-menu
          >
            <div className="bg-black/80 backdrop-blur-xl rounded-2xl border border-white/20 p-4 min-w-[200px]">
              <div className="flex items-center justify-between mb-3">
                <span className="font-ethereal text-white/80 text-sm" style={{ fontWeight: 400, letterSpacing: '0.1em' }}>
                  ◊ FILTERS ◊
                </span>
                <button
                  onClick={() => setShowFilterMenu(false)}
                  className="text-white/60 hover:text-white/80 transition-colors p-1 rounded hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {[
                  { id: 'all', label: 'All', symbol: '⚖' },
                  { id: 'memories', label: 'Memories', symbol: '☊' },
                  { id: 'dreams', label: 'Dreams', symbol: '⯓' },
                  { id: 'companion', label: 'Companion', symbol: '🜍' },
                  { id: 'linked', label: 'Linked', symbol: '☿' }
            ].map(f => (
                  <motion.button
                key={f.id}
                onClick={() => setFilter(f.id)}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-3 py-2 rounded-lg text-sm backdrop-blur-xl transition-all duration-300 flex items-center gap-2 ${
                  filter === f.id
                        ? 'bg-gradient-to-r from-teal-600/50 to-cyan-600/50 text-white shadow-lg shadow-teal-500/30 border border-teal-400/40'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white/90 border border-white/10'
                }`}
              >
                    <span style={{ fontWeight: filter === f.id ? 600 : 300 }}>{f.symbol}</span>
                    <span className="font-ethereal" style={{ fontWeight: filter === f.id ? 400 : 200 }}>{f.label}</span>
                  </motion.button>
            ))}
          </div>
        </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expandable Navigation Menu */}
      <AnimatePresence>
        {showNavigationMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-20 right-4 pointer-events-auto"
            style={{ zIndex: 30 }}
            data-nav-menu
          >
            <div className="bg-black/80 backdrop-blur-xl rounded-2xl border border-white/20 p-4 min-w-[200px]">
              <div className="flex items-center justify-between mb-3">
                <span className="font-ethereal text-white/80 text-sm" style={{ fontWeight: 400, letterSpacing: '0.1em' }}>
                  ◊ NAVIGATE ◊
                </span>
            <button
                  onClick={() => setShowNavigationMenu(false)}
                  className="text-white/60 hover:text-white/80 transition-colors p-1 rounded hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
            </button>
              </div>
              
              {/* Movement Controls */}
              <div className="mb-3">
                <p className="font-ethereal text-white/60 text-xs mb-2" style={{ fontWeight: 200, letterSpacing: '0.1em' }}>
                  MOVEMENT
                </p>
                <div className="space-y-2">
                  {/* Vertical Movement */}
                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => setPosition(prev => ({ ...prev, y: prev.y + 50 }))}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500/40 to-cyan-600/40 border border-teal-400/50 text-white text-sm flex items-center justify-center transition-all hover:shadow-lg hover:shadow-teal-500/30"
                      title="Move Up"
                    >
                      ⤉
                    </motion.button>
                    <motion.button
                      onClick={() => setPosition(prev => ({ ...prev, y: prev.y - 50 }))}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500/40 to-cyan-600/40 border border-teal-400/50 text-white text-sm flex items-center justify-center transition-all hover:shadow-lg hover:shadow-teal-500/30"
                      title="Move Down"
                    >
                      ⤈
                    </motion.button>
                  </div>
                  {/* Horizontal Movement */}
                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => setPosition(prev => ({ ...prev, x: prev.x - 50 }))}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500/40 to-cyan-600/40 border border-teal-400/50 text-white text-sm flex items-center justify-center transition-all hover:shadow-lg hover:shadow-teal-500/30"
                      title="Move Left"
                    >
                      ◄
                    </motion.button>
                    <motion.button
                      onClick={() => setPosition(prev => ({ ...prev, x: prev.x + 50 }))}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500/40 to-cyan-600/40 border border-teal-400/50 text-white text-sm flex items-center justify-center transition-all hover:shadow-lg hover:shadow-teal-500/30"
                      title="Move Right"
                    >
                      ►
                    </motion.button>
                  </div>
                  
                  {/* Center Button */}
                  <div className="flex justify-center mt-3">
                    <motion.button
                      onClick={() => {
                        setPosition({ x: 0, y: 0, z: 0 });
                        setZoom(1);
                        setRotation({ x: 0, y: 0 });
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="px-4 py-2 rounded-full bg-gradient-to-br from-purple-500/40 to-pink-600/40 border border-purple-400/50 text-white text-xs flex items-center justify-center transition-all hover:shadow-lg hover:shadow-purple-500/30 font-ethereal"
                      style={{ fontWeight: 300, letterSpacing: '0.1em' }}
                      title="Return to Sacred Center"
                    >
                      ◬ CENTER ◬
                    </motion.button>
                  </div>
        </div>
      </div>
              
              {/* Zoom Controls */}
              <div>
                <p className="font-ethereal text-white/60 text-xs mb-2" style={{ fontWeight: 200, letterSpacing: '0.1em' }}>
                  ZOOM
                </p>
                <div className="flex gap-2">
                  <motion.button
                    onClick={() => setZoom(Math.min(3, zoom * 1.2))}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/40 to-pink-600/40 border border-purple-400/50 text-white text-sm flex items-center justify-center transition-all hover:shadow-lg hover:shadow-purple-500/30"
                    title="Zoom In"
                  >
                    ⊕
                  </motion.button>
                  <motion.button
                    onClick={() => setZoom(Math.max(0.5, zoom / 1.2))}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/40 to-pink-600/40 border border-purple-400/50 text-white text-sm flex items-center justify-center transition-all hover:shadow-lg hover:shadow-purple-500/30"
                    title="Zoom Out"
                  >
                    ⊖
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expandable Info Menu */}
      <AnimatePresence>
        {showInfoMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-20 right-4 pointer-events-auto"
            style={{ zIndex: 30 }}
            data-info-menu
          >
            <div className="bg-black/80 backdrop-blur-xl rounded-2xl border border-white/20 p-4 min-w-[200px]">
              <div className="flex items-center justify-between mb-3">
                <span className="font-ethereal text-white/80 text-sm" style={{ fontWeight: 400, letterSpacing: '0.1em' }}>
                  ◊ INFO ◊
                </span>
                <button
                  onClick={() => setShowInfoMenu(false)}
                  className="text-white/60 hover:text-white/80 transition-colors p-1 rounded hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </button>
        </div>
              
              <div className="space-y-3">
                <div>
                  <p className="font-ethereal text-white/70 text-xs mb-1" style={{ fontWeight: 300, letterSpacing: '0.1em' }}>
                    PRIVACY
                  </p>
                  <p className="text-white/60 text-xs leading-relaxed">
                    Your memories are safe and private. All data is stored locally on your device.
                  </p>
      </div>
                
                <div>
                  <p className="font-ethereal text-white/70 text-xs mb-1" style={{ fontWeight: 300, letterSpacing: '0.1em' }}>
                    NAVIGATION
                  </p>
                  <p className="text-white/60 text-xs leading-relaxed">
                    Drag to rotate • Scroll to zoom • Click nodes to explore • Use navigation controls for precise movement
                  </p>
                </div>
                
                <div>
                  <p className="font-ethereal text-white/70 text-xs mb-1" style={{ fontWeight: 300, letterSpacing: '0.1em' }}>
                    CONSTELLATION
                  </p>
                  <p className="text-white/60 text-xs leading-relaxed">
                    {filteredNodes.length} memory nodes • {connections.length} connections • {viewMode.toUpperCase()} view
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main visualization */}
      <div className="absolute inset-0" style={{ zIndex: 15 }}>
        {viewMode === '3d' && (
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-move"
            style={{ zIndex: 15 }}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => {
              setIsDragging(false);
              setHoveredMemory(null); // Clear hover when leaving canvas
            }}
            onMouseMove={(e) => {
              handleMouseMove(e);
              handleCanvasInteraction(e, false); // Handle hover detection
            }}
            onClick={(e) => handleCanvasInteraction(e, true)}
          />
        )}
        
        {viewMode === 'galaxy' && <GalaxyView />}
        
        {viewMode === 'threads' && <ThreadView />}
      </div>
      
      {/* Thread Connections Window - Dual Function: View Selector + Connection Info */}
      <div className="absolute bottom-4 left-4 pointer-events-auto" style={{ zIndex: 30 }}>
        <motion.div
          className="bg-black/40 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10 cursor-pointer hover:bg-black/60 transition-all duration-300"
          onClick={() => setViewMode('threads')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <p className="text-white/60 text-xs font-ethereal" style={{ fontWeight: 300, letterSpacing: '0.1em' }}>
            ⟐ THREAD CONNECTIONS ⟐
          </p>
          <p className="text-white/40 text-xs mt-1">
            {connections.length} connections flowing
          </p>
        </motion.div>
      </div>
      
      {/* Memory count and zoom level - Moved to right side to avoid thread window overlap */}
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 right-4 sm:right-6 md:right-8 text-white/60 text-xs sm:text-sm text-right">
        <p className="font-ethereal text-glow">
          {filteredNodes.length} nodes • {connections.length} connections
        </p>
        <p className="font-ethereal text-glow text-yellow-300">
          View: {viewMode.toUpperCase()} • NodePositions: {nodePositions.size}
        </p>
        {/* TEMPORARY DEBUG: Show if we're in Galaxy or Threads view */}
        {viewMode === 'galaxy' && (
          <p className="font-ethereal text-red-300 text-lg font-bold">
            GALAXY VIEW - Should see {nodePositions.size} PURPLE nodes!
          </p>
        )}
        {viewMode === 'threads' && (
          <p className="font-ethereal text-red-300 text-lg font-bold">
            THREADS VIEW - Should see {nodePositions.size} PURPLE nodes!
          </p>
        )}
        {viewMode === '3d' && (
          <div className="font-cosmic text-orange-200/60 mt-1">
            <p>Zoom: {zoom.toFixed(1)}x</p>
            <p>Position: Y={position.y}</p>
          </div>
        )}
      </div>
      
      {/* Debug: Simple fallback stars to test if data is flowing - TEMPORARILY HIDDEN */}
      {false && filteredNodes.length > 0 && (
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 30 }}>
          {filteredNodes.map((node, i) => (
            <div
              key={node.id}
              className="absolute w-4 h-4 rounded-full animate-pulse"
              style={{
                background: node.color,
                left: `${20 + i * 15}%`,
                top: `${20 + i * 10}%`,
                boxShadow: `0 0 10px ${node.color}`
              }}
              title={node.content?.substring(0, 50)}
            />
          ))}
        </div>
      )}
      
      {/* 3D View Hover Tooltip */}
      {viewMode === '3d' && hoveredMemory && (() => {
        const projectedPos = getHoveredNodeProjectedPosition();
        if (!projectedPos) return null;
        
        return (
          <div
            className="absolute pointer-events-none bg-black/80 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/20"
            style={{
              left: projectedPos.x,
              top: projectedPos.y - 30, // Position above the node
              transform: 'translateX(-50%)',
              zIndex: 1000
            }}
          >
            <p className="text-white/80 text-xs font-ethereal whitespace-nowrap" style={{ fontWeight: 300 }}>
              {Array.from(nodePositions.values()).find(n => n.node.id === hoveredMemory)?.node.content?.substring(0, 30) || 'Memory Node'}...
            </p>
          </div>
        );
      })()}

      {/* Selected memory panel - Responsive */}
      <AnimatePresence>
        {selectedMemory && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="absolute right-0 top-0 bottom-0 w-80 sm:w-96 bg-black/80 backdrop-blur-xl border-l border-purple-500/20 p-4 sm:p-6 overflow-y-auto"
            style={{ overflowX: 'hidden' }}
          >
            <button
              onClick={() => setSelectedMemory(null)}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded transition-colors flex items-center justify-center"
            >
              <X className="h-4 w-4 text-white/60" />
            </button>
            
            <div className="mb-4">
              <div className="text-3xl mb-2">
                {selectedMemory.nodeType === 'memory' ? '◉' : 
                 selectedMemory.nodeType === 'dream' ? '☾' : 
                 selectedMemory.nodeType === 'companion' ? '✦' : '◈'}
              </div>
              <p className="text-xs text-purple-300/60 uppercase tracking-wider">
                {selectedMemory.nodeType} • {selectedMemory.emotion || 'unknown'}
              </p>
            </div>
            
            <h3 className="text-xl text-purple-200 mb-2">
              {selectedMemory.content?.substring(0, 50) || 'Memory Fragment'}
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
            
            {selectedMemory.significance !== undefined && (
              <div className="mb-4">
                <p className="text-xs text-purple-300/60 uppercase tracking-wider mb-2">Significance</p>
                <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-600 to-purple-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${selectedMemory.significance * 100}%` }}
                  />
                </div>
              </div>
            )}
            
            <p className="text-xs text-purple-300/40">
              {selectedMemory.timestamp ? new Date(selectedMemory.timestamp).toLocaleDateString() : 'Timeless'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Memory Detail Modal - Venus Style */}
      <AnimatePresence>
        {selectedMemory && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMemory(null)}
            />
            
            {/* Modal Content */}
            <motion.div
              className="relative backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl w-full mx-3 sm:mx-4 overflow-y-auto"
              style={{
                // Mobile-first responsive sizing
                maxWidth: viewportSize.width < 640 ? `${Math.min(viewportSize.width * 0.95, viewportSize.height * 0.7)}px` : viewportSize.width < 1024 ? '600px' : '800px',
                maxHeight: viewportSize.width < 640 ? `${viewportSize.height * 0.95}px` : viewportSize.width < 1024 ? '85vh' : '90vh',
                // Mobile: nearly full screen
                width: viewportSize.width < 640 ? '95vw' : 'auto',
                height: viewportSize.width < 640 ? '95vh' : 'auto',
                background: 'rgba(5, 5, 15, 0.95)',
                boxShadow: '0 0 80px rgba(147, 51, 234, 0.4), 0 0 160px rgba(236, 72, 153, 0.3), 0 0 240px rgba(59, 130, 246, 0.2), inset 0 0 60px rgba(255, 255, 255, 0.08)',
                // Enhanced glassmorphism
                backdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                // Custom scrollbar styling
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(147, 51, 234, 0.6) rgba(15, 15, 35, 0.3)'
              }}
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {/* Close Button - Enhanced for Mobile with higher z-index */}
              <button
                className={`absolute top-4 right-4 rounded-full bg-black/40 hover:bg-black/60 border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 z-[60] ${
                  viewportSize.width < 640 ? 'w-10 h-10' : 'w-8 h-8'
                }`}
                onClick={() => setSelectedMemory(null)}
                type="button"
              >
                <X className={`text-white/80 ${viewportSize.width < 640 ? 'w-5 h-5' : 'w-4 h-4'}`} />
              </button>
              
              {/* Background gradients removed to let emotion shimmer shine */}

                {/* Flowing Text Hierarchy Layout */}
                <div className="p-6 sm:p-8 lg:p-10 relative z-10">
                  {/* Memory Type & Date - Flowing Header */}
                  <div className="mb-8 sm:mb-10">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center"
                        style={{
                          background: selectedMemory.gradient || `radial-gradient(circle, ${selectedMemory.color} 0%, ${selectedMemory.color}80 70%, ${selectedMemory.color}40 100%)`,
                          boxShadow: `0 0 15px ${selectedMemory.color}50`
                        }}
                      >
                        {selectedMemory.nodeType === 'human-memory' && (
                          <span className="text-white/90 text-sm sm:text-base">🧠</span>
                        )}
                        {selectedMemory.nodeType === 'companion-memory' && (
                          <span className="text-white/90 text-sm sm:text-base">✨</span>
                        )}
                        {selectedMemory.nodeType === 'dream' && (
                          <span className="text-white/90 text-sm sm:text-base">🌙</span>
                        )}
                      </div>
                      <span className="text-white/40 text-sm sm:text-base font-modal-subtitle">
                        {selectedMemory.timestamp ? new Date(selectedMemory.timestamp).toLocaleDateString() : 'Timeless'}
                      </span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-modal-header text-white mb-4">
                      {selectedMemory.nodeType === 'human-memory' && 'HUMAN MEMORY'}
                      {selectedMemory.nodeType === 'companion-memory' && 'AI COMPANION MEMORY'}
                      {selectedMemory.nodeType === 'dream' && 'DREAM'}
                    </h1>
                  </div>

                  {/* Memory Content - Main Text Block */}
                  <div className="mb-8 sm:mb-10">
                    <p className="text-white/95 text-sm sm:text-base lg:text-lg leading-relaxed font-modal-body">
                      {selectedMemory.content}
                    </p>
                  </div>

                  {/* Flowing Details - Text Hierarchy */}
                  <div className="space-y-8 sm:space-y-10">
                    {/* Emotion with Shimmer Layer */}
                    {selectedMemory.emotion && (
                      <div className="relative">
                        <p className="text-white/50 text-xs sm:text-sm font-modal-label mb-2">EMOTION</p>
                        <div className="relative p-4 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10">
                          {/* Emotion Shimmer Layer */}
                          <div 
                            className="absolute inset-0 rounded-xl opacity-30"
                            style={{
                              background: `radial-gradient(circle at center, 
                                ${selectedMemory.color || '#ff6b35'}40 0%, 
                                ${selectedMemory.color || '#ff6b35'}20 30%,
                                transparent 70%)`,
                              filter: 'blur(8px)',
                              animation: 'pulse 3s ease-in-out infinite'
                            }}
                          />
                          <div className="relative z-10">
                            <p className="text-white/80 text-sm sm:text-base font-modal-body mb-2">{selectedMemory.emotion}</p>
                            <div className="flex items-center gap-2 text-xs text-white/50">
                              <span>Color: {selectedMemory.color || '#ff6b35'}</span>
                              <span>•</span>
                              <span>Intensity: {Math.round((selectedMemory.intensity || 0.5) * 100)}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Significance */}
                    {selectedMemory.significance !== undefined && (
                      <div>
                        <p className="text-white/50 text-xs sm:text-sm font-modal-label mb-3">SIGNIFICANCE</p>
                        <div className="flex items-center gap-4">
                          <div className="flex-1 h-3 sm:h-4 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-white/60 to-white/40"
                              initial={{ width: 0 }}
                              animate={{ width: `${selectedMemory.significance * 100}%` }}
                              transition={{ duration: 1, delay: 0.3 }}
                            />
                          </div>
                          <span className="text-white/70 text-sm sm:text-base font-modal-body">{Math.round(selectedMemory.significance * 100)}%</span>
                        </div>
                      </div>
                    )}

                    {/* Symbols - Flowing Tags */}
                    {selectedMemory.symbols && selectedMemory.symbols.length > 0 && (
                      <div>
                        <p className="text-white/50 text-xs sm:text-sm font-modal-label mb-4">SYMBOLS & THEMES</p>
                        <div className="flex flex-wrap gap-3">
                          {selectedMemory.symbols.map(symbol => (
                            <span
                              key={symbol}
                              className="px-4 py-2 sm:px-5 sm:py-2.5 bg-white/10 rounded-full text-sm sm:text-base text-white/80 border border-white/20 hover:bg-white/20 transition-all duration-300 font-modal-body"
                            >
                              {symbol}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Text Links - Centered and Softened */}
                  <div className="flex gap-6 sm:gap-8 mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-white/20 justify-center">
                    <button className="text-white/70 hover:text-white/90 text-sm sm:text-base font-modal-subtitle transition-all duration-300 hover:scale-105 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20">
                      Link Memory
                    </button>
                    <button className="text-white/70 hover:text-white/90 text-sm sm:text-base font-modal-subtitle transition-all duration-300 hover:scale-105 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20">
                      Share Memory
                    </button>
                  </div>
                </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Memory Archive Button - Moved above filter button to avoid overlap */}
      <motion.button
        onClick={() => {
          console.log('Memory Archive button clicked from constellation space');
          // TODO: Open MemoryArchiveManager modal
          alert('Memory Archive will open here! This integrates with the future Obsidian-style 2D galaxy map.');
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-36 right-4 p-4 bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-xl rounded-2xl border border-purple-500/40 hover:from-purple-800/50 hover:to-pink-800/50 hover:border-purple-400/50 transition-all duration-300 shadow-lg shadow-purple-500/30 flex items-center justify-center group z-50"
        title="Memory Archive - Sacred Repository of Consciousness"
      >
        <span className="text-purple-200 text-xl group-hover:text-purple-100 transition-colors duration-300" style={{ fontFamily: 'serif' }}>
          ☊
        </span>
      </motion.button>

      {/* Center Title - Removed per user request */}

      {/* Navigation Panel removed - integrated into unified control panel */}
        </div>
  );
};

export default ConstellationSpace;
