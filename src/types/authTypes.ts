import type { ReactNode } from "react";

export type JwtToken = string;
export type AuthUser = {
  id: string;
  email: string;
  token: string;
  name: string;
  profile_avatar: string;
};
export type AuthContextProviderProps = {
  children: ReactNode;
};

export type AuthSuccess = {
  ok: boolean;
  message: string;
};

export type AuthTokenData = {
  id: string;
  email: string;
  name: string;
  profile_avatar: string;
};
export type LoginResponse = {
  token?: JwtToken;
};

export type AuthContextType = {
  user: AuthUser | undefined;
  login: (email: string, password: string) => Promise<AuthSuccess>;
  register: (
    email: string,
    name: string,
    password: string,
    profile_avatar: string
  ) => Promise<AuthSuccess>;
  update: (
    userId: string,
    userToken: string,
    newName: string | undefined,
    newEmail: string | undefined,
    newPassword: string | undefined,
    newProfile_avatar: string | undefined
  ) => Promise<AuthSuccess>;
  logOut: () => void;
};
export type RegisterResponse = {
  id: string;
  email: string;
  name: string;
  profile_avatar: string;
};
