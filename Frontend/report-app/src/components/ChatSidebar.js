import React, { useState } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

export default function ChatSidebar() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'Hello! I can help summarize your weekly reports.' },
    { id: 2, sender: 'user', text: 'Generate weekly summary.' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage = { id: Date.now(), sender: 'user', text: input };
    setMessages([...messages, newMessage]);
    setInput('');
    // Simulated AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'ai', text: 'Your weekly summary has been generated!' },
      ]);
    }, 1000);
  };

  return (
    <aside className="w-80 bg-white border-l border-slate-200 flex flex-col rounded-tr-lg rounded-br-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <img
            src="/ai-avatar.png"
            alt="AI Avatar"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h2 className="text-lg font-semibold">AI Concierge</h2>
            <p className="text-sm text-slate-500">Your intelligent assistant</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 bg-slate-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[80%] p-3 rounded-md text-sm ${
              msg.sender === 'ai'
                ? 'bg-blue-50 text-slate-800 self-start'
                : 'bg-gray-100 text-slate-800 self-end ml-auto'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border border-slate-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
            aria-label="Send message"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
