---
title: Getting Started
---

# Getting Started

Create an account and submit your first quantum job in a few minutes.

## Step 1: Sign in

Light Rider Cloud uses hosted sign-in (email/password or social login) — there's no separate registration form to fill out. From [platform.lightriderinc.com](https://platform.lightriderinc.com/), select **Create an account** (first visit) or **Log in** (returning). The same flow handles both; new accounts get a starter signup credit automatically.

::: tip What you can do before signing in
The [Backends](/platform/backends) catalog and [Applications](/platform/applications) are browsable without an account. The Quantum-Safe Signer application specifically works with no login at all. The Dashboard and Jobs pages require signing in.
:::

## Step 2: Try a sample circuit

The fastest way to see a result is the Dashboard's **Submit sample circuits** tile — it runs a sample circuit (H gate or Bell state) against a free simulator, so it never costs compute tokens. Pick a circuit, choose a shot count, and submit; the same modal then shows your measurement results once the job completes.

The [Backends](/platform/backends) catalog offers the same submission flow for any specific device, including real quantum processors.

## Step 3: Buy compute tokens (optional, for real hardware)

Simulator jobs are free and unlimited. To run a circuit on real quantum hardware, you need to purchase compute tokens at least once — go to **Settings → Purchases → Quantum Compute**.

## Step 4: Generate an API key (optional, for programmatic access)

If you want to submit jobs from a script instead of the dashboard, generate a key under **Settings → API Keys** and use it as a bearer token. See [API keys](/platform/api-keys) for the full request format, or use the [Light Rider SDK](/platform/sdk/getting-started) directly.

## Next steps

- [Dashboard](/platform/dashboard) — what you see after signing in.
- [Jobs & results](/platform/jobs) — track submissions and read measurement results.
- [Backends](/platform/backends) — browse available quantum processors and simulators.
