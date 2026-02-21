"use client";

import { useConvexAuth } from "convex/react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { useLocale } from "next-intl";

interface User {
  _id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  steamId?: string;
  faceitId?: string;
  faceitNickname?: string;
  faceitElo?: number;
  faceitLevel?: number;
  isPrime?: boolean;
  isp?: string;
  city?: string;
  isPremium: boolean;
  audioEnabled?: boolean;
  theme?: string;
  uzsBalance?: number;
  rank?: string;
  loginStreak?: number;
  skillPoints?: {
    aim: number;
    spray: number;
    movement: number;
    utility: number;
    gameSense: number;
  };
}

export function useAuth() {
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
  const userData = useQuery(api.users.current);
  const { signOut } = useAuthActions();
  const updateMutation = useMutation(api.users.update);

  const login = () => {
    // Managed by components directly calling signIn from @convex-dev/auth/react
  };

  const locale = useLocale();

  const logout = async () => {
    await signOut();
    window.location.href = `/${locale}`;
  };

  const updateUser = async (updates: Partial<User>) => {
    if (userData?._id) {
      await updateMutation({ ...updates });
    }
  };

  return {
    user: (userData as unknown as User) || null,
    isLoading: isAuthLoading || (isAuthenticated && userData === undefined),
    login,
    logout,
    updateUser,
  };
}
