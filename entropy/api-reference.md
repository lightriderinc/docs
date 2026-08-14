# EMS API reference

Cloud base URL: `https://ems.lightriderinc.com`

Send an API key with each protected request:

```http
Authorization: Bearer lr_...
```

Entropy responses contain hex-encoded bytes in `bytes_hex` and a signed `receipt`.

## Official Python SDK

Install `lightrider`:

```bash
pip install lightrider
```

Import EMS types from the package root:

```python
from lightrider import EntropyClient, ExtractorMethod, Policy
```

Common methods:

- `get_bytes(length, policy=...)`: request 1 to 65,536 bytes.
- `get_bits(n_bits, ...)`: request enough bytes for the bit count.
- `get_seed(n_bytes=32, ...)`: request fresh seed material.
- `request_multi(length, method=..., sources=...)`: combine two or more named sources.
- `stream(policy=..., bytes_per_tick=...)`: iterate WebSocket responses.
- `fetch_verifier()`: fetch and pin the current receipt key.
- `list_sources()`: list available sources.
- `list_pools()`: inspect pool levels.

Each request returns an `EntropyResponse` with `bytes_` and `receipt`. Service errors and failed verification raise `SdkError`.

## Entropy endpoints

- `POST /v1/entropy/request`: policy-routed entropy.
- `POST /v1/entropy/multi`: multi-source extraction.
- `WS /v1/entropy/stream`: continuous entropy frames.
- `GET /v1/entropy/pools`: current pool levels.

## Verification endpoints

- `GET /v1/pubkey`: active signature algorithm and public key.
- `GET /v1/receipts/:request_id`: retrieve a receipt.
- `GET /v1/sources`: source summary.
- `GET /v1/sources/:id/quality`: live source quality.
- `GET /healthz`: service health.

## Public beacon

- `GET /v1/beacon`: beacon metadata.
- `GET /v1/beacon/latest`: latest signed pulse.
- `GET /v1/beacon/pulse/:pulse_index`: historical pulse.
- `WS /v1/beacon/stream`: live pulses.

Beacon output is public randomness. Do not use it as secret key material.

## Operator endpoints

These routes require operator access:

- `GET /api/v1/sources`: full source registry.
- `PATCH /api/v1/sources/:id`: update source state or budget.
- `GET /api/v1/pools`: pool registry.
- `GET`, `POST`, or `PATCH /api/v1/custom-pools`: dedicated pools.
- `GET /api/v1/receipts`: paginated receipt records.

## Errors

Errors use a non-2xx status and a JSON body with an `error` field. EMS does not silently downgrade a request. WebSocket streams send an error frame before closing.
