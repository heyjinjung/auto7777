'use client'

export default function RoulettePage() {
  return (
    <div className="min-h-screen bg-black p-4">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold neon-text mb-2">
          🎲 룰렛
        </h1>
        <p className="text-cyber-blue/80">
          운명의 바퀴를 돌려보세요
        </p>
      </div>

      {/* 게임 컨테이너 */}
      <div className="max-w-4xl mx-auto">
        <div className="cyber-card p-8 text-center">
          <h2 className="text-xl neon-text mb-4">룰렛 게임 준비중</h2>
          <p className="text-cyber-blue/70 mb-6">
            기존 룰렛 컴포넌트를 연결하는 중입니다...
          </p>
          
          {/* 임시 룰렛 시뮬레이션 */}
          <div className="space-y-6">
            <div className="w-48 h-48 mx-auto border-4 border-cyber-blue rounded-full flex items-center justify-center text-4xl">
              🎯
            </div>
            <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
              <button className="cyber-button-small bg-cyber-red/20">빨강</button>
              <button className="cyber-button-small bg-gray-500/20">검정</button>
              <button className="cyber-button-small bg-cyber-green/20">초록</button>
              <button className="cyber-button-small bg-cyber-blue/20">파랑</button>
            </div>
            <button className="cyber-button text-lg px-8 py-3">
              🎲 룰렛 돌리기! (임시)
            </button>
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
