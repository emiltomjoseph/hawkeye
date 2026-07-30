"""
Tests for authentication endpoints.
"""

import pytest


@pytest.mark.asyncio
async def test_register_success(client):
    """Test successful user registration."""
    response = await client.post(
        "/api/auth/register",
        json={
            "name": "John Doe",
            "email": "john@example.com",
            "password": "SecurePassword123!",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "John Doe"
    assert data["email"] == "john@example.com"
    assert "id" in data
    assert "created_at" in data
    assert "password" not in data
    assert "password_hash" not in data


@pytest.mark.asyncio
async def test_register_duplicate_email(client):
    """Test registration with an already registered email."""
    user_data = {
        "name": "Jane Doe",
        "email": "jane@example.com",
        "password": "SecurePassword123!",
    }
    # Register first time
    await client.post("/api/auth/register", json=user_data)

    # Try to register again with same email
    response = await client.post("/api/auth/register", json=user_data)
    assert response.status_code == 400
    assert "already registered" in response.json()["detail"].lower()


@pytest.mark.asyncio
async def test_register_invalid_email(client):
    """Test registration with an invalid email format."""
    response = await client.post(
        "/api/auth/register",
        json={
            "name": "Bad Email",
            "email": "not-an-email",
            "password": "SecurePassword123!",
        },
    )
    assert response.status_code == 422  # Validation error


@pytest.mark.asyncio
async def test_register_weak_password(client):
    """Test registration with a weak password."""
    response = await client.post(
        "/api/auth/register",
        json={
            "name": "Short Pass",
            "email": "short@example.com",
            "password": "weak",  # Less than policy requires
        },
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_login_success(client):
    """Test successful login."""
    # Register first
    await client.post(
        "/api/auth/register",
        json={
            "name": "Login User",
            "email": "login@example.com",
            "password": "SecurePassword123!",
        },
    )

    # Login
    response = await client.post(
        "/api/auth/login",
        json={
            "email": "login@example.com",
            "password": "SecurePassword123!",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"
    assert len(data["access_token"]) > 0
    assert len(data["refresh_token"]) > 0


@pytest.mark.asyncio
async def test_login_wrong_password(client):
    """Test login with wrong password."""
    # Register first
    await client.post(
        "/api/auth/register",
        json={
            "name": "Wrong Pass",
            "email": "wrongpass@example.com",
            "password": "CorrectPassword123!",
        },
    )

    # Login with wrong password
    response = await client.post(
        "/api/auth/login",
        json={
            "email": "wrongpass@example.com",
            "password": "IncorrectPassword123!",
        },
    )
    assert response.status_code == 401
    assert "invalid" in response.json()["detail"].lower()


@pytest.mark.asyncio
async def test_login_nonexistent_user(client):
    """Test login with a non-existent email."""
    response = await client.post(
        "/api/auth/login",
        json={
            "email": "nobody@example.com",
            "password": "SomePassword123!",
        },
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_refresh_token_success(client):
    """Test refreshing an access token."""
    # Register first
    await client.post(
        "/api/auth/register",
        json={
            "name": "Refresh User",
            "email": "refresh@example.com",
            "password": "SecurePassword123!",
        },
    )

    # Login to get tokens
    login_response = await client.post(
        "/api/auth/login",
        json={
            "email": "refresh@example.com",
            "password": "SecurePassword123!",
        },
    )
    refresh_token = login_response.json()["refresh_token"]

    # Refresh token
    refresh_response = await client.post(
        "/api/auth/refresh",
        json={"refresh_token": refresh_token},
    )
    assert refresh_response.status_code == 200
    data = refresh_response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert len(data["access_token"]) > 0
