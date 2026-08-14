---
title: U.S. Quantum Policy
---

# U.S. Quantum Policy

A guide to the federal directives driving the shift to quantum-safe cryptography, and what they mean for companies operating in the United States.

## Why this matters

Quantum computing advances are creating new risk for cryptography, communications, AI systems, critical infrastructure, and national security systems. U.S. federal policy is moving from research funding toward binding timelines: agencies and, increasingly, the contractors and critical-infrastructure operators they depend on are being directed to inventory their cryptography and migrate to NIST's post-quantum algorithms. The directives below are the current U.S. baseline — what is changing, why it matters, and how to prepare.

## Current directives

### Executive Order 14413 — Ushering in the Next Frontier of Quantum Innovation

- **Issued:** June 22, 2026
- **Source:** The White House

Sets national policy for accelerating U.S. quantum computing, communications, and sensing capability, positioning quantum readiness as a competitiveness issue alongside a security one.

### Executive Order 14412 — Securing the Nation Against Advanced Cryptographic Attacks

- **Issued:** June 22, 2026
- **Source:** The White House

Directs the migration of federal systems away from cryptography vulnerable to a cryptanalytically relevant quantum computer (CRQC), extending prior guidance (including OMB M-23-02) toward concrete adoption of NIST's post-quantum algorithms — ML-KEM and ML-DSA — across federal and federally-connected systems.

### National Security Presidential Memorandum 12 — National Security Systems Cybersecurity Governance

- **Issued:** June 12, 2026
- **Source:** The White House

Establishes cybersecurity governance for National Security Systems (NSS), including the cryptographic modernization work needed for a quantum-safe transition across classified and defense-related infrastructure.

### Executive Order 14409 — Promoting Advanced Artificial Intelligence Innovation and Security

- **Issued:** June 2, 2026
- **Source:** The White House

Ties AI infrastructure security to the same modernization push — the compute, data, and communications paths behind AI systems fall under the same cryptographic-inventory and migration expectations.

## Preparing your organization

- **Inventory first.** You cannot migrate what you cannot see. A cryptographic bill of materials (CBOM) covering source code, dependencies, certificates, and running services is the starting point every directive above assumes. See [Cryptographic discovery](/pqc/discovery).
- **Track the algorithms, not just the deadline.** ML-KEM-768 (key encapsulation) and ML-DSA-65 (signatures) are the NIST-standardized algorithms these directives point toward. See [What is Light Rider PQC?](/pqc/introduction).
- **Keep classical cryptography FIPS-validated while you transition.** Migration is incremental — most organizations will run validated classical algorithms alongside post-quantum ones for years, not switch overnight.
- **Produce evidence, not just intent.** Executive orders and OMB memoranda increasingly expect inventory reports in standard formats (CycloneDX CBOM, OMB M-23-02 inventories) that can be handed to auditors or agency customers directly.

## Beyond the United States

Light Rider tracks equivalent policy in Canada, the European Union and member states, the United Kingdom, and Asia-Pacific on the [Quantum Policy Center](https://www.lightriderinc.com/quantum-policy-center), alongside international standards bodies (NIST, IETF, ETSI, GSMA, the PQC Coalition). This page focuses on the U.S. federal baseline; consult the policy center for a jurisdiction-by-jurisdiction view.

## Next steps

- [What is Light Rider PQC?](/pqc/introduction) — how Light Rider's Veloce SDK maps to these requirements.
- [Cryptographic discovery](/pqc/discovery) — generate the inventory these directives require.
- [Quickstart](/pqc/quickstart) — run your first scan and validation check.
