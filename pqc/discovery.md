---
title: Cryptographic discovery
---

# Cryptographic discovery

qSearch finds where cryptography — quantum-vulnerable or otherwise — lives across your source code and your running hosts, and turns it into reports you can hand to an auditor or paste into a compliance workbook.

## Two modes

- **`scan`** — walks a source tree looking for cryptographic patterns and PEM certificates.

  ```
  build/bin/qsearch scan /path/to/codebase --out qsearch-out
  ```

- **`system`** — inventories the crypto modules present on the host: installed crypto libraries from the dynamic-linker cache and library directories (SHA-256 fingerprinted), kernel crypto API algorithms (`/proc/crypto`) and FIPS mode, SSH host keys and the `sshd` algorithm policy, the OS certificate store, TLS policy files, and running processes with crypto libraries mapped.

  ```
  build/bin/qsearch system --out host-inventory
  ```

  Run as root for full process and config coverage. Entries qSearch can't read are reported as explicit blind spots — never guessed.

Both modes are also reachable through the agent CLI: `veloce scan /path/to/codebase` and `veloce cbom cyclonedx`.

## Output

Console output is the client-facing summary: finding counts and the top quantum-vulnerable algorithms encountered, plus the next commands to run. Full runtime detail is written to `<out>/qsearch-run.log`.

Both modes produce the same report set inside the output directory:

| File | Format | Purpose |
| --- | --- | --- |
| `findings.json` | JSON | Canonical, pretty-printed findings — the source of truth for the other formats. |
| `findings.csv` | CSV | Findings as a flat table. |
| `cbom.cdx.json` | CycloneDX 1.6 | Standard cryptographic bill of materials. |
| `m2302-inventory.json` | JSON | Inventory shaped for OMB M-23-02 reporting. |
| `executive-summary.txt` | Text | Plain-language summary for non-technical stakeholders. |
| `workbook-discovery-findings.csv` | CSV | Paste-in match for the "Discovery Findings" sheet of `Light_Rider_CBOM_Template_Updated.xlsx`. |
| `workbook-scanning-log.csv` | CSV | Paste-in match for the "Scanning Log" sheet of the same workbook. |

## Why this maps to policy

Every current U.S. federal directive on the post-quantum transition — from OMB M-23-02 through Executive Order 14412 — assumes an inventory step before migration can be prioritized or measured. The CycloneDX CBOM and `m2302-inventory.json` outputs are built to be handed directly to that reporting requirement rather than reformatted after the fact. See [U.S. Quantum Policy](/pqc/policy).

## Next steps

- [SDK & CLI reference](/pqc/sdk-reference) — `export_cbom()` and the full `veloce` / `qsearch` command surface.
- [Quickstart](/pqc/quickstart) — build qSearch and run your first scan.
