---
title: Applications
---

# Applications

The Applications page (`/applications`) hosts standalone demos that put quantum randomness and post-quantum cryptography to work, independent of the job-submission flow.

## True random dice roll

A dice roller powered by quantum entropy — every roll is drawn from certified quantum randomness rather than a classical pseudo-random generator.

## Secure password generator

Generates strong, unpredictable passwords using the same quantum-randomness source.

## Quantum Vault

Share secrets that stay safe even against future quantum computers. Quantum Vault generates a post-quantum key pair (a KEM key for encryption and an ML-DSA signing key) seeded from a certified entropy source you choose, then lets you encrypt a message for a recipient's public key, decrypt a message sent to you, and compare identities. Everything runs client-side — your secret key never leaves your browser.

## Quantum-Safe Signer

Sign any text with **ML-DSA-65** and let anyone independently verify it wasn't altered — no login needed. Signing produces a single copy/paste bundle (public key + signature) that a recipient can paste into the same tool's Verify tab to confirm the text is untampered.

::: tip No account required
Unlike the rest of the platform, the Quantum-Safe Signer works without signing in — it's designed to be usable by anyone you share a signed message with.
:::

## Next steps

- [Dashboard](/platform/dashboard) — the "Get Entropy" quick-start tile uses the same underlying entropy service as these demos.
- [Entropy Management System](/entropy/introduction) — how Light Rider's certified entropy is generated and attested.
