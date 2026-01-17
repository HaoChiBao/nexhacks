from fastapi import FastAPI
from app.api.routes import health, portfolios, rebalance

app = FastAPI(title="Polymarket Portfolio Autopilot")

app.include_router(health.router, prefix="/health", tags=["system"])
app.include_router(portfolios.router, prefix="/portfolios", tags=["portfolios"])
app.include_router(rebalance.router, prefix="/rebalance", tags=["rebalance"])

@app.on_event("startup")
async def startup_event():
    print("Starting up Portfolio Autopilot...")

@app.on_event("shutdown")
async def shutdown_event():
    print("Shutting down...")
