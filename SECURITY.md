# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| latest  | ✅                 |

## Reporting a Vulnerability

If you discover a security vulnerability in HealthCopilot AI, **please do not open a public GitHub issue**.

Instead, report it privately:

1. **Email**: Open a [GitHub Security Advisory](https://github.com/ashutoshpatraa/healthcopilot-ai/security/advisories/new) on the repository.
2. Include a description of the vulnerability, steps to reproduce it, and its potential impact.
3. You will receive a response within **72 hours**.

## Security Practices

- All secrets and API keys must be stored in `.env` files (never committed to git).
- The `.env` file is listed in `.gitignore` — always verify this before pushing.
- The application uses JWT-based authentication for protected routes.
- All user inputs are validated via Pydantic models with strict length limits.
- File uploads are restricted to a maximum of **50MB** to prevent DoS attacks.
- Database credentials and the `SECRET_KEY` must be rotated for production deployments.

## Environment Setup

Copy `.env.example` to `.env` and fill in your own credentials:

```bash
cp backend/.env.example backend/.env
```

**Never share your `.env` file or commit it to version control.**
