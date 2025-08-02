'use client'

export default function RPSPage() {
  return (
    <div className="min-h-screen bg-black p-4">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold neon-text mb-2">
          ✂️ 가위바위보
        </h1>
        <p className="text-cyber-blue/80">
          컴퓨터와 대결하여 승부를 가려보세요
        </p>
      </div>

      {/* 게임 컨테이너 */}
      <div className="max-w-4xl mx-auto">
        <div className="cyber-card p-8 text-center">
          <h2 className="text-xl neon-text mb-4">가위바위보 게임 준비중</h2>
          <p className="text-cyber-blue/70 mb-6">
            기존 RPS 컴포넌트를 연결하는 중입니다...
          </p>
          
          {/* 임시 RPS 시뮬레이션 */}
          <div className="space-y-6">
            <div className="flex justify-center gap-8 text-4xl">
              <div>✂️</div>
              <div>VS</div>
              <div>❓</div>
            </div>
            <div className="flex justify-center gap-4">
              <button className="cyber-button">✂️ 가위</button>
              <button className="cyber-button">📄 바위</button>
              <button className="cyber-button">🗿 보</button>
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
