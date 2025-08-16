// Backend API base path for reverse proxy setup.
// In reverse proxy mode, we just hit /api which nginx will forward to backend private IP.
const apiBaseUrl = '/api';
export default { apiBaseUrl };
