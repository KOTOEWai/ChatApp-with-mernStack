import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,          // ✅ Add this line
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
  },
})
