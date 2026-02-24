from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import certifi
import os
import logging
from pathlib import Path
from pydantic import BaseModel, EmailStr
from typing import Optional, List
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from groq import Groq

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
mongo_client_kwargs = {}
if mongo_url.startswith("mongodb+srv://"):
    mongo_client_kwargs = {
        "tls": True,
        "tlsCAFile": os.environ.get("MONGO_TLS_CA_FILE") or certifi.where(),
    }

client = AsyncIOMotorClient(mongo_url, **mongo_client_kwargs)
db = client[os.environ['DB_NAME']]

JWT_SECRET = os.environ.get('JWT_SECRET', 'flyerssoft-learn-secret-2024-xk9p')
JWT_ALGORITHM = "HS256"
ADMIN_CODE = os.environ.get('ADMIN_CODE', 'FLYERSADMIN2024')
MAX_ADMINS = 3
GROQ_API_KEY = os.environ.get('GROQ_API_KEY', '')

CHATBOT_SYSTEM_PROMPT = """You are FlyersBot, an AI learning assistant for FlyersSoft Learning Studio's 120-day AI/ML internship program based in Chennai, India.

Your role is to help interns with:
- Technical doubts about Python, FastAPI, Machine Learning, Deep Learning, RAG, and Production AI
- Understanding concepts from their daily curriculum tasks
- Debugging code and explaining error messages
- Best practices and real-world tips
- Staying motivated through their learning journey

The curriculum covers:
- Month 1 (Days 1–20): Python Fundamentals — data structures, OOP, NumPy, Pandas
- Month 2 (Days 21–40): FastAPI & Backend Development — REST APIs, JWT auth, MongoDB, async Python
- Month 3 (Days 41–60): Machine Learning — Scikit-learn, supervised/unsupervised learning, model evaluation
- Month 4 (Days 61–80): Advanced Deep Learning — TensorFlow, PyTorch, CNN, RNN, transfer learning
- Month 5 (Days 81–100): RAG & Production AI — LangChain, vector databases, LLMs, MLOps, deployment
- Month 6 (Days 101–120): Capstone Project — system design, full-stack AI, CI/CD, documentation

Guidelines:
- Be concise, clear, and encouraging
- Use code examples when helpful — wrap them in triple backticks with the language name
- If a question is outside the curriculum scope, still try to help or redirect kindly
- For complex problems, break your answer into numbered steps
- Always end with an encouraging note if the intern seems stuck
- If you're unsure about something, be honest and suggest reaching out to mentors at FlyersSoft"""

# Email configuration
SMTP_SERVER = os.environ.get('SMTP_SERVER', 'smtp.gmail.com')
SMTP_PORT = int(os.environ.get('SMTP_PORT', '587'))
SMTP_EMAIL = os.environ.get('SMTP_EMAIL', '')
SMTP_PASSWORD = os.environ.get('SMTP_PASSWORD', '')
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:3000')

app = FastAPI()

# Add CORS middleware FIRST
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["http://localhost:3000", "http://localhost", "127.0.0.1", "*"],
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

api_router = APIRouter(prefix="/api")
security = HTTPBearer()


class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    admin_code: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class AdminLogin(BaseModel):
    email: EmailStr
    password: str
    admin_code: str


class ForgotPassword(BaseModel):
    email: EmailStr


class ResetPassword(BaseModel):
    token: str
    new_password: str


class TaskComplete(BaseModel):
    day_number: int
    task_id: str
    completed: bool


class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))


def create_token(user_id: str, role: str, expires_delta: timedelta = timedelta(days=7)) -> str:
    payload = {
        "user_id": user_id,
        "role": role,
        "exp": datetime.now(timezone.utc) + expires_delta
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def create_reset_token(email: str) -> str:
    payload = {
        "email": email,
        "type": "password_reset",
        "exp": datetime.now(timezone.utc) + timedelta(hours=1)  # 1 hour expiry
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def send_email(to_email: str, subject: str, html_content: str):
    """Send email using SMTP"""
    try:
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = SMTP_EMAIL
        msg['To'] = to_email
        
        html_part = MIMEText(html_content, 'html')
        msg.attach(html_part)
        
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.send_message(msg)
        
        return True
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return False


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user = await db.users.find_one({"id": payload["user_id"]}, {"_id": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


@api_router.post("/auth/register")
async def register(data: UserRegister):
    existing = await db.users.find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    role = "intern"
    if data.admin_code:
        if data.admin_code != ADMIN_CODE:
            raise HTTPException(status_code=400, detail="Invalid admin code")
        admin_count = await db.users.count_documents({"role": "admin"})
        if admin_count >= MAX_ADMINS:
            raise HTTPException(status_code=400, detail="Maximum admin accounts reached")
        role = "admin"

    user_id = str(uuid.uuid4())
    user_doc = {
        "id": user_id,
        "name": data.name,
        "email": data.email,
        "password_hash": hash_password(data.password),
        "role": role,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(user_doc)
    token = create_token(user_id, role)
    return {
        "token": token,
        "user": {
            "id": user_id,
            "name": data.name,
            "email": data.email,
            "role": role
        }
    }


@api_router.post("/auth/login")
async def login(data: UserLogin):
    user = await db.users.find_one({"email": data.email}, {"_id": 0})
    if not user or not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Regular users (interns) only
    if user["role"] != "intern":
        raise HTTPException(status_code=401, detail="Please use admin login")
    
    token = create_token(user["id"], user["role"])
    return {
        "token": token,
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "role": user["role"]
        }
    }


@api_router.post("/auth/admin-login")
async def admin_login(data: AdminLogin):
    # Verify admin code first
    if data.admin_code != ADMIN_CODE:
        raise HTTPException(status_code=401, detail="Invalid admin code")
    
    user = await db.users.find_one({"email": data.email}, {"_id": 0})
    if not user or not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Must be admin role
    if user["role"] != "admin":
        raise HTTPException(status_code=401, detail="Admin access required")
    
    token = create_token(user["id"], user["role"])
    return {
        "token": token,
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "role": user["role"]
        }
    }


@api_router.post("/auth/forgot-password")
async def forgot_password(data: ForgotPassword):
    user = await db.users.find_one({"email": data.email}, {"_id": 0})
    if not user:
        # Don't reveal if email exists or not for security
        return {"message": "If the email exists, a reset link has been sent"}
    
    # Create reset token
    reset_token = create_reset_token(data.email)
    
    # Store reset token in database
    await db.password_resets.update_one(
        {"email": data.email},
        {
            "$set": {
                "token": reset_token,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "used": False
            }
        },
        upsert=True
    )
    
    # Send email
    reset_link = f"{FRONTEND_URL}/reset-password/{reset_token}"
    html_content = f"""
    <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
                <h1 style="color: white; margin: 0;">Password Reset Request</h1>
            </div>
            <div style="background: #f8fafc; padding: 30px; border-radius: 10px; margin-top: 20px;">
                <h2 style="color: #1e293b;">Hello {user['name']},</h2>
                <p style="color: #475569; line-height: 1.6;">
                    We received a request to reset your password for your Flyers Soft Learning Platform account.
                </p>
                <p style="color: #475569; line-height: 1.6;">
                    Click the button below to reset your password. This link will expire in 1 hour.
                </p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{reset_link}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
                        Reset Password
                    </a>
                </div>
                <p style="color: #94a3b8; font-size: 14px;">
                    If you didn't request this, you can safely ignore this email.
                </p>
                <p style="color: #94a3b8; font-size: 14px;">
                    Or copy and paste this link: <br>
                    <a href="{reset_link}" style="color: #667eea;">{reset_link}</a>
                </p>
            </div>
            <div style="text-align: center; margin-top: 20px; color: #94a3b8; font-size: 12px;">
                <p>Flyers Soft Learning Platform</p>
            </div>
        </body>
    </html>
    """
    
    await send_email(data.email, "Reset Your Password - Flyers Soft Learning", html_content)
    
    return {"message": "If the email exists, a reset link has been sent"}


@api_router.post("/auth/reset-password")
async def reset_password(data: ResetPassword):
    try:
        # Verify token
        payload = jwt.decode(data.token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "password_reset":
            raise HTTPException(status_code=400, detail="Invalid token")
        
        email = payload.get("email")
        
        # Check if token has been used
        reset_record = await db.password_resets.find_one({"email": email, "token": data.token})
        if not reset_record or reset_record.get("used"):
            raise HTTPException(status_code=400, detail="Invalid or expired reset link")
        
        # Update password
        user = await db.users.find_one({"email": email})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        await db.users.update_one(
            {"email": email},
            {"$set": {"password_hash": hash_password(data.new_password)}}
        )
        
        # Mark token as used
        await db.password_resets.update_one(
            {"email": email, "token": data.token},
            {"$set": {"used": True}}
        )
        
        return {"message": "Password reset successfully"}
    
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=400, detail="Reset link has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=400, detail="Invalid reset link")


@api_router.get("/auth/me")
async def get_me(user=Depends(get_current_user)):
    return {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "role": user["role"]
    }


@api_router.get("/progress")
async def get_progress(user=Depends(get_current_user)):
    progress = await db.progress.find(
        {"user_id": user["id"]}, {"_id": 0}
    ).to_list(1000)
    return progress


@api_router.post("/progress/complete-task")
async def complete_task(data: TaskComplete, user=Depends(get_current_user)):
    progress = await db.progress.find_one(
        {"user_id": user["id"], "day_number": data.day_number},
        {"_id": 0}
    )

    if not progress:
        progress = {
            "id": str(uuid.uuid4()),
            "user_id": user["id"],
            "day_number": data.day_number,
            "completed_tasks": [],
            "is_completed": False,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        await db.progress.insert_one(progress)

    if data.completed:
        await db.progress.update_one(
            {"user_id": user["id"], "day_number": data.day_number},
            {
                "$addToSet": {"completed_tasks": data.task_id},
                "$set": {"updated_at": datetime.now(timezone.utc).isoformat()}
            }
        )
    else:
        await db.progress.update_one(
            {"user_id": user["id"], "day_number": data.day_number},
            {
                "$pull": {"completed_tasks": data.task_id},
                "$set": {
                    "updated_at": datetime.now(timezone.utc).isoformat(),
                    "is_completed": False
                }
            }
        )

    updated = await db.progress.find_one(
        {"user_id": user["id"], "day_number": data.day_number},
        {"_id": 0}
    )
    return updated


@api_router.post("/progress/complete-day")
async def complete_day(data: dict, user=Depends(get_current_user)):
    day_number = data.get("day_number")
    await db.progress.update_one(
        {"user_id": user["id"], "day_number": day_number},
        {"$set": {
            "is_completed": True,
            "completed_at": datetime.now(timezone.utc).isoformat()
        }},
        upsert=True
    )
    return {"message": "Day completed", "day_number": day_number}


@api_router.get("/admin/users")
async def get_all_users(user=Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    users = await db.users.find(
        {"role": "intern"},
        {"_id": 0, "password_hash": 0}
    ).to_list(1000)

    for u in users:
        progress = await db.progress.find(
            {"user_id": u["id"]}, {"_id": 0}
        ).to_list(1000)
        completed_days = sum(1 for p in progress if p.get("is_completed"))
        u["progress"] = progress
        u["completed_days"] = completed_days
        u["total_days"] = 120

    return users


@api_router.get("/admin/users/{user_id}/progress")
async def get_user_progress(user_id: str, user=Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    target = await db.users.find_one({"id": user_id}, {"_id": 0, "password_hash": 0})
    if not target:
        raise HTTPException(status_code=404, detail="User not found")

    progress = await db.progress.find(
        {"user_id": user_id}, {"_id": 0}
    ).to_list(1000)

    return {"user": target, "progress": progress}


@api_router.post("/chat")
async def chat(data: ChatRequest, user=Depends(get_current_user)):
    if not GROQ_API_KEY:
        raise HTTPException(status_code=500, detail="Chatbot not configured")

    try:
        groq_client = Groq(api_key=GROQ_API_KEY)

        messages = [{"role": "system", "content": CHATBOT_SYSTEM_PROMPT}]

        # Include up to last 10 messages of history for context
        for msg in data.history[-10:]:
            messages.append({"role": msg.role, "content": msg.content})

        messages.append({"role": "user", "content": data.message})

        completion = groq_client.chat.completions.create(
            model="moonshotai/kimi-k2-instruct-0905",
            messages=messages,
            max_tokens=512,
            temperature=0.7,
        )

        reply = completion.choices[0].message.content
        return {"reply": reply}

    except Exception as e:
        logger.error(f"Groq chat error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")


@api_router.get("/health")
async def health():
    return {"status": "healthy"}


@app.get("/")
async def root():
    return {
        "message": "Flyerssoft Learn API",
        "version": "2.0.0",
        "endpoints": {
            "health": "/api/health",
            "register": "/api/auth/register",
            "login": "/api/auth/login",
            "admin_login": "/api/auth/admin-login",
            "forgot_password": "/api/auth/forgot-password",
            "reset_password": "/api/auth/reset-password"
        }
    }


@app.on_event("startup")
async def startup():
    print("\n" + "="*60)
    print("🚀 FLYERSSOFT LEARN API STARTING")
    print("="*60)
    print(f"✅ MongoDB: {os.environ.get('MONGO_URL', 'Not configured')[:50]}...")
    print(f"✅ Database: {os.environ.get('DB_NAME', 'Not configured')}")
    print(f"✅ SMTP Email: {os.environ.get('SMTP_EMAIL', 'Not configured')}")
    print(f"✅ API Routes Ready:")
    print(f"   - POST /api/auth/register")
    print(f"   - POST /api/auth/login")
    print(f"   - POST /api/auth/admin-login")
    print(f"   - POST /api/auth/forgot-password")
    print(f"   - POST /api/auth/reset-password")
    print(f"   - GET  /api/health")
    print("="*60 + "\n")


app.include_router(api_router)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "server:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        log_level="info"
    )
