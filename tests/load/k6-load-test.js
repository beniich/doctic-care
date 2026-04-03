import http from 'k6/http';
import { check, sleep } from 'k6';

// ============================================================
// Doctic Care — k6/load-test.js
// Test de charge de l'infrastructure
// Usage : k6 run load-test.js
// ============================================================

export const options = {
  stages: [
    { duration: '30s', target: 20 }, // Montée en charge à 20 users
    { duration: '1m', target: 20 },  // Plateau
    { duration: '30s', target: 0 },  // Descente
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% des requêtes sous 500ms
  },
};

export default function () {
  const BASE_URL = __ENV.API_URL || 'http://localhost/api';

  // Test du healthcheck
  const res = http.get(`${BASE_URL}/health`);
  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(1);
}
