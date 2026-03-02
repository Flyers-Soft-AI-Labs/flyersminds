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
    topic: "Data Cleaning & Categorical Encoding",
    handsOn: [
      "Identify null values using isnull()",
      "Use dropna() to remove rows with missing values",
      "Use fillna() to fill missing values",
      "Apply LabelEncoder on ordinal categorical columns",
      "Apply pd.get_dummies() for One-Hot Encoding on nominal columns",
      "Understand when to use Label Encoding vs One-Hot Encoding"
    ],
    example: "Handling Missing Values + Encoding Gender, City, Product Type columns",
    codingTask: "Part 1: Clean a dataset with missing values. Part 2: Take a dataset with categorical columns (e.g., Gender: Male/Female, City: Chennai/Mumbai). Apply (1) Label Encoding on ordinal data, (2) One-Hot Encoding on nominal data. Verify no string columns remain.",
    assignment: "Part 1: Apply both dropna() and fillna() and compare results. Part 2: Load the Titanic or any dataset with categorical columns. Encode all non-numeric columns and explain your choice of encoding method for each column.",
    explanation: "Real-world data is messy — cleaning makes it usable for ML models. ML models cannot process text/categorical data directly — encoding converts them to numbers. One-Hot Encoding vs Label Encoding is a frequent interview question and a daily practical skill.",
    expectedInputs: "Dataset with null values and categorical (text) columns",
    expectedOutputs: "Cleaned dataset + Fully numeric dataset ready for ML model training",
    evaluationChecklist: [
      "Missing values handled",
      "No wrong data removal",
      "Dataset usable",
      "LabelEncoder applied correctly",
      "pd.get_dummies() used",
      "No string columns in final dataset",
      "Explained why each encoding was chosen"
    ],
    gitTask: "Commit cleaned dataset script and encoding implementation together",
    resourceLinks: [
      { title: "Data Cleaning", url: "https://youtu.be/WpX2F2BS3Qc?si=I0dLtz7kGoR6qkX_" },
      { title: "Categorical Encoding", url: "https://youtu.be/9yl6-HEY7_s?si=Q1oWK6JU-ETHrkrl" }
    ],
    tasks: [
      { id: "d43_resources", label: "Review learning resources (both topics)" },
      { id: "d43_handson_cleaning", label: "Hands-on: Identify nulls, use dropna() and fillna()" },
      { id: "d43_handson_encoding", label: "Hands-on: LabelEncoder & pd.get_dummies()" },
      { id: "d43_coding", label: "Coding task: Clean dataset + encode categorical columns" },
      { id: "d43_assignment", label: "Assignment: Compare dropna vs fillna + explain encoding choices" },
      { id: "d43_git", label: "Git: Commit cleaning and encoding scripts together" }
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
    topic: "Model Evaluation (Regression Metrics) & K-Fold Cross Validation",
    handsOn: [
      "Calculate Mean Squared Error (MSE)",
      "Calculate Root Mean Squared Error (RMSE)",
      "Calculate R² Score",
      "Understand why a single train-test split can be unreliable",
      "Use cross_val_score from sklearn.model_selection",
      "Compare single split result vs K-Fold CV mean score",
      "Understand the role of k (typically k=5 or k=10)"
    ],
    example: "Evaluating house price model with MSE, R² and 5-Fold Cross Validation",
    codingTask: "Part 1: Evaluate your Linear Regression model using MSE and R². Part 2: Apply 5-Fold Cross Validation on your Linear Regression model. Compare: (1) Single train-test split R² score, (2) Mean R² from 5-Fold CV, (3) Std deviation of CV scores to check consistency.",
    assignment: "Part 1: Print and interpret each metric (MSE, RMSE, R²). Part 2: Apply K-Fold CV with k=5 and k=10 on your regression model. Write an interpretation of which k gave more reliable results and why.",
    explanation: "Evaluation metrics tell you how good a model is instead of blindly trusting predictions. Train-test split depends heavily on which data ends up in the test set — K-Fold CV gives a more reliable, unbiased estimate of model performance by training and testing on multiple folds. It is standard practice in all real ML projects.",
    expectedInputs: "Actual values, predicted values, trained model, feature matrix X, target y",
    expectedOutputs: "MSE, RMSE, R² values + array of CV scores, mean score, standard deviation",
    evaluationChecklist: [
      "Metrics calculated correctly",
      "Correct interpretation provided",
      "No formula errors",
      "cross_val_score used correctly",
      "k=5 and k=10 both tried",
      "Mean and std deviation reported",
      "Results compared with single split",
      "Interpretation written"
    ],
    gitTask: "Commit evaluation metrics code and K-Fold CV implementation together",
    resourceLinks: [
      { title: "Regression Metrics", url: "https://youtu.be/LbX4X71-TFI?si=h2nvb1sMCYa1ZBfp" },
      { title: "K-Fold Cross Validation", url: "https://youtu.be/gJo0uNL-5Qw?si=UFXfi8ZezkvB001i" }
    ],
    tasks: [
      { id: "d47_resources", label: "Review learning resources (both topics)" },
      { id: "d47_handson_metrics", label: "Hands-on: Calculate MSE, RMSE, R²" },
      { id: "d47_handson_kfold", label: "Hands-on: Apply cross_val_score with k=5 and k=10" },
      { id: "d47_coding", label: "Coding task: Evaluate model + K-Fold CV comparison" },
      { id: "d47_assignment", label: "Assignment: Interpret metrics + compare k=5 vs k=10" },
      { id: "d47_git", label: "Git: Commit evaluation metrics and K-Fold CV code" }
    ]
  },
  {
    day: 48,
    month: 3,
    week: 10,
    monthTitle: "Machine Learning",
    weekTitle: "ML Basics (Regression & Classification)",
    topic: "Logistic Regression & Decision Tree Classifier",
    handsOn: [
      "Understand classification problems",
      "Load dataset and train Logistic Regression model",
      "Understand how Decision Trees split data using Gini impurity or Entropy",
      "Train DecisionTreeClassifier on the same churn dataset",
      "Visualize the tree using plot_tree from sklearn.tree",
      "Understand max_depth hyperparameter and how it controls overfitting"
    ],
    example: "Customer Churn Prediction with Logistic Regression and Decision Tree",
    codingTask: "Part 1: Build a Logistic Regression model to predict whether a customer will churn. Part 2: Build a Decision Tree classifier on the same churn dataset. Visualize the decision tree (limit depth to 3 for readability). Compare accuracy of both models side by side.",
    assignment: "Part 1: Try another dataset (Spam detection / Loan approval). Part 2: Try max_depth = 3, 5, 10 and observe how it affects train vs test accuracy. Write observations about overfitting when max_depth is too high.",
    explanation: "Logistic Regression introduces classification where output is categorical (Yes/No, 0/1). Decision Trees are non-linear and more flexible — they are the foundation of Random Forest and XGBoost. Visualizing a tree builds deep intuition about how ML models make decisions.",
    expectedInputs: "Dataset with features and binary target",
    expectedOutputs: "Predicted class labels, trained Decision Tree model, tree visualization, accuracy comparison",
    evaluationChecklist: [
      "Logistic Regression model trains",
      "Predictions generated",
      "Correct target mapping",
      "Decision Tree trained",
      "Tree visualized",
      "max_depth experimented",
      "Logistic Regression vs Decision Tree compared",
      "Overfitting observation noted"
    ],
    gitTask: "Commit Logistic Regression and Decision Tree models together",
    resourceLinks: [
      { title: "Logistic Regression", url: "https://youtu.be/UCOm-LFKX9E?si=l1bWCbCRiMmMyB-8" },
      { title: "Decision Tree Classifier", url: "https://youtu.be/_L39rN6gz7Y?si=UKuPak6_pLqCau1k" }
    ],
    tasks: [
      { id: "d48_resources", label: "Review learning resources (both topics)" },
      { id: "d48_handson_lr", label: "Hands-on: Train Logistic Regression on churn dataset" },
      { id: "d48_handson_dt", label: "Hands-on: Train Decision Tree and visualize with plot_tree" },
      { id: "d48_coding", label: "Coding task: Build both models, compare accuracy" },
      { id: "d48_assignment", label: "Assignment: Try new dataset + experiment with max_depth" },
      { id: "d48_git", label: "Git: Commit Logistic Regression and Decision Tree models" }
    ]
  },
  {
    day: 49,
    month: 3,
    week: 10,
    monthTitle: "Machine Learning",
    weekTitle: "ML Basics (Regression & Classification)",
    topic: "Classification Metrics & Random Forest Classifier",
    handsOn: [
      "Create Confusion Matrix",
      "Calculate Accuracy, Precision, Recall, F1-score",
      "Understand ensemble learning and the concept of bagging",
      "Train RandomForestClassifier on the churn dataset",
      "Use n_estimators hyperparameter to control number of trees",
      "Extract and visualize feature importances",
      "Compare Random Forest vs single Decision Tree performance"
    ],
    example: "Evaluating churn model + Random Forest for Customer Churn Prediction",
    codingTask: "Part 1: Evaluate your classification model using all metrics: Accuracy, Precision, Recall, F1-score. Part 2: Train a Random Forest on the churn dataset. Print the top 5 most important features. Compare Random Forest accuracy vs single Decision Tree from Day 48.",
    assignment: "Part 1: Plot and interpret the confusion matrix. Part 2: Tune n_estimators (50, 100, 200) in a loop and plot accuracy vs n_estimators to see where performance stabilizes.",
    explanation: "Accuracy alone is not enough for imbalanced datasets — you need precision, recall, and F1-score. Random Forest is one of the most used ML algorithms in industry. It builds many Decision Trees and combines their predictions (ensemble). It is more powerful, more robust to overfitting, and automatically provides feature importance scores.",
    expectedInputs: "True labels, predicted labels, dataset with features and binary target",
    expectedOutputs: "Metric values, confusion matrix, trained Random Forest model, feature importance chart, comparison with Decision Tree",
    evaluationChecklist: [
      "All metrics calculated correctly",
      "Confusion matrix plotted properly",
      "Interpretation provided",
      "RandomForestClassifier trained",
      "Feature importances extracted and visualized",
      "n_estimators tuned",
      "Random Forest vs Decision Tree compared",
      "Best model identified"
    ],
    gitTask: "Commit evaluation code, plots, and Random Forest model together",
    resourceLinks: [
      { title: "Classification Metrics", url: "https://youtu.be/aWAnNHXIKww?si=WjklcT78nWlakZuy" },
      { title: "Random Forest Classifier", url: "https://youtu.be/gkXX4h3qYm4?si=YQmWd8K6ttrCQC5h" }
    ],
    tasks: [
      { id: "d49_resources", label: "Review learning resources (both topics)" },
      { id: "d49_handson_metrics", label: "Hands-on: Confusion matrix, accuracy, precision, recall, F1" },
      { id: "d49_handson_rf", label: "Hands-on: Train Random Forest, extract feature importances" },
      { id: "d49_coding", label: "Coding task: Full evaluation + Random Forest training" },
      { id: "d49_assignment", label: "Assignment: Plot confusion matrix + tune n_estimators" },
      { id: "d49_git", label: "Git: Commit evaluation code and Random Forest model" }
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
    topic: "Feature Scaling, KNN & Support Vector Machine (SVM)",
    handsOn: [
      "Understand why scaling is needed and apply StandardScaler and MinMaxScaler",
      "Understand how KNN classifies by looking at k nearest neighbors",
      "Train KNeighborsClassifier and experiment with different k values",
      "Observe how KNN performance drops without scaling (run without scaler first)",
      "Understand how SVM finds the optimal hyperplane with maximum margin",
      "Train SVC and compare linear vs rbf kernel"
    ],
    example: "Feature Scaling + KNN and SVM for Customer Churn Classification",
    codingTask: "Part 1: Apply StandardScaler on one dataset and MinMaxScaler on another. Part 2 (KNN): Train KNeighborsClassifier with k=5 on the churn dataset. Try k=1, 5, 10, 20 and plot accuracy vs k. Observe and document how performance changes with and without StandardScaler. Part 3 (SVM): Train an SVC(kernel='rbf') on the same scaled dataset. Compare SVM vs KNN vs Logistic Regression vs Decision Tree vs Random Forest accuracy in a summary table.",
    assignment: "Part 1: Compare model performance before and after scaling. Part 2: Build a model comparison table with all 5 classifiers (Logistic Regression, Decision Tree, Random Forest, KNN, SVM). Record accuracy, precision, recall, F1-score and training time for each. Write a conclusion on which model to use and when.",
    explanation: "Scaling ensures all features contribute equally — especially critical for distance-based algorithms like KNN and SVM. KNN directly demonstrates WHY scaling matters. This day gives interns a complete picture of the most important classification algorithms before the project week.",
    expectedInputs: "Dataset with numerical features and binary target",
    expectedOutputs: "Scaled dataset, KNN accuracy vs k plot, SVM model, 5-model comparison table",
    evaluationChecklist: [
      "Scaling applied correctly",
      "No data leakage (fit on train only)",
      "Correct scaler used",
      "Scaling applied before KNN and SVM",
      "KNN k-value optimized",
      "SVM trained",
      "All 5 models compared",
      "Best model identified with justification"
    ],
    gitTask: "Commit KNN and SVM models alongside scaling implementation",
    resourceLinks: [
      { title: "Feature Scaling", url: "https://youtu.be/Q-45O3b1pO8?si=AFbl_m8RmIsNZlDO" },
      { title: "K-Nearest Neighbors (KNN)", url: "https://youtu.be/CQveSaMyEwM?si=fwwZ6BgffEUl3SCo" },
      { title: "Support Vector Machine (SVM)", url: "https://youtu.be/FB5EdxAGxQg?si=zi71MnLYH5odkmRg" }
    ],
    tasks: [
      { id: "d52_resources", label: "Review learning resources (all 3 topics)" },
      { id: "d52_handson_scaling", label: "Hands-on: StandardScaler & MinMaxScaler" },
      { id: "d52_handson_knn", label: "Hands-on: KNN with k=1, 5, 10, 20 — with/without scaling" },
      { id: "d52_handson_svm", label: "Hands-on: SVC with linear and rbf kernel" },
      { id: "d52_coding", label: "Coding task: Scaling + KNN + SVM + 5-model comparison table" },
      { id: "d52_assignment", label: "Assignment: Full 5-model comparison with conclusion" },
      { id: "d52_git", label: "Git: Commit scaling, KNN, and SVM code together" }
    ]
  },
  {
    day: 53,
    month: 3,
    week: 11,
    monthTitle: "Machine Learning",
    weekTitle: "Feature Engineering & Optimization",
    topic: "ML Pipelines & Handling Class Imbalance",
    handsOn: [
      "Combine preprocessing and model using sklearn Pipeline",
      "Create reusable workflows with Pipeline",
      "Understand what class imbalance is and why it is dangerous",
      "Use class_weight='balanced' parameter in sklearn classifiers",
      "Install imbalanced-learn: pip install imbalanced-learn",
      "Apply SMOTE (Synthetic Minority Oversampling Technique)",
      "Compare F1-score before and after handling imbalance"
    ],
    example: "Pipeline = Scaling + Model + SMOTE for Fraud Detection or Churn Prediction with imbalanced classes",
    codingTask: "Part 1: Create a pipeline that scales features and trains a model in one step. Part 2: Take the churn dataset (typically imbalanced). (1) Train a Random Forest WITHOUT handling imbalance — note high accuracy but low recall for minority class. (2) Train with class_weight='balanced'. (3) Apply SMOTE to the training data and retrain. Compare precision, recall, and F1-score for the minority class across all three approaches.",
    assignment: "Part 1: Rewrite your previous model code using a pipeline. Part 2: Rewrite the churn prediction Pipeline to include SMOTE before the model step. Evaluate using F1-score as the primary metric. Write a short explanation of why accuracy is misleading for imbalanced datasets.",
    explanation: "Pipelines make ML workflows clean, reusable, and reduce errors. In real-world datasets, classes are almost never 50/50 — a fraud detection model that always predicts 'not fraud' gets 99% accuracy but catches zero fraud. Handling imbalance is the #1 real-world ML problem that beginners ignore.",
    expectedInputs: "Raw data / Imbalanced dataset with binary target",
    expectedOutputs: "Working pipeline model + Classification reports showing precision/recall/F1 for baseline, balanced weights, and SMOTE versions",
    evaluationChecklist: [
      "Pipeline runs successfully",
      "No repeated preprocessing code",
      "Clean implementation",
      "Class imbalance identified in dataset",
      "class_weight='balanced' applied",
      "SMOTE applied correctly",
      "F1-score used as primary metric",
      "All three approaches compared",
      "Written explanation of why accuracy alone is misleading"
    ],
    gitTask: "Commit pipeline implementation and class imbalance handling together",
    resourceLinks: [
      { title: "ML Pipelines", url: "https://youtu.be/HZ9MUzCRlzI?si=GwSvGyBY6d9314s4" },
      { title: "Handling Class Imbalance (SMOTE)", url: "https://youtu.be/XfeIBAIGCKo?si=x1ndLckUT4OtA1Nv" }
    ],
    tasks: [
      { id: "d53_resources", label: "Review learning resources (both topics)" },
      { id: "d53_handson_pipeline", label: "Hands-on: Build sklearn Pipeline (scaling + model)" },
      { id: "d53_handson_imbalance", label: "Hands-on: class_weight='balanced' and SMOTE" },
      { id: "d53_coding", label: "Coding task: Pipeline + 3-way imbalance comparison" },
      { id: "d53_assignment", label: "Assignment: Rewrite with pipeline + SMOTE + F1 evaluation" },
      { id: "d53_git", label: "Git: Commit pipeline and class imbalance handling together" }
    ]
  },
  {
    day: 54,
    month: 3,
    week: 11,
    monthTitle: "Machine Learning",
    weekTitle: "Feature Engineering & Optimization",
    topic: "Hyperparameter Tuning, Gradient Boosting & XGBoost",
    handsOn: [
      "Understand hyperparameters and use GridSearchCV",
      "Define parameter grid and train multiple model variations",
      "Understand boosting — trees built sequentially, each correcting errors of the previous",
      "Understand difference: Random Forest uses bagging (parallel trees), GBM uses boosting (sequential trees)",
      "Train GradientBoostingClassifier from sklearn.ensemble",
      "Install and train XGBClassifier: pip install xgboost",
      "Tune n_estimators and learning_rate using GridSearchCV"
    ],
    example: "GridSearchCV on model + XGBoost for Customer Churn Prediction",
    codingTask: "Part 1: Apply GridSearchCV on a model to find the best parameters. Part 2: Train GradientBoostingClassifier and XGBClassifier on the churn dataset. Run GridSearchCV to tune n_estimators and learning_rate for XGBoost. Build a final comparison table: Logistic Regression vs Decision Tree vs Random Forest vs Gradient Boosting vs XGBoost.",
    assignment: "Part 1: Compare model performance before and after hyperparameter tuning. Part 2: Create a final model leaderboard comparing all 6 algorithms (Logistic Regression, Decision Tree, Random Forest, KNN, SVM, XGBoost) on the same dataset using accuracy, F1-score, and training time. Pick the winner and justify your choice.",
    explanation: "Hyperparameter tuning finds the best model settings automatically. Gradient Boosting and XGBoost are arguably the most powerful traditional ML algorithms for tabular data. XGBoost wins the majority of industry ML competitions. Understanding the difference between bagging (Random Forest) and boosting (XGBoost) is a core ML interview topic.",
    expectedInputs: "Model and parameter grid, dataset with features and target",
    expectedOutputs: "Best parameters, improved model performance, trained GBM and XGBoost models, final 6-model leaderboard",
    evaluationChecklist: [
      "Grid search completes successfully",
      "Best parameters identified",
      "Performance improved",
      "GradientBoostingClassifier trained",
      "XGBoost installed and trained",
      "GridSearchCV applied to XGBoost",
      "Bagging vs boosting distinction understood",
      "Final 6-model leaderboard created",
      "Best model selected with justification"
    ],
    gitTask: "Commit Gradient Boosting and XGBoost models alongside GridSearchCV tuning",
    resourceLinks: [
      { title: "Hyperparameter Tuning (GridSearchCV)", url: "https://youtu.be/HdlDYng8g9s?si=-q7-d4VMXYDC_j2D" },
      { title: "Gradient Boosting", url: "https://youtu.be/en2bmeB4QUo?si=LwdQAt4_LN3LnXnj" },
      { title: "XGBoost", url: "https://youtu.be/gPciUPwWJQQ?si=R9Z62YuDBjkNC102" }
    ],
    tasks: [
      { id: "d54_resources", label: "Review learning resources (all 3 topics)" },
      { id: "d54_handson_gridsearch", label: "Hands-on: GridSearchCV with parameter grid" },
      { id: "d54_handson_gbm", label: "Hands-on: Train GradientBoostingClassifier" },
      { id: "d54_handson_xgboost", label: "Hands-on: Install XGBoost and train XGBClassifier" },
      { id: "d54_coding", label: "Coding task: GridSearchCV + GBM + XGBoost + comparison table" },
      { id: "d54_assignment", label: "Assignment: 6-model leaderboard with accuracy, F1, training time" },
      { id: "d54_git", label: "Git: Commit GridSearchCV, GBM, and XGBoost code" }
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