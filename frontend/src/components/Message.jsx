import { useState } from "react";

function CitationOverlay({ citation, onClose }) {
  return (
    <div className="overlay-backdrop" onClick={onClose}>
      <div className="overlay-panel" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="overlay-header">
          <div className="overlay-num">[{citation.source_number}]</div>
          <div className="overlay-title-group">
            <div className="overlay-collection">{citation.collection}</div>
            {citation.topic && (
              <div className="overlay-topic">{citation.topic}</div>
            )}
          </div>
          <button className="overlay-close" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Meta row */}
        <div className="overlay-meta">
          {citation.source && (
            <span className="overlay-meta-chip">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              {citation.source}
            </span>
          )}
          <span className="overlay-meta-chip overlay-meta-chip--score">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
            {(Number(citation.retrieval_score) * 100).toFixed(2)}% relevance
          </span>
        </div>

        {/* Score bar */}
        <div className="overlay-score-track">
          <div
            className="overlay-score-fill"
            style={{ width: `${(Number(citation.retrieval_score) * 100).toFixed(1)}%` }}
          />
        </div>

        {/* Chunk text */}
        <div className="overlay-body">
          <div className="overlay-section-label">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            Retrieved Chunk
          </div>
          <div className="overlay-chunk-text">
            {citation.preview}
            {citation.preview?.length >= 300 && (
              <span className="overlay-truncated">
                {" "}…{" "}
                <span className="overlay-truncated-label">[truncated — backend preview limit]</span>
              </span>
            )}
          </div>
        </div>

        <button className="overlay-close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default function Message({ message }) {
  const isUser = message.role === "user";
  const [activeCitation, setActiveCitation] = useState(null);

  const renderText = (text) => {
    if (!text) return null;
    const lines = text.split("\n");
    return lines.map((line, li) => {
      const parts = line.split(/(\*\*.*?\*\*|`[^`]+`)/g);
      return (
        <span key={li}>
          {parts.map((part, i) => {
            if (part.startsWith("**") && part.endsWith("**"))
              return <strong key={i} className="msg-bold">{part.slice(2, -2)}</strong>;
            if (part.startsWith("`") && part.endsWith("`"))
              return <code key={i} className="msg-code">{part.slice(1, -1)}</code>;
            return part;
          })}
          {li < lines.length - 1 && <br />}
        </span>
      );
    });
  };

  if (isUser) {
    return (
      <div className="msg msg--user">
        <div className="msg-user-bubble">
          {message.image && <img src={message.image} alt="Attachment" className="msg-image" />}
          <p>{message.text}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="msg msg--assistant">
        <div className="msg-avatar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>

        <div className="msg-assistant-body">
          {(message.rewritten_query || message.vision) && (
            <div className="msg-meta">
              {message.rewritten_query && (
                <span className="meta-chip meta-chip--query">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  {message.rewritten_query}
                </span>
              )}
              {message.vision && (
                <span className="meta-chip meta-chip--vision">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                  {message.vision}
                </span>
              )}
            </div>
          )}

          <div className="msg-text">{renderText(message.text)}</div>

          {message.citations?.length > 0 && (
            <div className="citations">
              <div className="citations-label">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                Sources — click to inspect
              </div>
              <div className="citations-grid">
                {message.citations.map((c, i) => (
                  <button
                    key={i}
                    className="citation-card citation-card--clickable"
                    onClick={() => setActiveCitation(c)}
                  >
                    <div className="citation-num">[{c.source_number}]</div>
                    <div className="citation-info">
                      <div className="citation-collection">{c.collection}</div>
                      {c.topic && <div className="citation-topic">{c.topic}</div>}
                      <div className="citation-score">
                        <div className="score-bar">
                          <div className="score-fill" style={{ width: `${(Number(c.retrieval_score) * 100).toFixed(0)}%` }} />
                        </div>
                        <span>{(Number(c.retrieval_score) * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className="citation-expand-hint">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="15 3 21 3 21 9"/>
                        <polyline points="9 21 3 21 3 15"/>
                        <line x1="21" y1="3" x2="14" y2="10"/>
                        <line x1="3" y1="21" x2="10" y2="14"/>
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {activeCitation && (
        <CitationOverlay
          citation={activeCitation}
          onClose={() => setActiveCitation(null)}
        />
      )}
    </>
  );
}
