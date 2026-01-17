from fastapi import APIRouter, HTTPException
from app.services.portfolio_registry import registry

router = APIRouter()

@router.get("/")
def list_portfolios():
    return registry.list_all()

@router.get("/{portfolio_id}")
def get_portfolio(portfolio_id: str):
    p = registry.get(portfolio_id)
    if not p:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    return p
