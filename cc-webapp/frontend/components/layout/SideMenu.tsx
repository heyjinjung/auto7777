import { motion, AnimatePresence } from 'framer-motion';
import { X, Home, Gamepad2, ShoppingBag, Globe, Clock, Calendar, Settings, LogOut, Info, Headphones } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import IconButton from '@/components/ui/IconButton';
import AnimatedNumber from '@/components/ui/AnimatedNumber';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    nickname: string;
    avatar: string;
    tokens: number;
    tier: string;
  };
}

const menuItems = [
  { icon: Home, label: '홈', href: '/' },
  { icon: Gamepad2, label: '게임', href: '/games' },
  { icon: ShoppingBag, label: '상점', href: '/shop' },
  { icon: Globe, label: '본사사이트', href: '/corporate', external: true },
  { icon: Clock, label: '내역', href: '/history' },
  { icon: Calendar, label: '이벤트', href: '/events' },
  { icon: Settings, label: '설정', href: '/settings' },
];

export default function SideMenu({ isOpen, onClose, user }: SideMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed left-0 top-0 bottom-0 w-80 bg-gray-900 z-50 shadow-xl"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-4 border-b border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">메뉴</h2>
                  <IconButton onClick={onClose}>
                    <X className="w-5 h-5" />
                  </IconButton>
                </div>
                
                {/* User Profile Summary */}
                <div className="flex items-center gap-3">
                  <Avatar src={user.avatar} alt={user.nickname} size="md" />
                  <div className="flex-1">
                    <p className="font-semibold text-white">{user.nickname}</p>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">💎</span>
                      <AnimatedNumber value={user.tokens} className="text-sm text-gray-300" />
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded text-xs font-bold text-white">
                    {user.tier}
                  </span>
                </div>
              </div>
              
              {/* Menu Items */}
              <nav className="flex-1 p-4">
                <ul className="space-y-2">
                  {menuItems.map((item, index) => (
                    <motion.li
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <a
                        href={item.href}
                        target={item.external ? '_blank' : undefined}
                        rel={item.external ? 'noopener noreferrer' : undefined}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white"
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </a>
                    </motion.li>
                  ))}
                </ul>
                
                <div className="mt-8 pt-8 border-t border-gray-800">
                  <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors text-red-400 hover:text-red-300 w-full">
                    <LogOut className="w-5 h-5" />
                    <span>로그아웃</span>
                  </button>
                </div>
              </nav>
              
              {/* Footer */}
              <div className="p-4 border-t border-gray-800">
                <div className="flex justify-between text-sm text-gray-500">
                  <button className="flex items-center gap-1 hover:text-gray-300">
                    <Info className="w-4 h-4" />
                    버전 1.0.0
                  </button>
                  <button className="flex items-center gap-1 hover:text-gray-300">
                    <Headphones className="w-4 h-4" />
                    고객센터
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}