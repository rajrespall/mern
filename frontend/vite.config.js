// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, 'src/assets'),
    },
  },
  optimizeDeps: {
    include: ["@mui/icons-material", "@mui/icons-material/ExpandLess", "@mui/icons-material/ExpandMore"],
  },
});
