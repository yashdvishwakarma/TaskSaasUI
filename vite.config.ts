import { defineConfig } from 'vite'
import path from 'path';
import react from '@vitejs/plugin-react'

// https://vite.dev/config/

 export default defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        'dayjs': path.resolve(__dirname, 'node_modules/dayjs'),
      },
    },
  });