# -*- coding: utf-8 -*-
"""
데이터베이스 스키마 문제 해결 스크립트
"""
import os
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError
import time

def get_db_url():
    """데이터베이스 URL 생성"""
    db_host = os.getenv('DB_HOST', 'postgres')
    db_port = os.getenv('DB_PORT', '5432')
    db_name = os.getenv('DB_NAME', 'cc_webapp')
    db_user = os.getenv('DB_USER', 'cc_user')
    db_password = os.getenv('DB_PASSWORD', 'cc_password')
    
    return f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"

def fix_invite_codes_table():
    """invite_codes 테이블 스키마 수정"""
    database_url = get_db_url()
    
    try:
        engine = create_engine(database_url)
        with engine.connect() as conn:
            print("🔧 invite_codes 테이블 수정 중...")
            
            # 기존 테이블 삭제
            conn.execute(text("DROP TABLE IF EXISTS invite_codes CASCADE;"))
            conn.commit()
            
            # 새로운 테이블 생성 (모델과 일치)
            create_table_sql = """
            CREATE TABLE invite_codes (
                id SERIAL PRIMARY KEY,
                code VARCHAR(6) UNIQUE NOT NULL,
                is_used BOOLEAN DEFAULT FALSE NOT NULL,
                used_by_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                used_at TIMESTAMP NULL
            );
            
            CREATE INDEX ix_invite_codes_code ON invite_codes(code);
            CREATE INDEX ix_invite_codes_is_used ON invite_codes(is_used);
            """
            
            conn.execute(text(create_table_sql))
            conn.commit()
            
            # 테스트 데이터 추가
            conn.execute(text("""
                INSERT INTO invite_codes (code, is_used) VALUES 
                ('TEST01', false),
                ('TEST02', false),
                ('TEST03', false),
                ('ADMIN1', false),
                ('DEMO01', false);
            """))
            conn.commit()
            
            print("✅ invite_codes 테이블 수정 완료!")
            return True
            
    except Exception as e:
        print(f"❌ 테이블 수정 실패: {e}")
        return False

def recreate_all_tables():
    """모든 테이블 재생성"""
    try:
        # 현재 앱 경로를 PYTHONPATH에 추가
        sys.path.insert(0, '/app')
        
        from app.database import engine, Base
        import app.models.auth_models
        import app.models.game_models  
        import app.models.content_models
        import app.models.analytics_models
        
        print("🏗️ 모든 테이블 재생성 중...")
        
        # 모든 테이블 삭제 후 재생성
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)
        
        print("✅ 모든 테이블 재생성 완료!")
        return True
        
    except Exception as e:
        print(f"❌ 테이블 재생성 실패: {e}")
        return False

if __name__ == "__main__":
    print("🚀 데이터베이스 스키마 문제 해결 시작...")
    
    # 방법 1: invite_codes 테이블만 수정
    if fix_invite_codes_table():
        print("🎉 invite_codes 테이블 수정 완료!")
    else:
        print("⚠️ invite_codes 테이블 수정 실패, 전체 재생성 시도...")
        if recreate_all_tables():
            print("🎉 전체 테이블 재생성 완료!")
        else:
            print("❌ 모든 시도 실패")
            sys.exit(1)
