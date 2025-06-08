import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables based on mode (dev/prod) and site being built
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      // Bundle analyzer (only in production)
      mode === 'production' && visualizer({
        open: true,
        filename: 'bundle-analysis.html',
        gzipSize: true,
        brotliSize: true,
      })
    ].filter(Boolean),

    // Base public path for production
    base: env.VITE_BASE_URL || '/',

    // Build optimization for production
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
      sourcemap: mode !== 'production', // Enable sourcemaps in dev only
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production', // Remove console.log in production
        },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            vendor: ['axios', 'formik', 'yup'],
            ui: ['@mui/material', '@mui/icons-material', '@emotion/react'],
          },
        },
      },
      chunkSizeWarningLimit: 1000, // in kB
    },

    // Server configuration for development
    server: {
      port: 5173,
      strictPort: true,
      open: true,
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_URL || 'https://booknest1.onrender.com',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          headers: {
            'X-Forwarded-Proto': 'https',
          },
        },
      },
    },

    // Preview configuration (simulates production)
    preview: {
      port: 4173,
      strictPort: true,
      host: true,
    },

    // Global CSS and SCSS configuration
    css: {
      devSourcemap: true,
      modules: {
        localsConvention: 'camelCaseOnly',
      },
    },

    // Environment variables configuration
    define: {
      'process.env': {
        VITE_BACKEND_URL: JSON.stringify(env.VITE_BACKEND_URL),
        VITE_MODE: JSON.stringify(mode),
      },
    },

    // Resolve aliases for imports
    resolve: {
      alias: [
        { find: '@', replacement: '/src' },
        { find: '@components', replacement: '/src/components' },
        { find: '@pages', replacement: '/src/pages' },
        { find: '@assets', replacement: '/src/assets' },
      ],
    },
  };
});