import axios from 'axios';
import type { 
  User, 
  AdultContentGalleryItem, 
  GameResponse, 
  ContentUnlockResponse, 
  FlashOfferResponseItem,
  LoginRequest,
  RegisterRequest,
  ContentUnlockRequest,
  GamePlayRequest,
  SlotSpinResponse
} from '../types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth
apiClient.interceptors.request.use((config) => {
  const token = localStorage?.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage?.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data: LoginRequest) => 
    apiClient.post<{ access_token: string; user: User }>('/auth/login', data),
  
  register: (data: RegisterRequest) => 
    apiClient.post<{ access_token: string; user: User }>('/auth/register', data),
  
  getCurrentUser: () => 
    apiClient.get<User>('/auth/me'),
};

export const gameAPI = {
  getGames: () => 
    apiClient.get<GameResponse[]>('/games/'),
  
  playGame: (data: GamePlayRequest) => 
    apiClient.post('/games/play', data),
    
  // 슬롯 머신 스핀 API
  spinSlot: (betAmount: number = 2) => 
    apiClient.post<SlotSpinResponse>('/games/slot/spin', { bet_amount: betAmount }),
  
  // 잔액 동기화 API (프론트엔드 → 백엔드)
  syncBalance: (balance: number) => 
    apiClient.post('/user/sync-balance', { balance }),
    
  // 슬롯 머신 임의 스핀 API (프론트엔드 로직 사용)
  mockSpinSlot: (betAmount: number, reels: string[], result: any) => {
    // 프론트엔드 로직 기반 응답 생성
    // 백엔드와 동일한 인터페이스를 유지하지만 실제로는 프론트엔드 로직 사용
    const response: SlotSpinResponse = {
      result: result.isWin ? (result.type === 'jackpot' ? 'jackpot' : 'win') : 'lose',
      tokens_change: result.isWin ? result.payout - betAmount : -betAmount,
      balance: 0, // 클라이언트에서 업데이트
      streak: result.isWin ? 0 : 1, // 임시값, 클라이언트에서 관리
      animation: result.isWin ? 
        (result.type === 'jackpot' ? 'jackpot' : 'win') : 
        (Math.random() < 0.8 ? 'near_miss' : 'lose')
    };
    
    return Promise.resolve({ data: response });
  }
};

export const adultContentAPI = {
  getGallery: () => 
    apiClient.get<{ items: AdultContentGalleryItem[] }>('/adult-content/gallery'),
  
  unlockContent: (data: ContentUnlockRequest) => 
    apiClient.post<ContentUnlockResponse>('/adult-content/unlock', data),
  
  getFlashOffers: () => 
    apiClient.get<{ offers: FlashOfferResponseItem[] }>('/adult-content/flash-offers'),
};

// 🆕 새로운 게임 API들
export const gachaAPI = {
  getRates: () => apiClient.get('/api/gacha/rates'),
  spin: (data: { bet_amount?: number }) => apiClient.post('/api/gacha/spin', data),
  getHistory: (limit: number = 20) => apiClient.get(`/api/gacha/history?limit=${limit}`)
};

export const shopAPI = {
  getItems: (category?: string) => apiClient.get(`/api/shop/items${category ? `?category=${category}` : ''}`),
  getCategories: () => apiClient.get('/api/shop/categories'),
  purchase: (data: { item_id: number; quantity: number }) => apiClient.post('/api/shop/buy', data),
  getHistory: (limit: number = 20) => apiClient.get(`/api/shop/history?limit=${limit}`)
};

export const battlepassAPI = {
  getStatus: () => apiClient.get('/api/battlepass/status'),
  claimReward: (level: number) => apiClient.post(`/api/battlepass/claim/${level}`),
  upgradeToPremium: () => apiClient.post('/api/battlepass/upgrade')
};

export const leaderboardAPI = {
  getLeaderboard: (type: string = 'weekly', limit: number = 100) => 
    apiClient.get(`/api/leaderboard/${type}?limit=${limit}`),
  getUserRank: (userId: number) => apiClient.get(`/api/leaderboard/user/${userId}`),
  getCurrentSeason: () => apiClient.get('/api/leaderboard/seasons/current')
};

export default apiClient;
