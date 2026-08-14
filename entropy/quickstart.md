# EMS quickstart

Request signed entropy from the Light Rider cloud in a few minutes.

## 1. Get an API key

Create or copy an API key from the [EMS account page](https://ems.lightriderinc.com/account). Keep it private.

## 2. Install the official Python SDK

```bash
pip install lightrider
```

Python 3.9 or newer is required.

## 3. Configure the cloud client

```bash
export LR_EMS_ENDPOINT="https://ems.lightriderinc.com"
export LR_EMS_API_KEY="lr_..."
```

```python
from lightrider import EntropyClient, Policy

with EntropyClient() as client:
    client.fetch_verifier()
    response = client.get_bytes(32, policy=Policy.QUANTUM_VERIFIED)

print(response.bytes_.hex())
print(response.receipt.quality_score)
print(response.receipt.contributing_sources)
```

`fetch_verifier()` pins the active signing key. Later calls reject invalid receipts before returning bytes.

## REST example

```bash
curl -X POST https://ems.lightriderinc.com/v1/entropy/request \
  -H "Authorization: Bearer $LR_EMS_API_KEY" \
  -H "content-type: application/json" \
  -d '{"bytes":32,"policy":"quantum_verified"}'
```

The response contains `bytes_hex` and a signed `receipt`.

## Limits

- Request size: 1 to 65,536 bytes.
- Authentication: `Authorization: Bearer <key>`.
- Default policy: `highest_quality`.

Next: [Policies](/entropy/policies), [Multi-source extraction](/entropy/multi-source), and [Receipts](/entropy/receipts).
