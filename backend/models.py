from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Text
from sqlalchemy.sql import func
from backend.database import Base
from sqlalchemy.orm import relationship
import enum

class UploadStatus(str, enum.Enum):
    QUEUED = "QUEUED"
    PROCESSING = "PROCESSING"
    EXTRACTING = "EXTRACTING"
    ANALYZING = "ANALYZING"
    RETRIEVING = "RETRIEVING"
    GENERATING = "GENERATING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    reports = relationship("Report", back_populates="owner")
    nutrition_profile = relationship("NutritionProfile", back_populates="user", uselist=False)
    nutrition_plans = relationship("NutritionPlan", back_populates="user")


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    filename = Column(String(255), nullable=False)
    original_filename = Column(String(255), nullable=False)
    upload_status = Column(String(50), default=UploadStatus.QUEUED.value)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    owner = relationship("User", back_populates="reports")

class NutritionProfile(Base):
    __tablename__ = "nutrition_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    
    age = Column(Integer, nullable=True)
    sex = Column(String(50), nullable=True)
    height = Column(String(50), nullable=True)
    weight = Column(String(50), nullable=True)
    activity_level = Column(String(100), nullable=True)
    diet_preference = Column(String(100), nullable=True)
    food_allergies = Column(Text, nullable=True)
    food_intolerances = Column(Text, nullable=True)
    vegetarian_type = Column(String(100), nullable=True)
    cultural_preference = Column(String(100), nullable=True)
    foods_liked = Column(Text, nullable=True)
    foods_disliked = Column(Text, nullable=True)
    meal_frequency = Column(String(100), nullable=True)
    typical_wakeup_time = Column(String(50), nullable=True)
    typical_sleep_time = Column(String(50), nullable=True)
    work_study_schedule = Column(Text, nullable=True)
    available_cooking_time = Column(String(100), nullable=True)
    budget_preference = Column(String(100), nullable=True)
    fitness_activity = Column(Text, nullable=True)
    water_intake = Column(String(100), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    user = relationship("User", back_populates="nutrition_profile")

class NutritionPlan(Base):
    __tablename__ = "nutrition_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    plan_data = Column(Text, nullable=False) # JSON structure stored as string
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="nutrition_plans")
