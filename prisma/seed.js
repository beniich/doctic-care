import dotenv from 'dotenv';
dotenv.config();
import prisma from '../backend/config/db.js';

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Create Tenant
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'doc-clinic' },
    update: {},
    create: {
      name: 'Doctic Clinic',
      slug: 'doc-clinic',
      active: true,
    },
  });
  console.log(`✅ Tenant created: ${tenant.name}`);

  // 2. Create User
  const user = await prisma.user.upsert({
    where: { email: 'dr.anderson@example.com' },
    update: {},
    create: {
      email: 'dr.anderson@example.com',
      firstName: 'Anderson',
      lastName: 'Dr.',
      name: 'Dr. Anderson',
      role: 'DOCTOR',
      tenantId: tenant.id,
      active: true,
    },
  });
  console.log(`✅ User created: ${user.name}`);

  // 3. Create Patients
  const patientsData = [
    { firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.johnson@email.com', gender: 'Female', phone: '06 12 34 56 78', address: '123 Main St, Cityville', bloodType: 'A+', tenantId: tenant.id },
    { firstName: 'Jean', lastName: 'Martin', email: 'jean.martin@email.com', gender: 'Male', phone: '06 23 45 67 89', address: '456 Oak Ave', bloodType: 'O-', tenantId: tenant.id },
    { firstName: 'Emma', lastName: 'Williams', email: 'emma.williams@email.com', gender: 'Female', phone: '06 98 76 54 32', address: '789 Pine Rd', bloodType: 'B+', tenantId: tenant.id }
  ];

  for (const p of patientsData) {
    const patient = await prisma.patient.upsert({
      where: { id: `mock-${p.firstName.toLowerCase()}` }, // Using fixed ID for idempotency in seed
      update: {},
      create: {
        id: `mock-${p.firstName.toLowerCase()}`,
        ...p
      }
    });
    console.log(`✅ Patient created: ${patient.firstName} ${patient.lastName}`);
  }

  // 4. Create Appointments
  const fetchedPatients = await prisma.patient.findMany({ where: { tenantId: tenant.id } });
  
  if (fetchedPatients.length > 0) {
    const appointmentsData = [
      { start: new Date('2026-03-20T09:00:00Z'), end: new Date('2026-03-20T09:30:00Z'), status: 'CONFIRMED', motif: 'Annual check-up', patientId: fetchedPatients[0].id },
      { start: new Date('2026-03-20T10:30:00Z'), end: new Date('2026-03-20T11:15:00Z'), status: 'PENDING', motif: 'Follow-up asthma', patientId: fetchedPatients[1].id },
      { start: new Date('2026-03-21T11:45:00Z'), end: new Date('2026-03-21T12:15:00Z'), status: 'CONFIRMED', motif: 'Teleconsultation', patientId: fetchedPatients[2].id }
    ];

    for (const a of appointmentsData) {
      await prisma.appointment.create({
        data: a
      });
    }
    console.log(`✅ Created ${appointmentsData.length} appointments`);
  }

  console.log('🚀 Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
