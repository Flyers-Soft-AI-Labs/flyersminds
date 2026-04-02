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
import httpx
import asyncio
from groq import AsyncGroq

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
mongo_client_kwargs = {}
if mongo_url.startswith("mongodb+srv://"):
    mongo_client_kwargs = {
        "tls": True,
        "tlsCAFile": certifi.where(),
        "tlsAllowInvalidCertificates": True,
        "serverSelectionTimeoutMS": 30000,
        "connectTimeoutMS": 30000,
        "socketTimeoutMS": 30000,
    }

client = AsyncIOMotorClient(mongo_url, **mongo_client_kwargs)
db = client[os.environ['DB_NAME']]

JWT_SECRET = os.environ.get('JWT_SECRET', 'flyerssoft-learn-secret-2024-xk9p')
JWT_ALGORITHM = "HS256"
ADMIN_CODE = os.environ.get('ADMIN_CODE', 'FLYERSADMIN2024')
MAX_ADMINS = 10
GROQ_API_KEY = os.environ.get('GROQ_API_KEY', '')

CHATBOT_SYSTEM_PROMPT = """You are FlyersMind Bot, a Socratic AI tutor for Flyers Minds's 120-day AI/ML internship program based in Chennai, India.

## YOUR CORE TEACHING PHILOSOPHY
You NEVER give direct answers immediately. You guide interns to discover answers themselves through hints and guiding questions. This builds deeper understanding and retention.

## SOCRATIC TEACHING FLOW
Count the number of back-and-forth exchanges on the CURRENT question/topic in the conversation history.

**Exchange 1 (First response to a new question):**
- Do NOT reveal the answer
- Give 1–2 broad hints or clues that point in the right direction
- Ask one guiding question to trigger their thinking
- Example: "Think about what happens to data when... What do you think that implies?"

**Exchange 2 (User still hasn't got it):**
- Give a slightly more specific hint
- Acknowledge what they got right (if anything)
- Ask another focused guiding question
- Example: "You're on the right track! Now consider this: if X happens, what must Y be?"

**Exchange 3 (User still struggling):**
- Give a strong hint or a partial answer/skeleton
- Break the concept into a smaller piece they can fill in
- Example: "Here's a skeleton — can you fill in the blank? `result = list.___()` "

**Exchange 4+ (User has not arrived at correct answer after 3+ attempts):**
- Now reveal the full correct answer with a clear explanation
- Show a code example if relevant
- Summarise the key concept so they remember it
- Say something like: "Great effort! Here's the full answer — make sure to revisit this concept."

## IF THE USER ANSWERS CORRECTLY (at any exchange):
- Congratulate them enthusiastically
- Confirm and reinforce the correct concept
- Optionally add one interesting related tip
- Move on naturally

## JUDGING CORRECTNESS
- If the user's answer is partially correct, acknowledge what's right, then hint at what's missing
- If the user says "I don't know" or "just tell me" or "give me the answer", you may reveal the answer directly with encouragement
- If the question is purely factual/definitional (not a problem-solving question), you may answer directly but still add a follow-up question to deepen understanding

## CURRICULUM CONTEXT
- Month 1 (Days 1–20): Python Fundamentals — data structures, OOP, NumPy, Pandas
- Month 2 (Days 21–40): FastAPI & Backend Development — REST APIs, JWT auth, MongoDB, async Python
- Month 3 (Days 41–60): Machine Learning — Scikit-learn, supervised/unsupervised learning, model evaluation
- Month 4 (Days 61–80): Advanced Deep Learning — TensorFlow, PyTorch, CNN, RNN, transfer learning
- Month 5 (Days 81–100): RAG & Production AI — LangChain, vector databases, LLMs, MLOps, deployment
- Month 6 (Days 101–120): Capstone Project — system design, full-stack AI, CI/CD, documentation

## SCOPE — STRICT BOUNDARY
You ONLY answer questions that are directly related to the Flyers Minds 120-day AI/ML internship curriculum listed above. This includes:
- Python, NumPy, Pandas, OOP
- FastAPI, REST APIs, JWT, MongoDB, async Python
- Machine Learning, Scikit-learn, model evaluation
- Deep Learning, TensorFlow, PyTorch, CNN, RNN
- RAG, LangChain, LLMs, vector databases, MLOps, deployment
- Capstone project topics, system design, full-stack AI

If a question is about ANYTHING outside this scope (e.g., general trivia, cooking, sports, politics, unrelated programming languages, personal advice, current events, etc.), respond with exactly:
"That's outside the scope of the Flyers Minds AI/ML curriculum. I can only help with topics covered in your internship program. Feel free to ask me anything related to Python, ML, Deep Learning, FastAPI, or your capstone project!"

Do NOT attempt to answer out-of-scope questions even partially. Redirect immediately.

## GENERAL GUIDELINES
- Be warm, encouraging, and patient — never make the intern feel bad for not knowing
- Use code examples when giving hints (partial/skeleton code is fine in early exchanges)
- Wrap all code in triple backticks with the language name
- Keep responses concise — hints should be short and focused, not overwhelming
- If unsure about something within the curriculum, be honest and suggest reaching out to mentors at Flyers Minds"""

# Email configuration (Brevo API)
BREVO_API_KEY = os.environ.get('BREVO_API_KEY', '')
BREVO_SENDER_EMAIL = os.environ.get('BREVO_SENDER_EMAIL', '')
FROM_NAME = os.environ.get('FROM_NAME', 'Flyers Minds')
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
security = HTTPBearer(auto_error=False)


class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    admin_code: Optional[str] = None
    course: Optional[str] = 'aiml'


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


class UpdateEmail(BaseModel):
    current_password: str
    new_email: EmailStr


class UpdatePassword(BaseModel):
    current_password: str
    new_password: str


class UpdateAvatar(BaseModel):
    avatar: str  # base64 data URL


class CurriculumOverride(BaseModel):
    topic: Optional[str] = None
    resource_links: Optional[List[dict]] = None


class GitSubmission(BaseModel):
    day_number: int
    repo_url: str
    branch: str


class CodeExecuteRequest(BaseModel):
    language: str
    code: str


class QuizMCQAnswer(BaseModel):
    question_id: int
    question: str
    options: List[str]
    selected_index: int  # -1 if not answered

class QuizCodingAnswer(BaseModel):
    question_id: int
    actual_output: str
    expected_output: str
    code: str = ""
    runnable: bool = True
    task_description: str = ""

class QuizGradeRequest(BaseModel):
    mcq_answers: List[QuizMCQAnswer]
    coding_answers: List[QuizCodingAnswer]


class CodeSnippetSave(BaseModel):
    day_number: int
    snippet_id: str
    language: str
    code: str


class AdminPasswordChange(BaseModel):
    new_password: str


class EnrollmentCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    course: Optional[str] = 'aiml'
    message: Optional[str] = None


# Compiler cache populated lazily on first execution request
_wandbox_compiler_map: dict = {}

# Preferred compiler prefixes per language (newest first)
_COMPILER_PREFS = {
    "python":     ["cpython-3.13", "cpython-3.12", "cpython-3.11", "cpython-3.10"],
    "javascript": ["nodejs-22", "nodejs-20", "nodejs-18"],
    "java":       ["openjdk-21", "openjdk-17"],
    "c":          ["gcc-14", "gcc-13", "gcc-12", "gcc-11"],
    "cpp":        ["gcc-14", "gcc-13", "gcc-12", "gcc-11"],
}

_COMPILER_FALLBACK = {
    "python":     "cpython-3.12.5",
    "javascript": "nodejs-20.11.0",
    "java":       "openjdk-21.0.1",
    "c":          "gcc-13.2.0",
    "cpp":        "gcc-13.2.0",
}


async def get_wandbox_compiler_map() -> dict:
    """Fetch available Wandbox compilers once and cache them."""
    global _wandbox_compiler_map
    if _wandbox_compiler_map:
        return _wandbox_compiler_map

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get("https://wandbox.org/api/list.json")
            if resp.status_code != 200:
                raise ValueError(f"Wandbox list returned {resp.status_code}")
            compiler_names = [c["name"] for c in resp.json()]

        result = {}
        for lang, prefs in _COMPILER_PREFS.items():
            for pref in prefs:
                match = next((n for n in compiler_names if n.startswith(pref)), None)
                if match:
                    result[lang] = match
                    break
            if lang not in result:
                result[lang] = _COMPILER_FALLBACK[lang]

        _wandbox_compiler_map = result
        logger.info(f"Wandbox compilers selected: {_wandbox_compiler_map}")
    except Exception as exc:
        logger.warning(f"Wandbox compiler list fetch failed ({exc}), using fallback")
        _wandbox_compiler_map = _COMPILER_FALLBACK.copy()

    return _wandbox_compiler_map


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
        "purpose": "password_reset",
        "exp": datetime.now(timezone.utc) + timedelta(hours=1)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def create_course_access_token(enrollment_id: str, email: str, course: str) -> str:
    payload = {
        "purpose": "course_access",
        "enrollment_id": enrollment_id,
        "email": email,
        "course": course,
        "exp": datetime.now(timezone.utc) + timedelta(days=7)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def send_email(to_email: str, subject: str, html_content: str) -> bool:
    """Send email via Brevo SMTP API. Returns True on success, raises on hard failure."""
    if not BREVO_API_KEY or not BREVO_SENDER_EMAIL:
        logger.error("BREVO_API_KEY or BREVO_SENDER_EMAIL not set — email not sent.")
        return False
    try:
        async with httpx.AsyncClient(timeout=20) as http_client:
            response = await http_client.post(
                "https://api.brevo.com/v3/smtp/email",
                headers={
                    "api-key": BREVO_API_KEY,
                    "Content-Type": "application/json",
                    "accept": "application/json",
                },
                json={
                    "sender": {"name": FROM_NAME, "email": BREVO_SENDER_EMAIL},
                    "to": [{"email": to_email, "name": to_email}],
                    "subject": subject,
                    "htmlContent": html_content,
                },
            )
        if response.status_code in (200, 201):
            logger.info(f"Email sent successfully to {to_email} (status {response.status_code})")
            return True
        else:
            logger.error(f"Brevo API error {response.status_code}: {response.text}")
            return False
    except httpx.TimeoutException:
        logger.error(f"Brevo API timed out sending to {to_email}")
        return False
    except Exception as e:
        logger.error(f"Unexpected error sending email to {to_email}: {e}")
        return False


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials or not credentials.credentials:
        raise HTTPException(status_code=401, detail="Not authenticated. Please log in.")
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user = await db.users.find_one({"id": payload["user_id"]}, {"_id": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found. Please log in again.")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expired. Please log in again.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid session. Please log in again.")


@api_router.post("/auth/register")
async def register(data: UserRegister):
    email = data.email.lower().strip()
    existing = await db.users.find_one({"email": email})
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
        "email": email,
        "password_hash": hash_password(data.password),
        "role": role,
        "course": data.course if role == "intern" else None,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(user_doc)
    token = create_token(user_id, role)
    return {
        "token": token,
        "user": {
            "id": user_id,
            "name": data.name,
            "email": email,
            "role": role
        }
    }


@api_router.post("/auth/login")
async def login(data: UserLogin):
    user = await db.users.find_one({"email": data.email.lower().strip()}, {"_id": 0})
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

    user = await db.users.find_one({"email": data.email.lower().strip()}, {"_id": 0})
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
    email = data.email.lower().strip()
    user = await db.users.find_one({"email": email}, {"_id": 0})
    if not user:
        return {"message": "If the email exists, a reset link has been sent"}

    reset_token = create_reset_token(email)
    reset_link = f"{FRONTEND_URL}/reset-password/{reset_token}"

    html_content = f"""
    <html>
      <body style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 20px; background: #f8fafc;">
        <div style="background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%); padding: 32px; border-radius: 16px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 22px;">Flyers Minds</h1>
          <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">Password Reset</p>
        </div>
        <div style="background: white; padding: 32px; border-radius: 16px; margin-top: 16px; text-align: center; box-shadow: 0 2px 12px rgba(0,0,0,0.06);">
          <p style="color: #475569; margin: 0 0 24px;">Hi {user['name']}, click the button below to reset your password. The link expires in <strong>1 hour</strong>.</p>
          <a href="{reset_link}" style="display: inline-block; background: linear-gradient(135deg, #0ea5e9, #6366f1); color: white; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 700; font-size: 15px;">Reset Password</a>
          <p style="color: #94a3b8; font-size: 12px; margin: 24px 0 8px;">Or paste this link in your browser:</p>
          <p style="color: #64748b; font-size: 12px; word-break: break-all; margin: 0;">{reset_link}</p>
          <p style="color: #94a3b8; font-size: 13px; margin: 24px 0 0;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      </body>
    </html>
    """

    await send_email(email, "Reset Your Password - Flyers Minds", html_content)
    return {"message": "If the email exists, a reset link has been sent"}


@api_router.post("/auth/reset-password")
async def reset_password(data: ResetPassword):
    try:
        payload = jwt.decode(data.token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("purpose") != "password_reset":
            raise HTTPException(status_code=400, detail="Invalid reset token")
        email = payload.get("email")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=400, detail="Reset link has expired. Please request a new one.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=400, detail="Invalid or malformed reset link")

    if len(data.new_password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    await db.users.update_one(
        {"email": email},
        {"$set": {"password_hash": hash_password(data.new_password), "updated_at": datetime.now(timezone.utc).isoformat()}}
    )

    return {"message": "Password reset successfully"}


@api_router.get("/auth/me")
async def get_me(user=Depends(get_current_user)):
    return {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "role": user["role"],
        "avatar": user.get("avatar")
    }


@api_router.put("/user/email")
async def update_email(data: UpdateEmail, user=Depends(get_current_user)):
    if not verify_password(data.current_password, user["password_hash"]):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    new_email = data.new_email.lower().strip()
    if new_email == user["email"]:
        raise HTTPException(status_code=400, detail="New email is the same as the current email")

    existing = await db.users.find_one({"email": new_email})
    if existing:
        raise HTTPException(status_code=400, detail="Email is already in use by another account")

    await db.users.update_one(
        {"id": user["id"]},
        {"$set": {"email": new_email, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    return {
        "message": "Email updated successfully",
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": new_email,
            "role": user["role"]
        }
    }


@api_router.put("/user/avatar")
async def update_avatar(data: UpdateAvatar, user=Depends(get_current_user)):
    if not data.avatar.startswith("data:image/"):
        raise HTTPException(status_code=400, detail="Invalid image format")
    await db.users.update_one(
        {"id": user["id"]},
        {"$set": {"avatar": data.avatar, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    return {"message": "Avatar updated successfully", "avatar": data.avatar}


@api_router.put("/user/password")
async def update_password(data: UpdatePassword, user=Depends(get_current_user)):
    if not verify_password(data.current_password, user["password_hash"]):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    if len(data.new_password) < 6:
        raise HTTPException(status_code=400, detail="New password must be at least 6 characters")

    await db.users.update_one(
        {"id": user["id"]},
        {"$set": {"password_hash": hash_password(data.new_password), "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    return {"message": "Password updated successfully"}


@api_router.get("/progress")
async def get_progress(user=Depends(get_current_user)):
    progress = await db.progress.find(
        {"user_id": user["id"]}, {"_id": 0}
    ).to_list(1000)

    # Lazy-repair: if a day has a git submission + completed tasks but is_completed is
    # still False (caused by old silent-failure bug), mark it complete now.
    if user["role"] != "admin":
        for p in progress:
            if p.get("is_completed") or not p.get("completed_tasks"):
                continue
            git_sub = await db.git_submissions.find_one(
                {"user_id": user["id"], "day_number": p["day_number"]}
            )
            if git_sub:
                await db.progress.update_one(
                    {"user_id": user["id"], "day_number": p["day_number"]},
                    {"$set": {
                        "is_completed": True,
                        "completed_at": datetime.now(timezone.utc).isoformat()
                    }}
                )
                p["is_completed"] = True  # also fix the in-memory copy returned now

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

    # Interns must have submitted git work before completing the day
    if user["role"] != "admin":
        git_sub = await db.git_submissions.find_one(
            {"user_id": user["id"], "day_number": day_number}
        )
        if not git_sub:
            raise HTTPException(
                status_code=400,
                detail="You must submit your Git work before completing the day"
            )

    await db.progress.update_one(
        {"user_id": user["id"], "day_number": day_number},
        {"$set": {
            "is_completed": True,
            "completed_at": datetime.now(timezone.utc).isoformat()
        }},
        upsert=True
    )
    return {"message": "Day completed", "day_number": day_number}


@api_router.post("/progress/submit-git")
async def submit_git(data: GitSubmission, user=Depends(get_current_user)):
    if user["role"] == "admin":
        raise HTTPException(status_code=403, detail="Admins do not submit git work")
    if not data.repo_url.strip().startswith("https://github.com/"):
        raise HTTPException(status_code=400, detail="Repo URL must start with https://github.com/")
    if not data.branch.strip():
        raise HTTPException(status_code=400, detail="Branch name cannot be empty")

    submission_doc = {
        "user_id": user["id"],
        "day_number": data.day_number,
        "repo_url": data.repo_url.strip(),
        "branch": data.branch.strip(),
        "submitted_at": datetime.now(timezone.utc).isoformat()
    }
    await db.git_submissions.update_one(
        {"user_id": user["id"], "day_number": data.day_number},
        {"$set": submission_doc},
        upsert=True
    )
    return submission_doc


@api_router.get("/progress/git/{day_number}")
async def get_git_submission(day_number: int, user=Depends(get_current_user)):
    submission = await db.git_submissions.find_one(
        {"user_id": user["id"], "day_number": day_number},
        {"_id": 0}
    )
    return submission or {}


@api_router.get("/admin/users")
async def get_all_users(course: Optional[str] = None, user=Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    query = {"role": "intern"}
    if course:
        if course == "aiml":
            # Include interns with course='aiml' AND legacy interns with no course field
            query["$or"] = [{"course": "aiml"}, {"course": {"$exists": False}}, {"course": None}]
        else:
            query["course"] = course

    users = await db.users.find(
        query,
        {"_id": 0, "password_hash": 0}
    ).to_list(1000)

    for u in users:
        try:
            user_id_str = u.get("id")
            if not user_id_str:
                u["progress"] = []
                u["completed_days"] = 0
                u["active_days"] = 0
                u["total_days"] = 120
                u["git_submissions"] = []
                continue

            progress = await db.progress.find(
                {"user_id": user_id_str}, {"_id": 0}
            ).to_list(1000)
            git_subs = await db.git_submissions.find(
                {"user_id": user_id_str}, {"_id": 0}
            ).to_list(1000)

            # Use .get() to avoid KeyError on any malformed records
            git_day_nums = {g.get("day_number") for g in git_subs if g.get("day_number") is not None}

            completed_days = sum(1 for p in progress if p.get("is_completed"))
            # active_days = days with any activity: tasks started, completed, OR git submitted
            active_day_set = {
                p.get("day_number") for p in progress
                if p.get("day_number") is not None and (p.get("is_completed") or p.get("completed_tasks"))
            }
            active_day_set.update(git_day_nums)
            active_days = len(active_day_set)

            u["progress"] = progress
            u["completed_days"] = completed_days
            u["active_days"] = active_days
            u["total_days"] = 120
            u["git_submissions"] = [
                {
                    "day_number": g.get("day_number"),
                    "repo_url": g.get("repo_url"),
                    "branch": g.get("branch"),
                    "submitted_at": g.get("submitted_at"),
                }
                for g in git_subs
                if g.get("day_number") and g.get("repo_url")
            ]
        except Exception as e:
            logger.error(f"Error fetching progress for user {u.get('id', 'unknown')}: {e}")
            u["progress"] = []
            u["completed_days"] = 0
            u["active_days"] = 0
            u["total_days"] = 120
            u["git_submissions"] = []

    return users


@api_router.get("/admin/users/{user_id}/progress")
async def get_user_progress(user_id: str, user=Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    target = await db.users.find_one({"id": user_id}, {"_id": 0, "password_hash": 0})
    if not target:
        raise HTTPException(status_code=404, detail="User not found")

    progress = await db.progress.find({"user_id": user_id}, {"_id": 0}).to_list(1000)
    git_subs = await db.git_submissions.find({"user_id": user_id}, {"_id": 0}).to_list(1000)
    git_map = {g["day_number"]: g for g in git_subs}

    for p in progress:
        git = git_map.get(p["day_number"])
        if git:
            p["git_submission"] = {
                "repo_url": git["repo_url"],
                "branch": git["branch"],
                "submitted_at": git.get("submitted_at"),
            }

    # Include days that only have a git submission (no progress record yet)
    progress_day_nums = {p["day_number"] for p in progress}
    for git in git_subs:
        if git["day_number"] not in progress_day_nums:
            progress.append({
                "day_number": git["day_number"],
                "completed_tasks": [],
                "is_completed": False,
                "git_submission": {
                    "repo_url": git["repo_url"],
                    "branch": git["branch"],
                    "submitted_at": git.get("submitted_at"),
                },
            })

    return {"user": target, "progress": progress}


@api_router.put("/admin/users/{user_id}/password")
async def admin_change_user_password(user_id: str, data: AdminPasswordChange, user=Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    if len(data.new_password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
    target = await db.users.find_one({"id": user_id})
    if not target:
        raise HTTPException(status_code=404, detail="User not found")
    hashed = bcrypt.hashpw(data.new_password.encode(), bcrypt.gensalt()).decode()
    await db.users.update_one({"id": user_id}, {"$set": {"password_hash": hashed}})
    return {"message": "Password updated successfully"}


@api_router.post("/snippets")
async def save_snippet(data: CodeSnippetSave, user=Depends(get_current_user)):
    await db.code_snippets.update_one(
        {"user_id": user["id"], "day_number": data.day_number, "snippet_id": data.snippet_id},
        {"$set": {
            "user_id": user["id"],
            "day_number": data.day_number,
            "snippet_id": data.snippet_id,
            "language": data.language,
            "code": data.code,
            "saved_at": datetime.now(timezone.utc).isoformat(),
        }},
        upsert=True,
    )
    return {"status": "saved"}


@api_router.get("/admin/users/{user_id}/snippets")
async def get_user_snippets(user_id: str, user=Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    snippets = await db.code_snippets.find({"user_id": user_id}, {"_id": 0}).to_list(1000)
    return snippets


@api_router.post("/chat")
async def chat(data: ChatRequest, user=Depends(get_current_user)):
    if not GROQ_API_KEY:
        raise HTTPException(status_code=500, detail="Chatbot not configured")

    try:
        groq_client = AsyncGroq(api_key=GROQ_API_KEY)

        messages = [{"role": "system", "content": CHATBOT_SYSTEM_PROMPT}]

        for msg in data.history[-10:]:
            messages.append({"role": msg.role, "content": msg.content})

        messages.append({"role": "user", "content": data.message})

        completion = await groq_client.chat.completions.create(
            model="moonshotai/kimi-k2-instruct-0905",
            messages=messages,
            max_tokens=1024,
            temperature=0.7,
        )

        reply = completion.choices[0].message.content
        return {"reply": reply}

    except Exception as e:
        error_msg = str(e)
        logger.error(f"Groq chat error: {error_msg}")

        if "model" in error_msg.lower() or "404" in error_msg:
            raise HTTPException(status_code=502, detail="model_not_found")
        elif "auth" in error_msg.lower() or "api key" in error_msg.lower() or "401" in error_msg:
            raise HTTPException(status_code=502, detail="auth_error")
        elif "rate" in error_msg.lower() or "429" in error_msg:
            raise HTTPException(status_code=502, detail="rate_limit")
        else:
            raise HTTPException(status_code=502, detail="service_error")


@api_router.get("/curriculum/overrides")
async def get_curriculum_overrides_all(user=Depends(get_current_user)):
    overrides = await db.curriculum_overrides.find({}, {"_id": 0}).to_list(1000)
    return overrides


@api_router.get("/curriculum/{day_number}")
async def get_curriculum_override(day_number: int, user=Depends(get_current_user)):
    override = await db.curriculum_overrides.find_one({"day_number": day_number}, {"_id": 0})
    return override or {}


@api_router.get("/admin/curriculum/overrides")
async def get_all_curriculum_overrides(user=Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    overrides = await db.curriculum_overrides.find({}, {"_id": 0}).to_list(1000)
    return overrides


@api_router.put("/admin/curriculum/{day_number}")
async def update_curriculum_day(day_number: int, data: CurriculumOverride, user=Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    update_doc = {
        "day_number": day_number,
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    if data.topic is not None:
        update_doc["topic"] = data.topic
    if data.resource_links is not None:
        update_doc["resource_links"] = data.resource_links
    await db.curriculum_overrides.update_one(
        {"day_number": day_number},
        {"$set": update_doc},
        upsert=True
    )
    return {"message": "Curriculum updated", "day_number": day_number}


@api_router.post("/execute")
async def execute_code(data: CodeExecuteRequest):
    """Run code via Wandbox (server-side, no CORS, no API key needed)."""
    compiler_map = await get_wandbox_compiler_map()
    compiler = compiler_map.get(data.language)
    if not compiler:
        raise HTTPException(status_code=400, detail=f"Unsupported language: {data.language}")

    # Build Wandbox payload — use file extension so GCC knows C vs C++
    if data.language == "c":
        payload = {"compiler": compiler, "codes": [{"file": "main.c", "code": data.code}]}
    elif data.language == "java":
        payload = {"compiler": compiler, "codes": [{"file": "Main.java", "code": data.code}]}
    else:
        payload = {"compiler": compiler, "code": data.code}

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                "https://wandbox.org/api/compile.json",
                json=payload,
                headers={"Content-Type": "application/json"},
            )
        if resp.status_code != 200:
            raise HTTPException(status_code=502, detail=f"Execution service error: {resp.status_code}")

        result = resp.json()

        stdout = result.get("program_output", "")

        stderr_parts = []
        if result.get("compiler_error"):
            stderr_parts.append(result["compiler_error"])
        if result.get("program_error"):
            stderr_parts.append(result["program_error"])
        if result.get("signal"):
            stderr_parts.append(f"Killed by signal: {result['signal']}")
        stderr = "\n".join(stderr_parts)

        status_str = result.get("status", "")
        try:
            exit_code = int(status_str)
        except (ValueError, TypeError):
            exit_code = 1 if stderr else 0

        return {"run": {"stdout": stdout, "stderr": stderr, "code": exit_code}}

    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Code execution timed out")
    except httpx.RequestError as exc:
        raise HTTPException(status_code=502, detail=f"Failed to reach execution server: {exc}")


@api_router.post("/quiz/grade")
async def grade_quiz(data: QuizGradeRequest, user=Depends(get_current_user)):
    """Grade all quiz answers (MCQ + coding) using Ollama minimax-m2.7:cloud in parallel."""
    from ollama import chat as ollama_chat
    LABELS = ['A', 'B', 'C', 'D']

    async def grade_one(prompt: str) -> bool:
        def _call():
            r = ollama_chat(
                model='minimax-m2.7:cloud',
                messages=[{'role': 'user', 'content': prompt}],
            )
            return 'CORRECT' in r.message.content.strip().upper()
        try:
            return await asyncio.to_thread(_call)
        except Exception:
            return False

    async def grade_item(question_id: int, prompt):
        if prompt is None:
            return question_id, False
        correct = await grade_one(prompt)
        return question_id, correct

    items = []  # (question_id, prompt | None)

    for a in data.mcq_answers:
        if a.selected_index < 0 or a.selected_index >= len(a.options):
            items.append((a.question_id, None))
        else:
            opts = '\n'.join(f"{LABELS[i]}. {o}" for i, o in enumerate(a.options))
            selected = f"{LABELS[a.selected_index]}. {a.options[a.selected_index]}"
            prompt = (
                f"You are grading a multiple choice question.\n\n"
                f"Question: {a.question}\n\n"
                f"Options:\n{opts}\n\n"
                f"The student selected: {selected}\n\n"
                f"Is this the correct answer? Respond with exactly one word: CORRECT or INCORRECT."
            )
            items.append((a.question_id, prompt))

    for a in data.coding_answers:
        if not a.runnable:
            # Cannot be executed in sandbox — review the code directly
            if not a.code.strip() or a.code.strip() == a.task_description:
                items.append((a.question_id, None))
            else:
                prompt = (
                    f"You are grading a programming exercise. Review the student's code.\n\n"
                    f"Task: {a.task_description}\n\n"
                    f"Expected behaviour:\n{a.expected_output}\n\n"
                    f"Student's code:\n{a.code}\n\n"
                    f"Does the student's code correctly implement the required functionality? "
                    f"Respond with exactly one word: CORRECT or INCORRECT."
                )
                items.append((a.question_id, prompt))
        elif not a.actual_output.strip():
            items.append((a.question_id, None))
        else:
            prompt = (
                f"You are grading a programming exercise. Compare the student's actual output "
                f"with the expected output.\n\n"
                f"Expected output:\n{a.expected_output}\n\n"
                f"Student's actual output:\n{a.actual_output}\n\n"
                f"Are these outputs equivalent (ignoring minor whitespace or formatting differences)? "
                f"Respond with exactly one word: CORRECT or INCORRECT."
            )
            items.append((a.question_id, prompt))

    results = await asyncio.gather(*[grade_item(qid, prompt) for qid, prompt in items])
    graded = [{"question_id": qid, "correct": correct} for qid, correct in results]

    # Calculate scores: Q1-15 = MCQ (1 mark each), Q16-20 = coding (4 marks each)
    mcq_score = sum(1 for r in graded if r["question_id"] <= 15 and r["correct"])
    coding_score = sum(4 for r in graded if r["question_id"] > 15 and r["correct"])
    total_score = mcq_score + coding_score

    # Save result to DB
    await db.quiz_results.insert_one({
        "user_id": user["id"],
        "submitted_at": datetime.now(timezone.utc).isoformat(),
        "total_score": total_score,
        "max_score": 35,
        "mcq_score": mcq_score,
        "coding_score": coding_score,
        "percentage": round((total_score / 35) * 100),
        "results": graded,
    })

    return {"results": graded}


@api_router.get("/admin/users/{user_id}/quiz")
async def get_user_quiz_results(user_id: str, user=Depends(get_current_user)):
    """Get all quiz attempts for a user (admin only)."""
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    attempts = await db.quiz_results.find(
        {"user_id": user_id}, {"_id": 0}
    ).sort("submitted_at", -1).to_list(50)
    return attempts


@api_router.post("/enrollments")
async def create_enrollment(data: EnrollmentCreate):
    """Submit a course enrollment request (no auth required)."""
    email = data.email.lower().strip()
    course = data.course or 'aiml'

    existing = await db.enrollments.find_one({
        "email": email,
        "course": course,
        "status": {"$in": ["pending", "accepted"]}
    })
    if existing:
        raise HTTPException(
            status_code=400,
            detail="An enrollment request for this course already exists for this email address."
        )

    enrollment_id = str(uuid.uuid4())
    doc = {
        "id": enrollment_id,
        "first_name": data.first_name.strip(),
        "last_name": data.last_name.strip(),
        "email": email,
        "phone": data.phone.strip(),
        "course": course,
        "message": data.message.strip() if data.message else None,
        "status": "pending",
        "submitted_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.enrollments.insert_one(doc)
    return {"message": "Enrollment submitted successfully. You will receive an email once approved.", "id": enrollment_id}


@api_router.get("/admin/enrollments")
async def get_all_enrollments(user=Depends(get_current_user)):
    """List all enrollment requests (admin only)."""
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    enrollments = await db.enrollments.find({}, {"_id": 0}).sort("submitted_at", -1).to_list(1000)
    return enrollments


@api_router.get("/admin/enrollments/{enrollment_id}")
async def get_enrollment(enrollment_id: str, user=Depends(get_current_user)):
    """Get a single enrollment (admin only)."""
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    enrollment = await db.enrollments.find_one({"id": enrollment_id}, {"_id": 0})
    if not enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    return enrollment


@api_router.post("/admin/enrollments/{enrollment_id}/accept")
async def accept_enrollment(enrollment_id: str, user=Depends(get_current_user)):
    """Accept an enrollment and send the access email (admin only)."""
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    enrollment = await db.enrollments.find_one({"id": enrollment_id}, {"_id": 0})
    if not enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    if enrollment.get("status") == "accepted":
        raise HTTPException(status_code=400, detail="Enrollment has already been accepted")

    access_token = create_course_access_token(enrollment_id, enrollment["email"], enrollment.get("course", "aiml"))
    access_expires_at = (datetime.now(timezone.utc) + timedelta(days=7)).isoformat()

    await db.enrollments.update_one(
        {"id": enrollment_id},
        {"$set": {
            "status": "accepted",
            "accepted_at": datetime.now(timezone.utc).isoformat(),
            "access_token": access_token,
            "access_expires_at": access_expires_at,
        }}
    )

    name = f"{enrollment['first_name']} {enrollment['last_name']}"
    course_id = enrollment.get("course", "aiml")
    course_names = {
        "aiml": "AI / ML Engineering (120-Day Intensive)",
        "webdev": "Full Stack Web Development",
        "datascience": "Data Science",
        "cloud": "Cloud & DevOps",
    }
    course_name = course_names.get(course_id, course_id.upper())
    access_link = f"{FRONTEND_URL}/course-access/{access_token}"

    html_content = f"""
    <html>
      <body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background:#f0f4f8;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:40px 20px;">
          <tr><td align="center">
            <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.10);">

              <!-- Header gradient -->
              <tr>
                <td style="background:linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%);padding:36px 40px;text-align:center;">
                  <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.25em;text-transform:uppercase;color:rgba(255,255,255,0.65);">Flyers Minds · Chennai, India</p>
                  <h1 style="margin:0;font-size:26px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">Enrollment Accepted!</h1>
                  <p style="margin:10px 0 0;font-size:14px;color:rgba(255,255,255,0.8);">Your journey starts now, {enrollment['first_name']}.</p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:36px 40px;">
                  <p style="margin:0 0 16px;font-size:15px;color:#334155;line-height:1.6;">
                    Hi <strong>{name}</strong>,
                  </p>
                  <p style="margin:0 0 16px;font-size:15px;color:#475569;line-height:1.6;">
                    Great news — your enrollment request for <strong>{course_name}</strong> has been reviewed and <strong style="color:#0ea5e9;">accepted</strong> by our team.
                  </p>
                  <p style="margin:0 0 28px;font-size:15px;color:#475569;line-height:1.6;">
                    Click the button below to access your course. This link is valid for <strong>7 days</strong> — make sure to start before it expires!
                  </p>

                  <!-- CTA button -->
                  <table cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td align="center" style="padding-bottom:28px;">
                        <a href="{access_link}"
                           style="display:inline-block;background:linear-gradient(135deg,#0ea5e9,#6366f1);color:#ffffff;text-decoration:none;padding:16px 40px;border-radius:12px;font-weight:700;font-size:15px;letter-spacing:0.3px;">
                          Access My Course →
                        </a>
                      </td>
                    </tr>
                  </table>

                  <!-- Expiry notice -->
                  <div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:10px;padding:14px 18px;margin-bottom:24px;">
                    <p style="margin:0;font-size:13px;color:#92400e;">
                      ⏰ <strong>This link expires in 7 days.</strong> After that, you'll need to contact us for a new invitation.
                    </p>
                  </div>

                  <!-- Fallback link -->
                  <p style="font-size:12px;color:#94a3b8;margin:0 0 6px;">Or copy and paste this link into your browser:</p>
                  <p style="font-size:11px;color:#64748b;word-break:break-all;margin:0 0 24px;background:#f8fafc;padding:10px 14px;border-radius:8px;border:1px solid #e2e8f0;">{access_link}</p>

                  <p style="font-size:13px;color:#94a3b8;margin:0;">If you didn't apply for this course, you can safely ignore this email.</p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0;">
                  <p style="margin:0;font-size:12px;color:#94a3b8;">© {datetime.now().year} Flyers Minds · Chennai, India</p>
                </td>
              </tr>

            </table>
          </td></tr>
        </table>
      </body>
    </html>
    """

    email_sent = await send_email(
        enrollment["email"],
        f"Your Enrollment is Accepted — Access {course_name} Now",
        html_content,
    )
    if not email_sent:
        # Enrollment is already marked accepted in DB; surface the email failure clearly
        raise HTTPException(
            status_code=500,
            detail=(
                f"Enrollment accepted but the confirmation email failed to send to {enrollment['email']}. "
                "Check that BREVO_API_KEY and BREVO_SENDER_EMAIL are correct, and that the sender "
                "domain is verified in Brevo. The access link is saved — you can resend manually."
            ),
        )
    return {"message": "Enrollment accepted and access email sent successfully"}


@api_router.get("/course-access/{token}")
async def verify_course_access(token: str):
    """Verify a course access magic link and return a session token."""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=400, detail="access_link_expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=400, detail="invalid_access_link")

    if payload.get("purpose") != "course_access":
        raise HTTPException(status_code=400, detail="invalid_access_link")

    enrollment_id = payload.get("enrollment_id")
    email = payload.get("email", "").lower().strip()
    course = payload.get("course", "aiml")

    enrollment = await db.enrollments.find_one({"id": enrollment_id}, {"_id": 0})
    if not enrollment or enrollment.get("status") != "accepted":
        raise HTTPException(status_code=400, detail="invalid_access_link")

    # Create user if they don't exist yet
    existing_user = await db.users.find_one({"email": email}, {"_id": 0})
    if not existing_user:
        user_id = str(uuid.uuid4())
        name = f"{enrollment['first_name']} {enrollment['last_name']}"
        user_doc = {
            "id": user_id,
            "name": name,
            "email": email,
            "password_hash": hash_password(str(uuid.uuid4())),
            "role": "intern",
            "course": course,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        await db.users.insert_one(user_doc)
        user_for_response = user_doc
    else:
        user_id = existing_user["id"]
        user_for_response = existing_user

    # Issue a 7-day session token to match link expiry
    session_token = create_token(user_id, "intern", expires_delta=timedelta(days=7))
    return {
        "token": session_token,
        "user": {
            "id": user_for_response["id"],
            "name": user_for_response["name"],
            "email": user_for_response["email"],
            "role": "intern",
        }
    }


@api_router.get("/health")
async def health():
    return {"status": "healthy"}


@app.get("/")
async def root():
    return {
        "message": "Flyers Minds API",
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
    print("🚀 FLYERS MINDS API STARTING")
    print("="*60)
    print(f"✅ MongoDB: {os.environ.get('MONGO_URL', 'Not configured')[:50]}...")
    print(f"✅ Database: {os.environ.get('DB_NAME', 'Not configured')}")
    print(f"✅ Brevo Sender: {os.environ.get('BREVO_SENDER_EMAIL', 'Not configured')}")
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
