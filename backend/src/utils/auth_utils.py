"""Authentication utilities for password hashing and JWT generation"""
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timezone, timedelta
import os
import secrets
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
env_path = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(dotenv_path=env_path)

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT configuration
SECRET_KEY = os.getenv("BETTER_AUTH_SECRET")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 7


def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt.

    Args:
        password: Plain text password

    Returns:
        Hashed password
    """
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against a hashed password.

    Args:
        plain_password: Plain text password to verify
        hashed_password: Hashed password to compare against

    Returns:
        True if password matches, False otherwise
    """
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(user_id: str) -> str:
    """
    Create a JWT access token for a user.

    Args:
        user_id: The user's ID to encode in the token

    Returns:
        JWT token string
    """
    if not SECRET_KEY:
        raise RuntimeError("BETTER_AUTH_SECRET environment variable is required")

    # Calculate expiration time
    expire = datetime.now(timezone.utc) + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)

    # Create JWT payload
    payload = {
        "sub": user_id,  # Subject (user_id)
        "exp": expire,   # Expiration time
        "iat": datetime.now(timezone.utc),  # Issued at
    }

    # Generate token
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token


def generate_user_id() -> str:
    """
    Generate a unique user ID in Better Auth format.

    Returns:
        User ID string (e.g., "usr_1a2b3c4d5e6f7g8h")
    """
    random_part = secrets.token_hex(16)  # 32 character hex string
    return f"usr_{random_part}"
