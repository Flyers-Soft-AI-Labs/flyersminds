import os
import json
from typing import Optional

import asyncpg


postgres_pool: Optional[asyncpg.Pool] = None


async def init_postgres_pool() -> Optional[asyncpg.Pool]:
    global postgres_pool
    database_url = os.environ.get("POSTGRES_URL") or os.environ.get("DATABASE_URL")
    if not database_url:
        return None

    if postgres_pool is None:
        postgres_pool = await asyncpg.create_pool(
            database_url,
            min_size=1,
            max_size=int(os.environ.get("POSTGRES_POOL_MAX_SIZE", "10")),
            init=_init_connection,
        )
    return postgres_pool


async def _init_connection(conn: asyncpg.Connection) -> None:
    await conn.set_type_codec(
        "jsonb",
        encoder=json.dumps,
        decoder=json.loads,
        schema="pg_catalog",
        format="text",
    )
    await conn.set_type_codec(
        "json",
        encoder=json.dumps,
        decoder=json.loads,
        schema="pg_catalog",
        format="text",
    )


def get_postgres_pool() -> asyncpg.Pool:
    if postgres_pool is None:
        raise RuntimeError("PostgreSQL is not configured. Set POSTGRES_URL or DATABASE_URL.")
    return postgres_pool


async def close_postgres_pool() -> None:
    global postgres_pool
    if postgres_pool is not None:
        await postgres_pool.close()
        postgres_pool = None
