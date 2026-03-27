import react from '@vitejs/plugin-react-swc';
import { defineConfig, loadEnv } from 'vite';

// https://vite.dev/config/
export default defineConfig((configEnv) => {
  const env = loadEnv(configEnv.mode, process.cwd());
  return {
    plugins: [react()],
    resolve: {
      alias: {
        // https://github.com/tabler/tabler-icons/issues/1233#issuecomment-2428245119
        '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
      },
    },
    server: {
      proxy: {
        '/api': env.VITE_API_URL ?? 'http://localhost:8080',
      },
    },
  };
});
