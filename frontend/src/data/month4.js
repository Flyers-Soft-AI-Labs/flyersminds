// Month 4: Advanced Deep Learning (Days 61-80)
export const month4 = [
  {
    day: 61,
    month: 4,
    week: 13,
    monthTitle: "Advanced Deep Learning",
    weekTitle: "LSTMs & GRUs",
    topic: "LSTM Fundamentals",
    handsOn: ["Understand LSTM architecture", "Learn about gates (forget, input, output)", "Build LSTM model in Keras", "Compare with vanilla RNN"],
    example: "Text sequence prediction with LSTM",
    codingTask: "Build an LSTM model for sequence prediction. Compare its performance with a basic RNN on the same dataset.",
    assignment: "Experiment with different LSTM units (32, 64, 128) and document how it affects training time and accuracy.",
    explanation: "LSTMs solve the vanishing gradient problem in RNNs using gates, making them better for long sequences.",
    expectedInputs: "Sequential data (text, time series)",
    expectedOutputs: "Sequence predictions with better long-term memory",
    evaluationChecklist: ["LSTM architecture correct", "Gates understood conceptually", "Performance better than vanilla RNN", "Different configurations tested"],
    gitTask: "Create repo advanced-dl, Commit LSTM implementation",
    resourceLinks: [
      { title: "LSTM Explained", url: "https://youtu.be/YCzL96nL7j0?si=vZ5g4HhR0n7rBmhT" }
    ],
    tasks: [
      { id: "d61_resources", label: "Review learning resources" },
      { id: "d61_handson", label: "Complete hands-on: LSTM architecture & gates" },
      { id: "d61_coding", label: "Coding task: LSTM vs RNN comparison" },
      { id: "d61_assignment", label: "Assignment: Test different LSTM unit sizes" },
      { id: "d61_git", label: "Git: Create repo, commit LSTM model" }
    ]
  },
  {
    day: 62,
    month: 4,
    week: 13,
    monthTitle: "Advanced Deep Learning",
    weekTitle: "LSTMs & GRUs",
    topic: "GRU (Gated Recurrent Unit)",
    handsOn: ["Understand GRU architecture", "Compare GRU vs LSTM", "Build GRU model", "Analyze computational efficiency"],
    example: "Sentiment analysis with GRU",
    codingTask: "Build a GRU model for text classification. Compare training time and accuracy with LSTM.",
    assignment: "Create a comparison table: LSTM vs GRU on parameters, training speed, and accuracy.",
    explanation: "GRUs are simpler than LSTMs with fewer parameters, often train faster while maintaining similar performance.",
    expectedInputs: "Text sequences for classification",
    expectedOutputs: "Classification predictions",
    evaluationChecklist: ["GRU model works correctly", "Comparison with LSTM documented", "Performance metrics recorded", "Understands trade-offs"],
    gitTask: "Commit GRU implementation and comparison",
    resourceLinks: [
      { title: "GRU Explained", url: "https://youtu.be/8HyCNIVRbSU?si=YqQp0B9_oTy4TvVY" }
    ],
    tasks: [
      { id: "d62_resources", label: "Review learning resources" },
      { id: "d62_handson", label: "Complete hands-on: GRU architecture" },
      { id: "d62_coding", label: "Coding task: GRU sentiment analysis" },
      { id: "d62_assignment", label: "Assignment: LSTM vs GRU comparison table" },
      { id: "d62_git", label: "Git: Commit GRU model" }
    ]
  },
  {
    day: 63,
    month: 4,
    week: 13,
    monthTitle: "Advanced Deep Learning",
    weekTitle: "LSTMs & GRUs",
    topic: "Time Series Forecasting",
    handsOn: ["Prepare time series data", "Create sliding windows", "Build LSTM for forecasting", "Evaluate predictions"],
    example: "Stock price prediction",
    codingTask: "Build an LSTM model to forecast future values in a time series (stock prices, temperature, sales).",
    assignment: "Implement multi-step ahead forecasting (predict next 7 days instead of just next day).",
    explanation: "Time series forecasting is critical for business applications like demand prediction, financial forecasting.",
    expectedInputs: "Historical time series data",
    expectedOutputs: "Future value predictions",
    evaluationChecklist: ["Data windowing correct", "Model predicts future values", "Multi-step forecasting works", "Evaluation metrics used (MAE, RMSE)"],
    gitTask: "Commit time series forecasting project",
    resourceLinks: [
      { title: "Time Series with LSTM", url: "https://youtu.be/tepxdcepTbY?si=qCq6HgOPjp0LVKMs" }
    ],
    tasks: [
      { id: "d63_resources", label: "Review learning resources" },
      { id: "d63_handson", label: "Complete hands-on: Time series preparation" },
      { id: "d63_coding", label: "Coding task: LSTM time series forecasting" },
      { id: "d63_assignment", label: "Assignment: Multi-step ahead prediction" },
      { id: "d63_git", label: "Git: Commit forecasting project" }
    ]
  },
  {
    day: 64,
    month: 4,
    week: 13,
    monthTitle: "Advanced Deep Learning",
    weekTitle: "LSTMs & GRUs",
    topic: "Text Generation",
    handsOn: ["Prepare text corpus", "Character-level vs word-level encoding", "Build generative LSTM", "Sample from model"],
    example: "Story generation",
    codingTask: "Build a character-level LSTM that generates text after training on a book or article corpus.",
    assignment: "Experiment with temperature parameter in sampling to control creativity vs coherence.",
    explanation: "Text generation shows how LSTMs can learn language patterns and create new content.",
    expectedInputs: "Text corpus for training",
    expectedOutputs: "Generated text sequences",
    evaluationChecklist: ["Model generates coherent text", "Understands temperature parameter", "Can control output creativity", "No repetition issues"],
    gitTask: "Commit text generation model",
    resourceLinks: [
      { title: "Text Generation with LSTM", url: "https://youtu.be/RHdQHM8ForI?si=aXuFgj7fTD9vzxPj" }
    ],
    tasks: [
      { id: "d64_resources", label: "Review learning resources" },
      { id: "d64_handson", label: "Complete hands-on: Text corpus preparation" },
      { id: "d64_coding", label: "Coding task: Character-level text generation" },
      { id: "d64_assignment", label: "Assignment: Temperature parameter experiments" },
      { id: "d64_git", label: "Git: Commit text generation model" }
    ]
  },
  {
    day: 65,
    month: 4,
    week: 13,
    monthTitle: "Advanced Deep Learning",
    weekTitle: "LSTMs & GRUs",
    topic: "Mini Project: Sentiment Analysis System",
    handsOn: ["Combine text preprocessing, LSTM/GRU, classification"],
    example: "Movie review sentiment classifier",
    codingTask: "Build complete sentiment analysis system: Load movie reviews, Preprocess text, Train LSTM/GRU classifier, Evaluate on test set, Create API endpoint.",
    assignment: "Deploy the sentiment analyzer as a FastAPI service that accepts text and returns sentiment.",
    explanation: "Real-world NLP application combining preprocessing, deep learning, and API deployment.",
    expectedInputs: "Text reviews",
    expectedOutputs: "Sentiment predictions (positive/negative)",
    evaluationChecklist: ["Text preprocessing pipeline works", "Model achieves good accuracy", "API endpoint functional", "Error handling implemented"],
    gitTask: "Create repo sentiment-analyzer, Commit complete project",
    resourceLinks: [],
    tasks: [
      { id: "d65_handson", label: "Complete hands-on: Full sentiment analysis pipeline" },
      { id: "d65_coding", label: "Coding task: Complete sentiment analysis system" },
      { id: "d65_assignment", label: "Assignment: Deploy as FastAPI service" },
      { id: "d65_git", label: "Git: Create repo, commit project" }
    ]
  },
  {
    day: 66,
    month: 4,
    week: 14,
    monthTitle: "Advanced Deep Learning",
    weekTitle: "Transformers & Attention",
    topic: "Attention Mechanism Fundamentals",
    handsOn: ["Understand attention concept", "Query, Key, Value matrices", "Calculate attention scores", "Implement basic attention"],
    example: "Attention visualization",
    codingTask: "Implement basic attention mechanism from scratch using NumPy to understand the math.",
    assignment: "Visualize attention weights to see which input tokens the model focuses on.",
    explanation: "Attention allows models to focus on relevant parts of input, revolutionizing NLP and becoming foundation of transformers.",
    expectedInputs: "Sequence data",
    expectedOutputs: "Attention weights and context vectors",
    evaluationChecklist: ["Attention math understood", "Implementation from scratch works", "Attention weights visualized", "Can explain Q, K, V concept"],
    gitTask: "Commit attention mechanism implementation",
    resourceLinks: [
      { title: "Attention Mechanism", url: "https://youtu.be/fjJOgb-E41w?si=m0f4B9z-zPMzQRBh" }
    ],
    tasks: [
      { id: "d66_resources", label: "Review learning resources" },
      { id: "d66_handson", label: "Complete hands-on: Q, K, V matrices" },
      { id: "d66_coding", label: "Coding task: Attention from scratch" },
      { id: "d66_assignment", label: "Assignment: Visualize attention weights" },
      { id: "d66_git", label: "Git: Commit attention implementation" }
    ]
  },
  {
    day: 67,
    month: 4,
    week: 14,
    monthTitle: "Advanced Deep Learning",
    weekTitle: "Transformers & Attention",
    topic: "Multi-Head Attention",
    handsOn: ["Understand multiple attention heads", "Parallel attention computation", "Concatenation and projection", "Build multi-head attention layer"],
    example: "Multi-head attention block",
    codingTask: "Implement multi-head attention using Keras/PyTorch layers.",
    assignment: "Experiment with different numbers of attention heads (2, 4, 8) and analyze the impact.",
    explanation: "Multiple attention heads allow the model to attend to different aspects of the input simultaneously.",
    expectedInputs: "Embedded sequences",
    expectedOutputs: "Multi-head attention outputs",
    evaluationChecklist: ["Multi-head attention implemented", "Different head counts tested", "Performance compared", "Computational cost understood"],
    gitTask: "Commit multi-head attention implementation",
    resourceLinks: [
      { title: "Multi-Head Attention", url: "https://youtu.be/mMa2PmYJlCo?si=E9p5qBKGXq_EpPTO" }
    ],
    tasks: [
      { id: "d67_resources", label: "Review learning resources" },
      { id: "d67_handson", label: "Complete hands-on: Multi-head architecture" },
      { id: "d67_coding", label: "Coding task: Multi-head attention layer" },
      { id: "d67_assignment", label: "Assignment: Test different head counts" },
      { id: "d67_git", label: "Git: Commit multi-head implementation" }
    ]
  },
  {
    day: 68,
    month: 4,
    week: 14,
    monthTitle: "Advanced Deep Learning",
    weekTitle: "Transformers & Attention",
    topic: "Transformer Encoder",
    handsOn: ["Build transformer encoder block", "Add positional encoding", "Layer normalization", "Feed-forward networks"],
    example: "Text classification with transformer encoder",
    codingTask: "Build a complete transformer encoder for sequence classification.",
    assignment: "Compare transformer encoder performance with LSTM on the same classification task.",
    explanation: "Transformer encoders process entire sequences in parallel, unlike sequential RNNs, enabling faster training.",
    expectedInputs: "Text sequences",
    expectedOutputs: "Classification predictions",
    evaluationChecklist: ["Encoder architecture correct", "Positional encoding added", "Model trains successfully", "Performance comparison documented"],
    gitTask: "Commit transformer encoder implementation",
    resourceLinks: [
      { title: "Transformer Encoder", url: "https://youtu.be/4Bdc55j80l8?si=JkWYmE_4kQSxAE4n" }
    ],
    tasks: [
      { id: "d68_resources", label: "Review learning resources" },
      { id: "d68_handson", label: "Complete hands-on: Encoder block construction" },
      { id: "d68_coding", label: "Coding task: Transformer encoder classifier" },
      { id: "d68_assignment", label: "Assignment: Transformer vs LSTM comparison" },
      { id: "d68_git", label: "Git: Commit encoder implementation" }
    ]
  },
  {
    day: 69,
    month: 4,
    week: 14,
    monthTitle: "Advanced Deep Learning",
    weekTitle: "Transformers & Attention",
    topic: "Transformer Decoder",
    handsOn: ["Build transformer decoder block", "Masked self-attention", "Cross-attention", "Complete encoder-decoder architecture"],
    example: "Sequence-to-sequence translation",
    codingTask: "Build a transformer decoder that works with the encoder for sequence generation tasks.",
    assignment: "Implement a simple machine translation model (English to French) using encoder-decoder transformer.",
    explanation: "Decoder generates output sequences autoregressively, using both self-attention and encoder outputs.",
    expectedInputs: "Source and target sequences",
    expectedOutputs: "Translated sequences",
    evaluationChecklist: ["Decoder architecture correct", "Masked attention implemented", "Cross-attention works", "Translation produces sensible results"],
    gitTask: "Commit transformer decoder and full architecture",
    resourceLinks: [
      { title: "Transformer Decoder", url: "https://youtu.be/bCz4OMemCcA?si=dJkN8sNTlWz_1gPx" }
    ],
    tasks: [
      { id: "d69_resources", label: "Review learning resources" },
      { id: "d69_handson", label: "Complete hands-on: Decoder with masked attention" },
      { id: "d69_coding", label: "Coding task: Encoder-decoder transformer" },
      { id: "d69_assignment", label: "Assignment: Simple machine translation" },
      { id: "d69_git", label: "Git: Commit full transformer" }
    ]
  },
  {
    day: 70,
    month: 4,
    week: 14,
    monthTitle: "Advanced Deep Learning",
    weekTitle: "Transformers & Attention",
    topic: "Mini Project: Transformer-based Text Classifier",
    handsOn: ["Complete transformer implementation", "Train on real dataset", "Fine-tune hyperparameters", "Deploy as API"],
    example: "News article categorization",
    codingTask: "Build a production-ready transformer classifier: Preprocess text data, Train transformer model, Evaluate performance, Create API endpoint, Add batch processing.",
    assignment: "Deploy the classifier and create documentation showing: Model architecture diagram, Training metrics, API usage examples, Performance benchmarks.",
    explanation: "Real-world transformer application demonstrating ability to build, train, and deploy state-of-the-art NLP models.",
    expectedInputs: "Text articles",
    expectedOutputs: "Category predictions",
    evaluationChecklist: ["Transformer trains successfully", "Good classification accuracy", "API functional", "Documentation complete", "Professional code structure"],
    gitTask: "Create repo transformer-classifier, Commit complete project with docs",
    resourceLinks: [],
    tasks: [
      { id: "d70_handson", label: "Complete hands-on: Production transformer pipeline" },
      { id: "d70_coding", label: "Coding task: Complete transformer classifier + API" },
      { id: "d70_assignment", label: "Assignment: Deploy with full documentation" },
      { id: "d70_git", label: "Git: Create repo, commit project" }
    ]
  },
  {
    day: 71,
    month: 4,
    week: 15,
    monthTitle: "Advanced Deep Learning",
    weekTitle: "LLMs & Prompting",
    topic: "Introduction to Large Language Models",
    handsOn: ["Understand LLM architecture (GPT-style)", "Use Hugging Face transformers library", "Load pre-trained models", "Generate text"],
    example: "Text generation with GPT-2",
    codingTask: "Load GPT-2 model using Hugging Face and generate text from various prompts.",
    assignment: "Experiment with different prompts and document how prompt phrasing affects output quality.",
    explanation: "LLMs are massive transformer models trained on huge text corpora, capable of understanding and generating human-like text.",
    expectedInputs: "Text prompts",
    expectedOutputs: "Generated text completions",
    evaluationChecklist: ["Successfully loaded pre-trained LLM", "Generated coherent text", "Understands prompt engineering basics", "Documented prompt variations"],
    gitTask: "Create repo llm-experiments, Commit LLM generation examples",
    resourceLinks: [
      { title: "LLM Introduction", url: "https://youtu.be/zjkBMFhNj_g?si=NJoC2Ik6PnvMBEoE" }
    ],
    tasks: [
      { id: "d71_resources", label: "Review learning resources" },
      { id: "d71_handson", label: "Complete hands-on: Load GPT-2 with Hugging Face" },
      { id: "d71_coding", label: "Coding task: Generate text from prompts" },
      { id: "d71_assignment", label: "Assignment: Document prompt engineering experiments" },
      { id: "d71_git", label: "Git: Create repo, commit examples" }
    ]
  },
  {
    day: 72,
    month: 4,
    week: 15,
    monthTitle: "Advanced Deep Learning",
    weekTitle: "LLMs & Prompting",
    topic: "Prompt Engineering Techniques",
    handsOn: ["Zero-shot prompting", "Few-shot prompting", "Chain-of-thought prompting", "Role-based prompting"],
    example: "Structured prompt templates",
    codingTask: "Create a prompt library with templates for: Classification tasks, Summarization, Question answering, Code generation, Creative writing.",
    assignment: "Build a Python function that takes task type and inputs, constructs optimal prompt, and returns LLM response.",
    explanation: "Prompt engineering is crucial for getting optimal results from LLMs. Proper prompts dramatically improve accuracy.",
    expectedInputs: "Task requirements and data",
    expectedOutputs: "Well-structured prompts and LLM responses",
    evaluationChecklist: ["All prompt types implemented", "Template library organized", "Function works for different tasks", "Examples demonstrate effectiveness"],
    gitTask: "Commit prompt engineering library",
    resourceLinks: [
      { title: "Prompt Engineering Guide", url: "https://youtu.be/dOxUroR57xs?si=GqY4Tw3VEu3xzsHp" }
    ],
    tasks: [
      { id: "d72_resources", label: "Review learning resources" },
      { id: "d72_handson", label: "Complete hands-on: Various prompt techniques" },
      { id: "d72_coding", label: "Coding task: Build prompt template library" },
      { id: "d72_assignment", label: "Assignment: Prompt construction function" },
      { id: "d72_git", label: "Git: Commit prompt library" }
    ]
  },
  {
    day: 73,
    month: 4,
    week: 15,
    monthTitle: "Advanced Deep Learning",
    weekTitle: "LLMs & Prompting",
    topic: "LLM API Integration (OpenAI, Anthropic)",
    handsOn: ["Set up API keys", "Use OpenAI API", "Handle responses", "Implement retry logic and error handling"],
    example: "Chatbot using LLM API",
    codingTask: "Build a conversational chatbot using OpenAI API that maintains conversation context across multiple turns.",
    assignment: "Add features: Token counting, Cost estimation, Response streaming, Conversation history management.",
    explanation: "Learn to integrate commercial LLM APIs into applications, essential for production AI systems.",
    expectedInputs: "User messages",
    expectedOutputs: "LLM responses with context",
    evaluationChecklist: ["API integration works", "Context maintained across turns", "Error handling implemented", "Token management working"],
    gitTask: "Commit LLM chatbot implementation",
    resourceLinks: [
      { title: "OpenAI API Tutorial", url: "https://youtu.be/c-g6epk3fFE?si=kJYHMBCdE8ySMUlW" }
    ],
    tasks: [
      { id: "d73_resources", label: "Review learning resources" },
      { id: "d73_handson", label: "Complete hands-on: API setup and integration" },
      { id: "d73_coding", label: "Coding task: Multi-turn chatbot" },
      { id: "d73_assignment", label: "Assignment: Token counting + cost estimation" },
      { id: "d73_git", label: "Git: Commit chatbot" }
    ]
  },
  {
    day: 74,
    month: 4,
    week: 15,
    monthTitle: "Advanced Deep Learning",
    weekTitle: "LLMs & Prompting",
    topic: "Sampling Strategies & Parameters",
    handsOn: ["Temperature parameter", "Top-k sampling", "Top-p (nucleus) sampling", "Frequency and presence penalties"],
    example: "Creative vs factual generation",
    codingTask: "Create a comparison tool that generates text using different sampling strategies and parameters.",
    assignment: "Document how each parameter affects: Creativity, Coherence, Diversity, Factual accuracy. Create a parameter guide for different use cases.",
    explanation: "Sampling strategies control the randomness and creativity of LLM outputs, crucial for different applications.",
    expectedInputs: "Same prompt with different parameters",
    expectedOutputs: "Varied generations demonstrating parameter effects",
    evaluationChecklist: ["All parameters tested", "Effects clearly documented", "Use case guide created", "Comparisons meaningful"],
    gitTask: "Commit sampling strategies analysis",
    resourceLinks: [
      { title: "LLM Sampling Methods", url: "https://youtu.be/VjpEP_Hndcw?si=YqxT2bNzn3jE9_aJ" }
    ],
    tasks: [
      { id: "d74_resources", label: "Review learning resources" },
      { id: "d74_handson", label: "Complete hands-on: Test all sampling methods" },
      { id: "d74_coding", label: "Coding task: Sampling comparison tool" },
      { id: "d74_assignment", label: "Assignment: Parameter effects guide" },
      { id: "d74_git", label: "Git: Commit analysis" }
    ]
  },
  {
    day: 75,
    month: 4,
    week: 15,
    monthTitle: "Advanced Deep Learning",
    weekTitle: "LLMs & Prompting",
    topic: "Mini Project: LLM-Powered Application",
    handsOn: ["Combine prompt engineering, API integration, FastAPI backend"],
    example: "AI Writing Assistant",
    codingTask: "Build a complete LLM application: Create FastAPI backend with multiple endpoints: /summarize, /translate, /improve, /qa. Implement proper prompt templates for each task. Add conversation memory. Include error handling and retry logic.",
    assignment: "Deploy the application and create: API documentation, Usage examples, Cost analysis, Performance benchmarks.",
    explanation: "Real-world LLM application demonstrating production-ready AI system development.",
    expectedInputs: "User requests via API",
    expectedOutputs: "LLM-processed responses",
    evaluationChecklist: ["All endpoints functional", "Prompts optimized", "Memory management works", "Production-ready code", "Documentation complete"],
    gitTask: "Create repo llm-powered-app, Commit complete project",
    resourceLinks: [],
    tasks: [
      { id: "d75_handson", label: "Complete hands-on: Full LLM application" },
      { id: "d75_coding", label: "Coding task: Multi-endpoint LLM service" },
      { id: "d75_assignment", label: "Assignment: Deploy with documentation" },
      { id: "d75_git", label: "Git: Create repo, commit project" }
    ]
  },
  {
    day: 76,
    month: 4,
    week: 16,
    monthTitle: "Advanced Deep Learning",
    weekTitle: "Model Finetuning",
    topic: "Understanding Transfer Learning & Finetuning",
    handsOn: ["Understand pre-training vs finetuning", "Load pre-trained models", "Freeze/unfreeze layers", "Prepare custom dataset"],
    example: "Domain-specific text classifier",
    codingTask: "Load a pre-trained BERT model and finetune it on a domain-specific classification task.",
    assignment: "Compare performance: Pre-trained model (no finetuning), Finetuned model, Model trained from scratch. Document training time and accuracy for each.",
    explanation: "Finetuning adapts powerful pre-trained models to specific tasks, achieving better results with less data and compute.",
    expectedInputs: "Custom labeled dataset",
    expectedOutputs: "Finetuned model for specific task",
    evaluationChecklist: ["Successfully loaded pre-trained model", "Finetuning completed", "Performance comparison documented", "Understands transfer learning benefits"],
    gitTask: "Create repo model-finetuning, Commit finetuning experiments",
    resourceLinks: [
      { title: "Transfer Learning & Finetuning", url: "https://youtu.be/5T-iXNNiwIs?si=gLpqLKCh9vWsFBNM" }
    ],
    tasks: [
      { id: "d76_resources", label: "Review learning resources" },
      { id: "d76_handson", label: "Complete hands-on: Load BERT and prepare data" },
      { id: "d76_coding", label: "Coding task: Finetune BERT classifier" },
      { id: "d76_assignment", label: "Assignment: Compare pre-trained, finetuned, from-scratch" },
      { id: "d76_git", label: "Git: Create repo, commit experiments" }
    ]
  },
  {
    day: 77,
    month: 4,
    week: 16,
    monthTitle: "Advanced Deep Learning",
    weekTitle: "Model Finetuning",
    topic: "LoRA (Low-Rank Adaptation)",
    handsOn: ["Understand LoRA concept", "Install PEFT library", "Apply LoRA to model", "Train with LoRA"],
    example: "Efficient LLM finetuning",
    codingTask: "Apply LoRA to finetune a language model on custom data, compare memory usage and training time with full finetuning.",
    assignment: "Experiment with different LoRA rank values (4, 8, 16, 32) and document the trade-offs between efficiency and performance.",
    explanation: "LoRA enables efficient finetuning of large models by training small adapter layers instead of full model weights.",
    expectedInputs: "Custom text dataset",
    expectedOutputs: "LoRA-finetuned model",
    evaluationChecklist: ["LoRA successfully applied", "Memory savings documented", "Different ranks tested", "Performance vs efficiency trade-off understood"],
    gitTask: "Commit LoRA finetuning implementation",
    resourceLinks: [
      { title: "LoRA Explained", url: "https://youtu.be/DhRoTONcyZE?si=Zf9OFo3y5ioHWKzQ" }
    ],
    tasks: [
      { id: "d77_resources", label: "Review learning resources" },
      { id: "d77_handson", label: "Complete hands-on: LoRA setup with PEFT" },
      { id: "d77_coding", label: "Coding task: LoRA vs full finetuning comparison" },
      { id: "d77_assignment", label: "Assignment: Test different LoRA ranks" },
      { id: "d77_git", label: "Git: Commit LoRA implementation" }
    ]
  },
  {
    day: 78,
    month: 4,
    week: 16,
    monthTitle: "Advanced Deep Learning",
    weekTitle: "Model Finetuning",
    topic: "QLoRA (Quantized LoRA)",
    handsOn: ["Understand 4-bit quantization", "Install BitsAndBytes", "Apply QLoRA", "Finetune large models on consumer hardware"],
    example: "Finetune 7B model on single GPU",
    codingTask: "Use QLoRA to finetune a 7B parameter model on a single GPU, measuring memory usage and comparing with standard LoRA.",
    assignment: "Create a guide documenting: Hardware requirements, Memory usage at different model sizes, Performance impact of quantization, When to use QLoRA vs LoRA.",
    explanation: "QLoRA enables finetuning of very large models on limited hardware by combining quantization with LoRA.",
    expectedInputs: "Large model and custom dataset",
    expectedOutputs: "Finetuned large model with minimal memory",
    evaluationChecklist: ["QLoRA successfully applied", "Large model finetuned on consumer GPU", "Memory usage documented", "Performance acceptable"],
    gitTask: "Commit QLoRA implementation and guide",
    resourceLinks: [
      { title: "QLoRA Tutorial", url: "https://youtu.be/XpoKB3usmKc?si=qBv3q9zyKuCxNxDy" }
    ],
    tasks: [
      { id: "d78_resources", label: "Review learning resources" },
      { id: "d78_handson", label: "Complete hands-on: QLoRA setup" },
      { id: "d78_coding", label: "Coding task: Finetune 7B model with QLoRA" },
      { id: "d78_assignment", label: "Assignment: Create QLoRA usage guide" },
      { id: "d78_git", label: "Git: Commit QLoRA implementation" }
    ]
  },
  {
    day: 79,
    month: 4,
    week: 16,
    monthTitle: "Advanced Deep Learning",
    weekTitle: "Model Finetuning",
    topic: "Instruction Finetuning",
    handsOn: ["Prepare instruction dataset", "Format conversations properly", "Train instruction-following model", "Evaluate instruction following"],
    example: "Custom instruction-tuned assistant",
    codingTask: "Create an instruction dataset and finetune a model to follow specific instructions for your domain (e.g., customer support, code help, medical advice).",
    assignment: "Build evaluation suite to test: Instruction following accuracy, Response quality, Format consistency, Safety alignment.",
    explanation: "Instruction finetuning teaches models to follow user instructions, essential for chatbot and assistant applications.",
    expectedInputs: "Instruction-response pairs",
    expectedOutputs: "Instruction-following model",
    evaluationChecklist: ["Dataset properly formatted", "Model follows instructions", "Evaluation suite comprehensive", "Quality improvements documented"],
    gitTask: "Commit instruction finetuning project",
    resourceLinks: [
      { title: "Instruction Finetuning", url: "https://youtu.be/eC6Hd1hFvos?si=0cKPRVGmKa8dHYzZ" }
    ],
    tasks: [
      { id: "d79_resources", label: "Review learning resources" },
      { id: "d79_handson", label: "Complete hands-on: Prepare instruction dataset" },
      { id: "d79_coding", label: "Coding task: Finetune instruction model" },
      { id: "d79_assignment", label: "Assignment: Build evaluation suite" },
      { id: "d79_git", label: "Git: Commit finetuning project" }
    ]
  },
  {
    day: 80,
    month: 4,
    week: 16,
    monthTitle: "Advanced Deep Learning",
    weekTitle: "Model Finetuning",
    topic: "Month 4 Capstone: Custom Domain LLM",
    handsOn: ["Complete finetuning pipeline", "Combine LoRA/QLoRA techniques", "Deploy finetuned model", "Create API"],
    example: "Domain-specific AI assistant",
    codingTask: "Build complete custom LLM system: Collect and prepare domain-specific data, Choose base model, Apply QLoRA finetuning, Evaluate performance, Deploy as FastAPI service, Add conversation memory, Implement safety checks.",
    assignment: "Create comprehensive documentation: Model selection rationale, Dataset creation process, Finetuning configuration, Performance benchmarks, API documentation, Deployment guide, Cost analysis.",
    explanation: "Capstone project demonstrating ability to finetune and deploy custom LLMs for real-world applications.",
    expectedInputs: "Domain-specific queries",
    expectedOutputs: "Specialized LLM responses",
    evaluationChecklist: ["Complete finetuning successful", "Model performs well on domain tasks", "API deployed and functional", "Documentation professional", "Code production-ready"],
    gitTask: "Create repo custom-domain-llm, Commit complete project, Tag v4.0-advanced-dl",
    resourceLinks: [],
    tasks: [
      { id: "d80_handson", label: "Complete hands-on: Full finetuning pipeline" },
      { id: "d80_coding", label: "Coding task: Custom domain LLM with API" },
      { id: "d80_assignment", label: "Assignment: Complete documentation package" },
      { id: "d80_git", label: "Git: Create repo, tag v4.0-advanced-dl" }
    ]
  }
];