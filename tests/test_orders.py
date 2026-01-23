import pytest
from fastapi.testclient import TestClient


def test_root_endpoint(client: TestClient):
    """Test root endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "BotShop API"}


def test_health_endpoint(client: TestClient):
    """Test health endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_create_order_without_auth(client: TestClient):
    """Test creating order without authentication should fail."""
    order_data = {
        "items": [{"product_id": 1, "quantity": 2}],
        "delivery_address": "Test address",
        "phone": "+123456789"
    }
    response = client.post("/api/v1/orders", json=order_data)
    # Should return 401 (auth missing) or 422 (validation before auth)
    assert response.status_code in [401, 422]