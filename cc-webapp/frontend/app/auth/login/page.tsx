"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import GlowCard from '@/components/ui/GlowCard';
import Logo from '@/components/ui/Logo';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    siteId: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({
    siteId: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const newErrors = {
      siteId: formData.siteId ? '' : 'Site ID를 입력해주세요',
      password: formData.password ? '' : '비밀번호를 입력해주세요'
    };
    
    setErrors(newErrors);
    
    if (Object.values(newErrors).some(error => error)) {
      setIsLoading(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      router.push('/');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Logo size="lg" glow className="mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">
            다시 오신 것을 환영합니다!
          </h1>
          <p className="text-gray-400">계속하려면 로그인하세요</p>
        </div>
        
        <GlowCard>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Site ID
              </label>
              <Input
                type="text"
                value={formData.siteId}
                onChange={(e) => setFormData({ ...formData, siteId: e.target.value })}
                placeholder="사이트 ID 입력"
                className={errors.siteId ? 'border-red-500' : ''}
              />
              {errors.siteId && (
                <p className="text-red-500 text-sm mt-1">{errors.siteId}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                비밀번호
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="비밀번호 입력"
                  className={errors.password ? 'border-red-500' : ''}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 rounded" />
                <span className="text-sm text-gray-400">로그인 상태 유지</span>
              </label>
              <a href="/auth/forgot-password" className="text-sm text-pink-500 hover:text-pink-400">
                비밀번호 찾기
              </a>
            </div>
            
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600"
              disabled={isLoading}
            >
              {isLoading ? (
                <motion.div
                  className="flex justify-center items-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="inline-block w-5 h-5 border-2 border-t-2 border-pink-500 border-t-purple-600 rounded-full animate-spin" />
                </motion.div>
              ) : '로그인'}
            </Button>
          </form>
        </GlowCard>
        
        <p className="text-center text-gray-400 mt-4">
          아직 계정이 없으신가요?{' '}
          <a href="/auth/signup" className="text-pink-500 hover:text-pink-400">
            회원가입
          </a>
        </p>
      </motion.div>
    </div>
  );
}