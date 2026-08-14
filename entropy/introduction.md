# What is Light Rider EMS?

Light Rider EMS is a cloud service for cryptographic-grade entropy from independent quantum and classical sources. Every response includes the random bytes and a signed receipt.

Cloud endpoint: `https://ems.lightriderinc.com`

## What it provides

- Policy-based access to quantum-verified, high-quality, and low-latency entropy.
- Health testing and conditioning before entropy reaches a serving pool.
- Signed receipts that record source, quality, extractor, and health metadata.
- Multi-source extraction for applications that need independent contributors.
- REST and WebSocket APIs through one cloud endpoint.

## How a request works

1. Collectors read enabled entropy sources.
2. Health and quality checks reject failing input.
3. Extractors condition accepted input.
4. Conditioned entropy enters a policy pool.
5. EMS serves the requested bytes and signs a receipt.

EMS fails closed. It does not silently replace a required quality tier with weaker entropy.

## Use the official SDK

The official Python package is `lightrider`. EMS classes are available from the package root and `lightrider.entropy`.

```python
from lightrider import EntropyClient, Policy

with EntropyClient("https://ems.lightriderinc.com", api_key="lr_...") as client:
    client.fetch_verifier()
    response = client.get_bytes(32, policy=Policy.QUANTUM_VERIFIED)
    print(response.bytes_.hex())
```

Continue with the [Quickstart](/entropy/quickstart) or review the [API reference](/entropy/api-reference).
