import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@mapbox/node-pre-gyp', 'aws-sdk', 'mock-aws-s3', 'nock'],
  },
})
