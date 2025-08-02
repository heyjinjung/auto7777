#!/usr/bin/env python3
"""
데이터베이스 연결 문제 해결 스크립트
Casino-Club F2P Backend Database Connection Fixer
"""
import os
import sys
import time
import subprocess
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError

# 현재 디렉토리를 Python 경로에 추가
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def print_colored(message, color="white"):
    """컬러 출력"""
    colors = {
        "red": "\033[91m",
        "green": "\033[92m", 
        "yellow": "\033[93m",
        "blue": "\033[94m",
        "cyan": "\033[96m",
        "white": "\033[97m",
        "reset": "\033[0m"
    }
    print(f"{colors.get(color, colors['white'])}{message}{colors['reset']}")

def test_db_connection():
    """데이터베이스 연결 테스트"""
    
    # 환경변수에서 DB 정보 가져오기
    db_host = os.getenv('DB_HOST', 'postgres')
    db_port = os.getenv('DB_PORT', '5432')
    db_name = os.getenv('DB_NAME', 'cc_webapp')
    db_user = os.getenv('DB_USER', 'cc_user')
    db_password = os.getenv('DB_PASSWORD', 'cc_secret_password_2025')
    
    database_url = f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
    
    print_colored("🔍 데이터베이스 연결 테스트...", "cyan")
    print_colored(f"📍 연결 정보: {db_host}:{db_port}/{db_name}", "blue")
    
    max_retries = 30
    for attempt in range(max_retries):
        try:
            engine = create_engine(database_url)
            with engine.connect() as conn:
                result = conn.execute(text("SELECT 1"))
                print_colored("✅ 데이터베이스 연결 성공!", "green")
                return engine, True
                
        except OperationalError as e:
            print_colored(f"⏳ 연결 시도 {attempt + 1}/{max_retries} 실패: {str(e)[:100]}...", "yellow")
            time.sleep(2)
    
    print_colored("❌ 데이터베이스 연결 실패!", "red")
    return None, False

def create_tables():
    """테이블 생성"""
    try:
        print_colored("🏗️ 테이블 생성 시도...", "cyan")
        
        # 동적으로 database와 models import
        try:
            from app.database import engine, Base
            from app.models.user import User
            from app.models.user_action import UserAction
            from app.models.user_reward import UserReward
            # 추가 모델들...
            
            print_colored("📦 모델 import 성공", "green")
            
        except ImportError as e:
            print_colored(f"⚠️ 모델 import 실패: {e}", "yellow")
            print_colored("기본 테이블 생성 스크립트로 진행...", "yellow")
            return create_basic_tables()
        
        print_colored("🔨 SQLAlchemy로 테이블 생성 중...", "blue")
        Base.metadata.create_all(bind=engine)
        print_colored("✅ 테이블 생성 완료!", "green")
        return True
        
    except Exception as e:
        print_colored(f"❌ 테이블 생성 실패: {e}", "red")
        return False

def create_basic_tables():
    """기본 테이블 생성 (SQL 직접 실행)"""
    try:
        engine, connected = test_db_connection()
        if not connected:
            return False
            
        print_colored("🔨 기본 테이블 생성 중...", "blue")
        
        basic_tables_sql = """
        -- Users 테이블
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            nickname VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(100),
            password_hash VARCHAR(255),
            invite_code VARCHAR(20),
            cyber_tokens INTEGER DEFAULT 200000,
            regular_coins INTEGER DEFAULT 50000,
            premium_gems INTEGER DEFAULT 0,
            vip_tier VARCHAR(20) DEFAULT 'STANDARD',
            battlepass_level INTEGER DEFAULT 1,
            total_spent INTEGER DEFAULT 0,
            streak_count INTEGER DEFAULT 0,
            last_action_timestamp TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        -- User Actions 테이블
        CREATE TABLE IF NOT EXISTS user_actions (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            action_type VARCHAR(50) NOT NULL,
            action_data JSONB,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        -- User Rewards 테이블
        CREATE TABLE IF NOT EXISTS user_rewards (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            reward_type VARCHAR(50) NOT NULL,
            amount INTEGER NOT NULL,
            description TEXT,
            claimed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        -- User Segments 테이블
        CREATE TABLE IF NOT EXISTS user_segments (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            rfm_group VARCHAR(20),
            ltv_score FLOAT,
            risk_profile VARCHAR(20),
            last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        -- Battle Pass Status 테이블
        CREATE TABLE IF NOT EXISTS battlepass_status (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            level INTEGER DEFAULT 1,
            xp INTEGER DEFAULT 0,
            premium_unlocked BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        -- Shop Transactions 테이블
        CREATE TABLE IF NOT EXISTS shop_transactions (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            item_type VARCHAR(50) NOT NULL,
            item_id VARCHAR(50),
            price INTEGER NOT NULL,
            currency VARCHAR(20) NOT NULL,
            transaction_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        -- Indexes 생성
        CREATE INDEX IF NOT EXISTS idx_users_nickname ON users(nickname);
        CREATE INDEX IF NOT EXISTS idx_user_actions_user_id ON user_actions(user_id);
        CREATE INDEX IF NOT EXISTS idx_user_actions_timestamp ON user_actions(timestamp);
        CREATE INDEX IF NOT EXISTS idx_user_rewards_user_id ON user_rewards(user_id);
        CREATE INDEX IF NOT EXISTS idx_user_segments_user_id ON user_segments(user_id);
        """
        
        with engine.connect() as conn:
            conn.execute(text(basic_tables_sql))
            conn.commit()
            
        print_colored("✅ 기본 테이블 생성 완료!", "green")
        return True
        
    except Exception as e:
        print_colored(f"❌ 기본 테이블 생성 실패: {e}", "red")
        return False

def run_migrations():
    """Alembic 마이그레이션 실행"""
    try:
        print_colored("🔄 Alembic 마이그레이션 실행...", "cyan")
        
        # 현재 마이그레이션 상태 확인
        print_colored("📋 현재 마이그레이션 상태 확인...", "blue")
        result = subprocess.run(['alembic', 'current'], 
                              capture_output=True, text=True, cwd='/app')
        print_colored(f"현재 상태: {result.stdout.strip()}", "blue")
        
        # 마이그레이션 히스토리 확인
        print_colored("📚 마이그레이션 히스토리 확인...", "blue")
        result = subprocess.run(['alembic', 'history'], 
                              capture_output=True, text=True, cwd='/app')
        print_colored(f"히스토리: {result.stdout.strip()}", "blue")
        
        # 마이그레이션 실행
        print_colored("🚀 마이그레이션 업그레이드 실행...", "blue")
        result = subprocess.run(['alembic', 'upgrade', 'head'], 
                              capture_output=True, text=True, cwd='/app')
        
        if result.returncode == 0:
            print_colored("✅ 마이그레이션 완료!", "green")
            if result.stdout:
                print_colored(f"출력: {result.stdout}", "blue")
            return True
        else:
            print_colored(f"❌ 마이그레이션 실패: {result.stderr}", "red")
            if result.stdout:
                print_colored(f"출력: {result.stdout}", "yellow")
            return False
            
    except FileNotFoundError:
        print_colored("⚠️ Alembic가 설치되지 않았습니다.", "yellow")
        print_colored("pip install alembic 을 실행해주세요.", "yellow")
        return False
    except Exception as e:
        print_colored(f"❌ 마이그레이션 오류: {e}", "red")
        return False

def create_test_data():
    """테스트 데이터 생성"""
    try:
        print_colored("🧪 테스트 데이터 생성...", "cyan")
        
        engine, connected = test_db_connection()
        if not connected:
            return False
        
        test_data_sql = """
        -- 테스트 사용자 생성 (중복 방지)
        INSERT INTO users (nickname, email, invite_code, cyber_tokens, regular_coins, premium_gems, vip_tier)
        VALUES 
            ('testuser1', 'test1@casino-club.local', 'TEST001', 200000, 50000, 100, 'STANDARD'),
            ('vip_user', 'vip@casino-club.local', 'VIP001', 500000, 100000, 1000, 'VIP'),
            ('whale_user', 'whale@casino-club.local', 'WHALE01', 1000000, 200000, 5000, 'PREMIUM')
        ON CONFLICT (nickname) DO NOTHING;
        
        -- 테스트 액션 데이터
        INSERT INTO user_actions (user_id, action_type, action_data)
        SELECT 
            u.id,
            'SLOT_SPIN',
            '{"bet_amount": 5000, "result": "win", "prize": 10000}'::jsonb
        FROM users u 
        WHERE u.nickname = 'testuser1'
        LIMIT 1;
        
        -- 테스트 리워드 데이터
        INSERT INTO user_rewards (user_id, reward_type, amount, description)
        SELECT 
            u.id,
            'CYBER_TOKENS',
            10000,
            '슬롯 게임 승리 보상'
        FROM users u 
        WHERE u.nickname = 'testuser1'
        LIMIT 1;
        """
        
        with engine.connect() as conn:
            conn.execute(text(test_data_sql))
            conn.commit()
            
        print_colored("✅ 테스트 데이터 생성 완료!", "green")
        return True
        
    except Exception as e:
        print_colored(f"❌ 테스트 데이터 생성 실패: {e}", "red")
        return False

def verify_setup():
    """설정 검증"""
    try:
        print_colored("🔍 설정 검증 중...", "cyan")
        
        engine, connected = test_db_connection()
        if not connected:
            return False
        
        # 테이블 존재 확인
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
            """))
            tables = [row[0] for row in result]
            
        print_colored(f"📋 생성된 테이블: {', '.join(tables)}", "blue")
        
        # 사용자 수 확인
        with engine.connect() as conn:
            result = conn.execute(text("SELECT COUNT(*) FROM users"))
            user_count = result.scalar()
            
        print_colored(f"👥 등록된 사용자 수: {user_count}", "blue")
        
        print_colored("✅ 설정 검증 완료!", "green")
        return True
        
    except Exception as e:
        print_colored(f"❌ 설정 검증 실패: {e}", "red")
        return False

if __name__ == "__main__":
    print_colored("🚀 Casino-Club F2P 데이터베이스 연결 문제 해결 시작...", "cyan")
    print_colored("=" * 60, "blue")
    
    # 1. 연결 테스트
    engine, connected = test_db_connection()
    if not connected:
        print_colored("💡 해결 방법:", "yellow")
        print_colored("1. PostgreSQL 컨테이너가 실행 중인지 확인: docker ps", "yellow")
        print_colored("2. 환경변수가 올바른지 확인: echo $DB_HOST", "yellow")
        print_colored("3. 네트워크 연결 확인: docker network ls", "yellow")
        sys.exit(1)
    
    # 2. 테이블 생성
    print_colored("\n" + "=" * 60, "blue")
    if not create_tables():
        print_colored("⚠️ SQLAlchemy 테이블 생성 실패, 기본 테이블로 재시도...", "yellow")
        if not create_basic_tables():
            print_colored("❌ 테이블 생성 완전 실패!", "red")
            sys.exit(1)
    
    # 3. 마이그레이션 실행
    print_colored("\n" + "=" * 60, "blue")
    migration_success = run_migrations()
    if not migration_success:
        print_colored("⚠️ 마이그레이션 실패, 하지만 계속 진행합니다...", "yellow")
    
    # 4. 테스트 데이터 생성
    print_colored("\n" + "=" * 60, "blue")
    create_test_data()
    
    # 5. 설정 검증
    print_colored("\n" + "=" * 60, "blue")
    verify_setup()
    
    print_colored("\n" + "=" * 60, "green")
    print_colored("🎉 데이터베이스 설정 완료!", "green")
    print_colored("다음 단계:", "yellow")
    print_colored("1. 백엔드 API 서버 재시작", "yellow")
    print_colored("2. Swagger 문서 확인: http://localhost:8000/docs", "yellow")
    print_colored("3. 프론트엔드 연결 테스트", "yellow")
