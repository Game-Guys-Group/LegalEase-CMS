from abc import ABC, abstractmethod
import json
import os
import uuid
import shutil

from fastapi import UploadFile


class Strorage(ABC):
    @abstractmethod
    def save(self, file: UploadFile) -> str:
        pass

    @abstractmethod
    def load(self, key: str) -> tuple[str, str] | None:
        pass

    @abstractmethod
    def delete(self, key: str):
        pass


STORAGE_PATH = "local"
STORAGE_CONFIG_PATH: str = f"{STORAGE_PATH}/config.json"


class LocalStorage(Strorage):
    def __init__(self):
        global STORAGE_PATH
        self.data = {}
        if not os.path.exists(STORAGE_PATH):
            os.mkdir(STORAGE_PATH)

        if not os.path.exists(STORAGE_CONFIG_PATH):
            with open(STORAGE_CONFIG_PATH, "w") as file:
                json.dump({}, file)

        with open(STORAGE_CONFIG_PATH, "r") as file:
            self.data = json.load(file)

        STORAGE_PATH = os.path.abspath(STORAGE_PATH)
        print(f"storage path is {STORAGE_PATH}")

    def load_stotage(self):
        if os.path.exists(STORAGE_CONFIG_PATH):
            with open(STORAGE_CONFIG_PATH, "r") as file:
                self.data = json.load(file)

    def sync(self):
        with open(STORAGE_CONFIG_PATH, "w") as file:
            json.dump(self.data, file)

    def save(self, file: UploadFile) -> str:
        db_name = str(uuid.uuid4())

        self.data[db_name] = [file.filename, f"{STORAGE_PATH}/{db_name}"]

        with open(self.data[db_name][1], "wb") as f:
            shutil.copyfileobj(file.file, f)

        self.sync()

        return db_name

    def load(self, key: str) -> tuple[str, str] | None:

        if not key in self.data:
            return None

        return self.data[key][0], self.data[key][1]

    def delete(self, key: str):
        self.data.pop(key)
        self.sync()


file_store = LocalStorage()
