import bcrypt from 'bcryptjs';
import { PrismaClient, Role, AppointmentStatus, EscalationStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.prescription.deleteMany();
  await prisma.escalation.deleteMany();
  await prisma.homeVisit.deleteMany();
  await prisma.symptomCheck.deleteMany();
  await prisma.healthRecord.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.patientProfile.deleteMany();
  await prisma.ashaProfile.deleteMany();
  await prisma.doctorProfile.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('Password123!', 10);

  const doctorUser = await prisma.user.create({
    data: {
      fullName: 'Dr. Meera Sharma',
      email: 'doctor@sehatsetu.in',
      passwordHash,
      role: Role.DOCTOR,
      doctor: { create: { specialization: 'General Medicine' } },
    },
    include: { doctor: true },
  });

  const ashaUser = await prisma.user.create({
    data: {
      fullName: 'Sushma Devi',
      email: 'asha@sehatsetu.in',
      passwordHash,
      role: Role.ASHA,
      asha: { create: { region: 'Sitapur Block A' } },
    },
    include: { asha: true },
  });

  const patientUser = await prisma.user.create({
    data: {
      fullName: 'Rani Kumari',
      email: 'patient@sehatsetu.in',
      passwordHash,
      role: Role.PATIENT,
      patient: {
        create: {
          age: 32,
          gender: 'Female',
          village: 'Rampur',
          ashaWorkerId: ashaUser.asha.id,
        },
      },
    },
    include: { patient: true },
  });

  const secondPatient = await prisma.user.create({
    data: {
      fullName: 'Mohan Lal',
      email: 'mohan@sehatsetu.in',
      passwordHash,
      role: Role.PATIENT,
      patient: {
        create: {
          age: 58,
          gender: 'Male',
          village: 'Rampur',
          ashaWorkerId: ashaUser.asha.id,
        },
      },
    },
    include: { patient: true },
  });

  await prisma.healthRecord.createMany({
    data: [
      {
        patientId: patientUser.patient.id,
        title: 'Anaemia follow-up',
        description: 'Iron supplements prescribed and diet counselling provided.',
      },
      {
        patientId: secondPatient.patient.id,
        title: 'Hypertension monitoring',
        description: 'Requires weekly blood pressure review.',
      },
    ],
  });

  await prisma.appointment.createMany({
    data: [
      {
        patientId: patientUser.patient.id,
        doctorId: doctorUser.doctor.id,
        scheduledAt: new Date('2026-06-20T10:00:00.000Z'),
        notes: 'Discuss fatigue and nutrition.',
        status: AppointmentStatus.BOOKED,
      },
      {
        patientId: secondPatient.patient.id,
        doctorId: doctorUser.doctor.id,
        scheduledAt: new Date('2026-06-18T08:30:00.000Z'),
        notes: 'Escalated blood pressure case.',
        status: AppointmentStatus.PENDING,
      },
    ],
  });

  await prisma.homeVisit.create({
    data: {
      patientId: secondPatient.patient.id,
      ashaWorkerId: ashaUser.asha.id,
      visitDate: new Date('2026-06-10T07:00:00.000Z'),
      notes: 'Patient reported headaches and dizziness.',
      bloodPressure: '150/95',
      heartRate: 88,
      temperature: 98.4,
    },
  });

  await prisma.escalation.create({
    data: {
      patientId: secondPatient.patient.id,
      ashaWorkerId: ashaUser.asha.id,
      doctorId: doctorUser.doctor.id,
      reason: 'Repeated high blood pressure readings during home visits.',
      status: EscalationStatus.OPEN,
    },
  });

  await prisma.prescription.create({
    data: {
      patientId: patientUser.patient.id,
      doctorId: doctorUser.doctor.id,
      medication: 'Iron Folic Acid',
      dosage: 'One tablet after meals for 30 days',
      notes: 'Encourage leafy greens and follow-up in two weeks.',
    },
  });

  await prisma.symptomCheck.create({
    data: {
      patientId: patientUser.patient.id,
      symptoms: 'Fatigue, dizziness',
      severity: 'Moderate',
      duration: '2 weeks',
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
