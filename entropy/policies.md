# Entropy policies

A policy selects a quality guarantee. EMS records the chosen pool and actual contributors in the signed receipt.

## Common policies

- `quantum_verified`: quantum sources with the strongest provenance.
- `highest_quality`: the best vetted QRNG mix and the SDK default.
- `fastest_available`: the lowest-latency eligible pool.
- `cost_optimized`: the least expensive eligible pool.

## Specialized policies

- `hybrid_mix`: blend across tiers.
- `failover`: use an explicitly configured fallback.
- `local_only`: use local hardware with no network source.
- `qispace_native`: route through QiSpace TQRND.
- `demo_mode`: deterministic integration testing only.

## Example

```python
from lightrider import EntropyClient, Policy

with EntropyClient("https://ems.lightriderinc.com", api_key="lr_...") as client:
    client.fetch_verifier()
    response = client.get_bytes(32, policy=Policy.QUANTUM_VERIFIED)
```

If the required pool is unavailable, EMS refuses the request. Choose a weaker fallback in application code only when your security policy permits it.
