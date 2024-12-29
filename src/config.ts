/* eslint-disable prettier/prettier */
const port = process.env.PORT || 3000; 
export const BASE_URL = process.env.NODE_ENV === 'development' ? `http://localhost:${port}` : 'http://production-url';
