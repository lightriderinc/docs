---
title: What is Light Rider Cloud?
---

# What is Light Rider Cloud?

Light Rider Cloud is the web platform for running quantum workloads: submit circuits to quantum processors and simulators, track jobs and results, and manage compute credits — all from one account at [platform.lightriderinc.com](https://platform.lightriderinc.com/).

## Overview

The platform sits in front of Light Rider's quantum backends and services. You can use it entirely from the dashboard, or authenticate programmatically with an API key and drive the same actions from a script or the [Light Rider SDK](/sdk/getting-started).

## What you can do

- **Run circuits** — from the Dashboard's demo tile, the Backends catalog, or your own script — against IQM quantum processors and their free simulators.
- **Track jobs** — every submission appears on the [Jobs](/platform/jobs) page with live status, and completed jobs show measurement counts you can copy or download.
- **Explore applications** — quantum-powered demos built on live entropy and post-quantum cryptography: a true-random dice roller, a secure password generator, Quantum Vault, and the Quantum-Safe Signer. See [Applications](/platform/applications).
- **Manage compute credits** — real hardware is metered per shot; simulator runs are free and unlimited.
- **Authenticate external requests** — generate an API key under Settings → API Keys to submit jobs from outside the dashboard. See [API keys](/platform/api-keys).

## How the platform is organized

| Section | Route | Purpose |
| --- | --- | --- |
| Dashboard | `/` | Compute token balance, your latest jobs, and quick demo circuits. |
| Backends | `/backends` | Catalog of quantum processors and simulators, with specs and a "Submit a job" action per card. |
| Jobs | `/jobs` | Full history of your submitted jobs, live status, and measurement results. |
| Applications | `/applications` | Standalone demo apps: dice roll, password generator, Quantum Vault, Quantum-Safe Signer. |
| Settings → Account | `/settings/account` | Profile, password, email, connected accounts, and two-factor authentication. |
| Settings → API Keys | `/settings/keys` | Generate, rotate, and revoke the key used for programmatic job submission. |
| Settings → Usage | `/settings/usage` | Token balance, subscriptions, payment method, and purchase history. |
| Settings → Purchases | `/settings/purchases` | Buy compute tokens or a monthly platform plan. |

## Backends available today

The catalog lists quantum processors from **IQM**, **Rigetti**, and **IBM Quantum**, alongside free simulators. IQM's Garnet, Emerald, and Sirius devices (and their `:mock` simulator counterparts) are wired up for job submission from both the dashboard and the API today; Rigetti and IBM devices are browsable in the catalog ahead of full submission support. See [Backends](/platform/backends) for details.

## Credits model

- Simulator (mock) jobs are **free and unlimited** — they never deduct tokens, so they're the fastest way to try a circuit.
- Real quantum-processor jobs deduct **compute tokens** per shot at submission time, and require at least one token purchase before they unlock — the free signup balance alone doesn't enable real hardware.

## Next steps

- [Getting started](/platform/getting-started) — sign in and submit your first job.
- [Jobs & results](/platform/jobs) — job status lifecycle and reading measurement results.
