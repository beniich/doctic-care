const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const bodyParser = require('body-parser');

// Mock app for CSRF testing without full server dependencies
const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
const csrfProtection = csrf({ cookie: true });

// Routes
app.get('/csrf-token', csrfProtection, (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

app.post('/protected', csrfProtection, (req, res) => {
    res.json({ message: 'Success' });
});

// Error handler
app.use((err, req, res, next) => {
    if (err.code !== 'EBADCSRFTOKEN') return next(err);
    res.status(403).json({ error: 'CSRF Error' });
});

describe('CSRF Protection', () => {
    let csrfToken;
    let cookie;

    // 1. Get Token and Cookie
    it('should get CSRF token', async () => {
        const res = await request(app).get('/csrf-token');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('csrfToken');

        csrfToken = res.body.csrfToken;
        cookie = res.headers['set-cookie'];
    });

    // 2. Fail without token
    it('should fail POST without token', async () => {
        const res = await request(app).post('/protected');
        expect(res.statusCode).toEqual(403);
    });

    // 3. Succeed with token and cookie
    it('should succeed POST with valid token', async () => {
        const res = await request(app)
            .post('/protected')
            .set('Cookie', cookie)
            .set('CSRF-Token', csrfToken)
            .send({});

        expect(res.statusCode).toEqual(200);
    });
});
