"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Settings, Gamepad2, Globe, Gift, ChevronRight } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import IconButton from '@/components/ui/IconButton';
import AnimatedNumber from '@/components/ui/AnimatedNumber';
import GlowCard from '@/components/ui/GlowCard';
import BottomNavigation from '@/components/layout/BottomNavigation';
import SideMenu from '@/components/layout/SideMenu';
import EventCarousel from '@/components/events/EventCarousel';
import QuickAccessCard from '@/components/cards/QuickAccessCard';

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  
  // Mock user data
  const user = {
    nickname: "럭키플레이어",
    avatar: "/avatars/default.png",
    tokens: 125000,
    tier: "VIP"
  };
  
  const quickAccessItems = [
    { id: 1, title: "슬롯머신", icon: "🎰", bonus: "+50%" },
    { id: 2, title: "룰렛", icon: "🎯", bonus: "무료 스핀" },
    { id: 3, title: "블랙잭", icon: "🃏", bonus: "2x 포인트" },
    { id: 4, title: "포커", icon: "♠️", bonus: "토너먼트" },
  ];
  
  const events = [
    { id: 1, image: "/events/event1.jpg", title: "주말 특별 보너스" },
    { id: 2, image: "/events/event2.jpg", title: "신규 게임 출시" },
    { id: 3, image: "/events/event3.jpg", title: "VIP 전용 이벤트" },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Casino Club
          </h1>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <IconButton onClick={() => {}}>
                <Bell className="w-5 h-5" />
              </IconButton>
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center text-xs font-bold">
                  {notifications}
                </span>
              )}
            </div>
            <IconButton onClick={() => setMenuOpen(true)}>
              <Settings className="w-5 h-5" />
            </IconButton>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="pt-16 pb-20 px-4">
        {/* User Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 mb-6"
        >
          <GlowCard>
            <div className="p-4 flex items-center gap-4">
              <Avatar src={user.avatar} alt={user.nickname} size="lg" />
              <div className="flex-1">
                <p className="text-sm text-gray-400">안녕하세요!</p>
                <p className="font-semibold text-white">{user.nickname}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-yellow-500">💎</span>
                  <AnimatedNumber value={user.tokens} className="font-bold text-white" />
                  <span className="text-xs text-gray-400 ml-1">토큰</span>
                </div>
              </div>
              <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-xs font-bold text-white">
                {user.tier}
              </span>
            </div>
          </GlowCard>
        </motion.div>
        
        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 gap-3 mb-6"
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg"
            onClick={() => {}}
          >
            <Gamepad2 className="mr-2 w-5 h-5" />
            게임 시작하기
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => {}}
              className="border-purple-500 text-purple-400"
            >
              <Globe className="mr-2 w-4 h-4" />
              사이트 방문
            </Button>
            
            <Button
              onClick={() => {}}
              className="bg-gradient-to-r from-yellow-500 to-orange-500"
            >
              <Gift className="mr-2 w-4 h-4" />
              보너스 받기
            </Button>
          </div>
        </motion.div>
        
        {/* Quick Access Cards */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-white">빠른 접속</h2>
            <button className="text-sm text-pink-500 flex items-center">
              모두 보기 <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {quickAccessItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <QuickAccessCard {...item} />
              </motion.div>
            ))}
          </div>
        </section>
        
        {/* Event Carousel */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-white mb-3">이벤트</h2>
          <EventCarousel events={events} />
        </section>
        
        {/* Ongoing Events */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">진행 중인 이벤트</h2>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <GlowCard>
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center text-2xl">
                        🎁
                      </div>
                      <div>
                        <p className="font-semibold text-white">일일 미션 완료</p>
                        <p className="text-sm text-gray-400">3게임 플레이하고 보상 받기</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
      
      {/* Bottom Navigation */}
      <BottomNavigation />
      
      {/* Side Menu */}
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} user={user} />
    </div>
  );
}