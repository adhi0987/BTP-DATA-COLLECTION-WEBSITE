from pydantic import BaseModel
from typing import Optional
import uuid

class UserCreate(BaseModel):
    age: int
    height: float
    health_condition: Optional[str] = None

class UserResponse(UserCreate):
    id: uuid.UUID
    class Config:
        from_attributes = True

class ControlCommand(BaseModel):
    command: str

class LabelUpdate(BaseModel):
    label: str