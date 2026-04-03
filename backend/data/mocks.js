/**
 * 📊 IN-MEMORY DATABASES (MOCK)
 * Used when Prisma or Stripe are not available/connected
 */

export let patientsData = [
    { id: '1', name: 'Sarah Johnson', email: 'sarah.johnson@email.com', age: 34, lastVisit: '15/12/2025', status: 'Actif', phone: '06 12 34 56 78', gender: 'Female', address: '123 Main St, Cityville', medicalHistory: 'Hypertension', allergies: 'Penicillin', medications: 'Metformin' },
    { id: '2', name: 'Jean Martin', email: 'jean.martin@email.com', age: 45, lastVisit: '20/12/2025', status: 'Actif', phone: '06 23 45 67 89', gender: 'Male', address: '456 Oak Ave', medicalHistory: 'Asthma', allergies: 'None', medications: 'Ventolin' },
    { id: '3', name: 'Emma Williams', email: 'emma.williams@email.com', age: 28, lastVisit: '10/01/2026', status: 'Actif', phone: '06 98 76 54 32', gender: 'Female', address: '789 Pine Rd', medicalHistory: 'None', allergies: 'Peanuts', medications: 'None' }
];

export let appointmentsData = [
    { id: '1', time: '09:00', patient: 'Sarah Johnson', type: 'Consultation', duration: '30m', status: 'confirmed', location: 'Room 101', provider: 'Dr. Anderson', date: '2024-01-16T09:00', reason: 'Annual check-up', notes: 'Blood work requested' },
    { id: '2', time: '10:30', patient: 'Jean Martin', type: 'Follow-Up', duration: '45m', status: 'scheduled', location: 'Room 102', provider: 'Dr. Anderson', date: '2024-01-16T10:30', reason: 'Follow-up asthma', notes: '' },
    { id: '3', time: '11:45', patient: 'Emma Williams', type: 'Telehealth', duration: '30m', status: 'confirmed', location: 'Online', provider: 'Dr. Anderson', date: '2024-01-16T11:45', reason: 'Consultation', notes: '' }
];

export let recordsData = [
    { id: '1', patient: 'Sarah Johnson', type: 'Annual Health Check-up', date: '15/01/2024', status: 'final', provider: 'Dr. Anderson', summary: 'Patient presents for annual wellness examination. Vital signs normal.', attachments: 2 },
    { id: '2', patient: 'Jean Martin', type: 'Complete Blood Count', date: '14/01/2024', status: 'final', provider: 'Dr. Anderson', summary: 'All values within normal range.', attachments: 1 }
];

export let invoicesData = [
    {
        id: 'INV-2024-001',
        patient: 'Sarah Johnson',
        date: '15/01/2024',
        items: [{ description: 'General Consultation', qty: 1, price: 150.00, total: 150.00 }],
        subtotal: 150.00,
        tax: 15.00,
        total: 165.00,
        paymentMethod: 'Credit Card',
        status: 'paid',
        signature: null
    },
    {
        id: 'INV-2024-002',
        patient: 'Jean Martin',
        date: '20/12/2025',
        items: [{ description: 'Suivi Asthma', price: 100.00, qty: 1, total: 100.00 }],
        subtotal: 100.00,
        tax: 10.00,
        total: 110.00,
        paymentMethod: 'Insurance',
        status: 'pending',
        signature: null
    }
];

export let prescriptionsData = [
    { id: '1', patient: 'Sarah Johnson', date: '15/12/2025', medications: [{ name: 'Metformin', dosage: '500mg', frequency: '2x/jour' }], status: 'Active' },
    { id: '2', patient: 'Jean Martin', date: '20/12/2025', medications: [{ name: 'Ventolin', dosage: '100mg', frequency: 'Au besoin' }], status: 'Active' }
];

export let archivesData = [
    { id: '1', patient: 'John Doe', type: 'Dossier médical', date: '15/01/2023', reason: 'Patient déménagé', size: '12 MB' }
];

// Mock subscriptions database
export let subscriptionsData = {
    'demo-user': {
        plan: 'professional',
        status: 'active',
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        cancelAtPeriodEnd: false
    }
};
