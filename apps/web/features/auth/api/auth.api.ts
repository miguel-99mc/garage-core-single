import { api } from '@/lib/api';

type LoginPayload = {
  email: string;
  password: string;
};

export async function login(data: LoginPayload) {
  const { data: response } = await api.post('/auth/login', data);
  return response;
}

export async function getMe() {
  const { data } = await api.get('/users/me');
  return data;
}
