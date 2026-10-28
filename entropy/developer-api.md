---
title: Developer API
---

# Developer API

The developer API lets you draw quantum entropy from your own code. Draws are charged to your Light Rider credits, and every draw returns a signed receipt.

Base URL: `https://entropy.lightriderinc.com/api/v1`

For Python, the [SDK](/entropy/python-sdk) wraps this API and handles retries and verification.

## Authentication

Send your Light Rider API key as a bearer token:

```http
Authorization: Bearer lr_live_...
```

Create a key on the [Developers page](https://entropy.lightriderinc.com/developers). See the [Quickstart](/entropy/quickstart#_1-get-an-api-key).

## Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/sources` | API key | Sources available right now, with limits and pricing. |
| `POST` | `/entropy` | API key | Draw entropy from one source or a custom pool. |
| `GET` | `/receipts/{request_id}` | API key | Fetch one of your receipts. |
| `GET` | `/public-key` | None | The public key that signs receipts. |

## List sources

```bash
curl -s https://entropy.lightriderinc.com/api/v1/sources \
  -H "Authorization: Bearer $LR_API_KEY"
```

The response lists each available source with its `id`, `alias`, `name`, `type`, `state` (`ready` or `empty`), `bytes_available`, and whether it can join a custom pool. It also returns the current request limits and price.

## Draw entropy

`POST /entropy` supports two modes.

**Single source:** bytes from one named source.

```json
{ "bytes": 32, "mode": "source", "id": "anu" }
```

**Custom pool:** bytes blended from 2 to 8 sources.

```json
{ "bytes": 64, "mode": "custom", "ids": ["anu", "cisco"] }
```

Sources can be named by short name (`anu`) or full ID (`anu_aws_001`). See [Sources](/entropy/sources).

### Example

```bash
curl -s https://entropy.lightriderinc.com/api/v1/entropy \
  -H "Authorization: Bearer $LR_API_KEY" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $(uuidgen)" \
  -d '{"bytes": 32, "mode": "source", "id": "anu"}'
```

PowerShell:

```powershell
$headers = @{ Authorization = "Bearer $env:LR_API_KEY"; "Idempotency-Key" = [guid]::NewGuid().ToString() }
$body = @{ bytes = 32; mode = "source"; id = "anu" } | ConvertTo-Json
$r = Invoke-RestMethod -Method Post -Uri https://entropy.lightriderinc.com/api/v1/entropy -Headers $headers -ContentType "application/json" -Body $body
$r.bytes_hex
```

### Response

```json
{
  "request_id": "...",
  "bytes": 32,
  "bytes_hex": "...",
  "commitment_salt": "...",
  "billing": { "cost_tokens": 1, "balance_tokens": 499 },
  "receipt": { ... }
}
```

| Field | Description |
|---|---|
| `request_id` | ID of the draw. Use it to fetch the receipt later. |
| `bytes_hex` | The drawn bytes, hex encoded. |
| `commitment_salt` | Salt used to check the bytes against the receipt. See [Receipts and verification](/entropy/receipts#check-the-bytes). |
| `billing` | Credits charged for this draw and your remaining balance. |
| `receipt` | The signed receipt, exactly as Light Rider signed it. |

The bytes and the salt are returned once and are not stored. Keep them if you need to prove which bytes a receipt covers.

## Idempotency

Send an `Idempotency-Key` header (1 to 200 printable characters) to retry a request safely. A repeated key never draws or charges twice. Instead, it returns `409 already_processed` with the original receipt. Use a new key for each new draw.

## Limits

| Limit | Value |
|---|---|
| Bytes per request | 1 to 4096 |
| Sources in a custom pool | 2 to 8 |
| Requests per minute | 60 per API key |
| Price | 1 credit ($0.01) per 256 bytes, minimum 1 credit |

## Errors

Errors return a non-2xx status and a JSON body with a stable `error` code and a readable `message`.

| Status | Code | Meaning |
|---|---|---|
| 400 | `invalid_request` | Invalid body, size, mode, or source name. |
| 401 | `invalid_api_key` | Missing, invalid, or revoked key. |
| 402 | `insufficient_credits` | Not enough credits. The body includes `buy_url`. |
| 404 | `not_found` | No such receipt on your account. |
| 409 | `already_processed` | The `Idempotency-Key` was already used. |
| 429 | `rate_limited` | Too many requests. Wait for the `Retry-After` header. |
| 502 | `upstream_unavailable` | The entropy service could not be reached. |
| 503 | `source_empty` | The source's pool is empty. Try again later or use another source. |
| 503 | `source_unavailable` | The source is offline. |

A failed draw is not charged. The API never substitutes another source for the one you requested.
