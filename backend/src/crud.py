from sqlalchemy.orm import Session
from sqlalchemy.sql.schema import Column

from . import models, schemas, database
from typing import Optional, List, cast

from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
from typing import Annotated

from fastapi import Depends, HTTPException, UploadFile, status

from .storage import file_store

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
    if not cast(bool, user.is_active):
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


def get_current_user(
    db: Annotated[Session, Depends(get_db)],
    token: Annotated[str, Depends(oauth2_scheme)],
):
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


def delete_user(db: Session, user: models.User):
    db_user = db.query(models.User).filter(models.User.id == user.id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db.is_active = False
    db.commit()
    db.refresh(db_user)
    return {"message": "User deleted"}


def update_user(
    db: Session, user: schemas.UserUpdate, current_user: models.User
) -> models.User:
    db_user = db.query(models.User).filter(models.User.id == current_user.id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.email:
        db_user.email = user.email
    if user.password:
        db_user.hashed_password = get_password_hash(user.password)
    db.commit()
    db.refresh(db_user)
    return db_user


def create_client(
    db: Session, client: schemas.ClientCreate, user: models.User
) -> models.Client:
    db_client = models.Client(
        email=client.email,
        id_number=client.id_number,
        name=client.name,
        phone=client.phone,
        owner=user,
    )
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client


def get_clients(
    db: Session,
    user: models.User,
    skip: int = 0,
    limit: int = 100,
    name_like: Optional[str] = None,
    email_like: Optional[str] = None,
) -> List[models.Client]:

    name_filter = (
        models.Client.name.like(f"%{name_like.strip()}%") if name_like else None
    )
    email_filter = (
        models.Client.email.like(f"%{email_like.strip()}%") if email_like else None
    )
    filters = [f for f in [name_filter, email_filter] if f is not None]

    return (
        db.query(models.Client)
        .filter(models.Client.owner == user, *filters)
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_client(db: Session, user: models.User, client_id: int) -> models.Client:
    verify_client = (
        db.query(models.Client)
        .filter(models.Client.owner == user, models.Client.id == client_id)
        .first()
    )
    if not verify_client:
        raise HTTPException(status_code=404, detail="Client not found")
    return verify_client


def update_client(
    db: Session, client_id: int, client: schemas.ClientUpdate, user: models.User
) -> models.Client:
    verify_client = (
        db.query(models.Client)
        .filter(models.Client.owner == user, models.Client.id == client_id)
        .first()
    )
    if not verify_client:
        raise HTTPException(status_code=404, detail="Client not found")
    if client.email:
        verify_client.email = cast(Column[str], client.email)
    if client.name:
        verify_client.name = cast(Column[str], client.name)
    if client.phone:
        verify_client.phone = cast(Column[str], client.phone)
    db.commit()
    db.refresh(verify_client)
    return verify_client


def delete_client(db: Session, client_id: int, user: models.User):
    verify_client = (
        db.query(models.Client)
        .filter(models.Client.owner == user, models.Client.id == client_id)
        .first()
    )
    if not verify_client:
        raise HTTPException(status_code=404, detail="Client not found")
    db.delete(verify_client)
    db.commit()
    return {"message": "Client deleted"}


def create_file(
    db: Session, file: schemas.FileCreate, user: models.User
) -> models.File:
    client = db.query(models.Client).filter(models.Client.id == file.client_id).first()

    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    if client.owner != user:
        raise HTTPException(status_code=401, detail="unauthorized access")

    db_file = models.File(
        case_id=file.case_id,
        description=file.description,
        court_station=file.court_station,
        type_of_case=file.type_of_case,
        client=client,
    )

    db.add(db_file)
    db.commit()
    db.refresh(db_file)
    return db_file


def get_files(db: Session, user: models.User, client_id: int) -> List[models.File]:
    verify_client = (
        db.query(models.Client)
        .filter(models.Client.owner == user, models.Client.id == client_id)
        .first()
    )

    if not verify_client:
        raise HTTPException(status_code=404, detail="Client not found")

    return db.query(models.File).filter(models.File.client_id == client_id).all()


def get_file(db: Session, user: models.User, file_id: int) -> models.File:
    file = db.query(models.File).filter(models.File.id == file_id).first()
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    client = db.query(models.Client).filter(models.Client.id == file.client_id).first()
    if not client:
        raise HTTPException(status_code=401, detail="unauthorized access")
    if client.owner != user:
        raise HTTPException(status_code=401, detail="unauthorized access")
    return file


def create_attachment(
    db: Session, attachment: UploadFile, current_user: models.Client, file_id: int
) -> models.Attachment:
    # TODO: Save the file to the server and return the url

    file = db.query(models.File).filter(models.File.id == file_id).first()

    if not file:
        raise HTTPException(status_code=404, detail="File not found")

    client = db.query(models.Client).filter(models.Client.id == file.client_id).first()

    if not client:
        raise HTTPException(status_code=401, detail="unauthorized access")

    if client.owner != current_user:
        raise HTTPException(status_code=401, detail="unauthorized access")

    url = file_store.save(attachment)

    db_attachment = models.Attachment(url=url, file=file)
    db.add(db_attachment)
    db.commit()
    db.refresh(db_attachment)
    return db_attachment


def get_attachments(
    db: Session, user: models.User, file_id: int
) -> List[models.Attachment]:
    file = get_file(db, user, file_id)
    return file.attachments


def get_attachment(
    db: Session, user: models.User, attachment_id: int
) -> tuple[str, str] | None:
    attachment = (
        db.query(models.Attachment)
        .filter(models.Attachment.id == attachment_id)
        .first()
    )
    if not attachment:
        raise HTTPException(status_code=404, detail="Attachment not found")
    file = db.query(models.File).filter(models.File.id == attachment.file_id).first()

    if not file:
        raise HTTPException(status_code=401, detail="unauthorized access")
    client = db.query(models.Client).filter(models.Client.id == file.client_id).first()
    if not client:
        raise HTTPException(status_code=401, detail="unauthorized access")
    if client.owner != user:
        raise HTTPException(status_code=401, detail="unauthorized access")

    return file_store.load(cast(str, attachment.url))


def combine_date_time(date: str, time: str) -> datetime:
    date_ = datetime.strptime(date, "%Y-%m-%d")
    time_ = datetime.strptime(time, "%H:%M")
    return date_ + timedelta(hours=time_.hour, minutes=time_.minute)


# events
def create_event(
    db: Session, event: schemas.Event, user: models.User
) -> schemas.EventResponse:
    client = db.query(models.Client).filter(models.Client.id == event.client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    if client.owner != user:
        raise HTTPException(status_code=401, detail="unauthorized access")

    db_event = models.Event(
        date=combine_date_time(event.date, event.time),
        description=event.description,
        client=client,
        event_name=event.event_name,
    )

    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return schemas.EventResponse(
        event_id=cast(int, db_event.id),
        event_name=cast(str, db_event.event_name),
        date=cast(datetime, db_event.date).isoformat(),
        client_id=cast(int, db_event.client_id),
        client_name=cast(str, db_event.client.name),
        description=cast(str, db_event.description),
    )


def update_event(
    db: Session, event: schemas.UpdateEvent, user: models.User
) -> models.Event:
    verify_event = (
        db.query(models.Event)
        .filter(models.Event.client.owner == user, models.Event.id == event.event_id)
        .first()
    )
    if not verify_event:
        raise HTTPException(status_code=404, detail="Event not found")

    if event.date:
        verify_event.date = event.date
    if event.time:
        verify_event.time = event.time
    if event.description:
        verify_event.description = event.description
    db.commit()
    db.refresh(verify_event)
    return verify_event


def delete_event(db: Session, event_id: int, user: models.User):
    verify_event = (
        db.query(models.Event)
        .filter(models.Event.client.owner == user, models.Event.id == event_id)
        .first()
    )
    if not verify_event:
        raise HTTPException(status_code=404, detail="Event not found")
    db.delete(verify_event)
    db.commit()
    return {"message": "Event deleted"}


def filter_client(query, client_id: int | None):
    if not client_id:
        return query

    return query.filter(models.Event.client_id == client_id)


def get_events(
    db: Session, user: models.User, client_id: int | None
) -> List[schemas.EventResponse]:
    if client_id is not None:
        verify_client = (
            db.query(models.Client)
            .filter(models.Client.owner == user, models.Client.id == client_id)
            .first()
        )
        if not verify_client:
            raise HTTPException(status_code=404, detail="Client not found")

    return [
        schemas.EventResponse(
            event_id=cast(int, event.id),
            event_name=cast(str, event.event_name),
            date=event.date.isoformat(),
            client_id=cast(int, event.client_id),
            description=cast(str, event.description),
            client_name=cast(str, event.client.name),
        )
        for event in filter_client(db.query(models.Event), client_id)
    ]
