# Quantum Random Numbers

## numpy-style: `quantum_rng()`

`quantum_rng()` is the quantum counterpart of `numpy.random.default_rng()` — the same calling conventions, but every draw comes from a quantum entropy source, with no PRNG in the sampling path:

```python
from lightrider import quantum_rng

rng = quantum_rng()                      # default source: "iqm_sirius"
rng.random(5)                            # uniform floats in [0, 1)
rng.integers(1, 6, size=10, endpoint=True)   # quantum dice
rng.normal(loc=0.0, scale=1.0, size=100)     # Box–Muller on quantum uniforms
rng.choice(["a", "b", "c"], 5, p=[0.5, 0.3, 0.2])
rng.shuffle(my_list)                     # quantum Fisher–Yates
rng.bytes(32)                            # raw quantum entropy
```

The entropy backend is selectable. `"iqm_sirius"` (default) is the bundled IQM hardware pool; any object with a `uniform(shape)` method also works — pass an `EntropySource` for live, signed EMS entropy, or a `BundledQrng` to record every draw on a provenance manifest:

```python
from lightrider import BundledQrng, quantum_rng

provider = BundledQrng(dataset_id="my_experiment")
rng = quantum_rng(provider)              # draws are logged on provider.manifest
```

**numpy interop:** when you need numpy's full distribution zoo or bulk PRNG throughput, `rng.numpy_generator()` returns a genuine `numpy.random.Generator` seeded from quantum bytes — quantum-seeded rather than quantum-drawn, and the honest label matters:

```python
g = rng.numpy_generator()                # a real np.random.Generator
g.binomial(10, 0.5, size=100_000)        # anything numpy can do
```

Two deliberate design points: there is **no `seed` parameter** (the stream is physical entropy, not a reproducible algorithm — for reproducibility, seed a `numpy_generator()` and store the seed), and the bundled pool **cycles after ~1.9M bits**, so it is statistically quantum but not suitable for cryptographic key material.

## Classic: `IQM_sirius`

`IQM_sirius` draws from the same bundled pool (~2 million bits captured from IQM hardware: Hadamard coin-flip circuits across 10 qubits, SHA-256 debiased) — no network required. Output is unbiased on any range via rejection sampling:

```python
from lightrider import IQM_sirius

IQM_sirius(5, 1, 100)               # 5 quantum random ints in [1, 100]
IQM_sirius(3, 0.0, 1.0, step=0.1)   # 3 quantum random floats on a 0.1 grid
```

Capture metadata for the bundled pool lives in the repository under `iqm_capture_20260507_181448/metadata.json`.
