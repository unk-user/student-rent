import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import envCompatible from 'vite-plugin-env-compatible';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  envPrefix: 'REACT_APP',
  plugins: [react(), envCompatible()],
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, './src'),
    },
  },
});
