"use client";

import React, { useState, useEffect, createContext } from "react";
import type { UserProfile } from "@/app/_types/UserProfile";
import useSWR, { mutate } from "swr";
import type { ApiResponse } from "../_types/ApiResponse";
import { jwtFetcher } from "./jwtFetcher";
import { sessionFetcher } from "./sessionFetcher";
import { AUTH } from "@/config/auth";

interface AuthContextProps {
  userProfile: UserProfile | null;
  logout: () => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined,
);

interface Props {
  children: React.ReactNode;
}

const AuthProvider: React.FC<Props> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const { data: session } = useSWR<ApiResponse<UserProfile | null>>(
      "/api/auth",
      jwtFetcher,
    );

  useEffect(() => {
    if (session && session.success) {
      setUserProfile(session.payload);
      return;
    }
    setUserProfile(null);
  }, [session]);

  const logout = async () => {
  // ■■ トークンベース認証のみ ■■
  localStorage.removeItem("jwt");
    // SWR キャッシュを無効化
    mutate(() => true, undefined, { revalidate: false });
    setUserProfile(null);
    return true;
  };

  return (
    <AuthContext.Provider value={{ userProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
