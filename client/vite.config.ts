import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
/*
 * Proxy API requests to the backend server to avoid CORS issues
 * The frontend (vite) runs on port 3000, the backend runs on port 3001.
 * Requests from the frontend to backend routes are forwarded to the backend server.
 */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // vite is on 3000
    //host: '127.0.0.1',  // why not default to localhost instead for consistency?
    open: true,
    proxy: {  // forward backend route requests to port 3001
      '/api': {
        target: 'http://localhost:3001',
        secure: false,
        changeOrigin: true,
      },
    },
  },
});
