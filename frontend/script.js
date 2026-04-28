// ✅ Set this to your deployed backend URL in production
// e.g. "https://your-app.onrender.com/translate"
// Locally it falls back to localhost
const API_URL = window.ENV_API_URL || "http://127.0.0.1:5000/translate";

async function translateText() {
  const text = document.getElementById("inputText").value.trim();
  const from = document.getElementById("fromLang").value;
  const to = document.getElementById("toLang").value;
  const outputEl = document.getElementById("outputText");
  const errorEl = document.getElementById("errorText");

  // Clear previous state
  outputEl.innerText = "";
  errorEl.innerText = "";

  // Guard: don't send empty requests
  if (!text) {
    errorEl.innerText = "⚠️ Please enter some text to translate.";
    return;
  }

  outputEl.innerText = "Translating...";

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, from, to }),
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      // Show API-level error (e.g. model not installed, detect failed)
      outputEl.innerText = "";
      errorEl.innerText = `❌ ${data.error || "Translation failed."}`;
      return;
    }

    outputEl.innerText = data.translated;

  } catch (err) {
    outputEl.innerText = "";
    errorEl.innerText = "❌ Could not connect to the server. Is the backend running?";
    console.error(err);
  }
}

// 🎤 Speech-to-text using Web Speech API
function startMic() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Your browser doesn't support speech recognition. Try Chrome.");
    return;
  }

  const recognition = new SpeechRecognition();
  const micBtn = document.getElementById("micBtn");

  // ✅ Full locale codes — required by Web Speech API across all browsers
  const langLocaleMap = {
    en: "en-US",
    hi: "hi-IN",
    fr: "fr-FR",
    es: "es-ES",
  };

  const fromLang = document.getElementById("fromLang").value;
  recognition.lang = langLocaleMap[fromLang] || "en-US"; // fallback for "auto"
  recognition.interimResults = false;

  micBtn.innerText = "🔴 Listening...";
  micBtn.disabled = true;

  recognition.start();

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    document.getElementById("inputText").value = transcript;
    micBtn.innerText = "🎤 Speak";
    micBtn.disabled = false;
    // ✅ Wait for DOM to commit the value before reading it in translateText()
    setTimeout(() => translateText(), 100);
  };

  recognition.onerror = (event) => {
    micBtn.innerText = "🎤 Speak";
    micBtn.disabled = false;
    alert(`Mic error: ${event.error}`);
  };

  recognition.onend = () => {
    micBtn.innerText = "🎤 Speak";
    micBtn.disabled = false;
  };
}