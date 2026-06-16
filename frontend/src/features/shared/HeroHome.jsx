import { Link } from 'react-router-dom';

export function HeroHome() {
  return (
    <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="card bg-transparent p-0 shadow-none">
        <div className="rounded-[2rem] bg-[linear-gradient(135deg,_rgba(47,125,79,0.96),_rgba(20,56,36,0.96))] p-10 text-white shadow-soft">
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
            Rural healthcare access platform
          </span>
          <h1 className="mt-6 max-w-2xl font-display text-5xl font-bold leading-tight">
            Bridge the last mile between village households and clinical care.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/85">
            Patients track appointments and symptoms, ASHA workers monitor home visits, and
            doctors resolve escalated cases with shared context.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link className="button-primary bg-white text-brand-700 hover:bg-sand" to="/signup">
              Start with role-based signup
            </Link>
            <Link className="button-secondary border-white/30 bg-white/10 text-white" to="/login">
              Use seeded demo accounts
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {[
          ['Patient', 'Book appointments, see records, submit symptom checks, and know your assigned ASHA worker.'],
          ['ASHA Worker', 'Track home visits, capture vitals, and escalate concerning cases with evidence.'],
          ['Doctor', 'Review the escalation queue, inspect history, prescribe treatment, and close loops.'],
        ].map(([title, description]) => (
          <div key={title} className="card">
            <h3 className="font-display text-2xl font-semibold text-brand-700">{title}</h3>
            <p className="mt-2 text-slate-600">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
