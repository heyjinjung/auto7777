'use client'

export default function SlotsPage() {
  return (
    <div className="min-h-screen bg-black p-4">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold neon-text mb-2">
          🎰 슬롯머신
        </h1>
        <p className="text-cyber-blue/80">
          777 잭팟을 노려보세요!
        </p>
      </div>

      {/* 게임 컨테이너 */}
      <div className="max-w-4xl mx-auto">
        <div className="cyber-card p-8 text-center">
          <h2 className="text-xl neon-text mb-4">슬롯머신 게임 준비중</h2>
          <p className="text-cyber-blue/70 mb-6">
            기존 슬롯 컴포넌트를 연결하는 중입니다...
          </p>
          
          {/* 임시 슬롯 시뮬레이션 */}
          <div className="space-y-6">
            <div className="flex justify-center gap-4 text-6xl mb-6">
              <div className="border-2 border-cyber-blue rounded p-4">🍒</div>
              <div className="border-2 border-cyber-blue rounded p-4">🍋</div>
              <div className="border-2 border-cyber-blue rounded p-4">💎</div>
            </div>
            <button className="cyber-button text-lg px-8 py-3">
              🎲 스핀! (임시)
            </button>
            <div className="text-cyber-green">
              코인: 1000 💰
            </div>
          </div>
        </div>
      </div>

      {/* 네비게이션 */}
      <div className="flex justify-center gap-4 mt-8">
        <button 
          onClick={() => window.location.href = '/games'}
          className="cyber-button-secondary"
        >
          ← 게임 목록
        </button>
        <button 
          onClick={() => window.location.href = '/'}
          className="cyber-button-secondary"
        >
          🏠 홈
        </button>
      </div>
    </div>
  )
}
