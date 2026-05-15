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
            
            for idx, hit in enumerate(hits):
                payload = hit.payload
                all_results.append({
                    "rank_in_collection": idx + 1,
                    "retrieval_score": float(hit.score),
                    "collection": collection,
                    "text": payload.get("text"),
                    "source": payload.get("source"),
                    "topic": payload.get("topic"),
                    "ground_truth": payload.get("ground_truth"),
                    "eval_rubric": payload.get("eval_rubric"),
                    "original_evidence": payload.get("original_evidence")
                })

        except Exception as e:
            print(f"ERROR querying {collection}: {e}")

    # Global reranking
    all_results = sorted(
        all_results,
        key=lambda x: x["retrieval_score"],
        reverse=True
    )

    return all_results[:top_k]