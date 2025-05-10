import path from 'node:path';
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import type { ConfigEnv, UserConfig } from 'vite'

export default defineConfig(async ({ mode }: ConfigEnv): Promise<UserConfig> => {
    await new Promise((res) => setTimeout(res, 5000));
    const env = loadEnv(mode, process.cwd(), 'VITE')
    const apiUrl = env.VITE_API_URL || 'http://localhost:6020';
    const allowedHosts = env.VITE_ALLOWED_HOSTS || 'blog.cmmv.io';
    const whitelabelApiUrls: Record<string, string> = {};

    const fetchWhitelabelApiUrls = async (retryCount = 0, maxRetries = 10) => {
        if(Object.keys(whitelabelApiUrls).length > 0)
            return true;

        try {
            if (typeof fetch === 'undefined') {
                //console.warn('Fetch API not available, skipping whitelabel data fetch');
                return false;
            }

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(`${apiUrl}/whitelabel/admin`, {
                signal: controller.signal
            }).catch(error => {
                //console.warn(`Fetch request failed: ${error.message}`);
                return null;
            });

            clearTimeout(timeoutId);

            if (!response)
                return false;

            if (response.ok) {
                const whitelabels = await response.json();
                let count = 0;

                whitelabels.result.data.forEach((whitelabel: any) => {
                    if (whitelabel.id && whitelabel.apiUrl) {
                        whitelabelApiUrls[whitelabel.id] = whitelabel.apiUrl;
                        count++;
                    }
                });

                console.log(`Successfully loaded ${count} whitelabel API URLs`);
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        } finally {
            if (retryCount < maxRetries) {
                const delay = Math.min(2000 * Math.pow(1.5, retryCount), 1000);
                await new Promise(resolve => setTimeout(resolve, delay));
                return fetchWhitelabelApiUrls(retryCount + 1, maxRetries);
            } else {
                console.log('Max retries reached, continuing with build process');
                return false;
            }
        }
    };

    try {
        await fetchWhitelabelApiUrls();
    } catch (error) {
        console.warn('Failed to fetch whitelabel data, continuing with build:', error);
    }

    const generateProxyConfig = () => {
        const proxyConfig: Record<string, any> = {
            '/api': {
                target: apiUrl,
                changeOrigin: true,
                secure: false,
                configure: (proxy: any) => {
                    proxy.on('proxyReq', (proxyReq: any, req: any) => {
                        const refreshToken = req.headers['refresh-token'];
                        if (refreshToken) {
                            proxyReq.setHeader('refresh-token', refreshToken);
                        }

                        const whitelabelId = req.headers['x-whitelabel-id'];
                        if (whitelabelId) {
                            proxyReq.setHeader('x-whitelabel-id', whitelabelId);
                        }
                    });
                },
                rewrite: (path: string) => path.replace(/^\/api/, '')
            },
            '/images': {
                target: apiUrl,
                changeOrigin: true,
                secure: false
            }
        };

        proxyConfig['/api/admin'] = {
            target: apiUrl,
            changeOrigin: true,
            secure: false,
            rewrite: (path: string) => path.replace(/^\/api\/admin/, '')
        };

        Object.entries(whitelabelApiUrls).forEach(([id, url]) => {
            const pattern = `/${id}`;
            console.log(`Creating proxy for whitelabel: ${pattern} -> ${url}`);

            proxyConfig[pattern] = {
                target: url,
                changeOrigin: true,
                secure: false,
                configure: (proxy: any) => {
                    proxy.on('proxyReq', (proxyReq: any, req: any) => {
                        const refreshToken = req.headers['refresh-token'];
                        if (refreshToken) {
                            proxyReq.setHeader('refresh-token', refreshToken);
                        }

                        const whitelabelId = req.headers['x-whitelabel-id'];
                        if (whitelabelId)
                            proxyReq.setHeader('x-whitelabel-id', whitelabelId);
                    });
                },
                rewrite: (path: string) => {
                    return path.replace(new RegExp(`^${pattern}`), '');
                }
            };
        });

        return proxyConfig;
    };

    return {
        plugins: [vue()],
        build: {
            chunkSizeWarningLimit: 1000000,
            rollupOptions: {
                output: {
                    manualChunks: {
                        'vue': ['vue', 'vue-router', 'pinia']
                    }
                }
            }
        },
        ssr: {
            noExternal: []
        },
        resolve: {
            preserveSymlinks: true,
            alias: {
                '@cmmv/blog': path.resolve(__dirname, '../../packages/plugin/'),
                '@cmmv/blog/*': path.resolve(__dirname, '../../packages/plugin/*'),
                '@cmmv/access-control': path.resolve(__dirname, '../../packages/access-control/'),
                '@cmmv/access-control/*': path.resolve(__dirname, '../../packages/access-control/*'),
                '@cmmv/rss-aggregation': path.resolve(__dirname, '../../packages/rss-aggregation/'),
                '@cmmv/rss-aggregation/*': path.resolve(__dirname, '../../packages/rss-aggregation/*'),
                '@cmmv/yt-aggregation': path.resolve(__dirname, '../../packages/yt-aggregation/'),
                '@cmmv/yt-aggregation/*': path.resolve(__dirname, '../../packages/yt-aggregation/*'),
                '@cmmv/affiliate': path.resolve(__dirname, '../../packages/affiliate/'),
                '@cmmv/affiliate/*': path.resolve(__dirname, '../../packages/affiliate/*')
            }
        },
        server: {
            allowedHosts: allowedHosts.split(',').map(host => host.trim()),
            port: Number(env.VITE_PORT) || 6002,
            host: "0.0.0.0",
            proxy: generateProxyConfig()
        },
    }
})
