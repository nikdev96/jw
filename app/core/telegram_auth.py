import hashlib
import hmac
import json
import time
from typing import Any
from urllib.parse import parse_qsl

from fastapi import HTTPException, status

from app.config import settings

# Maximum age of initData in seconds (1 hour)
MAX_INIT_DATA_AGE = 3600


def verify_telegram_init_data(init_data: str) -> dict[str, Any]:
    """
    Verify Telegram WebApp initData and return parsed user data.

    Args:
        init_data: The initData string from Telegram WebApp

    Returns:
        Dictionary with parsed and verified data including user info

    Raises:
        HTTPException: If verification fails
    """
    try:
        parsed_data = dict(parse_qsl(init_data))
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid initData format"
        )

    if "hash" not in parsed_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Hash not found in initData"
        )

    received_hash = parsed_data.pop("hash")

    data_check_string = "\n".join(
        f"{k}={v}" for k, v in sorted(parsed_data.items())
    )

    # WebApp uses SHA256(bot_token) as secret_key (NOT "WebAppData")
    # Note: Can be cached since bot_token doesn't change, but premature for MVP
    secret_key = hashlib.sha256(settings.TELEGRAM_BOT_TOKEN.encode()).digest()

    calculated_hash = hmac.new(
        key=secret_key,
        msg=data_check_string.encode(),
        digestmod=hashlib.sha256
    ).hexdigest()

    if not hmac.compare_digest(calculated_hash, received_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid initData hash"
        )

    # Verify auth_date to prevent replay attacks
    if "auth_date" in parsed_data:
        try:
            auth_date = int(parsed_data["auth_date"])
            current_time = int(time.time())
            if current_time - auth_date > MAX_INIT_DATA_AGE:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="initData is too old"
                )
        except (ValueError, TypeError):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid auth_date format"
            )

    # Parse user data if present
    if "user" in parsed_data:
        try:
            parsed_data["user"] = json.loads(parsed_data["user"])
        except json.JSONDecodeError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid user data format"
            )

    return parsed_data


def get_user_from_init_data(init_data: str) -> dict[str, Any]:
    """
    Extract and return user data from verified initData.

    Args:
        init_data: The initData string from Telegram WebApp

    Returns:
        Dictionary with user information

    Raises:
        HTTPException: If verification fails or user data not found
    """
    verified_data = verify_telegram_init_data(init_data)

    if "user" not in verified_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User data not found in initData"
        )

    return verified_data["user"]
