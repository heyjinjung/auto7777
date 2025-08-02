from fastapi import FastAPI
import pytest
from httpx import AsyncClient

@pytest.fixture
async def client():
    app = FastAPI()
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client

@pytest.fixture
def sample_data():
    return {
        "nickname": "TestUser",
        "email": "testuser@example.com",
        "password": "securepassword"
    }