import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Gift, Share2, RotateCcw, Gamepad2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import ConfettiEffect from '@/components/effects/ConfettiEffect';

interface GameResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: any;
  onPlayAgain: () => void;
  onGoToGames: () => void;
}

export default function GameResultModal({ 
  isOpen, 
  onClose, 
  result, 
  onPlayAgain, 
  onGoToGames 
}: GameResultModalProps) {
  if (!result) return null;

  const isWin = result.reward > 0 || result.result === 'win';
  const isDraw = result.result === 'draw';
  
  const getResultMessage = () => {
    if (isDraw) return '무승부!';
    return isWin ? '축하합니다!// filepath: c:\Users\bdbd\0000\cc-webapp\frontend\components\games\GameResultModal.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Gift, Share2, RotateCcw, Gamepad2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import ConfettiEffect from '@/components/effects/ConfettiEffect';

interface GameResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: any;
  onPlayAgain: () => void;
  onGoToGames: () => void;
}

export default function GameResultModal({ 
  isOpen, 
  onClose, 
  result, 
  onPlayAgain, 
  onGoToGames 
}: GameResultModalProps) {
  if (!result) return null;

  const isWin = result.reward > 0 || result.result === 'win';
  const isDraw = result.result === 'draw';
  
  const getResultMessage = () => {
    if