export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  userId: number;
  name: string;
  email: string;
  token: string;
  expiresAt: string;
}