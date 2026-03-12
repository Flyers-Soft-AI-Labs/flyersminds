import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Terminal, ChevronDown, RotateCcw, X, Save, Check } from 'lucide-react';

const LANGUAGES = [
  {
    id: 'python',
    label: 'Python 3',
    monacoLang: 'python',
    defaultCode: `# Write your Python code here\nprint("Hello, World!")`,
  },
  {
    id: 'javascript',
    label: 'JavaScript',
    monacoLang: 'javascript',
    defaultCode: `// Write your JavaScript code here\nconsole.log("Hello, World!");`,
  },
  {
    id: 'java',
    label: 'Java',
    monacoLang: 'java',
    defaultCode: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
  },
  {
    id: 'c',
    label: 'C',
    monacoLang: 'c',
    defaultCode: `#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}`,
  },
  {
    id: 'cpp',
    label: 'C++',
    monacoLang: 'cpp',
    defaultCode: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}`,
  },
];

// storageKey – if provided, code + language selection is persisted to localStorage
// index     – 1-based snippet number shown in the toolbar
// onRemove  – if provided, an × button is shown to remove this editor
export default function CodeEditor({ storageKey, index, onRemove }) {
  const getInitialState = () => {
    if (storageKey) {
      try {
        const saved = JSON.parse(localStorage.getItem(storageKey));
        if (saved) {
          const lang = LANGUAGES.find((l) => l.id === saved.langId) || LANGUAGES[0];
          return { lang, code: saved.code ?? lang.defaultCode };
        }
      } catch {}
    }
    return { lang: LANGUAGES[0], code: LANGUAGES[0].defaultCode };
  };

  const initial = getInitialState();
  const [selectedLang, setSelectedLang] = useState(initial.lang);
  const [code, setCode] = useState(initial.code);
  const [output, setOutput] = useState(null);
  const [running, setRunning] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const menuRef = useRef(null);
  const saveTimerRef = useRef(null);

  // Persist to localStorage on every code / language change (auto-save)
  useEffect(() => {
    if (!storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify({ langId: selectedLang.id, code }));
  }, [storageKey, selectedLang.id, code]);

  const handleSave = () => {
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify({ langId: selectedLang.id, code }));
    }
    setSavedFlash(true);
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => setSavedFlash(false), 1500);
  };

  // Close language dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowLangMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLangChange = (lang) => {
    setSelectedLang(lang);
    setCode(lang.defaultCode);
    setOutput(null);
    setShowLangMenu(false);
  };

  const handleReset = () => {
    setCode(selectedLang.defaultCode);
    setOutput(null);
  };

  const handleRun = async () => {
    setRunning(true);
    setOutput(null);
    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: selectedLang.id, code }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Server error: ${res.status}`);
      }
      const data = await res.json();
      setOutput(data.run);
    } catch (err) {
      setOutput({
        stdout: '',
        stderr: err.message || 'Failed to connect to the execution server.',
        code: 1,
      });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#1e1e1e]">

      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-[#2d2d2d] px-4 py-2.5">

        <div className="flex items-center gap-3">
          {/* Snippet index label */}
          {index != null && (
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
              Snippet {index}
            </span>
          )}

          {/* Language selector */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-2 rounded-lg bg-[#3c3c3c] px-3 py-1.5 text-sm font-medium text-slate-200 transition-colors hover:bg-[#4c4c4c]"
            >
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              {selectedLang.label}
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {showLangMenu && (
              <div className="absolute left-0 top-full z-30 mt-1 w-44 overflow-hidden rounded-xl border border-white/10 bg-[#2d2d2d] shadow-2xl">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => handleLangChange(lang)}
                    className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors ${
                      lang.id === selectedLang.id
                        ? 'bg-cyan-600 text-white'
                        : 'text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {lang.id === selectedLang.id && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Reset */}
          <button
            onClick={handleReset}
            title="Reset to default code"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          {/* Save */}
          <button
            onClick={handleSave}
            title="Save code"
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
              savedFlash
                ? 'bg-emerald-600/20 text-emerald-400'
                : 'text-slate-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {savedFlash ? (
              <>
                <Check className="h-4 w-4" />
                <span className="text-xs">Saved</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span className="text-xs">Save</span>
              </>
            )}
          </button>

          {/* Run */}
          <button
            onClick={handleRun}
            disabled={running}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {running ? (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <Play className="h-3.5 w-3.5 fill-white" />
            )}
            {running ? 'Running…' : 'Run'}
          </button>

          {/* Remove this snippet */}
          {onRemove && (
            <button
              onClick={onRemove}
              title="Remove this snippet"
              className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-red-500/20 hover:text-red-400"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* ── Monaco Editor ── */}
      <Editor
        height="320px"
        language={selectedLang.monacoLang}
        value={code}
        onChange={(val) => setCode(val || '')}
        theme="vs-dark"
        options={{
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          lineNumbers: 'on',
          tabSize: 4,
          automaticLayout: true,
          padding: { top: 14, bottom: 14 },
          renderLineHighlight: 'line',
          cursorBlinking: 'smooth',
          smoothScrolling: true,
          contextmenu: false,
          overviewRulerLanes: 0,
        }}
      />

      {/* ── Output Panel ── */}
      {output !== null && (
        <div className="border-t border-white/10">
          <div className="flex items-center gap-2 border-b border-white/10 bg-[#2d2d2d] px-4 py-2">
            <Terminal className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Output</span>
            <span
              className={`ml-auto rounded-full px-2 py-0.5 text-xs font-semibold ${
                output.code === 0
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              }`}
            >
              {output.code === 0 ? '✓ Success' : `✗ Exit ${output.code}`}
            </span>
          </div>

          <pre className="max-h-[240px] min-h-[60px] overflow-y-auto p-4 text-sm font-mono leading-relaxed">
            {output.stdout && (
              <span className="text-slate-200 whitespace-pre-wrap">{output.stdout}</span>
            )}
            {output.stderr && (
              <span className="text-red-400 whitespace-pre-wrap">{output.stderr}</span>
            )}
            {!output.stdout && !output.stderr && (
              <span className="italic text-slate-500">No output</span>
            )}
          </pre>
        </div>
      )}
    </div>
  );
}
