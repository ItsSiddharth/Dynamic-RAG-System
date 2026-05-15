import { useEffect, useRef, useState } from "react";
import Message from "./Message";

export default function ChatBox({ messages, onSend, loading, selectedCount, onToggleSidebar }) {
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const handleInput = (e) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  };

  const send = async () => {
    if ((!input.trim() && !file) || loading) return;
    const currentInput = input;
    const currentFile = file;
    setInput("");
    setFile(null);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    if (fileInputRef.current) fileInputRef.current.value = "";
    await onSend(currentInput, currentFile);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="chatbox">
      {/* Topbar */}
      <div className="chatbox-topbar">
        <button className="topbar-menu-btn" onClick={onToggleSidebar}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <div className="topbar-info">
          <span className="topbar-title">Threat Intelligence</span>
          {selectedCount > 0 ? (
            <span className="topbar-badge">{selectedCount} source{selectedCount !== 1 ? "s" : ""} active</span>
          ) : (
            <span className="topbar-badge topbar-badge--warn">No sources selected</span>
          )}
        </div>
        <div className="topbar-spacer" />
      </div>

      {/* Messages */}
      <div className="chatbox-messages">
        <div className="messages-inner">
          {messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h2 className="empty-title">Cyber RAG Intelligence</h2>
              <p className="empty-sub">Select your knowledge sources from the sidebar, then ask anything about your cybersecurity corpus.</p>
              <div className="empty-prompts">
                {["Give some techniques to physically securing media with cardholder data?", "Summarize recent CVEs in the dataset", "What is an indicator that an Intrusion Detection System (IDS) might identify as a network attack?"].map((p) => (
                  <button key={p} className="prompt-chip" onClick={() => { setInput(p); textareaRef.current?.focus(); }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((m, i) => <Message key={i} message={m} />)}
              {loading && (
                <div className="typing-indicator">
                  <span /><span /><span />
                </div>
              )}
            </>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="chatbox-input-area">
        <div className={`input-wrapper ${loading ? "input-wrapper--loading" : ""}`}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
            }}
            placeholder="Ask about threats, TTPs, CVEs, IOCs…"
            className="input-textarea"
            rows={1}
          />
          <div className="input-controls">
            <label className="attach-btn" title="Attach image">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden-input"
                onChange={(e) => setFile(e.target.files[0] || null)}
              />
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
              </svg>
            </label>
            <button
              onClick={send}
              disabled={loading || (!input.trim() && !file)}
              className="send-btn"
            >
              {loading ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="spin">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5"/>
                  <polyline points="5 12 12 5 19 12"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {file && (
          <div className="file-pill">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
            <span>{file.name}</span>
            <button onClick={() => setFile(null)}>✕</button>
          </div>
        )}

        <p className="input-hint">Enter to send · Shift+Enter for newline · ⌘K to focus</p>
      </div>
    </div>
  );
}
