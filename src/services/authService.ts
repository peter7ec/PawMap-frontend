import type { LoginResponse, RegisterResponse } from "@/types/authTypes";
import type { ApiResponse } from "../types/global";
import { API_URL } from "../constants/environment";

const authService = {
  async register(
    email: string,
    name: string,
    password: string,
    profile_avatar: string
  ): Promise<ApiResponse<RegisterResponse>> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, name, password, profile_avatar }),
    });
    return response.json();
  },

  async update(
    userId: string,
    userToken: string,
    newName: string | undefined,
    newEmail: string | undefined,
    newPassword: string | undefined,
    newProfile_avatar: string | undefined
  ): Promise<ApiResponse<LoginResponse>> {
    const response = await fetch(`${API_URL}/auth/update/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        newName,
        newEmail,
        newPassword,
        newProfile_avatar,
      }),
    });
    return response.json();
  },

  async login(
    email: string,
    password: string
  ): Promise<ApiResponse<LoginResponse>> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },
};

export default authService;
