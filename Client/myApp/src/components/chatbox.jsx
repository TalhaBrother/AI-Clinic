import { useState } from 'react';

function ChatBox() {
    const [input, setInput] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

    const askAI = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:3000/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: input })
            });
            const data = await res.json();
            setResponse(data.message);
        } catch (err) {
            setResponse("Error contacting backend.");
        }
        setLoading(false);
    };

    return (

        <div className="flex flex-col h-3/4 w-full max-w-2xl mx-auto border border-gray-200 rounded-2xl bg-white shadow-xl overflow-hidden mt-10">
            {/* Header */}
            <div className="bg-blue-600 p-4 text-white font-bold text-center shadow-md">
                AI Assistant
            </div>

            {/* Chat History Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {/* AI Message Bubble */}
                {response && (
                    <div className="flex flex-col items-start">
                        <div className="max-w-[80%] p-3 rounded-2xl rounded-tl-none bg-white text-gray-800 shadow-sm border border-gray-200">
                            <p className="text-sm font-semibold text-blue-600 mb-1">AI Says:</p>
                            <p className="leading-relaxed">{response}</p>
                        </div>
                    </div>
                )}

                {/* Placeholder if no messages */}
                {!response && !loading && (
                    <div className="text-center text-gray-400 mt-20 italic">
                        Start a conversation below...
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
                <div className="flex gap-2 items-end bg-gray-100 rounded-xl p-2 focus-within:ring-2 focus-within:ring-blue-400 transition-all">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-2 px-3 text-gray-700 min-h-[44px] max-h-[120px]"
                        rows="1"
                    />
                    <button
                        onClick={askAI}
                        disabled={loading || !input.trim()}
                        className={`px-5 py-2 rounded-lg font-medium transition-colors 
            ${loading || !input.trim()
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'}`}
                    >
                        {loading ? (
                            <span className="flex items-center gap-1">
                                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Thinking...
                            </span>
                        ) : "Send"}
                    </button>
                </div>
            </div>
        </div>
    );
}
export default ChatBox;