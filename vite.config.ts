import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      envPrefix: ['VITE_', 'KIE_', 'SUPABASE_', 'OPENAI_'],
      server: {
        port: 5000,
        host: '0.0.0.0',
        hmr: {
          protocol: 'wss',
          host: env.REPLIT_DEV_DOMAIN || 'localhost',
          clientPort: 443,
        },
      },
      plugins: [react()],
      define: {
        'import.meta.env.KIE_API_KEY': JSON.stringify(env.KIE_API_KEY ?? ''),
        'import.meta.env.VITE_KIE_API_KEY': JSON.stringify(env.VITE_KIE_API_KEY ?? env.KIE_API_KEY ?? ''),
        'import.meta.env.OPENAI_API_KEY': JSON.stringify(env.OPENAI_API_KEY ?? ''),
        'import.meta.env.VITE_OPENAI_API_KEY': JSON.stringify(env.VITE_OPENAI_API_KEY ?? env.OPENAI_API_KEY ?? ''),
        'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL ?? env.SUPABASE_URL ?? ''),
        'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY ?? env.SUPABASE_ANON_KEY ?? ''),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
