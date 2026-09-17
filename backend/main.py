import os
import uuid
import jwt
from datetime import datetime, timedelta, timezone
from functools import wraps
from flask import Flask, request, jsonify, g, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
from passlib.context import CryptContext
from backend.database import engine, Base, get_db, SessionLocal
from backend.models import User, Report, UploadStatus, NutritionProfile, NutritionPlan
from backend.services.gemini_service import generate_nutrition_plan
import json
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'supersecretkey12345!')
app.config['UPLOAD_FOLDER'] = 'uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg'}

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Create tables
Base.metadata.create_all(bind=engine)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            parts = request.headers['Authorization'].split()
            if len(parts) == 2 and parts[0] == 'Bearer':
                token = parts[1]
        
        if not token:
            return jsonify({'detail': 'Token is missing!'}), 401
            
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            db = SessionLocal()
            current_user = db.query(User).filter(User.email == data['sub']).first()
            db.close()
            if not current_user:
                return jsonify({'detail': 'User not found'}), 401
        except Exception as e:
            return jsonify({'detail': 'Token is invalid!'}), 401
            
        return f(current_user, *args, **kwargs)
    return decorated

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    db = SessionLocal()
    if db.query(User).filter(User.email == data.get('email')).first():
        db.close()
        return jsonify({'detail': 'Email already registered'}), 400
        
    hashed_pw = pwd_context.hash(data.get('password'))
    new_user = User(email=data.get('email'), hashed_password=hashed_pw)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    db.close()
    return jsonify({'id': new_user.id, 'email': new_user.email})

@app.route('/api/auth/login', methods=['POST'])
def login():
    # Frontend sends form-urlencoded because of FastAPI defaults used earlier, we'll parse form
    username = request.form.get('username') or request.json.get('username')
    password = request.form.get('password') or request.json.get('password')
    
    db = SessionLocal()
    user = db.query(User).filter(User.email == username).first()
    db.close()
    
    if not user or not pwd_context.verify(password, user.hashed_password):
        return jsonify({'detail': 'Incorrect email or password'}), 401
        
    token = jwt.encode({
        'sub': user.email,
        'exp': datetime.now(timezone.utc) + timedelta(minutes=30)
    }, app.config['SECRET_KEY'], algorithm="HS256")
    
    return jsonify({'access_token': token, 'token_type': 'bearer'})

@app.route('/api/reports/upload', methods=['POST'])
def upload_report():
    if 'file' not in request.files:
        return jsonify({'detail': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'detail': 'No selected file'}), 400
        
    if file and allowed_file(file.filename):
        ext = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{ext}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        file.save(filepath)
        
        db = SessionLocal()
        new_report = Report(
            user_id=1,  # Hardcoded for bypassed login
            filename=unique_filename,
            original_filename=file.filename,
            upload_status=UploadStatus.QUEUED.value
        )
        db.add(new_report)
        db.commit()
        db.refresh(new_report)
        db.close()
        
        return jsonify({
            'id': new_report.id,
            'filename': new_report.filename,
            'original_filename': new_report.original_filename,
            'upload_status': new_report.upload_status,
            'created_at': new_report.created_at.isoformat()
        })
    return jsonify({'detail': 'Invalid file type. Only PDF, JPG, and PNG are allowed.'}), 400

@app.route('/uploads/<filename>', methods=['GET'])
def serve_upload(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/api/reports', methods=['GET'])
def get_reports():
    db = SessionLocal()
    reports = db.query(Report).filter(Report.user_id == 1).all()
    result = [{
        'id': r.id,
        'filename': r.filename,
        'original_filename': r.original_filename,
        'upload_status': r.upload_status,
        'created_at': r.created_at.isoformat()
    } for r in reports]
    db.close()
    return jsonify(result)

@app.route('/api/profile/nutrition', methods=['GET'])
def get_nutrition_profile():
    db = SessionLocal()
    profile = db.query(NutritionProfile).filter(NutritionProfile.user_id == 1).first()
    db.close()
    if profile:
        return jsonify({c.name: getattr(profile, c.name) for c in profile.__table__.columns if c.name not in ['created_at', 'updated_at']})
    return jsonify({}), 404

@app.route('/api/profile/nutrition', methods=['POST'])
def save_nutrition_profile():
    data = request.json
    db = SessionLocal()
    profile = db.query(NutritionProfile).filter(NutritionProfile.user_id == 1).first()
    
    if not profile:
        profile = NutritionProfile(user_id=1)
        db.add(profile)
        
    for key, value in data.items():
        if hasattr(profile, key) and key not in ['id', 'user_id', 'created_at', 'updated_at']:
            setattr(profile, key, value)
            
    db.commit()
    db.refresh(profile)
    db.close()
    return jsonify({"message": "Profile saved successfully"})

@app.route('/api/nutrition/generate', methods=['POST'])
def generate_plan():
    db = SessionLocal()
    profile = db.query(NutritionProfile).filter(NutritionProfile.user_id == 1).first()
    
    if not profile:
        db.close()
        return jsonify({"detail": "Nutrition profile not found. Please fill out your profile first."}), 400
        
    profile_dict = {c.name: getattr(profile, c.name) for c in profile.__table__.columns if getattr(profile, c.name) is not None}
    
    try:
        plan_data = generate_nutrition_plan(profile_dict)
        
        # Save to DB
        existing_plan = db.query(NutritionPlan).filter(NutritionPlan.user_id == 1).first()
        if existing_plan:
            existing_plan.plan_data = json.dumps(plan_data)
        else:
            new_plan = NutritionPlan(user_id=1, plan_data=json.dumps(plan_data))
            db.add(new_plan)
            
        db.commit()
        db.close()
        return jsonify({"message": "Plan generated successfully", "plan": plan_data})
        
    except Exception as e:
        db.close()
        return jsonify({"detail": str(e)}), 500

@app.route('/api/nutrition/plan', methods=['GET'])
def get_plan():
    db = SessionLocal()
    plan = db.query(NutritionPlan).filter(NutritionPlan.user_id == 1).first()
    db.close()
    if plan:
        return jsonify(json.loads(plan.plan_data))
    return jsonify({"detail": "Plan not found"}), 404

@app.route('/api/chat', methods=['POST'])
def chat_endpoint():
    data = request.json
    message = data.get('message')
    history = data.get('history', [])
    
    if not message:
        return jsonify({"detail": "Message is required"}), 400
        
    try:
        from backend.services.gemini_service import chat_with_gemini
        response_text = chat_with_gemini(message, history)
        return jsonify({"response": response_text})
    except Exception as e:
        return jsonify({"detail": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
