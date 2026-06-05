# Contributing

Thanks for helping improve `@zients/line-mcp-server`. This project is a Node.js 22+ MCP server for the LINE Messaging API, so changes should keep the tool surface predictable, typed, and well tested.

## Development Setup

Use Node.js 22 or newer.

```bash
npm ci
npm run build
npm test
```

The server requires `CHANNEL_ACCESS_TOKEN` only when running against the real LINE Messaging API. Unit and integration tests use mocked services and do not need LINE credentials.

For local manual testing, copy `.env.example` into your shell or MCP client configuration and set:

- `CHANNEL_ACCESS_TOKEN`: required for real API calls.
- `DEFAULT_UID`: optional User ID fallback for single-target messaging tools.

Never commit real LINE channel tokens, user IDs from private chats, or webhook payloads that contain personal data.

## Project Layout

- `src/index.ts`: stdio MCP server entry point.
- `src/services/line.ts`: `LineService` interface and LINE SDK client implementation.
- `src/tools/`: MCP tool registrations grouped by feature area.
- `src/utils/`: shared parsing and formatting helpers.
- `tests/helpers/`: shared mocks.
- `tests/tools/`: tool handler tests.
- `tests/services/`: LINE client tests.
- `tests/integration/`: MCP server registration and call-through tests.

## Making Changes

Prefer small, focused commits. The existing history uses Conventional Commit-style messages, such as:

```text
feat: support DEFAULT_UID fallback for single-target messaging tools
fix: handle LINE API status code in error output
docs: document optional DEFAULT_UID environment variable
test: cover messaging target fallback
ci: strengthen pull request checks
```

When adding or changing a tool:

1. Add or update the `LineService` method only if the tool needs new LINE API behavior.
2. Register the MCP tool in the matching file under `src/tools/`.
3. Keep Zod schemas strict enough to reject malformed inputs before API calls.
4. Return MCP tool errors with `isError: true` and a user-readable text payload.
5. Add or update tests in `tests/tools/`.
6. Update `tests/integration/server.test.ts` when the tool list or required arguments change.
7. Update `README.md` when public setup, environment variables, or tool behavior changes.

When adding shared behavior, put it under `src/utils/` and cover it with focused unit tests under `tests/utils/`.

## Verification

Run these before opening a pull request:

```bash
npm run build
npm test
npm pack --dry-run
```

`npm run build` must complete without TypeScript errors. `npm test` must pass all Vitest suites. `npm pack --dry-run` should include `dist/`, `README.md`, `LICENSE`, and `package.json`.

## CI Expectations

GitHub Actions runs on pushes, pull requests to `main`, and manual dispatch. The workflow installs from `package-lock.json`, builds TypeScript, runs the test suite on supported Node versions, checks for critical production dependency advisories, and verifies the package contents after a build.

If CI fails, fix the failing check in the same branch. Avoid skipping tests or weakening schemas to make CI pass.

## Pull Request Checklist

Before requesting review, confirm:

- The branch is based on the current `main`.
- `npm run build` passes.
- `npm test` passes.
- Public behavior changes are documented in `README.md`.
- New or changed behavior has tests.
- No secrets, private IDs, generated coverage output, or local build artifacts are committed.

## Security Reports

Do not open public issues for vulnerabilities involving token leakage, account access, webhook payload exposure, or unsafe LINE API behavior. Follow the private reporting guidance in `SECURITY.md`.
