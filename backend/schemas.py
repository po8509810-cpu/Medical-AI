from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    created_at: datetime

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class ReportResponse(BaseModel):
    id: int
    filename: str
    original_filename: str
    upload_status: str
    created_at: datetime

    class Config:
        orm_mode = True

class NutritionProfileBase(BaseModel):
    age: Optional[int] = None
    sex: Optional[str] = None
    height: Optional[str] = None
    weight: Optional[str] = None
    activity_level: Optional[str] = None
    diet_preference: Optional[str] = None
    food_allergies: Optional[str] = None
    food_intolerances: Optional[str] = None
    vegetarian_type: Optional[str] = None
    cultural_preference: Optional[str] = None
    foods_liked: Optional[str] = None
    foods_disliked: Optional[str] = None
    meal_frequency: Optional[str] = None
    typical_wakeup_time: Optional[str] = None
    typical_sleep_time: Optional[str] = None
    work_study_schedule: Optional[str] = None
    available_cooking_time: Optional[str] = None
    budget_preference: Optional[str] = None
    fitness_activity: Optional[str] = None
    water_intake: Optional[str] = None

class NutritionProfileCreate(NutritionProfileBase):
    pass

class NutritionProfileUpdate(NutritionProfileBase):
    pass

class NutritionProfileResponse(NutritionProfileBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class NutritionPlanResponse(BaseModel):
    id: int
    user_id: int
    plan_data: str
    created_at: datetime

    class Config:
        orm_mode = True
