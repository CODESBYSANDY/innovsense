from sqlalchemy.orm import Session
from app.models.alert import Alert
from app.services.risk_engine import calculate_risk
from app.services.ai_advisor import generate_solution
from app.services.police_notify import notify_cyber_police
from datetime import datetime, timedelta


def create_alert(db: Session, alert_data):
    risk = calculate_risk(alert_data.heart_rate)

    db_alert = Alert(
        device_id=alert_data.device_id,
        alert_type=alert_data.alert_type,
        heart_rate=alert_data.heart_rate,
        risk_level=risk,
        latitude=alert_data.latitude,
        longitude=alert_data.longitude,
        source_ip=alert_data.source_ip,
    )

    db.add(db_alert)
    db.commit()
    db.refresh(db_alert)

    return db_alert


def acknowledge_alert(db: Session, alert_id: int):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    alert.is_acknowledged = True
    db.commit()
    return alert


def resolve_alert(db: Session, alert_id: int):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    alert.is_resolved = True
    db.commit()
    return alert


def get_solution(alert_type: str):
    return generate_solution(alert_type)


def auto_escalate(db: Session):
    alerts = db.query(Alert).filter(
        Alert.risk_level == "HIGH",
        Alert.is_acknowledged == False,
        Alert.is_escalated == False
    ).all()

    for alert in alerts:
        if datetime.utcnow() - alert.timestamp > timedelta(minutes=2):
            success = notify_cyber_police(alert)
            if success:
                alert.is_escalated = True

    db.commit()