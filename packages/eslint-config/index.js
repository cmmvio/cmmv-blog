module.exports = {
    env: {
        node: true,
    },
    parser: "@typescript-eslint/parser",
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier",
    ],
    plugins: ["@typescript-eslint"],
    parserOptions: {
        sourceType: "module",
        ecmaVersion: 2020,
    },
    files: [
        "src/**/*.ts",
        "apps/**/*.ts",
        "libs/**/*.ts",
        "test/**/*.ts"
    ],
    ignores: [
        "node_modules",
        "dist",
        "build",
        ".generated",
        "eslint.config.js"
    ],
    rules: {
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-require-imports": "off"
    },
};