---
title: Backends
---

# Backends

The Backends catalog (`/backends`) lists every quantum processor and simulator you can run circuits on.

## Browsing the catalog

- **Card or list view** — toggle between a card grid and a compact table; your choice is remembered for the session.
- **Filter** — by provider and other categories.
- **Sort** — by provider, qubit count, or type.
- Each entry shows an online/offline status badge and, once you open it, specs such as qubit count, topology, native gates, gate/readout fidelities, coherence times, and a qubit connectivity map where available.

Backends come from three providers:

| Provider | Notes |
| --- | --- |
| **IQM** | Garnet, Emerald, and Sirius processors, each with a free `:mock` simulator counterpart. All six are wired up for job submission today. |
| **Rigetti** | Listed in the catalog; job submission isn't available yet. |
| **IBM Quantum** | Listed in the catalog with live calibration data; job submission isn't available yet. |

## Submitting a job from a backend card

Open any IQM card and expand **Connect to `<device>`**:

- **Simulators** (`:mock` devices) run with no API key required — click **Submit a sample circuit** to open the same submission form used on the [Dashboard](/platform/dashboard), or follow the linked Google Colab quickstart notebook.
- **Real quantum processors** require a Light Rider API key. If you haven't generated one yet, the panel links straight to **Settings → API Keys** ([details](/platform/api-keys)). Once you have a key, the panel shows a ready-to-run Python snippet that posts your circuit directly to the platform API, plus the same **Submit a sample circuit** button for testing from the dashboard itself.

Real-hardware submissions are metered in compute tokens per shot and require having purchased tokens at least once.

## What "submit a job" actually does

The submission form (used on the Dashboard, the Backends catalog, and the Jobs page) lets you:

1. Pick a sample circuit — an H gate (1-qubit superposition) or a Bell state (2-qubit entangled pair).
2. Choose a shot count.
3. Submit — the job appears immediately with a **Pending/Waiting/Processing** status, then live-updates to **Completed**, **Failed**, or **Aborted**.

Once a job completes, its measurement results appear in the same view — see [Jobs & results](/platform/jobs) for how to read them, and how to submit circuits programmatically instead of through the dashboard.

## Next steps

- [Jobs & results](/platform/jobs) — track every submission and read measurement counts.
- [API keys](/platform/api-keys) — authenticate requests made outside the dashboard.
