import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    build: {
        sourcemap: true,
    },
    plugins: [react()],
    // server: {
    //     watch: {
    //         usePolling: true
    //     }
    // }
    server: {
        port: 3000,
    },
});