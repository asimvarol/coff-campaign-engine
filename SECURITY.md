# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to: security@coff.app

You should receive a response within 48 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

Please include the following information:

- Type of issue (e.g., buffer overflow, SQL injection, XSS)
- Full paths of source file(s) related to the issue
- Location of the affected source code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue

## Security Measures

### Current Protections

- ✅ Security headers (CSP, X-Frame-Options, etc.)
- ✅ NextAuth authentication
- ✅ Input validation
- ✅ TypeScript strict mode
- ✅ No hardcoded secrets
- ✅ Environment variable validation
- ✅ HTTPS enforcement (production)

### Vulnerability Scan Results

Latest scan: 2026-03-02

```
Total vulnerabilities: 2
- Critical: 0
- High: 0
- Medium: 0
- Low: 2 (acceptable)
```

Low vulnerabilities:
1. `tmp` package (dev dependency only)
2. `cookie` package (NextAuth dependency - monitored)

### Best Practices

- Keep dependencies up to date
- Run `bun audit` before deployment
- Use strong NEXTAUTH_SECRET in production
- Enable HTTPS only
- Implement rate limiting
- Use CAPTCHA on public forms
- Regular security audits

### Responsible Disclosure

We follow a responsible disclosure policy:

1. Report received → acknowledged within 48h
2. Issue verified → timeline agreed
3. Fix developed → tested
4. Security advisory published
5. Public disclosure → after patch release

## Security Contact

- Email: security@coff.app
- GPG Key: [Not configured yet]

