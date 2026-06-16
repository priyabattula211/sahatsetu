import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { roleLabels } from '../../lib/constants';

const navByRole = {
  PATIENT: [{ to: '/patient', label: 'Dashboard' }],
  ASHA: [{ to: '/asha', label: 'Dashboard' }],
  DOCTOR: [{ to: '/doctor', label: 'Dashboard' }],
};

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-white/70 bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div>
          <p className="font-display text-2xl font-bold text-brand-700">Sehat Setu</p>
          <p className="text-sm text-slate-600">Rural healthcare coordination platform</p>
        </div>

        <nav className="flex items-center gap-3">
          {user &&
            navByRole[user.role]?.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-semibold ${
                    isActive ? 'bg-brand-100 text-brand-700' : 'text-slate-600'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          {user ? (
            <>
              <div className="rounded-full bg-sand px-4 py-2 text-sm">
                {user.fullName} · {roleLabels[user.role]}
              </div>
              <button className="button-secondary" onClick={logout} type="button">
                Logout
              </button>
            </>
          ) : (
            <NavLink className="button-primary" to="/login">
              Login
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
