'use client';

import React, { useState, forwardRef } from 'react';
import { motion } from 'framer-motion';

type InputProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  icon?: React.ReactNode;
  successIcon?: React.ReactNode;
  isValid?: boolean;
  showSuccessIndicator?: boolean;
  validateOnBlur?: boolean;
  onValidate?: (value: string) => boolean | Promise<boolean>;
  validating?: boolean;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'type'>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      name,
      type = 'text',
      placeholder,
      required = false,
      error,
      icon,
      successIcon,
      isValid = false,
      showSuccessIndicator = false,
      validateOnBlur = false,
      onValidate,
      validating = false,
      ...rest
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isValidating, setIsValidating] = useState(false);
    const [localError, setLocalError] = useState<string | undefined>(undefined);
    
    const handleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      
      if (validateOnBlur && onValidate && e.target.value) {
        setIsValidating(true);
        try {
          const isValid = await onValidate(e.target.value);
          setLocalError(isValid ? undefined : '유효하지 않은 값입니다');
        } catch (err) {
          setLocalError('검증 중 오류가 발생했습니다');
        }
        setIsValidating(false);
      }
      
      if (rest.onBlur) {
        rest.onBlur(e);
      }
    };

    const errorToShow = error || localError;
    
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          
          <motion.input
            ref={ref}
            type={type}
            name={name}
            id={name}
            placeholder={placeholder}
            required={required}
            className={`
              block w-full rounded-lg px-4 py-3 text-base
              ${icon ? 'pl-10' : ''} 
              ${(isValid && showSuccessIndicator) || successIcon ? 'pr-10' : ''}
              border
              ${errorToShow 
                ? 'border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
              }
              dark:bg-gray-800 dark:text-white
              transition duration-200 ease-in-out
              ${isFocused ? 'ring-2 ring-indigo-500/30' : ''}
            `}
            onFocus={(e) => {
              setIsFocused(true);
              if (rest.onFocus) rest.onFocus(e);
            }}
            onBlur={handleBlur}
            {...rest}
          />
          
          {isValidating || validating ? (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-5 h-5 border-t-2 border-indigo-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            (isValid && showSuccessIndicator) && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500"
              >
                {successIcon || (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </motion.div>
            )
          )}
        </div>
        
        {errorToShow && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-xs text-red-500"
          >
            {errorToShow}
          </motion.p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
