# Streaming entropy

Use the WebSocket endpoint for continuous, receipt-attested entropy.

Endpoint: `wss://ems.lightriderinc.com/v1/entropy/stream`

## Query parameters

- `policy`: required routing policy.
- `bytes_per_tick`: 1 to 4,096 bytes, default 64.
- `application_id`: optional caller identifier.

Each JSON frame contains `bytes_hex` and `receipt`. If EMS cannot serve the required quality, it sends an error frame and closes the connection.

```javascript
const ws = new WebSocket(
  'wss://ems.lightriderinc.com/v1/entropy/stream' +
  '?policy=fastest_available&bytes_per_tick=128'
);

ws.onmessage = (event) => {
  const frame = JSON.parse(event.data);
  if (frame.error) throw new Error(frame.error);
  consume(frame.bytes_hex, frame.receipt);
};
```

Browser WebSocket connections use the anonymous Free entitlement. Use a WebSocket client that can send an `Authorization` header for higher tiers.
