from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    secret_key: str = str(os.urandom(32))
    algorithm: str = "HS256"
    manifest_path: str = "../frontend/dist/.vite/manifest.json"
    static_url: str = "/static/"
    sqlalchemy_database_url: str = "sqlite:///./sql_app.db"
    mode: str = "dev"
    openapi_url: str = "/docs"


settings = Settings()
