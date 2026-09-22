"""Application entry point / bootstrap.

`main.py` only assembles the app: it loads configuration and creates the
FastAPI instance. Domain routers and middleware/protection wiring are added in
later phases (Phase 16). Business logic never lives here.
"""

from __future__ import annotations

from fastapi import FastAPI

from app.config import get_settings


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title=settings.app_name,
        version="0.1.0",
        debug=settings.debug,
    )

    @app.get("/health", tags=["system"])
    async def health() -> dict[str, str]:
        """Liveness probe used for bootstrap/deployment verification."""
        return {"status": "ok", "service": settings.app_name}

    return app


app = create_app()
