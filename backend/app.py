from flask import Flask, request, jsonify
from flask_cors import CORS
from translator import translate_text
from langdetect import detect
from langdetect.lang_detect_exception import LangDetectException

app = Flask(__name__)
CORS(app)

@app.route("/translate", methods=["POST"])
def translate():
    data = request.json

    if not data:
        return jsonify({"error": "No JSON body provided"}), 400

    text = data.get("text", "").strip()
    from_lang = data.get("from", "auto")
    to_lang = data.get("to", "hi")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    if from_lang == "auto":
        try:
            from_lang = detect(text)
        except LangDetectException:
            return jsonify({"error": "Could not detect language"}), 400

    try:
        translated = translate_text(text, from_lang, to_lang)
        return jsonify({"translated": translated})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/health")
def health():
    return {"status": "ok"}

if __name__ == "__main__":
    app.run(debug=True)