"""
Tests for scan and history endpoints.
"""

import pytest


@pytest.mark.asyncio
async def test_submit_scan_unauthenticated(client):
    """Test that scan submission requires authentication."""
    response = await client.post(
        "/api/scan",
        json={"url": "https://example.com"},
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_submit_scan_invalid_url(client, auth_headers):
    """Test scan submission with invalid URL."""
    response = await client.post(
        "/api/scan",
        headers=auth_headers,
        json={"url": "not-a-valid-url"},
    )
    assert response.status_code == 422  # Pydantic URL validation


@pytest.mark.asyncio
async def test_get_scan_not_found(client, auth_headers):
    """Test getting a non-existent scan."""
    response = await client.get("/api/scan/99999", headers=auth_headers)
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_scan_history_empty(client, auth_headers):
    """Test getting scan history when no scans exist."""
    response = await client.get("/api/history", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["items"] == []
    assert data["total"] == 0


@pytest.mark.asyncio
async def test_delete_scan_not_found(client, auth_headers):
    """Test deleting a non-existent scan."""
    response = await client.delete("/api/history/99999", headers=auth_headers)
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_health_check(client):
    """Test health check endpoint."""
    response = await client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "running"
    assert data["name"] == "HawkEye"


@pytest.mark.asyncio
async def test_api_health(client):
    """Test API health endpoint."""
    response = await client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
