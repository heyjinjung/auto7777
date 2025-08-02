'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

// Battle Pass Tier Interface
interface BattlePassTier {
  level: number;
  xpRequired: number;
  freeReward?: {
    type: 'coins' | 'gems' | 'xp' | 'item';
    amount: number;
    icon?: string;
    name?: string;
  };
  premiumReward?: {
    type: 'coins' | 'gems' | 'xp' | 'item';
    amount: number;
    icon?: string;
    name?: string;
    rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  };
  isUnlocked: boolean;
  isClaimed: boolean;
  isPremiumClaimed: boolean;
}

interface BattlePassProps {
  currentLevel: number;
  currentXP: number;
  tiers: BattlePassTier[];
  hasPremium: boolean;
  onClaimReward?: (level: number, isPremium: boolean) => void;
  onUpgradeToPremium?: () => void;
  className?: string;
}

export const BattlePass: React.FC<BattlePassProps> = ({
  currentLevel,
  currentXP,
  tiers,
  hasPremium,
  onClaimReward,
  onUpgradeToPremium,
  className
}) => {
  const [selectedTier, setSelectedTier] = useState<number | null>(null);

  const getXPForNextLevel = () => {
    const nextTier = tiers.find(t => t.level > currentLevel);
    return nextTier ? nextTier.xpRequired - currentXP : 0;
  };

  const getProgressPercentage = () => {
    const currentTier = tiers.find(t => t.level === currentLevel);
    const nextTier = tiers.find(t => t.level === currentLevel + 1);
    
    if (!currentTier || !nextTier) return 100;
    
    const tierProgress = currentXP - currentTier.xpRequired;
    const tierRange = nextTier.xpRequired - currentTier.xpRequired;
    
    return Math.min((tierProgress / tierRange) * 100, 100);
  };

  return (
    <div className={clsx(
      'bg-gradient-to-br from-gray-900 to-black rounded-xl p-6',
      'border-2 border-pink-500/30 shadow-2xl shadow-pink-500/20',
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            CYBER BATTLE PASS
          </h2>
          <p className="text-gray-400">Season 1 • Level {currentLevel}</p>
        </div>
        
        {!hasPremium && (
          <motion.button
            className={clsx(
              'px-6 py-3 rounded-lg font-bold',
              'bg-gradient-to-r from-yellow-500 to-orange-500',
              'hover:from-yellow-600 hover:to-orange-600',
              'text-white shadow-lg hover:shadow-xl',
              'transition-all duration-200'
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onUpgradeToPremium}
          >
            UPGRADE 💎
          </motion.button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Level {currentLevel}</span>
          <span>{getXPForNextLevel()} XP to next level</span>
        </div>
        <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${getProgressPercentage()}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{currentXP.toLocaleString()} XP</span>
          <span>{tiers.find(t => t.level === currentLevel + 1)?.xpRequired.toLocaleString() || 'MAX'} XP</span>
        </div>
      </div>

      {/* Tier Grid */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {tiers.map((tier) => (
          <BattlePassTierRow
            key={tier.level}
            tier={tier}
            isSelected={selectedTier === tier.level}
            onSelect={() => setSelectedTier(tier.level)}
            hasPremium={hasPremium}
            onClaimReward={onClaimReward}
          />
        ))}
      </div>
    </div>
  );
};

// Individual Tier Row Component
interface BattlePassTierRowProps {
  tier: BattlePassTier;
  isSelected: boolean;
  onSelect: () => void;
  hasPremium: boolean;
  onClaimReward?: (level: number, isPremium: boolean) => void;
}

const BattlePassTierRow: React.FC<BattlePassTierRowProps> = ({
  tier,
  isSelected,
  onSelect,
  hasPremium,
  onClaimReward
}) => {
  const rarityColors = {
    common: 'border-gray-500',
    rare: 'border-blue-500',
    epic: 'border-purple-500',
    legendary: 'border-yellow-500'
  };

  const rewardTypeIcons = {
    coins: '🪙',
    gems: '💎',
    xp: '⭐',
    item: '🎁'
  };

  return (
    <motion.div
      className={clsx(
        'flex items-center gap-4 p-4 rounded-lg border transition-all duration-200',
        'hover:bg-gray-800/50 cursor-pointer',
        isSelected ? 'bg-gray-800/70 border-pink-500/50' : 'bg-gray-800/30 border-gray-700',
        !tier.isUnlocked && 'opacity-50'
      )}
      whileHover={{ scale: 1.01 }}
      onClick={onSelect}
    >
      {/* Level */}
      <div className="flex-shrink-0 w-16 text-center">
        <div className={clsx(
          'w-12 h-12 rounded-full flex items-center justify-center font-bold',
          tier.isUnlocked ? 'bg-pink-500 text-white' : 'bg-gray-600 text-gray-400'
        )}>
          {tier.level}
        </div>
      </div>

      {/* Free Reward */}
      <div className="flex-1">
        <div className="text-xs text-gray-400 mb-1">FREE</div>
        {tier.freeReward ? (
          <div className="flex items-center gap-2">
            <span className="text-lg">
              {tier.freeReward.icon || rewardTypeIcons[tier.freeReward.type]}
            </span>
            <span className="text-white font-semibold">
              {tier.freeReward.amount.toLocaleString()}
            </span>
            {tier.freeReward.name && (
              <span className="text-gray-400 text-sm">
                {tier.freeReward.name}
              </span>
            )}
            {tier.isUnlocked && !tier.isClaimed && (
              <motion.button
                className="ml-auto px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded font-bold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onClaimReward?.(tier.level, false);
                }}
              >
                CLAIM
              </motion.button>
            )}
            {tier.isClaimed && (
              <span className="ml-auto text-green-400 text-sm">✓ Claimed</span>
            )}
          </div>
        ) : (
          <div className="text-gray-500">No reward</div>
        )}
      </div>

      {/* Premium Reward */}
      <div className="flex-1">
        <div className="text-xs text-yellow-400 mb-1">PREMIUM</div>
        {tier.premiumReward ? (
          <div className={clsx(
            'flex items-center gap-2 p-2 rounded border',
            tier.premiumReward.rarity ? rarityColors[tier.premiumReward.rarity] : 'border-gray-600',
            !hasPremium && 'opacity-50'
          )}>
            <span className="text-lg">
              {tier.premiumReward.icon || rewardTypeIcons[tier.premiumReward.type]}
            </span>
            <span className="text-white font-semibold">
              {tier.premiumReward.amount.toLocaleString()}
            </span>
            {tier.premiumReward.name && (
              <span className="text-gray-400 text-sm">
                {tier.premiumReward.name}
              </span>
            )}
            {!hasPremium && (
              <span className="ml-auto text-yellow-400 text-xs">🔒</span>
            )}
            {hasPremium && tier.isUnlocked && !tier.isPremiumClaimed && (
              <motion.button
                className="ml-auto px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-black text-xs rounded font-bold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onClaimReward?.(tier.level, true);
                }}
              >
                CLAIM
              </motion.button>
            )}
            {tier.isPremiumClaimed && (
              <span className="ml-auto text-yellow-400 text-sm">✓ Claimed</span>
            )}
          </div>
        ) : (
          <div className="text-gray-500">No reward</div>
        )}
      </div>
    </motion.div>
  );
};

// Battle Pass Preview Component (for purchase screen)
interface BattlePassPreviewProps {
  tiers: BattlePassTier[];
  price: number;
  currency: 'gems' | 'usd';
  onPurchase?: () => void;
  className?: string;
}

export const BattlePassPreview: React.FC<BattlePassPreviewProps> = ({
  tiers,
  price,
  currency,
  onPurchase,
  className
}) => {
  const premiumRewards = tiers.filter(t => t.premiumReward);
  const totalValue = premiumRewards.reduce((sum, t) => 
    sum + (t.premiumReward?.amount || 0), 0
  );

  return (
    <motion.div
      className={clsx(
        'bg-gradient-to-br from-yellow-600/20 to-orange-600/20 rounded-xl p-6',
        'border-2 border-yellow-500/50 shadow-2xl shadow-yellow-500/20',
        className
      )}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-yellow-400 mb-2">
          PREMIUM BATTLE PASS
        </h3>
        <p className="text-gray-300">
          Unlock {premiumRewards.length} exclusive premium rewards
        </p>
      </div>

      {/* Value Proposition */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {premiumRewards.length}
          </div>
          <div className="text-sm text-gray-400">Premium Rewards</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">
            {totalValue.toLocaleString()}
          </div>
          <div className="text-sm text-gray-400">Total Value</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-pink-400">
            {Math.round((totalValue / price) * 100)}%
          </div>
          <div className="text-sm text-gray-400">Extra Value</div>
        </div>
      </div>

      {/* Sample Rewards Preview */}
      <div className="mb-6">
        <h4 className="text-lg font-bold text-white mb-3">Featured Rewards:</h4>
        <div className="grid grid-cols-2 gap-3">
          {premiumRewards.slice(0, 4).map((tier) => (
            <div key={tier.level} className="flex items-center gap-2 bg-black/30 p-2 rounded">
              <span className="text-lg">
                {tier.premiumReward?.icon || '🎁'}
              </span>
              <div>
                <div className="text-white text-sm font-semibold">
                  {tier.premiumReward?.name || `${tier.premiumReward?.type} Reward`}
                </div>
                <div className="text-yellow-400 text-xs">
                  Level {tier.level}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Purchase Button */}
      <motion.button
        className={clsx(
          'w-full py-4 px-6 rounded-lg font-bold text-lg',
          'bg-gradient-to-r from-yellow-500 to-orange-500',
          'hover:from-yellow-600 hover:to-orange-600',
          'text-white shadow-lg hover:shadow-xl',
          'transition-all duration-200'
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onPurchase}
      >
        UPGRADE FOR {price} {currency === 'gems' ? '💎' : '$'}
      </motion.button>
    </motion.div>
  );
};

export default BattlePass;
