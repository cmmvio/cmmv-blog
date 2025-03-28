import { defineConfig } from 'tsup';

export default defineConfig({
    entry: [
        "packages/plugin/api/index.ts",
        "packages/plugin/admin/index.ts",
        "packages/plugin/client/index.ts",
        "packages/plugin/contracts/index.ts",
    ],
    outDir: 'dist',
    format: ['esm', 'cjs'],
    splitting: false,
    clean: true,
    dts: true
});
