---
title: Synthetic data
---

# Synthetic data

Generate synthetic datasets whose every random draw is quantum, with a signed provenance certificate.

## Overview

The `lightrider` synthesizer fits a Gaussian copula to your dataset and generates new rows in which every random draw comes from quantum entropy — no pseudo-random fallback. Explore it interactively on the [Synthetic data](http://93.127.215.63:8080/synthetic) page.

## Offline vs. live entropy

-   Offline — draws from a bundled IQM QPU bit pool; runs with no network access.
-   Live — draws attested multi-source entropy from the EMS at generation time, so the provenance certificate references verifiable receipts.

## Example

```python
from lightrider import Synthesizer, EntropySource

# Offline: bundled IQM quantum bit pool
synth = Synthesizer(dataset_id="customers_v3").fit(df)
rows  = synth.generate(10_000)          # QRNG-driven synthetic rows

# Live: signed multi-source entropy from the EMS
src   = EntropySource(dataset_id="customers_v3")
synth = Synthesizer(entropy=src).fit(df)
synth.generate(10_000)
synth.manifest.write("customers_v3.provenance.json")
```

## Provenance certificates

Every generated dataset ships with a signed manifest recording the dataset id, entropy origin (bundled pool or live EMS receipts), and generation parameters — so downstream consumers can audit where the randomness came from, not just that the data looks plausible.
