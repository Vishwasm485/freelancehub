import "./ChatModal.css";
import { useRef } from "react";
import { useEffect, useState, useCallback } from "react";
function ChatModal({ assignmentId, userId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const loadMessages = useCallback(async () => {
    const res = await fetch(
      `http://127.0.0.1:5000/api/chat/${assignmentId}`
    );
    const data = await res.json();
    setMessages(data);
  }, [assignmentId]);

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 2000);
    return () => clearInterval(interval);
  }, [loadMessages]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    await fetch("http://127.0.0.1:5000/api/chat/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        assignment_id: assignmentId,
        sender_id: userId,
        message: text
      })
    });

    setText("");
    loadMessages();
  };
const formatTime = (dateStr) => {
  if (!dateStr) return "";

  try {
    const clean = dateStr.includes("T")
      ? dateStr
      : dateStr.replace(" ", "T");

    const d = new Date(clean);

    if (isNaN(d)) return "";

    return d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch {
    return "";
  }
};
const bottomRef = useRef();
useEffect(() => {
  bottomRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);
return (
  <div className="chat-overlay">
    <div className="chat-container">

      {/* HEADER */}
      <div className="chat-header">
        <span>Chat</span>
        <span onClick={onClose} style={{ cursor: "pointer" }}>✖</span>
      </div>

      {/* MESSAGES */}
      <div className="chat-body">
    {messages.map(m => {
        const isMe = Number(m.sender_id) === Number(userId);

        return (
            <div
            key={m.id}
            className={`chat-row ${isMe ? "left" : "right"}`}
            >
            <div className="chat-bubble">
                <div>{m.message}</div>
                <div className="msg-time">
                {formatTime(m.created_at)}
                </div>
            </div>
            </div>
        );
        })}
        <div ref={bottomRef}></div>
      </div>

      {/* INPUT */}
      <div className="chat-footer">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>

    </div>
  </div>
);
}

export default ChatModal;