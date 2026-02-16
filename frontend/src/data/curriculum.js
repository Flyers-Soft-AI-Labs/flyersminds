import { month1 } from "./month1";
import { month2 } from "./month2";
import { month3 } from "./month3";
import { month4 } from "./month4";
import { month5 } from "./month5";
import { month6 } from "./month6";

export const curriculum = [...month1, ...month2, ...month3, ...month4, ...month5, ...month6];

export const months = [
  { id: 1, title: "Python", subtitle: "Python Fundamentals", weeks: [
    { id: 1, title: "Python Basics", days: [1,2,3,4,5] },
    { id: 2, title: "Functions & Data Structures", days: [6,7,8,9,10] },
    { id: 3, title: "OOP + File Handling", days: [11,12,13,14,15] },
    { id: 4, title: "Python Final Project", days: [16,17,18,19,20] }
  ]},
  { id: 2, title: "FastAPI", subtitle: "Backend Development", weeks: [
    { id: 5, title: "FastAPI Basics", days: [21,22,23,24,25] },
    { id: 6, title: "Validation & Error Handling", days: [26,27,28,29,30] },
    { id: 7, title: "Databases with FastAPI", days: [31,32,33,34,35] },
    { id: 8, title: "Authentication + Final Project", days: [36,37,38,39,40] }
  ]},
  { id: 3, title: "Machine Learning", subtitle: "ML Fundamentals", weeks: [
    { id: 9, title: "Data Science & Python for ML", days: [41,42,43,44,45] },
    { id: 10, title: "ML Basics (Regression & Classification)", days: [46,47,48,49,50] },
    { id: 11, title: "Feature Engineering & Optimization", days: [51,52,53,54,55] },
    { id: 12, title: "Deep Learning Basics", days: [56,57,58,59,60] }
  ]},
  { id: 4, title: "Advanced Deep Learning", subtitle: "LSTMs, Transformers & LLMs", weeks: [
    { id: 13, title: "LSTMs & GRUs", days: [61,62,63,64,65] },
    { id: 14, title: "Transformers & Attention", days: [66,67,68,69,70] },
    { id: 15, title: "LLMs & Prompting", days: [71,72,73,74,75] },
    { id: 16, title: "Model Finetuning", days: [76,77,78,79,80] }
  ]},
  { id: 5, title: "RAG & Production AI", subtitle: "RAG, Agents & Deployment", weeks: [
    { id: 17, title: "RAG Fundamentals & Embeddings", days: [81,82,83,84,85] },
    { id: 18, title: "Advanced RAG & Optimization", days: [86,87,88,89,90] },
    { id: 19, title: "Agentic AI & Tool Use", days: [91,92,93,94,95] },
    { id: 20, title: "Production & Career Prep", days: [96,97,98,99,100] }
  ]},
  { id: 6, title: "Capstone Project", subtitle: "Final Project & Deployment", weeks: [
    { id: 21, title: "Project Ideation & Architecture", days: [101,102,103,104,105] },
    { id: 22, title: "Core Backend Development", days: [106,107,108,109,110] },
    { id: 23, title: "Frontend & Full Stack", days: [111,112,113,114,115] },
    { id: 24, title: "Deployment & Finalization", days: [116,117,118,119,120] }
  ]}
];

export function getDayData(dayNumber) {
  return curriculum.find(d => d.day === dayNumber);
}