import client from './client';

export async function fetchPatientDashboard() {
  const { data } = await client.get('/patient/dashboard');
  return data;
}

export async function fetchDoctors() {
  const { data } = await client.get('/patient/doctors');
  return data;
}

export async function createAppointment(payload) {
  const { data } = await client.post('/patient/appointments', payload);
  return data;
}

export async function createSymptomCheck(payload) {
  const { data } = await client.post('/patient/symptom-checker', payload);
  return data;
}
