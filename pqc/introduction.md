---
title: What is Light Rider PQC?
---

# What is Light Rider PQC?

Light Rider PQC — the Veloce SDK — discovers where an organization's cryptography is vulnerable to a quantum computer, and provides FIPS-validated classical cryptography alongside NIST post-quantum algorithms to replace it.

## Two products, one SDK

- **qSearch** — a discovery tool that scans source code, dependencies, certificates, and running systems to identify quantum-vulnerable cryptographic assets, and generates reports including a CBOM (cryptographic bill of materials) in multiple formats. See [Cryptographic discovery](/pqc/discovery).
- **Crypto core** — a local agent running the wolfCrypt FIPS 140-3 module (certificate #4718) with ML-KEM-768 and ML-DSA-65 support, accessible from a Python SDK and a CLI. See [SDK & CLI reference](/pqc/sdk-reference).

## Key design points

- **Zero-network-traffic guarantee.** With optional EMS cloud connectivity disabled, nothing leaves the host — discovery scans and cryptographic operations run entirely locally.
- **Key custody stays in the agent.** The Python SDK contains no cryptographic code. Every operation executes inside the local Veloce agent over an authenticated local IPC channel; private keys never leave the agent, and the SDK only ever holds opaque handles to them.
- **Classical and post-quantum side by side.** ML-KEM-768 (key encapsulation) and ML-DSA-65 (signatures) are provided beside the FIPS boundary, alongside the FIPS 140-3-validated classical algorithms and DRBG in the same agent.
- **Fail-closed randomness.** The FIPS module is built against a wolfEntropy-backed seed source with no fallback — if a validated entropy source isn't available, key generation and signing fail rather than silently degrading.

## Access and licensing

The current release is publicly downloadable and free under the Light Rider Inc license — no subscription required for this release. Publicly downloadable does not mean OSI open source: wolfSSL source and headers are never shipped, only compiled object code under the commercial agreement. Future managed services may require a paid subscription.

## Next steps

- [Quickstart](/pqc/quickstart) — build the agent, run it, and make your first ML-KEM and ML-DSA calls.
- [Cryptographic discovery](/pqc/discovery) — scan a codebase or host and produce a CBOM.
- [SDK & CLI reference](/pqc/sdk-reference) — the full Python SDK and command-line surface.
- [U.S. Quantum Policy](/pqc/policy) — the federal directives this SDK helps you comply with.
