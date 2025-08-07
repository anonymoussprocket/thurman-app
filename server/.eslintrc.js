module.exports = {
    env: {
        node: true,
        es2021: true
    },
    extends: ['airbnb-base', 'plugin:@typescript-eslint/recommended', 'prettier', 'plugin:prettier/recommended'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json'
    },
    plugins: ['@typescript-eslint', 'prettier'],
    rules: {
        // Prettier integration
        'prettier/prettier': 'error',

        // TypeScript specific rules
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'warn',

        // Import rules adjustments for TypeScript
        'import/extensions': [
            'error',
            'ignorePackages',
            {
                js: 'never',
                jsx: 'never',
                ts: 'never',
                tsx: 'never'
            }
        ],
        'import/no-extraneous-dependencies': [
            'error',
            {
                devDependencies: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx', '**/seed.ts', '**/scripts/**']
            }
        ],

        // Airbnb overrides for Node.js/Express patterns
        'no-console': 'off', // Allow console in server code
        'import/prefer-default-export': 'off',
        'class-methods-use-this': 'off',
        'no-param-reassign': ['error', { props: false }],
        'consistent-return': 'off',

        // Allow certain patterns common in Express apps
        'no-underscore-dangle': ['error', { allow: ['_id'] }]
    },
    settings: {
        'import/resolver': {
            typescript: {
                alwaysTryTypes: true,
                project: './tsconfig.json'
            }
        }
    },
    ignorePatterns: [
        'node_modules/',
        'dist/',
        'logs/',
        '*.js' // Ignore compiled JS files
    ]
};
