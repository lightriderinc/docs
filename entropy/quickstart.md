---
title: Quickstart
---

# Quickstart

Install an SDK and request your first receipt-attested entropy in a few minutes.

## Prerequisites

A reachable EMS deployment. Examples below use `http://localhost:8080` — the nginx edge, which routes `/v1/*` to the entropy egress and `/api/v1/*` to the admin registry. SDKs may also connect to the egress directly (default `http://localhost:7081`).

## Step 1: Install an SDK

::: code-group

```python [Python]
pip install -e sdk-python/
```
```javascript [JavaScript]
npm install @lightrider/entropy
```
```rust [Rust]
cargo add lr-entropy
```

:::
## Step 2: Request entropy

Request 32 bytes against the `quantum_verified` policy. The SDK pins the server's public key and automatically verifies the receipt attached to the response.

::: code-group

```python [Python]
from lr_entropy import EntropyClient, Policy

cli = EntropyClient("http://localhost:8080")
cli.fetch_verifier()          # pin server key; receipts auto-verify from here

r = cli.get_bytes(32, policy=Policy.QUANTUM_VERIFIED)
print(r.bytes_.hex())
print(r.receipt.quality_score, r.receipt.contributing_sources)
```

```javascript [JavaScript]
import { EntropyClient, Policy } from '@lightrider/entropy';

const cli = new EntropyClient({ endpoint: 'http://localhost:8080' });

const { bytes, receipt } = await cli.getBytes(32, {
  policy: Policy.QuantumVerified,
});
console.log(Buffer.from(bytes).toString('hex'));
console.log(receipt.quality_score, receipt.contributing_sources);
```

```curl [Curl]
curl -X POST http://localhost:8080/v1/entropy/request \
  -H 'content-type: application/json' \
  -d '{"bytes": 32, "policy": "quantum_verified"}'
```

:::
## Step 3: Verify the receipt

Each response carries a signed receipt. SDK clients verify it before returning bytes — a tampered or unsigned response raises an error instead of yielding output. To verify independently, fetch the active public key from `GET /v1/pubkey` and check the signature over the canonicalized receipt (details in [Receipts & verification](/entropy/receipts)).
::: code-group

```python [Python]
r = cli.get_bytes(32, policy=Policy.HIGHEST_QUALITY)

# Already verified by the client; inspect the attestation:
r.receipt.signature_alg          # "Ed25519" or "ML-DSA-65"
r.receipt.quality_score          # real-time score from the quality stage
r.receipt.rct_pass, r.receipt.apt_pass   # health-test outcomes
```
```javascript [JavaScript]
import { EntropyClient, verifyReceipt } from '@lightrider/entropy';

const res = await fetch('http://localhost:8080/v1/pubkey');
const { public_key_hex } = await res.json();
const pubkey = Uint8Array.from(Buffer.from(public_key_hex, 'hex'));

const cli = new EntropyClient({
  endpoint: 'http://localhost:8080',
  verifierPublicKey: pubkey,     // receipts now verify on every call
});
const { receipt } = await cli.getBytes(32);
console.log(await verifyReceipt(receipt, pubkey)); // true
```

:::
## Limits & authentication

-   Request size: 1 – 65,536 bytes per call.
-   When the deployment sets `EMS_API_KEYS`, every `/v1/*` call must carry `Authorization: Bearer <key>`. SDKs accept the key via constructor option or the `LR_EMS_API_KEY` environment variable.

## Next steps

-   [Policies](/entropy/policies) — route requests to the right quality tier.
-   [Multi-source extraction](/entropy/multi-source) — combine independent sources.
-   [Streaming](/entropy/streaming) — continuous delivery over WebSocket.
