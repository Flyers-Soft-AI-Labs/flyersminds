import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../App';
import axios from 'axios';
import { X, Send, MessageCircle, Bot, Trash2, ChevronDown, Sparkles } from 'lucide-react';

const WELCOME_MESSAGE = {
  role: 'assistant',
  content: "Hi! I'm **FlyersBot** 👋\n\nI'm here to help you with any doubts about your AI/ML internship — Python, FastAPI, Machine Learning, Deep Learning, RAG, or anything in the curriculum.\n\nWhat would you like to know?",
  id: 'welcome',
};

// Simple markdown-like renderer for bold, code blocks, and newlines
function renderContent(text) {
  const lines = text.split('\n');
  const elements = [];
  let inCodeBlock = false;
  let codeLines = [];
  let codeLang = '';
  let keyIdx = 0;

  const flushCode = () => {
    if (codeLines.length > 0) {
      elements.push(
        <pre key={`code-${keyIdx++}`} className="my-2 overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs text-green-300 font-mono">
          <code>{codeLines.join('\n')}</code>
        </pre>
      );
      codeLines = [];
      codeLang = '';
    }
  };

  lines.forEach((line, i) => {
    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLang = line.slice(3).trim();
      } else {
        inCodeBlock = false;
        flushCode();
      }
      return;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      return;
    }

    // Parse inline bold (**text**)
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    const rendered = parts.map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={j}>{part.slice(2, -2)}</strong>;
      }
      // Inline code (`text`)
      const codeParts = part.split(/(`[^`]+`)/g);
      return codeParts.map((cp, k) => {
        if (cp.startsWith('`') && cp.endsWith('`')) {
          return <code key={k} className="rounded bg-slate-200 dark:bg-slate-700 px-1 py-0.5 text-[11px] font-mono text-pink-600 dark:text-pink-400">{cp.slice(1, -1)}</code>;
        }
        return cp;
      });
    });

    if (line.startsWith('- ') || line.startsWith('• ')) {
      elements.push(
        <li key={`li-${i}`} className="ml-4 list-disc text-sm leading-relaxed">{rendered.slice(1)}</li>
      );
    } else if (/^\d+\.\s/.test(line)) {
      elements.push(
        <li key={`li-${i}`} className="ml-4 list-decimal text-sm leading-relaxed">{rendered.slice(line.indexOf(' ') + 1)}</li>
      );
    } else if (line.trim() === '') {
      elements.push(<div key={`br-${i}`} className="h-1.5" />);
    } else {
      elements.push(
        <p key={`p-${i}`} className="text-sm leading-relaxed">{rendered}</p>
      );
    }
  });

  if (inCodeBlock) flushCode();
  return elements;
}

export default function ChatBot() {
  const { token, user, API } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Don't render if not logged in
  if (!token || !user) return null;

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg = { role: 'user', content: trimmed, id: Date.now().toString() };
    const history = messages
      .filter((m) => m.id !== 'welcome')
      .map(({ role, content }) => ({ role, content }));

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post(
        `${API}/chat`,
        { message: trimmed, history },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const botMsg = { role: 'assistant', content: res.data.reply, id: Date.now().toString() + '_bot' };
      setMessages((prev) => [...prev, botMsg]);
      if (!isOpen) setUnread((n) => n + 1);
    } catch (err) {
      const errMsg = {
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting right now. Please try again in a moment or reach out to your mentor directly.",
        id: Date.now().toString() + '_err',
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([WELCOME_MESSAGE]);
  };

  return (
    <>
      {/* ── Chat Window ── */}
      <div
        className={`fixed bottom-24 right-4 z-[200] w-[92vw] max-w-sm transition-all duration-300 sm:right-6 ${
          isOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-4 opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/40 dark:border-white/10 dark:bg-slate-900 dark:shadow-black/40" style={{ height: '520px' }}>

          {/* Header */}
          <div className="flex shrink-0 items-center justify-between gap-3 bg-gradient-to-r from-[#0f766e] to-[#0e8a80] px-4 py-3.5">
            <div className="flex items-center gap-3">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-white">
                <Bot className="h-5 w-5" />
                <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0f766e] bg-green-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-none">FlyersBot</p>
                <p className="text-[10px] text-white/70 leading-none mt-0.5">AI Learning Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={clearChat}
                title="Clear chat"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                {msg.role === 'assistant' && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0f766e] to-[#0e8a80] text-white shadow-sm mt-0.5">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                {msg.role === 'user' && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-600 to-slate-700 text-xs font-bold text-white shadow-sm mt-0.5">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                )}

                {/* Bubble */}
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 shadow-sm ${
                    msg.role === 'user'
                      ? 'rounded-tr-sm bg-[#0f766e] text-white'
                      : 'rounded-tl-sm border border-slate-200 bg-slate-50 text-slate-800 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100'
                  }`}
                >
                  <div className={msg.role === 'user' ? 'text-white' : 'text-slate-800 dark:text-slate-100'}>
                    {renderContent(msg.content)}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0f766e] to-[#0e8a80] text-white shadow-sm">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-2xl rounded-tl-sm border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-slate-800">
                  <div className="flex items-center gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="h-2 w-2 rounded-full bg-[#0f766e] opacity-60"
                        style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested questions (show only at start) */}
          {messages.length === 1 && !loading && (
            <div className="shrink-0 border-t border-slate-100 dark:border-white/5 px-3 py-2">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Quick questions</p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'What is a decorator in Python?',
                  'How does JWT auth work?',
                  'Explain overfitting in ML',
                  'What is RAG?',
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => { setInput(q); inputRef.current?.focus(); }}
                    className="rounded-full border border-[#0f766e]/30 bg-[#e8f6f2] px-2.5 py-1 text-[10px] font-medium text-[#0f766e] transition-colors hover:bg-[#d0ede5] dark:border-[#0f766e]/30 dark:bg-[#0f766e]/10 dark:text-teal-400"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="shrink-0 border-t border-slate-200 bg-white px-3 py-3 dark:border-white/10 dark:bg-slate-900">
            <div className="flex items-end gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-[#0f766e] focus-within:ring-1 focus-within:ring-[#0f766e]/30 transition-all dark:border-white/10 dark:bg-slate-800">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about the curriculum..."
                rows={1}
                className="flex-1 resize-none bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none dark:text-slate-100 dark:placeholder-slate-500"
                style={{ maxHeight: '80px' }}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 80) + 'px';
                }}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#0f766e] text-white transition-all hover:bg-[#0e8a80] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="mt-1.5 text-center text-[10px] text-slate-400">Enter to send · Shift+Enter for new line</p>
          </div>
        </div>
      </div>

      {/* ── Floating Trigger Button ── */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="fixed bottom-6 right-4 z-[200] flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0f766e] to-[#0e8a80] text-white shadow-lg shadow-[#0f766e]/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#0f766e]/50 sm:right-6"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <div className="relative">
            <MessageCircle className="h-6 w-6" />
            {unread > 0 && (
              <div className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                {unread}
              </div>
            )}
          </div>
        )}

        {/* Pulse ring (only when closed) */}
        {!isOpen && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-2xl bg-[#0f766e] opacity-20" />
        )}
      </button>

      {/* Bounce keyframe */}
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </>
  );
}
