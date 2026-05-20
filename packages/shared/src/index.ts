export type UserRole = 'USER' | 'ADMIN';
export interface RateLimitState { methodRemaining?: number; dailyRemaining?: number; globalRemaining?: number; }
