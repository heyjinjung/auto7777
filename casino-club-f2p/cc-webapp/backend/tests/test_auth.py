from fastapi import FastAPI, HTTPException
from fastapi.testclient import TestClient
from app.api.v1.auth import router as auth_router
from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import create_access_token

app = FastAPI()
app.include_router(auth_router)

client = TestClient(app)

def create_test_user():
    user_data = UserCreate(nickname="testuser", email="test@example.com", password="password123")
    response = client.post("/api/users/signup", json=user_data.dict())
    return response

def test_signup():
    response = create_test_user()
    assert response.status_code == 201
    assert response.json()["nickname"] == "testuser"

def test_login():
    create_test_user()
    response = client.post("/api/users/login", json={"email": "test@example.com", "password": "password123"})
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_login_invalid_credentials():
    response = client.post("/api/users/login", json={"email": "wrong@example.com", "password": "wrongpassword"})
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid credentials"

def test_get_user_profile():
    create_test_user()
    login_response = client.post("/api/users/login", json={"email": "test@example.com", "password": "password123"})
    access_token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {access_token}"}
    response = client.get("/api/users/1/profile", headers=headers)
    assert response.status_code == 200
    assert response.json()["nickname"] == "testuser"

def test_get_user_profile_unauthorized():
    response = client.get("/api/users/1/profile")
    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"