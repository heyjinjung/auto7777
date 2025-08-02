# -*- coding: utf-8 -*-
"""
데이터베이스 초기화 및 마이그레이션 스크립트 (Python)
"""

import os
import sys
import time
import subprocess
import psycopg2
from psycopg2 import sql
from dotenv import load_dotenv

# 환경변수 로드
load_dotenv()

# 데이터베이스 설정
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': int(os.getenv('DB_PORT', '5432')),
    'database': os.getenv('DB_NAME', 'cc_webapp'),
    'user': os.getenv('DB_USER', 'cc_user'),
    'password': os.getenv('DB_PASSWORD', 'cc_secret_password_2025')
}

def wait_for_db():
    """데이터베이스 연결 대기"""
    print("⏳ Waiting for database connection...")
    max_attempts = 30
    attempt = 0
    
    while attempt < max_attempts:
        try:
            conn = psycopg2.connect(**DB_CONFIG)
            conn.close()
            print("✅ Database connection established")
            return True
        except psycopg2.OperationalError:
            attempt += 1
            print(f"   Attempt {attempt}/{max_attempts}: Waiting for PostgreSQL...")
            time.sleep(2)
    
    print("❌ Failed to connect to database")
    return False

def run_alembic_command(command):
    """Alembic 명령 실행"""
    try:
        result = subprocess.run(
            f"alembic {command}",
            shell=True,
            capture_output=True,
            text=True,
            encoding='utf-8'
        )
        return result.returncode == 0, result.stdout, result.stderr
    except Exception as e:
        return False, "", str(e)

def check_migration_status():
    """마이그레이션 상태 확인"""
    print("🔍 Checking current migration status...")
    
    # 현재 리비전 확인
    success, stdout, stderr = run_alembic_command("current")
    if not success:
        print("   No current revision found")
        return None
    
    current_rev = stdout.strip() if stdout.strip() else None
    print(f"   Current revision: {current_rev or 'none'}")
    return current_rev

def initialize_database():
    """데이터베이스 초기화"""
    print("🗄️ Database Migration & Setup Script")
    print("======================================")
    
    # 환경 설정 출력
    print("📋 Environment Configuration:")
    for key, value in DB_CONFIG.items():
        if key == 'password':
            print(f"   {key}: {'*' * len(str(value))}")
        else:
            print(f"   {key}: {value}")
    print()
    
    # 데이터베이스 연결 확인
    if not wait_for_db():
        sys.exit(1)
    
    # 마이그레이션 히스토리 확인
    print("📜 Checking Alembic migration history...")
    success, stdout, stderr = run_alembic_command("history --verbose")
    if success and stdout:
        print("   Migration history found:")
        print("   " + "\n   ".join(stdout.split('\n')[:5]))
    else:
        print("   No migration history found")
    
    # 현재 리비전 확인
    current_rev = check_migration_status()
    
    # 마이그레이션 실행
    if not current_rev or current_rev == "none":
        print("🚀 Initializing database with latest migration...")
        success, stdout, stderr = run_alembic_command("stamp head")
        if success:
            print("✅ Database initialized")
        else:
            print(f"❌ Failed to initialize: {stderr}")
            sys.exit(1)
    else:
        print("🔄 Upgrading database to latest migration...")
        success, stdout, stderr = run_alembic_command("upgrade head")
        if success:
            print("✅ Database upgraded")
        else:
            print(f"❌ Failed to upgrade: {stderr}")
            sys.exit(1)
    
    # 최종 상태 확인
    print("📊 Final migration status:")
    success, stdout, stderr = run_alembic_command("current --verbose")
    if success and stdout:
        print("   " + stdout.strip())
    
    success, stdout, stderr = run_alembic_command("history --verbose")
    if success and stdout:
        lines = stdout.split('\n')[:5]
        print("   Recent migrations:")
        for line in lines:
            if line.strip():
                print("   " + line)
    
    print()
    print("🎉 Database setup completed successfully!")

if __name__ == "__main__":
    initialize_database()
