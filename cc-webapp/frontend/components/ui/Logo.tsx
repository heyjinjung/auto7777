import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  glow?: boolean;
  className?: string;
}

export default function Logo({ size = "md", glow = false, className = "" }: LogoProps) {
  const sizeMap = { sm: 32, md: 48, lg: 64 };
  const px = sizeMap[size] || 48;
  return (
    <div
      className={`flex items-center justify-center ${glow ? "drop-shadow-neon" : ""} ${className}`}
      style={{ width: px, height: px }}
    >
      {/* Replace with your actual logo SVG or image */}
      <svg width={px} height={px} viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="28" stroke="#e11d48" strokeWidth="4" fill="#a21caf" />
        <text x="32" y="38" textAnchor="middle" fontSize="20" fill="#fff" fontWeight="bold">CC</text>
      </svg>
    </div>
  );
}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-full blur-lg opacity-75"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
      <div className="relative z-10 w-full h-full bg-gradient-to-br from-pink-500 via-purple-600 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
        {/* Temporary logo - replace with actual logo image */}
        <div className="text-xl">🎰</div>
      </div>
    </motion.div>
  );
}
