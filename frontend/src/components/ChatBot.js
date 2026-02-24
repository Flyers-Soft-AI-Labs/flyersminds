import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../App';
import axios from 'axios';
import { X, Send, MessageCircle, Bot, Trash2, ChevronDown, Maximize2, Minimize2 } from 'lucide-react';

const WELCOME_MESSAGE = {
  role: 'assistant',
  content: "Hi! I'm **FlyersBot** 👋\n\nI'm here to help you with any doubts about your AI/ML internship — Python, FastAPI, Machine Learning, Deep Learning, RAG, or anything in the curriculum.\n\nWhat would you like to know?",
  id: 'welcome',
};

const MIN_W = 300;
const MIN_H = 380;
const MAX_W = 720;
const MAX_H = 860;
const DEFAULT_W = 380;
const DEFAULT_H = 520;

function getDefaultPos(w, h) {
  return {
    x: Math.max(8, window.innerWidth - w - 24),
    y: Math.max(8, window.innerHeight - h - 96),
  };
}

// ── Markdown renderer ────────────────────────────────────────────────────────
function renderContent(text) {
  const lines = text.split('\n');
  const elements = [];
  let inCode = false;
  let codeLines = [];
  let key = 0;

  const flushCode = () => {
    if (!codeLines.length) return;
    elements.push(
      <pre key={`c${key++}`} className="my-2 overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs text-green-300 font-mono">
        <code>{codeLines.join('\n')}</code>
      </pre>
    );
    codeLines = [];
  };

  lines.forEach((line, i) => {
    if (line.startsWith('```')) { inCode ? (inCode = false, flushCode()) : (inCode = true); return; }
    if (inCode) { codeLines.push(line); return; }

    const parseLine = (raw) =>
      raw.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((p, j) => {
        if (p.startsWith('**') && p.endsWith('**')) return <strong key={j}>{p.slice(2, -2)}</strong>;
        if (p.startsWith('`') && p.endsWith('`')) return <code key={j} className="rounded bg-slate-200 dark:bg-slate-700 px-1 py-0.5 text-[11px] font-mono text-pink-600 dark:text-pink-400">{p.slice(1, -1)}</code>;
        return p;
      });

    if (line.startsWith('- ') || line.startsWith('• '))
      elements.push(<li key={`l${i}`} className="ml-4 list-disc text-sm leading-relaxed">{parseLine(line.slice(2))}</li>);
    else if (/^\d+\.\s/.test(line))
      elements.push(<li key={`l${i}`} className="ml-4 list-decimal text-sm leading-relaxed">{parseLine(line.replace(/^\d+\.\s/, ''))}</li>);
    else if (line.trim() === '')
      elements.push(<div key={`b${i}`} className="h-1.5" />);
    else
      elements.push(<p key={`p${i}`} className="text-sm leading-relaxed">{parseLine(line)}</p>);
  });

  if (inCode) flushCode();
  return elements;
}

// ── Component ────────────────────────────────────────────────────────────────
export default function ChatBot() {
  const { token, user, API } = useAuth();

  const [isOpen, setIsOpen]       = useState(false);
  const [isMaximised, setIsMaximised] = useState(false);
  const [messages, setMessages]   = useState([WELCOME_MESSAGE]);
  const [input, setInput]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [unread, setUnread]       = useState(0);
  const [size, setSize]           = useState({ w: DEFAULT_W, h: DEFAULT_H });
  const [pos, setPos]             = useState(null); // null = not yet positioned

  // Drag & resize refs
  const dragging    = useRef(false);
  const resizing    = useRef(null); // null | 'se' | 'sw' | 'ne' | 'nw' | 'e' | 'w' | 's' | 'n'
  const dragOrigin  = useRef({});
  const messagesEnd = useRef(null);
  const inputRef    = useRef(null);

  // ── Hooks must all be before early return ──────────────────────────────────

  // Auto-scroll
  useEffect(() => {
    if (isOpen) messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // Focus + unread clear on open; set initial position
  useEffect(() => {
    if (isOpen) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 100);
      if (!pos) setPos(getDefaultPos(size.w, size.h));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Global mouse move / up for drag & resize
  const onMouseMove = useCallback((e) => {
    if (dragging.current) {
      const dx = e.clientX - dragOrigin.current.mx;
      const dy = e.clientY - dragOrigin.current.my;
      setPos((p) => {
        if (!p) return p;
        return {
          x: Math.max(0, Math.min(window.innerWidth  - dragOrigin.current.w, dragOrigin.current.px + dx)),
          y: Math.max(0, Math.min(window.innerHeight - dragOrigin.current.h, dragOrigin.current.py + dy)),
        };
      });
    }

    if (resizing.current) {
      const dx = e.clientX - dragOrigin.current.mx;
      const dy = e.clientY - dragOrigin.current.my;
      const dir = resizing.current;

      setSize((s) => {
        let w = s.w, h = s.h;
        if (dir.includes('e')) w = Math.max(MIN_W, Math.min(MAX_W, dragOrigin.current.w + dx));
        if (dir.includes('w')) w = Math.max(MIN_W, Math.min(MAX_W, dragOrigin.current.w - dx));
        if (dir.includes('s')) h = Math.max(MIN_H, Math.min(MAX_H, dragOrigin.current.h + dy));
        if (dir.includes('n')) h = Math.max(MIN_H, Math.min(MAX_H, dragOrigin.current.h - dy));
        return { w, h };
      });

      // Adjust position for west/north handles so window doesn't jump
      setPos((p) => {
        if (!p) return p;
        const dir2 = resizing.current;
        let x = p.x, y = p.y;
        if (dir2.includes('w')) x = Math.min(dragOrigin.current.px + dx, dragOrigin.current.px + dragOrigin.current.w - MIN_W);
        if (dir2.includes('n')) y = Math.min(dragOrigin.current.py + dy, dragOrigin.current.py + dragOrigin.current.h - MIN_H);
        return { x: Math.max(0, x), y: Math.max(0, y) };
      });
    }
  }, []);

  const onMouseUp = useCallback(() => {
    dragging.current  = false;
    resizing.current  = null;
    document.body.style.userSelect = '';
    document.body.style.cursor    = '';
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup',   onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup',   onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  // ── Early return after all hooks ───────────────────────────────────────────
  if (!token || !user) return null;

  // ── Handlers ───────────────────────────────────────────────────────────────
  const startDrag = (e) => {
    if (e.target.closest('button') || isMaximised) return;
    dragging.current = true;
    dragOrigin.current = { mx: e.clientX, my: e.clientY, px: pos?.x ?? 0, py: pos?.y ?? 0, w: size.w, h: size.h };
    document.body.style.userSelect = 'none';
    e.preventDefault();
  };

  const startResize = (dir) => (e) => {
    if (isMaximised) return;
    resizing.current = dir;
    dragOrigin.current = { mx: e.clientX, my: e.clientY, px: pos?.x ?? 0, py: pos?.y ?? 0, w: size.w, h: size.h };
    document.body.style.userSelect = 'none';
    document.body.style.cursor = getCursorForDir(dir);
    e.preventDefault();
    e.stopPropagation();
  };

  const getCursorForDir = (dir) => {
    const map = { se: 'se-resize', sw: 'sw-resize', ne: 'ne-resize', nw: 'nw-resize', e: 'e-resize', w: 'w-resize', s: 's-resize', n: 'n-resize' };
    return map[dir] || 'default';
  };

  const toggleMaximise = () => {
    setIsMaximised((m) => !m);
  };

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg = { role: 'user', content: trimmed, id: Date.now().toString() };
    const history = messages.filter((m) => m.id !== 'welcome').map(({ role, content }) => ({ role, content }));

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post(`${API}/chat`, { message: trimmed, history }, { headers: { Authorization: `Bearer ${token}` } });
      const botMsg = { role: 'assistant', content: res.data.reply, id: Date.now().toString() + '_bot' };
      setMessages((prev) => [...prev, botMsg]);
      if (!isOpen) setUnread((n) => n + 1);
    } catch (err) {
      const detail = err?.response?.data?.detail || '';
      let msg = "I'm having a moment — please try again in a few seconds!";
      if (detail === 'model_not_found') msg = "The AI model isn't available right now. Please try again shortly.";
      else if (detail === 'auth_error')  msg = "There's a configuration issue on our end. Please contact your mentor.";
      else if (detail === 'rate_limit')  msg = "I'm getting too many requests right now. Please wait a moment and try again!";
      setMessages((prev) => [...prev, { role: 'assistant', content: msg, id: Date.now().toString() + '_err' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  // ── Window style ───────────────────────────────────────────────────────────
  const winStyle = isMaximised
    ? { position: 'fixed', left: 8, top: 8, right: 8, bottom: 80, width: undefined, height: undefined }
    : pos
      ? { position: 'fixed', left: pos.x, top: pos.y, width: size.w, height: size.h }
      : { position: 'fixed', bottom: 96, right: 24, width: DEFAULT_W, height: DEFAULT_H };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Chat Window ── */}
      <div
        style={{ ...winStyle, zIndex: 200 }}
        className={`flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/40 dark:border-white/10 dark:bg-slate-900 dark:shadow-black/50 transition-opacity duration-200 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* ── Resize handles (edges & corners) ── */}
        {!isMaximised && (<>
          {/* Corners */}
          {[['nw','top-0 left-0 cursor-nw-resize'],['ne','top-0 right-0 cursor-ne-resize'],
            ['sw','bottom-0 left-0 cursor-sw-resize'],['se','bottom-0 right-0 cursor-se-resize']].map(([d,cls])=>(
            <div key={d} onMouseDown={startResize(d)} className={`absolute z-10 h-4 w-4 ${cls}`} />
          ))}
          {/* Edges */}
          <div onMouseDown={startResize('n')} className="absolute top-0 left-4 right-4 h-1 cursor-n-resize z-10" />
          <div onMouseDown={startResize('s')} className="absolute bottom-0 left-4 right-4 h-1 cursor-s-resize z-10" />
          <div onMouseDown={startResize('w')} className="absolute top-4 bottom-4 left-0 w-1 cursor-w-resize z-10" />
          <div onMouseDown={startResize('e')} className="absolute top-4 bottom-4 right-0 w-1 cursor-e-resize z-10" />
        </>)}

        {/* ── Header (drag handle) ── */}
        <div
          onMouseDown={startDrag}
          className={`flex shrink-0 items-center justify-between gap-3 bg-gradient-to-r from-[#0f766e] to-[#0e8a80] px-4 py-3.5 ${!isMaximised ? 'cursor-grab active:cursor-grabbing' : ''}`}
        >
          <div className="flex items-center gap-3 select-none">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-white">
              <Bot className="h-5 w-5" />
              <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0f766e] bg-green-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-none">FlyersBot</p>
              <p className="text-[10px] text-white/70 leading-none mt-0.5">AI Learning Assistant · drag to move</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button onClick={() => setMessages([WELCOME_MESSAGE])} title="Clear chat"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
            <button onClick={toggleMaximise} title={isMaximised ? 'Restore' : 'Maximise'}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors">
              {isMaximised ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            </button>
            <button onClick={() => setIsOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors">
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ── Messages ── */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
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
              <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 shadow-sm ${
                msg.role === 'user'
                  ? 'rounded-tr-sm bg-[#0f766e] text-white'
                  : 'rounded-tl-sm border border-slate-200 bg-slate-50 text-slate-800 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100'
              }`}>
                {renderContent(msg.content)}
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
                  {[0,1,2].map((i) => (
                    <div key={i} className="h-2 w-2 rounded-full bg-[#0f766e] opacity-60"
                      style={{ animation: `flybot-bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEnd} />
        </div>

        {/* ── Quick questions (first open only) ── */}
        {messages.length === 1 && !loading && (
          <div className="shrink-0 border-t border-slate-100 dark:border-white/5 px-3 py-2">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Quick questions</p>
            <div className="flex flex-wrap gap-1.5">
              {['What is a decorator in Python?','How does JWT auth work?','Explain overfitting in ML','What is RAG?'].map((q) => (
                <button key={q} onClick={() => { setInput(q); inputRef.current?.focus(); }}
                  className="rounded-full border border-[#0f766e]/30 bg-[#e8f6f2] px-2.5 py-1 text-[10px] font-medium text-[#0f766e] hover:bg-[#d0ede5] transition-colors dark:border-[#0f766e]/30 dark:bg-[#0f766e]/10 dark:text-teal-400">
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Input ── */}
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
              onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 80) + 'px'; }}
            />
            <button onClick={sendMessage} disabled={!input.trim() || loading}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#0f766e] text-white hover:bg-[#0e8a80] disabled:cursor-not-allowed disabled:opacity-40 transition-all">
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="mt-1.5 text-center text-[10px] text-slate-400">Enter to send · Shift+Enter for new line</p>
        </div>

        {/* ── Resize grip indicator (bottom-right corner) ── */}
        {!isMaximised && (
          <div onMouseDown={startResize('se')}
            className="absolute bottom-1 right-1 flex items-center justify-center p-1 text-slate-300 dark:text-slate-600 cursor-se-resize z-10"
            title="Drag to resize">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
              <circle cx="8" cy="8" r="1.2"/><circle cx="5" cy="8" r="1.2"/><circle cx="8" cy="5" r="1.2"/>
            </svg>
          </div>
        )}
      </div>

      {/* ── Floating Trigger Button ── */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        style={{ zIndex: 200 }}
        className="fixed bottom-6 right-4 sm:right-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0f766e] to-[#0e8a80] text-white shadow-lg shadow-[#0f766e]/40 hover:scale-105 hover:shadow-xl hover:shadow-[#0f766e]/50 transition-all duration-300"
      >
        {isOpen ? <X className="h-6 w-6" /> : (
          <div className="relative">
            <MessageCircle className="h-6 w-6" />
            {unread > 0 && (
              <div className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                {unread}
              </div>
            )}
          </div>
        )}
        {!isOpen && <span className="absolute inline-flex h-full w-full animate-ping rounded-2xl bg-[#0f766e] opacity-20" />}
      </button>

      <style>{`
        @keyframes flybot-bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </>
  );
}
