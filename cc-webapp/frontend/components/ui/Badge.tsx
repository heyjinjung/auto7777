import { ReactNode } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "primary" | "secondary" | "success" | "warning" | "error" | "premium";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const variantClasses = {
  default: "bg-gray-600 text-gray-100",
  primary: "bg-purple-600 text-white",
  secondary: "bg-gray-500 text-white",
  success: "bg-green-600 text-white",
  warning: "bg-yellow-600 text-white",
  error: "bg-red-600 text-white",
  premium: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
};

const sizeClasses = {
  sm: "px-2 py-1 text-xs",
  md: "px-3 py-1 text-sm",
  lg: "px-4 py-2 text-base"
};

export default function Badge({ 
  children, 
  variant = "default", 
  size = "sm", 
  className 
}: BadgeProps) {
  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={clsx(
        "inline-flex items-center gap-1 font-medium rounded-full whitespace-nowrap",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </motion.span>
  );
}
