from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)

    items = relationship("Client", back_populates="owner")


class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True)
    email = Column(String)
    phone = Column(String)
    name = Column(String)
    id_number = Column(String)

    files = relationship("File", back_populates="client")

    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="items")

    events = relationship("Event", back_populates="client")


class File(Base):
    __tablename__ = "files"
    id = Column(Integer, primary_key=True)

    case_id = Column(String)
    description = Column(String)
    court_station = Column(String)
    type_of_case = Column(String)
    attachments = relationship("Attachment", back_populates="file")
    client_id = Column(Integer, ForeignKey("clients.id"))
    client = relationship("Client", back_populates="files")


class Attachment(Base):
    __tablename__ = "attachments"
    id = Column(Integer, primary_key=True)

    url = Column(String)

    file_id = Column(Integer, ForeignKey("files.id"))
    file = relationship("File", back_populates="attachments")


class Event(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True)
    date = Column(String)
    time = Column(String)
    description = Column(String)
    client_id = Column(Integer, ForeignKey("clients.id"))
    client = relationship("Client", back_populates="events")
