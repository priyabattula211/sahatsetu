# Sehat Setu API

Base URL: `http://localhost:4000/api`

| Method | Endpoint | Auth | Role | Description |
| --- | --- | --- | --- | --- |
| `POST` | `/auth/signup` | No | Public | Create a new account and return JWT token |
| `POST` | `/auth/login` | No | Public | Login and return JWT token |
| `GET` | `/auth/me` | Bearer | Any | Return current authenticated user |
| `GET` | `/patient/dashboard` | Bearer | Patient | Patient dashboard data: appointments, records, ASHA assignment |
| `GET` | `/patient/doctors` | Bearer | Patient | List doctors available for booking |
| `POST` | `/patient/appointments` | Bearer | Patient | Book an appointment |
| `POST` | `/patient/symptom-checker` | Bearer | Patient | Submit symptom checker entry |
| `GET` | `/asha/dashboard` | Bearer | ASHA | ASHA dashboard data: assigned patients, visits, available doctors |
| `POST` | `/asha/visits` | Bearer | ASHA | Log home visit with vitals |
| `POST` | `/asha/escalations` | Bearer | ASHA | Escalate a patient to a doctor |
| `GET` | `/doctor/dashboard` | Bearer | Doctor | Doctor dashboard data: escalation queue, patient history, appointments |
| `POST` | `/doctor/prescriptions` | Bearer | Doctor | Write prescription or clinical note |
| `PATCH` | `/doctor/escalations/:id/resolve` | Bearer | Doctor | Mark escalated case resolved |

## Sample Auth Payloads

### Signup Patient

```json
{
  "fullName": "Rani Kumari",
  "email": "rani@example.com",
  "password": "Password123!",
  "role": "PATIENT",
  "age": 32,
  "gender": "Female",
  "village": "Rampur"
}
```

### Login

```json
{
  "email": "patient@sehatsetu.in",
  "password": "Password123!"
}
```
