import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { TrendingUp, Users, Zap } from 'lucide-react';
import Badge from '@/components/ui/Badge';

interface GameCardProps {
  game: {
    id: number;
    name: string;
    thumbnail: string;
    category: string;
    popularity: number;
    isNew: boolean;
    players: number;
    minBet?: number;
    maxReward?: number;
  };
}

export default function GameCard({ game }: GameCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/games/${game.category}/${game.id}`);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className="relative cursor-pointer group"
    >
      <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg shadow-purple-500/10 hover:shadow-purple-500/30 transition-all">
        {/* Thumbnail */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={game.thumbnail}
            alt={game.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex gap-2">
            {game.isNew && (
              <Badge variant="premium" className="bg-gradient-to-r from-pink-500 to-purple-500">
                NEW
              </Badge>
            )}
            {game.popularity > 90 && (
              <Badge variant="success" className="bg-gradient-to-r from-orange-500 to-red-500">
                🔥 HOT
              </Badge>
            )}
          </div>
          
          {/* Live Players */}
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-white">{game.players.toLocaleString()}</span>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-3">
          <h3 className="font-bold text-white text-sm mb-1 truncate">{game.name}</h3>
          
          {/* Stats */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-gray-400">
              <TrendingUp className="w-3 h-3" />
              <span>{game.popularity}%</span>
            </div>
            
            {game.maxReward && (
              <div className="flex items-center gap-1 text-yellow-500">
                <Zap className="w-3 h-3" />
                <span>최대 {game.maxReward.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Hover Effect */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-t from-purple-600/50 to-transparent pointer-events-none"
        />
      </div>
    </motion.div>
  );
}