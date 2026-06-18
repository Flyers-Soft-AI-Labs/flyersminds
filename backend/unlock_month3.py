"""
One-time script to unlock Month 3 (Days 41-60) for specific users.

How month unlocking works:
  - Day N+1 is unlocked when day N has is_completed=True in the progress collection.
  - Month 3 = Days 41-60.
  - To make Day 41 accessible, Day 40 must be is_completed=True.
  - To make all of Month 3 accessible (Days 41-60), Days 40-59 must all be is_completed=True.

What this script does:
  - For each configured user, ensures days 40-59 have progress records with is_completed=True.
  - If a progress record already exists for a day, it only sets is_completed=True
    and preserves completed_tasks and all other fields.
  - If no progress record exists, it creates a minimal one with is_completed=True.
  - Does not touch any other days, scores, enrollments, or git submissions.

Run without --apply first to preview changes.
Run with --apply only after the preview looks correct.
"""

import argparse
import asyncio
import os
import uuid
from datetime import datetime, timezone

from motor.motor_asyncio import AsyncIOMotorClient


MONGO_URL = os.environ.get("MONGO_URL")
DB_NAME = os.environ.get("DB_NAME")

EMAILS = [
    "pavithradhanasekar17@gmail.com",
    "prakhyathsaiponduru1122@gmail.com",
    "chodiboyinameghana@gmail.com",
    "pavankumarduddi25@gmail.com",
    "kaviyasivakumar0523@gmail.com",
    "raghu.patchalla@gmail.com",
    "raavijagadeesh5@gmail.com",
    "durgamaheshuppu2005@gmail.com",
]

# Days 40 through 59 must be is_completed=True so that days 41 through 60 are unlocked.
GATEWAY_DAYS = list(range(40, 60))


def parse_args():
    parser = argparse.ArgumentParser(
        description="Unlock Month 3 for selected users by marking gateway days 40-59 completed."
    )
    parser.add_argument(
        "--apply",
        action="store_true",
        help="Apply database changes. Without this flag the script only previews changes.",
    )
    return parser.parse_args()


async def main():
    args = parse_args()
    if not MONGO_URL or not DB_NAME:
        raise SystemExit("MONGO_URL and DB_NAME must be set in the environment.")

    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]

    print("=" * 70)
    print("UNLOCK MONTH 3 (Days 41-60)")
    print("MODE:", "APPLY CHANGES" if args.apply else "DRY RUN PREVIEW")
    print("DB_NAME:", DB_NAME)
    print("=" * 70)

    users = []
    for email in EMAILS:
        user = await db.users.find_one(
            {"email": email.lower().strip()},
            {"_id": 0, "id": 1, "email": 1, "name": 1},
        )
        if not user:
            print(f"  WARNING: User not found: {email}")
            continue

        users.append(user)
        print(f"  Found: {user['email']} -> id={user['id']}, name={user.get('name', 'N/A')}")

    if not users:
        print("\nNo users found. Exiting.")
        client.close()
        return

    print(f"\nGateway days to mark is_completed=True: {GATEWAY_DAYS}")
    print("This unlocks: Days 41-60 (Month 3: Machine Learning)\n")

    changes = []
    for user in users:
        uid = user["id"]
        existing = await db.progress.find(
            {"user_id": uid, "day_number": {"$in": GATEWAY_DAYS}},
            {"_id": 0},
        ).to_list(100)
        existing_map = {p["day_number"]: p for p in existing}

        for day in GATEWAY_DAYS:
            if day in existing_map:
                rec = existing_map[day]
                if rec.get("is_completed"):
                    continue
                changes.append((user, day, "UPDATE", rec))
            else:
                changes.append((user, day, "INSERT", None))

    if not changes:
        print("No changes needed. All gateway days are already completed for found users.")
        await verify(db, users)
        client.close()
        return

    print(f"PLANNED CHANGES ({len(changes)} records):")
    print("-" * 70)
    for user, day, action, rec in changes:
        if action == "UPDATE":
            tasks = rec.get("completed_tasks", [])
            print(
                f"  {action}  user={user['email']:<40s}  day={day:>3d}  "
                f"(existing record, {len(tasks)} tasks preserved, set is_completed=True)"
            )
        else:
            print(
                f"  {action}  user={user['email']:<40s}  day={day:>3d}  "
                "(new minimal record with is_completed=True)"
            )
    print("-" * 70)

    if not args.apply:
        print("\nDry run only. Re-run with --apply to make these changes.")
        client.close()
        return

    print("\nAPPLYING CHANGES...")
    now = datetime.now(timezone.utc).isoformat()

    inserted = 0
    updated = 0
    for user, day, action, _rec in changes:
        uid = user["id"]
        if action == "UPDATE":
            result = await db.progress.update_one(
                {"user_id": uid, "day_number": day},
                {"$set": {"is_completed": True, "updated_at": now}},
            )
            if result.modified_count > 0:
                updated += 1
        else:
            await db.progress.insert_one(
                {
                    "id": str(uuid.uuid4()),
                    "user_id": uid,
                    "day_number": day,
                    "completed_tasks": [],
                    "is_completed": True,
                    "updated_at": now,
                }
            )
            inserted += 1

    print(f"  Inserted: {inserted} new records")
    print(f"  Updated:  {updated} existing records")
    await verify(db, users)
    client.close()


async def verify(db, users):
    print("\n" + "=" * 70)
    print("VERIFICATION")
    print("=" * 70)
    all_ok = True
    for user in users:
        completed = await db.progress.find(
            {"user_id": user["id"], "day_number": {"$in": GATEWAY_DAYS}, "is_completed": True},
            {"_id": 0, "day_number": 1},
        ).to_list(100)
        completed_days = sorted([p["day_number"] for p in completed])
        missing_days = [day for day in GATEWAY_DAYS if day not in completed_days]
        ok = not missing_days
        all_ok = all_ok and ok
        status = "OK" if ok else "INCOMPLETE"
        print(
            f"  [{status}] {user['email']:<40s} "
            f"gateway days completed: {len(completed_days)}/{len(GATEWAY_DAYS)}"
        )
        if missing_days:
            print(f"      Missing gateway days: {missing_days}")

    print()
    if all_ok:
        print("Found users now have Month 3 (Days 41-60) fully unlocked.")
    else:
        print("WARNING: Some found users may not have all gateway days completed.")
    print("=" * 70)


if __name__ == "__main__":
    asyncio.run(main())
