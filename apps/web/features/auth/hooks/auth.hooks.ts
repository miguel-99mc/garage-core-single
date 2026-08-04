'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMe, login } from '../api/auth.api';

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },

    onError: (error: any) => {
      console.error('Login error:', error);
    },
  });
}

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: getMe,
  });
}
