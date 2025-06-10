import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    open: true,
    cors: true,
    https: false,
    // https: {
    //   key: fs.readFileSync(path.resolve(__dirname, 'certs/key.pem')),
    //   cert: fs.readFileSync(path.resolve(__dirname, 'certs/cert.pem'))
    // }
  },
});
