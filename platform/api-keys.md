---
title: API Keys
---

# API Keys

An API key authenticates requests made to the Light Rider platform API from outside the dashboard — scripts, notebooks, or the [SDK](/sdk/getting-started) — separately from your browser sign-in session.

## Generating a key

Go to **Settings → API Keys** (`/settings/keys`) and select **Generate API Key**. The full key is shown **once**, at creation time — copy it somewhere safe immediately, since only a prefix is shown afterward.

Send it as a bearer token on requests to the platform API:

```
Authorization: Bearer <your-api-key>
```

See [Jobs & results](/platform/jobs#submitting-jobs-programmatically) for a full request example.

## Rotating a key

**Rotate key** generates a new key and immediately invalidates the old one — use this if you suspect a key has leaked, without needing to update every caller's key separately from revoking the old one.

## Revoking a key

**Revoke** deletes the key entirely. Any request still using it will be rejected until you generate a new one.

## What a key can do

An API key acts on your behalf for programmatic actions — currently, submitting quantum jobs and reading their status/results. It does not grant access to account or billing settings; those require signing in normally.

::: tip Simulators don't need a key
An API key is only required to submit jobs to real quantum processors via the platform API. Simulators run locally through the [SDK](/sdk/getting-started) without one.
:::

## Next steps

- [Jobs & results](/platform/jobs) — submit and track jobs using your key.
- [Light Rider SDK](/sdk/getting-started) — a higher-level Python client instead of raw HTTP calls.
