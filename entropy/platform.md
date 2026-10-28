---
title: Entropy platform
---

# Entropy platform

The Entropy platform at [entropy.lightriderinc.com](https://entropy.lightriderinc.com) is the web interface for Light Rider Entropy. Sign in with your Light Rider account to draw entropy and manage your receipts and credits.

## Sources

The **Sources** page lists the entropy sources that are currently available, with their type and status. See [Sources](/entropy/sources) for a summary of each one.

## Get Entropy

The **Get Entropy** page draws random bytes in the browser. You can draw from:

- **A shared pool** fed by several sources.
- **A single source**, using that source's dedicated pool.
- **A custom pool** that blends 2 to 8 sources you select.

The cost is shown before you draw. Each draw returns the bytes and a signed receipt.

## Receipts

The **Receipts** page keeps the signed receipt for every draw on your account, including draws made through the API. From a receipt you can review the source, size, and time of the draw, and verify its signature against the Light Rider public key.

Receipts never contain the drawn bytes. The bytes are returned once and are not stored.

## Developers

The **Developers** page shows how to create an API key and draw entropy from your own code, with commands for macOS, Linux, Windows PowerShell, Python, and Google Colab. See the [Quickstart](/entropy/quickstart).

## API keys

Generate, rotate, or revoke your API key under **Settings > API keys**. The key is shared with Light Rider Cloud, so rotating or revoking it here also applies there.

## Credits

Draws are paid for with Light Rider credits.

- 1 credit costs $0.01.
- 1 credit covers up to 256 bytes. Every draw costs at least 1 credit.
- The price is the same for every source and draw type.
- A draw that fails is refunded.

Check your balance and purchase credits under **Settings > Manage credits**. Credits do not expire.
