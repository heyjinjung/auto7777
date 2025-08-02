#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
users 테이블에 필요한 컬럼들 추가
"""
import psycopg2
import os

# 환경변수에서 DB 정보 가져오기
db_host = os.getenv('DB_HOST', 'postgres')
db_port = os.getenv('DB_PORT', '5432')
db_name = os.getenv('DB_NAME', 'cc_webapp')
db_user = os.getenv('DB_USER', 'cc_user')
db_password = os.getenv('DB_PASSWORD', 'cc_secret_password_2025')

print('🔄 users 테이블에 필요한 컬럼들 추가...')

try:
    conn = psycopg2.connect(
        host=db_host,
        port=db_port,
        database=db_name,
        user=db_user,
        password=db_password
    )
    cursor = conn.cursor()
    
    # 필요한 컬럼들 추가
    columns_to_add = [
        'ALTER TABLE users ADD COLUMN IF NOT EXISTS site_id VARCHAR(50);',
        'ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);'
    ]
    
    for sql in columns_to_add:
        cursor.execute(sql)
        print(f'✅ 실행: {sql}')
    
    conn.commit()
    cursor.close()
    conn.close()
    
    print('✅ users 테이블 컬럼 추가 완료!')
    
except Exception as e:
    print(f'❌ 오류 발생: {e}')
