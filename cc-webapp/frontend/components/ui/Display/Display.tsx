'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { BadgeProps, AvatarProps } from '@/types';

// Badge Component
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
}) => {
  const variantClasses = {
    primary: 'bg-gradient-pink text-white',
    secondary: 'bg-bg-tertiary text-text-primary',
    success: 'bg-success text-white',
    warning: 'bg-warning text-white',
    error: 'bg-error text-white',
    outline: 'border border-pink-primary text-pink-primary bg-transparent',
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
  };

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={clsx(
        'inline-flex items-center justify-center rounded-full font-semibold whitespace-nowrap',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </motion.span>
  );
};

// Avatar Component
export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = 'md',
  fallback,
  className,
}) => {
  const [imageError, setImageError] = React.useState(false);

  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-2xl',
  };

  const displayFallback = fallback || (alt ? alt.charAt(0).toUpperCase() : '?');

  return (
    <motion.div
      className={clsx(
        'relative rounded-full bg-gradient-pink p-1',
        sizeClasses[size],
        className
      )}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <div className="w-full h-full rounded-full bg-bg-primary flex items-center justify-center overflow-hidden">
        {src && !imageError ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="font-semibold text-pink-primary">
            {displayFallback}
          </span>
        )}
      </div>
    </motion.div>
  );
};

// Tooltip Component
export const Tooltip: React.FC<{
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}> = ({ children, content, position = 'top', className }) => {
  const [isVisible, setIsVisible] = React.useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-bg-primary',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-transparent border-b-bg-primary',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-transparent border-l-bg-primary',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-transparent border-r-bg-primary',
  };

  return (
    <div
      className={clsx('relative inline-block', className)}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className={clsx(
            'absolute z-tooltip bg-bg-primary text-text-primary text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap',
            positionClasses[position]
          )}
        >
          {content}
          <div className={clsx('absolute', arrowClasses[position])} />
        </motion.div>
      )}
    </div>
  );
};

// Progress Bar Component
export const ProgressBar: React.FC<{
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'pink' | 'success' | 'warning' | 'error';
  showValue?: boolean;
  label?: string;
  className?: string;
}> = ({ 
  value, 
  max = 100, 
  size = 'md', 
  color = 'pink', 
  showValue = false, 
  label,
  className 
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const colorClasses = {
    pink: 'bg-gradient-pink',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-error',
  };

  return (
    <div className={clsx('w-full', className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-text-secondary">
              {label}
            </span>
          )}
          {showValue && (
            <span className="text-sm font-semibold text-text-primary">
              {value} / {max}
            </span>
          )}
        </div>
      )}
      
      <div className={clsx(
        'w-full bg-bg-tertiary rounded-full overflow-hidden',
        sizeClasses[size]
      )}>
        <motion.div
          className={clsx(
            'h-full rounded-full transition-all duration-500',
            colorClasses[color]
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

// Counter Component (for animated numbers)
export const Counter: React.FC<{
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  separator?: boolean;
  className?: string;
}> = ({ 
  value, 
  duration = 1, 
  prefix = '', 
  suffix = '', 
  separator = true,
  className 
}) => {
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    let startValue = displayValue;
    let startTime: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      
      const easedProgress = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const currentValue = Math.floor(startValue + (value - startValue) * easedProgress);
      
      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration, displayValue]);

  const formattedValue = separator 
    ? displayValue.toLocaleString() 
    : displayValue.toString();

  return (
    <motion.span
      className={clsx('font-semibold', className)}
      key={value} // Re-trigger animation when value changes
    >
      {prefix}{formattedValue}{suffix}
    </motion.span>
  );
};

// Status Indicator Component
export const StatusIndicator: React.FC<{
  status: 'online' | 'offline' | 'busy' | 'away';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}> = ({ status, size = 'md', showLabel = false, className }) => {
  const statusConfig = {
    online: { color: 'bg-success', label: '온라인' },
    offline: { color: 'bg-text-muted', label: '오프라인' },
    busy: { color: 'bg-error', label: '바쁨' },
    away: { color: 'bg-warning', label: '자리비움' },
  };

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const config = statusConfig[status];

  return (
    <div className={clsx('flex items-center space-x-2', className)}>
      <motion.div
        className={clsx(
          'rounded-full',
          config.color,
          sizeClasses[size]
        )}
        animate={{
          scale: status === 'online' ? [1, 1.2, 1] : 1,
        }}
        transition={{
          duration: 2,
          repeat: status === 'online' ? Infinity : 0,
        }}
      />
      {showLabel && (
        <span className="text-sm text-text-secondary">
          {config.label}
        </span>
      )}
    </div>
  );
};

// Level Badge Component
export const LevelBadge: React.FC<{
  level: number;
  experience?: number;
  maxExperience?: number;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
  className?: string;
}> = ({ 
  level, 
  experience, 
  maxExperience, 
  size = 'md', 
  showProgress = false,
  className 
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2',
  };

  return (
    <div className={clsx('inline-flex flex-col items-center space-y-1', className)}>
      <motion.div
        className={clsx(
          'bg-gradient-pink text-white font-bold rounded-full',
          sizeClasses[size]
        )}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        Lv.{level}
      </motion.div>
      
      {showProgress && experience !== undefined && maxExperience !== undefined && (
        <div className="w-full max-w-[80px]">
          <ProgressBar
            value={experience}
            max={maxExperience}
            size="sm"
            color="pink"
          />
        </div>
      )}
    </div>
  );
};
