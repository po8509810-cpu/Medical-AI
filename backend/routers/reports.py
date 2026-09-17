import os
import shutil
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from backend import models, schemas, auth
from backend.database import get_db

router = APIRouter(
    prefix="/api/reports",
    tags=["Reports"]
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_MIME_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/jpg"]

@router.post("/upload", response_model=schemas.ReportResponse)
def upload_report(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDF, JPG, and PNG are allowed.")

    # Generate a secure unique filename
    ext = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Could not save file")

    # Create database entry
    db_report = models.Report(
        user_id=current_user.id,
        filename=unique_filename,
        original_filename=file.filename,
        upload_status=models.UploadStatus.QUEUED.value
    )
    db.add(db_report)
    db.commit()
    db.refresh(db_report)

    return db_report

@router.get("", response_model=list[schemas.ReportResponse])
def get_reports(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    reports = db.query(models.Report).filter(models.Report.user_id == current_user.id).all()
    return reports
