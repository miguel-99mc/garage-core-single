'use client';

import { CircularProgress } from '@mui/material';
import { useAuth } from '../providers/auth.provider';

export default function AdminPage() {
  const { user, isLoading } = useAuth();

  if (isLoading && !user) {
    return <CircularProgress />;
  }

  if (user) {
    return (
      <div>
        Welcome, {user.firstName} {user.lastName}!
      </div>
    );
  }

  return <div>Welcome!</div>;
}
