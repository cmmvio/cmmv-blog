import path from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import type { IncomingMessage } from 'http';
import { unheadVueComposablesImports } from '@unhead/vue'
import AutoImport from 'unplugin-auto-import/vite'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
//@ts-ignore
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), 'VITE');
    const apiUrl = env.VITE_API_URL || 'http://localhost:6020';
    const adminUrl = env.VITE_API_URL || 'http://localhost:6002';
    const allowedHosts = env.VITE_ALLOWED_HOSTS || 'blog.cmmv.io';

    const forwardRefreshToken = (proxy: any) => {
        proxy.on('proxyReq', (proxyReq: any, req: IncomingMessage) => {
            const refreshToken = req.headers['refresh-token'];
            const signature = req.headers['signature'];

            if (refreshToken)
                proxyReq.setHeader('refresh-token', refreshToken);

            if (signature)
                proxyReq.setHeader('signature', signature);
        });
    };

    return {
        plugins: [
            vue(),
            AutoImport({
                imports: [
                  unheadVueComposablesImports,
                ],
            }),
            ViteImageOptimizer(),
            tailwindcss(),
        ],
        ssr: {
            noExternal: [],
        },
        build: {
            minify: 'terser',
            outDir: 'dist',
            rollupOptions: {
                input: path.resolve(__dirname, 'index.html'),
            }
        },
        resolve: {
            preserveSymlinks: true,
            alias: {
                '@cmmv/blog': path.resolve(__dirname, '../../packages/plugin/'),
                '@cmmv/blog/*': path.resolve(__dirname, '../../packages/plugin/*')
            },
        },
        server: {
            allowedHosts: allowedHosts.split(',').map(host => host.trim()),
            host: "0.0.0.0",
            proxy: {
                '/api': {
                    target: apiUrl,
                    changeOrigin: true,
                    secure: false,
                    rewrite: (path) => path.replace(/^\/api/, ''),
                    configure: forwardRefreshToken,
                },
                '/admin': {
                    target: adminUrl,
                    changeOrigin: true,
                    secure: false,
                    rewrite: (path) => path.replace(/^\/admin/, ''),
                    configure: forwardRefreshToken,
                },
                '/feed': { target: apiUrl },
                '/sitemap': { target: apiUrl },
                '/sitemap.xml': { target: apiUrl },
                '/post-sitemap.xml': { target: apiUrl },
                '/page-sitemap.xml': { target: apiUrl },
                '/category-sitemap.xml': { target: apiUrl },
                '/tag-sitemap.xml': { target: apiUrl },
                '/robots.txt': { target: apiUrl },
                '/images': {
                    target: apiUrl,
                    changeOrigin: true,
                    secure: false
                },
            },
        },
    };
});
