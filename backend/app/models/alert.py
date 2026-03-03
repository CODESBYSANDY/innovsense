from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean
from datetime import datetime
from app.core.database import Base

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(String, index=True)
    alert_type = Column(String)
    heart_rate = Column(Float)
    risk_level = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    source_ip = Column(String)

    is_acknowledged = Column(Boolean, default=False)
    is_resolved = Column(Boolean, default=False)
    is_escalated = Column(Boolean, default=False)

    timestamp = Column(DateTime, default=datetime.utcnow)