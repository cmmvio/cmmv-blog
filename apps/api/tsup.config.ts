import { defineConfig } from 'tsup';
// @ts-ignore
import tsconfig from './tsconfig.json';
import path from 'path';
import fs from 'fs';

function resolveFirstExistingPath(targets: string[]) {
    for (const t of targets) {
        const resolved = path.resolve(__dirname, t.replace(/\/\*$/, ''));
        if (fs.existsSync(resolved)) return resolved;
    }
    return undefined;
}

function extractAliasesFromTsconfig(): Record<string, string> {
    const aliases: Record<string, string> = {};
    const paths = tsconfig.compilerOptions?.paths ?? {};

    for (const [alias, targetPaths] of Object.entries(paths)) {
        const aliasKey = alias.replace(/\/\*$/, '');
        const resolved = resolveFirstExistingPath(targetPaths as string[]);
        if (resolved) aliases[aliasKey] = resolved;
    }

    return aliases;
}

const sharedOptions = {
    sourcemap: false,
    clean: true,
    skipNodeModulesBundle: true,
    esbuildOptions(options: any) {
        options.alias = extractAliasesFromTsconfig();
    }
};

export default defineConfig([
    {
        entry: ['src/main.ts'],
        format: ['esm', 'cjs'],
        outDir: 'dist',
        ...sharedOptions,
        dts: true
    },
    {
        entry: ['.generated/app.module.ts'],
        format: ['cjs'],
        outDir: 'dist',
        dts: false,
        ...sharedOptions
    }
]);
