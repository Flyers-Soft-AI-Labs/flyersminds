// Month 3: Machine Learning (Days 41-60)
export const month3 = [
  {
    day: 41,
    month: 3,
    week: 9,
    monthTitle: "Machine Learning",
    weekTitle: "Data Science & Python for ML",
    topic: "NumPy Basics",
    handsOn: ["Install numpy", "Create arrays", "Perform arithmetic operations", "Understand shape and dtype"],
    example: "Array Operations",
    codingTask: "Create two NumPy arrays and perform addition, subtraction, multiplication, division.",
    assignment: "Demonstrate slicing, reshaping, and broadcasting with NumPy arrays.",
    explanation: "NumPy is the foundation of ML in Python. It handles numerical data efficiently and is essential for all ML libraries.",
    expectedInputs: "NumPy arrays with different shapes",
    expectedOutputs: "Correct array operations and transformations",
    evaluationChecklist: ["Arrays created correctly", "Operations work properly", "Proper slicing demonstrated", "Reshaping correct"],
    gitTask: "Create repo ml-foundations, Commit NumPy scripts",
    resourceLinks: [
      { title: "NumPy Basics", url: "https://youtu.be/SqhVpJSHuyI?si=Ilg3M5I22crPe4JA" }
    ],
    tasks: [
      { id: "d41_resources", label: "Review learning resources" },
      { id: "d41_handson", label: "Complete hands-on: NumPy arrays & operations" },
      { id: "d41_coding", label: "Coding task: Array arithmetic operations" },
      { id: "d41_assignment", label: "Assignment: Slicing, reshaping, broadcasting" },
      { id: "d41_git", label: "Git: Create repo, commit NumPy scripts" }
    ]
  },
  {
    day: 42,
    month: 3,
    week: 9,
    monthTitle: "Machine Learning",
    weekTitle: "Data Science & Python for ML",
    topic: "Pandas Basics",
    handsOn: ["Install pandas", "Load CSV file", "View head, tail, shape, columns", "Filter data"],
    example: "Dataset Loading and Exploration",
    codingTask: "Load a CSV dataset and display its basic information using pandas.",
    assignment: "Print: Head (first 5 rows), Tail (last 5 rows), Shape, Column names, Data types.",
    explanation: "Pandas handles structured data (tables/spreadsheets) and is the backbone of data preprocessing in ML.",
    expectedInputs: "CSV file path",
    expectedOutputs: "Dataset information displayed correctly",
    evaluationChecklist: ["Dataset loaded successfully", "No file errors", "All outputs correct", "Data types understood"],
    gitTask: "Commit pandas exploration notebook",
    resourceLinks: [
      { title: "Pandas Basics", url: "https://youtu.be/mkYBJwX_dMs?si=1Au2o6uFbKvXmnfK" }
    ],
    tasks: [
      { id: "d42_resources", label: "Review learning resources" },
      { id: "d42_handson", label: "Complete hands-on: Load & explore CSV data" },
      { id: "d42_coding", label: "Coding task: Display dataset basic info" },
      { id: "d42_assignment", label: "Assignment: Head, tail, shape, columns, dtypes" },
      { id: "d42_git", label: "Git: Commit pandas notebook" }
    ]
  },
  {
    day: 43,
    month: 3,
    week: 9,
    monthTitle: "Machine Learning",
    weekTitle: "Data Science & Python for ML",
    topic: "Data Cleaning",
    handsOn: ["Identify null values using isnull()", "Use dropna() to remove rows", "Use fillna() to fill missing values", "Handle duplicates"],
    example: "Handling Missing Values",
    codingTask: "Clean a dataset with missing values using pandas.",
    assignment: "Apply both dropna() and fillna() methods and compare the results.",
    explanation: "Real-world data is always messy with missing values, duplicates, and errors. Cleaning makes it usable for ML models.",
    expectedInputs: "Dataset with missing values",
    expectedOutputs: "Clean dataset with no missing values",
    evaluationChecklist: ["Missing values identified", "Cleaning methods applied correctly", "No wrong data removal", "Dataset usable for modeling"],
    gitTask: "Commit data cleaning script",
    resourceLinks: [
      { title: "Data Cleaning", url: "https://youtu.be/WpX2F2BS3Qc?si=I0dLtz7kGoR6qkX_" }
    ],
    tasks: [
      { id: "d43_resources", label: "Review learning resources" },
      { id: "d43_handson", label: "Complete hands-on: Null value handling" },
      { id: "d43_coding", label: "Coding task: Clean dataset with missing values" },
      { id: "d43_assignment", label: "Assignment: Compare dropna vs fillna methods" },
      { id: "d43_git", label: "Git: Commit cleaning script" }
    ]
  },
  {
    day: 44,
    month: 3,
    week: 9,
    monthTitle: "Machine Learning",
    weekTitle: "Data Science & Python for ML",
    topic: "Data Visualization",
    handsOn: ["Install matplotlib and seaborn", "Plot bar chart, line plot, histogram", "Customize plots with labels and titles"],
    example: "Sales Data Visualization",
    codingTask: "Plot at least 3 different types of graphs from a dataset.",
    assignment: "Create: Histogram, Scatter plot, Box plot with proper labels.",
    explanation: "Visualization helps understand patterns, outliers, and relationships in data before building models.",
    expectedInputs: "Dataset columns for visualization",
    expectedOutputs: "Clean, labeled plots",
    evaluationChecklist: ["All plots generated correctly", "Labels and titles added", "No rendering errors", "Insights visible"],
    gitTask: "Commit visualization notebook",
    resourceLinks: [
      { title: "Data Visualization", url: "https://youtu.be/loYuxWSsLNc?si=m5Tvx85B5jLsRX2G" }
    ],
    tasks: [
      { id: "d44_resources", label: "Review learning resources" },
      { id: "d44_handson", label: "Complete hands-on: matplotlib & seaborn plots" },
      { id: "d44_coding", label: "Coding task: Create 3 types of graphs" },
      { id: "d44_assignment", label: "Assignment: Histogram, scatter plot, box plot" },
      { id: "d44_git", label: "Git: Commit visualization notebook" }
    ]
  },
  {
    day: 45,
    month: 3,
    week: 9,
    monthTitle: "Machine Learning",
    weekTitle: "Data Science & Python for ML",
    topic: "Mini Project: Exploratory Data Analysis (EDA)",
    handsOn: ["Combine data loading, cleaning, and visualization", "Calculate statistical summaries", "Write observations"],
    example: "Complete EDA Project",
    codingTask: "Perform complete EDA on a dataset: Load data, Clean data, Visualize patterns, Summarize insights.",
    assignment: "Write at least 5 meaningful insights discovered from the dataset.",
    explanation: "EDA is the first real data science project that combines all data analysis skills learned so far.",
    expectedInputs: "Raw dataset",
    expectedOutputs: "Clean dataset, visualizations, insights report",
    evaluationChecklist: ["Data properly cleaned", "Multiple visualizations created", "Insights are meaningful and data-backed", "Code well-structured"],
    gitTask: "Create folder eda-project, Commit complete EDA with README",
    resourceLinks: [],
    tasks: [
      { id: "d45_handson", label: "Complete hands-on: Full EDA pipeline" },
      { id: "d45_coding", label: "Coding task: Load, clean, visualize, summarize" },
      { id: "d45_assignment", label: "Assignment: Write 5 dataset insights" },
      { id: "d45_git", label: "Git: Create folder, commit EDA project" }
    ]
  },
  {
    day: 46,
    month: 3,
    week: 10,
    monthTitle: "Machine Learning",
    weekTitle: "ML Basics (Regression & Classification)",
    topic: "Train-Test Split & Linear Regression",
    handsOn: ["Load dataset", "Separate features (X) and target (y)", "Split data using train_test_split", "Train Linear Regression model"],
    example: "House Price Prediction",
    codingTask: "Build a Linear Regression model to predict house prices from features.",
    assignment: "Try prediction using 2 or more features and compare results.",
    explanation: "This teaches the core ML workflow: preparing data, splitting into train/test, training a model, and making predictions.",
    expectedInputs: "Features (area, bedrooms) and target (price)",
    expectedOutputs: "Trained model with predictions",
    evaluationChecklist: ["Data split correctly (80-20)", "Model trains without errors", "Predictions generated", "Code is structured"],
    gitTask: "Commit Linear Regression notebook",
    resourceLinks: [
      { title: "Train-Test Split", url: "https://youtu.be/SjOfbbfI2qY?si=S-SojQe2qIeBnOWw" },
      { title: "Linear Regression", url: "https://youtu.be/gPfgB4ew3RY?si=bGytYYE1hKfayuMi" }
    ],
    tasks: [
      { id: "d46_resources", label: "Review learning resources" },
      { id: "d46_handson", label: "Complete hands-on: Train-test split & model training" },
      { id: "d46_coding", label: "Coding task: House price prediction model" },
      { id: "d46_assignment", label: "Assignment: Multi-feature prediction comparison" },
      { id: "d46_git", label: "Git: Commit regression notebook" }
    ]
  },
  {
    day: 47,
    month: 3,
    week: 10,
    monthTitle: "Machine Learning",
    weekTitle: "ML Basics (Regression & Classification)",
    topic: "Model Evaluation (Regression Metrics)",
    handsOn: ["Calculate Mean Squared Error (MSE)", "Calculate Root Mean Squared Error (RMSE)", "Calculate R-squared Score"],
    example: "Evaluating house price prediction model",
    codingTask: "Evaluate your Linear Regression model using MSE, RMSE, and R-squared.",
    assignment: "Print all three metrics and interpret what each means.",
    explanation: "Learn to judge how good a model is by using proper evaluation metrics.",
    expectedInputs: "True values and predicted values",
    expectedOutputs: "MSE, RMSE, R-squared scores",
    evaluationChecklist: ["All metrics calculated correctly", "Correct interpretation provided", "No formula errors"],
    gitTask: "Commit evaluation metrics code",
    resourceLinks: [
      { title: "Evaluation Metrics", url: "https://youtu.be/LbX4X71-TFI?si=h2nvb1sMCYa1ZBfp" }
    ],
    tasks: [
      { id: "d47_resources", label: "Review learning resources" },
      { id: "d47_handson", label: "Complete hands-on: MSE, RMSE, R-squared" },
      { id: "d47_coding", label: "Coding task: Evaluate regression model" },
      { id: "d47_assignment", label: "Assignment: Interpret all metrics" },
      { id: "d47_git", label: "Git: Commit evaluation code" }
    ]
  },
  {
    day: 48,
    month: 3,
    week: 10,
    monthTitle: "Machine Learning",
    weekTitle: "ML Basics (Regression & Classification)",
    topic: "Logistic Regression (Classification)",
    handsOn: ["Understand classification problems", "Load classification dataset", "Train Logistic Regression model", "Make predictions"],
    example: "Customer Churn Prediction",
    codingTask: "Build a Logistic Regression model to predict whether a customer will churn (leave).",
    assignment: "Try another classification dataset like Spam detection or Loan approval prediction.",
    explanation: "Introduces classification where the output is categorical (Yes/No, 0/1) instead of continuous numbers.",
    expectedInputs: "Customer features (age, usage, complaints)",
    expectedOutputs: "Churn predictions (0 or 1)",
    evaluationChecklist: ["Model trains successfully", "Predictions are 0 or 1", "Correct target variable mapping"],
    gitTask: "Commit classification model notebook",
    resourceLinks: [
      { title: "Logistic Regression", url: "https://youtu.be/UCOm-LFKX9E?si=l1bWCbCRiMmMyB-8" }
    ],
    tasks: [
      { id: "d48_resources", label: "Review learning resources" },
      { id: "d48_handson", label: "Complete hands-on: Logistic regression training" },
      { id: "d48_coding", label: "Coding task: Customer churn prediction" },
      { id: "d48_assignment", label: "Assignment: Try spam/loan dataset" },
      { id: "d48_git", label: "Git: Commit classification model" }
    ]
  },
  {
    day: 49,
    month: 3,
    week: 10,
    monthTitle: "Machine Learning",
    weekTitle: "ML Basics (Regression & Classification)",
    topic: "Classification Metrics",
    handsOn: ["Create Confusion Matrix", "Calculate Accuracy, Precision, Recall", "Calculate F1-score"],
    example: "Evaluating churn prediction model",
    codingTask: "Evaluate your classification model using all metrics: Accuracy, Precision, Recall, F1-score.",
    assignment: "Plot and interpret the confusion matrix.",
    explanation: "Accuracy alone is not enough to evaluate classifiers, especially for imbalanced datasets. Need precision, recall, F1-score.",
    expectedInputs: "True labels and predicted labels",
    expectedOutputs: "All metrics calculated and confusion matrix plotted",
    evaluationChecklist: ["All metrics calculated correctly", "Confusion matrix plotted properly", "Interpretation of metrics provided"],
    gitTask: "Commit evaluation code and plots",
    resourceLinks: [
      { title: "Classification Metrics", url: "https://youtu.be/aWAnNHXIKww?si=WjklcT78nWlakZuy" }
    ],
    tasks: [
      { id: "d49_resources", label: "Review learning resources" },
      { id: "d49_handson", label: "Complete hands-on: All classification metrics" },
      { id: "d49_coding", label: "Coding task: Full model evaluation" },
      { id: "d49_assignment", label: "Assignment: Plot and interpret confusion matrix" },
      { id: "d49_git", label: "Git: Commit evaluation code" }
    ]
  },
  {
    day: 50,
    month: 3,
    week: 10,
    monthTitle: "Machine Learning",
    weekTitle: "ML Basics (Regression & Classification)",
    topic: "Mini Project: House Price Prediction (Complete ML Pipeline)",
    handsOn: ["Load and clean data", "Feature engineering", "Train-test split", "Train model", "Evaluate performance", "Make predictions"],
    example: "End-to-end regression project",
    codingTask: "Build a complete ML pipeline for house price prediction from data loading to evaluation.",
    assignment: "Save the trained model using joblib or pickle for future use.",
    explanation: "This project consolidates the entire ML workflow into one real-world application.",
    expectedInputs: "Raw house dataset",
    expectedOutputs: "Trained model file (.pkl), evaluation metrics, predictions",
    evaluationChecklist: ["Data properly prepared", "Model trained successfully", "Model evaluated with metrics", "Model saved correctly"],
    gitTask: "Create repo house-price-ml, Commit complete ML pipeline with README",
    resourceLinks: [],
    tasks: [
      { id: "d50_handson", label: "Complete hands-on: End-to-end ML pipeline" },
      { id: "d50_coding", label: "Coding task: Complete house price prediction system" },
      { id: "d50_assignment", label: "Assignment: Save model using joblib/pickle" },
      { id: "d50_git", label: "Git: Create repo, commit full pipeline" }
    ]
  },
  {
    day: 51,
    month: 3,
    week: 11,
    monthTitle: "Machine Learning",
    weekTitle: "Feature Engineering & Optimization",
    topic: "Feature Engineering",
    handsOn: ["Analyze existing columns", "Create new features from existing ones", "Transform raw data into useful features"],
    example: "Creating derived features",
    codingTask: "Create new features: TotalCharges = MonthlyCharges Ã— Tenure, AgeGroup from Age, IncomeCategory from Income.",
    assignment: "Create at least 3 new features that could improve model performance.",
    explanation: "Feature engineering is creating new useful features from existing data to help models learn better patterns.",
    expectedInputs: "Raw dataset columns",
    expectedOutputs: "Dataset with new engineered features",
    evaluationChecklist: ["New features are logical", "No calculation errors", "Dataset structure maintained", "Features improve model"],
    gitTask: "Commit feature engineering notebook",
    resourceLinks: [
      { title: "Feature Engineering", url: "https://youtu.be/pYVScuY-GPk?si=C9or63wSbRrj5Eup" }
    ],
    tasks: [
      { id: "d51_resources", label: "Review learning resources" },
      { id: "d51_handson", label: "Complete hands-on: Feature analysis and creation" },
      { id: "d51_coding", label: "Coding task: Derive new features" },
      { id: "d51_assignment", label: "Assignment: Create 3+ performance-improving features" },
      { id: "d51_git", label: "Git: Commit engineered features" }
    ]
  },
  {
    day: 52,
    month: 3,
    week: 11,
    monthTitle: "Machine Learning",
    weekTitle: "Feature Engineering & Optimization",
    topic: "Feature Scaling",
    handsOn: ["Understand why scaling is needed", "Apply StandardScaler", "Apply MinMaxScaler", "Compare results"],
    example: "Scaling numerical features",
    codingTask: "Apply StandardScaler and MinMaxScaler on numerical features in your dataset.",
    assignment: "Train models before and after scaling and compare performance.",
    explanation: "Scaling ensures all features contribute equally to the model. Features with large values don't dominate.",
    expectedInputs: "Raw numerical features",
    expectedOutputs: "Scaled features in proper range",
    evaluationChecklist: ["Scaling applied correctly", "No data leakage (fit on train only)", "Correct scaler used for problem"],
    gitTask: "Commit feature scaling implementation",
    resourceLinks: [
      { title: "Feature Scaling", url: "https://youtu.be/Q-45O3b1pO8?si=AFbl_m8RmIsNZlDO" }
    ],
    tasks: [
      { id: "d52_resources", label: "Review learning resources" },
      { id: "d52_handson", label: "Complete hands-on: StandardScaler & MinMaxScaler" },
      { id: "d52_coding", label: "Coding task: Apply both scalers" },
      { id: "d52_assignment", label: "Assignment: Compare model performance before/after" },
      { id: "d52_git", label: "Git: Commit scaling code" }
    ]
  },
  {
    day: 53,
    month: 3,
    week: 11,
    monthTitle: "Machine Learning",
    weekTitle: "Feature Engineering & Optimization",
    topic: "ML Pipelines",
    handsOn: ["Combine preprocessing and model", "Use sklearn.pipeline.Pipeline", "Create reusable workflows"],
    example: "Pipeline = Scaling + Model Training",
    codingTask: "Create a pipeline that scales features and trains a model in one step.",
    assignment: "Rewrite your previous model code using a pipeline for cleaner code.",
    explanation: "Pipelines make ML workflows clean, reusable, and reduce errors by automating preprocessing steps.",
    expectedInputs: "Raw data",
    expectedOutputs: "Pipeline object that preprocesses and predicts",
    evaluationChecklist: ["Pipeline runs successfully", "No repeated preprocessing", "Clean implementation", "Pipeline can be saved/loaded"],
    gitTask: "Commit pipeline-based model",
    resourceLinks: [
      { title: "ML Pipelines", url: "https://youtu.be/HZ9MUzCRlzI?si=GwSvGyBY6d9314s4" }
    ],
    tasks: [
      { id: "d53_resources", label: "Review learning resources" },
      { id: "d53_handson", label: "Complete hands-on: sklearn Pipeline creation" },
      { id: "d53_coding", label: "Coding task: Build scaling + model pipeline" },
      { id: "d53_assignment", label: "Assignment: Rewrite previous model with pipeline" },
      { id: "d53_git", label: "Git: Commit pipeline model" }
    ]
  },
  {
    day: 54,
    month: 3,
    week: 11,
    monthTitle: "Machine Learning",
    weekTitle: "Feature Engineering & Optimization",
    topic: "Hyperparameter Tuning",
    handsOn: ["Understand hyperparameters", "Use GridSearchCV", "Define parameter grid", "Train multiple model variations"],
    example: "Optimizing model parameters",
    codingTask: "Apply GridSearchCV to find the best hyperparameters for your model.",
    assignment: "Compare model performance before and after hyperparameter tuning.",
    explanation: "Hyperparameter tuning finds the best model settings automatically, improving accuracy significantly.",
    expectedInputs: "Model and parameter grid",
    expectedOutputs: "Best parameters and improved model performance",
    evaluationChecklist: ["Grid search completes successfully", "Best parameters identified", "Model performance improved", "Cross-validation used"],
    gitTask: "Commit hyperparameter tuning code",
    resourceLinks: [
      { title: "Hyperparameter Tuning", url: "https://youtu.be/HdlDYng8g9s?si=-q7-d4VMXYDC_j2D" }
    ],
    tasks: [
      { id: "d54_resources", label: "Review learning resources" },
      { id: "d54_handson", label: "Complete hands-on: GridSearchCV" },
      { id: "d54_coding", label: "Coding task: Find optimal parameters" },
      { id: "d54_assignment", label: "Assignment: Compare before/after tuning" },
      { id: "d54_git", label: "Git: Commit tuning code" }
    ]
  },
  {
    day: 55,
    month: 3,
    week: 11,
    monthTitle: "Machine Learning",
    weekTitle: "Feature Engineering & Optimization",
    topic: "Mini Project: Advanced Customer Churn Prediction",
    handsOn: ["Feature engineering", "Feature scaling", "Pipeline creation", "Hyperparameter tuning", "Model evaluation"],
    example: "Optimized ML classification system",
    codingTask: "Build a complete customer churn prediction model using all optimization techniques learned.",
    assignment: "Save the best model and write a detailed evaluation report comparing different approaches.",
    explanation: "This project mirrors real-world ML workflows where optimization is key to production models.",
    expectedInputs: "Raw customer data",
    expectedOutputs: "Optimized model, evaluation report, saved best model",
    evaluationChecklist: ["Features properly engineered", "Pipeline used correctly", "Best model parameters selected", "Model saved", "Documentation complete"],
    gitTask: "Create repo churn-prediction-advanced, Commit complete project with README",
    resourceLinks: [],
    tasks: [
      { id: "d55_handson", label: "Complete hands-on: Full optimization pipeline" },
      { id: "d55_coding", label: "Coding task: Optimized churn prediction system" },
      { id: "d55_assignment", label: "Assignment: Best model + evaluation report" },
      { id: "d55_git", label: "Git: Create repo, commit full project" }
    ]
  },
  {
    day: 56,
    month: 3,
    week: 12,
    monthTitle: "Machine Learning",
    weekTitle: "Deep Learning Basics",
    topic: "Introduction to Neural Networks (ANN Basics)",
    handsOn: ["Install TensorFlow/Keras", "Understand neurons, layers, activation functions", "Build simple ANN architecture"],
    example: "Binary classification using ANN",
    codingTask: "Build an ANN with: Input layer, One hidden layer with 10 neurons, Output layer. Train on a classification dataset.",
    assignment: "Experiment: Change number of hidden neurons (5, 20, 50) and observe how performance changes.",
    explanation: "Introduces how deep learning models learn patterns using multiple layers of neurons.",
    expectedInputs: "Classification dataset features",
    expectedOutputs: "Trained ANN model with predictions",
    evaluationChecklist: ["ANN compiles successfully", "Loss decreases during training", "Model predicts correctly", "Different architectures tested"],
    gitTask: "Commit ANN model code",
    resourceLinks: [
      { title: "Neural Networks Intro", url: "https://youtu.be/quCEmM2JBbk?si=xfdQiy4eC8LDHSdq" }
    ],
    tasks: [
      { id: "d56_resources", label: "Review learning resources" },
      { id: "d56_handson", label: "Complete hands-on: TensorFlow/Keras setup & ANN" },
      { id: "d56_coding", label: "Coding task: Build and train ANN" },
      { id: "d56_assignment", label: "Assignment: Experiment with different neuron counts" },
      { id: "d56_git", label: "Git: Commit ANN model" }
    ]
  },
  {
    day: 57,
    month: 3,
    week: 12,
    monthTitle: "Machine Learning",
    weekTitle: "Deep Learning Basics",
    topic: "Convolutional Neural Networks (CNN Basics)",
    handsOn: ["Understand convolution and pooling operations", "Prepare image dataset", "Build CNN architecture with Conv2D layers"],
    example: "Image classification (MNIST digits or CIFAR-10)",
    codingTask: "Build a CNN with: Conv2D layers, MaxPooling layers, Flatten layer, Dense output layer.",
    assignment: "Train the CNN on MNIST dataset and report test accuracy.",
    explanation: "CNNs automatically extract features from images, making them perfect for computer vision tasks.",
    expectedInputs: "Image dataset (28x28 or 32x32 images)",
    expectedOutputs: "Trained CNN with image classification predictions",
    evaluationChecklist: ["CNN architecture correct", "Model trains without errors", "Test accuracy better than random guessing", "Visualization of predictions"],
    gitTask: "Commit CNN project notebook",
    resourceLinks: [
      { title: "CNN Basics", url: "https://youtu.be/QzY57FaENXg?si=zJcCbcMQjkvouA5C" }
    ],
    tasks: [
      { id: "d57_resources", label: "Review learning resources" },
      { id: "d57_handson", label: "Complete hands-on: CNN architecture building" },
      { id: "d57_coding", label: "Coding task: Build and train CNN" },
      { id: "d57_assignment", label: "Assignment: Train on MNIST, report accuracy" },
      { id: "d57_git", label: "Git: Commit CNN project" }
    ]
  },
  {
    day: 58,
    month: 3,
    week: 12,
    monthTitle: "Machine Learning",
    weekTitle: "Deep Learning Basics",
    topic: "Recurrent Neural Networks (RNN Fundamentals)",
    handsOn: ["Understand RNN cell structure and hidden states", "Learn about vanishing/exploding gradients", "Build simple RNN for sequences"],
    example: "Basic sequence prediction with RNN",
    codingTask: "Build a simple RNN model that processes sequences and predicts the next number in a sequence.",
    assignment: "Build RNNs with different hidden unit sizes (8, 16, 32) and compare their performance.",
    explanation: "RNNs are designed for sequential data (text, time series) where order matters. They maintain internal memory.",
    expectedInputs: "Sequential data (numbers, text)",
    expectedOutputs: "Sequence predictions",
    evaluationChecklist: ["RNN compiles and trains", "Can explain hidden state concept", "Understands vanishing gradient problem", "Different architectures compared"],
    gitTask: "Commit RNN fundamentals notebook",
    resourceLinks: [
      { title: "RNN Fundamentals", url: "https://youtu.be/Y2wfIKQyd1I?si=9RXrwxDblb3iBsFj" }
    ],
    tasks: [
      { id: "d58_resources", label: "Review learning resources" },
      { id: "d58_handson", label: "Complete hands-on: RNN architecture and hidden states" },
      { id: "d58_coding", label: "Coding task: Sequence prediction RNN" },
      { id: "d58_assignment", label: "Assignment: Compare hidden unit sizes" },
      { id: "d58_git", label: "Git: Commit RNN fundamentals" }
    ]
  },
  {
    day: 59,
    month: 3,
    week: 12,
    monthTitle: "Machine Learning",
    weekTitle: "Deep Learning Basics",
    topic: "Model Saving & Loading + API Integration",
    handsOn: ["Save trained models (.h5, .keras, .pkl)", "Load saved models", "Create FastAPI prediction endpoints", "Test API with Postman"],
    example: "ML Model as REST API",
    codingTask: "Build a complete ML model service: Train a model, Save the model, Create FastAPI endpoints for predictions, Test with sample data.",
    assignment: "Implement: Model versioning, Batch prediction endpoint, Response caching for repeated requests.",
    explanation: "Bridge between model development and production deployment. Shows how ML models are actually used in applications.",
    expectedInputs: "Model features via API JSON",
    expectedOutputs: "Predictions via API response",
    evaluationChecklist: ["Model saved successfully", "Loaded model produces identical predictions", "FastAPI server runs", "/predict endpoint works", "Proper error handling"],
    gitTask: "Commit ML API service code",
    resourceLinks: [
      { title: "Model Saving & API Integration", url: "https://youtu.be/8Nl-of5C3uA?si=tGMHZ1Ra4FoYfCdG" }
    ],
    tasks: [
      { id: "d59_resources", label: "Review learning resources" },
      { id: "d59_handson", label: "Complete hands-on: Model save/load & FastAPI" },
      { id: "d59_coding", label: "Coding task: ML model service with API" },
      { id: "d59_assignment", label: "Assignment: Versioning, batch predict, caching" },
      { id: "d59_git", label: "Git: Commit model API service" }
    ]
  },
  {
    day: 60,
    month: 3,
    week: 12,
    monthTitle: "Machine Learning",
    weekTitle: "Deep Learning Basics",
    topic: "Month 3 Capstone: AI-Powered Application",
    handsOn: ["Combine ML/DL model training", "FastAPI backend development", "API endpoint creation", "Full application deployment"],
    example: "Complete end-to-end AI application",
    codingTask: "Build a complete AI application that: Uses a trained ML/DL model, Has FastAPI backend, Provides predictions via clean API, Handles errors properly.",
    assignment: "Finalize AI project with: Clean folder structure, README with setup instructions, API documentation, Sample requests.",
    explanation: "Final ML/DL project demonstrating ability to build a complete AI system from training to deployment.",
    expectedInputs: "Application data via API",
    expectedOutputs: "AI predictions via API responses",
    evaluationChecklist: ["Model properly integrated", "API endpoints work correctly", "Predictions are accurate", "Code is clean and documented", "Professional project structure"],
    gitTask: "Create repo ai-powered-app, Final commit with complete documentation, Tag v3.0-ml-fundamentals",
    resourceLinks: [],
    tasks: [
      { id: "d60_handson", label: "Complete hands-on: Full AI application development" },
      { id: "d60_coding", label: "Coding task: Complete AI app with model + FastAPI" },
      { id: "d60_assignment", label: "Assignment: Finalize with documentation and README" },
      { id: "d60_git", label: "Git: Create repo, commit project, tag v3.0-ml-fundamentals" }
    ]
  }
];