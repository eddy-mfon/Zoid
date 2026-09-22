"""Application entry point / bootstrap.

`main.py` only assembles the app: it loads configuration, creates the FastAPI
instance, installs cross-cutting error handling and mounts the versioned API
router. Domain routers themselves live in their domains. Business logic never
lives here.
"""

from __future__ import annotations

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.api.router import api_router
from app.config import get_settings
from app.shared.exceptions import AppError, status_for


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

    @app.exception_handler(AppError)
    async def app_error_handler(_: Request, exc: AppError) -> JSONResponse:
        """Translate framework-free domain errors into HTTP responses."""
        return JSONResponse(status_code=status_for(exc), content={"detail": exc.message})

    app.include_router(api_router, prefix=settings.api_v1_prefix)
    return app


app = create_app()
