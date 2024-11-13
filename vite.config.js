import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    build: { // out of memory crash https://github.com/vitejs/vite/issues/15056
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