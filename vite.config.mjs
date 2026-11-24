import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const envKeys = [
  'REACT_APP_BACKEND_URL',
  'REACT_APP_COMMIT_SHA',
  'REACT_APP_BUILD_DATE',
  'REACT_APP_ALGOLIA_APP_ID',
];

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'REACT_APP_');

  const define = {
    'process.env.NODE_ENV': JSON.stringify(mode),
  };

  envKeys.forEach((key) => {
    define[`process.env.${key}`] = env[key] ? JSON.stringify(env[key]) : 'undefined';
  });

  return {
    define,
    plugins: [react()],
    server: {
      port: 3000,
    },
    build: {
      outDir: 'build',
    },
  };
});
