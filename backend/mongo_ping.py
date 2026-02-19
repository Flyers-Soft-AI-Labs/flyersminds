import os
from pathlib import Path

import certifi
from dotenv import load_dotenv
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

uri = os.environ.get(
    "MONGO_URL",
    "mongodb+srv://testUser:<db_password>@siftdummy.drmd6at.mongodb.net/?appName=siftdummy",
)
mongo_client_kwargs = {}
if uri.startswith("mongodb+srv://"):
    mongo_client_kwargs = {
        "tls": True,
        "tlsCAFile": os.environ.get("MONGO_TLS_CA_FILE") or certifi.where(),
    }

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi("1"), **mongo_client_kwargs)

# Send a ping to confirm a successful connection
try:
    client.admin.command("ping")
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)
