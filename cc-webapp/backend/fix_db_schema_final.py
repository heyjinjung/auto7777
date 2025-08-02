#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
데이터베이스 스키마 최종 수정 스크립트
use_count 컬럼 추가 및 테이블 재생성
"""
import psycopg2
import os
import sys

def fix_database_schema():
    """데이터베이스 스키마 수정"""
    
    # 환경변수에서 DB 정보 가져오기
    db_host = os.getenv('DB_HOST', 'postgres')
    db_port = os.getenv('DB_PORT', '5432')
    db_name = os.getenv('DB_NAME', 'cc_webapp')
    db_user = os.getenv('DB_USER', 'cc_user')
    db_password = os.getenv('DB_PASSWORD', 'cc_secret_password_2025')
    
    print('🔄 데이터베이스 스키마 재생성 시작...')
    
    try:
        conn = psycopg2.connect(
            host=db_host,
            port=db_port,
            database=db_name,
            user=db_user,
            password=db_password
        )
        cursor = conn.cursor()
        
        # 기존 테이블 삭제 (cascade로 의존성 제거)
        print('🗑️ 기존 테이블 삭제...')
        cursor.execute('DROP TABLE IF EXISTS user_sessions CASCADE;')
        cursor.execute('DROP TABLE IF EXISTS invite_codes CASCADE;')
        cursor.execute('DROP TABLE IF EXISTS users CASCADE;')
        
        # 새로운 테이블 생성
        print('🏗️ 새로운 테이블 생성...')
        
        # users 테이블
        cursor.execute('''
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                nickname VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100),
                password_hash VARCHAR(255),
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                total_cyber_tokens INTEGER DEFAULT 200,
                total_spent INTEGER DEFAULT 0,
                last_login TIMESTAMP,
                vip_tier VARCHAR(20) DEFAULT 'STANDARD'
            );
        ''')
        
        # invite_codes 테이블 (use_count 포함)
        cursor.execute('''
            CREATE TABLE invite_codes (
                id SERIAL PRIMARY KEY,
                code VARCHAR(20) UNIQUE NOT NULL,
                is_used BOOLEAN DEFAULT false,
                use_count INTEGER DEFAULT 0,
                max_uses INTEGER DEFAULT 1,
                expires_at TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_by_user_id INTEGER REFERENCES users(id)
            );
        ''')
        
        # user_sessions 테이블
        cursor.execute('''
            CREATE TABLE user_sessions (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                session_token VARCHAR(255) UNIQUE NOT NULL,
                expires_at TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        ''')
        
        # 기본 초대코드 삽입
        print('📝 기본 데이터 삽입...')
        cursor.execute('''
            INSERT INTO invite_codes (code, use_count, max_uses) VALUES
            ('WELCOME01', 0, 100),
            ('CASINO01', 0, 50), 
            ('TEST001', 0, 10),
            ('VIP2025', 0, 5);
        ''')
        
        conn.commit()
        cursor.close()
        conn.close()
        
        print('✅ 데이터베이스 스키마 재생성 완료!')
        return True
        
    except Exception as e:
        print(f'❌ 오류 발생: {e}')
        return False

if __name__ == "__main__":
    success = fix_database_schema()
    sys.exit(0 if success else 1)
