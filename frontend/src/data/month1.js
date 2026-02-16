// Month 1: Python (Days 1-20)
export const month1 = [
  {
    day: 1,
    month: 1,
    week: 1,
    monthTitle: "Python",
    weekTitle: "Python Basics",
    topic: "Python Setup, Variables, Print, Input",
    handsOn: ["Install Python", "Install VS Code", "Create virtual environment", "Run first Python file"],
    example: "Greeting Program",
    codingTask: "Take name & age and print a formatted message.",
    assignment: "Write 10 small programs using variables (swap numbers, sum, average, simple interest, etc.).",
    explanation: "Interns learn Python setup safely using virtual environments so system Python is not affected. Input/output builds confidence and removes fear of coding.",
    expectedInputs: "Name, age",
    expectedOutputs: "Formatted greeting message",
    evaluationChecklist: ["Python installed correctly", "Virtual environment created", "Correct use of input()", "Meaningful variable names", "Clean output"],
    gitTask: "Create first Git repo, Initial commit with greeting program",
    resourceLinks: [
      { title: "Python Setup", url: "https://youtu.be/YYXdXT2l-Gg?si=_vx1plUTFvdHEna9" },
      { title: "Variables", url: "https://youtu.be/TqPzwenhMj0?si=6BSeFP1KjYcTVrDW" },
      { title: "Input & Output", url: "https://youtu.be/sjA5O6Xoetc?si=tf8bZ6WACNR7BeHs" }
    ],
    tasks: [
      { id: "d1_resources", label: "Review learning resources" },
      { id: "d1_handson", label: "Complete hands-on: Install Python, VS Code, create virtual environment" },
      { id: "d1_coding", label: "Coding task: Greeting program with name & age" },
      { id: "d1_assignment", label: "Assignment: 10 small variable programs" },
      { id: "d1_git", label: "Git: Create first repo, initial commit" }
    ]
  },
  {
    day: 2,
    month: 1,
    week: 1,
    monthTitle: "Python",
    weekTitle: "Python Basics",
    topic: "Data Types & Operators",
    handsOn: ["Explore int, float, string, boolean", "Use arithmetic operators"],
    example: "Calculator",
    codingTask: "Build a calculator using +, -, *, /.",
    assignment: "Extend calculator with modulus (%) and power (**).",
    explanation: "Strengthens understanding of numeric data types and operators.",
    expectedInputs: "Two numbers, operator",
    expectedOutputs: "Correct calculation result",
    evaluationChecklist: ["All operators work", "Handles division by zero", "No runtime errors"],
    gitTask: "Commit calculator program",
    resourceLinks: [
      { title: "Datatypes", url: "https://youtu.be/gCCVsvgR2KU?si=mAK2BjtxebY1OCy3" },
      { title: "Operators", url: "https://youtu.be/v5MR5JnKcZI?si=vWlZWvH5gYkzWY5_" }
    ],
    tasks: [
      { id: "d2_resources", label: "Review learning resources" },
      { id: "d2_handson", label: "Complete hands-on: Explore data types & operators" },
      { id: "d2_coding", label: "Coding task: Build a calculator" },
      { id: "d2_assignment", label: "Assignment: Extend calculator with modulus & power" },
      { id: "d2_git", label: "Git: Commit calculator program" }
    ]
  },
  {
    day: 3,
    month: 1,
    week: 1,
    monthTitle: "Python",
    weekTitle: "Python Basics",
    topic: "Conditions & Loops",
    handsOn: ["if-else", "for loop", "while loop"],
    example: "Even/Odd, Prime checker",
    codingTask: "Number classification program.",
    assignment: "Write pattern printing programs (stars, numbers).",
    explanation: "Helps understand flow control and nested loops.",
    expectedInputs: "Number, rows count",
    expectedOutputs: "Correct result or pattern",
    evaluationChecklist: ["Conditions correct", "Loops run properly", "Proper indentation"],
    gitTask: "Commit pattern programs",
    resourceLinks: [
      { title: "Conditions", url: "https://youtu.be/PqFKRqpHrjw?si=JWUf9Qp3HFT0wkKu" },
      { title: "Loops", url: "https://youtu.be/94UHCEmprCY?si=0FwynDDT9PZwE4ex" }
    ],
    tasks: [
      { id: "d3_resources", label: "Review learning resources" },
      { id: "d3_handson", label: "Complete hands-on: if-else, for/while loops" },
      { id: "d3_coding", label: "Coding task: Number classification program" },
      { id: "d3_assignment", label: "Assignment: Pattern printing programs" },
      { id: "d3_git", label: "Git: Commit pattern programs" }
    ]
  },
  {
    day: 4,
    month: 1,
    week: 1,
    monthTitle: "Python",
    weekTitle: "Python Basics",
    topic: "Random Module",
    handsOn: ["import random", "randint()", "choice()"],
    example: "Guessing Game",
    codingTask: "Build a guessing game where user guesses a random number.",
    assignment: "Add attempt counter and score system.",
    explanation: "Introduces randomness and logical game flow.",
    expectedInputs: "User guesses",
    expectedOutputs: "Win/lose message + score",
    evaluationChecklist: ["Random number works", "Attempts counted", "Score updates"],
    gitTask: "Commit guessing game",
    resourceLinks: [
      { title: "Random Module", url: "https://youtu.be/khZKoe0_B0I?si=umpRvf0XHSt8XC75" }
    ],
    tasks: [
      { id: "d4_resources", label: "Review learning resources" },
      { id: "d4_handson", label: "Complete hands-on: random module usage" },
      { id: "d4_coding", label: "Coding task: Build a guessing game" },
      { id: "d4_assignment", label: "Assignment: Add attempt counter & score system" },
      { id: "d4_git", label: "Git: Commit guessing game" }
    ]
  },
  {
    day: 5,
    month: 1,
    week: 1,
    monthTitle: "Python",
    weekTitle: "Python Basics",
    topic: "Menu Driven Programs",
    handsOn: ["while loop menu design"],
    example: "Menu Driven Calculator",
    codingTask: "Create calculator with menu until exit.",
    assignment: "Add error handling for wrong choices.",
    explanation: "Teaches loop control and user interaction.",
    expectedInputs: "Menu choice, numbers",
    expectedOutputs: "Correct calculation",
    evaluationChecklist: ["Menu repeats", "Exit works", "Invalid choice handled"],
    gitTask: "Commit menu-driven calculator",
    resourceLinks: [
      { title: "Menu Driven Programs", url: "https://youtu.be/hrq5awgNm8w?si=9DS1Zip1RYLvZ466" }
    ],
    tasks: [
      { id: "d5_resources", label: "Review learning resources" },
      { id: "d5_handson", label: "Complete hands-on: while loop menu design" },
      { id: "d5_coding", label: "Coding task: Menu-driven calculator" },
      { id: "d5_assignment", label: "Assignment: Add error handling for wrong choices" },
      { id: "d5_git", label: "Git: Commit menu-driven calculator" }
    ]
  },
  {
    day: 6,
    month: 1,
    week: 2,
    monthTitle: "Python",
    weekTitle: "Functions & Data Structures",
    topic: "Functions - Basics",
    handsOn: ["Define functions using def", "Call functions", "Pass parameters", "Return values"],
    example: "Calculator using functions",
    codingTask: "Break the calculator into separate functions for add, subtract, multiply, and divide.",
    assignment: "Write 5 small programs using functions (factorial, palindrome check, area of circle, simple interest, even/odd).",
    explanation: "This teaches modular programming. Interns understand how to divide big problems into small reusable blocks.",
    expectedInputs: "Numbers, operation choices",
    expectedOutputs: "Correct function results",
    evaluationChecklist: ["Functions defined properly", "No duplicate code", "Correct return values", "Code is modular"],
    gitTask: "Commit function-based calculator and practice programs",
    resourceLinks: [
      { title: "Functions", url: "https://youtu.be/BVfCWuca9nw?si=eY5VBm0SbVqCukx9" }
    ],
    tasks: [
      { id: "d6_resources", label: "Review learning resources" },
      { id: "d6_handson", label: "Complete hands-on: Define & call functions" },
      { id: "d6_coding", label: "Coding task: Function-based calculator" },
      { id: "d6_assignment", label: "Assignment: 5 function programs" },
      { id: "d6_git", label: "Git: Commit function programs" }
    ]
  },
  {
    day: 7,
    month: 1,
    week: 2,
    monthTitle: "Python",
    weekTitle: "Functions & Data Structures",
    topic: "Lists & Tuples",
    handsOn: ["Create lists and tuples", "Indexing and slicing", "append(), remove(), sort()"],
    example: "Student marks list",
    codingTask: "Store student marks in a list and calculate total, average, and grade.",
    assignment: "Implement sorting and searching in a list.",
    explanation: "Lists are used to store multiple values. This builds understanding of data collections.",
    expectedInputs: "Marks list",
    expectedOutputs: "Sorted list, searched element, calculated average",
    evaluationChecklist: ["List operations work", "Correct sorting", "Correct searching logic"],
    gitTask: "Commit list and tuple practice programs",
    resourceLinks: [
      { title: "Lists & Tuples", url: "https://youtu.be/gOMW_n2-2Mw?si=JkUHj4Q_4rGDOt2S" }
    ],
    tasks: [
      { id: "d7_resources", label: "Review learning resources" },
      { id: "d7_handson", label: "Complete hands-on: Lists & tuples operations" },
      { id: "d7_coding", label: "Coding task: Student marks list program" },
      { id: "d7_assignment", label: "Assignment: Sorting & searching in lists" },
      { id: "d7_git", label: "Git: Commit list programs" }
    ]
  },
  {
    day: 8,
    month: 1,
    week: 2,
    monthTitle: "Python",
    weekTitle: "Functions & Data Structures",
    topic: "Sets & Dictionaries",
    handsOn: ["Create dictionaries", "Add, update, delete values", "Use sets for uniqueness"],
    example: "Contact storage",
    codingTask: "Store contacts using dictionary (name -> phone number).",
    assignment: "Add a search feature by name.",
    explanation: "This teaches key-value based data storage, the foundation of databases and APIs.",
    expectedInputs: "Contact name, phone number",
    expectedOutputs: "Stored and retrieved contact details",
    evaluationChecklist: ["Dictionary used correctly", "Search works", "No duplicate keys"],
    gitTask: "Commit contact storage program",
    resourceLinks: [
      { title: "Sets & Dictionaries", url: "https://youtu.be/hvmduOeCh4o?si=hA4c0qOWXozBEWCV" }
    ],
    tasks: [
      { id: "d8_resources", label: "Review learning resources" },
      { id: "d8_handson", label: "Complete hands-on: Dictionaries & sets" },
      { id: "d8_coding", label: "Coding task: Contact storage with dictionary" },
      { id: "d8_assignment", label: "Assignment: Search feature by name" },
      { id: "d8_git", label: "Git: Commit contact storage" }
    ]
  },
  {
    day: 9,
    month: 1,
    week: 2,
    monthTitle: "Python",
    weekTitle: "Functions & Data Structures",
    topic: "Strings & Comprehensions",
    handsOn: ["String methods (lower, upper, split, replace)", "List comprehensions"],
    example: "Data formatter",
    codingTask: "Clean a messy string and format it properly.",
    assignment: "Solve 5 string manipulation problems and 3 comprehension problems.",
    explanation: "Improves text handling and introduces Pythonic coding style.",
    expectedInputs: "Raw strings",
    expectedOutputs: "Formatted clean strings",
    evaluationChecklist: ["Correct string methods", "Proper formatting", "Comprehension used correctly"],
    gitTask: "Commit string and comprehension programs",
    resourceLinks: [
      { title: "Strings", url: "https://youtu.be/k9TUPpGqYTo?si=4C1uuGIyqKGnfXKf" },
      { title: "Comprehensions", url: "https://youtu.be/3dt4OGnU5sM?si=szFx9yeQ8wRCffgC" }
    ],
    tasks: [
      { id: "d9_resources", label: "Review learning resources" },
      { id: "d9_handson", label: "Complete hands-on: String methods & comprehensions" },
      { id: "d9_coding", label: "Coding task: Clean & format messy strings" },
      { id: "d9_assignment", label: "Assignment: 5 string + 3 comprehension problems" },
      { id: "d9_git", label: "Git: Commit programs" }
    ]
  },
  {
    day: 10,
    month: 1,
    week: 2,
    monthTitle: "Python",
    weekTitle: "Functions & Data Structures",
    topic: "Mini Project: Contact Book Application",
    handsOn: ["Combine lists, dictionaries, and functions", "Store data in JSON file"],
    example: "Contact Book",
    codingTask: "Create a contact book that can: Add contact, View contacts, Update contact, Delete contact.",
    assignment: "Extend contact book with search and save to file.",
    explanation: "This mini project combines everything learned in Week 2 and shows how real applications store and manage data.",
    expectedInputs: "Name, phone number, email",
    expectedOutputs: "Contacts saved and retrieved successfully",
    evaluationChecklist: ["CRUD operations work", "File storage implemented", "Data persists after restart", "Clean code structure"],
    gitTask: "Create new repo or branch for Contact Book, Commit project with proper message, Push to GitHub",
    resourceLinks: [],
    tasks: [
      { id: "d10_handson", label: "Complete hands-on: Combine lists, dicts, functions" },
      { id: "d10_coding", label: "Coding task: Contact Book with CRUD operations" },
      { id: "d10_assignment", label: "Assignment: Add search & file save feature" },
      { id: "d10_git", label: "Git: Create repo, commit & push Contact Book" }
    ]
  },
  {
    day: 11,
    month: 1,
    week: 3,
    monthTitle: "Python",
    weekTitle: "OOP + File Handling",
    topic: "Classes & Objects",
    handsOn: ["Understand what a class is", "Create objects", "Use __init__ constructor"],
    example: "Student Class",
    codingTask: "Create a Student class with attributes: id, name, marks and a method to display details.",
    assignment: "Create a Person class with attributes: name, age, city and a method to print profile.",
    explanation: "This introduces Object Oriented Programming. Interns learn how real-world entities are represented as objects.",
    expectedInputs: "Student ID, name, marks; Person name, age, city",
    expectedOutputs: "Object created and details displayed",
    evaluationChecklist: ["Class structure correct", "Constructor used properly", "Objects created successfully", "Methods working"],
    gitTask: "Commit Student and Person class programs",
    resourceLinks: [
      { title: "Objects (Option 1)", url: "https://youtu.be/ZDa-Z5JzLYM?si=pvQahP4qwGXL39RP" },
      { title: "Objects & Classes (Option 2)", url: "https://youtu.be/8O5kX73OkIY?si=cPt75zftHEbossJD" }
    ],
    tasks: [
      { id: "d11_resources", label: "Review learning resources" },
      { id: "d11_handson", label: "Complete hands-on: Classes & objects" },
      { id: "d11_coding", label: "Coding task: Student class with display method" },
      { id: "d11_assignment", label: "Assignment: Person class with profile method" },
      { id: "d11_git", label: "Git: Commit class programs" }
    ]
  },
  {
    day: 12,
    month: 1,
    week: 3,
    monthTitle: "Python",
    weekTitle: "OOP + File Handling",
    topic: "Inheritance",
    handsOn: ["Parent and child classes", "super() usage"],
    example: "Bank Account System",
    codingTask: "Create a base class Account and a child class SavingsAccount that inherits from it.",
    assignment: "Add another child class CurrentAccount with different withdrawal rules.",
    explanation: "This teaches code reuse and hierarchy, widely used in real-world software systems.",
    expectedInputs: "Account number, balance",
    expectedOutputs: "Correct method overriding behavior",
    evaluationChecklist: ["Inheritance implemented", "Methods overridden correctly", "super() used properly"],
    gitTask: "Commit inheritance examples",
    resourceLinks: [
      { title: "Inheritance", url: "https://youtu.be/Cn7AkDb4pIU?si=_SNQMBwtaDHUOH-F" }
    ],
    tasks: [
      { id: "d12_resources", label: "Review learning resources" },
      { id: "d12_handson", label: "Complete hands-on: Parent/child classes & super()" },
      { id: "d12_coding", label: "Coding task: Account & SavingsAccount classes" },
      { id: "d12_assignment", label: "Assignment: CurrentAccount with different rules" },
      { id: "d12_git", label: "Git: Commit inheritance examples" }
    ]
  },
  {
    day: 13,
    month: 1,
    week: 3,
    monthTitle: "Python",
    weekTitle: "OOP + File Handling",
    topic: "File Handling (JSON / CSV)",
    handsOn: ["Open, read, write files", "Use json module"],
    example: "Save Student Records",
    codingTask: "Save student objects into a JSON file and read them back.",
    assignment: "Create a program to store multiple students in a file and retrieve them.",
    explanation: "This introduces data persistence. Interns learn how programs can store data permanently.",
    expectedInputs: "Student details",
    expectedOutputs: "Student records saved and loaded",
    evaluationChecklist: ["File created", "Data written correctly", "Data read without error"],
    gitTask: "Commit file handling programs",
    resourceLinks: [
      { title: "File Handling (Optional)", url: "https://youtu.be/Sx1Hjr67xO0?si=Fw3fJF929xsiChTM" },
      { title: "File Handling (Main)", url: "https://youtu.be/aequTxAvQq4?si=AgXSjOenO2Dvl10A" }
    ],
    tasks: [
      { id: "d13_resources", label: "Review learning resources" },
      { id: "d13_handson", label: "Complete hands-on: File read/write & JSON" },
      { id: "d13_coding", label: "Coding task: Save & read student objects from JSON" },
      { id: "d13_assignment", label: "Assignment: Multiple student file storage" },
      { id: "d13_git", label: "Git: Commit file handling programs" }
    ]
  },
  {
    day: 14,
    month: 1,
    week: 3,
    monthTitle: "Python",
    weekTitle: "OOP + File Handling",
    topic: "Exception Handling",
    handsOn: ["try, except, finally", "Handle invalid inputs"],
    example: "Safe File Access",
    codingTask: "Add exception handling to file reading programs.",
    assignment: "Add validations for incorrect inputs like non-numeric marks, missing files, etc.",
    explanation: "Teaches how to prevent crashes and make programs user-friendly.",
    expectedInputs: "Invalid file names, wrong data types",
    expectedOutputs: "Graceful error messages",
    evaluationChecklist: ["No crashes", "Meaningful error messages", "Proper exception handling"],
    gitTask: "Commit exception-handled programs",
    resourceLinks: [
      { title: "Exception Handling", url: "https://youtu.be/6SPDvPK38tw?si=1NdYDUxO3wwwQfQN" }
    ],
    tasks: [
      { id: "d14_resources", label: "Review learning resources" },
      { id: "d14_handson", label: "Complete hands-on: try/except/finally" },
      { id: "d14_coding", label: "Coding task: Exception handling for file programs" },
      { id: "d14_assignment", label: "Assignment: Input validation for all edge cases" },
      { id: "d14_git", label: "Git: Commit exception-handled programs" }
    ]
  },
  {
    day: 15,
    month: 1,
    week: 3,
    monthTitle: "Python",
    weekTitle: "OOP + File Handling",
    topic: "Mini Project: Student Management System",
    handsOn: ["Combine OOP + File Handling + Exception Handling"],
    example: "Student Management System",
    codingTask: "Build a system to: Add student, View students, Update student, Delete student.",
    assignment: "Store all student records in a JSON file.",
    explanation: "This is the first complete OOP-based application. It simulates a real management system.",
    expectedInputs: "Student ID, name, marks",
    expectedOutputs: "Student list saved and retrieved",
    evaluationChecklist: ["OOP used properly", "CRUD operations work", "Data persists in file", "Error handling implemented"],
    gitTask: "Create repo/branch for Student Management System, Commit complete project, Push to GitHub",
    resourceLinks: [],
    tasks: [
      { id: "d15_handson", label: "Complete hands-on: Combine OOP + Files + Exceptions" },
      { id: "d15_coding", label: "Coding task: Student Management System with CRUD" },
      { id: "d15_assignment", label: "Assignment: JSON file persistence" },
      { id: "d15_git", label: "Git: Create repo, commit & push project" }
    ]
  },
  {
    day: 16,
    month: 1,
    week: 4,
    monthTitle: "Python",
    weekTitle: "Python Final Project",
    topic: "Project Planning & Requirement Analysis",
    handsOn: ["Understand Inventory Management System", "Identify modules", "Draw flow diagram"],
    example: "Inventory workflow",
    codingTask: "Write down: What data each product will have, What operations the system should support.",
    assignment: "Create a project design document with: Project objective, Features list, Data structure design, Flow of the program.",
    explanation: "This teaches how real projects start. Before coding, they learn to think, plan, and design.",
    expectedInputs: "No code input. Planning work only.",
    expectedOutputs: "A clear written project plan.",
    evaluationChecklist: ["All features identified", "Data structures planned", "Logical program flow"],
    gitTask: "Create new repository inventory-management, Commit project design document",
    resourceLinks: [],
    tasks: [
      { id: "d16_handson", label: "Complete hands-on: Understand inventory system" },
      { id: "d16_coding", label: "Coding task: Define product data & operations" },
      { id: "d16_assignment", label: "Assignment: Create project design document" },
      { id: "d16_git", label: "Git: Create repo, commit design document" }
    ]
  },
  {
    day: 17,
    month: 1,
    week: 4,
    monthTitle: "Python",
    weekTitle: "Python Final Project",
    topic: "Coding Phase 1 - Add & Update Products",
    handsOn: ["Create product structure using dictionary", "Store products in list", "Add new product", "Update existing product"],
    example: "Add product",
    codingTask: "Implement: Add product, Update product quantity or price.",
    assignment: "Make sure duplicate product names are not allowed.",
    explanation: "This is the foundation of the inventory system. Interns learn data creation and modification.",
    expectedInputs: "Product name, quantity, price",
    expectedOutputs: "Product successfully added or updated",
    evaluationChecklist: ["Add works", "Update works", "Duplicate handled", "Data stored correctly"],
    gitTask: "Commit add & update functionality",
    resourceLinks: [],
    tasks: [
      { id: "d17_handson", label: "Complete hands-on: Product structure & storage" },
      { id: "d17_coding", label: "Coding task: Add & update products" },
      { id: "d17_assignment", label: "Assignment: Duplicate product name prevention" },
      { id: "d17_git", label: "Git: Commit add & update functionality" }
    ]
  },
  {
    day: 18,
    month: 1,
    week: 4,
    monthTitle: "Python",
    weekTitle: "Python Final Project",
    topic: "Coding Phase 2 - Sell Product & Stock Update",
    handsOn: ["Reduce stock after sale", "Prevent selling more than available"],
    example: "Sell product",
    codingTask: "Implement: Sell product, Automatically reduce quantity, Show error if stock is insufficient.",
    assignment: "Add a feature to show current stock after sale.",
    explanation: "Introduces business logic. Interns learn how real systems protect data integrity.",
    expectedInputs: "Product name, quantity to sell",
    expectedOutputs: "Updated stock or error message",
    evaluationChecklist: ["Stock reduces correctly", "No negative stock", "Clear error message"],
    gitTask: "Commit selling & stock update feature",
    resourceLinks: [],
    tasks: [
      { id: "d18_handson", label: "Complete hands-on: Stock reduction logic" },
      { id: "d18_coding", label: "Coding task: Sell product with stock validation" },
      { id: "d18_assignment", label: "Assignment: Show current stock after sale" },
      { id: "d18_git", label: "Git: Commit selling feature" }
    ]
  },
  {
    day: 19,
    month: 1,
    week: 4,
    monthTitle: "Python",
    weekTitle: "Python Final Project",
    topic: "Debugging, Validation & File Storage",
    handsOn: ["Add validations", "Save inventory to JSON file", "Load inventory on program start"],
    example: "Inventory persistence",
    codingTask: "Store all product data in inventory.json.",
    assignment: "Add: Input validation, File read/write, Auto-load saved data.",
    explanation: "This makes the system permanent and usable across sessions.",
    expectedInputs: "Valid/invalid product data",
    expectedOutputs: "Data saved and loaded correctly",
    evaluationChecklist: ["File created", "Data persists", "Validation works", "No crashes"],
    gitTask: "Commit file persistence changes",
    resourceLinks: [],
    tasks: [
      { id: "d19_handson", label: "Complete hands-on: Validations & file storage" },
      { id: "d19_coding", label: "Coding task: Save inventory to JSON" },
      { id: "d19_assignment", label: "Assignment: Input validation & auto-load data" },
      { id: "d19_git", label: "Git: Commit persistence changes" }
    ]
  },
  {
    day: 20,
    month: 1,
    week: 4,
    monthTitle: "Python",
    weekTitle: "Python Final Project",
    topic: "Inventory Management System (Complete Application)",
    handsOn: ["Combine all modules", "Test full flow"],
    example: "Final Inventory System",
    codingTask: "Ensure system supports: Add product, Update product, Sell product, View stock, Save & load from file.",
    assignment: "Finalize and polish the Inventory Management System.",
    explanation: "This is the first complete software project. It gives interns confidence that they can build a real application from scratch.",
    expectedInputs: "Product name, quantity, price",
    expectedOutputs: "Fully working inventory system",
    evaluationChecklist: ["All features work", "Data persists", "Code clean and structured", "No runtime errors"],
    gitTask: "Final commit for Month 1 project, Push to GitHub with proper README, Tag release v1.0-python-basics",
    resourceLinks: [],
    tasks: [
      { id: "d20_handson", label: "Complete hands-on: Test complete flow" },
      { id: "d20_coding", label: "Coding task: Complete Inventory Management System" },
      { id: "d20_assignment", label: "Assignment: Polish & finalize the system" },
      { id: "d20_git", label: "Git: Final commit, README, tag v1.0-python-basics" }
    ]
  }
];