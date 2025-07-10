from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json
from fuzzywuzzy import fuzz
import os

app = Flask(__name__, static_url_path='', static_folder='.')
CORS(app)

with open("brochure.json", "r", encoding="utf-8") as f:
    data = json.load(f)

@app.route("/")
def home():
    return send_from_directory('.', 'index.html')

@app.route("/style.css")
def style():
    return send_from_directory('.', 'style.css')

@app.route("/script.js")
def script():
    return send_from_directory('.', 'script.js')

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message", "").lower()

    best_score = 0
    best_answer = None

    for block in data:
        for idx, question in enumerate(block["questions"]):
            score = fuzz.token_sort_ratio(user_message, question.lower())
            if score > best_score:
                best_score = score
                best_answer = block["answers"][idx]

    if best_score >= 70:
        return jsonify({"reply": best_answer})
    else:
        return jsonify({"reply": "❌ Sorry, I couldn’t find the answer in the brochure."})

if __name__ == "__main__":
    from waitress import serve
    serve(app, host="0.0.0.0", port=10000)
