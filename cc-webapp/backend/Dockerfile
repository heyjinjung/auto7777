FROM python:3.11-slim

WORKDIR /app

# 시스템 패키지 설치 (postgresql-client, wget 추가)
RUN apt-get update && apt-get install -y gcc libpq-dev postgresql-client wget && rm -rf /var/lib/apt/lists/*

# 의존성 복사 및 설치 (빠른 빌드를 위해 최소 패키지 사용)
COPY requirements.minimal.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# 앱 코드 복사
COPY . .

# 실행 권한 부여
RUN chmod +x db_auto_init.py

# 포트 노출
EXPOSE 8000

# 간단한 시작 스크립트
CMD ["sh", "-c", "echo '🚀 Starting Casino-Club Backend...' && python db_auto_init.py && echo '🌟 Starting FastAPI Server...' && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"]
