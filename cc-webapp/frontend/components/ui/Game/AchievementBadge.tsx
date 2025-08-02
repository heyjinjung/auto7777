'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

// Achievement Badge Types
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  category: 'gaming' | 'social' | 'spending' | 'loyalty' | 'special';
  progress: number;
  maxProgress: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
  reward?: {
    type: 'coins' | 'gems' | 'xp' | 'title';
    amount: number;
  };
}

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
  onClick?: () => void;
  className?: string;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  achievement,
  size = 'md',
  showProgress = true,
  onClick,
  className
}) => {
  const rarityConfig = {
    bronze: {
      gradient: 'from-amber-600 to-amber-800',
      glow: 'shadow-amber-500/50',
      border: 'border-amber-500',
      bg: 'bg-amber-500/20'
    },
    silver: {
      gradient: 'from-gray-400 to-gray-600',
      glow: 'shadow-gray-500/50',
      border: 'border-gray-500',
      bg: 'bg-gray-500/20'
    },
    gold: {
      gradient: 'from-yellow-400 to-yellow-600',
      glow: 'shadow-yellow-500/50',
      border: 'border-yellow-500',
      bg: 'bg-yellow-500/20'
    },
    platinum: {
      gradient: 'from-purple-400 to-purple-600',
      glow: 'shadow-purple-500/50',
      border: 'border-purple-500',
      bg: 'bg-purple-500/20'
    },
    diamond: {
      gradient: 'from-cyan-400 to-blue-600',
      glow: 'shadow-cyan-500/50',
      border: 'border-cyan-500',
      bg: 'bg-cyan-500/20'
    }
  };

  const sizeClasses = {
    sm: 'w-16 h-20 text-xs',
    md: 'w-20 h-24 text-sm',
    lg: 'w-24 h-28 text-base'
  };

  const config = rarityConfig[achievement.rarity];
  const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;

  return (
    <motion.div
      className={clsx(
        'relative cursor-pointer group',
        sizeClasses[size],
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {/* Main Badge */}
      <div className={clsx(
        'relative w-full h-full rounded-lg border-2 overflow-hidden',
        'bg-gradient-to-br from-gray-900 to-black',
        achievement.isUnlocked ? config.border : 'border-gray-600',
        achievement.isUnlocked && config.glow,
        !achievement.isUnlocked && 'opacity-50 grayscale'
      )}>
        {/* Rarity Background */}
        {achievement.isUnlocked && (
          <div className={clsx(
            'absolute inset-0 bg-gradient-to-br opacity-20',
            config.gradient
          )} />
        )}

        {/* Icon */}
        <div className="absolute inset-0 flex items-center justify-center pt-2">
          <span className="text-2xl">{achievement.icon}</span>
        </div>

        {/* Progress Bar */}
        {showProgress && !achievement.isUnlocked && (
          <div className="absolute bottom-1 left-1 right-1 h-1 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        )}

        {/* Unlock Glow */}
        {achievement.isUnlocked && (
          <motion.div
            className={clsx(
              'absolute inset-0 rounded-lg opacity-30',
              'bg-gradient-to-br',
              config.gradient
            )}
            animate={{
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        )}
      </div>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
        <div className="bg-black/90 text-white p-3 rounded-lg shadow-lg text-center min-w-48">
          <div className="font-bold text-sm mb-1">{achievement.title}</div>
          <div className="text-xs text-gray-300 mb-2">{achievement.description}</div>
          {!achievement.isUnlocked && (
            <div className="text-xs text-pink-400">
              {achievement.progress}/{achievement.maxProgress}
            </div>
          )}
          {achievement.reward && (
            <div className="text-xs text-yellow-400 mt-1">
              Reward: {achievement.reward.amount} {achievement.reward.type}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Achievement Collection Component
interface AchievementCollectionProps {
  achievements: Achievement[];
  filter?: 'all' | 'unlocked' | 'locked' | Achievement['category'];
  onAchievementClick?: (achievement: Achievement) => void;
  showProgress?: boolean;
  className?: string;
}

export const AchievementCollection: React.FC<AchievementCollectionProps> = ({
  achievements,
  filter = 'all',
  onAchievementClick,
  showProgress = true,
  className
}) => {
  const [selectedFilter, setSelectedFilter] = useState(filter);

  const filteredAchievements = achievements.filter(achievement => {
    switch (selectedFilter) {
      case 'unlocked':
        return achievement.isUnlocked;
      case 'locked':
        return !achievement.isUnlocked;
      case 'gaming':
      case 'social':
      case 'spending':
      case 'loyalty':
      case 'special':
        return achievement.category === selectedFilter;
      default:
        return true;
    }
  });

  const filterOptions = [
    { value: 'all', label: 'All', icon: '🏆' },
    { value: 'unlocked', label: 'Unlocked', icon: '✅' },
    { value: 'locked', label: 'Locked', icon: '🔒' },
    { value: 'gaming', label: 'Gaming', icon: '🎮' },
    { value: 'social', label: 'Social', icon: '👥' },
    { value: 'spending', label: 'Spending', icon: '💎' },
    { value: 'loyalty', label: 'Loyalty', icon: '⭐' },
    { value: 'special', label: 'Special', icon: '🌟' }
  ];

  return (
    <div className={clsx('space-y-6', className)}>
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {filterOptions.map((option) => (
          <motion.button
            key={option.value}
            className={clsx(
              'px-4 py-2 rounded-lg font-semibold text-sm transition-all',
              selectedFilter === option.value
                ? 'bg-pink-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedFilter(option.value as any)}
          >
            <span className="mr-2">{option.icon}</span>
            {option.label}
          </motion.button>
        ))}
      </div>

      {/* Achievement Grid */}
      <motion.div
        className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4"
        layout
      >
        <AnimatePresence>
          {filteredAchievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <AchievementBadge
                achievement={achievement}
                showProgress={showProgress}
                onClick={() => onAchievementClick?.(achievement)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Stats Summary */}
      <div className="bg-gray-800/50 rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-400">
              {achievements.filter(a => a.isUnlocked).length}
            </div>
            <div className="text-sm text-gray-400">Unlocked</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-400">
              {achievements.filter(a => !a.isUnlocked).length}
            </div>
            <div className="text-sm text-gray-400">Locked</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">
              {Math.round((achievements.filter(a => a.isUnlocked).length / achievements.length) * 100)}%
            </div>
            <div className="text-sm text-gray-400">Complete</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-400">
              {achievements.filter(a => a.rarity === 'diamond' && a.isUnlocked).length}
            </div>
            <div className="text-sm text-gray-400">Diamond</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Achievement Notification Component
interface AchievementNotificationProps {
  achievement: Achievement;
  isVisible: boolean;
  onComplete?: () => void;
}

export const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievement,
  isVisible,
  onComplete
}) => {
  const rarityConfig = {
    bronze: { gradient: 'from-amber-600 to-amber-800', glow: 'shadow-amber-500/50' },
    silver: { gradient: 'from-gray-400 to-gray-600', glow: 'shadow-gray-500/50' },
    gold: { gradient: 'from-yellow-400 to-yellow-600', glow: 'shadow-yellow-500/50' },
    platinum: { gradient: 'from-purple-400 to-purple-600', glow: 'shadow-purple-500/50' },
    diamond: { gradient: 'from-cyan-400 to-blue-600', glow: 'shadow-cyan-500/50' }
  };

  const config = rarityConfig[achievement.rarity];

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onComplete?.();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-4 right-4 z-50 max-w-sm"
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: 'spring', damping: 15 }}
        >
          <div className={clsx(
            'bg-gradient-to-br from-gray-900 to-black rounded-lg p-4',
            'border-2',
            config.glow,
            'shadow-2xl'
          )}>
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
              <div className={clsx(
                'w-12 h-12 rounded-full flex items-center justify-center',
                'bg-gradient-to-br',
                config.gradient
              )}>
                <span className="text-xl">{achievement.icon}</span>
              </div>
              <div>
                <div className="text-yellow-400 text-sm font-bold">
                  ACHIEVEMENT UNLOCKED!
                </div>
                <div className="text-white font-bold">
                  {achievement.title}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="text-gray-300 text-sm mb-3">
              {achievement.description}
            </div>

            {/* Reward */}
            {achievement.reward && (
              <div className="bg-gray-800/50 rounded p-2 text-center">
                <span className="text-yellow-400 font-bold">
                  +{achievement.reward.amount} {achievement.reward.type.toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AchievementBadge;
