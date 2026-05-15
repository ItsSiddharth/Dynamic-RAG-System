export default function CollectionSelector({ collections, selected, setSelected }) {
  const toggle = (name) => {
    if (selected.includes(name)) {
      setSelected(selected.filter((c) => c !== name));
    } else {
      setSelected([...selected, name]);
    }
  };

  return (
    <aside className="flex h-full w-64 flex-col border-r border-gray-200 bg-[#f9f9f9] p-4">
      <div className="mb-6 px-2">
        <h2 className="text-xl font-bold text-gray-800">RAG Agent</h2>
        <p className="text-xs text-gray-500 font-medium">Cybersecurity Assistant</p>
      </div>

      <div className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
        Sources ({selected.length})
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto pr-2">
        {collections.map((c) => {
          const active = selected.includes(c);
          return (
            <label
              key={c}
              className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
                active
                  ? "bg-white text-blue-600 shadow-sm ring-1 ring-gray-200"
                  : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
              }`}
            >
              <input
                type="checkbox"
                checked={active}
                onChange={() => toggle(c)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-0"
              />
              <span className="truncate font-medium">{c}</span>
            </label>
          );
        })}
      </div>
    </aside>
  );
}