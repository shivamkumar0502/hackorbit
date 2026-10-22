import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { Send } from "lucide-react";
import MessageRenderer from "./MessageRenderer";

function ChatAi({ problem, editorCode }) {

const [messages, setMessages] = useState([
{
role: "model",
parts: [
{
text: "👋 Hi! I'm your HackOrbit coding assistant. Ask me anything about this problem."
}
]
}
]);

const [loading, setLoading] = useState(false);

const {
register,
handleSubmit,
reset,
formState: { errors }
} = useForm();

const messagesEndRef = useRef(null);

useEffect(() => {
if (messagesEndRef.current) {
messagesEndRef.current.scrollIntoView({
behavior: "smooth",
block: "end"
});
}
}, [messages]);

const sendMessage = async (text, action = "chat") => {


if (!text || loading) return;

const userMessage = {
  role: "user",
  parts: [{ text }]
};

const updatedMessages = [...messages, userMessage];

setMessages(updatedMessages);
reset();
setLoading(true);

try {

  const response = await axiosClient.post("/ai/chat", {
    messages: updatedMessages,
    title: problem?.title,
    description: problem?.description,
    testCases: problem?.visibleTestCases,
    startCode: problem?.startCode,
    userCode: editorCode,
    action: action
  }, { timeout: 40000 });

  const aiMessage = {
    role: "model",
    parts: [
      {
        text: response?.data?.message || "AI did not return a response."
      }
    ]
  };

  setMessages((prev) => [...prev, aiMessage]);

} catch (error) {

  console.error("AI Chat Error:", error);

  const errorMessage = {
    role: "model",
    parts: [
      {
        text: error.response?.data?.message || "AI request failed. Please try again."
      }
    ]
  };

  setMessages((prev) => [...prev, errorMessage]);

} finally {
  setLoading(false);
}


};

const onSubmit = (data) => {
sendMessage(data.message, "chat");
};

return ( <div className="flex flex-col h-screen max-h-[80vh] min-h-[500px]">


  {/* Chat Messages */}

  <div className="flex-1 overflow-y-auto p-4 space-y-4">

    {messages.map((msg, index) => {

      const messageText =
        msg?.parts && msg.parts.length > 0
          ? msg.parts[0].text
          : "";

      return (
        <div
          key={index}
          className={`chat ${
            msg.role === "user" ? "chat-end" : "chat-start"
          }`}
        >
          <div className="chat-bubble bg-base-200 text-base-content whitespace-pre-wrap">

            <MessageRenderer text={messageText} />

          </div>
        </div>
      );
    })}

    <div ref={messagesEndRef} />

  </div>



  {/* Quick Action Buttons */}

  <div className="px-4 pb-2 flex flex-wrap gap-2">

    <button
      type="button"
      className="btn btn-xs btn-outline"
      disabled={loading}
      onClick={() => sendMessage("Give me a hint", "hint")}
    >
      Hint
    </button>

    <button
      type="button"
      className="btn btn-xs btn-outline"
      disabled={loading}
      onClick={() => sendMessage("Explain the optimal solution", "solution")}
    >
      Explain
    </button>

    <button
      type="button"
      className="btn btn-xs btn-outline"
      disabled={loading}
      onClick={() => sendMessage("How can I optimize this solution?", "optimize")}
    >
      Optimize
    </button>

    <button
      type="button"
      className="btn btn-xs btn-outline"
      disabled={loading}
      onClick={() => sendMessage("What edge cases should I consider?", "edgecases")}
    >
      Edge Cases
    </button>

    <button
      type="button"
      className="btn btn-xs btn-outline"
      disabled={loading}
      onClick={() => sendMessage("Fix my code", "debug")}
    >
      Fix Code
    </button>

  </div>



  {/* Input Area */}

  <form
    onSubmit={handleSubmit(onSubmit)}
    className="sticky bottom-0 p-4 bg-base-100 border-t"
  >

    <div className="flex items-center gap-2">

      <input
        type="text"
        placeholder="Ask me about this problem..."
        className="input input-bordered flex-1"
        {...register("message", {
          required: true,
          minLength: 2
        })}
      />

      <button
        type="submit"
        className="btn btn-ghost"
        disabled={errors.message || loading}
      >
        <Send size={20} />
      </button>

    </div>

  </form>

</div>


);
}

export default ChatAi;
