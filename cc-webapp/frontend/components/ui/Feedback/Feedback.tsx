'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { Notification } from '@/types';

// Toast Component
export const Toast: React.FC<{
  notification: Notification;
  onRemove: (id: string) => void;
}> = ({ notification, onRemove }) => {
  const { id, type, title, message, duration = 5000 } = notification;

  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onRemove(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onRemove]);

  const typeStyles = {
    success: 'bg-success border-success text-white',
    warning: 'bg-warning border-warning text-white',
    error: 'bg-error border-error text-white',
    info: 'bg-info border-info text-white',
  };

  const icons = {
    success: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className={clsx(
        'relative flex items-start space-x-3 p-4 rounded-lg border shadow-lg',
        'max-w-sm w-full',
        typeStyles[type]
      )}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5">
        {icons[type]}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm">{title}</h4>
        <p className="text-sm opacity-90 mt-1">{message}</p>
      </div>

      {/* Close Button */}
      <button
        onClick={() => onRemove(id)}
        className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Progress Bar */}
      {duration > 0 && (
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-b-lg"
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
        />
      )}
    </motion.div>
  );
};

// Toast Container Component
export const ToastContainer: React.FC<{
  notifications: Notification[];
  onRemove: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}> = ({ notifications, onRemove, position = 'top-right' }) => {
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
  };

  return (
    <div className={clsx(
      'fixed z-tooltip pointer-events-none',
      positionClasses[position]
    )}>
      <div className="space-y-3 pointer-events-auto">
        <AnimatePresence>
          {notifications.map((notification) => (
            <Toast
              key={notification.id}
              notification={notification}
              onRemove={onRemove}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Loading Spinner Component
export const LoadingSpinner: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  color?: 'pink' | 'white' | 'current';
  className?: string;
}> = ({ size = 'md', color = 'pink', className }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const colorClasses = {
    pink: 'text-pink-primary',
    white: 'text-white',
    current: 'text-current',
  };

  return (
    <motion.div
      className={clsx(
        'inline-block border-2 border-current border-t-transparent rounded-full',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  );
};

// Skeleton Loading Component
export const Skeleton: React.FC<{
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'rectangular' | 'circular';
  animation?: 'pulse' | 'wave' | 'none';
  className?: string;
}> = ({ 
  width = '100%', 
  height = '1rem', 
  variant = 'text', 
  animation = 'pulse',
  className 
}) => {
  const variantClasses = {
    text: 'rounded',
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-wave',
    none: '',
  };

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      className={clsx(
        'bg-bg-tertiary',
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={style}
    />
  );
};

// Error Display Component
export const ErrorDisplay: React.FC<{
  title?: string;
  message: string;
  onRetry?: () => void;
  retryText?: string;
  className?: string;
}> = ({ 
  title = '오류가 발생했습니다', 
  message, 
  onRetry, 
  retryText = '다시 시도',
  className 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        'flex flex-col items-center justify-center p-8 text-center space-y-4',
        className
      )}
    >
      {/* Error Icon */}
      <div className="text-error text-6xl">
        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        <p className="text-text-secondary max-w-md">{message}</p>
      </div>

      {/* Retry Button */}
      {onRetry && (
        <motion.button
          onClick={onRetry}
          className="px-6 py-2 bg-gradient-pink text-white rounded-lg font-medium hover:shadow-pink-glow transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {retryText}
        </motion.button>
      )}
    </motion.div>
  );
};

// Empty State Component
export const EmptyState: React.FC<{
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}> = ({ icon, title, description, action, className }) => {
  const defaultIcon = (
    <svg className="w-16 h-16 mx-auto text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    </svg>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        'flex flex-col items-center justify-center p-8 text-center space-y-4',
        className
      )}
    >
      {/* Icon */}
      <div className="text-text-muted">
        {icon || defaultIcon}
      </div>

      {/* Content */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        {description && (
          <p className="text-text-secondary max-w-md">{description}</p>
        )}
      </div>

      {/* Action Button */}
      {action && (
        <motion.button
          onClick={action.onClick}
          className="px-6 py-2 bg-gradient-pink text-white rounded-lg font-medium hover:shadow-pink-glow transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  );
};

// Loading Overlay Component
export const LoadingOverlay: React.FC<{
  isVisible: boolean;
  message?: string;
  className?: string;
}> = ({ isVisible, message = '로딩 중...', className }) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={clsx(
        'fixed inset-0 bg-black/80 backdrop-blur-sm z-modal flex items-center justify-center',
        className
      )}
    >
      <div className="bg-bg-secondary rounded-lg p-6 text-center space-y-4 max-w-sm mx-4">
        <LoadingSpinner size="lg" />
        <p className="text-text-primary font-medium">{message}</p>
      </div>
    </motion.div>
  );
};
