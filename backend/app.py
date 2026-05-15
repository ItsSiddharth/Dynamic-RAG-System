from flask import Flask, request, jsonify
from flask_cors import CORS

from retrieval import retrieve_chunks
from generation import generate_answer
from query_rewrite import rewrite_query
from utils import list_collections
from vision import vision_describe
import os
from werkzeug.utils import secure_filename

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

    data = request.json

    user_query = data.get("query", "")

    selected_collections = data.get(
        "selected_collections",
        []
    )

    rewrite_enabled = data.get(
        "rewrite_query",
        True
    )

    if len(selected_collections) == 0:

        return jsonify({
            "error": "No collections selected"
        }), 400

    # Rewrite query
    if rewrite_enabled:

        rewritten_query = rewrite_query(user_query)

    else:

        rewritten_query = user_query

    # Retrieve chunks
    retrieved_chunks = retrieve_chunks(
        rewritten_query,
        selected_collections
    )

    # Generate answer
    answer = generate_answer(
        rewritten_query,
        retrieved_chunks
    )

    return jsonify({
        "original_query": user_query,
        "rewritten_query": rewritten_query,
        "selected_collections": selected_collections,
        "retrieved_chunks": retrieved_chunks,
        "answer": answer
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