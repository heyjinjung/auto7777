'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

// Game Card Interface
interface GameCardProps {
  title: string;
  description: string;
  image?: string;
  icon?: string;
  category: 'slots' | 'poker' | 'roulette' | 'blackjack' | 'lottery' | 'special';
  isLocked?: boolean;
  requiredLevel?: number;
  playerCount?: number;
  maxWin?: number;
  rtp?: number; // Return to Player percentage
  isHot?: boolean;
  isNew?: boolean;
  isFavorite?: boolean;
  onPlay?: () => void;
  onFavorite?: () => void;
  size?: 'sm' | 'md' | 'lg';
  layout?: 'vertical' | 'horizontal';
}

export const GameCard: React.FC<GameCardProps> = ({
  title,
  description,
  image,
  icon,
  category,
  isLocked = false,
  requiredLevel,
  playerCount,
  maxWin,
  rtp,
  isHot = false,
  isNew = false,
  isFavorite = false,
  onPlay,
  onFavorite,
  size = 'md',
  layout = 'vertical'
}) => {
  const sizeClasses = {
    sm: layout === 'vertical' ? 'w-48 h-64' : 'w-64 h-32',
    md: layout === 'vertical' ? 'w-64 h-80' : 'w-80 h-40',
    lg: layout === 'vertical' ? 'w-80 h-96' : 'w-96 h-48'
  };

  const categoryColors = {
    slots: 'from-pink-500 to-purple-600',
    poker: 'from-green-500 to-emerald-600',
    roulette: 'from-red-500 to-rose-600',
    blackjack: 'from-gray-700 to-gray-900',
    lottery: 'from-yellow-500 to-orange-600',
    special: 'from-cyan-500 to-blue-600'
  };

  const categoryIcons = {
    slots: '🎰',
    poker: '♠️',
    roulette: '🎯',
    blackjack: '🃏',
    lottery: '🎫',
    special: '⭐'
  };

  return (
    <motion.div
      className={clsx(
        'relative group cursor-pointer overflow-hidden rounded-xl',
        'bg-gradient-to-br from-gray-900 to-black',
        'border border-gray-700 hover:border-pink-500/50',
        'shadow-lg hover:shadow-xl hover:shadow-pink-500/25',
        'transition-all duration-300',
        sizeClasses[size],
        isLocked && 'opacity-60 cursor-not-allowed'
      )}
      whileHover={!isLocked ? { scale: 1.02, y: -4 } : {}}
      whileTap={!isLocked ? { scale: 0.98 } : {}}
      onClick={!isLocked ? onPlay : undefined}
    >
      {/* Background Image/Gradient */}
      <div className={clsx(
        'absolute inset-0 bg-gradient-to-br opacity-20',
        categoryColors[category]
      )} />
      
      {image ? (
        <img 
          src={image} 
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl opacity-20">
            {icon || categoryIcons[category]}
          </div>
        </div>
      )}

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Status Badges */}
      <div className="absolute top-3 left-3 flex gap-2">
        {isNew && (
          <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
            NEW
          </span>
        )}
        {isHot && (
          <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
            🔥 HOT
          </span>
        )}
      </div>

      {/* Favorite Button */}
      <button
        className="absolute top-3 right-3 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          onFavorite?.();
        }}
      >
        <span className={clsx(
          'text-xl transition-colors',
          isFavorite ? 'text-pink-500' : 'text-gray-400 hover:text-pink-300'
        )}>
          {isFavorite ? '❤️' : '🤍'}
        </span>
      </button>

      {/* Lock Overlay */}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
          <div className="text-center text-white">
            <div className="text-4xl mb-2">🔒</div>
            {requiredLevel && (
              <div className="text-sm">
                Level {requiredLevel} Required
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        {/* Title & Description */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">
            {title}
          </h3>
          <p className="text-sm text-gray-300 line-clamp-2">
            {description}
          </p>
        </div>

        {/* Game Stats */}
        <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
          <div className="flex items-center gap-3">
            {playerCount && (
              <span className="flex items-center gap-1">
                👥 {playerCount}
              </span>
            )}
            {rtp && (
              <span className="flex items-center gap-1">
                📊 {rtp}%
              </span>
            )}
          </div>
          {maxWin && (
            <span className="text-yellow-400 font-bold">
              MAX: {maxWin.toLocaleString()}💎
            </span>
          )}
        </div>

        {/* Play Button */}
        {!isLocked && (
          <motion.button
            className={clsx(
              'w-full py-2 px-4 rounded-lg font-bold text-sm',
              'bg-gradient-to-r from-pink-500 to-purple-600',
              'hover:from-pink-600 hover:to-purple-700',
              'text-white shadow-lg hover:shadow-xl',
              'transition-all duration-200'
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation();
              onPlay?.();
            }}
          >
            PLAY NOW
          </motion.button>
        )}
      </div>

      {/* Hover Glow Effect */}
      <div className={clsx(
        'absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300',
        'bg-gradient-to-br',
        categoryColors[category]
      )} />
    </motion.div>
  );
};

// Game Grid Component
interface GameGridProps {
  games: Array<Omit<GameCardProps, 'onPlay' | 'onFavorite'> & {
    id: string;
  }>;
  onGameSelect?: (gameId: string) => void;
  onGameFavorite?: (gameId: string) => void;
  columns?: 2 | 3 | 4 | 5;
  size?: 'sm' | 'md' | 'lg';
  layout?: 'vertical' | 'horizontal';
  className?: string;
}

export const GameGrid: React.FC<GameGridProps> = ({
  games,
  onGameSelect,
  onGameFavorite,
  columns = 3,
  size = 'md',
  layout = 'vertical',
  className
}) => {
  const gridClasses = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
  };

  return (
    <div className={clsx(
      'grid gap-6',
      gridClasses[columns],
      className
    )}>
      {games.map((game) => (
        <GameCard
          key={game.id}
          {...game}
          size={size}
          layout={layout}
          onPlay={() => onGameSelect?.(game.id)}
          onFavorite={() => onGameFavorite?.(game.id)}
        />
      ))}
    </div>
  );
};

export default GameCard;
