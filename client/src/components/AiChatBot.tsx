import { useState, useRef, useEffect } from "react";
import { SendHorizontal, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { sendToAi } from "../services/okr.service.ts";

interface Message {
    text: string;
}

export interface ChatDto {
    role: string;
    parts: Message[];
}

export const AiChatBot = () => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<ChatDto[]>([]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const newMessage: ChatDto = {
            role: "user",
            parts: [{ text: input }],
        };

        setMessages((prev) => [...prev, newMessage]);
        setInput("");
        setLoading(true);

        try {
            const result = await sendToAi([...messages, newMessage]);
            console.log(result);
            const aiResponse: ChatDto = {
                role: "model",
                parts: [{ text: result.message }],
            };

            setMessages((prev) => [...prev, aiResponse]);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    role: "model",
                    parts: [{ text: "Something went wrong. Please try again." }],
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-full w-full bg-gray-50">
            <div className="flex flex-col w-full h-full bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200">
                    <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
                        <Bot size={20} />
                    </div>
                    <div>
                        <h2 className="font-semibold text-gray-800">OKR Assistant</h2>
                        <p className="text-xs text-gray-500">Your Objectives Companion</p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-gray-50">
                    {messages.length === 0 && (
                        <div className="text-center text-gray-400 mt-20">
                            Ask about your Objectives & Key Results
                        </div>
                    )}

                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${
                                msg.role === "user" ? "justify-end" : "justify-start"
                            }`}
                        >
                            <div
                                className={`max-w-[75%] px-5 py-4 rounded-2xl text-sm leading-relaxed shadow-sm
                  ${
                                    msg.role === "user"
                                        ? "bg-blue-600 text-white rounded-br-md"
                                        : "bg-white border border-gray-200 text-gray-800 rounded-bl-md"
                                }
                `}
                            >
                                {msg.parts.map((part, i) => (
                                    <div className="prose prose-sm max-w-none">
                                    <ReactMarkdown
                                        key={i}
                                        components={{
                                            p: ({ children }) => (
                                                <p className="mb-2 last:mb-0">{children}</p>
                                            ),
                                            ul: ({ children }) => (
                                                <ul className="list-disc ml-4 space-y-1">
                                                    {children}
                                                </ul>
                                            ),
                                            ol: ({ children }) => (
                                                <ol className="list-decimal ml-4 space-y-1">
                                                    {children}
                                                </ol>
                                            ),
                                            strong: ({ children }) => (
                                                <strong className="font-semibold">
                                                    {children}
                                                </strong>
                                            ),
                                        }}
                                    >
                                        {part.text}
                                    </ReactMarkdown>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex justify-start">
                            <div className="px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm text-gray-500 animate-pulse">
                                Thinking...
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                <div className="border-t border-gray-200 bg-white px-4 py-4">
                    <div className="flex items-center gap-3">
                        <input
                            type="text"
                            placeholder="Ask about your OKRs..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            className="flex-1 bg-gray-100 focus:bg-white transition-all duration-200 border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl px-4 py-3 text-sm outline-none"
                        />
                        <button
                            onClick={handleSend}
                            disabled={loading}
                            className="p-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all duration-200 text-white shadow-md disabled:opacity-50"
                        >
                            <SendHorizontal size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};