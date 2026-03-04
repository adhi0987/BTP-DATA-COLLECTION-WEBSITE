from pydantic import BaseModel

# Add this schema at the top or in schemas.py
class LabelUpdate(BaseModel):
    label: str

# Add this endpoint to main.py
@app.put("/data/{data_id}/label")
def update_data_label(data_id: int, payload: LabelUpdate, db: Session = Depends(get_db)):
    data_point = db.query(MovementData).filter(MovementData.id == data_id).first()
    if not data_point:
        raise HTTPException(status_code=404, detail="Data point not found")
    
    data_point.label = payload.label
    db.commit()
    return {"status": "success", "new_label": data_point.label}