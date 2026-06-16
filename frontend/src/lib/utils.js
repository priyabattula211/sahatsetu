export function formatDateTime(value) {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function getDashboardPath(role) {
  if (role === 'PATIENT') return '/patient';
  if (role === 'ASHA') return '/asha';
  if (role === 'DOCTOR') return '/doctor';
  return '/login';
}
