import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const buildTimestamp = new Date().toISOString()
const buildId = `${buildTimestamp}-${Math.random().toString(36).slice(2, 8)}`
const pstSheetsWebAppUrl = 'https://script.google.com/macros/s/AKfycbx5djrvi6RgOJ0zXUPtPi1IDNWjdXfwYKdK1FbGOI7SzbqQf_ZzX16x6ZL__1NvpXaVsg/exec'

function appVersionPlugin() {
    return {
        name: 'app-version-plugin',
        generateBundle() {
            this.emitFile({
                type: 'asset',
                fileName: 'version.json',
                source: JSON.stringify(
                    {
                        version: buildId,
                        builtAt: buildTimestamp,
                    },
                    null,
                    2
                ),
            })
        },
    }
}

export default defineConfig({
    define: {
        'import.meta.env.VITE_APP_BUILD_ID': JSON.stringify(buildId),
        'import.meta.env.VITE_PST_SHEETS_WEB_APP_URL': JSON.stringify(pstSheetsWebAppUrl),
    },
    plugins: [react(), tailwindcss(), appVersionPlugin()],
    base: '/',
    server: {
        host: 'localhost',
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:4176',
                changeOrigin: true,
            },
        },
    }
})
