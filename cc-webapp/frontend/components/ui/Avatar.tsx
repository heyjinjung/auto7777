import Image from "next/image";
import { motion } from "framer-motion";
import clsx from "clsx";

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  fallback?: string;
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16", 
  xl: "w-24 h-24"
};

export default function Avatar({ 
  src, 
  alt = "Avatar", 
  size = "md", 
  className,
  fallback = "👤"
}: AvatarProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={clsx(
        "relative rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center",
        sizeClasses[size],
        className
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes={`(max-width: 768px) ${sizeClasses[size]}, ${sizeClasses[size]}`}
        />
      ) : (
        <span className="text-white text-xl">
          {fallback}
        </span>
      )}
      
      {/* Online status indicator for larger avatars */}
      {(size === "lg" || size === "xl") && (
        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
      )}
    </motion.div>
  );
}
