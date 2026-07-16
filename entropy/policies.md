---
title: Policies
---

# Policies

Route each request to a quality tier — Bell-test verified, vetted QRNG, or lowest latency.

## How routing works

A policy names the guarantee you need, not a specific source. The egress maps the policy to a quality-tier pool, draws conditioned entropy from it through a per-request HMAC-DRBG, and records the policy plus the actual contributing sources in the [receipt](/entropy/receipts).

## Policy reference

| Policy | Selection |
| --- | --- |
| quantum\_verified | Bell-test / own QRNG only |
| highest\_quality | best vetted QRNG mix |
| fastest\_available | lowest latency |
| cost\_optimized | cheapest acceptable |
| hybrid\_mix | blend across tiers |
| failover | primary with fallback |
| local\_only | hardware seed, no network |
| demo\_mode | deterministic demo |
| qispace\_native | route via QiSpace TQRND |

## Fail-closed behavior

::: warning Important
If the pool a policy requires is unavailable or under-filled, the egress refuses the request rather than substituting unverified entropy. Design clients to handle the error (retry, or fall back to an explicitly weaker policy) — the platform will not downgrade silently.
:::

## Choosing a policy

-   `quantum_verified` — key generation and any use where provenance matters most; served only from Bell-test / first-party QRNG sources.
-   `highest_quality` — the default for cryptographic use; best vetted QRNG mix.
-   `fastest_available` / `cost_optimized` — bulk or latency-sensitive workloads where tier provenance is secondary.
-   `local_only` — air-gapped operation from local hardware seeds; no network sources.
-   `failover` / `hybrid_mix` — availability-first blends across tiers.

`demo_mode` returns deterministic output and exists for integration testing only — never use it for keys.
