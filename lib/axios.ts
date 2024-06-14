// @ts-nocheck

import Axios from 'axios';
const isServer = typeof window === 'undefined';
export const accessToken = isServer ? '' : localStorage.getItem('token');
// Immediately-invoked function to determine if we are server-side
const axios = Axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`
  }
});

export default axios;
