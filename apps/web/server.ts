import { createServer } from 'vite';
import * as http from 'node:http';
import * as fs from 'node:fs';
import * as path from 'node:path';

async function start() {
    const vite = await createServer({
        server: { middlewareMode: true },
        appType: 'custom'
    });

    const server = http.createServer(async (req, res) => {
        const url = req.url || '/';

        vite.middlewares(req, res, async () => {
            try {
                if (/\.\w+$/.test(url)) {
                    res.statusCode = 404;
                    return res.end(`Not found: ${url}`);
                }

                let template = fs.readFileSync(path.resolve('index.html'), 'utf-8');
                template = await vite.transformIndexHtml(url, template);

                const { render } = await vite.ssrLoadModule('/src/entry-server.ts');
                const { html: appHtml, data, metadata } = await render(url);

                for(const key in metadata)
                    template = template.replace(`{${key}}`, metadata[key]);

                const finalHtml = template
                    .replace(`<div id="app"></div>`, `<div id="app">${appHtml}</div>`);

                res.setHeader('Content-Type', 'text/html');
                res.end(finalHtml);
            } catch (e) {
                console.log('TO AKI')
                console.log(e);
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