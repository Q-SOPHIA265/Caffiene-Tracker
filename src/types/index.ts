export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  profileImage: string;
  age?: number;
  bodyWeight: number;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CaffeineConsumption {
  id: string;
  userId: string;
  amount: number;
  type: 'coffee' | 'caffeine' | 'tea' | 'energy-drink';
  label: string;
  concentration?: number;
  consumedAt: Date;
  createdAt: Date;
}

export interface EmailVerificationToken {
  token: string;
  email: string;
  expiresAt: Date;
  verified: boolean;
}

export interface AuthSession {
  userId: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
