import os
from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base, sessionmaker
import uuid
import datetime

# Replace with your actual Supabase Postgres URL
DATABASE_URL = "postgresql://postgres.clgjswrlcwzmdxhhegtk:[YOUR-PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:6543/postgres"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class PersonalInfo(Base):
    __tablename__ = "personal_information"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    age = Column(Integer, nullable=False)
    height = Column(Float, nullable=False)
    health_condition = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class MovementData(Base):
    __tablename__ = "movement_data"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("personal_information.id"))
    
    # Updated 6-axis data
    a_x = Column(Float)
    a_y = Column(Float)
    a_z = Column(Float)
    g_x = Column(Float)
    g_y = Column(Float)
    g_z = Column(Float)
    
    label = Column(String, default="untagged")
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()