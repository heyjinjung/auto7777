'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

// Container Component
export const Container: React.FC<{
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ children, size = 'lg', padding = 'md', className }) => {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full',
  };

  const paddingClasses = {
    none: 'px-0',
    sm: 'px-4',
    md: 'px-6',
    lg: 'px-8',
  };

  return (
    <div className={clsx(
      'mx-auto w-full',
      sizeClasses[size],
      paddingClasses[padding],
      className
    )}>
      {children}
    </div>
  );
};

// Grid Component
export const Grid: React.FC<{
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}> = ({ children, cols = 1, gap = 'md', className }) => {
  const colsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  };

  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  return (
    <div className={clsx(
      'grid',
      colsClasses[cols],
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  );
};

// Flex Component
export const Flex: React.FC<{
  children: React.ReactNode;
  direction?: 'row' | 'col';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}> = ({ 
  children, 
  direction = 'row', 
  align = 'start', 
  justify = 'start', 
  wrap = false,
  gap = 'md',
  className 
}) => {
  const directionClasses = {
    row: 'flex-row',
    col: 'flex-col',
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  return (
    <div className={clsx(
      'flex',
      directionClasses[direction],
      alignClasses[align],
      justifyClasses[justify],
      wrap && 'flex-wrap',
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  );
};

// Divider Component
export const Divider: React.FC<{
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  color?: 'default' | 'pink' | 'muted';
  className?: string;
}> = ({ orientation = 'horizontal', size = 'md', color = 'default', className }) => {
  const orientationClasses = {
    horizontal: 'w-full h-px',
    vertical: 'h-full w-px',
  };

  const sizeClasses = {
    sm: orientation === 'horizontal' ? 'my-2' : 'mx-2',
    md: orientation === 'horizontal' ? 'my-4' : 'mx-4',
    lg: orientation === 'horizontal' ? 'my-6' : 'mx-6',
  };

  const colorClasses = {
    default: 'bg-bg-tertiary',
    pink: 'bg-gradient-pink',
    muted: 'bg-text-muted',
  };

  return (
    <div className={clsx(
      orientationClasses[orientation],
      sizeClasses[size],
      colorClasses[color],
      className
    )} />
  );
};

// Stack Component (for spacing between children)
export const Stack: React.FC<{
  children: React.ReactNode;
  space?: 'sm' | 'md' | 'lg' | 'xl';
  direction?: 'row' | 'col';
  className?: string;
}> = ({ children, space = 'md', direction = 'col', className }) => {
  const spaceClasses = {
    sm: direction === 'col' ? 'space-y-2' : 'space-x-2',
    md: direction === 'col' ? 'space-y-4' : 'space-x-4',
    lg: direction === 'col' ? 'space-y-6' : 'space-x-6',
    xl: direction === 'col' ? 'space-y-8' : 'space-x-8',
  };

  const directionClasses = {
    row: 'flex flex-row',
    col: 'flex flex-col',
  };

  return (
    <div className={clsx(
      directionClasses[direction],
      spaceClasses[space],
      className
    )}>
      {children}
    </div>
  );
};

// Section Component
export const Section: React.FC<{
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  background?: 'none' | 'primary' | 'secondary';
  className?: string;
}> = ({ children, title, subtitle, padding = 'md', background = 'none', className }) => {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const backgroundClasses = {
    none: '',
    primary: 'bg-bg-primary',
    secondary: 'bg-bg-secondary',
  };

  return (
    <section className={clsx(
      'w-full',
      paddingClasses[padding],
      backgroundClasses[background],
      className
    )}>
      {(title || subtitle) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-2xl font-bold text-text-primary mb-2">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-text-secondary">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
};

// Page Layout Component
export const PageLayout: React.FC<{
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  sidebar?: React.ReactNode;
  className?: string;
}> = ({ children, header, footer, sidebar, className }) => {
  return (
    <div className={clsx('min-h-screen flex flex-col bg-bg-primary', className)}>
      {/* Header */}
      {header && (
        <header className="flex-shrink-0">
          {header}
        </header>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        {sidebar && (
          <aside className="flex-shrink-0 w-64 bg-bg-secondary border-r border-bg-tertiary">
            {sidebar}
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {/* Footer */}
      {footer && (
        <footer className="flex-shrink-0">
          {footer}
        </footer>
      )}
    </div>
  );
};

// Card Layout Component
export const CardLayout: React.FC<{
  children: React.ReactNode;
  title?: string;
  actions?: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ children, title, actions, padding = 'md', className }) => {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        'bg-bg-secondary rounded-lg border border-bg-tertiary shadow-lg',
        className
      )}
    >
      {/* Header */}
      {(title || actions) && (
        <div className="flex items-center justify-between p-6 border-b border-bg-tertiary">
          {title && (
            <h3 className="text-lg font-semibold text-text-primary">
              {title}
            </h3>
          )}
          {actions && (
            <div className="flex items-center space-x-2">
              {actions}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className={paddingClasses[padding]}>
        {children}
      </div>
    </motion.div>
  );
};

// Responsive Grid Component
export const ResponsiveGrid: React.FC<{
  children: React.ReactNode;
  minWidth?: string;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}> = ({ children, minWidth = '280px', gap = 'md', className }) => {
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  return (
    <div 
      className={clsx(
        'grid auto-fit',
        gapClasses[gap],
        className
      )}
      style={{
        gridTemplateColumns: `repeat(auto-fit, minmax(${minWidth}, 1fr))`,
      }}
    >
      {children}
    </div>
  );
};

// Sticky Container Component
export const StickyContainer: React.FC<{
  children: React.ReactNode;
  top?: string;
  zIndex?: number;
  className?: string;
}> = ({ children, top = '0', zIndex = 10, className }) => {
  return (
    <div 
      className={clsx('sticky', className)}
      style={{ 
        top,
        zIndex,
      }}
    >
      {children}
    </div>
  );
};
