from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from src.api.v1.api import api_router as api_v1_router
from src.core.exceptions import GoogleAuthError

app = FastAPI(title="Nuance API")

# Exception Handlers
@app.exception_handler(GoogleAuthError)
async def google_auth_exception_handler(request: Request, exc: GoogleAuthError):
    return JSONResponse(
        status_code=400,
        content={"detail": exc.detail},
    )

# CORS configuration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(api_v1_router, prefix="/api/v1")

@app.get("/", tags=["health"])
async def health_check():
    return {"status": "ok"}
