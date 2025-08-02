
# -*- coding: utf-8 -*-
"""
Alembic Environment Configuration
데이터베이스 마이그레이션 환경 설정
"""

import os
import sys
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context
from dotenv import load_dotenv

# 환경변수 로드
load_dotenv()

# 백엔드 앱 경로 추가
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# 모델 임포트
from app.models import Base

# Alembic 설정 객체
config = context.config

# 메타데이터 설정
target_metadata = Base.metadata

# 데이터베이스 URL 환경변수에서 설정
DB_USER = os.getenv("DB_USER", "cc_user")
DB_PASSWORD = os.getenv("DB_PASSWORD", "cc_secret_password_2025")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "cc_webapp")

database_url = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
config.set_main_option("sqlalchemy.url", database_url)

# 로깅 설정
if config.config_file_name is not None:
    fileConfig(config.config_file_name)


def run_migrations_offline() -> None:
    """
    오프라인 모드에서 마이그레이션 실행
    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
        compare_server_default=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """
    온라인 모드에서 마이그레이션 실행
    """
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
        connect_args={
            "client_encoding": "utf8",
            "application_name": "cc_webapp_alembic"
        }
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
            compare_server_default=True,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
    run_migrations_online()
