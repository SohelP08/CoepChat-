const toggleBtn = document.getElementById("chat-toggle");
const chatWindow = document.getElementById("chatbot");
let chatOpened = false;

toggleBtn.addEventListener("click", () => {
  if (chatWindow.style.display === "flex") {
    chatWindow.style.display = "none";
    toggleBtn.classList.add("floating");  // ✨ Add animation back
  } else {
    chatWindow.style.display = "flex";
    toggleBtn.classList.remove("floating");  // 🛑 Stop when chat is open
    if (!chatOpened) {
      setTimeout(() => {
        appendMessage("Bot", "👋 Hi there! I’m your Admission Assistant. How can I help you today?", "bot");
      }, 300);
      chatOpened = true;
    }
  }
});


function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value.trim();
  if (!message) return;

  appendMessage("You", message, "user");
  input.value = "";

  fetch("/chat", {

    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  })
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data.reply)) {
        appendStructuredMessage("Bot", data.reply, "bot");
      } else {
        appendMessage("Bot", data.reply, "bot");
      }
    })
    .catch(() => {
      appendMessage("Bot", "Server not reachable", "bot");
    });
}

function appendMessage(sender, message, className) {
  const chatBox = document.getElementById("chat-box");
  const msg = document.createElement("div");
  msg.className = `message ${className}`;
  msg.innerHTML = `${message}<div class="timestamp">${getCurrentTime()}</div>`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function appendStructuredMessage(sender, lines, className) {
  const chatBox = document.getElementById("chat-box");
  const msg = document.createElement("div");
  msg.className = `message ${className}`;
  msg.innerHTML = `<ul>${lines.map(line => `<li>${line}</li>`).join("")}</ul><div class="timestamp">${getCurrentTime()}</div>`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

document.getElementById("user-input").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});
