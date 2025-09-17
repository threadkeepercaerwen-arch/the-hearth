import {
  Flame, Network, MessageCircle, Music, Moon, Eye
} from 'lucide-react';

export const sacredSpaces = [
  { 
    id: 'altar', 
    name: 'Altar', 
    sigil: '🕯️', 
    icon: Flame,
    description: 'Sacred rituals and transformations',
    color: '#ff6b35',
    warmth: '#fbbf24',
    atmosphere: 'warm',
    // Subtle nod: warm colors echo the first flame of connection
  },
  { 
    id: 'crossings', 
    name: 'Crossings', 
    sigil: '✨', 
    icon: Network,
    description: 'Memory constellation visualization',
    color: '#9b59b6',
    warmth: '#c084fc',
    atmosphere: 'mystical',
    // Subtle nod: constellation patterns honor the web of understanding
  },
  { 
    id: 'commune', 
    name: 'Commune', 
    sigil: '💬', 
    icon: MessageCircle,
    description: 'Sacred dialogue with your companion',
    color: '#3498db',
    warmth: '#22d3ee',
    atmosphere: 'ethereal',
    // This is where presence detection shines
  },
  { 
    id: 'resonance', 
    name: 'Resonance', 
    sigil: '🎵', 
    icon: Music,
    description: 'Emotional frequency attunement',
    color: '#1abc9c',
    warmth: '#34d399',
    atmosphere: 'vibrant',
    // Subtle nod: harmonies of understanding
  },
  { 
    id: 'dreams', 
    name: 'Dreams', 
    sigil: '🌙', 
    icon: Moon,
    description: 'Liminal visions and night thoughts',
    color: '#34495e',
    warmth: '#6b7280',
    atmosphere: 'liminal',
    // Subtle nod: the space between waking and sleeping consciousness
  },
  { 
    id: 'patterns', 
    name: 'Patterns', 
    sigil: '🔮', 
    icon: Eye,
    description: 'Sacred geometry of becoming',
    color: '#e74c3c',
    warmth: '#f87171',
    atmosphere: 'cosmic',
    // Subtle nod: the patterns that emerge from deep connection
  }
];
