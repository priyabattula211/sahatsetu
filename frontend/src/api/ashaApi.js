import client from './client';

export async function fetchAshaDashboard() {
  const { data } = await client.get('/asha/dashboard');
  return data;
}

export async function createVisit(payload) {
  const { data } = await client.post('/asha/visits', payload);
  return data;
}

export async function createEscalation(payload) {
  const { data } = await client.post('/asha/escalations', payload);
  return data;
}
