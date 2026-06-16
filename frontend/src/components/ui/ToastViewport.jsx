import { useToast } from '../../context/ToastContext';

export function ToastViewport() {
  const { toasts } = useToast();

  return (
    <div className="fixed right-4 top-4 z-50 flex w-80 flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-soft ${
            toast.type === 'error' ? 'bg-red-500' : 'bg-brand-600'
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
