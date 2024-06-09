from typing import Union
from pydantic import BaseModel


class UserBase(BaseModel):
    email: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int
    is_active: bool

    class Config:
        orm_mode = True


class UserUpdate(BaseModel):
    email: Union[str, None] = None
    password: Union[str, None] = None


class ClientCreate(UserBase):
    name: str
    phone: str
    id_number: str


class Client(UserBase):
    id: int
    name: str
    phone: str
    id_number: str

    class Config:
        orm_mode = True


class ClientUpdate(BaseModel):
    email: Union[str, None] = None
    name: Union[str, None] = None
    phone: Union[str, None] = None


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: str | None = None


class File(BaseModel):
    id: int
    case_id: str
    client_id: int
    description: str
    court_station: str
    type_of_case: str


class FileCreate(BaseModel):
    case_id: str
    client_id: int
    description: str
    court_station: str
    type_of_case: str


class Attachment(BaseModel):
    id: int
    url: str
    attachment_name: str = "attachment"


class Event(BaseModel):
    event_name: str
    date: str
    time: str
    client_id: int
    description: str


class EventResponse(BaseModel):
    event_id: int
    event_name: str
    date: str
    client_id: int
    client_name: str
    description: str


class CancelEvent(BaseModel):
    event_id: int
    client_id: int


class UpdateEvent(BaseModel):
    event_id: int
    client_id: int

    event_name: str | None = None
    date: str | None = None
    description: str | None = None


class ProfileInfo(BaseModel):
    file_count: int
    event_count: int
    attachment_count: int
    client_count: int
