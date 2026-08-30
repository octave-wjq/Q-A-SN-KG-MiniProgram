from fastapi.testclient import TestClient


def test_health_check(client: TestClient) -> None:
    response = client.get("/health")
    assert response.status_code == 200

    payload = response.json()
    assert payload["code"] == 0
    assert payload["message"] == "success"
    assert payload["data"]["status"] == "ok"
    assert payload["data"]["neo4j_connected"] is True


def test_neo4j_health_check(client: TestClient) -> None:
    response = client.get("/health/neo4j")
    assert response.status_code == 200

    payload = response.json()
    assert payload["code"] == 0
    assert payload["message"] == "success"
    assert payload["data"]["neo4j_connected"] is True
