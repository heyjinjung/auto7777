"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import GlowCard from '@/components/ui/GlowCard';
import Logo from '@/components/ui/Logo';
import Loading from '@/components/ui/Loading';
import { useToast } from '@/hooks/useToast';

export default function SignupPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isValidatingCode, setIsValidatingCode] = useState(false);
  
  const [formData, setFormData] = useState({
    inviteCode: '',
    siteId: '',
    nickname: '',
    password: '',
    phoneNumber: ''
  });

  const [errors, setErrors] = useState({
    inviteCode: '',
    siteId: '',
    nickname: '',
    password: '',
    phoneNumber: ''
  });

  const validateInviteCode = async () => {
    setIsValidatingCode(true);
    // Simulate API call
    setTimeout(() => {
      setIsValidatingCode(false);
      if (formData.inviteCode === '123456') {
        setErrors({ ...errors, inviteCode: '' });
        showToast('초대 코드가 확인되었습니다!', 'success');
      } else {
        setErrors({ ...errors, inviteCode: '유효하지 않은 초대 코드입니다.' });
      }
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validation
    const newErrors = {
      inviteCode: formData.inviteCode ? '' : '초대 코드를 입력해주세요',
      siteId: formData.siteId ? '' : 'Site ID를 입력해주세요',
      nickname: formData.nickname ? '' : '닉네임을 입력해주세요',
      password: formData.password.length >= 4 ? '' : '비밀번호는 4자 이상이어야 합니다',
      phoneNumber: formData.phoneNumber ? '' : '전화번호를 입력해주세요'
    };
    
    setErrors(newErrors);
    
    if (Object.values(newErrors).some(error => error)) {
      setIsLoading(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      router.push('/auth/welcome');
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
          <h1 className="text-3xl font-bold text-white mb-2">회원가입</h1>
          <p className="text-gray-400">초대받은 분만 가입할 수 있습니다</p>
        </div>
        
        <GlowCard>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Invite Code */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                초대 코드
              </label>
              <div className="relative">
                <Input
                  type="text"
                  value={formData.inviteCode}
                  onChange={(e) => setFormData({ ...formData, inviteCode: e.target.value })}
                  placeholder="6자리 초대 코드"
                  maxLength={6}
                  className={errors.inviteCode ? 'border-red-500' : ''}
                />
                {formData.inviteCode.length === 6 && (
                  <motion.button
                    type="button"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    onClick={validateInviteCode}
                    disabled={isValidatingCode}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    {isValidatingCode ? (
                      <Loading size="sm" />
                    ) : errors.inviteCode ? (
                      <X className="w-5 h-5 text-red-500" />
                    ) : (
                      <Check className="w-5 h-5 text-green-500" />
                    )}
                  </motion.button>
                )}
              </div>
              {errors.inviteCode && (
                <p className="text-red-500 text-sm mt-1">{errors.inviteCode}</p>
              )}
            </div>
            
            {/* Site ID */}
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
            
            {/* Nickname */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                닉네임
              </label>
              <Input
                type="text"
                value={formData.nickname}
                onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                placeholder="사용할 닉네임"
                className={errors.nickname ? 'border-red-500' : ''}
              />
              {errors.nickname && (
                <p className="text-red-500 text-sm mt-1">{errors.nickname}</p>
              )}
            </div>
            
            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                비밀번호
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="4자 이상의 비밀번호"
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
            
            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                전화번호
              </label>
              <Input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="010-0000-0000"
                className={errors.phoneNumber ? 'border-red-500' : ''}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
              )}
            </div>
            
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600"
              disabled={isLoading}
            >
              {isLoading ? <Loading size="sm" /> : '회원가입'}
            </Button>
          </form>
        </GlowCard>
        
        <p className="text-center text-gray-400 mt-4">
          이미 계정이 있으신가요?{' '}
          <a href="/auth/login" className="text-pink-500 hover:text-pink-400">
            로그인
          </a>
        </p>
      </motion.div>
    </div>
  );
}