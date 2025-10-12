from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    FRONTEND_HOST: str
    BACKEND_HOST: str

    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    JWT_SECRET: str
    REDIRECT_URI: str = "http://localhost:5173"

    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_HOST: str
    DATABASE_URL: str

    @property
    def all_cors_origins(self) -> list[str]:
        return [self.FRONTEND_HOST]

settings = Settings()