# Zoid Jerseys Backend

FastAPI backend for the Zoid jersey storefront, built on a modular hexagonal
architecture (domains / security / infrastructure / integrations). Provider
integrations (payments, email, storage), the database, and the auth/session
strategy are all replaceable behind stable internal interfaces.

## Prerequisites

- Python 3.14+
- [uv](https://docs.astral.sh/uv/) for dependency/environment management
- PostgreSQL (for persistence phases)

## Setup

```powershell
cd backend
uv venv                       # create .venv (already present in this repo)
.\.venv\Scripts\Activate.ps1  # activate the virtual environment
uv sync                       # install locked dependencies
```

Copy `.env.example` to `.env` and fill in real values. Secrets are always read
from the environment — never hardcoded.

## Run the API

```powershell
uv run uvicorn app.main:app --reload
```

## Tests & linting

```powershell
uv run pytest
uv run ruff check .
```

## Architecture

See `docs/architecture.md` (design) and `docs/implementation_roadmap.md`
(phase-by-phase build plan). The backend is delivered strictly one gated phase
at a time.
