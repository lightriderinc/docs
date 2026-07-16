---
title: Streaming entropy
---

# Streaming entropy

Continuous receipt-attested delivery over WebSocket for dashboards and high-frequency consumers.

## Endpoint

`WS /v1/entropy/stream` upgrades to a WebSocket session that delivers entropy continuously — one frame roughly every 100 ms. Each frame is drawn through the same policy routing and DRBG path as a single-shot request, and each carries its own signed receipt.

## Query parameters

| Parameter | Required | Description |
| --- | --- | --- |
| policy | yes | Routing policy for every tick (see [Policies](/entropy/policies)). |
| bytes\_per\_tick | no | Bytes per frame, 1 – 4096. Default 64. |
| application\_id | no | Caller identifier recorded in each receipt. |

## Frame format

Every frame is a JSON text message with the same shape as a REST response. On an internal error (for example the required pool drains — the stream fails closed like every other interface), the server sends a final `{"error": …}` frame and closes the socket.

```json
{
  "bytes_hex": "9f2c41…",
  "receipt": { "request_id": "lr_req_…", "signature": "…", … }
}
```

## Example

```javascript
const ws = new WebSocket(
  'ws://localhost:8080/v1/entropy/stream?policy=highest_quality&bytes_per_tick=128'
);

ws.onmessage = (ev) => {
  const frame = JSON.parse(ev.data);
  if (frame.error) throw new Error(frame.error);   // stream failed closed
  consume(frame.bytes_hex, frame.receipt);
};
```
