import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

ROOT_DIR = Path(__file__).resolve().parents[1]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from app.main import app
from app.services.neo4j_service import neo4j_service


@pytest.fixture(autouse=True)
def mock_neo4j(monkeypatch: pytest.MonkeyPatch) -> None:
    async def fake_connect() -> None:
        return None

    async def fake_disconnect() -> None:
        return None

    async def fake_verify_connectivity() -> bool:
        return True

    monkeypatch.setattr(neo4j_service, "connect", fake_connect)
    monkeypatch.setattr(neo4j_service, "disconnect", fake_disconnect)
    monkeypatch.setattr(neo4j_service, "verify_connectivity", fake_verify_connectivity)


@pytest.fixture
def client() -> TestClient:
    with TestClient(app) as test_client:
        yield test_client
