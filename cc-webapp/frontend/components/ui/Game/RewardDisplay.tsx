'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

// Reward Display Types
interface Reward {
  id: string;
  type: 'coins' | 'gems' | 'xp' | 'item' | 'achievement' | 'bonus';
  amount: number;
  icon?: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  name?: string;
  description?: string;
}

interface RewardDisplayProps {
  rewards: Reward[];
  isVisible: boolean;
  onComplete?: () => void;
  animation?: 'slide-up' | 'fade-in' | 'burst' | 'cascade';
  showTotal?: boolean;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const RewardDisplay: React.FC<RewardDisplayProps> = ({
  rewards,
  isVisible,
  onComplete,
  animation = 'cascade',
  showTotal = true,
  title = 'Rewards Earned!',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'text-sm p-4',
    md: 'text-base p-6',
    lg: 'text-lg p-8'
  };

  const rewardTypeIcons = {
    coins: '🪙',
    gems: '💎',
    xp: '⭐',
    item: '🎁',
    achievement: '🏆',
    bonus: '🎉'
  };

  const rewardTypeColors = {
    coins: 'text-yellow-400',
    gems: 'text-pink-400',
    xp: 'text-blue-400',
    item: 'text-purple-400',
    achievement: 'text-orange-400',
    bonus: 'text-green-400'
  };

  const rarityGlow = {
    common: 'shadow-gray-500/50',
    rare: 'shadow-blue-500/50',
    epic: 'shadow-purple-500/50',
    legendary: 'shadow-yellow-500/50'
  };

  const getTotalByType = (type: string) => {
    return rewards
      .filter(r => r.type === type)
      .reduce((sum, r) => sum + r.amount, 0);
  };

  const uniqueTypes = Array.from(new Set(rewards.map(r => r.type)));

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onComplete}
        >
          <motion.div
            className={clsx(
              'bg-gradient-to-br from-gray-900 to-black rounded-xl',
              'border-2 border-pink-500/50 shadow-2xl shadow-pink-500/25',
              'max-w-md w-full mx-4',
              sizeClasses[size]
            )}
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="text-4xl mb-2"
              >
                🎉
              </motion.div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                {title}
              </h2>
            </div>

            {/* Individual Rewards */}
            <div className="space-y-3 mb-6">
              {rewards.map((reward, index) => (
                <motion.div
                  key={reward.id}
                  className={clsx(
                    'flex items-center justify-between p-3 rounded-lg',
                    'bg-gradient-to-r from-gray-800/50 to-gray-700/50',
                    'border border-gray-600',
                    reward.rarity && rarityGlow[reward.rarity]
                  )}
                  initial={{ 
                    x: animation === 'slide-up' ? 0 : -50,
                    y: animation === 'slide-up' ? 50 : 0,
                    opacity: 0 
                  }}
                  animate={{ x: 0, y: 0, opacity: 1 }}
                  transition={{ 
                    delay: animation === 'cascade' ? index * 0.1 : 0.2,
                    type: 'spring'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">
                      {reward.icon || rewardTypeIcons[reward.type]}
                    </div>
                    <div>
                      <div className="font-semibold text-white">
                        {reward.name || reward.type.toUpperCase()}
                      </div>
                      {reward.description && (
                        <div className="text-sm text-gray-400">
                          {reward.description}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={clsx(
                    'font-bold text-lg',
                    rewardTypeColors[reward.type]
                  )}>
                    +{reward.amount.toLocaleString()}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Total Summary */}
            {showTotal && uniqueTypes.length > 1 && (
              <motion.div
                className="border-t border-gray-600 pt-4 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="text-lg font-bold text-white mb-3">Total Earned:</h3>
                <div className="grid grid-cols-2 gap-3">
                  {uniqueTypes.map((type) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-gray-300">
                        <span>{rewardTypeIcons[type as keyof typeof rewardTypeIcons]}</span>
                        {type.toUpperCase()}
                      </span>
                      <span className={clsx(
                        'font-bold',
                        rewardTypeColors[type as keyof typeof rewardTypeColors]
                      )}>
                        {getTotalByType(type).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Close Button */}
            <motion.button
              className={clsx(
                'w-full py-3 px-6 rounded-lg font-bold',
                'bg-gradient-to-r from-pink-500 to-purple-600',
                'hover:from-pink-600 hover:to-purple-700',
                'text-white shadow-lg hover:shadow-xl',
                'transition-all duration-200'
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onComplete}
            >
              AWESOME!
            </motion.button>
          </motion.div>

          {/* Celebration Particles */}
          {animation === 'burst' && (
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 20 }, (_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                  style={{
                    left: '50%',
                    top: '50%'
                  }}
                  initial={{ scale: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    x: [0, (Math.random() - 0.5) * 400],
                    y: [0, (Math.random() - 0.5) * 400],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.05,
                    ease: 'easeOut'
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Mini Reward Popup Component
interface MiniRewardProps {
  reward: Reward;
  isVisible: boolean;
  position?: { x: number; y: number };
  onComplete?: () => void;
}

export const MiniRewardPopup: React.FC<MiniRewardProps> = ({
  reward,
  isVisible,
  position = { x: 50, y: 50 },
  onComplete
}) => {
  const rewardTypeIcons = {
    coins: '🪙',
    gems: '💎',
    xp: '⭐',
    item: '🎁',
    achievement: '🏆',
    bonus: '🎉'
  };

  const rewardTypeColors = {
    coins: 'text-yellow-400',
    gems: 'text-pink-400',
    xp: 'text-blue-400',
    item: 'text-purple-400',
    achievement: 'text-orange-400',
    bonus: 'text-green-400'
  };

  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onComplete?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed pointer-events-none z-50"
          style={{
            left: `${position.x}%`,
            top: `${position.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1.2, 1],
            opacity: [0, 1, 1, 0],
            y: [0, -30, -60]
          }}
          transition={{ 
            duration: 2,
            times: [0, 0.2, 0.8, 1],
            ease: 'easeOut'
          }}
        >
          <div className="flex items-center gap-2 bg-black/80 px-3 py-2 rounded-lg border border-gray-600">
            <span className="text-lg">
              {reward.icon || rewardTypeIcons[reward.type]}
            </span>
            <span className={clsx(
              'font-bold text-sm',
              rewardTypeColors[reward.type]
            )}>
              +{reward.amount}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RewardDisplay;
