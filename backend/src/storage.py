from abc import ABC, abstractmethod
import json
from typing import BinaryIO
import os
import uuid
import shutil


class Strorage(ABC):
    @abstractmethod
    def save(self, file: BinaryIO) -> str:
        pass

    @abstractmethod
    def load(self, key: str) -> BinaryIO | None:
        pass

    @abstractmethod
    def delete(self, key: str):
        pass


STORAGE_PATH = "local"
STORAGE_CONFIG_PATH = f"{STORAGE_PATH}/config.json"


class LocalStorage(Strorage):
    def __init__(self):
        self.data = {}
        if not os.path.exists(STORAGE_PATH):
            os.mkdir(STORAGE_PATH)

    def load_stotage(self):
        if os.path.exists(STORAGE_CONFIG_PATH):
            with open(STORAGE_CONFIG_PATH, "r") as file:
                self.data = json.load(file)

    def sync(self):
        with open(STORAGE_CONFIG_PATH, "w") as file:
            json.dump(self.data, file)

    def save(self, file: BinaryIO) -> str:
        db_name = str(uuid.uuid4())

        self.data[db_name] = f"{STORAGE_PATH}/{db_name}"

        with open(self.data[db_name], "wb") as f:
            shutil.copyfileobj(file, f)

        self.sync()

        return db_name

    def load(self, key: str) -> BinaryIO | None:

        if not key in self.data:
            return None

        with open(self.data[key], "rb") as file:
            return file

    def delete(self, key: str):
        self.data.pop(key)
        self.sync()
