export default function Message({ message }) {
  const isUser = message.role === "user";

  // Safely map basic Markdown bolding (**text**) to HTML elements
  const renderText = (text) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index} className="font-semibold text-gray-900 dark:text-white">{part.slice(2, -2)}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex flex-col max-w-[85%] md:max-w-[75%] ${isUser ? "items-end" : "items-start"}`}>
        
        {isUser ? (
          <div className="flex flex-col items-end gap-2">
            {message.image && (
              <img src={message.image} alt="User Upload" className="mb-1 max-w-[200px] rounded-2xl object-cover md:max-w-[300px]" />
            )}
            <div className="rounded-3xl rounded-tr-sm bg-gray-100 px-5 py-3 text-[15px] leading-relaxed text-gray-900 shadow-sm dark:bg-[#2f2f2f] dark:text-gray-100">
              <div className="whitespace-pre-wrap">{message.text}</div>
            </div>
          </div>
        ) : (
          <div className="w-full text-[15px] leading-relaxed text-gray-800 dark:text-gray-100">
            <div className="whitespace-pre-wrap">{renderText(message.text)}</div>

            <div className="mt-3 flex flex-wrap gap-2">
              {message.rewritten_query && (
                <div className="inline-flex items-center rounded-md border border-gray-200 bg-gray-100 px-2.5 py-1 text-xs text-gray-600 dark:border-white/5 dark:bg-[#2f2f2f] dark:text-gray-400">
                  <span className="mr-1 font-medium">Query:</span> {message.rewritten_query}
                </div>
              )}
              
              {message.vision && (
                <div className="inline-flex items-center rounded-md border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs text-blue-600 dark:border-blue-900/30 dark:bg-blue-900/20 dark:text-blue-400">
                  <span className="mr-1 font-medium">Vision:</span> {message.vision}
                </div>
              )}
            </div>

            {message.citations?.length > 0 && (
              <div className="mt-4 border-t border-gray-200 pt-4 dark:border-white/10">
                <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Sources</div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {message.citations.map((c, i) => (
                    <a key={i} href="#" className="block rounded-xl border border-gray-200 bg-gray-50 p-3 transition-colors hover:bg-gray-100 dark:border-white/10 dark:bg-[#212121] dark:hover:bg-[#2f2f2f]">
                      <div className="truncate text-sm font-medium text-gray-900 dark:text-gray-200">
                        <span className="mr-1 text-blue-600 dark:text-blue-400">[{c.source_number}]</span>
                        {c.collection}
                      </div>
                      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Relevance: {(Number(c.retrieval_score) * 100).toFixed(1)}%
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}