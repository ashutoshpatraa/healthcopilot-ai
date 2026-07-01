from datetime import timedelta

from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.security import create_access_token, hash_password, verify_password
from app.models.entities import User


def create_user(db: Session, email: str, full_name: str, password: str) -> User:
    user = User(email=email.lower(), full_name=full_name, hashed_password=hash_password(password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email.lower()).first()


def authenticate_user(db: Session, email: str, password: str) -> User | None:
    user = get_user_by_email(db, email)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user


def ensure_demo_user(db: Session) -> User:
    user = db.query(User).order_by(User.id.asc()).first()
    if user is not None:
        return user

    user = User(email="demo@healthcopilot.ai", full_name="Demo User", hashed_password=hash_password("ChangeMe123!"))
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def issue_token(subject: str, minutes: int | None = None) -> str:
    settings = get_settings()
    duration = timedelta(minutes=minutes or settings.access_token_expire_minutes)
    return create_access_token(subject, duration)
