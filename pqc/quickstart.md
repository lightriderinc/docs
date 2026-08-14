---
title: Quickstart
---

# Quickstart

Build the Veloce agent, run it locally, and make your first ML-KEM and ML-DSA calls.

> Building and testing is currently supported on Linux x86-64.

## Build and test everything

```
bash scripts/run_gates.sh
```

This builds the wolfCrypt FIPS module from the licensed bundle (`vendor/wolfssl`), builds the PQC provider, the agent, qSearch, and the CLI, generates `~/.veloce/agent.json`, and runs the release-gate battery. Expect `ALL GATES GREEN`.

To force a clean rebuild:

```
FORCE_REBUILD=1 bash scripts/run_gates.sh
```

## Run the agent

```
python3 scripts/gen_config.py
build/bin/veloce-agent --config ~/.veloce/agent.json &
```

## Use the Python SDK

The SDK is pure Python — no cryptographic code runs in-process. Every call executes inside the local agent over an authenticated IPC channel.

```python
import sys; sys.path.insert(0, "python")   # or: pip install build/dist/*.whl
import veloce

veloce.initialize()

kp = veloce.mlkem_generate_keypair()               # ML-KEM-768
ct, ss = veloce.mlkem_encapsulate(kp.public_key)
assert veloce.mlkem_decapsulate(kp.private_key_handle, ct) == ss

sk = veloce.mldsa_generate_keypair()               # ML-DSA-65
sig = veloce.mldsa_sign(sk.private_key_handle, b"msg")
assert veloce.mldsa_verify(sk.public_key, b"msg", sig)

veloce.export_cbom(format="cyclonedx", path="cbom.cdx.json")
```

Set `VELOCE_SOCKET` to point the SDK at a non-default agent socket path.

## Use the CLI

```
build/bin/veloce status
build/bin/veloce validation
build/bin/veloce self-test
build/bin/veloce cbom cyclonedx
build/bin/veloce scan /path/to/codebase
```

## Run qSearch directly

```
build/bin/qsearch scan /path/to/codebase --out qsearch-out
build/bin/qsearch system --out host-inventory
```

See [Cryptographic discovery](/pqc/discovery) for what each mode inventories and the report formats produced.

## Next steps

- [SDK & CLI reference](/pqc/sdk-reference) — every Python function and CLI command.
- [Cryptographic discovery](/pqc/discovery) — scan and system inventory modes, report formats, and CBOM.
- [What is Light Rider PQC?](/pqc/introduction) — the design points behind the agent model.
