---
title: Cepheus Chiplets as Logical Qubits
---

# Cepheus Chiplets as Logical Qubits

Rigetti's `Cepheus-1-108Q` processor — one of the [Backends](/platform/backends/catalog) listed in the catalog — is organized as twelve independent 3×3 chiplets. Light Rider's quantum error correction (QEC) architecture turns each chiplet into one independently characterized **logical qubit**, using the `[[5,1,3]]` five-qubit code with flag fault-tolerant syndrome extraction.

::: warning Status
This page describes an architecture under active development on Cepheus. It covers what is measured today, what performance to expect, and which parts are still open research; it is not yet a generally available catalog feature.
:::

For the module-selection API and scoring details, see [QEC Module Design & Selection](/platform/backends/cepheus-qec-modules).

## Architecture overview

```text
108 physical qubits            Cepheus-1-108Q hardware
        │
        ▼
12 Cepheus chiplets             3×3 lattice modules
        │
        ▼
12 [[5,1,3]] modules            fault-tolerant QEC per chiplet
        │
        ▼
up to 12 logical qubits         independently characterized logical-qubit modules
```

The goal is to turn each Cepheus chiplet into an independently characterized `[[5,1,3]]` logical-qubit module: twelve chiplets, up to twelve logical qubits, with no cross-chiplet entanglement required to get there.

## Module layout

The `[[5,1,3]]` code encodes one logical qubit in five physical data qubits, checked by four weight-4 stabilizer generators. Measuring those stabilizers fault-tolerantly (the flag method, below) needs two more qubits: one syndrome ancilla and one flag. That's seven of the nine sites in a chiplet, with two left over for routing.

```text
D0    D1    D2
              
D3    A     F        A = syndrome ancilla (center, degree 4)
                      F = flag qubit (adjacent to A)
D4    R     R        R = routing / scratch
```

| Role | Count | Purpose |
| --- | --- | --- |
| Data qubit (D) | 5 | Carries the encoded logical state. |
| Syndrome ancilla (A) | 1 | Measures the four stabilizer generators; placed at the chiplet's one degree-4 (center) site. |
| Flag qubit (F) | 1 | Catches faults that would otherwise spread into an uncorrectable weight-2 data error. |
| Routing / scratch (R) | 2 | Available for movement, measurement, and future operations. |

**Total required: 7 of 9 sites.** Each Cepheus chiplet can host one `[[5,1,3]]` logical-qubit module — twelve physical chiplets, up to twelve logical qubits.

One chiplet, C3, is missing its q8 site (readout-provisioned but drive-absent), leaving it 8 controllable sites instead of 9 — still comfortably above the 7 a module needs. C3 runs a sequential syndrome schedule instead of a parallel one; see [Syndrome extraction](#syndrome-extraction) below.

## The `[[5,1,3]]` code and flag fault tolerance

`[[5,1,3]]` is the smallest code protecting against an arbitrary single-qubit error: five data qubits, one encoded logical qubit, code distance three. It's chosen because five data qubits fit inside one chiplet, and because the Light Rider SDK already ships `FiveQubit_Code` (see [Quantum Error Correction](/platform/sdk/stabilizer-qec)).

Distance 3 only delivers single-error correction when the syndrome-extraction circuit is itself fault tolerant. A bare ancilla coupled sequentially to four data qubits will, on a single mid-circuit ancilla fault, propagate a weight-2 data error, which a distance-3 code cannot correct. Adding a single **flag qubit** alongside the syndrome ancilla catches exactly those faults: the flag is raised whenever a fault has produced a weight-2-or-greater data error, and the resulting errors are distinguishable by their syndromes and therefore correctable (Chao & Reichardt, *Quantum Error Correction with Only Two Extra Qubits*, PRL 121, 050502, 2018 — the source of this architecture's seven-qubit `[[5,1,3]]` construction).

The flag procedure is fault tolerant at one level of encoding, but it falls short of the strictest fault-tolerance criteria: certain weight-2 errors are neither detected nor corrected. That's expected for a single-level distance-3 design. Results from this architecture are described as **flag fault-tolerant syndrome extraction at one level of encoding** — a qualified claim, distinct from an unconditionally fault-tolerant logical qubit.

## Syndrome extraction

The primary engineering challenge is repeatedly measuring four weight-4 stabilizers fault-tolerantly inside a nine-site chiplet; encoding the five data qubits is comparatively simple. Each stabilizer requires the syndrome ancilla to couple to four data qubits plus the flag (degree 5), but the lattice only provides degree 4, so at least one SWAP-mediated interaction per generator is unavoidable.

Three syndrome-extraction strategies are under evaluation:

| Strategy | Ancilla/flag pairs | Fault tolerant | Notes |
| --- | --- | --- | --- |
| **A — bare ancillas** | 4 bare ancillas, no flags | No | A control arm used to measure what fault tolerance costs; results are never reported as a standalone logical error rate. |
| **B — flag sequential** | 1 pair | Yes | Baseline. Minimum qubit count; fits C3's 8 sites. Four measure/reset cycles per round — the dominant cost in round duration. |
| **C — flag parallel pairs** | 2 pairs | Yes | Halves the number of measurement cycles by extracting two generators at once. Uses all 9 sites, so it's unavailable on C3. |

A fourth, exploratory option (deferred-measurement variants that avoid mid-circuit reset) is evaluated only if native reset proves unreliable.

A schedule that minimizes circuit depth by SWAPping **data** qubits can silently reintroduce the correlated errors the flag qubit exists to catch. Every candidate schedule is checked for **FT preservation** — verified by fault enumeration, not by inspection — before it's considered admissible, and the scheduler favors moving the ancilla over the data wherever possible.

## Feasibility gate

Round duration limits useful QEC on Cepheus more than gate fidelity does. A syndrome round has to complete well inside the data qubits' coherence time, or idle dephasing during ancilla measurement and reset overwhelms whatever the code corrects.

```text
T_round = T_routing + T_CZ + T_1Q + T_measure + T_reset + T_idle

coherence ratio = T_round / T2   (using the shortest T2 among the module's data qubits)
```

| Ratio | Verdict | Meaning |
| --- | --- | --- |
| ≤ 0.20 | **PASS** | Sufficient headroom for repeated QEC rounds. |
| 0.20 – 0.40 | **MARGINAL** | Possible with dynamical decoupling; expect limited rounds. |
| > 0.40 | **FAIL** | QEC rounds will likely exceed the coherence window; routing optimization is deferred until timing improves. |

Cepheus data-qubit T2 is on the order of 10 µs. With four sequential measure/reset cycles under Strategy B, round durations of 4–8 µs are plausible, landing the coherence ratio in the MARGINAL-to-FAIL range before any gate-error term is even counted. This gate is evaluated first, from measured readout and reset durations, so that routing optimization is only spent on a module that can actually finish a round in time.

## Detection mode and correction mode

Logical performance is reported in two distinct modes, answering different questions.

**Detection mode** encodes, measures the syndrome, and rejects any shot with a nontrivial syndrome. This is the near-term achievable result: a post-selected fidelity improvement over the physical baseline, always reported together with its acceptance rate (yield), since the two trade off against each other.

**Correction mode** encodes, extracts syndromes fault-tolerantly, decodes, applies the correction, and measures the recovered logical state. Logical gain is defined as:

```text
G_L = P_physical_error − P_logical_error
```

At current Cepheus gate fidelities (published pseudo-thresholds for distance-3 flag codes sit near 10⁻³–10⁻⁴ per gate; Cepheus runs roughly 10⁻² per CZ), correction-mode logical gain is expected to be negative. The near-term deliverable is a precise measurement of that gap's size and composition, ahead of any expectation of positive gain.

| | Detection mode (illustrative) | Correction mode (illustrative) |
| --- | --- | --- |
| Physical baseline | 96.0% fidelity | 1.10% error rate |
| Encoded result | 98.2% post-selected fidelity | 1.70% logical error rate |
| Yield / gain | 45% acceptance → 44.2% effective yield | −0.60 points (negative, as expected) |

## Logical-qubit states

Each chiplet carries a logical status alongside its physical one:

```text
UNAVAILABLE
CHARACTERIZING
PHYSICAL_READY
QEC_READY
DETECTION_ACTIVE     ← detection mode validated, correction gain negative
LOGICAL_ACTIVE        ← correction gain positive
LOGICAL_DEGRADED
```

`DETECTION_ACTIVE` is the state most modules are expected to reach first, given the negative correction-mode gain expected at current fidelities.

## Roadmap

| Phase | Focus | Outcome |
| --- | --- | --- |
| 1 | Capability & timing verification | Which syndrome architectures are physically possible; the feasibility gate evaluated. |
| 2 | Single-chiplet routing & FT study | Canonical `[[5,1,3]]` layout and schedule per strategy. |
| 3 | State preparation & detection mode | First encoded Cepheus qubit; first result likely to beat the physical baseline. |
| 4 | First correction-mode logical qubit | Measured error budget; negative gain expected. |
| 5 | Replicate across chiplets | Logical-quality map of the processor. |
| 6 | C3 schedule comparison | Measured cost of C3's sequential-only schedule. |
| 7 | Logical stability | Whether QEC reduces calibration-to-calibration variability. |
| 8 | Encoded inter-module interaction *(research)* | `[[5,1,3]]` is non-CSS and has no transversal CNOT between blocks, so connecting two logical qubits is open research rather than a scheduled milestone. |

Running this architecture across all twelve chiplets produces twelve independently characterized **logical memories**. Connecting them into a logical processor is the open research question in Phase 8.

## Next steps

- [QEC Module Design & Selection](/platform/backends/cepheus-qec-modules) — how a chiplet is scored and selected as a module, and what a QEC run record contains.
- [Quantum Error Correction](/platform/sdk/stabilizer-qec) — run `[[5,1,3]]` and other stabilizer codes today via the `lightrider` SDK's local simulator.
- [Backends](/platform/backends/catalog) — where Cepheus and other processors are listed in the catalog.
