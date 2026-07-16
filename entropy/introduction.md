---
title: What is Light Rider EMS?
---

# What is Light Rider EMS?

The Entropy Management System: aggregated quantum randomness, a streaming verification pipeline, and attested delivery.

## Overview

Light Rider EMS aggregates many independent quantum and classical randomness sources — QPUs, vetted QRNG services, public beacons, and local hardware — and serves cryptographic-grade entropy with a signed receipt attached to every response. Consumers never talk to an individual source; they request bytes against a [policy](/entropy/policies) and receive attested output from the matching quality tier.

## Architecture

Collected entropy flows through a streaming pipeline before it can be served:

-   Collect — one collector per source continuously pulls raw output while the source is enabled (see [Sources & collectors](/entropy/sources-collectors)).
-   Verify → health → quality — statistical health tests (repetition-count, adaptive-proportion) and real-time quality scoring run on the stream; failing input is discarded.
-   Extract — randomness extractors condition the verified stream into full-entropy output.
-   Pool — conditioned entropy lands in shared-memory tier pools (quantum-verified, highest-quality, fastest).
-   Serve — the egress answers requests from the required pool through an HMAC-DRBG, signs a receipt, and returns both.

## Trust model

-   Fail-closed. If the pool a policy requires is unavailable, the request is refused. Unverified entropy is never silently substituted.
-   Attested. Every response carries a receipt signed with Ed25519 or ML-DSA-65 (post-quantum) covering the request id, contributing sources, quality score, and health-test outcomes. See [Receipts & verification](/entropy/receipts).
-   No retention. Raw entropy is never stored; receipts record metadata only (`raw_entropy_stored: false`).
-   Independence over trust. Multi-source extraction keeps output uniform even if all but one contributing source is biased or compromised. See [Multi-source extraction](/entropy/multi-source).

## Interfaces

The SDK is the intended consumer interface — it pins the server key and verifies every receipt before returning bytes. Python (`lr_entropy`), JavaScript/TypeScript (`@lightrider/entropy`), and Rust (`lr-entropy`) clients expose equivalent APIs. Underneath, entropy is served over REST (`/v1/*`), WebSocket streaming, and QUIC; the operator dashboard and source registry are served under `/api/v1/*`. The full surface is listed in the [API reference](/entropy/api-reference).

## Next steps

-   [Quickstart](/entropy/quickstart) — install an SDK and request your first attested bytes.
-   [Policies](/entropy/policies) — choose the quality tier your application needs.
-   [Receipts & verification](/entropy/receipts) — understand and independently verify attestations.
