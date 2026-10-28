---
title: Hugging Face
---

# Hugging Face

Light Rider publishes a demo Space and a set of example datasets on Hugging Face. They are grouped in the [Quantum Entropy collection](https://huggingface.co/collections/LightRiderInc/quantum-entropy).

## Demo Space

The [Quantum Entropy Space](https://huggingface.co/spaces/LightRiderInc/Quantum-Entropy) lets anyone try Light Rider Entropy without an account:

1. Pick a quantum source.
2. Generate bytes.
3. Review the verified receipt for the draw.

The Space runs on a dedicated Light Rider account with its own credits and daily limits. To draw entropy from your own code, use the [developer API](/entropy/developer-api) or the [Python SDK](/entropy/python-sdk).

## Example datasets

Light Rider has published eight example datasets built with [`lightrider-huggingface`](/entropy/datasets). Together they use all six sources.

| Dataset | Contents | Source |
|---|---|---|
| [random-quantum-circuits](https://huggingface.co/datasets/LightRiderInc/random-quantum-circuits) | 500 random 5-qubit circuits for benchmarking | ANU |
| [random-circuits-8q-rigetti](https://huggingface.co/datasets/LightRiderInc/random-circuits-8q-rigetti) | Random 8-qubit circuits | Rigetti |
| [random-clifford-circuits-iqm](https://huggingface.co/datasets/LightRiderInc/random-clifford-circuits-iqm) | Random Clifford circuits | IQM |
| [gsm8k-random-200-cisco](https://huggingface.co/datasets/LightRiderInc/gsm8k-random-200-cisco) | 200 random rows of GSM8K | Cisco |
| [mmlu-random-sample-qispace](https://huggingface.co/datasets/LightRiderInc/mmlu-random-sample-qispace) | 500 random rows of MMLU | QiSpace |
| [humaneval-random-sample-iqm-qec](https://huggingface.co/datasets/LightRiderInc/humaneval-random-sample-iqm-qec) | 50 random rows of HumanEval | Light Rider QEC |
| [truthfulqa-random-200-anu](https://huggingface.co/datasets/LightRiderInc/truthfulqa-random-200-anu) | 200 random rows of TruthfulQA | ANU |
| [bbq-random-500-cisco](https://huggingface.co/datasets/LightRiderInc/bbq-random-500-cisco) | 500 random rows of BBQ | Cisco |

Browse all of them at [huggingface.co/LightRiderInc/datasets](https://huggingface.co/LightRiderInc/datasets). Each dataset includes its signed receipt and provenance record, so anyone can [verify it](/entropy/datasets#verify-a-dataset).
