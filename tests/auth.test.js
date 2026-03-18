// ========================================
// DOCTIC MEDICAL OS - Backend Tests
// Version: 2.1.0 - Jest
// ========================================

const request = require('supertest');
const jwt = require('jsonwebtoken');

// Mock app (à importer depuis server.js)
const app = require('../server');

describe('🔐 Authentication Endpoints', () => {
    describe('GET /health', () => {
        test('should return 200 and status OK', async () => {
            const res = await request(app).get('/health');

            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe('OK');
            expect(res.body.version).toBe('2.1.0');
        });
    });

    describe('GET /auth/google', () => {
        test('should redirect to Google OAuth', async () => {
            const res = await request(app)
                .get('/auth/google')
                .expect(302);

            expect(res.header.location).toContain('google.com');
        });

        test('should be rate limited after 5 attempts', async () => {
            // 5 requêtes OK
            for (let i = 0; i < 5; i++) {
                await request(app).get('/auth/google');
            }

            // 6ème requête bloquée
            const res = await request(app).get('/auth/google');
            expect(res.statusCode).toBe(429); // Too Many Requests
        });
    });

    describe('POST /auth/refresh', () => {
        test('should return 401 without refresh token', async () => {
            const res = await request(app)
                .post('/auth/refresh')
                .expect(401);

            expect(res.body.error).toContain('Refresh token');
        });

        test('should refresh valid token', async () => {
            // Créer refresh token valide
            const refreshToken = jwt.sign(
                { userId: 'test-user-id', type: 'refresh' },
                process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            const res = await request(app)
                .post('/auth/refresh')
                .set('Cookie', [`refreshToken=${refreshToken}`])
                .expect(200);

            expect(res.body.accessToken).toBeDefined();

            // Vérifier nouveau token
            const decoded = jwt.verify(
                res.body.accessToken,
                process.env.JWT_SECRET
            );
            expect(decoded.type).toBe('access');
        });
    });
});

describe('🛡️ Protected Routes', () => {
    let validToken;

    beforeAll(() => {
        // Générer token valide pour tests
        validToken = jwt.sign(
            {
                userId: 'test-user-id',
                email: 'test@example.com',
                role: 'Doctor',
                tenantId: 'tenant-test',
                type: 'access'
            },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );
    });

    describe('GET /api/patients', () => {
        test('should return 401 without token', async () => {
            const res = await request(app)
                .get('/api/patients')
                .expect(401);

            expect(res.body.error).toContain('Token');
        });

        test('should return 401 with invalid token', async () => {
            const res = await request(app)
                .get('/api/patients')
                .set('Authorization', 'Bearer invalid-token')
                .expect(403);
        });

        test('should return 200 with valid Doctor token', async () => {
            const res = await request(app)
                .get('/api/patients')
                .set('Authorization', `Bearer ${validToken}`)
                .expect(200);

            expect(res.body.patients).toBeDefined();
            expect(res.body.tenantId).toBe('tenant-test');
        });

        test('should return 403 for Patient role', async () => {
            const patientToken = jwt.sign(
                { userId: 'patient-id', role: 'Patient', type: 'access' },
                process.env.JWT_SECRET,
                { expiresIn: '15m' }
            );

            const res = await request(app)
                .get('/api/patients')
                .set('Authorization', `Bearer ${patientToken}`)
                .expect(403);

            expect(res.body.error).toContain('Accès refusé');
        });
    });

    describe('POST /api/prescriptions', () => {
        test('should return 400 with invalid data', async () => {
            const res = await request(app)
                .post('/api/prescriptions')
                .set('Authorization', `Bearer ${validToken}`)
                .send({ invalid: 'data' })
                .expect(400);
        });

        test('should create prescription with valid data', async () => {
            const validPrescription = {
                patientId: 'patient-uuid',
                medications: [
                    {
                        name: 'Paracétamol',
                        dosage: '500mg',
                        frequency: '3x/jour',
                        duration: '5 jours',
                        quantity: 15
                    }
                ]
            };

            const res = await request(app)
                .post('/api/prescriptions')
                .set('Authorization', `Bearer ${validToken}`)
                .send(validPrescription)
                .expect(200);

            expect(res.body.success).toBe(true);
            expect(res.body.prescriptionId).toBeDefined();
        });
    });

    describe('GET /api/analytics', () => {
        test('should return 403 for Doctor role', async () => {
            const res = await request(app)
                .get('/api/analytics')
                .set('Authorization', `Bearer ${validToken}`)
                .expect(403);
        });

        test('should return 200 for Admin role', async () => {
            const adminToken = jwt.sign(
                { userId: 'admin-id', role: 'Admin', type: 'access' },
                process.env.JWT_SECRET,
                { expiresIn: '15m' }
            );

            const res = await request(app)
                .get('/api/analytics')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);

            expect(res.body.metrics).toBeDefined();
        });
    });
});

describe('🚦 Rate Limiting', () => {
    test('API should be rate limited at 100 req/15min', async () => {
        const validToken = jwt.sign(
            { userId: 'test-id', role: 'Doctor', type: 'access' },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        // Simuler 100 requêtes
        for (let i = 0; i < 100; i++) {
            await request(app)
                .get('/api/patients')
                .set('Authorization', `Bearer ${validToken}`);
        }

        // 101ème requête bloquée
        const res = await request(app)
            .get('/api/patients')
            .set('Authorization', `Bearer ${validToken}`);

        expect(res.statusCode).toBe(429);
    }, 30000); // Timeout 30s
});

describe('🔒 Security Headers', () => {
    test('should have security headers (Helmet)', async () => {
        const res = await request(app).get('/health');

        expect(res.headers['x-content-type-options']).toBe('nosniff');
        expect(res.headers['x-frame-options']).toBe('DENY');
        expect(res.headers['strict-transport-security']).toBeDefined();
    });

    test('should have CORS headers', async () => {
        const res = await request(app)
            .get('/health')
            .set('Origin', process.env.FRONTEND_URL);

        expect(res.headers['access-control-allow-origin']).toBe(process.env.FRONTEND_URL);
        expect(res.headers['access-control-allow-credentials']).toBe('true');
    });
});

describe('🎯 JWT Token Validation', () => {
    test('should reject expired token', async () => {
        const expiredToken = jwt.sign(
            { userId: 'test-id', type: 'access' },
            process.env.JWT_SECRET,
            { expiresIn: '0s' } // Expire immédiatement
        );

        // Attendre 1s
        await new Promise(resolve => setTimeout(resolve, 1000));

        const res = await request(app)
            .get('/api/patients')
            .set('Authorization', `Bearer ${expiredToken}`)
            .expect(401);

        expect(res.body.code).toBe('TOKEN_EXPIRED');
    });

    test('should reject refresh token as access token', async () => {
        const refreshToken = jwt.sign(
            { userId: 'test-id', type: 'refresh' },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        const res = await request(app)
            .get('/api/patients')
            .set('Authorization', `Bearer ${refreshToken}`)
            .expect(401);

        expect(res.body.error).toContain('Type de token invalide');
    });
});
