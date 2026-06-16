import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { HeroHome } from '../features/shared/HeroHome';
import { AuthPage } from '../features/auth/AuthPage';
import { PatientDashboard } from '../features/patient/PatientDashboard';
import { AshaDashboard } from '../features/asha/AshaDashboard';
import { DoctorDashboard } from '../features/doctor/DoctorDashboard';
import { ProtectedRoute } from '../routes/ProtectedRoute';
import { useAuth } from '../context/AuthContext';
import { getDashboardPath } from '../lib/utils';

export function App() {
  const { user } = useAuth();

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={user ? <Navigate replace to={getDashboardPath(user.role)} /> : <HeroHome />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} />

        <Route element={<ProtectedRoute allowedRoles={['PATIENT']} />}>
          <Route path="/patient" element={<PatientDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['ASHA']} />}>
          <Route path="/asha" element={<AshaDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['DOCTOR']} />}>
          <Route path="/doctor" element={<DoctorDashboard />} />
        </Route>
      </Routes>
    </AppShell>
  );
}
