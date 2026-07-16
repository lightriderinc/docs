# Synthetic Data with Provenance

`Synthesizer` fits a Gaussian copula to tabular data and generates new rows whose every random draw comes from a quantum source. Each dataset ships with a provenance manifest binding it to the entropy that produced it.

```python
from lightrider import Synthesizer

synth = Synthesizer(dataset_id="customers_v3").fit(df)   # DataFrame / dict / records
rows  = synth.generate(10_000)

synth.manifest.write("customers_v3.provenance.json")
print(synth.certificate())
```

## How it works

```
fit:   data ─▶ marginals (empirical CDF / category freqs)
             ─▶ normal scores  z = Φ⁻¹(rank)
             ─▶ correlation Σ = corr(z),  Cholesky  Σ = L Lᵀ

gen:   QRNG ─▶ U(0,1)          (quantum draws, recorded on the manifest)
             ─▶ Z₀ = Φ⁻¹(U)    (iid standard normals)
             ─▶ Z  = Z₀ Lᵀ     (impose learned correlation)
             ─▶ U' = Φ(Z)      (back to uniform, per column)
             ─▶ x  = F⁻¹(U')   (inverse marginal → synthetic value)
```

The copula reproduces each column's marginal distribution and inter-column correlations; the randomness selecting each synthetic row is quantum, not a PRNG. The full mathematical treatment is in the repository under `docs/qrng-synthetic-data.pdf`.

## Entropy modes

| Mode | Provider | Provenance |
|------|----------|-----------|
| **bundled-qrng** (default) | `BundledQrng` over the packaged IQM pool | Real quantum bits, SHA-256 debiased, offline, unsigned |
| **live-attested** | `EntropySource` against a Light Rider EMS | Multi-source extraction over GF(2¹²⁸), SP 800-90B health-tested, post-quantum-signed receipts |

```python
from lightrider import EntropySource, Synthesizer   # requires the lr-entropy SDK

src   = EntropySource("http://localhost:7081", dataset_id="customers_v3")
synth = Synthesizer(entropy=src).fit(df)
rows  = synth.generate(10_000)     # every draw carries a signed receipt
```

`EntropySource(allow_failover=True)` (the default) falls back to the OS CSPRNG on any EMS error so a long job never blocks. Failover draws are flagged in the manifest and excluded from the certificate's source list — the certificate never overstates its provenance.

## The manifest

```json
{
  "dataset_id": "customers_v3", "model": "qrng-copula",
  "rows": 10000, "columns": ["age", "income", "tier", "region"],
  "entropy_mode": "live-attested", "fully_attested": true,
  "signature_alg": "ML-DSA-65", "post_quantum_signed": true,
  "sources_used": ["curby_q_jila_001", "qispace_kds_001"],
  "min_quality_score": 90, "health_all_pass": true,
  "extractors": ["SHAKE256"], "failover_used": false
}
```

In the offline default the same manifest reports `entropy_mode: "bundled-qrng"` and `post_quantum_signed: false` — honest by construction.
