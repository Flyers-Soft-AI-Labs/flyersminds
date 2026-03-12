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


class CodeSnippetSave(BaseModel):
    day_number: int
    snippet_id: str
    language: str
    code: str


class AdminPasswordChange(BaseModel):
    new_password: str


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


async def send_email(to_email: str, subject: str, html_content: str):
    """Send email via Brevo API"""
    if not BREVO_API_KEY or not BREVO_SENDER_EMAIL:
        print("WARNING: BREVO_API_KEY or BREVO_SENDER_EMAIL not set in .env — email not sent.")
        return False
    try:
        async with httpx.AsyncClient() as http_client:
            response = await http_client.post(
                "https://api.brevo.com/v3/smtp/email",
                headers={
                    "api-key": BREVO_API_KEY,
                    "Content-Type": "application/json",
                },
                json={
                    "sender": {"name": FROM_NAME, "email": BREVO_SENDER_EMAIL},
                    "to": [{"email": to_email}],
                    "subject": subject,
                    "htmlContent": html_content,
                },
                timeout=15,
            )
        if response.status_code in (200, 201):
            print(f"Email sent to {to_email}")
            return True
        else:
            print(f"Brevo error {response.status_code}: {response.text}")
            return False
    except Exception as e:
        print(f"Error sending email: {str(e)}")
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
