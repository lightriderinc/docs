---
title: Jobs & Results
---

# Jobs & Results

The Jobs page (`/jobs`) is the full history of every circuit you've submitted, whether it came from the Dashboard, the Backends catalog, or your own API calls.

## The jobs list

Each row shows:

| Column | Meaning |
| --- | --- |
| Job ID | Shortened UUID (hover to see the full id). |
| Created / Completed | Submission and finish timestamps. |
| Runtime | Wall-clock duration, once completed. |
| Backend | The device the job ran on. |
| Status | Live status badge (see below). |
| Mode | **Mock run** for free simulators, **Live** for real, credit-metered hardware. |

Click a row to open the job's full detail, including its measurement results.

## Status lifecycle

A job moves through:

`PENDING` → `WAITING` / `PROCESSING` → `COMPLETED` (or `FAILED` / `ABORTED`)

While a job is in flight, its status badge polls automatically every few seconds — you don't need to refresh the page. `COMPLETED`, `FAILED`, and `ABORTED` are terminal; polling stops once a job reaches one of them.

## Reading measurement results

Once a job reaches `COMPLETED`, its detail view shows **Measurement Results**: each measured bitstring (`|state⟩`) with its count and percentage of total shots, sorted by frequency. Below that, the same data is available as raw JSON counts, which you can copy to your clipboard or download as a file — useful for pulling results into your own analysis.

A `FAILED` or `ABORTED` job shows that outcome in place of results.

## Submitting jobs programmatically

Every submission path — dashboard, catalog, or API — goes through the same endpoint. To submit from your own code instead of the UI, generate an [API key](/platform/api-keys) and call:

::: code-group

```bash [curl]
curl -X POST https://platform.lightriderinc.com/api/lr/quantum/submit \
  -H "Authorization: Bearer <your-api-key>" \
  -H "Content-Type: application/json" \
  -d '{
    "backend": "iqm-garnet",
    "shots": 1000,
    "circuit": {
      "num_qubits": 2,
      "instructions": [
        { "name": "h", "qubits": [0] },
        { "name": "cx", "qubits": [0, 1] },
        { "name": "measure", "qubits": [0], "clbits": [0] },
        { "name": "measure", "qubits": [1], "clbits": [1] }
      ]
    }
  }'
```

```python [Python]
import requests

api_key = "<your-api-key>"
base_url = "https://platform.lightriderinc.com"

circuit = {
    "num_qubits": 2,
    "instructions": [
        {"name": "h", "qubits": [0]},
        {"name": "cx", "qubits": [0, 1]},
        {"name": "measure", "qubits": [0], "clbits": [0]},
        {"name": "measure", "qubits": [1], "clbits": [1]},
    ],
}

response = requests.post(
    f"{base_url}/api/lr/quantum/submit",
    headers={"Authorization": f"Bearer {api_key}"},
    json={"backend": "iqm-garnet", "circuit": circuit, "shots": 1000},
)
response.raise_for_status()
job = response.json()
print("Job submitted:", job["job_uuid"])
```

:::

Valid `backend` values are the IQM devices and their free `:mock` simulator counterparts — e.g. `iqm-garnet`, `iqm-garnet-mock`, `iqm-emerald`, `iqm-emerald-mock`, `iqm-sirius`, `iqm-sirius-mock`. `:mock` backends cost nothing regardless of shot count; the others deduct compute tokens per shot and return `402` if you haven't purchased tokens yet (or don't have enough left).

Fetch status and results for a job you submitted:

```bash
# Status / detail
curl https://platform.lightriderinc.com/api/lr/quantum/jobs/<job_uuid> \
  -H "Authorization: Bearer <your-api-key>"

# Measurement counts (once completed)
curl https://platform.lightriderinc.com/api/lr/quantum/jobs/<job_uuid>/result \
  -H "Authorization: Bearer <your-api-key>"
```

Prefer working in Python? The [Light Rider SDK](/sdk/getting-started) wraps this same submission flow with a `Circuit`/`get_backend()` interface — see [Quantum Circuits](/sdk/quantum-circuits).

## Next steps

- [Backends](/platform/backends) — full catalog of devices you can submit to.
- [API keys](/platform/api-keys) — generate, rotate, and revoke the key used above.
