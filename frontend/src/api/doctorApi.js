import client from './client';

export async function fetchDoctorDashboard() {
  const { data } = await client.get('/doctor/dashboard');
  return data;
}

export async function createPrescription(payload) {
  const { data } = await client.post('/doctor/prescriptions', payload);
  return data;
}

export async function resolveEscalation(id, payload) {
  const { data } = await client.patch(`/doctor/escalations/${id}/resolve`, payload);
  return data;
}
