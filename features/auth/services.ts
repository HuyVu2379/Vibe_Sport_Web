import { apiClient, API_ENDPOINTS } from "@/lib/api";
import type { AuthResponse, LoginInput, RegisterInput } from "./types";

export const authService = {
  async login(input: LoginInput): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, input);
  },

  async register(input: RegisterInput): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, input);
  },

  async logout(): Promise<void> {
    return apiClient.post<void>(API_ENDPOINTS.USERS.LOGOUT);
  },
};
