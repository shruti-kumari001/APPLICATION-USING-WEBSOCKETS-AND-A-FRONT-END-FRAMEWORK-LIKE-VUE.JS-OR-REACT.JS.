import React, { useEffect, useState, useRef } from "react";

const socket = new WebSocket("ws://localhost:3001");

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messageRef = useRef(null);

  useEffect(() => {
    socket.onmessage = (event) => {
      const message = event.data;
      setMessages((prev) => [...prev, { from: "other", text: message }]);
    };
  }, []);

  const sendMessage = () => {
    if (input.trim() !== "") {
      socket.send(input);
      setMessages((prev) => [...prev, { from: "me", text: input }]);
      setInput("");
    }
  };

  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-4 bg-white rounded shadow">
        <div className="h-96 overflow-y-auto space-y-2 mb-4 border p-2 rounded">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={\`p-2 rounded-md w-fit max-w-[80%] \${msg.from === "me" ? "bg-blue-500 text-white self-end ml-auto" : "bg-gray-300 text-black"}\`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={messageRef}></div>
        </div>
        <div className="flex gap-2">
          <input
            className="flex-1 border p-2 rounded"
            placeholder="Type message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
