import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const symbols = ['🍒', '🍋', '🍊', '🍇', '🔔', '💎', '7️⃣', '🎰'];

interface SlotMachineProps {
  isSpinning: boolean;
  result?: any;
  onComplete: () => void;
}

export default function SlotMachine({ isSpinning, result, onComplete }: SlotMachineProps) {
  const [reels, setReels] = useState([
    [symbols[0], symbols[1], symbols[2]],
    [symbols[3], symbols[4], symbols[5]],
    [symbols[6], symbols[7], symbols[0]],
  ]);

  useEffect(() => {
    if (isSpinning) {
      // Random spinning effect
      const interval = setInterval(() => {
        setReels(reels.map(() => 
          Array(3).fill(0).map(() => symbols[Math.floor(Math.random() * symbols.length)])
        ));
      }, 100);
      
      return () => clearInterval(interval);
    } else if (result) {
      // Set final result
      setReels(result.reels || reels);
    }
  }, [isSpinning, result]);

  return (
    <div className="relative">
      {/* Slot Machine Frame */}
      <div className="bg-gradient-to-br from-yellow-600 via-orange-600 to-red-600 p-1 rounded-3xl shadow-2xl">
        <div className="bg-gray-900 rounded-3xl p-6">
          {/* Title */}
          <div className="text-center mb-4">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              LUCKY SLOTS
            </h2>
            <div className="flex justify-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  className="w-2 h-2 bg-yellow-500 rounded-full"
                />
              ))}
            </div>
          </div>
          
          {/* Reels Container */}
          <div className="bg-black/50 rounded-2xl p-4 backdrop-blur-sm">
            <div className="grid grid-cols-3 gap-2">
              {reels.map((reel, reelIndex) => (
                <div key={reelIndex} className="relative">
                  {/* Reel Background */}
                  <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl p-2 shadow-inner">
                    <div className="space-y-2">
                      {reel.map((symbol, symbolIndex) => (
                        <motion.div
                          key={`${reelIndex}-${symbolIndex}`}
                          animate={isSpinning ? {
                            y: [-100, 0],
                          } : {}}
                          transition={{
                            duration: 0.1,
                            repeat: isSpinning ? Infinity : 0,
                          }}
                          className="bg-white/10 rounded-lg p-4 flex items-center justify-center"
                        >
                          <span className="text-4xl filter drop-shadow-lg">
                            {symbol}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Winning Line Indicator */}
                  {!isSpinning && result?.isWin && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 pointer-events-none"
                    >
                      <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent -translate-y-1/2" />
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Win Line */}
            <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-red-500/50 -translate-y-1/2 pointer-events-none" />
          </div>
          
          {/* Win Animation */}
          <AnimatePresence>
            {!isSpinning && result?.isWin && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div className="bg-black/80 backdrop-blur-sm rounded-3xl p-8">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: 3,
                    }}
                    className="text-center"
                  >
                    <div className="text-6xl mb-4">🎉</div>
                    <h3 className="text-3xl font-bold text-yellow-400 mb-2">
                      WIN!
                    </h3>
                    <p className="text-2xl text-white">
                      +{result.reward.toLocaleString()} 토큰
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Decorative Lights */}
      <div className="absolute -top-4 -left-4 -right-4 flex justify-around">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
            className="w-4 h-4 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50"
          />
        ))}
      </div>
    </div>
  );
}