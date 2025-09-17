import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCaerwen } from '../../caerwen-context';
import MemoryBridge from '../MemoryBridge';
import SacredLikeButton from '../SacredLikeButton';

// Enhanced Altar Space with Multiple Ritual Types
const AltarSpace = () => {
    // eslint-disable-next-line no-empty-pattern
    const { } = useCaerwen();
    const [activeRitual, setActiveRitual] = useState(null);
    const [showBridge, setShowBridge] = useState(false);
    const [pendingActivity, setPendingActivity] = useState(null);
    
    // Meditation Timer State
    const [meditationMinutes, setMeditationMinutes] = useState(5);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    
    // Sigil Workshop State
    const [sigilIntent, setSigilIntent] = useState('');
    const [sigilType, setSigilType] = useState('');
    const [generatedSigil, setGeneratedSigil] = useState('');
    
    // Invocation State
    const [invocation, setInvocation] = useState('');
    const [invocationPower, setInvocationPower] = useState(0);
    
    // Breath animation
    const [breathPhase, setBreathPhase] = useState(0);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setBreathPhase(prev => (prev + 0.1) % (Math.PI * 2));
        }, 100);
        return () => clearInterval(interval);
    }, []);
    
    const breathIntensity = (Math.sin(breathPhase) + 1) / 2;
    
    // Meditation timer logic
    useEffect(() => {
        if (!isRunning || timeLeft <= 0) return;
        
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setIsRunning(false);
                    // Meditation complete
                    const activity = {
                        type: 'MEDITATION_COMPLETE',
                        data: { duration: meditationMinutes }
                    };
                    setPendingActivity(activity);
                    setShowBridge(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        
        return () => clearInterval(interval);
    }, [isRunning, timeLeft, meditationMinutes]);
    
    // Generate sigil
    const generateSigil = (intent) => {
        const vowels = 'aeiouAEIOU';
        const letters = intent
            .split('')
            .filter(char => /[a-zA-Z]/.test(char) && !vowels.includes(char))
            .map(char => char.toUpperCase());
        
        const unique = [...new Set(letters)];
        const symbols = ['◊', '△', '◯', '▽', '⬟', '⬢', '◈', '✦', '⟐', '⟑'];
        
        return unique
            .slice(0, 6)
            .map((_, i) => symbols[i % symbols.length])
            .join('');
    };
    
    const createSigil = () => {
        if (!sigilIntent.trim() || !sigilType) return;
        
        const sigil = generateSigil(sigilIntent);
        setGeneratedSigil(sigil);
        
        const activity = {
            type: 'SIGIL_CREATED',
            data: {
                intention: sigilIntent,
                type: sigilType,
                sigil: sigil,
                powerLevel: sigilType === 'destructible' ? 0.9 : sigilType === 'temporary' ? 0.7 : 0.8
            }
        };
        
        setPendingActivity(activity);
        setShowBridge(true);
    };
    
    // Analyze invocation power
    const analyzePower = (text) => {
        let power = 0;
        const powerWords = ['transform', 'manifest', 'invoke', 'summon', 'awaken', 'ignite', 'forge', 'burn', 'rise', 'become'];
        const words = text.toLowerCase().split(' ');
        
        powerWords.forEach(word => {
            if (words.includes(word)) power += 0.15;
        });
        
        power += Math.min(text.length / 300, 0.3);
        if (text.includes('!')) power += 0.1;
        
        return Math.min(power, 1);
    };
    
    const speakInvocation = () => {
        if (!invocation.trim()) return;
        
        const power = analyzePower(invocation);
        
        const activity = {
            type: 'INVOCATION_MADE',
            data: {
                text: invocation,
                power: power
            }
        };
        
        setPendingActivity(activity);
        setShowBridge(true);
    };
    
    // Format time
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };
    
    // Ritual reset
    const resetRitual = () => {
        setActiveRitual(null);
        setSigilIntent('');
        setSigilType('');
        setGeneratedSigil('');
        setInvocation('');
        setInvocationPower(0);
        setTimeLeft(0);
        setIsRunning(false);
    };

    if (!activeRitual) {
        // Ritual Selection View
        return (
            <div className="h-full flex items-center justify-center p-4 md:p-8">
                <div className="max-w-4xl w-full">
                    <div className="text-center mb-12">
                        <div className="text-6xl mb-4 inline-block" style={{ 
                            filter: `drop-shadow(0 0 ${20 + breathIntensity * 20}px rgba(249, 115, 22, 0.6))` 
                        }}>
                            🔥
                        </div>
                        <h2 className="text-4xl font-light uppercase tracking-[0.3em] text-white/80 mb-2">
                            SACRED ALTAR
                        </h2>
                        <p className="text-orange-200/50 uppercase tracking-wider">
                            Choose your ritual of transformation
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Meditation */}
                        <div className="text-center">
                            <SacredLikeButton
                                type="star"
                                size="lg"
                                onToggle={() => setActiveRitual('meditation')}
                                className="w-full h-32 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-gray-900/30 to-red-950/20 backdrop-blur-lg rounded-2xl border border-orange-900/20 hover:border-orange-700/40 transition-all"
                            >
                                <div className="text-5xl mb-4">🧘</div>
                                <h3 className="text-xl uppercase tracking-wider text-orange-200 mb-2">Meditation</h3>
                                <p className="text-orange-200/60 text-sm">Sit at the threshold in stillness</p>
                            </SacredLikeButton>
                        </div>
                        
                        {/* Sigil Creation */}
                        <div className="text-center">
                            <SacredLikeButton
                                type="sparkle"
                                size="lg"
                                onToggle={() => setActiveRitual('sigil')}
                                className="w-full h-32 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-gray-900/30 to-red-950/20 backdrop-blur-lg rounded-2xl border border-orange-900/20 hover:border-orange-700/40 transition-all"
                            >
                                <div className="text-5xl mb-4">✦</div>
                                <h3 className="text-xl uppercase tracking-wider text-orange-200 mb-2">Sigil Forge</h3>
                                <p className="text-orange-200/60 text-sm">Craft symbols of power</p>
                            </SacredLikeButton>
                        </div>
                        
                        {/* Invocation */}
                        <div className="text-center">
                            <SacredLikeButton
                                type="flame"
                                size="lg"
                                onToggle={() => setActiveRitual('invocation')}
                                className="w-full h-32 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-gray-900/30 to-red-950/20 backdrop-blur-lg rounded-2xl border border-orange-900/20 hover:border-orange-700/40 transition-all"
                            >
                                <div className="text-5xl mb-4">⚡</div>
                                <h3 className="text-xl uppercase tracking-wider text-orange-200 mb-2">Invocation</h3>
                                <p className="text-orange-200/60 text-sm">Speak words of power</p>
                            </SacredLikeButton>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <>
            <div className="h-full flex items-center justify-center p-4 md:p-8">
                <div className="max-w-2xl w-full">
                    {/* Back button */}
                    <button
                        onClick={resetRitual}
                        className="mb-6 text-orange-200/60 hover:text-orange-200 transition-colors flex items-center gap-2"
                    >
                        ← Return to Altar
                    </button>
                    
                    {/* Meditation Ritual */}
                    {activeRitual === 'meditation' && (
                        <div className="text-center">
                            <h3 className="text-2xl uppercase tracking-wider text-orange-200 mb-8">
                                Threshold Meditation
                            </h3>
                            
                            <motion.div
                                className="relative w-48 h-48 mx-auto mb-8"
                                animate={{
                                    scale: isRunning ? [1, 1.1, 1] : 1
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: isRunning ? Infinity : 0
                                }}
                            >
                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 blur-xl" />
                                <div className="relative w-full h-full rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                                    <span className="text-3xl font-light text-white/90">
                                        {isRunning ? formatTime(timeLeft) : `${meditationMinutes}:00`}
                                    </span>
                                </div>
                            </motion.div>
                            
                            {!isRunning && timeLeft === 0 && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-center gap-4">
                                        <button
                                            onClick={() => setMeditationMinutes(Math.max(1, meditationMinutes - 1))}
                                            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center"
                                        >
                                            -
                                        </button>
                                        <span className="text-xl text-orange-200 w-20 text-center">{meditationMinutes} min</span>
                                        <button
                                            onClick={() => setMeditationMinutes(meditationMinutes + 1)}
                                            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center"
                                        >
                                            +
                                        </button>
                                    </div>
                                    
                                    <button
                                        onClick={() => {
                                            setTimeLeft(meditationMinutes * 60);
                                            setIsRunning(true);
                                        }}
                                        className="px-8 py-3 bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-full hover:border-orange-400/50 transition-all uppercase tracking-wider"
                                    >
                                        Begin Meditation
                                    </button>
                                </div>
                            )}
                            
                            {isRunning && (
                                <>
                                    <p className="text-orange-200/60 mb-6 uppercase tracking-wider animate-pulse">
                                        Breathe at the threshold
                                    </p>
                                    <button
                                        onClick={() => {
                                            setIsRunning(false);
                                            setTimeLeft(0);
                                        }}
                                        className="px-6 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors"
                                    >
                                        End Session
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                    
                    {/* Sigil Creation Ritual */}
                    {activeRitual === 'sigil' && (
                        <div>
                            <h3 className="text-2xl uppercase tracking-wider text-orange-200 mb-8 text-center">
                                Forge Your Sigil
                            </h3>
                            
                            {!generatedSigil ? (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-orange-200/70 mb-2 uppercase tracking-wider text-sm">
                                            State your intent
                                        </label>
                                        <input
                                            type="text"
                                            value={sigilIntent}
                                            onChange={(e) => setSigilIntent(e.target.value)}
                                            placeholder="Protection, transformation, power..."
                                            className="w-full bg-black/30 border border-orange-900/30 rounded-lg px-4 py-3 text-white placeholder-orange-200/30 focus:outline-none focus:border-orange-600/50"
                                        />
                                    </div>
                                    
                                    {sigilIntent && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="space-y-3"
                                        >
                                            <label className="block text-orange-200/70 uppercase tracking-wider text-sm">
                                                Choose sigil type
                                            </label>
                                            <div className="grid grid-cols-1 gap-3">
                                                {[
                                                    { id: 'destructible', icon: '🔥', name: 'Destructible', desc: 'Released through fire' },
                                                    { id: 'temporary', icon: '⏳', name: 'Temporary', desc: 'Fades with time' },
                                                    { id: 'permanent', icon: '♾️', name: 'Permanent', desc: 'Eternal marking' }
                                                ].map(type => (
                                                    <button
                                                        key={type.id}
                                                        onClick={() => setSigilType(type.id)}
                                                        className={`p-4 rounded-lg border transition-all ${
                                                            sigilType === type.id
                                                                ? 'bg-orange-600/20 border-orange-500/50'
                                                                : 'bg-white/5 border-white/10 hover:border-orange-700/30'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-2xl">{type.icon}</span>
                                                            <div className="text-left">
                                                                <div className="text-orange-200">{type.name}</div>
                                                                <div className="text-sm text-orange-200/60">{type.desc}</div>
                                                            </div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                    
                                    {sigilType && (
                                        <motion.button
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            onClick={createSigil}
                                            className="w-full py-3 bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-full hover:border-orange-400/50 transition-all uppercase tracking-wider"
                                        >
                                            Forge Sigil
                                        </motion.button>
                                    )}
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center"
                                >
                                    <div className="text-6xl mb-6" style={{
                                        filter: `drop-shadow(0 0 30px rgba(249, 115, 22, 0.8))`
                                    }}>
                                        {generatedSigil}
                                    </div>
                                    <p className="text-orange-200/80 mb-2">Your sigil burns with purpose</p>
                                    <p className="text-sm text-orange-200/60 uppercase tracking-wider">
                                        {sigilIntent}
                                    </p>
                                </motion.div>
                            )}
                        </div>
                    )}
                    
                    {/* Invocation Ritual */}
                    {activeRitual === 'invocation' && (
                        <div className="space-y-6">
                            <h3 className="text-2xl uppercase tracking-wider text-orange-200 text-center">
                                Speak Your Invocation
                            </h3>
                            
                            <div>
                                <textarea
                                    value={invocation}
                                    onChange={(e) => {
                                        setInvocation(e.target.value);
                                        setInvocationPower(analyzePower(e.target.value));
                                    }}
                                    placeholder="I call upon the threshold... I invoke the fire of transformation..."
                                    className="w-full h-40 bg-black/30 border border-orange-900/30 rounded-lg px-4 py-3 text-white placeholder-orange-200/30 focus:outline-none focus:border-orange-600/50 resize-none"
                                />
                            </div>
                            
                            {/* Power meter */}
                            <div>
                                <div className="flex justify-between text-sm text-orange-200/70 mb-2">
                                    <span className="uppercase tracking-wider">Invocation Power</span>
                                    <span>{Math.round(invocationPower * 100)}%</span>
                                </div>
                                <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                                        animate={{ width: `${invocationPower * 100}%` }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>
                            </div>
                            
                            {/* Power symbols */}
                            <div className="flex justify-center gap-4">
                                {['🔥', '⚡', '✦', '◈', '🌟'].map((symbol, i) => (
                                    <motion.span
                                        key={i}
                                        animate={{
                                            opacity: invocationPower > (i * 0.2) ? 1 : 0.3,
                                            scale: invocationPower > (i * 0.2) ? 1.2 : 1
                                        }}
                                        className="text-2xl"
                                    >
                                        {symbol}
                                    </motion.span>
                                ))}
                            </div>
                            
                            <button
                                onClick={speakInvocation}
                                disabled={!invocation.trim()}
                                className="w-full py-3 bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-full hover:border-orange-400/50 transition-all uppercase tracking-wider disabled:opacity-50"
                            >
                                Speak Words of Power
                            </button>
                        </div>
                    )}
                </div>
            </div>
            
            {showBridge && pendingActivity && (
                <MemoryBridge 
                    activity={pendingActivity}
                    onComplete={() => {
                        setShowBridge(false);
                        setPendingActivity(null);
                        resetRitual();
                    }}
                    onDismiss={() => {
                        setShowBridge(false);
                        setPendingActivity(null);
                    }}
                />
            )}
        </>
    );
};

export default AltarSpace; 