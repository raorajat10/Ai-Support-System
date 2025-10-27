import { useState, useEffect, useRef} from "react";
import models from "./models.json";

function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [aiReady, setAiReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("gpt-4o");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const checkReady = setInterval(() => {
      if (window.puter?.ai?.chat) {
        setAiReady(true);
        clearInterval(checkReady);
      }
    }, 300);
    return () => clearInterval(checkReady);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (content, isUser) => {
    setMessages((prev) => [...prev, { content, isUser, id: Date.now() }]);
  };

  const sendMessage = async () => {
    const message = inputValue.trim();
    if (!message || !aiReady) return;

    addMessage(message, true);
    setInputValue("");
    setIsLoading(true);

    try {
      const conversation = [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        ...messages.map((msg) => ({
          role: msg.isUser ? "user" : "assistant",
          content: msg.content,
        })),
        {
          role: "user",
          content: message,
        },
      ];

      const response = await window.puter.ai.chat(
        conversation,
        { model: selectedModel }
        
      );
      const reply =
        typeof response === "string"
          ? response
          : response.message?.content || "No response";
      addMessage(reply, false);
    } catch (error) {
      console.error("Error sending message:", error);
      addMessage("Error: Unable to get response from AI.", false);
    } finally {
      setIsLoading(false);
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
    const model = models.find((m) => m.id === e.target.value);
    addMessage(`Switched to model: ${model.name} (${model.provider})`, false);
  };
  const currentModel = models.find((m) => m.id === selectedModel) || models[0];
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-950/100 via-neutral-950 to-amber-950 flex flex-col items-center justify-center p-4 gap-8">
      <h1 className="text-6xl sm:text-7xl  bg-gradient-to-r from-yellow-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent text-center">
        Multi-Model AI Chat
      </h1>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div
          className={`px-4 py-2 rounded-full ${
            aiReady
              ? "bg-green-500/20 text-green-300 border border-green-500/30"
              : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/20"
          } text-white font-semibold`}
        >
          {aiReady ? "AI is Ready!" : "Loading AI..."}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-300 text-sm">Model:</span>
          <select
            value={selectedModel}
            onChange={handleModelChange}
            disabled={!aiReady}
            className="bg-orange-950/80 border border-orange-500/30 rounded-lg px-3 py-2
           text-white text-sm focus:outline-none
            disabled:opacity:50
          disabled:cursor-not-allowed"
          >
            {models.map((model) => (
              <option
                key={model.id}
                value={model.id}
                className="bg-amber-950 open:border-0"
              >
                {model.name} ({model.provider})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div
        className="w-full max-w-2xl
        bg-gradient-to-br
         from-orange-950/90 to-amber-950
          background-blur-md border border-orange-800/50
           rounded-3xl p-6 "
      >
        <div
          className="flex items-centre justify-centre
            mb-4 p-2 bg-gradient-to-r
             from-orange-600/20 to-red-500/20
              rounded-xl border
               border-orange-500/30"
        >
          <span className="text-orange-300 text-sm font-medium">
            Current Model: <strong>{currentModel.name}</strong> by{" "}
            <em>{currentModel.provider}</em>
          </span>
        </div>

        <div
          className="h-96 overflow-auto border-b border-gray-600 mb-6 p-4 
  bg-gradient-to-b
   from-gray-900/50 to-gray-800/50 
   rounded-2xl"
        >
          {messages.length === 0 && (
            <div className="text-center text-gray-400 nt-20">
              Start the conversation by typing a message below!
              <br />
              <span className="text-xs text-gray-500 mt-2 block">
                try different models to see how they respond!!
              </span>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`m-2 p-3 rounded-2xl max-w-[80%] text-wrap ${
                msg.isUser
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white ml-auto text-right"
                  : "bg-gradient-to-r from-amber-600 to-orange-600 text-white"
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          ))}

          {isLoading && (
            <div
              className="m-2 p-3 rounded-2xl
           max-w-xs bg-gradient-to-r from-amber-600
            to-red-600 text-white"
            >
              <div className="flex items-center gap-2">
                <div
                  className="animate-spin w-4 h-4 border-2
   border-white/30 border-t-white
   rounded-full"
                ></div>
                {currentModel.name} is typing...
              </div>
            </div>
          )}

          <div ref={messagesEndRef}></div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={
              aiReady
                ? `Ask ${currentModel.name} anything...`
                : "AI is loading, please wait..."
            }
            disabled={!aiReady || isLoading}
            className="flex-1 px-4 py-3 bg-yellow-900/30
    border border-amber-800 rounded-2xl
    text-white placeholder-gray-400
    focus:outline-none focus-ring-2 focus-shadow-xl
    focus:shadow-amber-700/80
    focus:ring-orange-500 transition duration-400
    disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={sendMessage}
            disabled={!aiReady || isLoading || !inputValue.trim()}
            className="px-6 py-3 bg-gradient-to-r 
    from-orange-400 to-red-400 hover:opacity-80
    text-white font-semibold rounded-2xl transition disabled:opacity-50 
    disabled:cursor-not-allowed "
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div
                  className="animate-spin w-4 h-4 border-2
   border-white/30 border-t-white
   rounded-full"
                ></div>
              </div>
            ) : (
              "Send"
            )}
          </button>
        </div>

        {/* <div className="flex gap-4">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={!aiReady || isLoading}
            placeholder={
              aiReady
                ? "Type your message here..."
                : "AI is loading, please wait..."
            }
            className="flex-grow resize-none h-16 px-4 py-2 rounded-2xl
             bg-orange-950/80 border border-orange-500/30
              text-white focus:outline-none
               disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={sendMessage}
            disabled={!aiReady || isLoading}
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500
             text-white font-semibold rounded-2xl
              hover:from-orange-600 hover:to-red-600
               disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
          <div ref={messagesEndRef} />

        </div> */}
      </div>
    </div>
  );
}

export default App;
