---
title: QEC Module Design & Selection
---

# QEC Module Design & Selection

This page covers how Light Rider selects and scores a Cepheus chiplet as a `[[5,1,3]]` logical-qubit module, and what gets recorded for every QEC run. It is the implementation layer underneath the architecture described in [Cepheus Chiplets as Logical Qubits](/platform/backends/cepheus-logical-qubits) — read that page first for the conceptual model: the `[[5,1,3]]` code, the flag method, and the feasibility gate.

::: warning Status
Like the linked overview, this page describes an active engineering program on Cepheus rather than a generally available catalog feature.
:::

## Selecting a logical-qubit module

Physical qubit selection inside a chiplet is resolved dynamically from the current calibration snapshot each time a module is selected. A `logical_qubit_513` selection profile request identifies the chiplet and syndrome strategy:

```json
{
  "workload": "logical_qubit_513",
  "chiplet": "C7",
  "code": "[[5,1,3]]",
  "ft_scheme": "flag",
  "syndrome_strategy": "flag_sequential"
}
```

The response resolves concrete physical roles (data, ancilla, flag, routing), a predicted schedule, and the [feasibility gate](/platform/backends/cepheus-logical-qubits#feasibility-gate) verdict, surfaced directly rather than left for the caller to compute:

```json
{
  "chiplet": "C7",
  "logical_qubit": "L7",
  "ft_scheme": "flag",

  "data_qubits":     { "D0": 54, "D1": 55, "D2": 56, "D3": 63, "D4": 72 },
  "syndrome_ancilla": 64,
  "flag_qubit":       65,
  "routing_qubits":  [73, 74],

  "schedule": {
    "cz_count": 34,
    "swap_count": 4,
    "measurement_cycles": 4,
    "ft_preserved": true
  },

  "predicted_round_faults": 0.31,
  "predicted_round_duration_ns": 6400,
  "coherence_ratio": 0.64,

  "calibration_id": "...",
  "score": 0.41,
  "warnings": [
    { "code": "round_duration_exceeds_gate",
      "message": "T_round 6.4 µs against T2_min 10.1 µs (ratio 0.64, gate 0.20)." }
  ]
}
```

As calibration drifts, the best physical embedding is reselected, so the same chiplet can resolve to a different `[[5,1,3]]` layout on a later run.

## Scoring a candidate module

Candidate embeddings are ranked by the predicted expected fault count per syndrome round, **Δ_round**, computed as a usage-weighted sum over required edges and qubits:

```text
Δ_round =   Σ over two-qubit gates    (1 − fCZ_e)  × uses_e
          + Σ over single-qubit gates (1 − fRB_q)  × uses_q
          + Σ over measurements       (1 − fRO_q)
          + Σ over data qubits        idle_error(T_round, T1_q, T2_q)
          + Σ over resets             (1 − F_reset_q)
```

A coupler exercised six times in a round contributes six times the error of one used once, which a simple average or minimum across edges would miss. Minima are used only as **veto thresholds**: a single site below threshold disqualifies the embedding outright, while the ranking itself stays usage-weighted throughout. Δ_round is computed from a versioned calibration-to-noise transform (`noise_model_version`), and its output also serves as the module's selection score.

Alongside its score, each candidate module's full diagnostics include a Δ_round decomposition by gate/measurement/idle/reset contribution, mean and minimum fidelities for single-qubit, readout, and two-qubit operations, T1/T2 minimums, round duration and coherence ratio, 30-day stability, routing cost (CZ count, SWAP count, depth), and the `ft_preserved` verdict — the governing principle being that weak hardware should never be hidden inside an average.

## Physical roles inside a module

The selector scores each qubit against the requirements of its assigned role, not overall qubit strength. A qubit with excellent single-qubit fidelity but mediocre readout makes a good data qubit and a poor ancilla.

| Role | Priorities |
| --- | --- |
| Code qubits (D0–D4) | Single-qubit fidelity, T2, T1, connectivity to the ancilla, stability. Readout matters only at final measurement. D3 is exercised in every generator, so its error rate enters Δ_round four times over. |
| Syndrome ancilla (A) | Readout fidelity, **reset fidelity**, degree-4 connectivity, CZ quality on incident edges, measurement latency, stability. |
| Flag qubit (F) | Readout fidelity, reset fidelity, CZ quality on its single edge to A. Poor readout costs acceptance rate (spurious flag raises); poor reset corrupts the *next* cycle's verdict, which costs correctness. |
| Routing / support | CZ connectivity and single-qubit fidelity — any error here propagates into data during a SWAP. |

## Fault-tolerant routing

A SWAP that moves a **data** qubit reintroduces the correlated-error mechanism the flag exists to suppress. Two rules govern the scheduler:

1. **Move the ancilla, not the data**, wherever the schedule permits — ancilla errors are what flags catch; data-to-data propagation is what they cannot.
2. **Every candidate schedule carries an `ft_preserved` verdict**, established by fault enumeration over the circuit. A schedule that fails is disqualified regardless of how shallow it is.

## Decoding `[[5,1,3]]`

`[[5,1,3]]` is a **perfect** code: its 16 syndromes map bijectively onto the identity plus the 15 weight-1 Pauli errors. When the flag hasn't fired, decoding is an exact 16-entry lookup table, with no matching graph or ambiguity — calibration-aware priors add nothing at this stage.

The priors earn their keep in the **flag branch**. When the flag is raised, a single fault has produced a weight-2 data error; the candidate errors are distinguishable by syndrome, and an empirical likelihood over the specific chiplet's error profile is what selects among them:

```text
syndrome + flag outcome
          │
   flag raised? ── no ── 16-entry lookup → weight-1 correction
          │
         yes
          │
flag-conditioned error set
          │
calibration-weighted selection
          │
predicted correction → logical outcome
```

## QEC run record

Every run against a logical-qubit module is recorded with enough detail to reproduce the logical error measurement:

| Group | Fields |
| --- | --- |
| Identity | `backend_id`, `chiplet`, `logical_qubit_id`, `code`, `ft_scheme`, `syndrome_strategy` |
| Layout | `data_qubits`, `syndrome_ancilla`, `flag_qubit`, `routing_qubits`, `stabilizer_schedule`, `routing_schedule`, `ft_preserved` |
| Run parameters | `rounds`, `shots`, `mode` (`correction` \| `detection`) |
| Timing | `round_duration_measured`, `idle_time_per_data_qubit`, `coherence_ratio`, `dd_applied` |
| Reset & prep | `reset_method`, `reset_fidelity`, `encoding_method`, `state_prep_fidelity` |
| Outcomes | `flag_outcomes`, `postselection_acceptance_rate`, `physical_baseline_definition`, `physical_baseline_error`, `logical_error`, `logical_gain` |
| Provenance | `calibration_id`, `noise_model_version`, `decoder`, `decoder_version`, `control_instruments`, `sequencers`, `execution_timestamp` |

`physical_baseline_definition` matters as much as the baseline number itself: a baseline is a single physical qubit idling for exactly `T_round × N_rounds`, read out through the same measurement chain, reported against both the best and median qubit in the chiplet. This record is what makes a logical error measurement reproducible.

## Topology Service endpoints

The logical-module abstraction sits above the physical topology the [Backends](/platform/backends/catalog) catalog already exposes:

| Endpoint | Purpose |
| --- | --- |
| `GET /v1/backends/{id}/logical-qubits` | List every logical-qubit module currently defined on a backend. |
| `GET /v1/backends/{id}/logical-qubits/{logical_id}` | Fetch the layout, schedule, and status of one logical-qubit module. |
| `POST /v1/backends/{id}/logical-qubits/select` | Resolve a `logical_qubit_513` selection profile into a concrete module (see above). |
| `GET /v1/backends/{id}/logical-topology` | Fetch the logical overlay across all chiplets on a backend. |

## Q-QEC experiment flow

The end-to-end flow for turning a chiplet into a logical qubit and measuring it:

```text
Select chiplet
      │
Topology analytics rank chiplets by predicted Δ_round
      │
Recommended logical-module candidates
      │
Resolve [[5,1,3]] layout: data, ancilla, flag, routing
      │
Display layout, FT scheme, CZ/SWAP count, round duration,
coherence ratio and gate verdict, calibration
      │
Run physical baseline
      │
Run encoded experiment (detection and/or correction mode)
      │
Decode
      │
Compare
```

A module that fails the feasibility gate can still be run, with a warning shown before the run is submitted, so researchers can override the recommendation deliberately rather than by accident.

## Next steps

- [Cepheus Chiplets as Logical Qubits](/platform/backends/cepheus-logical-qubits) — the architecture and feasibility gate this page implements against.
- [Quantum Error Correction](/platform/sdk/stabilizer-qec) — the `lightrider` SDK's `FiveQubit_Code` and other stabilizer codes, runnable today on the local simulator.
- [Backends](/platform/backends/catalog) — the physical chiplet topology and calibration data this selection process reads from.
