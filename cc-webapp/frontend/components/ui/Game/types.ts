// Game Component Types

// Reel Component Types
export interface ReelSymbol {
  id: string;
  value: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  multiplier: number;
}

export interface ReelComponentProps {
  symbols: ReelSymbol[];
  isSpinning: boolean;
  finalSymbol?: ReelSymbol;
  onSpinComplete?: (symbol: ReelSymbol) => void;
  reelIndex: number;
  size?: 'sm' | 'md' | 'lg';
  theme?: 'neon' | 'classic' | 'cyber';
}

export interface SlotMachineProps {
  reelCount?: number;
  symbols: ReelSymbol[];
  isSpinning: boolean;
  results?: ReelSymbol[];
  onSpinComplete?: (results: ReelSymbol[]) => void;
  size?: 'sm' | 'md' | 'lg';
  theme?: 'neon' | 'classic' | 'cyber';
}

// Game Card Types
export interface GameCardProps {
  title: string;
  description: string;
  image?: string;
  icon?: string;
  category: 'slots' | 'poker' | 'roulette' | 'blackjack' | 'lottery' | 'special';
  isLocked?: boolean;
  requiredLevel?: number;
  playerCount?: number;
  maxWin?: number;
  rtp?: number;
  isHot?: boolean;
  isNew?: boolean;
  isFavorite?: boolean;
  onPlay?: () => void;
  onFavorite?: () => void;
  size?: 'sm' | 'md' | 'lg';
  layout?: 'vertical' | 'horizontal';
}

export interface GameGridProps {
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

// Reward Types
export interface Reward {
  id: string;
  type: 'coins' | 'gems' | 'xp' | 'item' | 'achievement' | 'bonus';
  amount: number;
  icon?: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  name?: string;
  description?: string;
}

export interface RewardDisplayProps {
  rewards: Reward[];
  isVisible: boolean;
  onComplete?: () => void;
  animation?: 'slide-up' | 'fade-in' | 'burst' | 'cascade';
  showTotal?: boolean;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
}

export interface MiniRewardProps {
  reward: Reward;
  isVisible: boolean;
  position?: { x: number; y: number };
  onComplete?: () => void;
}

// Token Badge Types
export interface TokenBadgeProps {
  type: 'coins' | 'gems' | 'xp' | 'tokens';
  amount: number;
  delta?: number;
  showDelta?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'solid' | 'outline' | 'glass' | 'neon';
  animated?: boolean;
  onClick?: () => void;
  className?: string;
}

export interface TokenWalletProps {
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

export interface ProgressTokenBadgeProps {
  current: number;
  max: number;
  type: 'xp' | 'level';
  showProgress?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

// Battle Pass Types
export interface BattlePassTier {
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

export interface BattlePassProps {
  currentLevel: number;
  currentXP: number;
  tiers: BattlePassTier[];
  hasPremium: boolean;
  onClaimReward?: (level: number, isPremium: boolean) => void;
  onUpgradeToPremium?: () => void;
  className?: string;
}

export interface BattlePassPreviewProps {
  tiers: BattlePassTier[];
  price: number;
  currency: 'gems' | 'usd';
  onPurchase?: () => void;
  className?: string;
}

// Achievement Types
export interface Achievement {
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

export interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
  onClick?: () => void;
  className?: string;
}

export interface AchievementCollectionProps {
  achievements: Achievement[];
  filter?: 'all' | 'unlocked' | 'locked' | Achievement['category'];
  onAchievementClick?: (achievement: Achievement) => void;
  showProgress?: boolean;
  className?: string;
}

export interface AchievementNotificationProps {
  achievement: Achievement;
  isVisible: boolean;
  onComplete?: () => void;
}
