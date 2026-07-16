---
title: API reference
---

# API reference

Every public endpoint: entropy egress (/v1/*), the randomness beacon, and the admin registry (/api/v1/*).

## Conventions

-   The nginx edge exposes both surfaces on one origin: `/v1/*` → entropy egress, `/api/v1/*` → admin registry.
-   Bodies are JSON; entropy is returned hex-encoded as `bytes_hex` alongside a `receipt`.
-   Request size: 1 – 65,536 bytes per call.
-   With `EMS_API_KEYS` configured, all `/v1/*` routes require `Authorization: Bearer <key>`.

## Entropy egress (/v1)

| Endpoint | Purpose |
| --- | --- |
| POST /v1/entropy/request | Single-shot entropy, policy-routed. See [Quickstart](/entropy/quickstart). |
| POST /v1/entropy/multi | Multi-source extraction across named independent sources. See [Multi-source](/entropy/multi-source). |
| WS /v1/entropy/stream | Continuous streamed entropy. See [Streaming](/entropy/streaming). |
| GET /v1/pubkey | Active signature algorithm and public key. |
| GET /v1/sources | Registered source mirror (id + note). |
| GET /v1/sources/:id/quality | Live quality metrics for one source. |
| GET /v1/entropy/pools | Live tier-pool levels. |
| GET /v1/receipts/:request\_id | Re-fetch a previously issued receipt. |
| GET /v1/healthz | Liveness probe (returns "ok"). |

## Randomness beacon

The public beacon publishes signed, chained randomness pulses (ML-DSA-65 in production) for applications that need public, verifiable randomness rather than secret entropy.

| Endpoint | Purpose |
| --- | --- |
| GET /v1/beacon | Beacon metadata: cadence, signing algorithm, chain info. |
| GET /v1/beacon/latest | Most recent pulse. |
| GET /v1/beacon/pulse/:pulse\_index | Historical pulse by index. |
| WS /v1/beacon/stream | Pulses pushed as they are emitted. |

## Admin registry (/api/v1)

Operator surface backing the dashboard. The most commonly scripted routes manage sources and budgets (see [Sources & collectors](/entropy/sources-collectors)):

| Endpoint | Purpose |
| --- | --- |
| GET /api/v1/sources | Full source registry with status and quality. |
| GET /api/v1/sources/:id | One source. |
| PATCH /api/v1/sources/:id | Enable/disable, budget caps, metadata. |
| GET /api/v1/pools | Pool registry. |
| GET/POST/PATCH /api/v1/custom-pools | Dedicated customer pools with verification jobs. |
| GET /api/v1/receipts | Receipt store (paginated). |

## Errors

The platform fails closed: a request that cannot be served at the required quality is refused with a JSON `{"error": …}` body and a non-2xx status — never silently downgraded. Streaming sessions emit a final error frame, then close. Treat any unverifiable receipt as a failed request even if bytes were delivered.
