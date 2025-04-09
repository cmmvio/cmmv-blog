import path from 'node:path';
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

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
                '@cmmv/blog': path.resolve(__dirname, '../../packages/plugin/'),
                '@cmmv/blog/*': path.resolve(__dirname, '../../packages/plugin/*'),
                '@cmmv/client': path.resolve(__dirname, '../../packages/plugin/client'),
                '@cmmv/client/*': path.resolve(__dirname, '../../packages/plugin/client/*')
            }
        },
        server: {
            port: env.VITE_PORT || 5002,
            host: true,
            proxy: {
                '/api': {
                    target: env.VITE_API_URL || 'http://localhost:5000',
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
