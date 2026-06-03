---
content_type: audit_finding
region: noram
title: Audit Finding AF-2028-034 — Atlas Aura Default Credentials in Reference Deployment
---

# Audit Finding AF-2028-034 · Atlas Aura Default Credentials in Reference Deployment

**Auditor:** Atlas internal red team (NORAM)
**Audit cycle:** Q3 2028
**Status:** Closed
**Severity:** Critical
**Owner:** Aisha Okonkwo (Director of Customer Success — Aura product line)

## Finding

Atlas Aura ships with a reference building-automation control deployment used by Atlas Customer Services to reproduce customer scenarios. The reference deployment was provisioned in 2027 with a default administrator credential never rotated. Although the reference deployment is isolated and holds no customer data, the credential matched the documented default in Atlas Aura installer documentation, which is also the documentation customers receive.

The finding is a NIST 800-53 r5 IA-5 (Authenticator Management) deviation. The risk is that customers who follow the installer doc literally without rotating may be exposed.

## Affected customers

No production customer harm identified. Aura reference customers (Aisha Okonkwo's team verified) had all rotated credentials per the deployment guide; the audit revealed the installer doc was the weak link.

## Remediation

- Installer doc rewritten to force a non-default password on first boot (no allowed default).
- Aura installer binary updated to refuse the historic default value.
- Customer notification issued to all Aura customers with mitigation steps.
- Reference deployment rebuilt with new credential.

## Closure criteria

- Installer binary updated: Yes.
- Documentation updated: Yes.
- All Aura customers notified: Yes.
- Reference deployment rebuilt: Yes.

## Closed

2028-09-18 — Dr Sara Vance accepted closure with Aisha Okonkwo and Marcus Ortiz co-signing.

## Cross-references

- POL-SECBASE-v2.0
- POL-INCIDENT-v2.0 (no incident filed; preventative remediation prior to any customer exposure)
