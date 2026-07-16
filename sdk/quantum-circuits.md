# Quantum Circuits

## Building circuits

`Circuit` follows Qiskit's builder conventions — gate methods take parameters first, then qubits, and calls chain:

```python
from lightrider import Circuit

circ = Circuit(3)                 # 3 qubits, 3 classical bits
circ.h(0)
circ.rx(0.5, 1)                   # params first, qubits last
circ.ccx(0, 1, 2)
circ.measure_all()
```

The primitive gate set:

| Group | Gates |
|-------|-------|
| Single-qubit | `id` `x` `y` `z` `h` `s` `sdg` `t` `tdg` `sx` |
| Single-qubit, parameterized | `rx` `ry` `rz` `p` `r` `u` |
| Two-qubit | `cx` `cy` `cz` `ch` `swap` `cp` `rxx` `ryy` `rzz` |
| Three-qubit | `ccx` `cswap` |

Composite gates are defined as macros that expand to primitives at append time:

```python
from lightrider import custom_gate

@custom_gate(num_qubits=2)
def bell_pair(c, qubits, params):
    a, b = qubits
    c.h(a)
    c.cx(a, b)

circ = Circuit(3)
circ.append(bell_pair, [0, 1])
```

## Choosing a backend

Every backend declares the gate set it supports, and `run()` validates the circuit up front — a job that submits will also execute. Inspect all backends programmatically with `list_backends()`.

| Backend name | Aliases | Where | Gate set | Best for |
|---|---|---|---|---|
| `lightrider_statevector` | `statevector`, `sv` | local | full | Exact simulation up to 24 qubits. Shots are sampled in one vectorized pass |
| `lightrider_stabilizer` | `stabilizer`, `stim` | local | Clifford subset (`x y z h s sdg sx cx cy cz swap`) | Clifford circuits at hundreds of qubits; supports mid-circuit measurement |
| `iqm` | `cloud` | cloud | full, transpiled server-side to IQM-native `r` (prx) + `cz` | Real-hardware runs via the Light Rider IQM proxy |

## Running locally

```python
from lightrider import get_backend

result = get_backend("statevector").run(circ, shots=10_000, seed=7).result()
result.counts             # {'000': 4980, '111': 5020}
result.probabilities()    # {'000': 0.498, '111': 0.502}
```

The stabilizer backend trades gate-set generality for scale — a 100-qubit GHZ state samples at ~6 ms/shot:

```python
n = 100
ghz = Circuit(n)
ghz.h(0)
for q in range(n - 1):
    ghz.cx(q, q + 1)
ghz.measure_all()

counts = get_backend("stabilizer").run(ghz, shots=1000).result().counts
```

Submitting a non-Clifford gate to the stabilizer backend (or an unsupported gate to any backend) raises `UnsupportedGateError` before anything runs.

## Running on IQM hardware

Cloud jobs go through the Light Rider IQM proxy and authenticate with a Light Rider `lr_` API key — you never handle IQM credentials directly. The circuit is transpiled to the QPU's native gates server-side.

**Getting a key:** `lr_` API keys are issued internally by Light Rider — request one from your administrator. There is intentionally no public self-registration; `IQMBackend.register()` exists for administrators only and requires the deployment's admin token.

```python
iqm = get_backend("iqm",
                  endpoint="https://quantum.lightrider.example",  # or LR_QUANTUM_ENDPOINT
                  api_key="lr_...")                               # or LR_QUANTUM_API_KEY

job = iqm.run(circ, shots=1000)   # returns immediately
job.status()                      # WAITING | PROCESSING | COMPLETED | FAILED | ABORTED
job.result()                      # polls until the job is terminal, then returns counts
```

**Mock deployments:** if the proxy is backed by one of IQM's `:mock` QPU endpoints, `run()` emits a `MockBackendWarning`: mock QPUs execute the full job lifecycle but return canned mock entropy instead of running your circuit.

## Serialization

Circuits serialize to the `lr-circuit/v1` JSON payload shared with the Light Rider proxy and `lr-entropy` SDK, and to a Stim-flavored text format:

```python
payload = circ.to_payload()            # dict, JSON-safe
circ2   = Circuit.from_payload(payload)

print(circ.to_text())                  # H 0 / CX 0 1 / M 0 -> 0 ...
circ3 = Circuit.from_text(circ.to_text())
```
