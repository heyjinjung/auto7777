'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { CardProps } from '@/types';

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  hoverable = false,
  padding = 'md',
  className,
  onClick,
  ...props
}) => {
  const baseClasses = clsx(
    // Base styles
    'rounded-lg transition-all duration-300',
    'border border-transparent',
    
    // Variant styles
    {
      // Default card
      'bg-bg-secondary': variant === 'default',
      
      // Elevated card with shadow
      'bg-bg-secondary shadow-lg': variant === 'elevated',
      
      // Bordered card
      'bg-bg-secondary border-bg-tertiary': variant === 'bordered',
      
      // Glow card with pink accent
      'bg-gradient-to-br from-bg-secondary to-bg-tertiary border-pink-primary/30': variant === 'glow',
    },
    
    // Padding variants
    {
      'p-0': padding === 'none',
      'p-3': padding === 'sm',
      'p-4': padding === 'md',
      'p-6': padding === 'lg',
    },
    
    // Interactive states
    {
      'cursor-pointer': onClick || hoverable,
      'hover:shadow-xl hover:border-pink-primary/50 hover:scale-[1.02]': hoverable,
      'hover:bg-gradient-pink hover:shadow-pink-glow': variant === 'glow' && hoverable,
    },
    
    className
  );

  const CardComponent = onClick ? motion.button : motion.div;

  return (
    <CardComponent
      className={baseClasses}
      onClick={onClick}
      whileHover={hoverable ? { y: -2 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {variant === 'glow' && (
        <motion.div
          className="absolute inset-0 bg-gradient-pink opacity-0 rounded-lg transition-opacity duration-300"
          animate={{ opacity: hoverable ? [0, 0.1, 0] : 0 }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </CardComponent>
  );
};

// Profile Card Component
export const ProfileCard: React.FC<{
  avatar?: string;
  nickname: string;
  level: number;
  tokens: number;
  className?: string;
}> = ({ avatar, nickname, level, tokens, className }) => (
  <Card variant="glow" hoverable className={clsx('text-center', className)}>
    <div className="space-y-4">
      {/* Avatar */}
      <div className="relative mx-auto w-16 h-16">
        <div className="w-full h-full rounded-full bg-gradient-pink p-1">
          <div className="w-full h-full rounded-full bg-bg-primary flex items-center justify-center overflow-hidden">
            {avatar ? (
              <img src={avatar} alt={nickname} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl font-bold text-pink-primary">
                {nickname.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        </div>
        {/* Level Badge */}
        <div className="absolute -bottom-1 -right-1 bg-gradient-pink text-white text-xs font-bold px-2 py-1 rounded-full">
          Lv.{level}
        </div>
      </div>
      
      {/* User Info */}
      <div>
        <h3 className="text-text-primary font-semibold text-lg">{nickname}</h3>
        <p className="text-yellow font-medium">{tokens.toLocaleString()} 토큰</p>
      </div>
    </div>
  </Card>
);

// Game Card Component
export const GameCard: React.FC<{
  title: string;
  thumbnail?: string;
  isNew?: boolean;
  isHot?: boolean;
  onClick?: () => void;
  className?: string;
}> = ({ title, thumbnail, isNew, isHot, onClick, className }) => (
  <Card variant="elevated" hoverable onClick={onClick} className={clsx('relative overflow-hidden', className)}>
    {/* Thumbnail */}
    <div className="aspect-square bg-bg-tertiary rounded-lg mb-3 overflow-hidden">
      {thumbnail ? (
        <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-4xl">🎮</span>
        </div>
      )}
    </div>
    
    {/* Badges */}
    {(isNew || isHot) && (
      <div className="absolute top-2 right-2 space-y-1">
        {isNew && (
          <span className="bg-success text-white text-xs font-bold px-2 py-1 rounded-full">
            NEW
          </span>
        )}
        {isHot && (
          <span className="bg-gradient-pink text-white text-xs font-bold px-2 py-1 rounded-full">
            HOT
          </span>
        )}
      </div>
    )}
    
    {/* Title */}
    <h3 className="text-text-primary font-medium text-center">{title}</h3>
  </Card>
);

// Reward Card Component
export const RewardCard: React.FC<{
  title: string;
  reward: string;
  icon?: React.ReactNode;
  claimed?: boolean;
  onClaim?: () => void;
  className?: string;
}> = ({ title, reward, icon, claimed, onClaim, className }) => (
  <Card variant={claimed ? 'default' : 'glow'} className={clsx('text-center', className)}>
    <div className="space-y-3">
      {/* Icon */}
      <div className="text-3xl">
        {icon || '🎁'}
      </div>
      
      {/* Content */}
      <div>
        <h4 className="text-text-primary font-medium">{title}</h4>
        <p className="text-yellow font-semibold">{reward}</p>
      </div>
      
      {/* Claim Button */}
      <button
        onClick={onClaim}
        disabled={claimed}
        className={clsx(
          'w-full py-2 px-4 rounded-lg font-medium transition-all',
          claimed
            ? 'bg-bg-tertiary text-text-muted cursor-not-allowed'
            : 'bg-gradient-pink text-white hover:shadow-pink-glow'
        )}
      >
        {claimed ? '수령완료' : '받기'}
      </button>
    </div>
  </Card>
);

// Stats Card Component
export const StatsCard: React.FC<{
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  className?: string;
}> = ({ title, value, change, icon, className }) => (
  <Card variant="elevated" className={className}>
    <div className="flex items-center space-x-3">
      {/* Icon */}
      {icon && (
        <div className="text-pink-primary text-2xl">
          {icon}
        </div>
      )}
      
      {/* Content */}
      <div className="flex-1">
        <p className="text-text-muted text-sm">{title}</p>
        <p className="text-text-primary text-xl font-bold">{value}</p>
        {change !== undefined && (
          <p className={clsx(
            'text-xs font-medium',
            change > 0 ? 'text-success' : change < 0 ? 'text-error' : 'text-text-muted'
          )}>
            {change > 0 ? '+' : ''}{change}%
          </p>
        )}
      </div>
    </div>
  </Card>
);

export default Card;
