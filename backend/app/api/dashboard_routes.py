from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.alert import Alert
from sqlalchemy import func

router = APIRouter()

@router.get("/stats")
def dashboard_stats(db: Session = Depends(get_db)):
    total = db.query(func.count(Alert.id)).scalar()
    high = db.query(func.count(Alert.id)).filter(Alert.risk_level == "HIGH").scalar()
    medium = db.query(func.count(Alert.id)).filter(Alert.risk_level == "MEDIUM").scalar()
    low = db.query(func.count(Alert.id)).filter(Alert.risk_level == "LOW").scalar()

    return {
        "total": total,
        "high": high,
        "medium": medium,
        "low": low
    }