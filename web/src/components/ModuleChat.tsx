import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { api } from '@/services/api';
import type { ChatMessage } from '@/types';

interface ModuleChatProps {
    moduleId: string;
    moduleName: string;
}

export function ModuleChat({ moduleId, moduleName }: ModuleChatProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage: ChatMessage = {
            role: 'user',
            content: inputValue.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await api.askModuleQuestion({
                moduleId,
                question: userMessage.content,
                conversationHistory: messages,
            });

            const assistantMessage: ChatMessage = {
                role: 'assistant',
                content: response.data.answer,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            const errorMessage: ChatMessage = {
                role: 'assistant',
                content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex flex-col h-[600px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
            {/* Header */}
            <div className="bg-zinc-100 dark:bg-zinc-800 px-4 py-3 border-b border-zinc-200 dark:border-zinc-700">
                <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                        Ask about {moduleName}
                    </h3>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                    Get AI-powered answers about this module
                </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center text-zinc-500 dark:text-zinc-400">
                        <Bot className="w-12 h-12 mb-3 opacity-50" />
                        <p className="text-lg font-medium">Start a conversation</p>
                        <p className="text-sm mt-1">Ask me anything about this module!</p>
                    </div>
                )}

                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex gap-3 ${
                            message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                        }`}
                    >
                        <div
                            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                message.role === 'user'
                                    ? 'bg-blue-600 dark:bg-blue-500'
                                    : 'bg-zinc-200 dark:bg-zinc-700'
                            }`}
                        >
                            {message.role === 'user' ? (
                                <User className="w-4 h-4 text-white" />
                            ) : (
                                <Bot className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                            )}
                        </div>
                        <div
                            className={`flex-1 max-w-[80%] rounded-lg p-3 ${
                                message.role === 'user'
                                    ? 'bg-blue-600 dark:bg-blue-500 text-white'
                                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                            }`}
                        >
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            <p
                                className={`text-xs mt-1 ${
                                    message.role === 'user'
                                        ? 'text-blue-100'
                                        : 'text-zinc-500 dark:text-zinc-400'
                                }`}
                            >
                                {new Date(message.timestamp).toLocaleTimeString()}
                            </p>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                            <Bot className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                        </div>
                        <div className="flex-1 max-w-[80%] rounded-lg p-3 bg-zinc-100 dark:bg-zinc-800">
                            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="text-sm">Thinking...</span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-zinc-200 dark:border-zinc-700 p-4">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask a question about this module..."
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg
                                 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100
                                 placeholder-zinc-400 dark:placeholder-zinc-500
                                 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isLoading}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600
                                 text-white rounded-lg transition-colors
                                 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
