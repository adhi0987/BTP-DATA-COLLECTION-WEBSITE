from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.core.database import get_db, PersonalInfo, MovementData
from app.schemas.schemas import UserCreate, UserResponse, ControlCommand, LabelUpdate
from app.services import mqtt_client
import uuid

app = FastAPI(title="BTP Data Collection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    mqtt_client.start_mqtt()

@app.post("/users", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = PersonalInfo(**user.model_dump())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    mqtt_client.ACTIVE_USER_ID = db_user.id
    return db_user

@app.post("/control")
def control_watch(cmd: ControlCommand):
    if cmd.command not in ["START", "STOP"]:
        raise HTTPException(status_code=400, detail="Invalid command")
    mqtt_client.publish_control(cmd.command)
    return {"status": "success", "command_sent": cmd.command}

@app.get("/data/export/{user_id}")
def export_data(user_id: uuid.UUID, db: Session = Depends(get_db)):
    data = db.query(MovementData).filter(MovementData.user_id == user_id).order_by(MovementData.timestamp.asc()).all()
    return {"data": data}

@app.put("/data/{data_id}/label")
def update_data_label(data_id: int, payload: LabelUpdate, db: Session = Depends(get_db)):
    data_point = db.query(MovementData).filter(MovementData.id == data_id).first()
    if not data_point:
        raise HTTPException(status_code=404, detail="Data point not found")
    data_point.label = payload.label
    db.commit()
    return {"status": "success", "new_label": data_point.label}