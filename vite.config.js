import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        'primary-hover': 'var(--primary-hover)',
        surface: 'var(--surface)',
        accent: 'var(--accent)',
      },
      backgroundImage: {
        'cinema-gradient': 'linear-gradient(to top, rgba(15, 23, 42, 1), rgba(15, 23, 42, 0))',
      },
    },
  },
  plugins: [react(), tailwindcss()],
});
