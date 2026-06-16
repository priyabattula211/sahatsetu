import { useState } from 'react';
import {
  createAppointment,
  createSymptomCheck,
  fetchDoctors,
  fetchPatientDashboard,
} from '../../api/patientApi';
import { ErrorState } from '../../components/ui/ErrorState';
import { LoadingState } from '../../components/ui/LoadingState';
import { useToast } from '../../context/ToastContext';
import { useAsync } from '../../hooks/useAsync';
import { formatDateTime } from '../../lib/utils';

function SummaryCard({ label, value, helper }) {
  return (
    <div className="card">
      <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-bold text-brand-700">{value}</p>
      <p className="mt-2 text-sm text-slate-600">{helper}</p>
    </div>
  );
}

export function PatientDashboard() {
  const { data, loading, error, setData } = useAsync(fetchPatientDashboard, []);
  const { data: doctors } = useAsync(fetchDoctors, []);
  const { showToast } = useToast();
  const [appointmentForm, setAppointmentForm] = useState({
    doctorId: '',
    scheduledAt: '',
    notes: '',
  });
  const [symptomForm, setSymptomForm] = useState({
    symptoms: '',
    severity: '',
    duration: '',
  });

  if (loading) return <LoadingState label="Loading patient dashboard..." />;
  if (error) return <ErrorState message="Patient dashboard could not be loaded." />;

  async function handleAppointmentSubmit(event) {
    event.preventDefault();
    try {
      const created = await createAppointment({
        ...appointmentForm,
        scheduledAt: new Date(appointmentForm.scheduledAt).toISOString(),
      });
      setData((current) => ({ ...current, appointments: [...current.appointments, created] }));
      setAppointmentForm({ doctorId: '', scheduledAt: '', notes: '' });
      showToast('Appointment booked');
    } catch (requestError) {
      showToast(requestError.response?.data?.message || 'Failed to book appointment', 'error');
    }
  }

  async function handleSymptomSubmit(event) {
    event.preventDefault();
    try {
      const created = await createSymptomCheck(symptomForm);
      setData((current) => ({ ...current, symptomChecks: [created, ...current.symptomChecks] }));
      setSymptomForm({ symptoms: '', severity: '', duration: '' });
      showToast('Symptom check submitted');
    } catch (requestError) {
      showToast(requestError.response?.data?.message || 'Failed to submit symptoms', 'error');
    }
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          label="Upcoming appointments"
          value={data.appointments.length}
          helper="Track consultations and follow-up dates."
        />
        <SummaryCard
          label="Health records"
          value={data.healthRecords.length}
          helper="Review prior diagnoses and advice."
        />
        <SummaryCard
          label="Assigned ASHA"
          value={data.ashaWorker?.user.fullName || 'Pending'}
          helper={data.ashaWorker?.region || 'Awaiting assignment'}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="font-display text-2xl font-semibold text-brand-700">Book appointment</h2>
          <form className="mt-5 space-y-4" onSubmit={handleAppointmentSubmit}>
            <select
              className="input"
              value={appointmentForm.doctorId}
              onChange={(event) => setAppointmentForm({ ...appointmentForm, doctorId: event.target.value })}
              required
            >
              <option value="">Select doctor</option>
              {doctors?.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.user.fullName} · {doctor.specialization}
                </option>
              ))}
            </select>
            <input
              className="input"
              type="datetime-local"
              value={appointmentForm.scheduledAt}
              onChange={(event) =>
                setAppointmentForm({ ...appointmentForm, scheduledAt: event.target.value })
              }
              required
            />
            <textarea
              className="input min-h-28"
              placeholder="Why do you need this consultation?"
              value={appointmentForm.notes}
              onChange={(event) => setAppointmentForm({ ...appointmentForm, notes: event.target.value })}
            />
            <button className="button-primary" type="submit">
              Book consultation
            </button>
          </form>
        </div>

        <div className="card">
          <h2 className="font-display text-2xl font-semibold text-brand-700">Symptom checker</h2>
          <form className="mt-5 space-y-4" onSubmit={handleSymptomSubmit}>
            <textarea
              className="input min-h-28"
              placeholder="Describe symptoms"
              value={symptomForm.symptoms}
              onChange={(event) => setSymptomForm({ ...symptomForm, symptoms: event.target.value })}
              required
            />
            <input
              className="input"
              placeholder="Severity"
              value={symptomForm.severity}
              onChange={(event) => setSymptomForm({ ...symptomForm, severity: event.target.value })}
              required
            />
            <input
              className="input"
              placeholder="Duration"
              value={symptomForm.duration}
              onChange={(event) => setSymptomForm({ ...symptomForm, duration: event.target.value })}
              required
            />
            <button className="button-primary" type="submit">
              Submit symptom check
            </button>
          </form>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="font-display text-2xl font-semibold text-brand-700">Appointments</h2>
          <div className="mt-5 space-y-4">
            {data.appointments.map((appointment) => (
              <div key={appointment.id} className="rounded-2xl border border-brand-100 p-4">
                <p className="font-semibold text-brand-700">{appointment.doctor.user.fullName}</p>
                <p className="text-sm text-slate-600">{formatDateTime(appointment.scheduledAt)}</p>
                <p className="mt-2 text-sm text-slate-600">{appointment.notes || 'No notes added.'}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="font-display text-2xl font-semibold text-brand-700">Records and prescriptions</h2>
          <div className="mt-5 space-y-4">
            {data.healthRecords.map((record) => (
              <div key={record.id} className="rounded-2xl border border-brand-100 p-4">
                <p className="font-semibold text-brand-700">{record.title}</p>
                <p className="mt-2 text-sm text-slate-600">{record.description}</p>
              </div>
            ))}
            {data.prescriptions.map((item) => (
              <div key={item.id} className="rounded-2xl border border-brand-100 p-4">
                <p className="font-semibold text-brand-700">{item.medication}</p>
                <p className="text-sm text-slate-600">{item.dosage}</p>
                <p className="mt-2 text-sm text-slate-600">{item.notes}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
