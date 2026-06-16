import { Navbar } from './Navbar';
import { ToastViewport } from '../ui/ToastViewport';

export function AppShell({ children }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <ToastViewport />
      <main className="mx-auto max-w-7xl px-6 py-10">{children}</main>
    </div>
  );
}
