import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { roles } from '../../lib/constants';
import { getDashboardPath } from '../../lib/utils';

const roleFields = {
  PATIENT: [
    { name: 'age', label: 'Age', type: 'number' },
    { name: 'gender', label: 'Gender' },
    { name: 'village', label: 'Village' },
  ],
  ASHA: [{ name: 'region', label: 'Region' }],
  DOCTOR: [{ name: 'specialization', label: 'Specialization' }],
};

const initialForm = {
  fullName: '',
  email: '',
  password: '',
  role: roles.PATIENT,
  age: '',
  gender: '',
  village: '',
  region: '',
  specialization: '',
};

export function AuthPage({ mode = 'login' }) {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    try {
      const payload =
        mode === 'login'
          ? { email: form.email, password: form.password }
          : {
              ...form,
              age: form.age ? Number(form.age) : undefined,
            };

      const user = mode === 'login' ? await login(payload) : await signup(payload);
      showToast(mode === 'login' ? 'Logged in successfully' : 'Account created successfully');
      navigate(getDashboardPath(user.role), { replace: true });
    } catch (error) {
      showToast(error.response?.data?.message || 'Request failed', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.9fr]">
      <section className="card overflow-hidden bg-brand-700 p-0 text-white">
        <div className="flex h-full flex-col justify-between bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.15),_transparent_30%),linear-gradient(135deg,_rgba(255,255,255,0.06),_transparent)] p-8">
          <div>
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
              Thoughtworks Portfolio Project
            </span>
            <h1 className="mt-6 font-display text-4xl font-bold leading-tight">
              Coordinated care for patients, ASHA workers, and doctors.
            </h1>
            <p className="mt-4 max-w-xl text-lg text-white/85">
              Sehat Setu reduces rural care gaps by tracking symptoms, home visits, escalations,
              and follow-up care in one workflow.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-2xl font-bold">3</p>
              <p className="text-sm text-white/80">Role-specific dashboards</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-2xl font-bold">1</p>
              <p className="text-sm text-white/80">Escalation workflow</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-2xl font-bold">24/7</p>
              <p className="text-sm text-white/80">Portfolio-ready demo data</p>
            </div>
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="font-display text-3xl font-semibold text-brand-700">
          {mode === 'login' ? 'Login to continue' : 'Create your account'}
        </h2>
        <p className="mt-2 text-slate-600">
          Demo credentials after seeding: `patient@sehatsetu.in`, `asha@sehatsetu.in`,
          `doctor@sehatsetu.in` with password `Password123!`.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div>
              <label className="mb-2 block text-sm font-semibold">Full name</label>
              <input
                className="input"
                value={form.fullName}
                onChange={(event) => setForm({ ...form, fullName: event.target.value })}
                required
              />
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-semibold">Email</label>
            <input
              className="input"
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">Password</label>
            <input
              className="input"
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required
            />
          </div>

          {mode === 'signup' && (
            <>
              <div>
                <label className="mb-2 block text-sm font-semibold">Role</label>
                <select
                  className="input"
                  value={form.role}
                  onChange={(event) => setForm({ ...form, role: event.target.value })}
                >
                  <option value={roles.PATIENT}>Patient</option>
                  <option value={roles.ASHA}>ASHA Worker</option>
                  <option value={roles.DOCTOR}>Doctor</option>
                </select>
              </div>

              {roleFields[form.role].map((field) => (
                <div key={field.name}>
                  <label className="mb-2 block text-sm font-semibold">{field.label}</label>
                  <input
                    className="input"
                    type={field.type || 'text'}
                    value={form[field.name]}
                    onChange={(event) => setForm({ ...form, [field.name]: event.target.value })}
                    required
                  />
                </div>
              ))}
            </>
          )}

          <button className="button-primary w-full" disabled={loading} type="submit">
            {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}
          </button>
        </form>
      </section>
    </div>
  );
}
