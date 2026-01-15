from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    FORCE_DB_RESET: bool

    FRONTEND_HOST: str
    BACKEND_HOST: str

    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    JWT_SECRET: str

    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_HOST: str
    DATABASE_URL: str

    @property
    def REDIRECT_URI(self) -> str:
        return self.FRONTEND_HOST

    @property
    def all_cors_origins(self) -> list[str]:
        return [self.FRONTEND_HOST]


settings = Settings()
