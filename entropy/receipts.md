# Receipts and verification

Every entropy response includes a signed receipt. It binds the request to its policy, sources, quality checks, extractor, output size, and timestamp.

## Important fields

- Identity: `request_id`, `application_id`, `audit_event_id`.
- Routing: `policy`, `pool_id`, `contributing_sources`.
- Quality: `quality_score`, `rct_pass`, `apt_pass`.
- Processing: `extractor_alg`, `drbg_alg`, `input_min_entropy_bits`.
- Output: `output_bytes`, `timestamp_unix_ns`.
- Signature: `signature_alg`, `signature`.
- Retention: `raw_entropy_stored` is always `false`.

## Verify with Python

```python
from lightrider import EntropyClient, Policy

with EntropyClient("https://ems.lightriderinc.com", api_key="lr_...") as client:
    client.fetch_verifier()
    response = client.get_bytes(32, policy=Policy.HIGHEST_QUALITY)

print(response.receipt.signature_alg)
```

After `fetch_verifier()`, the SDK raises `SdkError` instead of returning bytes when verification fails.

For stronger trust, provision the expected production public key out of band instead of trusting the first key fetched from `/v1/pubkey`.

## Audit a receipt

Retrieve a stored receipt with:

```text
GET https://ems.lightriderinc.com/v1/receipts/:request_id
```

You can also inspect receipts from the [EMS receipts page](https://ems.lightriderinc.com/receipts).
