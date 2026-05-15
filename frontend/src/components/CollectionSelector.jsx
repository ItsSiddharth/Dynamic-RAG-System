export default function CollectionSelector({ collections, selected, setSelected, open, onToggle }) {
  const toggle = (name) => {
    if (selected.includes(name)) {
      setSelected(selected.filter((c) => c !== name));
    } else {
      setSelected([...selected, name]);
    }
  };

  const selectAll = () => setSelected([...collections]);
  const clearAll = () => setSelected([]);

  return (
    <aside className={`sidebar ${open ? "sidebar--open" : "sidebar--closed"}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="brand-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div className="brand-name">RAG Agent</div>
            <div className="brand-sub">Cyber Intelligence</div>
          </div>
        </div>
        <button className="sidebar-toggle" onClick={onToggle} title="Collapse sidebar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
      </div>

      <div className="sidebar-section-label">
        <span>Sources</span>
        <span className="source-count">{selected.length}/{collections.length}</span>
      </div>

      <div className="sidebar-actions">
        <button className="action-btn" onClick={selectAll}>All</button>
        <button className="action-btn" onClick={clearAll}>None</button>
      </div>

      <div className="collections-list">
        {collections.length === 0 ? (
          <div className="empty-collections">
            <div className="empty-pulse" />
            <span>Loading sources…</span>
          </div>
        ) : (
          collections.map((c) => {
            const active = selected.includes(c);
            return (
              <button
                key={c}
                className={`collection-item ${active ? "collection-item--active" : ""}`}
                onClick={() => toggle(c)}
              >
                <span className={`collection-dot ${active ? "collection-dot--active" : ""}`} />
                <span className="collection-name">{c}</span>
                {active && (
                  <svg className="collection-check" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </button>
            );
          })
        )}
      </div>

      <div className="sidebar-footer">
        <div className="status-indicator">
          <span className="status-dot" />
          <span>Connected</span>
        </div>
      </div>
    </aside>
  );
}
