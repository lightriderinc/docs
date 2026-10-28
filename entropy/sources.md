---
title: Sources
---

# Sources

Light Rider Entropy draws from the following quantum sources. In the developer API and SDK, a source can be named by its short name or its full ID. Receipts always record the full ID.

| Source | Type | Short name | Full ID |
|---|---|---|---|
| ANU Quantum RNG | QRNG | `anu` | `anu_aws_001` |
| Cisco Outshift QRNG | QRNG | `cisco` | `cisco_qrng_001` |
| QiSpace TQRND | QRNG | `qispace` | `qispace_kds_001` |
| IQM Resonance | QPU | `iqm` | `iqm_resonance_001` |
| Light Rider QEC (IQM) | QPU | `iqm-qec` | `lightrider_qec_001` |
| Rigetti Cepheus-1-108Q | QPU | `rigetti` | `rigetti_cepheus_001` |

- **QRNG** sources are dedicated quantum random number generators.
- **QPU** sources are quantum processors. Light Rider QEC draws from IQM hardware with quantum error correction applied through the Light Rider SDK.

## Availability

Each source has its own pool of tested entropy. A source can be temporarily empty while its pool refills. To see what is available right now:

- Open the **Sources** page on the [Entropy platform](https://entropy.lightriderinc.com).
- Call `GET /api/v1/sources` in the [developer API](/entropy/developer-api#list-sources).
- Call `lr.entropy.sources()` in the [Python SDK](/entropy/python-sdk).

If a requested source cannot serve a draw, the request fails. Another source is never used in its place.
