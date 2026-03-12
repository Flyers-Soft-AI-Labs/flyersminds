import { useState, useEffect } from 'react';
import CodeEditor from './CodeEditor';
import { Plus } from 'lucide-react';

const listKey = (dayNumber) => `flyersminds_editors_d${dayNumber}`;
const codeKey = (dayNumber, id) => `flyersminds_code_d${dayNumber}_${id}`;

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

export default function MultiCodeEditor({ dayNumber }) {
  const [editorIds, setEditorIds] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(listKey(dayNumber)));
      if (Array.isArray(saved) && saved.length > 0) return saved;
    } catch {}
    return [generateId()];
  });

  // Persist the editor list whenever it changes
  useEffect(() => {
    localStorage.setItem(listKey(dayNumber), JSON.stringify(editorIds));
  }, [dayNumber, editorIds]);

  // When the day changes, reload the editor list for the new day
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(listKey(dayNumber)));
      if (Array.isArray(saved) && saved.length > 0) {
        setEditorIds(saved);
        return;
      }
    } catch {}
    setEditorIds([generateId()]);
  }, [dayNumber]);

  const addEditor = () => {
    setEditorIds((prev) => [...prev, generateId()]);
  };

  const removeEditor = (id) => {
    localStorage.removeItem(codeKey(dayNumber, id));
    setEditorIds((prev) => prev.filter((eid) => eid !== id));
  };

  return (
    <div className="space-y-4">
      {editorIds.map((id, idx) => (
        <CodeEditor
          key={id}
          storageKey={codeKey(dayNumber, id)}
          index={idx + 1}
          onRemove={editorIds.length > 1 ? () => removeEditor(id) : null}
        />
      ))}

      {/* Add another snippet */}
      <button
        onClick={addEditor}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/10 py-3 text-sm font-medium text-slate-500 transition-colors hover:border-cyan-500/40 hover:text-cyan-400 hover:bg-cyan-500/5"
      >
        <Plus className="h-4 w-4" />
        Add Code Snippet
      </button>
    </div>
  );
}
