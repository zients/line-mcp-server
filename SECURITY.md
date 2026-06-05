# Security Policy

This project wraps the LINE Messaging API as an MCP server. Treat LINE credentials, user identifiers, and webhook payloads as sensitive operational data.

## Supported Versions

Security fixes are provided for the latest published version of `@zients/line-mcp-server`.

| Version | Supported |
|---------|-----------|
| Latest release | Yes |
| Older releases | No |

## Reporting a Vulnerability

Do not report token leaks, account access issues, private user IDs, webhook payloads, or exploitable API behavior in a public issue.

Use GitHub private vulnerability reporting or GitHub Security Advisories for this repository. Include enough detail to reproduce the issue without including live credentials or private LINE data.

If private reporting is not available, open a public issue with only a minimal description and ask for a private reporting channel. Do not include secrets, tokens, private user IDs, group IDs, room IDs, webhook payloads, logs containing personal data, or account screenshots.

## Secrets and Sensitive Values

The following values must not be committed, pasted into public issues, or included in logs:

- `CHANNEL_ACCESS_TOKEN`
- LINE long-lived or short-lived channel access tokens
- LINE webhook secrets or signature validation secrets, if added in the future
- Real `DEFAULT_UID` values from private accounts
- Real group IDs, room IDs, and user IDs from private chats
- Webhook payloads that include message contents or profile data

`DEFAULT_UID` is not an API credential, but it is still a private LINE User ID. Treat it as personal data.

## Local Configuration

Use environment variables or your MCP client's secret storage for credentials. Do not store real credentials in committed files.

This repository intentionally ignores local environment files:

```text
.env
.env.*
```

Only `.env.example` should be committed, and it must contain placeholder values.

## If a LINE Token Leaks

If a real LINE channel access token is exposed:

1. Revoke or reissue the token in the LINE Developers Console.
2. Update every MCP client, deployment, CI secret, or local environment that used the old token.
3. Remove the token from the affected file, log, artifact, or package.
4. If the token was committed to git history, assume it is compromised even after deletion.
5. Review recent LINE Official Account activity and message delivery logs.
6. Avoid publishing the leaked token again in the incident discussion.

## Dependency Security

CI runs an npm audit gate for critical production advisories and reports moderate/high advisories for review. Dependency updates should keep `package-lock.json` committed and should be verified with:

```bash
npm ci
npm run build
npm test
npm pack --dry-run
```

## Scope

Please report issues in this package, its MCP tool behavior, or unsafe handling of LINE credentials. Vulnerabilities in LINE's platform or the LINE Messaging API should also be reported to LINE through their official security process.
