from fastapi import FastAPI
from app.api.routes import health, portfolios, rebalance

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Polymarket Portfolio Autopilot")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/health", tags=["system"])
app.include_router(portfolios.router, prefix="/portfolios", tags=["portfolios"])
app.include_router(rebalance.router, prefix="/rebalance", tags=["rebalance"])
from app.api.routes import funds
app.include_router(funds.router, prefix="/funds", tags=["funds"])

@app.on_event("startup")
async def startup_event():
    print("Starting up Portfolio Autopilot...")

@app.on_event("shutdown")
async def shutdown_event():
    print("Shutting down...")
