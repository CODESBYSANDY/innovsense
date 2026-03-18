!pip install uvicorn
from fastapi import FastAPI
from app.core.database import engine, Base
from app.api.alert_routes import router as alert_router
from app.core.config import settings
from app.api.dashboard_routes import router as dashboard_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION
)

app.include_router(alert_router, prefix="/alerts", tags=["Alerts"])
app.include_router(dashboard_router, prefix="/dashboard", tags=["Dashboard"])

@app.get("/")
def root():
    return {"message": "SentriEdge AI Backend Running"}
