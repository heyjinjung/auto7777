'use client'

import { useState } from 'react'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* 로고 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold neon-text mb-2">
            🔐 {isLogin ? '로그인' : '회원가입'}
          </h1>
          <p className="text-cyber-blue/80">
            CASINO CLUB F2P에 오신 것을 환영합니다
          </p>
        </div>

        {/* 폼 */}
        <div className="cyber-card p-8">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-cyber-blue mb-2">
                이메일
              </label>
              <input
                type="email"
                className="cyber-input w-full"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-cyber-blue mb-2">
                비밀번호
              </label>
              <input
                type="password"
                className="cyber-input w-full"
                placeholder="••••••••"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-cyber-blue mb-2">
                  비밀번호 확인
                </label>
                <input
                  type="password"
                  className="cyber-input w-full"
                  placeholder="••••••••"
                />
              </div>
            )}

            <button
              type="submit"
              className="cyber-button w-full text-lg py-3"
            >
              {isLogin ? '로그인' : '회원가입'}
            </button>
          </form>

          {/* 토글 */}
          <div className="text-center mt-6">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-cyber-blue hover:text-cyber-cyan transition-colors"
            >
              {isLogin ? '계정이 없으신가요? 회원가입' : '이미 계정이 있으신가요? 로그인'}
            </button>
          </div>

          {/* 소셜 로그인 (임시) */}
          <div className="mt-6 pt-6 border-t border-cyber-blue/20">
            <div className="text-center mb-4 text-sm text-cyber-blue/70">
              또는
            </div>
            <div className="space-y-3">
              <button className="cyber-button-secondary w-full">
                🔍 Google로 계속하기
              </button>
              <button className="cyber-button-secondary w-full">
                💬 Discord로 계속하기
              </button>
            </div>
          </div>
        </div>

        {/* 홈 버튼 */}
        <div className="text-center mt-6">
          <button 
            onClick={() => window.location.href = '/'}
            className="text-cyber-blue hover:text-cyber-cyan transition-colors"
          >
            ← 홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  )
}
