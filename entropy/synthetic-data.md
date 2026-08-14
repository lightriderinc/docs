# Synthetic data

The official `lightrider` SDK can generate synthetic tabular data from quantum randomness and record its provenance.

## Install

```bash
pip install "lightrider[pandas]"
```

## Use cloud EMS entropy

```python
from lightrider import EntropySource, Synthesizer

source = EntropySource(
    "https://ems.lightriderinc.com",
    api_key="lr_...",
    dataset_id="customers_v3",
    allow_failover=False,
)

synth = Synthesizer(entropy=source).fit(df)
rows = synth.generate(10_000)
synth.manifest.write("customers_v3.provenance.json")
```

Set `allow_failover=False` when every draw must be attested. The default allows the operating system CSPRNG to keep a long job running and marks those draws as failover in the manifest.

Try it in the [EMS synthetic data app](https://ems.lightriderinc.com/synthetic).
