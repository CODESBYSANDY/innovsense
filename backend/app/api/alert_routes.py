from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.schemas.alert_schema import AlertCreate, AlertResponse
from app.crud import alert_crud

router = APIRouter()

@router.post("/", response_model=AlertResponse)
def create_alert(alert: AlertCreate, db: Session = Depends(get_db)):
    return alert_crud.create_alert(db, alert)

@router.get("/", response_model=List[AlertResponse])
def get_alerts(db: Session = Depends(get_db)):
    return db.query(alert_crud.Alert).all()

@router.put("/ack/{alert_id}")
def acknowledge(alert_id: int, db: Session = Depends(get_db)):
    return alert_crud.acknowledge_alert(db, alert_id)

@router.put("/resolve/{alert_id}")
def resolve(alert_id: int, db: Session = Depends(get_db)):
    return alert_crud.resolve_alert(db, alert_id)

@router.get("/ai-suggest/{alert_type}")
def ai_suggest(alert_type: str):
    return alert_crud.get_solution(alert_type)