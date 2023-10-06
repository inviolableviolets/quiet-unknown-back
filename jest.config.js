/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['dist'],
  resolver: 'jest-ts-webcompat-resolver',
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: [
    'src/index.ts',
    'src/app.ts',
    'src/config.ts',
    'src/db/db.connect.ts',
    'src/routers/sighting.router.ts',
    'src/routers/user.router.ts',
    'src/repository/sighting.m.model.ts',
    'src/repository/user.m.model.ts',
    'src/repository/repository.ts',
    'src/controllers/controller.ts',
    'src/e2e/users.sightings.spec.ts',
  ],
};
