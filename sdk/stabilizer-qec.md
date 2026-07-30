# Stabilizer & surface-code QEC

Available in Light Rider SDK 1.3.0.

## Supported stabilizer operations

The local `stabilizer` backend accepts Clifford gates plus:

| Operation | Circuit methods |
|---|---|
| Pauli errors | `x_error`, `y_error`, `z_error` |
| Noise channels | `depolarize1`, `depolarize2`, `pauli_channel_1` |
| Basis measurements | `measure`, `measure_x`, `measure_y` |
| Basis resets | `reset`, `reset_x`, `reset_y` |

```python
from lightrider import Circuit, get_backend

circuit = Circuit(1)
circuit.h(0)
circuit.depolarize1(1e-4, 0)
circuit.measure_x(0)

result = get_backend("stabilizer").run(
    circuit,
    shots=100_000,
    seed=7,
).result()
print(result.counts)
```

## Physical noisy H

`simulate_noisy_h` benchmarks a physical H with one-qubit depolarizing noise:

```python
from lightrider import simulate_noisy_h

physical = simulate_noisy_h(
    error_rate=1e-4,
    shots=1_000_000,
    seed=7,
)
print(physical.as_dict())
```

The experiment uses X-basis readout so errors on the prepared `|+>` state are
observable.

## Logical H with the nine-qubit surface code

`SurfaceCode9` implements the measurement-free `[[9,1,3]]` encoder described
by Goto, Ho, and Kanao in
[Physical Review Research 5, 043137 (2023)](https://doi.org/10.1103/PhysRevResearch.5.043137).
Logical H is transversal across the nine data qubits followed by virtual
qubit relabeling.

```python
from lightrider import PauliNoiseModel, SurfaceCode9

code = SurfaceCode9()
logical = code.simulate_logical_h(
    PauliNoiseModel(one_qubit_error=1e-4),
    shots=1_000_000,
    seed=7,
)
print(logical.as_dict())
```

## Noisy fault-tolerant encoder

Set `noisy_encoder=True` to apply circuit-level noise to the encoder as well
as logical H:

```python
fault_tolerant = code.simulate_logical_h(
    PauliNoiseModel(
        one_qubit_error=1e-4,
        two_qubit_error=1e-4,
    ),
    shots=1_000_000,
    seed=7,
    noisy_encoder=True,
)

verification = code.verify_single_fault_tolerance()
print(fault_tolerant.as_dict())
print(verification)
```

The verification exhaustively checks every X/Y/Z fault after each one-qubit
gate and all 15 non-identity Pauli faults after each CNOT.

## Reproduce the SDK demo

From the Light Rider platform repository:

```bash
PYTHONPATH=lightrider python3 \
  lightrider/examples/stabilizer_surface_code_demo.py
```

The demo prints concise `INFO` records followed by a machine-readable
`SUMMARY`.
