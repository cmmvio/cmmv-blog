import { createServer } from 'vite';
import * as http from 'node:http';
import * as fs from 'node:fs';
import * as path from 'node:path';
import serveStatic from 'serve-static';
import finalhandler from 'finalhandler';

const cache = new Map<string, { html: string, expires: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000;

async function start() {
    const vite = await createServer({
        server: { middlewareMode: true },
        appType: 'custom'
    });

    const serve = serveStatic(path.resolve('dist'), {
        index: false
    });

    const server = http.createServer(async (req, res) => {
        const url = req.url || '/';

        if (process.env.NODE_ENV === 'production' && url.startsWith('/assets'))
            return serve(req, res, finalhandler(req, res));

        vite.middlewares(req, res, async () => {
            try {
                if (/\.\w+$/.test(url)) {
                    res.statusCode = 404;
                    return res.end(`Not found: ${url}`);
                }

                const cached = cache.get(url);
                const now = Date.now();

                if (cached && cached.expires > now) {
                    res.setHeader('Content-Type', 'text/html');
                    return res.end(cached.html);
                }

                let template = '';
                let render: (url: string) => Promise<any>;

                if (process.env.NODE_ENV === 'production') {
                    template = fs.readFileSync(path.resolve('dist/index.html'), 'utf-8');
                    const mod = await (new Function('return import("./entry-server.js")')());
                    render = mod.render;
                } else {
                    template = fs.readFileSync(path.resolve('index.html'), 'utf-8');
                    const { render: devRender } = await vite.ssrLoadModule('/src/entry-server.ts');
                    render = devRender;
                }

                template = await vite.transformIndexHtml(url, template);
                const { html: appHtml, data, metadata } = await render(url);

                for(const key in metadata)
                    template = template.replace(`{${key}}`, metadata[key]);

                const finalHtml = template
                    .replace(`<div id="app"></div>`, `<div id="app">${appHtml}</div>`);

                cache.set(url, { html: finalHtml, expires: now + CACHE_TTL_MS });

                res.setHeader('Content-Type', 'text/html');
                res.end(finalHtml);
            } catch (e) {
                vite.ssrFixStacktrace(e as Error);
                res.statusCode = 500;
                res.end((e as Error).message);
            }
        });
    });

    const port = process.env.VITE_SSR_PORT || 4000;

    server.listen(port, () => {
        console.log(`🚀 SSR server running at http://localhost:${port}`);
    });
}

start();