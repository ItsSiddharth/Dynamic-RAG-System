from flask import Flask, request, jsonify
from flask_cors import CORS

from retrieval import retrieve_chunks
from generation import generate_answer
from query_rewrite import rewrite_query
from utils import list_collections
from vision import vision_describe
import os
from werkzeug.utils import secure_filename

import json
from datetime import datetime

app = Flask(__name__)

CORS(app)


@app.route("/")
def home():

    return jsonify({
        "message": "Cybersecurity RAG API Running"
    })


@app.route("/collections", methods=["GET"])
def collections():

    return jsonify({
        "collections": list_collections()
    })


@app.route("/rewrite", methods=["POST"])
def rewrite():

    data = request.json

    query = data.get("query", "")

    rewritten = rewrite_query(query)

    return jsonify({
        "original_query": query,
        "rewritten_query": rewritten
    })


@app.route("/chat", methods=["POST"])
def chat():

    user_query = request.form.get("query", "")

    selected_collections = request.form.getlist(
        "selected_collections"
    )

    rewrite_enabled = (
        request.form.get("rewrite_query", "true")
        .lower() == "true"
    )

    image = request.files.get("image")

    if len(selected_collections) == 0:

        return jsonify({
            "error": "No collections selected"
        }), 400

    # =========================
    # IMAGE PROCESSING
    # =========================

    vision_result = None
    image_query = None

    if image:

        try:

            filename = secure_filename(
                image.filename
            )

            save_path = os.path.join(
                "/home/nam/projects/sid/RAG-Assignment3/data/uploads",
                filename
            )

            image.save(save_path)

            vision_result = vision_describe(
                save_path
            )

            image_query = vision_result

        except Exception as e:

            return jsonify({
                "error": f"Vision failed: {str(e)}"
            }), 500

    # =========================
    # COMBINE INPUTS
    # =========================

    combined_query = user_query

    if image_query:

        combined_query += (
            "\n\nIMAGE CONTEXT:\n"
            + image_query
        )

    # =========================
    # QUERY REWRITE
    # =========================

    if rewrite_enabled:

        rewritten_query = rewrite_query(
            combined_query
        )

    else:

        rewritten_query = combined_query

    # =========================
    # RETRIEVAL
    # =========================

    retrieved_chunks = retrieve_chunks(
        rewritten_query,
        selected_collections
    )

    # =========================
    # GENERATION
    # =========================

    answer = generate_answer(
        rewritten_query,
        retrieved_chunks
    )

    # =========================
    # STRUCTURED CITATIONS
    # =========================

    citations = []

    for idx, chunk in enumerate(retrieved_chunks):

        citations.append({

            "source_number": idx + 1,

            "collection": chunk["collection"],

            "source": chunk.get("source"),

            "topic": chunk.get("topic"),

            "retrieval_score":
                round(
                    chunk["retrieval_score"],
                    4
                ),

            "preview":
                chunk["text"][:300]
        })

    # =========================
    # FINAL RESPONSE
    # =========================
        log_entry = {

        "timestamp":
            str(datetime.now()),

        "original_query":
            user_query,

        "rewritten_query":
            rewritten_query,

        "selected_collections":
            selected_collections,

        "retrieved_chunks":
            retrieved_chunks,

        "answer":
            answer
    }

    with open(
        "/home/nam/projects/sid/RAG-Assignment3/backend/logs/chat_logs.jsonl",
        "a"
    ) as f:

        f.write(
            json.dumps(log_entry)
            + "\n"
        )

    return jsonify({

        "success": True,

        "pipeline": {

            "vision_used":
                image is not None,

            "query_rewrite_used":
                rewrite_enabled
        },

        "input": {

            "original_query":
                user_query,

            "combined_query":
                combined_query,

            "rewritten_query":
                rewritten_query
        },

        "retrieval": {

            "selected_collections":
                selected_collections,

            "top_k":
                len(retrieved_chunks),

            "citations":
                citations
        },

        "vision_result":
            vision_result,

        "answer":
            answer
    })

@app.route("/vision", methods=["POST"])
def vision():

    if "image" not in request.files:

        return jsonify({
            "error": "No image uploaded"
        }), 400

    image = request.files["image"]

    filename = secure_filename(image.filename)

    save_path = os.path.join(
        "/home/nam/projects/sid/RAG-Assignment3/data/uploads",
        filename
    )

    image.save(save_path)

    try:

        result = vision_describe(save_path)

        return jsonify({
            "vision_result": result
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


if __name__ == "__main__":

    app.run(
    host="0.0.0.0",
    port=5000,
    debug=False,
    use_reloader=False
    )

# Example CURL COmmand to test route
"""
curl -X POST http://localhost:5000/chat \-F "query=How do we secure wireless guest networks?" \-F "selected_collections=hf_secqa_chunks" \-F "selected_collections=hf_qaa_chunks"
curl -X POST http://localhost:5000/chat \-F "query=Analyze this screenshot" \-F "selected_collections=hf_secqa_chunks" \-F "image=@/home/nam/projects/sid/RAG-Assignment3/data/cyber-sec-test.jpg"
"""