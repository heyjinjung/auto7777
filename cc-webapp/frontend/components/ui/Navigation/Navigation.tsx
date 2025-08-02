'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { TabBarProps, TabBarItem } from '@/types';

const TabBar: React.FC<TabBarProps> = ({
  items,
  activeId,
  onTabChange,
  className,
}) => {
  return (
    <div className={clsx(
      'fixed bottom-0 left-0 right-0 z-sticky',
      'bg-bg-secondary border-t border-bg-tertiary',
      'safe-area-pb',
      className
    )}>
      <nav className="flex items-center justify-around py-2 px-4">
        {items.map((item) => (
          <TabBarButton
            key={item.id}
            item={item}
            isActive={activeId === item.id}
            onClick={() => onTabChange(item.id)}
          />
        ))}
      </nav>
    </div>
  );
};

const TabBarButton: React.FC<{
  item: TabBarItem;
  isActive: boolean;
  onClick: () => void;
}> = ({ item, isActive, onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      className={clsx(
        'relative flex flex-col items-center justify-center',
        'py-2 px-3 rounded-lg transition-all duration-300',
        'min-w-[60px]',
        {
          'text-pink-primary': isActive,
          'text-text-muted hover:text-text-secondary': !isActive,
        }
      )}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
    >
      {/* Active Background */}
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-pink-primary/10 rounded-lg"
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        />
      )}

      {/* Icon Container */}
      <div className="relative mb-1">
        <motion.div
          animate={{
            scale: isActive ? 1.1 : 1,
            rotateZ: isActive ? [0, -5, 5, 0] : 0,
          }}
          transition={{ duration: 0.3 }}
          className="text-xl"
        >
          {item.icon}
        </motion.div>

        {/* Badge */}
        {item.badge && item.badge > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-error text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center"
          >
            {item.badge > 99 ? '99+' : item.badge}
          </motion.div>
        )}

        {/* Active Glow */}
        {isActive && (
          <motion.div
            className="absolute inset-0 bg-pink-primary rounded-full blur-lg opacity-30"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </div>

      {/* Label */}
      <span className={clsx(
        'text-xs font-medium transition-colors',
        {
          'text-pink-primary': isActive,
          'text-text-muted': !isActive,
        }
      )}>
        {item.label}
      </span>

      {/* Active Indicator */}
      {isActive && (
        <motion.div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-pink-primary rounded-full"
          layoutId="activeIndicator"
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        />
      )}
    </motion.button>
  );
};

// Header Navigation Component
export const HeaderNav: React.FC<{
  title?: string;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  showBack?: boolean;
  onBack?: () => void;
  className?: string;
}> = ({ title, leftAction, rightAction, showBack, onBack, className }) => {
  return (
    <header className={clsx(
      'flex items-center justify-between p-4',
      'bg-bg-primary border-b border-bg-tertiary',
      'safe-area-pt',
      className
    )}>
      {/* Left Side */}
      <div className="flex items-center">
        {showBack && (
          <motion.button
            onClick={onBack}
            className="mr-3 p-2 text-text-primary hover:text-pink-primary transition-colors rounded-lg"
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
        )}
        {leftAction}
      </div>

      {/* Title */}
      {title && (
        <h1 className="text-lg font-semibold text-text-primary text-center flex-1">
          {title}
        </h1>
      )}

      {/* Right Side */}
      <div className="flex items-center">
        {rightAction}
      </div>
    </header>
  );
};

// Sidebar Navigation Component
export const SideNav: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  items: Array<{
    id: string;
    label: string;
    icon: React.ReactNode;
    href?: string;
    onClick?: () => void;
    badge?: number;
  }>;
  userInfo?: {
    avatar?: string;
    nickname: string;
    level: number;
  };
}> = ({ isOpen, onClose, items, userInfo }) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-modal-backdrop"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed left-0 top-0 bottom-0 w-80 bg-bg-secondary border-r border-bg-tertiary z-modal overflow-y-auto"
      >
        {/* User Profile Section */}
        {userInfo && (
          <div className="p-6 border-b border-bg-tertiary">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-pink p-1">
                <div className="w-full h-full rounded-full bg-bg-primary flex items-center justify-center overflow-hidden">
                  {userInfo.avatar ? (
                    <img src={userInfo.avatar} alt={userInfo.nickname} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg font-bold text-pink-primary">
                      {userInfo.nickname.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-text-primary font-semibold">{userInfo.nickname}</h3>
                <p className="text-text-muted text-sm">레벨 {userInfo.level}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="py-4">
          {items.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => {
                item.onClick?.();
                onClose();
              }}
              className="w-full flex items-center space-x-3 px-6 py-3 text-left hover:bg-bg-tertiary transition-colors"
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-pink-primary text-xl">
                {item.icon}
              </div>
              <span className="text-text-primary font-medium flex-1">
                {item.label}
              </span>
              {item.badge && item.badge > 0 && (
                <span className="bg-error text-white text-xs font-bold rounded-full px-2 py-1">
                  {item.badge}
                </span>
              )}
            </motion.button>
          ))}
        </nav>

        {/* Close Button */}
        <div className="absolute top-4 right-4">
          <motion.button
            onClick={onClose}
            className="p-2 text-text-muted hover:text-pink-primary transition-colors rounded-lg"
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        </div>
      </motion.div>
    </>
  );
};

export default TabBar;
