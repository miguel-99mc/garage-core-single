'use client';

import { CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '../providers/auth.provider';
import LoginForm from './LoginForm';

export default function LoginPage() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <CircularProgress aria-label="Loading…" />;
  }

  return <LoginForm />;
}
