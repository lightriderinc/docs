# Light Rider SDK

The `lightrider` package provides quantum circuit simulation, stabilizer and
surface-code experiments, IQM cloud jobs, quantum random numbers, attested
entropy, and QRNG-driven synthetic data.

> **Current documentation:** SDK 1.3.0

## Installation

```
pip install lightrider
pip install "lightrider[pandas]"   # + pandas DataFrame support
```

Requires Python ≥ 3.9.

> **Live EMS entropy** additionally needs the `lr-entropy` SDK, which ships with the Light Rider platform rather than on PyPI. Install it from the platform repository (`pip install ./sdk-python`) and `EntropySource` becomes available automatically.

## Quickstart

```python
from lightrider import Circuit, get_backend

# 1. Build a Bell-pair circuit
circ = Circuit(2)
circ.h(0)
circ.cx(0, 1)
circ.measure_all()

# 2. Run it on the local statevector simulator
job = get_backend("statevector").run(circ, shots=1000, seed=42)

# 3. Read the counts (Qiskit convention: clbit 0 is the rightmost character)
print(job.result().counts)   # {'00': 507, '11': 493}
```

## Four core capabilities

- **[Quantum Circuits](/sdk/quantum-circuits)** — build and run quantum circuits with local simulators or IQM cloud hardware.
- **[Quantum Error Correction](/sdk/stabilizer-qec)** — run circuit-level QEC experiments on surface, repetition, five-qubit, and color codes, with PyMatching decoding.
- **[Quantum Random Numbers](/sdk/quantum-random-numbers)** — draw numpy-compatible randomness from real quantum entropy sources.
- **[Synthetic Data with Provenance](/sdk/synthetic-data)** — generate tabular synthetic data where every random draw is quantum and attributable.

Prefer a web UI over writing code? The **[Light Rider Cloud platform](/platform/introduction)** covers the same circuit submission through a dashboard, with self-serve API keys for scripting against it directly.
