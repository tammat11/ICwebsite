import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default {
    plugins: [react(), tailwindcss()],
    base: '/',
    cacheDir: '/tmp/vite-cache'
}
