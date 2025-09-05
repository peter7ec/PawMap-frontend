import { jwtDecode } from "jwt-decode";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router";

import authService from "../services/authService";
import type {
  AuthContextProviderProps,
  AuthContextType,
  AuthTokenData,
  AuthSuccess,
  AuthUser,
} from "@/types/authTypes";

const AuthContext = createContext<AuthContextType | null>(null);
export const token = localStorage.getItem("token");

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | undefined>();

  const register = useCallback(
    async (
      email: string,
      name: string,
      password: string,
      profile_avatar: string
    ): Promise<AuthSuccess> => {
      const registerResponse = await authService.register(
        email,
        name,
        password,
        profile_avatar
      );

      if (!registerResponse.ok) {
        return {
          ok: false,
          message: registerResponse.message || "Failed Registration",
        };
      }

      return { ok: true, message: "Registered successfully" };
    },
    []
  );

  const login = useCallback(
    async (email: string, password: string): Promise<AuthSuccess> => {
      const loginResponse = await authService.login(email, password);

      if (!loginResponse.ok || !loginResponse.data?.token) {
        return { ok: false, message: loginResponse.message };
      }

      const decodedToken = jwtDecode<AuthTokenData>(loginResponse.data.token);

      const lsAuth = { token: loginResponse.data.token, ...decodedToken };

      localStorage.setItem("user", JSON.stringify(lsAuth));

      setUser(lsAuth);

      return { ok: true, message: "Successfully logged in!" };
    },
    []
  );
  const update = useCallback(
    async (
      userId: string,
      userToken: string,
      newName: string | undefined,
      newEmail: string | undefined,
      newPassword: string | undefined,
      newProfile_avatar: string | undefined
    ): Promise<AuthSuccess> => {
      const updateResponse = await authService.update(
        userId,
        userToken,
        newName,
        newEmail,
        newPassword,
        newProfile_avatar
      );

      if (!updateResponse.ok || !updateResponse.data?.token) {
        return { ok: false, message: updateResponse.message };
      }

      const decodedToken = jwtDecode<AuthTokenData>(updateResponse.data.token);

      const lsAuth = { token: updateResponse.data.token, ...decodedToken };

      localStorage.setItem("user", JSON.stringify(lsAuth));

      setUser(lsAuth);

      return { ok: true, message: "Successfully updated!" };
    },
    []
  );

  const logOut = useCallback(() => {
    localStorage.removeItem("user");
    setUser(undefined);
    navigate("/login");
  }, [navigate]);

  useEffect(() => {
    const lsUserString = localStorage.getItem("user");

    if (lsUserString) {
      if (!lsUserString) {
        return;
      }

      try {
        const lsUser = JSON.parse(lsUserString) as AuthUser;

        if (!lsUser.token || !lsUser.id || !lsUser.email) {
          localStorage.removeItem("user");
          return;
        }

        setUser(lsUser);
      } catch (error) {
        localStorage.removeItem("user");
      }
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      login,
      register,
      logOut,
      update,
      user,
    }),
    [login, register, update, logOut, user]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export default AuthContext;
