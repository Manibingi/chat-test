import { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const roomId = "general";

  useEffect(() => {
    socket.emit("join-room", roomId);

    socket.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    axios.get(`http://localhost:5000/api/messages/${roomId}`).then((res) => {
      setMessages(res.data);
    });

    return () => socket.off("receive-message");
  }, []);

  const sendMessage = () => {
    const newMsg = { sender: "User", content: message, room: roomId };
    socket.emit("send-message", { roomId, message: newMsg });
    axios.post("http://localhost:5000/api/messages", newMsg);
    setMessages((prev) => [...prev, newMsg]);
    setMessage("");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Chat Room</h1>
      <div className="border h-64 overflow-y-auto mb-4 p-2">
        {messages.map((msg, idx) => (
          <div key={idx}>
            <b>{msg.sender}:</b> {msg.content}
          </div>
        ))}
      </div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border p-2 mr-2"
      />
      <button
        onClick={sendMessage}
        className="bg-blue-500 text-white px-4 py-2"
      >
        Send
      </button>
    </div>
  );
}

export default App;
