import client from './client';

export async function signup(payload) {
  const { data } = await client.post('/auth/signup', payload);
  return data;
}

export async function login(payload) {
  const { data } = await client.post('/auth/login', payload);
  return data;
}

export async function fetchMe() {
  const { data } = await client.get('/auth/me');
  return data.user;
}
