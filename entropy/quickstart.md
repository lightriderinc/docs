---
title: Quickstart
---

# Quickstart

Draw quantum entropy from your own code and verify its receipt.

## 1. Get an API key

Sign in at [entropy.lightriderinc.com/developers](https://entropy.lightriderinc.com/developers) and generate an API key. The full key is shown once, so copy it when it is created.

Your key is the same key used on Light Rider Cloud. It gives full access to your account, so keep it out of public code and repositories.

## 2. Set your API key

macOS / Linux:

```bash
export LR_API_KEY="lr_live_YOUR_KEY"
```

Windows PowerShell:

```powershell
$env:LR_API_KEY = "lr_live_YOUR_KEY"
```

Google Colab: add the key under **Secrets** with the name `LR_API_KEY`, enable notebook access, then load it:

```python
import os
from google.colab import userdata

os.environ["LR_API_KEY"] = userdata.get("LR_API_KEY")
```

## 3. Install the SDK

```bash
pip install -U lightrider
```

Python 3.9 or newer is required.

## 4. Draw and verify

```python
import lightrider as lr

r = lr.entropy.get(32, source="anu")    # 32 bytes from the ANU Quantum RNG
print(r.hex)
print(r.sources, r.request_id)

assert lr.entropy.verify(r.receipt)     # the receipt is genuine
assert lr.entropy.verify_commitment(r)  # these are the bytes it was issued for
```

## Using curl instead

```bash
curl -s https://entropy.lightriderinc.com/api/v1/entropy \
  -H "Authorization: Bearer $LR_API_KEY" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $(uuidgen)" \
  -d '{"bytes": 32, "mode": "source", "id": "anu"}'
```

The response contains the bytes as `bytes_hex` and the signed `receipt`.

## Cost

Each draw costs 1 credit ($0.01) per 256 bytes, with a minimum of 1 credit. A draw that fails is not charged. Credits can be purchased from the Entropy platform.

## Next steps

- [Python SDK](/entropy/python-sdk)
- [Developer API](/entropy/developer-api)
- [Receipts and verification](/entropy/receipts)
