"""
Tests for user profile endpoints.
"""

import pytest


@pytest.mark.asyncio
async def test_get_profile_authenticated(client, auth_headers):
    """Test getting profile when authenticated."""
    response = await client.get("/api/user/profile", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test User"
    assert data["email"] == "test@example.com"
    assert "id" in data
    assert "created_at" in data
    assert "is_active" in data
    assert data["is_active"] is True


@pytest.mark.asyncio
async def test_get_profile_unauthenticated(client):
    """Test getting profile without authentication token."""
    response = await client.get("/api/user/profile")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_update_profile(client, auth_headers):
    """Test updating user profile name."""
    response = await client.put(
        "/api/user/profile",
        headers=auth_headers,
        json={"name": "Updated Name"},
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Updated Name"


@pytest.mark.asyncio
async def test_update_profile_email(client, auth_headers):
    """Test updating user profile email."""
    response = await client.put(
        "/api/user/profile",
        headers=auth_headers,
        json={"email": "updated@example.com"},
    )
    assert response.status_code == 200
    assert response.json()["email"] == "updated@example.com"


@pytest.mark.asyncio
async def test_change_password(client, auth_headers):
    """Test changing password with correct old password."""
    response = await client.put(
        "/api/user/change-password",
        headers=auth_headers,
        json={
            "old_password": "TestPassword123!",
            "new_password": "NewPassword456!",
        },
    )
    assert response.status_code == 200
    assert "success" in response.json()["message"].lower()

    # Verify new password works
    login_response = await client.post(
        "/api/auth/login",
        json={
            "email": "test@example.com",
            "password": "NewPassword456!",
        },
    )
    assert login_response.status_code == 200


@pytest.mark.asyncio
async def test_change_password_wrong_old(client, auth_headers):
    """Test changing password with incorrect old password."""
    response = await client.put(
        "/api/user/change-password",
        headers=auth_headers,
        json={
            "old_password": "wrongoldpassword",
            "new_password": "NewPassword456!",
        },
    )
    assert response.status_code == 400


@pytest.mark.asyncio
async def test_deactivate_account(client, auth_headers):
    """Test deactivating user account."""
    response = await client.delete("/api/user/profile", headers=auth_headers)
    assert response.status_code == 200
    assert "success" in response.json()["message"].lower()

    # Verify we can no longer get profile because account is inactive
    profile_response = await client.get("/api/user/profile", headers=auth_headers)
    assert profile_response.status_code == 403
    assert "inactive" in profile_response.json()["detail"].lower()
