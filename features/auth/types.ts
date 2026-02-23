import type { UserRole } from "@/lib/constants";

export interface User {
  userId: string;
  role: UserRole;
  fullName?: string;
  phone?: string;
  email?: string;
  avatarUrl?: string;
}

export interface LoginInput {
  phoneOrEmail: string;
  otpOrPassword: string;
}

export interface RegisterInput {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
