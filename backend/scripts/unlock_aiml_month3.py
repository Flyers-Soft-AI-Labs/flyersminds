import argparse
import hashlib
import json
import os
from pathlib import Path

from dotenv import load_dotenv
from pymongo import MongoClient


ROOT = Path(__file__).resolve().parents[2]
BACKEND_ENV = ROOT / "backend" / ".env"
TARGET_EMAILS = [
    "pavithradhanasekar17@gmail.com",
    "prakhyathsaiponduru1122@gmail.com",
    "chodiboyinameghana@gmail.com",
    "pavankumarduddi25@gmail.com",
    "kaviyasivakumar0523@gmail.com",
    "raghu.patchalla@gmail.com",
    "raavijagadeesh5@gmail.com",
    "durgamaheshuppu2005@gmail.com",
]


def load_environment() -> None:
    load_dotenv(BACKEND_ENV)


def get_db():
    client = MongoClient(
        os.environ["MONGO_URL"],
        tls=True,
        tlsAllowInvalidCertificates=True,
        serverSelectionTimeoutMS=30000,
        connectTimeoutMS=30000,
        socketTimeoutMS=30000,
    )
    return client, client[os.environ["DB_NAME"]]


def canonical_hash(documents: list[dict]) -> str:
    payload = json.dumps(documents, sort_keys=True, default=str, ensure_ascii=True)
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def progress_snapshot(db, user_id: str) -> dict:
    progress_docs = list(db.progress.find({"user_id": user_id}, {"_id": 0}).sort("day_number", 1))
    git_docs = list(db.git_submissions.find({"user_id": user_id}, {"_id": 0}).sort("day_number", 1))
    quiz_docs = list(db.quiz_results.find({"user_id": user_id}, {"_id": 0}).sort("submitted_at", 1))
    return {
        "progress_count": len(progress_docs),
        "progress_hash": canonical_hash(progress_docs),
        "git_count": len(git_docs),
        "git_hash": canonical_hash(git_docs),
        "quiz_count": len(quiz_docs),
        "quiz_hash": canonical_hash(quiz_docs),
    }


def current_months(user: dict) -> list[int]:
    months = (((user.get("unlock_overrides") or {}).get("aiml") or {}).get("months") or [])
    return [month for month in months if isinstance(month, int)]


def planned_months(user: dict) -> list[int]:
    months = sorted(set(current_months(user) + [3]))
    return months


def inspect_user(db, email: str) -> dict:
    user = db.users.find_one(
        {"email": {"$regex": f"^{email}$", "$options": "i"}},
        {"_id": 0, "password_hash": 0},
    )
    if not user:
        return {
            "email": email,
            "status": "not_found",
        }

    course_value = user.get("course")
    if course_value not in (None, "aiml"):
        return {
            "email": email,
            "status": "wrong_course",
            "user": user,
            "course": course_value,
        }

    before_snapshot = progress_snapshot(db, user["id"])
    return {
        "email": email,
        "status": "ready",
        "user": user,
        "before_months": current_months(user),
        "planned_months": planned_months(user),
        "before_snapshot": before_snapshot,
    }


def print_plan(results: list[dict]) -> None:
    print("Target records and planned update:")
    for result in results:
        print(f"\nEMAIL: {result['email']}")
        if result["status"] == "not_found":
            print("  STATUS: not_found")
            print("  PLAN: no update")
            continue
        if result["status"] == "wrong_course":
            print("  STATUS: wrong_course")
            print(f"  USER_ID: {result['user']['id']}")
            print(f"  COURSE: {result.get('course')}")
            print("  PLAN: no update")
            continue

        user = result["user"]
        print("  STATUS: ready")
        print(f"  USER_ID: {user['id']}")
        print(f"  NAME: {user.get('name')}")
        print(f"  COURSE: {user.get('course')}")
        print(f"  BEFORE_UNLOCK_MONTHS: {result['before_months']}")
        print(f"  PLANNED_UNLOCK_MONTHS: {result['planned_months']}")
        print(f"  BEFORE_PROGRESS_SNAPSHOT: {json.dumps(result['before_snapshot'], sort_keys=True)}")


def apply_updates(db, results: list[dict]) -> list[dict]:
    applied = []
    for result in results:
        if result["status"] != "ready":
            applied.append(result)
            continue

        user = result["user"]
        db.users.update_one(
            {"id": user["id"]},
            {"$addToSet": {"unlock_overrides.aiml.months": 3}},
        )

        after_user = db.users.find_one({"id": user["id"]}, {"_id": 0, "password_hash": 0})
        after_snapshot = progress_snapshot(db, user["id"])

        applied.append(
            {
                **result,
                "after_user": after_user,
                "after_months": current_months(after_user),
                "after_snapshot": after_snapshot,
                "progress_unchanged": result["before_snapshot"] == after_snapshot,
            }
        )
    return applied


def print_verification(results: list[dict]) -> None:
    print("\nVerification:")
    for result in results:
        print(f"\nEMAIL: {result['email']}")
        if result["status"] == "not_found":
            print("  RESULT: not_found")
            continue
        if result["status"] == "wrong_course":
            print("  RESULT: skipped_non_aiml")
            continue

        print(f"  BEFORE_UNLOCK_MONTHS: {result['before_months']}")
        print(f"  AFTER_UNLOCK_MONTHS: {result['after_months']}")
        print(f"  MONTH_3_UNLOCKED: {3 in result['after_months']}")
        print(f"  PROGRESS_UNCHANGED: {result['progress_unchanged']}")
        print(f"  BEFORE_PROGRESS_SNAPSHOT: {json.dumps(result['before_snapshot'], sort_keys=True)}")
        print(f"  AFTER_PROGRESS_SNAPSHOT: {json.dumps(result['after_snapshot'], sort_keys=True)}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true", help="Apply the unlock update.")
    args = parser.parse_args()

    load_environment()
    client, db = get_db()
    try:
        inspected = [inspect_user(db, email) for email in TARGET_EMAILS]
        print_plan(inspected)
        if not args.apply:
            print("\nDry run only. Re-run with --apply to execute the update.")
            return
        verified = apply_updates(db, inspected)
        print_verification(verified)
    finally:
        client.close()


if __name__ == "__main__":
    main()
