---
title: Python SDK
---

# Python SDK

The `lightrider` package on [PyPI](https://pypi.org/project/lightrider/) includes a client for the [developer API](/entropy/developer-api) under `lightrider.entropy`.

## Install

```bash
pip install -U lightrider
```

Python 3.9 or newer is required. Set your API key before use:

```bash
export LR_API_KEY="lr_live_YOUR_KEY"
```

## Draw entropy

```python
import lightrider as lr

r = lr.entropy.get(32, source="anu")
print(r.hex)          # the bytes, hex encoded
print(r.sources)      # sources that produced them
print(r.request_id)   # ID of this draw
```

Blend 2 to 8 sources into one draw:

```python
pool = lr.entropy.get(64, sources=["anu", "cisco"])
```

Each call returns 1 to 4096 bytes.

## Verify

```python
assert lr.entropy.verify(r.receipt)     # the receipt is genuine
assert lr.entropy.verify_commitment(r)  # these are the bytes it was issued for
```

See [Receipts and verification](/entropy/receipts) for what each check proves.

## Other functions

| Function | Description |
|---|---|
| `lr.entropy.sources()` | List the sources available right now, with their state and available bytes. |
| `lr.entropy.receipt(request_id)` | Fetch a receipt again. |
| `lr.entropy.seed(64)` | Return a 64-bit integer seed, for example for NumPy or PyTorch. |

## Configuration

| Environment variable | Description |
|---|---|
| `LR_API_KEY` | Your Light Rider API key. |
| `LR_ENTROPY_SOURCE` | Default source when none is given. |
| `LR_ENTROPY_PUBLIC_KEY` | Pin the receipt signing key instead of fetching it. |

The same settings can be passed to `lr.entropy.EntropyAPI(...)`.

## Errors

| Exception | Cause |
|---|---|
| `AuthenticationError` | Missing, invalid, or revoked API key. |
| `InsufficientCreditsError` | Not enough credits. `.buy_url` links to the purchase page. |
| `RateLimitError` | More than 60 requests per minute. `.retry_after` gives the wait in seconds. |
| `InvalidRequestError` | Invalid size or source name. |
| `SourceEmptyError` | The source's pool is empty. |
| `SourceUnavailableError` | The source is offline. |
| `ServiceUnavailableError` | The service is temporarily unavailable. |

Network errors and rate limits are retried automatically, and a retry never draws or charges twice. The SDK never falls back to another source or to local randomness.
