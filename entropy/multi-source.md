# Multi-source extraction

Multi-source extraction combines independent contributors. The output remains secure when at least one contributor is unbiased and uncompromised.

## Methods

- `sum_product`: pairwise sum-product over GF(2¹²⁸).
- `polynomial_eval`: polynomial evaluation extractor.
- `cascade`: chained combination.

## Python

```python
from lightrider import EntropyClient, ExtractorMethod

with EntropyClient("https://ems.lightriderinc.com", api_key="lr_...") as client:
    client.fetch_verifier()
    response = client.request_multi(
        32,
        method=ExtractorMethod.SUM_PRODUCT,
        sources=["curby_q_jila_001", "qispace_kds_001"],
    )

print(response.receipt.contributing_sources)
```

## REST

```bash
curl -X POST https://ems.lightriderinc.com/v1/entropy/multi \
  -H "Authorization: Bearer $LR_EMS_API_KEY" \
  -H "content-type: application/json" \
  -d '{
    "bytes": 32,
    "method": "sum_product",
    "source_ids": ["curby_q_jila_001", "qispace_kds_001"]
  }'
```

At least two live sources are required. EMS refuses the request if a named source is unavailable. Public beacons add diffusion but contribute no secret entropy.
