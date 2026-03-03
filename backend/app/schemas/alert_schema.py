from pydantic import BaseModel
from datetime import datetime

class AlertCreate(BaseModel):
    device_id: str
    alert_type: str
    heart_rate: float
    latitude: float
    longitude: float
    source_ip: str

class AlertResponse(BaseModel):
    id: int
    device_id: str
    alert_type: str
    risk_level: str
    source_ip: str
    is_acknowledged: bool
    is_resolved: bool
    is_escalated: bool
    timestamp: datetime

    class Config:
        orm_mode = True