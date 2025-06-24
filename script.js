const socket = io();

const loginDiv = document.getElementById("login");
const chatContainer = document.getElementById("chat-container");
const usernameInput = document.getElementById("username");
const joinBtn = document.getElementById("join");

const form = document.getElementById("chat-form");
const input = document.getElementById("msg");
const messages = document.getElementById("messages");

let username = "";

// Handle join
joinBtn.onclick = () => {
  const name = usernameInput.value.trim();
  if (name) {
    username = name;
    loginDiv.style.display = "none";
    chatContainer.style.display = "block";
    socket.emit("new-user", username);
  }
};

// Handle message send
form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (input.value) {
    const msg = input.value;
    socket.emit("chat message", msg);
    input.value = "";
  }
});

// Show real-time message with timestamp
socket.on("chat message", function (data) {
  const item = document.createElement("li");
  item.innerHTML = `<strong>${data.user}</strong> <span style="color: gray; font-size: 12px;">[${data.time}]</span>: ${convertEmojis(data.text)}`;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
});

// Show notification (join/leave)
socket.on("notification", function (text) {
  const item = document.createElement("li");
  item.className = "notification";
  item.textContent = text;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
});

// Load chat history on login
socket.on("chat-history", function (history) {
  history.forEach((data) => {
    const item = document.createElement("li");
    item.innerHTML = `<strong>${data.user}</strong> <span style="color: gray; font-size: 12px;">[${data.time}]</span>: ${convertEmojis(data.text)}`;
    messages.appendChild(item);
  });
  messages.scrollTop = messages.scrollHeight;
});

// Convert emoji shortcodes to real emojis
function convertEmojis(text) {
  return text
    .replace(/:\)/g, "😊")
    .replace(/:\(/g, "😞")
    .replace(/:D/g, "😄")
    .replace(/<3/g, "❤️");
}
