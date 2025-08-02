# 🌐 Casino Club F2P - API 연동 체크리스트

이 문서는 프론트엔드와 백엔드 API 간의 연동 포인트를 정리한 체크리스트입니다.

## 🔑 1. 인증 관련 API

### 1.1 회원가입/로그인 API
- [ ] 초대 코드 검증 API (`/api/auth/verify-invite`)
  - 요청: `{ code: string }`
  - 응답: `{ valid: boolean }`

- [ ] 회원가입 API (`/api/auth/signup`)
  - 요청: `{ site_id: string, nickname: string, phone_number: string, password: string, invite_code: string }`
  - 응답: `{ access_token: string, token_type: string, expires_in: number }`

- [ ] 로그인 API (`/api/auth/login`)
  - 요청: `{ site_id: string, password: string }`
  - 응답: `{ access_token: string, token_type: string, expires_in: number }`

- [ ] 토큰 갱신 API (`/api/auth/refresh`)
  - 요청: `{ refresh_token: string }`
  - 응답: `{ access_token: string, token_type: string, expires_in: number }`

- [ ] 로그아웃 API (`/api/auth/logout`)
  - 요청: 토큰 기반 인증
  - 응답: `{ success: boolean }`

## 👤 2. 사용자 관련 API

### 2.1 사용자 프로필 API
- [ ] 사용자 정보 조회 API (`/api/users/me`)
  - 요청: 토큰 기반 인증
  - 응답: `{ id: number, site_id: string, nickname: string, phone_number: string, cyber_token_balance: number, rank: string }`

- [ ] 사용자 프로필 업데이트 API (`/api/users/me`)
  - 요청: `{ nickname?: string, phone_number?: string }`
  - 응답: `{ success: boolean, user: UserProfile }`

- [ ] 비밀번호 변경 API (`/api/users/password`)
  - 요청: `{ current_password: string, new_password: string }`
  - 응답: `{ success: boolean }`

## 🎮 3. 게임 관련 API

### 3.1 게임 목록 및 정보 API
- [ ] 게임 목록 조회 API (`/api/games`)
  - 요청: `{ category?: string, limit?: number, offset?: number }`
  - 응답: `{ games: Game[], total: number }`

- [ ] 게임 상세 정보 API (`/api/games/{id}`)
  - 요청: 게임 ID
  - 응답: `{ id: number, name: string, description: string, thumbnail: string, rules: any[], min_bet: number, max_bet: number }`

### 3.2 게임 실행 API
- [ ] 슬롯 게임 스핀 API (`/api/games/slot/spin`)
  - 요청: `{ bet_amount: number }`
  - 응답: `{ result: SlotResult, reward: number, balance: number }`

- [ ] 가챠 뽑기 API (`/api/games/gacha/spin`)
  - 요청: `{ gacha_id: number, quantity: number }`
  - 응답: `{ items: GachaItem[], balance: number }`

- [ ] 가위바위보 게임 API (`/api/games/rps/play`)
  - 요청: `{ choice: 'rock' | 'paper' | 'scissors', bet_amount: number }`
  - 응답: `{ player_choice: string, computer_choice: string, result: 'win' | 'lose' | 'draw', reward: number, balance: number }`

- [ ] 룰렛 게임 API (`/api/games/roulette/spin`)
  - 요청: `{ bets: { position: string, amount: number }[] }`
  - 응답: `{ result: number, rewards: { position: string, amount: number }[], total_reward: number, balance: number }`

## 💰 4. 토큰 및 상점 API

### 4.1 사이버 토큰 API
- [ ] 토큰 잔액 조회 API (`/api/tokens/balance`)
  - 요청: 토큰 기반 인증
  - 응답: `{ balance: number, last_updated: string }`

- [ ] 토큰 획득 내역 API (`/api/tokens/history`)
  - 요청: `{ limit?: number, offset?: number }`
  - 응답: `{ transactions: TokenTransaction[], total: number }`

- [ ] 일일 출석 체크 API (`/api/tokens/daily-check`)
  - 요청: 토큰 기반 인증
  - 응답: `{ success: boolean, streak: number, reward: number, next_reward: number }`

### 4.2 상점 API
- [ ] 상품 목록 조회 API (`/api/shop/items`)
  - 요청: `{ category?: string, limit?: number, offset?: number }`
  - 응답: `{ items: ShopItem[], total: number }`

- [ ] 상품 상세 정보 API (`/api/shop/items/{id}`)
  - 요청: 상품 ID
  - 응답: `{ id: number, name: string, description: string, price: number, discount: number, image: string, details: any }`

- [ ] 상품 구매 API (`/api/shop/buy`)
  - 요청: `{ item_id: number, quantity: number }`
  - 응답: `{ success: boolean, transaction_id: string, balance: number }`

## 🔔 5. 알림 및 소통 API

### 5.1 알림 API
- [ ] 알림 목록 조회 API (`/api/notifications`)
  - 요청: `{ read?: boolean, limit?: number, offset?: number }`
  - 응답: `{ notifications: Notification[], total: number, unread_count: number }`

- [ ] 알림 읽음 처리 API (`/api/notifications/{id}/read`)
  - 요청: 알림 ID
  - 응답: `{ success: boolean }`

- [ ] 알림 설정 API (`/api/notifications/settings`)
  - 요청: `{ push_enabled: boolean, email_enabled: boolean, categories: { [key: string]: boolean } }`
  - 응답: `{ success: boolean }`

### 5.2 채팅 API
- [ ] 채팅방 목록 API (`/api/chat/rooms`)
  - 요청: 토큰 기반 인증
  - 응답: `{ rooms: ChatRoom[], total: number }`

- [ ] 채팅 메시지 조회 API (`/api/chat/rooms/{id}/messages`)
  - 요청: `{ room_id: number, limit?: number, before?: string }`
  - 응답: `{ messages: ChatMessage[], has_more: boolean }`

- [ ] 메시지 전송 API (`/api/chat/rooms/{id}/messages`)
  - 요청: `{ content: string, attachments?: string[] }`
  - 응답: `{ message_id: string, timestamp: string }`

## 🏆 6. 이벤트 및 보상 API

### 6.1 이벤트 API
- [ ] 이벤트 목록 조회 API (`/api/events`)
  - 요청: `{ status?: 'active' | 'upcoming' | 'past', limit?: number, offset?: number }`
  - 응답: `{ events: Event[], total: number }`

- [ ] 이벤트 상세 정보 API (`/api/events/{id}`)
  - 요청: 이벤트 ID
  - 응답: `{ id: number, title: string, description: string, start_date: string, end_date: string, rewards: any[], rules: any[] }`

### 6.2 보상 API
- [ ] 미션 목록 조회 API (`/api/missions`)
  - 요청: 토큰 기반 인증
  - 응답: `{ missions: Mission[], completed: number, total: number }`

- [ ] 미션 완료 체크 API (`/api/missions/{id}/complete`)
  - 요청: 미션 ID
  - 응답: `{ success: boolean, reward: number }`

- [ ] 보너스 코드 사용 API (`/api/rewards/code`)
  - 요청: `{ code: string }`
  - 응답: `{ success: boolean, reward: number, message: string }`

## 📊 7. 통계 및 기타 API

### 7.1 사용자 통계 API
- [ ] 사용자 게임 통계 API (`/api/stats/games`)
  - 요청: 토큰 기반 인증
  - 응답: `{ total_played: number, total_won: number, total_lost: number, by_game: { [game_id: string]: { played: number, won: number, lost: number } } }`

- [ ] 사용자 토큰 통계 API (`/api/stats/tokens`)
  - 요청: 토큰 기반 인증
  - 응답: `{ earned: number, spent: number, current: number, history: { date: string, amount: number }[] }`

### 7.2 기타 API
- [ ] 서버 상태 체크 API (`/api/health`)
  - 요청: 없음
  - 응답: `{ status: 'ok', version: string, uptime: number }`

- [ ] 앱 구성 정보 API (`/api/config`)
  - 요청: 토큰 기반 인증
  - 응답: `{ features: { [key: string]: boolean }, limits: { [key: string]: number }, urls: { [key: string]: string } }`

## 🔧 API 연동 체크리스트 순서 (중요도 기준)

1. **최우선 구현**
   - 인증 관련 API (회원가입, 로그인)
   - 사용자 정보 조회 API
   - 토큰 잔액 조회 API

2. **핵심 게임 기능**
   - 게임 목록 조회 API
   - 슬롯/가챠/가위바위보/룰렛 게임 API
   - 토큰 획득/사용 내역 API

3. **기본 사용자 경험**
   - 일일 출석 체크 API
   - 상품 목록 및 구매 API
   - 미션 목록 및 완료 API

4. **확장 기능**
   - 알림 관련 API
   - 이벤트 관련 API
   - 통계 관련 API

5. **부가 기능**
   - 채팅 관련 API
   - 설정 관련 API
   - 서버 상태 체크 API