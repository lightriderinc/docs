---
title: Receipts & verification
---

# Receipts & verification

Every response is signed — Ed25519 or post-quantum ML-DSA-65. Verify attestations independently.

## What a receipt attests

A receipt is a signed statement binding the delivered bytes' metadata: which sources contributed, which pool and extractor produced the output, the real-time quality score and health-test outcomes at generation time, and a nanosecond timestamp. The signature is computed over the canonicalized receipt (sorted keys, signature field removed, compact JSON), so any tampering invalidates it.

## Receipt fields

| Field | Meaning |
| --- | --- |
| request\_id | Unique id, also usable to re-fetch the receipt later. |
| policy / pool\_id | Requested policy and the tier pool that served it. |
| contributing\_sources | Every source that fed the output. |
| quality\_score | Real-time score from the streaming quality stage. |
| rct\_pass / apt\_pass | Repetition-count and adaptive-proportion health tests. |
| extractor\_alg / drbg\_alg | Conditioning extractor and output DRBG. |
| input\_min\_entropy\_bits | Assessed min-entropy of the raw input. |
| output\_bytes | Number of bytes delivered. |
| timestamp\_unix\_ns | Generation time (Unix nanoseconds). |
| raw\_entropy\_stored | Always false — raw entropy is never retained. |
| signature\_alg / signature | Ed25519 or ML-DSA-65 signature over the canonical form. |

## Signature keys

`GET /v1/pubkey` returns the active algorithm and public key. Production deployments sign with ML-DSA-65 (FIPS 204 post-quantum); Ed25519 is used in development. SDKs pin this key once (`fetch_verifier()` in Python, `verifierPublicKey` in JavaScript) and then verify every response.

## Verifying
::: code-group

```python [Python]
cli = EntropyClient("http://localhost:8080")
cli.fetch_verifier()                     # pin key; every call now auto-verifies

r = cli.get_bytes(32, policy=Policy.HIGHEST_QUALITY)
# r.bytes_ is only returned after the signature check passes.
```

``` javascript [JavaScript]
import { verifyReceipt, canonicalReceiptBytes } from '@lightrider/entropy';

const ok = await verifyReceipt(receipt, pinnedPublicKey);
if (!ok) throw new Error('receipt signature invalid');
```
:::

::: tip Note
The dashboard's [Receipts](http://93.127.215.63:8080/receipts) page performs the same verification in-browser: paste or select a receipt and it checks the signature against the pinned key.
:::

## Re-fetching & audit

Receipts are retrievable after the fact by request id via `GET /v1/receipts/:request_id`, so an auditor can confirm that a stored receipt matches what the platform issued. Each receipt also carries an `audit_event_id` linking it to the append-only audit trail.
