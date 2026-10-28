---
title: What is Light Rider Entropy?
---

# What is Light Rider Entropy?

Light Rider Entropy provides random bytes drawn from named quantum sources. Every draw comes with a receipt signed by Light Rider that records which source produced the bytes and when.

## What is available

| Product | Description |
|---|---|
| [Entropy platform](/entropy/platform) | Web application at [entropy.lightriderinc.com](https://entropy.lightriderinc.com) for drawing entropy, browsing sources, and reviewing receipts. |
| [Developer API](/entropy/developer-api) | REST API for drawing entropy from your own code with your Light Rider API key. Draws are charged to your credits. |
| [Python SDK](/entropy/python-sdk) | The `lightrider` package on PyPI. Draw and verify entropy in one line of Python. |
| [Demo Space](/entropy/hugging-face) | A Hugging Face Space where anyone can pick a source, generate bytes, and inspect the verified receipt. |
| [Provable datasets](/entropy/datasets) | The `lightrider-huggingface` package on PyPI. Builds Hugging Face datasets from a quantum seed that anyone can verify and regenerate. |

## Sources

Entropy is drawn from six sources:

- ANU Quantum RNG
- Cisco Outshift QRNG
- QiSpace TQRND
- IQM Resonance
- Light Rider QEC (IQM)
- Rigetti Cepheus-1-108Q

See [Sources](/entropy/sources) for details.

## How a draw works

1. **Collect.** Raw bits are collected from quantum sources.
2. **Test.** Each batch passes NIST SP 800-90B health checks before it is stored.
3. **Extract.** Accepted input is conditioned with SHAKE-256.
4. **Deliver.** You receive the bytes and a signed receipt for the draw.

A draw never substitutes one source for another. If the source you request cannot serve, the request fails and you are not charged.

## Receipts

Each receipt is signed with Ed25519 and includes a salted hash of the exact bytes delivered. This lets you confirm two things:

- The receipt was issued by Light Rider and has not been altered.
- The bytes you hold are the bytes the receipt was issued for.

See [Receipts and verification](/entropy/receipts).

## Next steps

- [Quickstart](/entropy/quickstart): draw and verify your first bytes.
- [Developer API](/entropy/developer-api): endpoints, limits, and errors.
