"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, TrendingUp, Clock, Star, Sparkles, Trophy, Zap } from 'lucide-react';
import Input from '@/components/ui/Input';
import IconButton from '@/components/ui/IconButton';
import Tab from '@/components/ui/Tab';
import GameCard from '@/components/cards/GameCard';
import BottomNavigation from '@/components/layout/BottomNavigation';
import Badge from '@/components/ui/Badge';
import GlowCard from '@/components/ui/GlowCard';
import AnimatedText from '@/components/ui/AnimatedText';
import { useApi } from '@/hooks/useApi';

const categories = [
  { id: 'all', label: '전체', icon: '🎮' },
  { id: 'popular', label: '인기', icon: '🔥' },
  { id: 'new', label: '신규', icon: '✨' },
  { id: 'slots', label: '슬롯', icon: '🎰' },
  { id: 'mini', label: '미니게임', icon: '🎯' },
];

export default function GamesPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { data: gamesData, loading } = useApi('/api/games');
  
  const games = gamesData?.games || [];
  const recentGames = games.slice(0, 5);
  const recommendedGames = games.filter(g => g.isRecommended).slice(0, 3);
  
  const filteredGames = games.filter(game => {
    if (activeCategory !== 'all') {
      if (activeCategory === 'popular' && game.popularity < 80) return false;
      if (activeCategory === 'new' && !game.isNew) return false;
      if (activeCategory !== 'popular' && activeCategory !== 'new' && game.category !== activeCategory) return false;
    }
    if (searchQuery && !game.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-xl border-b border-purple-500/20">
        <div className="p-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <h1 className="text-3xl font-bold">
              <AnimatedText 
                text="게임 센터" 
                className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent"
              />
            </h1>
            <p className="text-sm text-gray-400 mt-1 flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              행운이 당신을 기다립니다!
            </p>
          </motion.div>
          
          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
              <Input
                type="text"
                placeholder="게임 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800/50 border-purple-500/30 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
            <IconButton 
              onClick={() => setShowFilters(!showFilters)}
              className={`${showFilters ? 'bg-purple-600' : 'bg-gray-800'} hover:bg-purple-600`}
            >
              <Filter className="w-5 h-5" />
            </IconButton>
          </div>
        </div>
        
        {/* Category Tabs */}
        <div className="px-4 pb-2 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 min-w-max">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2
                  ${activeCategory === category.id 
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-purple-500/30' 
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'}`}
              >
                <span className="text-lg">{category.icon}</span>
                <span>{category.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </header>
      
      <main className="p-4">
        {/* Recommended Games */}
        {!searchQuery && activeCategory === 'all' && recommendedGames.length > 0 && (
          <section className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 mb-4"
            >
              <Trophy className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-bold text-white">추천 게임</h2>
              <Badge variant="premium" className="ml-auto">
                <Zap className="w-3 h-3 mr-1" />
                HOT
              </Badge>
            </motion.div>
            
            <div className="grid grid-cols-1 gap-4">
              {recommendedGames.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlowCard glowColor="from-yellow-500 to-orange-500">
                    <div className="p-4 flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={game.thumbnail}
                          alt={game.name}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full p-1">
                          <Star className="w-4 h-4 text-white fill-current" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-white">{game.name}</h3>
                        <p className="text-sm text-gray-400">{game.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full">
                            🎁 2x 보너스
                          </span>
                          <span className="text-xs text-gray-500">
                            {game.players.toLocaleString()}명 플레이 중
                          </span>
                        </div>
                      </div>
                    </div>
                  </GlowCard>
                </motion.div>
              ))}
            </div>
          </section>
        )}
        
        {/* Recent Games */}
        {!searchQuery && activeCategory === 'all' && recentGames.length > 0 && (
          <section className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 mb-4"
            >
              <Clock className="w-6 h-6 text-purple-500" />
              <h2 className="text-xl font-bold text-white">최근 플레이</h2>
            </motion.div>
            
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {recentGames.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  className="flex-shrink-0"
                >
                  <div className="relative w-32">
                    <div className="relative rounded-xl overflow-hidden shadow-lg">
                      <img
                        src={game.thumbnail}
                        alt={game.name}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-2">
                        <p className="text-sm font-bold text-white truncate">{game.name}</p>
                        <p className="text-xs text-gray-300">10분 전</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}
        
        {/* Game Grid */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-between mb-4"
          >
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-2xl">{categories.find(c => c.id === activeCategory)?.icon}</span>
              {categories.find(c => c.id === activeCategory)?.label} 게임
            </h2>
            <span className="text-sm text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full">
              {filteredGames.length}개
            </span>
          </motion.div>
          
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredGames.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.05, 0.3) }}
                >
                  <GameCard game={game} />
                </motion.div>
              ))}
            </div>
          )}
          
          {!loading && filteredGames.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">😢</div>
              <p className="text-gray-400">게임을 찾을 수 없습니다</p>
            </motion.div>
          )}
        </section>
        
        {/* Filter Options Modal */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="fixed bottom-20 left-0 right-0 bg-gray-800 border-t border-purple-500/30 p-4 z-50"
            >
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5 text-purple-500" />
                필터 옵션
              </h3>
              <div className="space-y-3">
                {[
                  { id: 'high-popularity', label: '높은 인기순', icon: '🔥' },
                  { id: 'new-only', label: '신규 게임만', icon: '✨' },
                  { id: 'bonus-games', label: '보너스 게임', icon: '🎁' },
                  { id: 'jackpot', label: '잭팟 가능', icon: '💰' },
                ].map((filter) => (
                  <label key={filter.id} className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded border-purple-500/50 bg-gray-700 text-purple-500 focus:ring-purple-500/50" 
                    />
                    <span className="text-gray-300 flex items-center gap-2">
                      <span className="text-lg">{filter.icon}</span>
                      {filter.label}
                    </span>
                  </label>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowFilters(false)}
                className="w-full mt-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg"
              >
                적용하기
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      <BottomNavigation />
    </div>
  );
}