import { useEffect, useState } from "react";
import { getCollections, chat } from "./api";
import ChatBox from "./components/ChatBox";
import CollectionSelector from "./components/CollectionSelector";

export default function App() {
  const [collections, setCollections] = useState([]);
  const [selected, setSelected] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCollections().then(setCollections).catch(console.error);
  }, []);

  const sendMessage = async (query, file) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("query", query);
    formData.append("rewrite_query", "true");

    selected.forEach((c) => formData.append("selected_collections", c));

    if (file) {
      formData.append("image", file);
    }

    try {
      // Optimistic UI update for user message
      setMessages((prev) => [
        ...prev,
        { 
          role: "user", 
          text: query, 
          image: file ? URL.createObjectURL(file) : null 
        },
      ]);

      const response = await chat(formData);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: response.answer,
          citations: response.retrieval?.citations || [],
          vision: response.vision_result || null,
          rewritten_query: response.input?.rewritten_query || null,
        },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Error: failed to connect to the backend.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-white text-gray-800">
      <CollectionSelector
        collections={collections}
        selected={selected}
        setSelected={setSelected}
      />
      
      {/* This "flex-1 flex flex-col" is what forces the input to the bottom */}
      <main className="flex flex-1 flex-col min-w-0 relative h-full">
        <ChatBox
          messages={messages}
          onSend={sendMessage}
          loading={loading}
        />
      </main>
    </div>
  );
}