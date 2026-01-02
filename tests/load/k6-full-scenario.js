// ========================================
// DOCTIC MEDICAL OS - K6 Load Test
// Full User Scenario
// Target: 1000 concurrent users
// ========================================

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

// Test configuration
export const options = {
    stages: [
        { duration: '2m', target: 100 },    // Ramp-up to 100 users
        { duration: '5m', target: 100 },    // Stay at 100 for 5 minutes
        { duration: '2m', target: 500 },    // Ramp-up to 500 users
        { duration: '5m', target: 500 },    // Stay at 500 for 5 minutes
        { duration: '2m', target: 1000 },   // Ramp-up to 1000 users
        { duration: '10m', target: 1000 },  // Stay at 1000 for 10 minutes
        { duration: '2m', target: 0 },      // Ramp-down to 0 users
    ],
    thresholds: {
        'http_req_duration': ['p(95)<2000', 'p(99)<3000'], // 95% requests < 2s, 99% < 3s
        'http_req_failed': ['rate<0.01'],                   // Error rate < 1%
        'checks': ['rate>0.95'],                            // 95% checks pass
    },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:5000';

// Mock user credentials
const users = [
    { email: 'doctor1@test.doctic.fr', password: 'test123' },
    { email: 'doctor2@test.doctic.fr', password: 'test123' },
    { email: 'admin@test.doctic.fr', password: 'test123' },
];

export default function () {
    const user = users[Math.floor(Math.random() * users.length)];
    let authToken = '';

    // ========================================
    // 1. LOGIN
    // ========================================
    group('Login', function () {
        const loginRes = http.post(`${BASE_URL}/api/login`, JSON.stringify({
            email: user.email,
            password: user.password,
            role: 'doctor'
        }), {
            headers: { 'Content-Type': 'application/json' },
        });

        check(loginRes, {
            'login status 200': (r) => r.status === 200,
            'login has token': (r) => r.json('token') !== '',
        }) || errorRate.add(1);

        if (loginRes.status === 200) {
            authToken = loginRes.json('token');
        }
    });

    sleep(1);

    if (!authToken) return; // Skip if login failed

    const authHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
    };

    // ========================================
    // 2. DASHBOARD
    // ========================================
    group('Dashboard', function () {
        const dashRes = http.get(`${BASE_URL}/api/patients`, {
            headers: authHeaders,
        });

        check(dashRes, {
            'dashboard status 200': (r) => r.status === 200,
            'dashboard response time OK': (r) => r.timings.duration < 2000,
        }) || errorRate.add(1);
    });

    sleep(2);

    // ========================================
    // 3. GET PATIENTS
    // ========================================
    group('Patients List', function () {
        const patientsRes = http.get(`${BASE_URL}/api/patients?q=`, {
            headers: authHeaders,
        });

        check(patientsRes, {
            'patients status 200': (r) => r.status === 200,
            'patients has data': (r) => r.json().length >= 0,
        }) || errorRate.add(1);
    });

    sleep(2);

    // ========================================
    // 4. CREATE APPOINTMENT
    // ========================================
    group('Create Appointment', function () {
        const newAppointment = {
            patientId: `patient-${Math.floor(Math.random() * 10000)}`,
            date: '2026-01-15T10:00:00Z',
            type: 'consultation',
            status: 'scheduled',
        };

        const createRes = http.post(
            `${BASE_URL}/api/appointments`,
            JSON.stringify(newAppointment),
            { headers: authHeaders }
        );

        check(createRes, {
            'appointment created': (r) => r.status === 201 || r.status === 200,
        }) || errorRate.add(1);
    });

    sleep(3);

    // ========================================
    // 5. GET APPOINTMENTS
    // ========================================
    group('Appointments List', function () {
        const appointmentsRes = http.get(`${BASE_URL}/api/appointments`, {
            headers: authHeaders,
        });

        check(appointmentsRes, {
            'appointments status 200': (r) => r.status === 200,
        }) || errorRate.add(1);
    });

    sleep(2);

    // ========================================
    // 6. SEARCH PATIENT
    // ========================================
    group('Search Patient', function () {
        const searchRes = http.get(`${BASE_URL}/api/patients?q=test`, {
            headers: authHeaders,
        });

        check(searchRes, {
            'search status 200': (r) => r.status === 200,
            'search response time OK': (r) => r.timings.duration < 1500,
        }) || errorRate.add(1);
    });

    sleep(1);

    // ========================================
    // 7. BILLING
    // ========================================
    group('Billing', function () {
        const billingRes = http.get(`${BASE_URL}/api/billing`, {
            headers: authHeaders,
        });

        check(billingRes, {
            'billing status 200': (r) => r.status === 200,
        }) || errorRate.add(1);
    });

    sleep(2);

    // Think time (simulate user reading)
    sleep(Math.random() * 3 + 2); // 2-5 seconds
}

// ========================================
// TEARDOWN
// ========================================
export function teardown(data) {
    console.log('==================================');
    console.log('Load Test Completed');
    console.log('==================================');
}
