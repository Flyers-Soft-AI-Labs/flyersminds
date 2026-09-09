import asyncio
import json
from copy import deepcopy
from pathlib import Path
from typing import Any, Dict, List, Optional


class LocalStore:
    def __init__(self, file_path: Optional[str] = None):
        self.file_path = Path(file_path or "local_store.json")
        self._data: Dict[str, List[Dict[str, Any]]] = {"users": [], "progress": [], "git_submissions": [], "code_snippets": [], "curriculum_overrides": [], "quiz_results": [], "enrollments": []}
        self._load()

    def _load(self) -> None:
        if self.file_path.exists():
            try:
                with self.file_path.open("r", encoding="utf-8") as handle:
                    data = json.load(handle)
                if isinstance(data, dict):
                    for key, value in self._data.items():
                        if key in data and isinstance(data[key], list):
                            self._data[key] = data[key]
            except Exception:
                self._data = {"users": [], "progress": [], "git_submissions": [], "code_snippets": [], "curriculum_overrides": [], "quiz_results": [], "enrollments": []}

    def _save(self) -> None:
        with self.file_path.open("w", encoding="utf-8") as handle:
            json.dump(self._data, handle, indent=2)

    def collection(self, name: str):
        return LocalCollection(self, name)


class LocalDatabase:
    def __init__(self, file_path: Optional[str] = None):
        self.store = LocalStore(file_path)

    def __getattr__(self, name: str):
        return LocalCollection(self.store, name)

    def collection(self, name: str):
        return LocalCollection(self.store, name)

    async def list_collection_names(self):
        return list(self.store._data.keys())


class LocalCollection:
    def __init__(self, store: LocalStore, name: str):
        self.store = store
        self.name = name

    def _items(self) -> List[Dict[str, Any]]:
        return self.store._data.setdefault(self.name, [])

    async def find_one(self, query: Optional[Dict[str, Any]] = None, projection: Optional[Dict[str, Any]] = None):
        query = query or {}
        projection = projection or {}
        for item in self._items():
            if all(item.get(k) == v for k, v in query.items()):
                if projection and projection.get("_id") == 0:
                    item = deepcopy(item)
                    item.pop("_id", None)
                return deepcopy(item)
        return None

    async def find(self, query: Optional[Dict[str, Any]] = None, projection: Optional[Dict[str, Any]] = None):
        query = query or {}
        projection = projection or {}
        items = []
        for item in self._items():
            if all(item.get(k) == v for k, v in query.items()):
                result = deepcopy(item)
                if projection and projection.get("_id") == 0:
                    result.pop("_id", None)
                items.append(result)
        return LocalCursor(items)

    async def insert_one(self, document: Dict[str, Any]):
        self._items().append(deepcopy(document))
        self.store._save()
        return type("InsertResult", (), {"inserted_id": None})()

    async def update_one(self, query: Dict[str, Any], update: Dict[str, Any]):
        for item in self._items():
            if all(item.get(k) == v for k, v in query.items()):
                if "$set" in update:
                    item.update(update["$set"])
                break
        self.store._save()
        return type("UpdateResult", (), {"modified_count": 1})()

    async def count_documents(self, query: Optional[Dict[str, Any]] = None):
        query = query or {}
        count = 0
        for item in self._items():
            if all(item.get(k) == v for k, v in query.items()):
                count += 1
        return count


class LocalCursor:
    def __init__(self, items: List[Dict[str, Any]]):
        self._items = items

    def sort(self, key: str, direction: int = 1):
        self._items = sorted(self._items, key=lambda item: item.get(key, ""))
        return self

    def to_list(self, length: int = 1000):
        return self._items[:length]
