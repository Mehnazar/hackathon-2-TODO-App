"""
SQLModel database models.

References: specs/database/schema.md
"""
from sqlmodel import Field, SQLModel
from datetime import datetime, timezone
from typing import Optional


class User(SQLModel, table=True):
    """
    User model for authentication.

    Managed by Better Auth in Phase II.
    """
    __tablename__ = "users"

    id: str = Field(primary_key=True)  # Better Auth format: usr_xxxxx
    email: str = Field(unique=True, index=True)
    name: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Task(SQLModel, table=True):
    """
    Task model for todo items.

    All timestamps stored in UTC (per CONSTITUTION.md timezone handling).
    """
    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="users.id", index=True)
    title: str = Field(max_length=200)
    description: str = Field(default="", max_length=1000)
    completed: bool = Field(default=False, index=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
