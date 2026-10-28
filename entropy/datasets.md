---
title: Provable datasets
---

# Provable datasets

The `lightrider-huggingface` package on [PyPI](https://pypi.org/project/lightrider-huggingface/) builds Hugging Face datasets from a seed drawn from a named quantum source. The seed comes with a signed receipt, so anyone can check where it came from and regenerate the dataset exactly.

It builds two kinds of dataset:

- **Random quantum circuits**, for example a set of circuits for benchmarking.
- **Random evaluation subsets**: rows sampled from an existing Hugging Face dataset, pinned to an exact revision so the same rows can always be fetched again.

## Install

```bash
pip install lightrider-huggingface
```

Creating a dataset requires a Light Rider API key and costs one draw (1 credit). Publishing requires a Hugging Face token with write access. Verifying requires neither.

```bash
export LR_API_KEY=lr_live_...
export HF_TOKEN=hf_...
```

## Create a dataset

Random circuits:

```python
import lightrider_huggingface as lrhf

ds = lrhf.circuits(500, num_qubits=5, depth=10, source="anu")
```

Random evaluation subset:

```python
ds = lrhf.eval_subset("openai/gsm8k", "test", n=200, config="main", source="anu")
```

Pass `fraction=0.1` instead of `n` to sample a share of the split. Use `ds.to_pandas()` to work with the rows locally.

## Publish

```python
lrhf.publish(ds, "your-username/random-circuits-5q")
```

This uploads the data, a dataset card, the signed receipt, and a provenance record (`lightrider_provenance.json`). Datasets are private unless you pass `private=False`.

## Verify a dataset

```python
import lightrider_huggingface as lrhf

report = lrhf.verify("your-username/random-circuits-5q")
print(report)
assert report.ok
```

No Light Rider key is needed. Set `HF_TOKEN` to verify a private dataset. For a subset of a very large dataset, `verify(..., indices_only=True)` skips downloading the source data again.

Verification runs three checks:

1. **The receipt is genuine.** Its Ed25519 signature matches the Light Rider public key.
2. **The seed is that draw's output.** The receipt includes a hash of the exact bytes drawn, so a seed from any other draw does not match.
3. **The data follows from the seed.** Generation is deterministic, so the rows are rebuilt from the seed and compared with the published ones.

A receipt cannot show that the publisher drew only once. Its timestamp shows when the draw happened.
