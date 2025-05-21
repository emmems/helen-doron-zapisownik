import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js"
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        cssInjectedByJsPlugin(),
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks: undefined,
                entryFileNames: 'form-index.js',
            },
        },
    },
})
