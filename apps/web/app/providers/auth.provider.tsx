'use client';

import { createContext, useContext, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useLogin as useLoginMutation, useMe } from '@/features/auth/hooks/auth.hooks';

type LoginDTO = {
  email: string;
  password: string;
};

type AuthContextType = {
  user: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginDTO) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const { data: user, isPending, isFetching } = useMe();

  const { mutateAsync: loginMutation } = useLoginMutation();

  async function login(data: LoginDTO) {
    await loginMutation(data);

    await queryClient.invalidateQueries({ queryKey: ['me'] });
  }

  const value = useMemo(() => {
    return {
      user: user ?? null,
      isLoading: isPending,
      isAuthenticated: !!user,
      login,
    };
  }, [user, isPending, isFetching]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return ctx;
}
