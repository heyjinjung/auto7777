#!/bin/bash
# 데이터베이스 초기화 및 마이그레이션 스크립트

set -e

echo "🗄️ Database Migration & Setup Script"
echo "======================================"

# 환경 변수 확인
echo "📋 Environment Configuration:"
echo "   DB_HOST: ${DB_HOST:-localhost}"
echo "   DB_PORT: ${DB_PORT:-5432}"
echo "   DB_NAME: ${DB_NAME:-cc_webapp}"
echo "   DB_USER: ${DB_USER:-cc_user}"
echo ""

# 데이터베이스 연결 대기
echo "⏳ Waiting for database connection..."
while ! nc -z ${DB_HOST:-localhost} ${DB_PORT:-5432}; do
  echo "   Waiting for PostgreSQL to be ready..."
  sleep 2
done
echo "✅ Database connection established"

# Alembic 히스토리 확인
echo "📜 Checking Alembic migration history..."
alembic history --verbose || echo "No migration history found"

# 현재 리비전 확인
echo "🔍 Checking current revision..."
CURRENT_REV=$(alembic current 2>/dev/null || echo "none")
echo "   Current revision: $CURRENT_REV"

# 마이그레이션 실행
if [ "$CURRENT_REV" = "none" ] || [ -z "$CURRENT_REV" ]; then
    echo "🚀 Initializing database with latest migration..."
    alembic stamp head
    echo "✅ Database initialized"
else
    echo "🔄 Upgrading database to latest migration..."
    alembic upgrade head
    echo "✅ Database upgraded"
fi

# 마이그레이션 상태 최종 확인
echo "📊 Final migration status:"
alembic current --verbose
alembic history --verbose | head -5

echo ""
echo "🎉 Database setup completed successfully!"
