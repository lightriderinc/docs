# Sources and collectors

Collectors continuously feed enabled sources into quality-tier pools. Disabling a source stops collection within one poll cycle.

## Source groups

- Quantum verified: IQM Resonance, CURBy-Q, and Quantum Light hardware.
- Highest quality: ANU QRNG, QiSpace TQRND, CURBy-RNG, and the NIST beacon.
- Fastest: local RDSEED and jitter entropy.

The NIST beacon is diffusion-only. It adds public randomness but no secret entropy. Metered sources such as IQM are demand-driven and byte-capped.

## Manage a source

Use the [Collectors page](https://ems.lightriderinc.com/collectors) or the operator API:

```bash
curl -X PATCH https://ems.lightriderinc.com/api/v1/sources/iqm_resonance_001 \
  -H "Authorization: Bearer $LR_EMS_API_KEY" \
  -H "content-type: application/json" \
  -d '{"enabled":false}'
```

Set a byte budget with the same endpoint:

```json
{"budget_cap_bytes":1048576}
```

A source disables itself after an upstream permission or quota failure. Fix the credential or quota, then re-enable it explicitly.
