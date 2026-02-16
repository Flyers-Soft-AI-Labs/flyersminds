// Month 5: RAG & Production AI (Days 81-100)
export const month5 = [
  {
    day: 81,
    month: 5,
    week: 17,
    monthTitle: "RAG & Production AI",
    weekTitle: "RAG Fundamentals & Embeddings",
    topic: "Introduction to RAG (Retrieval Augmented Generation)",
    handsOn: ["Understand RAG concept", "Why RAG vs pure LLM", "RAG architecture components", "Use cases for RAG"],
    example: "Document Q&A system",
    codingTask: "Build a basic RAG system: Load documents, Split into chunks, Store in simple list, Retrieve relevant chunks, Pass to LLM for answer.",
    assignment: "Compare answers from: Pure LLM (no context), RAG with context. Document the difference in accuracy and hallucination reduction.",
    explanation: "RAG combines retrieval and generation to ground LLM responses in actual data, reducing hallucinations and enabling knowledge updates.",
    expectedInputs: "User question and document collection",
    expectedOutputs: "Contextual answer with source citations",
    evaluationChecklist: ["RAG pipeline works end-to-end", "Retrieval returns relevant chunks", "LLM uses context effectively", "Comparison documented"],
    gitTask: "Create repo rag-systems, Commit basic RAG implementation",
    resourceLinks: [
      { title: "RAG Introduction", url: "https://youtu.be/T-D1OfcDW1M?si=wVKpkDVZC8f_1234" }
    ],
    tasks: [
      { id: "d81_resources", label: "Review learning resources" },
      { id: "d81_handson", label: "Complete hands-on: RAG architecture understanding" },
      { id: "d81_coding", label: "Coding task: Build basic RAG system" },
      { id: "d81_assignment", label: "Assignment: Compare pure LLM vs RAG" },
      { id: "d81_git", label: "Git: Create repo, commit basic RAG" }
    ]
  },
  {
    day: 82,
    month: 5,
    week: 17,
    monthTitle: "RAG & Production AI",
    weekTitle: "RAG Fundamentals & Embeddings",
    topic: "Vector Embeddings",
    handsOn: ["Understand semantic embeddings", "Use sentence transformers", "Generate embeddings", "Calculate similarity"],
    example: "Semantic search",
    codingTask: "Create a semantic search system: Load sentence transformer model, Generate embeddings for documents, Generate query embedding, Find most similar documents using cosine similarity.",
    assignment: "Compare semantic search vs keyword search on the same queries. Document which finds better results and why.",
    explanation: "Embeddings convert text to vectors that capture semantic meaning, enabling similarity-based retrieval beyond keyword matching.",
    expectedInputs: "Text documents and search query",
    expectedOutputs: "Most semantically similar documents",
    evaluationChecklist: ["Embeddings generated correctly", "Similarity calculation works", "Semantic search outperforms keyword search", "Results relevant"],
    gitTask: "Commit semantic search implementation",
    resourceLinks: [
      { title: "Vector Embeddings Explained", url: "https://youtu.be/wjZofJX0v4M?si=qYz_K8bRmQ9xABcD" }
    ],
    tasks: [
      { id: "d82_resources", label: "Review learning resources" },
      { id: "d82_handson", label: "Complete hands-on: Generate embeddings" },
      { id: "d82_coding", label: "Coding task: Semantic search system" },
      { id: "d82_assignment", label: "Assignment: Compare semantic vs keyword search" },
      { id: "d82_git", label: "Git: Commit semantic search" }
    ]
  },
  {
    day: 83,
    month: 5,
    week: 17,
    monthTitle: "RAG & Production AI",
    weekTitle: "RAG Fundamentals & Embeddings",
    topic: "Vector Databases (FAISS, ChromaDB)",
    handsOn: ["Install FAISS or ChromaDB", "Create vector database", "Insert embeddings", "Query for similar vectors"],
    example: "Scalable document retrieval",
    codingTask: "Build a vector database system: Choose FAISS or ChromaDB, Index 1000+ document chunks, Implement similarity search, Benchmark query speed.",
    assignment: "Compare FAISS vs ChromaDB on: Indexing speed, Query speed, Memory usage, Ease of use. Create recommendation guide.",
    explanation: "Vector databases efficiently store and search millions of embeddings, essential for production RAG systems.",
    expectedInputs: "Document collection and queries",
    expectedOutputs: "Fast retrieval of similar documents",
    evaluationChecklist: ["Vector DB set up correctly", "Large-scale indexing works", "Query performance acceptable", "Comparison thorough"],
    gitTask: "Commit vector database implementation",
    resourceLinks: [
      { title: "FAISS Tutorial", url: "https://youtu.be/sKyvsdEv6rk?si=vQ8TbhZMxP4rWxYz" },
      { title: "ChromaDB Guide", url: "https://youtu.be/gHFHJkkfsqw?si=L9mNk0xY5tDvPqAb" }
    ],
    tasks: [
      { id: "d83_resources", label: "Review learning resources" },
      { id: "d83_handson", label: "Complete hands-on: Vector DB setup" },
      { id: "d83_coding", label: "Coding task: Index 1000+ documents" },
      { id: "d83_assignment", label: "Assignment: FAISS vs ChromaDB comparison" },
      { id: "d83_git", label: "Git: Commit vector DB system" }
    ]
  },
  {
    day: 84,
    month: 5,
    week: 17,
    monthTitle: "RAG & Production AI",
    weekTitle: "RAG Fundamentals & Embeddings",
    topic: "Document Processing & Chunking",
    handsOn: ["Load various document types (PDF, DOCX, TXT)", "Implement smart chunking strategies", "Handle overlapping chunks", "Preserve metadata"],
    example: "Multi-format document ingestion",
    codingTask: "Build a document processor: Support PDF, DOCX, TXT, Markdown, Implement recursive character splitting, Add overlap between chunks, Preserve source metadata (page, section).",
    assignment: "Test different chunk sizes (200, 500, 1000 tokens) and overlap amounts. Document impact on retrieval quality.",
    explanation: "Proper document chunking is crucial for RAG quality - too small loses context, too large dilutes relevance.",
    expectedInputs: "Various document formats",
    expectedOutputs: "Optimally chunked text with metadata",
    evaluationChecklist: ["All formats processed", "Chunking strategy sound", "Metadata preserved", "Chunk size experiments documented"],
    gitTask: "Commit document processing pipeline",
    resourceLinks: [
      { title: "Document Chunking Strategies", url: "https://youtu.be/8OJC21T2SL4?si=mN9pQbWxRtYzVuAb" }
    ],
    tasks: [
      { id: "d84_resources", label: "Review learning resources" },
      { id: "d84_handson", label: "Complete hands-on: Multi-format document loading" },
      { id: "d84_coding", label: "Coding task: Document processor with chunking" },
      { id: "d84_assignment", label: "Assignment: Test chunk sizes and overlap" },
      { id: "d84_git", label: "Git: Commit document pipeline" }
    ]
  },
  {
    day: 85,
    month: 5,
    week: 17,
    monthTitle: "RAG & Production AI",
    weekTitle: "RAG Fundamentals & Embeddings",
    topic: "Mini Project: Document Q&A System",
    handsOn: ["Combine all RAG components", "Build end-to-end pipeline", "Add web interface", "Handle edge cases"],
    example: "Production RAG application",
    codingTask: "Build complete document Q&A system: Document upload functionality, Automatic processing and indexing, Natural language queries, Source citations in answers, FastAPI backend, Simple web UI.",
    assignment: "Test with various document types and questions. Create evaluation report measuring: Answer accuracy, Response time, Source relevance, Hallucination rate.",
    explanation: "First complete RAG application demonstrating ability to build production-ready knowledge retrieval systems.",
    expectedInputs: "Documents and user questions",
    expectedOutputs: "Accurate answers with sources",
    evaluationChecklist: ["Full pipeline functional", "Upload and processing work", "Answers accurate with citations", "UI user-friendly", "Performance acceptable"],
    gitTask: "Create repo document-qa-system, Commit complete project",
    resourceLinks: [],
    tasks: [
      { id: "d85_handson", label: "Complete hands-on: End-to-end RAG pipeline" },
      { id: "d85_coding", label: "Coding task: Document Q&A with UI" },
      { id: "d85_assignment", label: "Assignment: Evaluation report" },
      { id: "d85_git", label: "Git: Create repo, commit project" }
    ]
  },
  {
    day: 86,
    month: 5,
    week: 18,
    monthTitle: "RAG & Production AI",
    weekTitle: "Advanced RAG & Optimization",
    topic: "Query Optimization & Expansion",
    handsOn: ["Query rewriting with LLM", "Query expansion techniques", "Multi-query retrieval", "HyDE (Hypothetical Document Embeddings)"],
    example: "Smart query enhancement",
    codingTask: "Build query optimizer: Rewrite ambiguous queries, Generate multiple query variations, Use HyDE to create hypothetical answers, Retrieve using all variations and merge results.",
    assignment: "Compare retrieval quality: Original query, Rewritten query, Multi-query, HyDE. Measure precision and recall for each.",
    explanation: "Poor queries return poor results. Query optimization dramatically improves RAG retrieval quality.",
    expectedInputs: "Raw user queries",
    expectedOutputs: "Optimized queries and better retrieval",
    evaluationChecklist: ["Query rewriting improves clarity", "Multi-query finds more relevant docs", "HyDE enhances retrieval", "Comparison thorough"],
    gitTask: "Commit query optimization module",
    resourceLinks: [
      { title: "Advanced RAG Techniques", url: "https://youtu.be/u5Vcrwpzoz8?si=xJyK9TbNmQ8rVuPq" }
    ],
    tasks: [
      { id: "d86_resources", label: "Review learning resources" },
      { id: "d86_handson", label: "Complete hands-on: Query enhancement techniques" },
      { id: "d86_coding", label: "Coding task: Query optimizer with HyDE" },
      { id: "d86_assignment", label: "Assignment: Compare optimization methods" },
      { id: "d86_git", label: "Git: Commit query optimizer" }
    ]
  },
  {
    day: 87,
    month: 5,
    week: 18,
    monthTitle: "RAG & Production AI",
    weekTitle: "Advanced RAG & Optimization",
    topic: "Reranking & Relevance Scoring",
    handsOn: ["Implement reranker model", "Cross-encoder vs bi-encoder", "Relevance scoring", "Two-stage retrieval"],
    example: "Precision-focused retrieval",
    codingTask: "Build two-stage retrieval system: Stage 1: Fast retrieval with bi-encoder (get top 100), Stage 2: Rerank with cross-encoder (get top 5), Compare with single-stage retrieval.",
    assignment: "Benchmark: Retrieval time, Precision@5, NDCG score. Document when reranking is worth the computational cost.",
    explanation: "Reranking improves precision by deeply analyzing query-document relevance, crucial for high-quality RAG.",
    expectedInputs: "Query and candidate documents",
    expectedOutputs: "Reranked, highly relevant documents",
    evaluationChecklist: ["Two-stage pipeline works", "Reranking improves precision", "Performance benchmarked", "Cost-benefit analyzed"],
    gitTask: "Commit reranking implementation",
    resourceLinks: [
      { title: "Reranking in RAG", url: "https://youtu.be/5vQY23eh5TQ?si=pQzMxRtY8bVnWuAb" }
    ],
    tasks: [
      { id: "d87_resources", label: "Review learning resources" },
      { id: "d87_handson", label: "Complete hands-on: Reranker setup" },
      { id: "d87_coding", label: "Coding task: Two-stage retrieval system" },
      { id: "d87_assignment", label: "Assignment: Benchmark reranking benefits" },
      { id: "d87_git", label: "Git: Commit reranking system" }
    ]
  },
  {
    day: 88,
    month: 5,
    week: 18,
    monthTitle: "RAG & Production AI",
    weekTitle: "Advanced RAG & Optimization",
    topic: "Caching & Performance Optimization",
    handsOn: ["Implement semantic caching", "Response caching", "Embedding caching", "Query result caching"],
    example: "High-performance RAG",
    codingTask: "Add caching layer to RAG system: Cache embeddings for documents, Cache similar query results, Implement TTL (time-to-live), Measure cache hit rates and latency reduction.",
    assignment: "Load test the system: With caching, Without caching. Document: Response times, Cache hit rate, Memory usage, Cost savings.",
    explanation: "Caching dramatically reduces latency and API costs in production RAG systems by avoiding redundant computations.",
    expectedInputs: "Repeated and similar queries",
    expectedOutputs: "Fast cached responses",
    evaluationChecklist: ["Caching implemented correctly", "Cache hits work", "Latency significantly reduced", "Load testing thorough"],
    gitTask: "Commit caching implementation",
    resourceLinks: [
      { title: "RAG Performance Optimization", url: "https://youtu.be/bRBPTqS2v6c?si=mQ9KbXrYtZvPwuAb" }
    ],
    tasks: [
      { id: "d88_resources", label: "Review learning resources" },
      { id: "d88_handson", label: "Complete hands-on: Caching strategies" },
      { id: "d88_coding", label: "Coding task: Multi-layer caching" },
      { id: "d88_assignment", label: "Assignment: Load testing comparison" },
      { id: "d88_git", label: "Git: Commit caching layer" }
    ]
  },
  {
    day: 89,
    month: 5,
    week: 18,
    monthTitle: "RAG & Production AI",
    weekTitle: "Advanced RAG & Optimization",
    topic: "RAG Evaluation Metrics",
    handsOn: ["Context relevance metrics", "Answer faithfulness", "Answer relevance", "Build evaluation pipeline"],
    example: "RAG quality assessment",
    codingTask: "Build RAG evaluation framework: Measure retrieval precision and recall, Assess answer faithfulness to context, Check answer relevance to query, Detect hallucinations, Generate evaluation reports.",
    assignment: "Evaluate your RAG system on test set. Create dashboard showing: Average scores, Worst performing queries, Common failure patterns, Improvement suggestions.",
    explanation: "Proper evaluation is essential to measure and improve RAG system quality objectively.",
    expectedInputs: "Test queries with ground truth answers",
    expectedOutputs: "Comprehensive evaluation metrics",
    evaluationChecklist: ["All metrics implemented", "Evaluation automated", "Dashboard informative", "Failure analysis thorough"],
    gitTask: "Commit evaluation framework",
    resourceLinks: [
      { title: "RAG Evaluation", url: "https://youtu.be/1p8jl1hLfCk?si=xQzVbWrYmN9pAuKb" }
    ],
    tasks: [
      { id: "d89_resources", label: "Review learning resources" },
      { id: "d89_handson", label: "Complete hands-on: Evaluation metrics" },
      { id: "d89_coding", label: "Coding task: Evaluation framework" },
      { id: "d89_assignment", label: "Assignment: Evaluation dashboard" },
      { id: "d89_git", label: "Git: Commit evaluation framework" }
    ]
  },
  {
    day: 90,
    month: 5,
    week: 18,
    monthTitle: "RAG & Production AI",
    weekTitle: "Advanced RAG & Optimization",
    topic: "Mini Project: Enterprise RAG System",
    handsOn: ["Combine all optimizations", "Production-grade implementation", "Monitoring and logging", "Error handling"],
    example: "Production-ready RAG",
    codingTask: "Build enterprise RAG system: Multi-stage retrieval with reranking, Query optimization, Caching layer, Evaluation pipeline, Monitoring and logging, Error handling and retries, API rate limiting, Documentation.",
    assignment: "Deploy and stress test the system. Create operational runbook documenting: Deployment steps, Monitoring metrics, Common issues and fixes, Performance tuning guide.",
    explanation: "Complete production RAG system demonstrating real-world deployment readiness.",
    expectedInputs: "Enterprise documents and queries",
    expectedOutputs: "High-quality, fast, reliable answers",
    evaluationChecklist: ["All optimizations integrated", "System handles load", "Monitoring in place", "Documentation complete", "Production-grade code"],
    gitTask: "Create repo enterprise-rag, Commit complete system",
    resourceLinks: [],
    tasks: [
      { id: "d90_handson", label: "Complete hands-on: Production RAG pipeline" },
      { id: "d90_coding", label: "Coding task: Enterprise RAG with all features" },
      { id: "d90_assignment", label: "Assignment: Stress test and operational runbook" },
      { id: "d90_git", label: "Git: Create repo, commit system" }
    ]
  },
  {
    day: 91,
    month: 5,
    week: 19,
    monthTitle: "RAG & Production AI",
    weekTitle: "Agentic AI & Tool Use",
    topic: "Introduction to AI Agents",
    handsOn: ["Understand agent architecture", "Perception-Decision-Action loop", "Tool use concept", "Basic agent implementation"],
    example: "Simple task-completing agent",
    codingTask: "Build basic agent that can: Receive a task, Break it into steps, Use tools (calculator, search), Execute steps sequentially, Return final result.",
    assignment: "Compare agent vs direct LLM call on complex multi-step tasks. Document when agents add value.",
    explanation: "AI agents use LLMs to reason about tasks and autonomously execute multi-step workflows using tools.",
    expectedInputs: "Complex task description",
    expectedOutputs: "Task completion through tool use",
    evaluationChecklist: ["Agent completes multi-step tasks", "Tool usage correct", "Reasoning visible", "Comparison documented"],
    gitTask: "Create repo ai-agents, Commit basic agent",
    resourceLinks: [
      { title: "AI Agents Introduction", url: "https://youtu.be/sal78ACtGTc?si=qXzVbRtYmN8pWuKb" }
    ],
    tasks: [
      { id: "d91_resources", label: "Review learning resources" },
      { id: "d91_handson", label: "Complete hands-on: Agent architecture" },
      { id: "d91_coding", label: "Coding task: Basic tool-using agent" },
      { id: "d91_assignment", label: "Assignment: Agent vs LLM comparison" },
      { id: "d91_git", label: "Git: Create repo, commit agent" }
    ]
  },
  {
    day: 92,
    month: 5,
    week: 19,
    monthTitle: "RAG & Production AI",
    weekTitle: "Agentic AI & Tool Use",
    topic: "ReAct Framework (Reasoning + Acting)",
    handsOn: ["Implement ReAct pattern", "Thought-Action-Observation loop", "Tool selection logic", "Error recovery"],
    example: "ReAct agent for research tasks",
    codingTask: "Build ReAct agent: Generate thought about what to do, Select and execute appropriate tool, Observe result, Reason about next step, Repeat until task complete.",
    assignment: "Test agent on: Math word problems, Web research tasks, Multi-step reasoning. Document success rate and failure patterns.",
    explanation: "ReAct enables agents to reason explicitly about actions, improving reliability and debuggability.",
    expectedInputs: "Tasks requiring reasoning and tool use",
    expectedOutputs: "Solutions with visible reasoning trace",
    evaluationChecklist: ["ReAct loop implemented", "Reasoning explicit", "Tool selection appropriate", "Error recovery works"],
    gitTask: "Commit ReAct agent implementation",
    resourceLinks: [
      { title: "ReAct Framework", url: "https://youtu.be/Eug2clsLtFs?si=mQzVbXrYtN9pWuAb" }
    ],
    tasks: [
      { id: "d92_resources", label: "Review learning resources" },
      { id: "d92_handson", label: "Complete hands-on: ReAct pattern" },
      { id: "d92_coding", label: "Coding task: ReAct agent" },
      { id: "d92_assignment", label: "Assignment: Test on various tasks" },
      { id: "d92_git", label: "Git: Commit ReAct agent" }
    ]
  },
  {
    day: 93,
    month: 5,
    week: 19,
    monthTitle: "RAG & Production AI",
    weekTitle: "Agentic AI & Tool Use",
    topic: "LangChain & Agent Frameworks",
    handsOn: ["Install LangChain", "Use pre-built agents", "Create custom tools", "Chain multiple agents"],
    example: "LangChain agent with custom tools",
    codingTask: "Build LangChain agent with custom tools: Create API calling tool, Create database query tool, Create file system tool, Configure agent to use all tools, Test on complex workflows.",
    assignment: "Compare building agent from scratch vs using LangChain. Document pros/cons of frameworks.",
    explanation: "Frameworks like LangChain provide battle-tested components for building production agents faster.",
    expectedInputs: "Complex multi-tool tasks",
    expectedOutputs: "Automated workflow execution",
    evaluationChecklist: ["Custom tools work", "Agent uses tools appropriately", "Framework advantages understood", "Comparison thorough"],
    gitTask: "Commit LangChain agent implementation",
    resourceLinks: [
      { title: "LangChain Agents", url: "https://youtu.be/jSP-gSEyVeI?si=pQzVbXrYmN8KwuAb" }
    ],
    tasks: [
      { id: "d93_resources", label: "Review learning resources" },
      { id: "d93_handson", label: "Complete hands-on: LangChain setup" },
      { id: "d93_coding", label: "Coding task: Agent with custom tools" },
      { id: "d93_assignment", label: "Assignment: Framework comparison" },
      { id: "d93_git", label: "Git: Commit LangChain agent" }
    ]
  },
  {
    day: 94,
    month: 5,
    week: 19,
    monthTitle: "RAG & Production AI",
    weekTitle: "Agentic AI & Tool Use",
    topic: "Multi-Agent Systems & Memory",
    handsOn: ["Multiple specialized agents", "Agent communication", "Shared memory", "Task delegation"],
    example: "Team of collaborative agents",
    codingTask: "Build multi-agent system: Research agent (finds information), Analysis agent (processes data), Writing agent (creates reports), Coordinator agent (orchestrates team), Shared memory for context.",
    assignment: "Test on complex project requiring all agents. Compare with single-agent approach on quality and efficiency.",
    explanation: "Multi-agent systems enable specialization and parallel work, handling more complex tasks than single agents.",
    expectedInputs: "Complex multi-faceted projects",
    expectedOutputs: "Coordinated team output",
    evaluationChecklist: ["Multiple agents work together", "Communication effective", "Memory shared correctly", "Better than single agent"],
    gitTask: "Commit multi-agent system",
    resourceLinks: [
      { title: "Multi-Agent Systems", url: "https://youtu.be/vKGN7n4bCf8?si=mQzVbXrYtN9pWKAb" }
    ],
    tasks: [
      { id: "d94_resources", label: "Review learning resources" },
      { id: "d94_handson", label: "Complete hands-on: Multi-agent architecture" },
      { id: "d94_coding", label: "Coding task: Collaborative agent team" },
      { id: "d94_assignment", label: "Assignment: Compare with single agent" },
      { id: "d94_git", label: "Git: Commit multi-agent system" }
    ]
  },
  {
    day: 95,
    month: 5,
    week: 19,
    monthTitle: "RAG & Production AI",
    weekTitle: "Agentic AI & Tool Use",
    topic: "Mini Project: Research Assistant Agent",
    handsOn: ["Combine RAG with agents", "Multiple tools integration", "Complex workflow automation"],
    example: "Autonomous research agent",
    codingTask: "Build research assistant agent: Takes research question, Searches web and documents, Extracts relevant information, Synthesizes findings, Generates structured report with citations, Saves results.",
    assignment: "Test on various research topics. Create evaluation measuring: Information accuracy, Source quality, Report completeness, Time efficiency.",
    explanation: "Complete agentic system demonstrating autonomous complex task completion.",
    expectedInputs: "Research questions",
    expectedOutputs: "Comprehensive research reports",
    evaluationChecklist: ["Agent completes full research workflow", "Multiple tools used correctly", "Reports high quality", "Fully autonomous operation"],
    gitTask: "Create repo research-agent, Commit complete project",
    resourceLinks: [],
    tasks: [
      { id: "d95_handson", label: "Complete hands-on: Full agent pipeline" },
      { id: "d95_coding", label: "Coding task: Research assistant agent" },
      { id: "d95_assignment", label: "Assignment: Evaluation on test topics" },
      { id: "d95_git", label: "Git: Create repo, commit agent" }
    ]
  },
  {
    day: 96,
    month: 5,
    week: 20,
    monthTitle: "RAG & Production AI",
    weekTitle: "Production & Career Prep",
    topic: "AI Safety & Guardrails",
    handsOn: ["Content filtering", "PII detection and removal", "Prompt injection protection", "Output validation"],
    example: "Safe AI system",
    codingTask: "Add safety layer to AI system: Detect and block malicious prompts, Filter inappropriate content, Remove PII from inputs/outputs, Validate outputs against safety rules, Log all safety events.",
    assignment: "Red-team your system: Try prompt injections, Attempt to extract training data, Test edge cases. Document vulnerabilities and fixes.",
    explanation: "Production AI systems need robust safety measures to prevent misuse and protect user data.",
    expectedInputs: "Potentially unsafe queries",
    expectedOutputs: "Safe, filtered responses",
    evaluationChecklist: ["Safety filters work", "PII protected", "Prompt injection blocked", "Red-teaming thorough"],
    gitTask: "Commit safety guardrails",
    resourceLinks: [
      { title: "AI Safety Best Practices", url: "https://youtu.be/6A6x6pFVx8g?si=pQzVbXrYmN8pWKAb" }
    ],
    tasks: [
      { id: "d96_resources", label: "Review learning resources" },
      { id: "d96_handson", label: "Complete hands-on: Safety implementations" },
      { id: "d96_coding", label: "Coding task: Safety guardrails" },
      { id: "d96_assignment", label: "Assignment: Red-team testing" },
      { id: "d96_git", label: "Git: Commit safety layer" }
    ]
  },
  {
    day: 97,
    month: 5,
    week: 20,
    monthTitle: "RAG & Production AI",
    weekTitle: "Production & Career Prep",
    topic: "Monitoring & Observability",
    handsOn: ["Logging best practices", "Metrics collection", "Alerting setup", "Dashboard creation"],
    example: "Production monitoring system",
    codingTask: "Implement monitoring: Log all requests/responses, Track latency, errors, costs, Monitor model performance drift, Set up alerts for failures, Create real-time dashboard.",
    assignment: "Run production load for 24 hours. Analyze logs to find: Peak usage times, Common error patterns, Performance bottlenecks, Cost drivers.",
    explanation: "Monitoring is essential for maintaining reliable AI systems and debugging production issues.",
    expectedInputs: "Production traffic",
    expectedOutputs: "Comprehensive metrics and alerts",
    evaluationChecklist: ["Logging comprehensive", "Metrics meaningful", "Alerts trigger correctly", "Dashboard useful"],
    gitTask: "Commit monitoring implementation",
    resourceLinks: [
      { title: "ML Monitoring", url: "https://youtu.be/RbK5DjprIRU?si=mQzVbXrYtN8pWKAb" }
    ],
    tasks: [
      { id: "d97_resources", label: "Review learning resources" },
      { id: "d97_handson", label: "Complete hands-on: Monitoring setup" },
      { id: "d97_coding", label: "Coding task: Full monitoring system" },
      { id: "d97_assignment", label: "Assignment: 24-hour analysis" },
      { id: "d97_git", label: "Git: Commit monitoring" }
    ]
  },
  {
    day: 98,
    month: 5,
    week: 20,
    monthTitle: "RAG & Production AI",
    weekTitle: "Production & Career Prep",
    topic: "Deployment & Scaling",
    handsOn: ["Containerization with Docker", "Cloud deployment (AWS/GCP/Azure)", "Load balancing", "Auto-scaling"],
    example: "Scalable AI service",
    codingTask: "Deploy AI system to cloud: Create Dockerfile, Deploy to cloud platform, Set up load balancer, Configure auto-scaling, Implement health checks.",
    assignment: "Load test and document: Requests per second capacity, Auto-scaling behavior, Cost at different scales, Failure recovery time.",
    explanation: "Learn to deploy and scale AI systems to handle production traffic reliably.",
    expectedInputs: "Variable production load",
    expectedOutputs: "Reliable service at scale",
    evaluationChecklist: ["Containerization works", "Cloud deployment successful", "Auto-scaling functions", "Load testing thorough"],
    gitTask: "Commit deployment configuration",
    resourceLinks: [
      { title: "ML Deployment", url: "https://youtu.be/ZVCvMmVjGTc?si=pQzVbXrYtN9pWKAb" }
    ],
    tasks: [
      { id: "d98_resources", label: "Review learning resources" },
      { id: "d98_handson", label: "Complete hands-on: Docker and cloud setup" },
      { id: "d98_coding", label: "Coding task: Cloud deployment" },
      { id: "d98_assignment", label: "Assignment: Load testing and scaling analysis" },
      { id: "d98_git", label: "Git: Commit deployment configs" }
    ]
  },
  {
    day: 99,
    month: 5,
    week: 20,
    monthTitle: "RAG & Production AI",
    weekTitle: "Production & Career Prep",
    topic: "Portfolio & Resume Building",
    handsOn: ["Create GitHub portfolio", "Write technical documentation", "Build project showcase", "Resume optimization"],
    example: "Professional AI engineer portfolio",
    codingTask: "Build professional portfolio: Clean up all Git repos, Write comprehensive READMEs, Create portfolio website, Add project demos/videos, Document tech stack and learnings.",
    assignment: "Create tailored resumes for: AI/ML Engineer, Backend Engineer, Full-stack Engineer. Highlight relevant projects for each.",
    explanation: "Strong portfolio and resume are crucial for landing AI engineering roles.",
    expectedInputs: "All internship projects",
    expectedOutputs: "Professional portfolio and resumes",
    evaluationChecklist: ["All repos documented", "Portfolio website live", "Resumes tailored", "Projects showcased professionally"],
    gitTask: "Create portfolio repo, host website",
    resourceLinks: [
      { title: "ML Portfolio Guide", url: "https://youtu.be/1aXk2RViq3c?si=mQzVbXrYtN9pWKAb" }
    ],
    tasks: [
      { id: "d99_resources", label: "Review learning resources" },
      { id: "d99_handson", label: "Complete hands-on: Portfolio creation" },
      { id: "d99_coding", label: "Coding task: Portfolio website" },
      { id: "d99_assignment", label: "Assignment: Tailored resumes" },
      { id: "d99_git", label: "Git: Portfolio repo and website" }
    ]
  },
  {
    day: 100,
    month: 5,
    week: 20,
    monthTitle: "RAG & Production AI",
    weekTitle: "Production & Career Prep",
    topic: "Interview Preparation & Career Strategy",
    handsOn: ["Technical interview practice", "System design preparation", "Behavioral questions", "Salary negotiation"],
    example: "Complete interview readiness",
    codingTask: "Prepare interview materials: 20 solved coding problems (LeetCode style), 5 system design solutions, ML case studies, Behavioral STAR stories, Mock interview recordings.",
    assignment: "Create comprehensive interview prep document: Common ML interview questions with answers, System design templates, Project deep-dive explanations, Questions to ask interviewers, Negotiation strategy.",
    explanation: "Final preparation for successfully landing and negotiating AI engineering roles.",
    expectedInputs: "Interview scenarios",
    expectedOutputs: "Complete interview readiness",
    evaluationChecklist: ["Coding problems solved", "System designs documented", "STAR stories prepared", "Mock interviews completed"],
    gitTask: "Create interview-prep private repo, Tag v5.0-production-ready",
    resourceLinks: [
      { title: "ML Interview Guide", url: "https://youtu.be/jN5FjZ8JaFU?si=mQzVbXrYtN9pWKAb" }
    ],
    tasks: [
      { id: "d100_handson", label: "Complete hands-on: Mock interviews" },
      { id: "d100_coding", label: "Coding task: Interview prep materials" },
      { id: "d100_assignment", label: "Assignment: Comprehensive interview document" },
      { id: "d100_git", label: "Git: Interview prep repo, tag v5.0-production-ready" }
    ]
  }
];