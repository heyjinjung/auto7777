"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Gift, Sparkles, Trophy } from 'lucide-react';
import Button from '@/components/ui/Button';
import GlowCard from '@/components/ui/GlowCard';
import ConfettiEffect from '@/components/effects/ConfettiEffect';
import AnimatedNumber from '@/components/ui/AnimatedNumber';

export default function WelcomePage() {
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(false);
  
  useEffect(() => {
    setShowConfetti(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center px-4 py-8">
      {showConfetti && <ConfettiEffect />}
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="w-full max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="text-center mb-8"
        >
          <div className="inline-flex p-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 mb-4">
            <Trophy className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">축하합니다!</h1>
          <p className="text-gray-300">가입이 완료되었습니다</p>
        </motion.div>
        
        <GlowCard>
          <div className="p-6 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-pink-500/20 to-purple-600/20 rounded-lg"
            >
              <Gift className="w-8 h-8 text-pink-500" />
              <div>
                <p className="text-sm text-gray-400">웰컴 보너스</p>
                <div className="flex items-center gap-2">
                  <AnimatedNumber value={50000} className="text-2xl font-bold text-white" />
                  <span className="text-yellow-500">토큰</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-500/20 to-blue-600/20 rounded-lg"
            >
              <Sparkles className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-400">추가 보너스</p>
                <p className="text-lg font-semibold text-white">첫 입금 시 100% 매칭</p>
              </div>
            </motion.div>
          </div>
        </GlowCard>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-6"
        >
          <Button
            onClick={() => router.push('/')}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600"
            size="lg"
          >
            시작하기
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}