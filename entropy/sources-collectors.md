---
title: Sources & collectors
---

# Sources & collectors

The source catalog, enable/disable semantics, budget caps for metered lanes, and auto-disable.

## How collection works

Each registered source has a dedicated collector that continuously pumps verified entropy into its tier pool — but only while the source is enabled. Disabling a source stops its collector within one poll cycle (fail-closed). Paid, metered lanes such as the IQM QPU are demand-driven and byte-capped rather than free-running.

## Source catalog

| Source ID | Provider | Kind | Tier |
| --- | --- | --- | --- |
| iqm\_resonance\_001 | IQM Resonance QPU | QPU | Quantum verified · metered |
| curby\_q\_jila\_001 | CURBy-Q · Bell-test (JILA) | QPU | Quantum verified |
| ql\_lab\_001 | Quantum Light (USB) | QRNG | Quantum verified |
| anu\_aws\_001 | ANU QRNG (API key) | QRNG | Highest quality |
| qispace\_kds\_001 | QiSpace tQRND (enterprise node) | QRNG | Highest quality |
| curby\_rng\_jila\_001 | CURBy-RNG (JILA) | QRNG | Highest quality |
| nist\_beacon\_001 | NIST Beacon v2 | Beacon | Highest quality · diffusion-only |
| rdseed\_local\_001 | x86 RDSEED + Jitter | Hardware | Fastest |

::: tip Note
Diffusion-only feeds (public beacons) are credited zero secret entropy in [multi-source extraction](/entropy/multi-source); metered sources surface budget controls in the dashboard and the API.
:::

## Enabling & disabling

Toggle a source from the [Collectors](http://93.127.215.63:8080/collectors) page or via the admin API:

```bash
# disable a source (its collector pauses within one poll)
curl -X PATCH http://localhost:8080/api/v1/sources/iqm_resonance_001 \
  -H 'content-type: application/json' \
  -d '{"enabled": false}'
```

## Budget caps

Cap a metered source's spend by limiting the bytes its collector may draw:

```bash
curl -X PATCH http://localhost:8080/api/v1/sources/iqm_resonance_001 \
  -H 'content-type: application/json' \
  -d '{"budget_cap_bytes": 1048576}'
```

## Auto-disable

::: warning Important
A collector whose upstream API returns forbidden or quota-exhausted disables itself and reports the reason on the [Collectors](http://93.127.215.63:8080/collectors) page. Fix the upstream credential or quota, then re-enable the source explicitly — it will not re-enable itself.
:::
