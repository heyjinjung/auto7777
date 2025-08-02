'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

// Checkbox Component
export const Checkbox: React.FC<{
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}> = ({ label, checked = false, onChange, disabled = false, className }) => {
  return (
    <motion.label
      className={clsx(
        'flex items-center cursor-pointer space-x-3',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        
        <motion.div
          className={clsx(
            'w-5 h-5 rounded border-2 transition-all duration-200',
            checked
              ? 'bg-gradient-pink border-pink-primary'
              : 'bg-bg-tertiary border-text-muted hover:border-pink-primary'
          )}
          animate={{
            scale: checked ? 1.1 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          {checked && (
            <motion.svg
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="w-full h-full text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </motion.svg>
          )}
        </motion.div>
      </div>
      
      {label && (
        <span className="text-text-primary font-medium">
          {label}
        </span>
      )}
    </motion.label>
  );
};

// Radio Component
export const Radio: React.FC<{
  label?: string;
  name: string;
  value: string;
  checked?: boolean;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}> = ({ label, name, value, checked = false, onChange, disabled = false, className }) => {
  return (
    <motion.label
      className={clsx(
        'flex items-center cursor-pointer space-x-3',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      <div className="relative">
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className="sr-only"
        />
        
        <motion.div
          className={clsx(
            'w-5 h-5 rounded-full border-2 transition-all duration-200',
            checked
              ? 'border-pink-primary'
              : 'border-text-muted hover:border-pink-primary'
          )}
          animate={{
            scale: checked ? 1.1 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          {checked && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="w-full h-full rounded-full bg-gradient-pink scale-50"
            />
          )}
        </motion.div>
      </div>
      
      {label && (
        <span className="text-text-primary font-medium">
          {label}
        </span>
      )}
    </motion.label>
  );
};

// Select Component
export const Select: React.FC<{
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  disabled?: boolean;
  error?: string;
  className?: string;
}> = ({ label, placeholder, value, onChange, options, disabled = false, error, className }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const selectedOption = options.find(option => option.value === value);

  return (
    <div className={clsx('relative w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-text-secondary mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        <motion.button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={clsx(
            'w-full px-4 py-3 rounded-lg transition-all duration-300',
            'bg-bg-tertiary border border-transparent text-left',
            'text-text-primary font-medium',
            'focus:outline-none focus:ring-2 focus:ring-pink-primary/30',
            'focus:bg-bg-secondary focus:border-pink-primary/50',
            {
              'border-error': error,
              'opacity-50 cursor-not-allowed': disabled,
            }
          )}
          whileTap={{ scale: disabled ? 1 : 0.98 }}
        >
          <span className={clsx(
            selectedOption ? 'text-text-primary' : 'text-text-muted'
          )}>
            {selectedOption?.label || placeholder || '선택하세요'}
          </span>
          
          <motion.svg
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </motion.button>

        {/* Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-1 bg-bg-secondary border border-bg-tertiary rounded-lg shadow-lg z-dropdown max-h-60 overflow-y-auto"
            >
              {options.map((option) => (
                <motion.button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    if (!option.disabled) {
                      onChange?.(option.value);
                      setIsOpen(false);
                    }
                  }}
                  className={clsx(
                    'w-full px-4 py-3 text-left transition-colors',
                    'hover:bg-bg-tertiary',
                    {
                      'bg-pink-primary/10 text-pink-primary': value === option.value,
                      'text-text-primary': value !== option.value && !option.disabled,
                      'text-text-muted opacity-50 cursor-not-allowed': option.disabled,
                    }
                  )}
                  whileHover={option.disabled ? {} : { backgroundColor: 'var(--color-bg-tertiary)' }}
                  disabled={option.disabled}
                >
                  {option.label}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <p className="text-error text-xs mt-1">{error}</p>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-dropdown"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

// Slider Component
export const Slider: React.FC<{
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  showValue?: boolean;
  className?: string;
}> = ({ 
  label, 
  value, 
  onChange, 
  min = 0, 
  max = 100, 
  step = 1, 
  disabled = false, 
  showValue = true,
  className 
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={clsx('w-full space-y-2', className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center">
          {label && (
            <label className="text-sm font-medium text-text-secondary">
              {label}
            </label>
          )}
          {showValue && (
            <span className="text-sm font-bold text-pink-primary">
              {value.toLocaleString()}
            </span>
          )}
        </div>
      )}
      
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className="sr-only"
        />
        
        {/* Track */}
        <div className="h-2 bg-bg-tertiary rounded-full relative overflow-hidden">
          {/* Progress */}
          <motion.div
            className="h-full bg-gradient-pink rounded-full"
            style={{ width: `${percentage}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Thumb */}
          <motion.div
            className="absolute top-1/2 transform -translate-y-1/2 w-5 h-5 bg-white border-2 border-pink-primary rounded-full shadow-lg cursor-pointer"
            style={{ left: `calc(${percentage}% - 10px)` }}
            whileHover={{ scale: 1.2 }}
            whileDrag={{ scale: 1.3 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0}
            onDrag={(_, info) => {
              const rect = (info.point.x / window.innerWidth) * 100;
              const newValue = Math.round(((rect / 100) * (max - min)) + min);
              const clampedValue = Math.max(min, Math.min(max, newValue));
              onChange(clampedValue);
            }}
          />
        </div>
      </div>
    </div>
  );
};

// Form Container Component
export const FormContainer: React.FC<{
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
}> = ({ children, onSubmit, className }) => {
  return (
    <form
      onSubmit={onSubmit}
      className={clsx('space-y-4', className)}
    >
      {children}
    </form>
  );
};
