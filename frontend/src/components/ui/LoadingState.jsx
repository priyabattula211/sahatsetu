export function LoadingState({ label = 'Loading...' }) {
  return (
    <div className="card flex items-center justify-center py-16 text-brand-700">
      <div className="animate-pulse text-lg font-semibold">{label}</div>
    </div>
  );
}
