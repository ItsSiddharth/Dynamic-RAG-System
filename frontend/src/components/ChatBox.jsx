import { useEffect, useRef, useState } from "react";
import Message from "./Message";

export default function ChatBox({ messages, onSend, loading }) {
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const handleInput = (e) => {
    setInput(e.target.value);
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  const send = async () => {
    if ((!input.trim() && !file) || loading) return;

    const currentInput = input;
    const currentFile = file;

    setInput("");
    setFile(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    await onSend(currentInput, currentFile);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="flex flex-col h-full w-full bg-white text-gray-800">
        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden pt-10">
        <div className="mx-auto max-w-3xl px-4 pb-32">
            {messages.length === 0 ? (
            <div className="flex h-[50vh] flex-col items-center justify-center text-center">
                {/* Icon Container: Now White with a very subtle border */}
                <div className="w-16 h-16 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center justify-center mb-6">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-400" strokeWidth="1.5">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
                </div>
                
                {/* Text: Pure black/gray on White background */}
                <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">
                How can I help you today?
                </h2>
                <p className="text-gray-500 mt-3 max-w-sm leading-relaxed">
                Select your cybersecurity sources from the sidebar to start a grounded search session.
                </p>
            </div>
            ) : (
            messages.map((m, i) => <Message key={i} message={m} />)
            )}
            <div ref={bottomRef} />
        </div>
        </div>

        {/* Fixed Bottom Input Area */}
        <div className="w-full bg-gradient-to-t from-white via-white to-transparent pt-10 pb-6 px-4">
        <div className="mx-auto max-w-3xl">
            <div className="relative flex flex-col w-full rounded-2xl border border-gray-200 bg-white p-2 shadow-sm focus-within:border-gray-400 transition-colors">
            
            <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInput}
                onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                }
                }}
                placeholder="Message RAG Agent..."
                className="w-full bg-transparent p-3 text-gray-800 outline-none resize-none max-h-60 min-h-[44px]"
                rows={1}
            />

            <div className="flex items-center justify-between px-2 pb-1">
                <label className="cursor-pointer p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files[0] || null)}
                />
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
                </label>

                <button
                onClick={send}
                disabled={loading || (!input.trim() && !file)}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white disabled:bg-gray-100 disabled:text-gray-300 transition-all"
                >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="19" x2="12" y2="5" />
                    <polyline points="5 12 12 5 19 12" />
                </svg>
                </button>
            </div>
            </div>
            
            {file && (
            <div className="mt-2 text-[10px] text-gray-500 px-2 flex items-center gap-2 font-medium">
                <span className="bg-gray-100 px-2 py-1 rounded border border-gray-200">📎 {file.name}</span>
                <button onClick={() => setFile(null)} className="text-red-500 hover:underline">Remove</button>
            </div>
            )}
        </div>
        </div>
    </div>
    );
}