import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import Editor from '@monaco-editor/react';
import Navbar from '../components/Navbar';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Terminal,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  ArrowLeft,
  BookOpen,
  Code2,
  Loader2,
} from 'lucide-react';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

const QUIZ_QUESTIONS = [
  // ── Section 1: Multiple Choice (15 questions × 1 mark each) ──
  {
    id: 1, type: 'mcq', section: 1, topic: 'Python', marks: 1,
    question: 'What does the int() function do when called on a string like "7"?',
    options: [
      'Raises a TypeError',
      'Converts the string "7" into the integer 7',
      'Returns None',
      "Returns the ASCII value of '7'",
    ],
    correctIndex: 1,
  },
  {
    id: 2, type: 'mcq', section: 1, topic: 'Python', marks: 1,
    question: 'In Python, what is the index of the last character in any string s?',
    options: ['len(s)', 'len(s) - 1', '-0', 's.last()'],
    correctIndex: 1,
  },
  {
    id: 3, type: 'mcq', section: 1, topic: 'Python', marks: 1,
    question: 'Which of the following correctly creates an empty dictionary in Python?',
    options: ['my_dict = []', 'my_dict = ()', 'my_dict = {}', 'my_dict = set()'],
    correctIndex: 2,
  },
  {
    id: 4, type: 'mcq', section: 1, topic: 'FastAPI', marks: 1,
    question: 'Which HTTP method is typically used to READ or retrieve data from an API?',
    options: ['POST', 'PUT', 'GET', 'DELETE'],
    correctIndex: 2,
  },
  {
    id: 5, type: 'mcq', section: 1, topic: 'FastAPI', marks: 1,
    question: 'In FastAPI, which library is used for automatic data validation and serialisation?',
    options: ['Marshmallow', 'Pydantic', 'Cerberus', 'WTForms'],
    correctIndex: 1,
  },
  {
    id: 6, type: 'mcq', section: 1, topic: 'FastAPI', marks: 1,
    question: 'Where can you find the auto-generated interactive documentation when running a FastAPI app locally?',
    options: ['/api-docs', '/swagger', '/docs', '/help'],
    correctIndex: 2,
  },
  {
    id: 7, type: 'mcq', section: 1, topic: 'Machine Learning', marks: 1,
    question: 'What does NumPy stand for?',
    options: ['Numerical Python', 'Number Processing', 'New Math Python', 'Numeric Protocol'],
    correctIndex: 0,
  },
  {
    id: 8, type: 'mcq', section: 1, topic: 'Machine Learning', marks: 1,
    question: 'In Pandas, what data structure is used to hold tabular (rows & columns) data?',
    options: ['Series', 'Array', 'Matrix', 'DataFrame'],
    correctIndex: 3,
  },
  {
    id: 9, type: 'mcq', section: 1, topic: 'Machine Learning', marks: 1,
    question: 'Which Scikit-learn function splits a dataset into training and testing subsets?',
    options: ['model_selection.divide()', 'train_test_split()', 'dataset.split()', 'cross_validate()'],
    correctIndex: 1,
  },
  {
    id: 10, type: 'mcq', section: 1, topic: 'Deep Learning', marks: 1,
    question: 'What critical problem in vanilla RNNs were LSTMs specifically designed to solve?',
    options: [
      'Overfitting on small datasets',
      'The vanishing / exploding gradient problem',
      'Slow inference speed',
      'Inability to process text',
    ],
    correctIndex: 1,
  },
  {
    id: 11, type: 'mcq', section: 1, topic: 'Deep Learning', marks: 1,
    question: 'Which of the following correctly lists the three gates inside an LSTM unit?',
    options: ['Open, Close, Reset', 'Input, Output, Attention', 'Forget, Input, Output', 'Memory, Update, Erase'],
    correctIndex: 2,
  },
  {
    id: 12, type: 'mcq', section: 1, topic: 'Deep Learning', marks: 1,
    question: "What does the 'Forget Gate' in an LSTM decide?",
    options: [
      'What new data to add to the cell state',
      'What portion of the long-term cell state to retain',
      'How to compute the final output',
      'Which neurons to drop during training',
    ],
    correctIndex: 1,
  },
  {
    id: 13, type: 'mcq', section: 1, topic: 'RAG & AI', marks: 1,
    question: 'What does the acronym RAG stand for in the context of AI systems?',
    options: [
      'Recurrent Attention Generation',
      'Retrieval Augmented Generation',
      'Random Autoencoder Grouping',
      'Recursive Answer Generator',
    ],
    correctIndex: 1,
  },
  {
    id: 14, type: 'mcq', section: 1, topic: 'RAG & AI', marks: 1,
    question: "In large language models, what is 'hallucination'?",
    options: [
      'When the model refuses to answer',
      'When the model generates confident but factually incorrect or fabricated responses',
      'When the model runs out of memory',
      'When the model repeats the same sentence multiple times',
    ],
    correctIndex: 1,
  },
  {
    id: 15, type: 'mcq', section: 1, topic: 'RAG & AI', marks: 1,
    question: 'In a RAG pipeline, what is the primary role of the Retriever component?',
    options: [
      'Fine-tune the LLM on new data',
      'Search the knowledge base and pull the most relevant document chunks for a user query',
      'Generate the final answer for the user',
      'Convert text into audio format',
    ],
    correctIndex: 1,
  },

  // ── Section 2: Coding (5 questions × 4 marks each) ──
  {
    id: 16, type: 'coding', section: 2, topic: 'Python', marks: 4,
    title: 'List Statistics Function',
    question:
      "Write a Python function called analyze_numbers(numbers) that accepts a list of integers and returns a dictionary with three keys: 'sum', 'minimum', and 'maximum'.",
    hint: 'Use the built-in sum(), min(), and max() functions.',
    exampleInput: 'analyze_numbers([4, 7, 2, 9, 1])',
    exampleOutput: "{'sum': 23, 'minimum': 1, 'maximum': 9}",
    starterCode: `def analyze_numbers(numbers):
    # TODO: calculate sum, min and max
    pass

# Test your function
print(analyze_numbers([4, 7, 2, 9, 1]))`,
  },
  {
    id: 17, type: 'coding', section: 2, topic: 'FastAPI', marks: 4,
    title: 'User Profile Endpoint',
    question:
      "Create a FastAPI application with a GET endpoint at /user/{user_id} that returns a JSON response containing the user_id, a name field (any placeholder string), and an is_active field set to True.",
    hint: "Import FastAPI, create app = FastAPI(), define a route using @app.get('/user/{user_id}').",
    exampleInput: 'GET /user/42',
    exampleOutput: '{"user_id": 42, "name": "Alex", "is_active": true}',
    starterCode: `from fastapi import FastAPI

app = FastAPI()

# TODO: define your route here
@app.get("/user/{user_id}")
def get_user(user_id: int):
    # Return user_id, name, and is_active
    pass`,
  },
  {
    id: 18, type: 'coding', section: 2, topic: 'Machine Learning', marks: 4,
    title: 'NumPy Array Operations',
    question:
      'Using NumPy, create a 1-D array of numbers from 1 to 10 (inclusive). Then: (a) reshape it into a 2×5 matrix, and (b) compute and print the mean of the original 1-D array.',
    hint: 'Use np.arange(), array.reshape(), and np.mean().',
    exampleInput: '(no user input required — hardcoded values)',
    exampleOutput: '2D Matrix:\n[[ 1  2  3  4  5]\n [ 6  7  8  9 10]]\nMean: 5.5',
    starterCode: `import numpy as np

# Step 1: create array 1..10
arr = np.arange(1, 11)

# Step 2: reshape to 2x5
matrix = arr.reshape(2, 5)

# Step 3: compute mean
mean_val = np.mean(arr)

print("2D Matrix:")
print(matrix)
print("Mean:", mean_val)`,
  },
  {
    id: 19, type: 'coding', section: 2, topic: 'Deep Learning', marks: 4,
    title: 'Build a Simple Neural Network',
    question:
      'Using Keras (TensorFlow), build a simple Sequential model with: (1) an input Dense layer of 64 neurons with ReLU activation, (2) a hidden Dense layer of 32 neurons with ReLU activation, and (3) an output Dense layer of 1 neuron (for binary classification). Print the model summary.',
    hint: 'Use tf.keras.Sequential([...]) and model.summary().',
    exampleInput: '(no user input — model architecture definition)',
    exampleOutput: "Model: 'sequential'\n  dense   → (None, 64)\n  dense_1 → (None, 32)\n  dense_2 → (None, 1)",
    starterCode: `import tensorflow as tf

model = tf.keras.Sequential([
    # TODO: add your layers here
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dense(32, activation='relu'),
    tf.keras.layers.Dense(1)
])

model.summary()`,
  },
  {
    id: 20, type: 'coding', section: 2, topic: 'RAG & AI', marks: 4,
    title: 'Text Chunking Function',
    question:
      'Write a Python function called chunk_text(text, chunk_size) that splits a long string into a list of smaller chunks, each containing at most chunk_size words. This is a core step in building a RAG pipeline.',
    hint: "Split by whitespace using str.split(), then group words into chunks using a loop or list comprehension.",
    exampleInput: 'chunk_text("the quick brown fox jumped over the lazy dog", 3)',
    exampleOutput: "['the quick brown', 'fox jumped over', 'the lazy dog']",
    starterCode: `def chunk_text(text, chunk_size):
    words = text.split()
    # TODO: group words into lists of chunk_size
    chunks = []
    for i in range(0, len(words), chunk_size):
        chunks.append(' '.join(words[i:i + chunk_size]))
    return chunks

# Test your function
print(chunk_text("the quick brown fox jumped over the lazy dog", 3))`,
  },
];

function getGrade(score, max) {
  const pct = (score / max) * 100;
  if (pct >= 80) return { label: 'Excellent!', sub: 'You have a strong grasp of the fundamentals.', color: 'text-green-500', border: 'border-green-500/20', bg: 'bg-green-500/10', emoji: '🏆' };
  if (pct >= 60) return { label: 'Good Job!', sub: 'Solid foundation — a few areas to review.', color: 'text-cyan-500', border: 'border-cyan-500/20', bg: 'bg-cyan-500/10', emoji: '👍' };
  if (pct >= 40) return { label: 'Keep Practicing', sub: 'You are on the right track — keep going!', color: 'text-amber-500', border: 'border-amber-500/20', bg: 'bg-amber-500/10', emoji: '📚' };
  return { label: 'More Study Needed', sub: 'Revisit the course notes and try again.', color: 'text-red-500', border: 'border-red-500/20', bg: 'bg-red-500/10', emoji: '💪' };
}

export default function QuizPage() {
  const { API } = useAuth();
  const navigate = useNavigate();

  const [currentQ, setCurrentQ] = useState(0);
  const [mcqAnswers, setMcqAnswers] = useState({});
  const [codes, setCodes] = useState(
    Object.fromEntries(
      QUIZ_QUESTIONS.filter((q) => q.type === 'coding').map((q) => [q.id, q.starterCode])
    )
  );
  const [outputs, setOutputs] = useState({});
  const [running, setRunning] = useState({});
  const [phase, setPhase] = useState('quiz'); // 'quiz' | 'score' | 'grading'
  const [gradingResults, setGradingResults] = useState({});

  const question = QUIZ_QUESTIONS[currentQ];
  const totalQ = QUIZ_QUESTIONS.length;
  const mcqQuestions = QUIZ_QUESTIONS.filter((q) => q.type === 'mcq');
  const codingQuestions = QUIZ_QUESTIONS.filter((q) => q.type === 'coding');
  const mcqScore = mcqQuestions.filter((q) => gradingResults[q.id] === true).length;
  const codingScore = codingQuestions.filter((q) => gradingResults[q.id] === true).length * 4;
  const totalScore = mcqScore + codingScore;
  const maxScore = 35;

  const handleRun = async (id) => {
    const code = codes[id];
    setRunning((prev) => ({ ...prev, [id]: true }));
    setOutputs((prev) => ({ ...prev, [id]: null }));
    try {
      const res = await fetch(`${API}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: 'python', code }),
      });
      const data = await res.json();
      setOutputs((prev) => ({ ...prev, [id]: data.run }));
    } catch {
      setOutputs((prev) => ({ ...prev, [id]: { stdout: '', stderr: 'Failed to run code. Check your connection.', code: 1 } }));
    } finally {
      setRunning((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleSubmit = async () => {
    setPhase('grading');
    window.scrollTo({ top: 0, behavior: 'instant' });

    const mcq_answers = mcqQuestions.map((q) => ({
      question_id: q.id,
      question: q.question,
      options: q.options,
      selected_index: mcqAnswers[q.id] !== undefined ? mcqAnswers[q.id] : -1,
    }));

    const coding_answers = codingQuestions.map((q) => ({
      question_id: q.id,
      actual_output: outputs[q.id]?.stdout?.trim() || '',
      expected_output: q.exampleOutput,
    }));

    try {
      const res = await fetch(`${API}/quiz/grade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mcq_answers, coding_answers }),
      });
      const data = await res.json();
      const map = {};
      data.results.forEach((r) => { map[r.question_id] = r.correct; });
      setGradingResults(map);
    } catch {
      const fallback = {};
      [...mcqQuestions, ...codingQuestions].forEach((q) => { fallback[q.id] = false; });
      setGradingResults(fallback);
    }

    setPhase('score');
  };

  const handleRetake = () => {
    setCurrentQ(0);
    setMcqAnswers({});
    setCodes(
      Object.fromEntries(
        QUIZ_QUESTIONS.filter((q) => q.type === 'coding').map((q) => [q.id, q.starterCode])
      )
    );
    setOutputs({});
    setRunning({});
    setGradingResults({});
    setPhase('quiz');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const goNext = () => {
    setCurrentQ((c) => c + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goPrev = () => {
    if (currentQ === 0) navigate('/dashboard');
    else { setCurrentQ((c) => c - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  };

  // ── Grading Screen ────────────────────────────────────────────
  if (phase === 'grading') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center px-4">
          <Loader2 className="h-12 w-12 animate-spin text-cyan-500 mx-auto mb-4" />
          <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white mb-2">Grading your answers…</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">AI is checking all 20 questions in parallel. This may take a few seconds.</p>
        </div>
      </div>
    );
  }

  // ── Score Screen ─────────────────────────────────────────────
  if (phase === 'score') {
    const grade = getGrade(totalScore, maxScore);
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <div className="mx-auto max-w-3xl px-4 py-10">

          {/* Score hero */}
          <div className={`mb-8 rounded-2xl border ${grade.border} ${grade.bg} p-8 text-center`}>
            <div className="mb-3 text-5xl">{grade.emoji}</div>
            <h1 className={`font-heading text-4xl font-bold mb-1 ${grade.color}`}>{grade.label}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{grade.sub}</p>
            <div className="inline-flex items-baseline gap-1 mb-4">
              <span className="font-heading text-6xl font-bold text-slate-900 dark:text-white">{totalScore}</span>
              <span className="text-xl text-slate-500">/ {maxScore}</span>
            </div>
            <div className="flex justify-center gap-6 text-sm text-slate-500 dark:text-slate-400">
              <span>MCQ: <strong className="text-slate-900 dark:text-white">{mcqScore}/15</strong></span>
              <span>Coding: <strong className="text-slate-900 dark:text-white">{codingScore}/20</strong></span>
              <span>Percentage: <strong className="text-slate-900 dark:text-white">{Math.round((totalScore / maxScore) * 100)}%</strong></span>
            </div>
          </div>

          {/* MCQ Results */}
          <div className="mb-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-6">
            <h2 className="font-heading text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-cyan-500" />
              Multiple Choice Results
              <span className="ml-auto text-sm font-semibold text-slate-500">{mcqScore} / 15</span>
            </h2>
            <div className="space-y-2">
              {mcqQuestions.map((q, idx) => {
                const userAnswer = mcqAnswers[q.id];
                const answered = userAnswer !== undefined;
                const isCorrect = gradingResults[q.id] === true;
                return (
                  <div
                    key={q.id}
                    className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${
                      !answered
                        ? 'border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5'
                        : isCorrect
                        ? 'border-green-500/20 bg-green-500/10'
                        : 'border-red-500/20 bg-red-500/10'
                    }`}
                  >
                    {!answered ? (
                      <span className="mt-0.5 text-xs text-slate-400 font-bold">—</span>
                    ) : isCorrect ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    ) : (
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        <span className="font-semibold">Q{idx + 1}.</span>{' '}
                        {q.question.length > 90 ? q.question.slice(0, 90) + '…' : q.question}
                      </p>
                      {answered && !isCorrect && (
                        <p className="mt-1 text-xs text-green-700 dark:text-green-400">
                          Correct answer: <strong>{OPTION_LABELS[q.correctIndex]}. {q.options[q.correctIndex]}</strong>
                        </p>
                      )}
                    </div>
                    <span className={`shrink-0 text-xs font-bold ${!answered ? 'text-slate-400' : isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                      {isCorrect ? '+1' : '0/1'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Coding Results */}
          <div className="mb-8 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-6">
            <h2 className="font-heading text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Code2 className="h-5 w-5 text-cyan-500" />
              Coding Results
              <span className="ml-auto text-sm font-semibold text-slate-500">{codingScore} / 20</span>
            </h2>
            <div className="space-y-5">
              {codingQuestions.map((q) => {
                const output = outputs[q.id];
                const correct = gradingResults[q.id];
                return (
                  <div
                    key={q.id}
                    className={`overflow-hidden rounded-xl border ${
                      correct ? 'border-green-500/30' : 'border-red-500/20'
                    }`}
                  >
                    {/* Header */}
                    <div className={`flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3 ${
                      correct ? 'bg-green-50 dark:bg-green-950/20' : 'bg-red-50 dark:bg-red-950/10'
                    }`}>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{q.topic}</span>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{q.title}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {correct ? (
                          <>
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            <span className="text-sm font-bold text-green-600 dark:text-green-400">+4 marks</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-5 w-5 text-red-500" />
                            <span className="text-sm font-bold text-red-500">0 / 4</span>
                          </>
                        )}
                      </div>
                    </div>
                    {/* Output comparison */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-white/10">
                      <div className="p-4">
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">Your Output</p>
                        <pre className="text-xs font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed min-h-[40px]">
                          {output
                            ? output.stdout || output.stderr || 'No output'
                            : <span className="italic text-slate-400">Code not run during quiz</span>}
                        </pre>
                      </div>
                      <div className="p-4 bg-green-50/40 dark:bg-green-950/10">
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-green-600 dark:text-green-400">Expected Output</p>
                        <pre className="text-xs font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{q.exampleOutput}</pre>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleRetake}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white hover:from-cyan-500 hover:to-blue-500 transition-all shadow-md shadow-cyan-500/20"
            >
              <RotateCcw className="h-4 w-4" /> Retake Quiz
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-6 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Quiz Screen ───────────────────────────────────────────────
  const progressPct = ((currentQ + 1) / totalQ) * 100;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-8">

        {/* Progress bar */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <button
              onClick={goPrev}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {currentQ === 0 ? 'Dashboard' : 'Previous'}
            </button>
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              Question {currentQ + 1} of {totalQ}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="mt-1.5 flex justify-between text-xs text-slate-400">
            <span>
              {question.section === 1 ? 'Section 1 — Multiple Choice' : 'Section 2 — Coding'}
            </span>
            <span>{question.marks} mark{question.marks > 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Question card */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5">

          {/* Question header */}
          <div className="border-b border-slate-200 dark:border-white/10 px-6 pt-6 pb-4">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-cyan-100 dark:bg-cyan-500/20 px-3 py-0.5 text-xs font-bold text-cyan-700 dark:text-cyan-400">
                Q{question.id}
              </span>
              <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-0.5 text-xs font-medium text-slate-600 dark:text-slate-400">
                {question.topic}
              </span>
              {question.type === 'coding' && (
                <span className="rounded-full bg-purple-100 dark:bg-purple-500/20 px-3 py-0.5 text-xs font-bold text-purple-700 dark:text-purple-400">
                  Coding
                </span>
              )}
            </div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white leading-relaxed">
              {question.type === 'coding' ? question.title : question.question}
            </h2>
          </div>

          {/* MCQ options */}
          {question.type === 'mcq' && (
            <div className="p-6 space-y-3">
              {question.options.map((option, idx) => {
                const selected = mcqAnswers[question.id] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setMcqAnswers((prev) => ({ ...prev, [question.id]: idx }))}
                    className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                      selected
                        ? 'border-cyan-500/50 bg-cyan-50 dark:bg-cyan-500/10 text-slate-900 dark:text-white'
                        : 'border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10'
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
                        selected
                          ? 'bg-cyan-500 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {OPTION_LABELS[idx]}
                    </span>
                    <span className="leading-snug">{option}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Coding question */}
          {question.type === 'coding' && (
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{question.question}</p>

              {/* Hint */}
              <div className="flex items-start gap-2 rounded-xl border border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/10 px-4 py-3">
                <span className="text-sm">💡</span>
                <p className="text-sm text-amber-700 dark:text-amber-400">{question.hint}</p>
              </div>

              {/* Input / expected output */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/50 p-3">
                  <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">Example Input</p>
                  <code className="text-xs font-mono text-slate-700 dark:text-slate-300">{question.exampleInput}</code>
                </div>
                <div className="rounded-xl border border-green-200 dark:border-green-500/20 bg-green-50/40 dark:bg-green-950/10 p-3">
                  <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-green-600 dark:text-green-400">Expected Output</p>
                  <code className="text-xs font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{question.exampleOutput}</code>
                </div>
              </div>

              {/* Monaco editor */}
              <div className="overflow-hidden rounded-xl border border-white/10 bg-[#1e1e1e]">
                {/* Toolbar */}
                <div className="flex items-center justify-between border-b border-white/10 bg-[#2d2d2d] px-4 py-2.5">
                  <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <span className="h-2 w-2 rounded-full bg-cyan-400" />
                    Python 3
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCodes((prev) => ({ ...prev, [question.id]: question.starterCode }))}
                      className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                      title="Reset to starter code"
                    >
                      <RotateCcw className="h-3.5 w-3.5" /> Reset
                    </button>
                    <button
                      onClick={() => handleRun(question.id)}
                      disabled={running[question.id]}
                      className="flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                    >
                      {running[question.id] ? (
                        <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      ) : (
                        <Play className="h-3 w-3 fill-white" />
                      )}
                      {running[question.id] ? 'Running…' : 'Run Code'}
                    </button>
                  </div>
                </div>

                {/* Editor */}
                <Editor
                  height="280px"
                  language="python"
                  value={codes[question.id]}
                  onChange={(val) => setCodes((prev) => ({ ...prev, [question.id]: val || '' }))}
                  theme="vs-dark"
                  options={{
                    fontSize: 13,
                    fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    lineNumbers: 'on',
                    tabSize: 4,
                    automaticLayout: true,
                    padding: { top: 12, bottom: 12 },
                    renderLineHighlight: 'line',
                    cursorBlinking: 'smooth',
                    contextmenu: false,
                    overviewRulerLanes: 0,
                  }}
                />

                {/* Output panel */}
                {outputs[question.id] != null && (
                  <div className="border-t border-white/10">
                    <div className="flex items-center gap-2 border-b border-white/10 bg-[#2d2d2d] px-4 py-2">
                      <Terminal className="h-3.5 w-3.5 text-slate-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Output</span>
                      <span
                        className={`ml-auto rounded-full px-2 py-0.5 text-xs font-semibold ${
                          outputs[question.id].code === 0
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {outputs[question.id].code === 0 ? '✓ Success' : '✗ Error'}
                      </span>
                    </div>
                    <pre className="max-h-[160px] overflow-y-auto p-4 text-xs font-mono leading-relaxed">
                      {outputs[question.id].stdout && (
                        <span className="text-slate-200 whitespace-pre-wrap">{outputs[question.id].stdout}</span>
                      )}
                      {outputs[question.id].stderr && (
                        <span className="text-red-400 whitespace-pre-wrap">{outputs[question.id].stderr}</span>
                      )}
                      {!outputs[question.id].stdout && !outputs[question.id].stderr && (
                        <span className="italic text-slate-500">No output</span>
                      )}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={goPrev}
            className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 transition-all"
          >
            <ChevronLeft className="h-4 w-4" />
            {currentQ === 0 ? 'Dashboard' : 'Previous'}
          </button>

          {currentQ < totalQ - 1 ? (
            <button
              onClick={goNext}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:from-cyan-500 hover:to-blue-500 transition-all shadow-md shadow-cyan-500/20"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:from-purple-500 hover:to-indigo-500 transition-all shadow-md shadow-purple-500/20"
            >
              <Trophy className="h-4 w-4" /> Submit Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
