#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
used_at 컬럼 추가 스크립트
"""
import psycopg2
import os

# 환경변수에서 DB 정보 가져오기
db_host = os.getenv('DB_HOST', 'postgres')
db_port = os.getenv('DB_PORT', '5432')
db_name = os.getenv('DB_NAME', 'cc_webapp')
db_user = os.getenv('DB_USER', 'cc_user')
db_password = os.getenv('DB_PASSWORD', 'cc_secret_password_2025')

print('🔄 invite_codes 테이블에 used_at 컬럼 추가...')

try:
    conn = psycopg2.connect(
        host=db_host,
        port=db_port,
        database=db_name,
        user=db_user,
        password=db_password
    )
    cursor = conn.cursor()
    
    # used_at 컬럼 추가
    cursor.execute('ALTER TABLE invite_codes ADD COLUMN IF NOT EXISTS used_at TIMESTAMP;')
    
    conn.commit()
    cursor.close()
    conn.close()
    
    print('✅ used_at 컬럼 추가 완료!')
    
except Exception as e:
    print(f'❌ 오류 발생: {e}')
