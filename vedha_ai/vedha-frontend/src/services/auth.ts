import { api } from "./api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await api.post("/auth/login", data);

  return response.data;
}

export async function register(data: RegisterRequest) {
  const response = await api.post("/auth/register", data);

  return response.data;
}

export async function getCurrentUser(): Promise<User> {
  const response = await api.get("/auth/me");

  return response.data;
}

export function logout() {
  localStorage.removeItem("access_token");
}