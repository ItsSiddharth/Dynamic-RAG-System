from sentence_transformers import SentenceTransformer
from config import *
from qdrant_manager import client

# Load once globally
embedding_model = SentenceTransformer(EMBEDDING_MODEL)


def retrieve_chunks(query, selected_collections, top_k=TOP_K):

    query_embedding = embedding_model.encode(query).tolist()

    all_results = []

    for collection in selected_collections:

        try:
            hits = client.query_points(
                collection_name=collection,
                query=query_embedding,
                limit=top_k,
            ).points

            for hit in hits:
                all_results.append({
                    "score": hit.score,
                    "text": hit.payload.get("text"),
                    "source": hit.payload.get("source"),
                    "topic": hit.payload.get("topic"),
                    "ground_truth": hit.payload.get("ground_truth"),
                    "collection": collection
                })

        except Exception as e:
            print(f"ERROR querying {collection}: {e}")

    # Global rerank
    all_results = sorted(
        all_results,
        key=lambda x: x["score"],
        reverse=True
    )

    return all_results[:top_k]