import path from 'node:path';
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), 'VITE')

    return {
        plugins: [vue()],
        ssr: {
            noExternal: []
        },
        resolve: {
            preserveSymlinks: true,
            alias: {
                '@cmmv/theme-default': path.resolve(__dirname, '../../packages/theme-default'),
                '@cmmv/client': path.resolve(__dirname, '../../packages/plugin/src/client')
            }
        },
        server: {
            proxy: {
                '/api': {
                    target: env.VITE_API_URL || 'http://localhost:3000',
                    changeOrigin: true,
                    secure: false,
                    rewrite: (path) => path.replace(/^\/api/, ''),
                    configure: (proxy) => {
                        proxy.on('proxyReq', (proxyReq, req) => {
                            const refreshToken = req.headers['refresh-token']

                            if (refreshToken)
                                proxyReq.setHeader('refresh-token', refreshToken)
                        })
                    },
                },
            },
        },
    }
})
