'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

// Reel Symbol Interface
interface ReelSymbol {
  id: string;
  value: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  multiplier: number;
}

interface ReelComponentProps {
  symbols: ReelSymbol[];
  isSpinning: boolean;
  finalSymbol?: ReelSymbol;
  onSpinComplete?: (symbol: ReelSymbol) => void;
  reelIndex: number;
  size?: 'sm' | 'md' | 'lg';
  theme?: 'neon' | 'classic' | 'cyber';
}

// Single Reel Column Component
export const ReelComponent: React.FC<ReelComponentProps> = ({
  symbols,
  isSpinning,
  finalSymbol,
  onSpinComplete,
  reelIndex,
  size = 'md',
  theme = 'neon'
}) => {
  const [displaySymbols, setDisplaySymbols] = useState<ReelSymbol[]>([]);
  const [currentSymbolIndex, setCurrentSymbolIndex] = useState(0);

  const sizeClasses = {
    sm: 'h-16 w-16',
    md: 'h-24 w-24',
    lg: 'h-32 w-32'
  };

  const themeClasses = {
    neon: 'bg-gradient-to-b from-gray-900 to-black border-2 border-pink-500/50 shadow-lg shadow-pink-500/25',
    classic: 'bg-gradient-to-b from-yellow-600 to-yellow-800 border-2 border-yellow-400',
    cyber: 'bg-gradient-to-b from-blue-900 to-purple-900 border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/25'
  };

  useEffect(() => {
    if (isSpinning) {
      const spinInterval = setInterval(() => {
        setCurrentSymbolIndex((prev) => (prev + 1) % symbols.length);
      }, 100);

      return () => clearInterval(spinInterval);
    } else if (finalSymbol) {
      // Smooth stop animation
      const stopDelay = reelIndex * 200; // Stagger stop for each reel
      setTimeout(() => {
        const finalIndex = symbols.findIndex(s => s.id === finalSymbol.id);
        setCurrentSymbolIndex(finalIndex >= 0 ? finalIndex : 0);
        onSpinComplete?.(finalSymbol);
      }, stopDelay);
    }
  }, [isSpinning, finalSymbol, symbols, reelIndex, onSpinComplete]);

  const currentSymbol = symbols[currentSymbolIndex];
  
  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'shadow-lg shadow-yellow-500/50 border-yellow-500';
      case 'epic': return 'shadow-lg shadow-purple-500/50 border-purple-500';
      case 'rare': return 'shadow-lg shadow-blue-500/50 border-blue-500';
      default: return 'shadow-lg shadow-gray-500/25 border-gray-500';
    }
  };

  return (
    <div className={clsx(
      'relative overflow-hidden rounded-lg flex items-center justify-center',
      sizeClasses[size],
      themeClasses[theme],
      !isSpinning && finalSymbol && getRarityGlow(finalSymbol.rarity)
    )}>
      {/* Spinning Effect Overlay */}
      {isSpinning && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent"
          animate={{ y: ['-100%', '100%'] }}
          transition={{
            duration: 0.3,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      )}

      {/* Symbol Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSymbol?.id || 'empty'}
          className="relative z-10 text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-2xl md:text-3xl lg:text-4xl mb-1">
            {currentSymbol?.icon || '❓'}
          </div>
          <div className="text-xs font-bold text-white/90">
            {currentSymbol?.value || '--'}
          </div>
          {currentSymbol?.multiplier && currentSymbol.multiplier > 1 && (
            <div className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs px-1 rounded-full">
              x{currentSymbol.multiplier}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Win Glow Effect */}
      {!isSpinning && finalSymbol && finalSymbol.rarity !== 'common' && (
        <motion.div
          className="absolute inset-0 rounded-lg opacity-50"
          style={{
            background: `radial-gradient(circle, ${
              finalSymbol.rarity === 'legendary' ? '#FFD700' :
              finalSymbol.rarity === 'epic' ? '#8B5CF6' :
              '#3B82F6'
            }33 0%, transparent 70%)`
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      )}
    </div>
  );
};

// Multi-Reel Slot Machine Component
interface SlotMachineProps {
  reelCount?: number;
  symbols: ReelSymbol[];
  isSpinning: boolean;
  results?: ReelSymbol[];
  onSpinComplete?: (results: ReelSymbol[]) => void;
  size?: 'sm' | 'md' | 'lg';
  theme?: 'neon' | 'classic' | 'cyber';
}

export const SlotMachine: React.FC<SlotMachineProps> = ({
  reelCount = 3,
  symbols,
  isSpinning,
  results = [],
  onSpinComplete,
  size = 'md',
  theme = 'neon'
}) => {
  const [completedReels, setCompletedReels] = useState<number>(0);

  const handleReelComplete = (reelIndex: number) => {
    setCompletedReels(prev => {
      const newCount = prev + 1;
      if (newCount === reelCount && results.length === reelCount) {
        onSpinComplete?.(results);
      }
      return newCount;
    });
  };

  useEffect(() => {
    if (!isSpinning) {
      setCompletedReels(0);
    }
  }, [isSpinning]);

  return (
    <div className="relative">
      {/* Machine Frame */}
      <div className={clsx(
        'bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-xl',
        'border-2 border-pink-500/30 shadow-2xl shadow-pink-500/20',
        'before:absolute before:inset-0 before:bg-gradient-to-br before:from-pink-500/10 before:to-transparent before:rounded-xl'
      )}>
        {/* Title Bar */}
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            CYBER SLOTS
          </h3>
        </div>

        {/* Reels Container */}
        <div className="flex gap-4 justify-center items-center">
          {Array.from({ length: reelCount }, (_, index) => (
            <ReelComponent
              key={index}
              symbols={symbols}
              isSpinning={isSpinning}
              finalSymbol={results[index]}
              onSpinComplete={() => handleReelComplete(index)}
              reelIndex={index}
              size={size}
              theme={theme}
            />
          ))}
        </div>

        {/* Payline Indicator */}
        <div className="absolute left-4 right-4 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-50" />
      </div>

      {/* Win Effect Overlay */}
      <AnimatePresence>
        {!isSpinning && results.length > 0 && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-pink-500/20 rounded-xl animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SlotMachine;
