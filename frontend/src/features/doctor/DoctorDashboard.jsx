import { useState } from 'react';
import {
  createPrescription,
  fetchDoctorDashboard,
  resolveEscalation,
} from '../../api/doctorApi';
import { ErrorState } from '../../components/ui/ErrorState';
import { LoadingState } from '../../components/ui/LoadingState';
import { useToast } from '../../context/ToastContext';
import { useAsync } from '../../hooks/useAsync';
import { formatDateTime } from '../../lib/utils';

export function DoctorDashboard() {
  const { data, loading, error, setData } = useAsync(fetchDoctorDashboard, []);
  const { showToast } = useToast();
  const [prescriptionForm, setPrescriptionForm] = useState({
    patientId: '',
    medication: '',
    dosage: '',
    notes: '',
  });
  const [resolveForm, setResolveForm] = useState({});

  if (loading) return <LoadingState label="Loading doctor dashboard..." />;
  if (error) return <ErrorState message="Doctor dashboard could not be loaded." />;

  async function handlePrescription(event) {
    event.preventDefault();
    try {
      await createPrescription(prescriptionForm);
      setPrescriptionForm({ patientId: '', medication: '', dosage: '', notes: '' });
      showToast('Prescription added');
    } catch (requestError) {
      showToast(requestError.response?.data?.message || 'Failed to add prescription', 'error');
    }
  }

  async function handleResolve(escalationId) {
    try {
      await resolveEscalation(escalationId, { resolvedNotes: resolveForm[escalationId] || 'Resolved' });
      setData((current) => ({
        ...current,
        escalations: current.escalations.map((item) =>
          item.id === escalationId ? { ...item, status: 'RESOLVED' } : item,
        ),
      }));
      showToast('Escalation resolved');
    } catch (requestError) {
      showToast(requestError.response?.data?.message || 'Failed to resolve escalation', 'error');
    }
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-3">
        <div className="card">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Open escalations</p>
          <p className="mt-3 text-3xl font-bold text-brand-700">
            {data.escalations.filter((item) => item.status === 'OPEN').length}
          </p>
        </div>
        <div className="card">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Appointments</p>
          <p className="mt-3 text-3xl font-bold text-brand-700">{data.appointments.length}</p>
        </div>
        <div className="card">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Specialization</p>
          <p className="mt-3 text-3xl font-bold text-brand-700">{data.specialization}</p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="card">
          <h2 className="font-display text-2xl font-semibold text-brand-700">Escalation queue</h2>
          <div className="mt-5 space-y-4">
            {data.escalations.map((item) => (
              <div key={item.id} className="rounded-2xl border border-brand-100 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-brand-700">{item.patient.user.fullName}</p>
                    <p className="text-sm text-slate-600">
                      Escalated by {item.ashaWorker.user.fullName} · {formatDateTime(item.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      item.status === 'OPEN'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-brand-100 text-brand-700'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-700">{item.reason}</p>
                <div className="mt-3 rounded-2xl bg-sand p-4 text-sm text-slate-600">
                  <p>Records: {item.patient.healthRecords.length}</p>
                  <p>Visits: {item.patient.homeVisits.length}</p>
                  <p>Symptom checks: {item.patient.symptomChecks.length}</p>
                </div>
                {item.status === 'OPEN' && (
                  <div className="mt-4 flex gap-3">
                    <input
                      className="input"
                      placeholder="Resolution notes"
                      value={resolveForm[item.id] || ''}
                      onChange={(event) =>
                        setResolveForm({ ...resolveForm, [item.id]: event.target.value })
                      }
                    />
                    <button className="button-primary" onClick={() => handleResolve(item.id)} type="button">
                      Resolve
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h2 className="font-display text-2xl font-semibold text-brand-700">Write prescription</h2>
            <form className="mt-5 space-y-4" onSubmit={handlePrescription}>
              <select
                className="input"
                value={prescriptionForm.patientId}
                onChange={(event) =>
                  setPrescriptionForm({ ...prescriptionForm, patientId: event.target.value })
                }
                required
              >
                <option value="">Select patient</option>
                {data.escalations.map((item) => (
                  <option key={item.patient.id} value={item.patient.id}>
                    {item.patient.user.fullName}
                  </option>
                ))}
              </select>
              <input
                className="input"
                placeholder="Medication"
                value={prescriptionForm.medication}
                onChange={(event) =>
                  setPrescriptionForm({ ...prescriptionForm, medication: event.target.value })
                }
                required
              />
              <input
                className="input"
                placeholder="Dosage"
                value={prescriptionForm.dosage}
                onChange={(event) =>
                  setPrescriptionForm({ ...prescriptionForm, dosage: event.target.value })
                }
                required
              />
              <textarea
                className="input min-h-28"
                placeholder="Clinical notes"
                value={prescriptionForm.notes}
                onChange={(event) => setPrescriptionForm({ ...prescriptionForm, notes: event.target.value })}
              />
              <button className="button-primary" type="submit">
                Save prescription
              </button>
            </form>
          </div>

          <div className="card">
            <h2 className="font-display text-2xl font-semibold text-brand-700">Upcoming appointments</h2>
            <div className="mt-5 space-y-4">
              {data.appointments.map((appointment) => (
                <div key={appointment.id} className="rounded-2xl border border-brand-100 p-4">
                  <p className="font-semibold text-brand-700">{appointment.patient.user.fullName}</p>
                  <p className="text-sm text-slate-600">{formatDateTime(appointment.scheduledAt)}</p>
                  <p className="mt-2 text-sm text-slate-600">{appointment.notes || 'No notes'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
