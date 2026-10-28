---
title: Receipts and verification
---

# Receipts and verification

Every draw returns a receipt signed by Light Rider. The receipt records which source produced the bytes, how many bytes were drawn, and when.

## What a receipt contains

| Field | Description |
|---|---|
| `request_id` | ID of the draw. |
| `contributing_sources` | Full IDs of the sources that produced the bytes. |
| `output_bytes` | Number of bytes delivered. |
| `output_commitment` | Salted SHA-256 hash of the delivered bytes. |
| `timestamp_unix_ns` | Time of the draw, in nanoseconds since the Unix epoch. |
| `extractor_alg` | Extraction algorithm applied to the source input. |
| `quality_score` | Result of the health and quality checks. |
| `signature_alg` | Signature algorithm (`Ed25519`). |
| `signature` | Signature over the receipt. |

A receipt never contains the drawn bytes.

## Verify with the SDK

```python
import lightrider as lr

r = lr.entropy.get(32, source="anu")

assert lr.entropy.verify(r.receipt)
assert lr.entropy.verify_commitment(r)
```

You can also verify any receipt on your account from the **Receipts** page of the [Entropy platform](https://entropy.lightriderinc.com).

## Verify manually

### Check the signature

1. Get the public key from `GET https://entropy.lightriderinc.com/api/v1/public-key`. No API key is needed. The response contains `signature_alg`, `public_key_hex`, and `fingerprint_sha256`.
2. Remove the `signature` field from the receipt.
3. Serialize the remaining fields as compact JSON with keys sorted.
4. Verify the Ed25519 `signature` over those bytes with the public key.

Parse the receipt in a way that preserves numbers exactly. `timestamp_unix_ns` exceeds the safe integer range in JavaScript, and a rounded value will cause verification to fail.

### Check the bytes

The draw response includes `commitment_salt`. The bytes match the receipt when:

```text
sha256(commitment_salt || bytes) == receipt.output_commitment
```

This prevents a valid receipt from being presented with different bytes. Light Rider stores neither the bytes nor the salt, so keep both if you need to prove this later.

## What a receipt does not show

A receipt proves that a specific draw took place and which bytes it produced. It cannot show how many draws someone made before choosing one to publish. The timestamp shows when the draw happened.
