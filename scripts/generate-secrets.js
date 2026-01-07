import { generateSecret } from '../config/validateEnv.js';

console.log('JWT_SECRET=' + generateSecret());
console.log('JWT_REFRESH_SECRET=' + generateSecret());
console.log('SESSION_SECRET=' + generateSecret());
