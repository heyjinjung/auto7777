// CC-WEBAPP Type Definitions
import React from 'react';

export interface User {
  id: string;
  nickname: string;
  email?: string;
  avatar?: string;
  siteId: string;
  tokens: number;
  gems: number;
  level: number;
  vipTier: 'STANDARD' | 'VIP' | 'PREMIUM';
  lastLogin: Date;
  createdAt: Date;
}

export interface GameStats {
  totalGames: number;
  totalWins: number;
  totalLosses: number;
  winRate: number;
  favoriteGame: string;
  lastPlayed: Date;
}

// Component Props
export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  disabled?: boolean;
  error?: string;
  success?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  helperText?: string;
  required?: boolean;
  className?: string;
}

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'bordered' | 'glow';
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
}

export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
  className?: string;
}

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export interface TabBarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
}

export interface TabBarProps {
  items: TabBarItem[];
  activeId: string;
  onTabChange: (id: string) => void;
  className?: string;
}

// Game Types
export interface GameResult {
  gameType: 'slots' | 'gacha' | 'rps' | 'roulette';
  won: boolean;
  tokensWon: number;
  gemsWon: number;
  playedAt: Date;
  details: Record<string, any>;
}

export interface SlotResult {
  symbols: string[];
  paylines: number[];
  multiplier: number;
  won: boolean;
  tokensWon: number;
}

export interface GachaResult {
  itemId: string;
  itemName: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  value: number;
  imageUrl?: string;
}

export interface RPSResult {
  playerChoice: 'rock' | 'paper' | 'scissors';
  computerChoice: 'rock' | 'paper' | 'scissors';
  result: 'win' | 'lose' | 'draw';
  tokensWon: number;
}

export interface RouletteResult {
  number: number;
  color: 'red' | 'black' | 'green';
  won: boolean;
  tokensWon: number;
  bets: Array<{
    type: string;
    amount: number;
    won: boolean;
  }>;
}

// API Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LoginRequest {
  siteId: string;
  password: string;
}

export interface RegisterRequest {
  inviteCode: string;
  siteId: string;
  nickname: string;
  password: string;
  phone: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'select';
  placeholder?: string;
  required?: boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: string) => string | null;
  };
  options?: Array<{ value: string; label: string }>; // for select type
}

export interface FormErrors {
  [fieldName: string]: string;
}

export interface FormState {
  values: Record<string, string>;
  errors: FormErrors;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}

// Navigation Types
export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
  badge?: number;
  disabled?: boolean;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  duration?: number;
  persistent?: boolean;
  createdAt: Date;
}

// Layout Types
export interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  showTabBar?: boolean;
  className?: string;
}

// Theme Types
export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
  };
  fonts: {
    primary: string;
    mono: string;
  };
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
  breakpoints: Record<string, string>;
}

// Utility Types
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ComponentVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type StatusType = 'success' | 'warning' | 'error' | 'info';

// Event Types
export interface GameStartEvent {
  gameType: string;
  userId: string;
  timestamp: Date;
}

export interface GameEndEvent extends GameStartEvent {
  result: GameResult;
  duration: number;
}

// Store Types (for Zustand)
export interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

export interface GameStore {
  currentGame: string | null;
  gameHistory: GameResult[];
  stats: GameStats | null;
  isPlaying: boolean;
  startGame: (gameType: string) => void;
  endGame: (result: GameResult) => void;
  loadStats: () => Promise<void>;
}

export interface UIStore {
  notifications: Notification[];
  modals: Record<string, boolean>;
  loading: Record<string, boolean>;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  removeNotification: (id: string) => void;
  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
  setLoading: (key: string, loading: boolean) => void;
}

// Export utility type for React components
export type FC<P = {}> = React.FunctionComponent<P>;
export type PropsWithChildren<P = {}> = P & { children: React.ReactNode };

// Export commonly used React types
export type {
  CSSProperties,
  MouseEvent,
  KeyboardEvent,
  ChangeEvent,
  FormEvent,
  FocusEvent,
} from 'react';
