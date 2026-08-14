---
title: SDK & CLI reference
---

# SDK & CLI reference

The full Python SDK and command-line surface for the Veloce agent. All cryptographic operations execute inside the local agent; the Python package holds no cryptographic code and private keys never leave the agent as anything but opaque handles.

## Python SDK

```python
import veloce
```

| Function | Description |
| --- | --- |
| `veloce.initialize()` | Connect to the local Veloce agent. Call before any other function. |
| `veloce.banner()` | Return agent version and build information. |
| `veloce.mlkem_generate_keypair()` | Generate an ML-KEM-768 keypair; returns a public key and an opaque private-key handle. |
| `veloce.mlkem_encapsulate(public_key)` | Encapsulate against a public key; returns `(ciphertext, shared_secret)`. |
| `veloce.mlkem_decapsulate(private_key_handle, ciphertext)` | Decapsulate with a private-key handle; returns the shared secret. |
| `veloce.mldsa_generate_keypair()` | Generate an ML-DSA-65 keypair; returns a public key and an opaque private-key handle. |
| `veloce.mldsa_sign(private_key_handle, message)` | Sign a message with a private-key handle; returns the signature. |
| `veloce.mldsa_verify(public_key, message, signature)` | Verify a signature against a public key; returns a boolean. |
| `veloce.validation_status()` | Return the agent's FIPS validation status. |
| `veloce.export_cbom(format, path)` | Export a cryptographic bill of materials (e.g. `format="cyclonedx"`) to `path`. |

Set the `VELOCE_SOCKET` environment variable to point the SDK at a non-default agent socket path.

## CLI (`veloce`)

| Command | Description |
| --- | --- |
| `veloce status` | Agent status. |
| `veloce validation` | FIPS validation status. |
| `veloce self-test` | Run the agent's built-in self-test. |
| `veloce cbom cyclonedx` | Export a CycloneDX 1.6 CBOM. |
| `veloce scan /path/to/codebase` | Run a qSearch source-tree scan through the agent. |

## CLI (`qsearch`)

| Command | Description |
| --- | --- |
| `qsearch scan /path/to/codebase --out <dir>` | Scan a source tree for cryptographic patterns and PEM certificates. |
| `qsearch system --out <dir>` | Inventory the crypto modules present on the host. |

See [Cryptographic discovery](/pqc/discovery) for the report formats both `qsearch` commands produce.

## Underlying cryptography

- **Classical algorithms + DRBG:** wolfCrypt FIPS 140-3 module, certificate #4718.
- **Post-quantum:** ML-KEM-768 and ML-DSA-65, provided beside the FIPS boundary in the same agent.

Native C integration against the same libraries (bypassing the agent) is possible for bring-up work, but the agent is the supported path for key custody, fail-closed entropy, and CBOM generation.

## Next steps

- [Quickstart](/pqc/quickstart) — build the agent and run these calls end to end.
- [Cryptographic discovery](/pqc/discovery) — what `export_cbom()` and the `qsearch` commands produce and why.
