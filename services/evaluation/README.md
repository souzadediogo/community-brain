# Evaluation Service

Python/FastAPI service for benchmarking, metrics, and quality evaluation.

## Responsibilities
- Run automated benchmarks
- Collect performance metrics
- Quality evaluation (LLM-as-judge, BLEU/ROUGE)
- Generate comparison reports
- Track costs and performance over time

## Tech Stack
- Python 3.11+
- FastAPI
- PostgreSQL (metrics storage)
- Jinja2 (report templates)
- pandas (data analysis)

## Features
- Benchmark multiple adapter configurations
- Side-by-side performance comparison
- Quality scoring with GPT-4-as-judge
- Export reports (Markdown, HTML, JSON, CSV)
