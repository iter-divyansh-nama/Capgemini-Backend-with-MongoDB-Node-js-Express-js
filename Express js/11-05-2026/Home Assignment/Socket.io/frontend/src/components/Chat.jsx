import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./Chat.css";

const socket = io("http://localhost:3000");

function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState(1);
  const [typingText, setTypingText] = useState("");

  const messagesEndRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // Socket listeners
  useEffect(() => {
    socket.on("chat_message", (data) => {
      const isMine = data.id === socket.id.slice(0, 6);

      setMessages((prev) => [
        ...prev,
        {
          type: "chat",
          isMine,
          id: isMine ? "You" : data.id,
          text: data.text,
          timestamp: data.timestamp,
        },
      ]);
    });

    socket.on("system_message", (msg) => {
      setMessages((prev) => [
        ...prev,
        {
          type: "system",
          text: msg,
        },
      ]);
    });

    socket.on("user_count", (count) => {
      setOnlineUsers(count);
    });

    socket.on("typing", ({ userId, isTyping }) => {
      if (isTyping) {
        setTypingText(`${userId} is typing...`);
      } else {
        setTypingText("");
      }
    });

    return () => {
      socket.off("chat_message");
      socket.off("system_message");
      socket.off("user_count");
      socket.off("typing");
    };
  }, []);

  // Send Message
  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("chat_message", {
      text: message,
    });

    socket.emit("typing", false);

    setMessage("");
  };

  // Typing Event
  const handleTyping = (e) => {
    setMessage(e.target.value);

    socket.emit("typing", true);

    clearTimeout(window.typingTimeout);

    window.typingTimeout = setTimeout(() => {
      socket.emit("typing", false);
    }, 1500);
  };

  return (
    <div className="page">
      <div className="chat-container">

        {/* Header */}
        <div className="header">
          <div className="header-left">
            <div className="online-dot"></div>

            <div>
              <div className="title">MiniChat</div>

              <div className="online-text">
                {onlineUsers} online
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="messages">
          {messages.map((msg, index) => {
            if (msg.type === "system") {
              return (
                <div
                  key={index}
                  className="system-message"
                >
                  — {msg.text} —
                </div>
              );
            }

            return (
              <div
                key={index}
                className={`message-wrapper ${
                  msg.isMine ? "mine" : "other"
                }`}
              >
                <div
                  className={`message-bubble ${
                    msg.isMine ? "mine-bubble" : "other-bubble"
                  }`}
                >
                  {msg.text}
                </div>

                <div className="meta">
                  {msg.id} · {msg.timestamp}
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef}></div>
        </div>

        {/* Typing */}
        <div className="typing">
          {typingText}
        </div>

        {/* Input */}
        <div className="input-area">
          <input
            type="text"
            placeholder="Type a message"
            value={message}
            onChange={handleTyping}
            className="input"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />

          <button
            onClick={sendMessage}
            className="button"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;