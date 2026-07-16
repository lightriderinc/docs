---
title: Multi-source extraction
---

# Multi-source extraction

Combine independent sources so output stays uniform even if all but one is compromised.

## Why independence matters

Single-source output is only as trustworthy as that source. Multi-source extraction combines streams from two or more independent providers with algebraic extractors so the result remains uniformly random as long as any one contributor is unbiased and uncompromised. Security follows from independence between operators, physical processes, and jurisdictions — not from trust in any single vendor.

## Extraction methods

| Method | Combiner |
| --- | --- |
| sum\_product | GF(2¹²⁸) pairwise sum-product |
| polynomial\_eval | polynomial evaluation extractor |
| cascade | chained cascade combine |

## Requesting multi-source entropy
::: code-group
```python [Python]
from lr_entropy import EntropyClient, ExtractorMethod

cli = EntropyClient("http://localhost:8080")
cli.fetch_verifier()

m = cli.request_multi(
    32,
    method=ExtractorMethod.SUM_PRODUCT,
    sources=["curby_q_jila_001", "qispace_kds_001"],
)
m.receipt.contributing_sources   # both sources, recorded and signed
```
```curl [Curl]
curl -X POST http://localhost:8080/v1/entropy/multi \
  -H 'content-type: application/json' \
  -d '{
    "bytes": 32,
    "method": "sum_product",
    "source_ids": ["curby_q_jila_001", "qispace_kds_001"]
  }'
```

:::
## Guarantees & refusals

-   At least two independent, currently-live sources are required.
-   A named source with no live entropy stream causes the request to be refused — it is never silently substituted from a shared pool.
-   Public/diffusion-only feeds (e.g. the NIST beacon) are credited zero secret entropy: they add mixing, not secrecy.
-   The receipt lists every contributing source, so the independence claim is auditable per response.
