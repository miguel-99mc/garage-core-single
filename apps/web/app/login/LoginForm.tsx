'use client';

import { useForm, Controller } from 'react-hook-form';
import { useLogin } from '@/features/auth/hooks/auth.hooks';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent, TextField, Button, Stack, Box } from '@mui/material';

type LoginFormData = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const router = useRouter();
  const { mutate: login, isPending } = useLogin();

  const { control, handleSubmit } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(data: any) {
    login(data, {
      onSuccess: () => {
        router.push('/admin');
      },
    });
  }

  return (
    <Box className="w-full min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader
          title={`Welcome to ${process.env.NEXT_PUBLIC_APP_DEFAULT_NAME}`}
          sx={{ textAlign: 'center' }}
        />

        <CardContent sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
            <Stack spacing={2} sx={{ width: '100%', justifyContent: 'center' }}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    sx={{ width: '100%' }}
                    id="email"
                    label="Email"
                    variant="filled"
                    onChange={field.onChange}
                  />
                )}
              />

              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    sx={{ width: '100%' }}
                    id="password"
                    label="Password"
                    variant="filled"
                    type="password"
                    onChange={field.onChange}
                  />
                )}
              />
              <Button variant="contained" type="submit" disabled={isPending}>
                Login
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
