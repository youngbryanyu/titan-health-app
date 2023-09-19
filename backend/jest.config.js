/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ["**/**/*.test.js"],
    verbose: true,
    forceExit: true,
    // clearMocks: true
};
