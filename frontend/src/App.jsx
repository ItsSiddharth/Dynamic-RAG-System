import { useEffect, useState } from "react";
import { getCollections, chat } from "./api";
import ChatBox from "./components/ChatBox";
import CollectionSelector from "./components/CollectionSelector";

export default function App() {
  const [collections, setCollections] = useState([]);
  const [selected, setSelected] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    getCollections().then(setCollections).catch(console.error);
  }, []);

  const sendMessage = async (query, file) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("query", query);
    formData.append("rewrite_query", "true");
    selected.forEach((c) => formData.append("selected_collections", c));
    if (file) formData.append("image", file);

    try {
      setMessages((prev) => [
        ...prev,
        { role: "user", text: query, image: file ? URL.createObjectURL(file) : null },
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
        { role: "assistant", text: "Error: Please select a valid source to retrieve from." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <CollectionSelector
        collections={collections}
        selected={selected}
        setSelected={setSelected}
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((v) => !v)}
      />
      <main className="main-content">
        <ChatBox
          messages={messages}
          onSend={sendMessage}
          loading={loading}
          selectedCount={selected.length}
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
        />
      </main>
    </div>
  );
}
