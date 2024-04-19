from sqlalchemy.orm import Session

from . import models, schemas, database
from typing import Optional, List

from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
from typing import Annotated

from fastapi import Depends, HTTPException, UploadFile, status

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def get_user_by_email(db: Session, email: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.email == email).first()

def authenticate_user(db: Session, email: str, password: str) -> Optional[models.User]:
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(db: Annotated[Session, Depends(get_db)], token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    token_data: schemas.TokenData

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: Optional[str] = payload.get("sub")
        if email is None:
            raise credentials_exception

        token_data = schemas.TokenData(email=email)

    except JWTError:
        raise credentials_exception

    if token_data.email is None:
        raise credentials_exception

    user = get_user_by_email(db, token_data.email)
    if user is None:
        raise credentials_exception
    return user

def create_user(db: Session, user: schemas.UserCreate) -> models.User:
    hashed_password = get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def create_client(db: Session, client: schemas.ClientCreate, user: models.User) -> models.Client:
    db_client = models.Client(email=client.email, name=client.name, phone=client.phone, owner=user)
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client


def get_clients(db: Session, user: models.User, skip: int = 0, limit: int = 100) -> List[models.Client]:
    return db.query(models.Client).filter(models.Client.owner == user).offset(skip).limit(limit).all()


def create_file(db: Session, file: schemas.FileCreate, client: models.Client) -> models.File:
    db_file = models.File(case_id=file.case_id, description=file.description, court_station=file.court_station, type_of_case=file.type_of_case, client=client)
    db.add(db_file)
    db.commit()
    db.refresh(db_file)
    return db_file

def get_files(db: Session, user: models.User, client_id: int) -> List[models.File]:
    verify_client = db.query(models.Client).filter(models.Client.owner == user, models.Client.id == client_id).first()

    if not verify_client:
        raise HTTPException(status_code=404, detail="Client not found")

    return db.query(models.File).filter(models.File.client_id == client_id).all()


def create_attachment(db: Session, attachment: UploadFile, current_user: models.Client, file_id: int) -> models.Attachment:
    #TODO: Save the file to the server and return the url
    file = db.query(models.File).filter(models.File.id == file_id).first()

    if not file:
        raise HTTPException(status_code=404, detail="File not found")

    client = db.query(models.Client).filter(models.Client.id == file.client_id).first()

    if not client:
        raise HTTPException(status_code=401, detail="unauthorized access")

    if client.owner != current_user:
        raise HTTPException(status_code=401, detail="unauthorized access")


    db_attachment = models.Attachment(url="todo", file=file)
    db.add(db_attachment)
    db.commit()
    db.refresh(db_attachment)
    return db_attachment

def get_attachments(db: Session, user: models.User, file_id: int) -> List[models.Attachment]:
    file = db.query(models.File).filter(models.File.id == file_id).first()

    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    client = db.query(models.Client).filter(models.Client.id == file.client_id).first()
    if not client:
        raise HTTPException(status_code=401, detail="unauthorized access")
    if client.owner != user:
        raise HTTPException(status_code=401, detail="unauthorized access")
    return db.query(models.Attachment).filter(models.Attachment.file_id == file_id).all()
