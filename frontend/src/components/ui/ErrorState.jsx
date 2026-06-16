export function ErrorState({ message = 'Something went wrong.' }) {
  return (
    <div className="card border-red-200 bg-red-50 text-red-700">
      <h3 className="text-lg font-semibold">Unable to load</h3>
      <p className="mt-2">{message}</p>
    </div>
  );
}
