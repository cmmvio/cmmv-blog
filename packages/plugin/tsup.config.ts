import { defineConfig } from 'tsup';

export default defineConfig({
    entry: [
        "api/index.ts",
        "admin/index.ts",
        "client/index.ts",
        "contracts/index.ts",
    ],
    outDir: '../../dist',
    format: ['esm'],
    splitting: false,
    clean: true,
    dts: true,
    sourcemap: true
});
