'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

// Token Badge Types
interface TokenBadgeProps {
  type: 'coins' | 'gems' | 'xp' | 'tokens';
  amount: number;
  delta?: number; // Change amount for animations
  showDelta?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'solid' | 'outline' | 'glass' | 'neon';
  animated?: boolean;
  onClick?: () => void;
  className?: string;
}

export const TokenBadge: React.FC<TokenBadgeProps> = ({
  type,
  amount,
  delta = 0,
  showDelta = false,
  size = 'md',
  variant = 'solid',
  animated = true,
  onClick,
  className
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const tokenConfig = {
    coins: {
      icon: '🪙',
      color: 'yellow',
      gradient: 'from-yellow-400 to-yellow-600',
      glowColor: 'yellow-500',
      bgColor: 'bg-yellow-500/20',
      textColor: 'text-yellow-400',
      borderColor: 'border-yellow-500'
    },
    gems: {
      icon: '💎',
      color: 'pink',
      gradient: 'from-pink-400 to-pink-600',
      glowColor: 'pink-500',
      bgColor: 'bg-pink-500/20',
      textColor: 'text-pink-400',
      borderColor: 'border-pink-500'
    },
    xp: {
      icon: '⭐',
      color: 'blue',
      gradient: 'from-blue-400 to-blue-600',
      glowColor: 'blue-500',
      bgColor: 'bg-blue-500/20',
      textColor: 'text-blue-400',
      borderColor: 'border-blue-500'
    },
    tokens: {
      icon: '🎯',
      color: 'purple',
      gradient: 'from-purple-400 to-purple-600',
      glowColor: 'purple-500',
      bgColor: 'bg-purple-500/20',
      textColor: 'text-purple-400',
      borderColor: 'border-purple-500'
    }
  };

  const sizeClasses = {
    xs: 'px-2 py-1 text-xs gap-1',
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-5 py-2.5 text-lg gap-2.5',
    xl: 'px-6 py-3 text-xl gap-3'
  };

  const config = tokenConfig[type];

  const getVariantClasses = () => {
    switch (variant) {
      case 'outline':
        return clsx(
          'bg-transparent border-2',
          config.borderColor,
          config.textColor
        );
      case 'glass':
        return clsx(
          'backdrop-blur-sm bg-white/10 border border-white/20',
          'text-white shadow-lg'
        );
      case 'neon':
        return clsx(
          'bg-black/50 border-2',
          config.borderColor,
          config.textColor,
          `shadow-lg shadow-${config.glowColor}/50`
        );
      default: // solid
        return clsx(
          'bg-gradient-to-r',
          config.gradient,
          'text-white shadow-lg'
        );
    }
  };

  const handleClick = () => {
    if (animated) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
    }
    onClick?.();
  };

  React.useEffect(() => {
    if (showDelta && delta !== 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [delta, showDelta]);

  return (
    <div className="relative">
      <motion.div
        className={clsx(
          'inline-flex items-center rounded-full font-bold cursor-pointer',
          'transition-all duration-200 hover:scale-105',
          sizeClasses[size],
          getVariantClasses(),
          onClick && 'hover:shadow-xl',
          className
        )}
        animate={isAnimating ? {
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        } : {}}
        transition={{ duration: 0.3 }}
        onClick={handleClick}
      >
        <span className="text-lg">{config.icon}</span>
        <span>{amount.toLocaleString()}</span>
      </motion.div>

      {/* Delta Animation */}
      <AnimatePresence>
        {showDelta && delta !== 0 && (
          <motion.div
            className={clsx(
              'absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-bold',
              delta > 0 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            )}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1.2, 1],
              opacity: [0, 1, 1, 0],
              y: [0, -10, -20]
            }}
            transition={{ duration: 1 }}
          >
            {delta > 0 ? '+' : ''}{delta}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glow Effect for Neon Variant */}
      {variant === 'neon' && (
        <div className={clsx(
          'absolute inset-0 rounded-full blur-sm opacity-50',
          'bg-gradient-to-r',
          config.gradient,
          'animate-pulse'
        )} />
      )}
    </div>
  );
};

// Token Wallet Component
interface TokenWalletProps {
  tokens: {
    coins: number;
    gems: number;
    xp: number;
    tokens: number;
  };
  deltas?: {
    coins?: number;
    gems?: number;
    xp?: number;
    tokens?: number;
  };
  showDeltas?: boolean;
  layout?: 'horizontal' | 'vertical' | 'grid';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'solid' | 'outline' | 'glass' | 'neon';
  onTokenClick?: (type: 'coins' | 'gems' | 'xp' | 'tokens') => void;
  className?: string;
}

export const TokenWallet: React.FC<TokenWalletProps> = ({
  tokens,
  deltas = {},
  showDeltas = false,
  layout = 'horizontal',
  size = 'md',
  variant = 'solid',
  onTokenClick,
  className
}) => {
  const layoutClasses = {
    horizontal: 'flex items-center gap-4',
    vertical: 'flex flex-col gap-2',
    grid: 'grid grid-cols-2 gap-2'
  };

  return (
    <div className={clsx(
      layoutClasses[layout],
      className
    )}>
      {Object.entries(tokens).map(([type, amount]) => (
        <TokenBadge
          key={type}
          type={type as keyof typeof tokens}
          amount={amount}
          delta={deltas[type as keyof typeof deltas] || 0}
          showDelta={showDeltas}
          size={size}
          variant={variant}
          onClick={() => onTokenClick?.(type as keyof typeof tokens)}
        />
      ))}
    </div>
  );
};

// Progress Token Badge (for XP/Level progress)
interface ProgressTokenBadgeProps {
  current: number;
  max: number;
  type: 'xp' | 'level';
  showProgress?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

export const ProgressTokenBadge: React.FC<ProgressTokenBadgeProps> = ({
  current,
  max,
  type,
  showProgress = true,
  size = 'md',
  animated = true,
  className
}) => {
  const percentage = Math.min((current / max) * 100, 100);
  
  const config = {
    xp: {
      icon: '⭐',
      gradient: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-500/20'
    },
    level: {
      icon: '🎖️',
      gradient: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-500/20'
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-2.5 text-lg'
  };

  return (
    <div className={clsx(
      'relative overflow-hidden rounded-full',
      'bg-black/50 border border-gray-600',
      sizeClasses[size],
      className
    )}>
      {/* Progress Background */}
      {showProgress && (
        <motion.div
          className={clsx(
            'absolute inset-0 bg-gradient-to-r opacity-30',
            config[type].gradient
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: animated ? 1 : 0, ease: 'easeOut' }}
        />
      )}

      {/* Content */}
      <div className="relative flex items-center justify-center gap-2 text-white font-bold">
        <span>{config[type].icon}</span>
        <span>{current.toLocaleString()}</span>
        {showProgress && (
          <>
            <span>/</span>
            <span className="text-gray-400">{max.toLocaleString()}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default TokenBadge;
