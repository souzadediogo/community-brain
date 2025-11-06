# Tests

Cross-service tests for the Community Brain platform.

## Structure

```
tests/
├── e2e/                    # End-to-end tests
│   ├── auth.spec.ts       # Authentication flows
│   ├── threads.spec.ts    # Thread creation and management
│   ├── assistant.spec.ts  # AI assistant features
│   └── search.spec.ts     # Search functionality
└── integration/            # Integration tests
    ├── api-gateway.test.ts
    ├── community.test.ts
    └── assistant.test.ts
```

## Running Tests

```bash
# All tests
npm test

# E2E tests only
npm run test:e2e

# Integration tests only
npm run test:integration

# With coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## Tech Stack
- **E2E:** Playwright
- **Integration:** Jest + Supertest
- **Unit:** Jest (per service)
