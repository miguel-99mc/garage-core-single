'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './providers/auth.provider';
import MuiProvider from './providers/theme.provider';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MuiProvider>{children}</MuiProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
