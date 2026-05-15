from qdrant_manager import client


def list_collections():

    collections = client.get_collections().collections

    return [c.name for c in collections]