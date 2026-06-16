import { useState } from 'react';
import { createEscalation, createVisit, fetchAshaDashboard } from '../../api/ashaApi';
import { ErrorState } from '../../components/ui/ErrorState';
import { LoadingState } from '../../components/ui/LoadingState';
import { useToast } from '../../context/ToastContext';
import { useAsync } from '../../hooks/useAsync';
import { formatDateTime } from '../../lib/utils';

export function AshaDashboard() {
  const { data, loading, error, setData } = useAsync(fetchAshaDashboard, []);
  const { showToast } = useToast();
  const [visitForm, setVisitForm] = useState({
    patientId: '',
    visitDate: '',
    notes: '',
    bloodPressure: '',
    heartRate: '',
    temperature: '',
  });
  const [escalationForm, setEscalationForm] = useState({
    patientId: '',
    doctorUserId: '',
    reason: '',
  });

  if (loading) return <LoadingState label="Loading ASHA dashboard..." />;
  if (error) return <ErrorState message="ASHA dashboard could not be loaded." />;

  const patientOptions = data.assignedPatients;

  async function handleVisit(event) {
    event.preventDefault();
    try {
      const created = await createVisit({
        ...visitForm,
        visitDate: new Date(visitForm.visitDate).toISOString(),
        heartRate: Number(visitForm.heartRate),
        temperature: Number(visitForm.temperature),
      });
      setData((current) => ({ ...current, homeVisits: [created, ...current.homeVisits] }));
      setVisitForm({
        patientId: '',
        visitDate: '',
        notes: '',
        bloodPressure: '',
        heartRate: '',
        temperature: '',
      });
      showToast('Home visit logged');
    } catch (requestError) {
      showToast(requestError.response?.data?.message || 'Failed to save visit', 'error');
    }
  }

  async function handleEscalation(event) {
    event.preventDefault();
    try {
      await createEscalation(escalationForm);
      setEscalationForm({ patientId: '', doctorUserId: '', reason: '' });
      showToast('Patient escalated to doctor');
    } catch (requestError) {
      showToast(requestError.response?.data?.message || 'Failed to escalate case', 'error');
    }
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-3">
        <div className="card">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Region</p>
          <p className="mt-3 text-3xl font-bold text-brand-700">{data.region}</p>
        </div>
        <div className="card">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Assigned patients</p>
          <p className="mt-3 text-3xl font-bold text-brand-700">{data.assignedPatients.length}</p>
        </div>
        <div className="card">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Visits logged</p>
          <p className="mt-3 text-3xl font-bold text-brand-700">{data.homeVisits.length}</p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="font-display text-2xl font-semibold text-brand-700">Log home visit</h2>
          <form className="mt-5 space-y-4" onSubmit={handleVisit}>
            <select
              className="input"
              value={visitForm.patientId}
              onChange={(event) => setVisitForm({ ...visitForm, patientId: event.target.value })}
              required
            >
              <option value="">Select patient</option>
              {patientOptions.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.user.fullName}
                </option>
              ))}
            </select>
            <input
              className="input"
              type="datetime-local"
              value={visitForm.visitDate}
              onChange={(event) => setVisitForm({ ...visitForm, visitDate: event.target.value })}
              required
            />
            <input
              className="input"
              placeholder="Blood pressure"
              value={visitForm.bloodPressure}
              onChange={(event) => setVisitForm({ ...visitForm, bloodPressure: event.target.value })}
              required
            />
            <div className="grid gap-4 md:grid-cols-2">
              <input
                className="input"
                placeholder="Heart rate"
                value={visitForm.heartRate}
                onChange={(event) => setVisitForm({ ...visitForm, heartRate: event.target.value })}
                required
              />
              <input
                className="input"
                placeholder="Temperature"
                value={visitForm.temperature}
                onChange={(event) => setVisitForm({ ...visitForm, temperature: event.target.value })}
                required
              />
            </div>
            <textarea
              className="input min-h-28"
              placeholder="Visit notes"
              value={visitForm.notes}
              onChange={(event) => setVisitForm({ ...visitForm, notes: event.target.value })}
              required
            />
            <button className="button-primary" type="submit">
              Save visit
            </button>
          </form>
        </div>

        <div className="card">
          <h2 className="font-display text-2xl font-semibold text-brand-700">Escalate patient</h2>
          <form className="mt-5 space-y-4" onSubmit={handleEscalation}>
            <select
              className="input"
              value={escalationForm.patientId}
              onChange={(event) => setEscalationForm({ ...escalationForm, patientId: event.target.value })}
              required
            >
              <option value="">Select patient</option>
              {patientOptions.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.user.fullName}
                </option>
              ))}
            </select>
            <select
              className="input"
              value={escalationForm.doctorUserId}
              onChange={(event) => setEscalationForm({ ...escalationForm, doctorUserId: event.target.value })}
              required
            >
              <option value="">Assign doctor</option>
              {data.doctors.map((doctor) => (
                <option key={doctor.userId} value={doctor.userId}>
                  {doctor.user.fullName} · {doctor.specialization}
                </option>
              ))}
            </select>
            <textarea
              className="input min-h-28"
              placeholder="Reason for escalation"
              value={escalationForm.reason}
              onChange={(event) => setEscalationForm({ ...escalationForm, reason: event.target.value })}
              required
            />
            <button className="button-primary" type="submit">
              Escalate case
            </button>
          </form>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="card">
          <h2 className="font-display text-2xl font-semibold text-brand-700">Assigned patients</h2>
          <div className="mt-5 space-y-4">
            {data.assignedPatients.map((patient) => (
              <div key={patient.id} className="rounded-2xl border border-brand-100 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-brand-700">{patient.user.fullName}</p>
                  <span className="rounded-full bg-sand px-3 py-1 text-xs font-semibold text-slate-600">
                    {patient.village}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  {patient.age} years · {patient.gender}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Open escalations: {patient.escalations.length}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="font-display text-2xl font-semibold text-brand-700">Recent visits</h2>
          <div className="mt-5 space-y-4">
            {data.homeVisits.map((visit) => (
              <div key={visit.id} className="rounded-2xl border border-brand-100 p-4">
                <p className="font-semibold text-brand-700">{visit.patient.user.fullName}</p>
                <p className="text-sm text-slate-600">{formatDateTime(visit.visitDate)}</p>
                <p className="mt-2 text-sm text-slate-600">
                  BP {visit.bloodPressure} · HR {visit.heartRate} · Temp {visit.temperature}
                </p>
                <p className="mt-2 text-sm text-slate-600">{visit.notes}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
