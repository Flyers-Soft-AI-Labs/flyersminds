// Month 1: Python (Days 1-20)
export const month1 = [
  {
    day: 1,
    month: 1,
    week: 1,
    monthTitle: "Python",
    weekTitle: "Python Basics",
    topic: "Python Setup, Variables, Print, Input",
    overview: "Welcome to your first step in mastering Python. Today, we will transform your computer from a simple machine into a powerful workshop, learn how to store information in 'mental boxes,' and explore how to communicate with your programs.",
    content: [
      {
        heading: "1. Setting Up the Workshop",
        intro: "Before a carpenter can build a chair, they need a workbench and tools. Similarly, to write Python, we must install the language and choose an editor.",
        points: [
          { bold: "Installation:", text: "Use Python 3 — the modern standard. Download from python.org. During Windows installation, check 'Add Python to PATH' so your tools are always reachable." },
          { bold: "The Interactive Prompt:", text: "Type python in your terminal to open a live conversation where Python answers you one line at a time." },
          { bold: "Scripts and IDLE:", text: "For longer projects, create .py files. Python comes with a built-in editor called IDLE to write, save, and run entire scripts at once." },
          { bold: "Comments:", text: "Use the # symbol to write notes for yourself. These are invisible to the computer and serve as labels for your future self." }
        ]
      },
      {
        heading: "2. Variables: The Storage Containers",
        points: [
          { bold: "The Container Analogy:", text: "A variable is a labeled box. Writing x = 5 puts the value 5 into a box labeled x." },
          { bold: "Dynamic Nature:", text: "Variables in Python are flexible. You can change the contents at any time (e.g., changing x from 2 to 9) without redefining the type." },
          { bold: "The Underscore Trick:", text: "In the interactive shell, the underscore _ acts as memory of the very last output produced — useful for quick calculations." }
        ]
      },
      {
        heading: "3. Communicating: Input and Output",
        intro: "A program that doesn't talk to the user is like a silent waiter. We use specific functions to handle this dialogue.",
        points: [
          { bold: "The print() Function:", text: "This is how the program speaks. Customize how it separates items with sep, or how it ends the line with end." },
          { bold: "The input() Function:", text: "This is how the program listens. However, Python hears everything as text (a string)." },
          { bold: "Type Conversion:", text: "If you ask for a number to do math, you must convert the text to an integer using int() — otherwise Python will be confused, like trying to add the word 'ten' to the number 5." }
        ]
      },
      {
        heading: "4. Strings: Playing with Words",
        intro: "Strings are sequences of characters. They have unique rules that make them feel like a physical line of objects.",
        points: [
          { bold: "Indexing:", text: "Use square brackets [] to grab a specific letter. Python always starts counting at 0. In 'YouTube', the first character Y is at position 0." },
          { bold: "Negative Indexing:", text: "Count backward from the end using negative numbers. -1 represents the very last character." },
          { bold: "Slicing:", text: "Grab a portion using [start:end]. The start is included, but the end is exclusive — like cutting a piece of cake." },
          { bold: "Immutability:", text: "Once a string is created, you cannot change individual letters. Strings are 'cast in stone.' To modify one, you must create a brand-new string." }
        ]
      }
    ],
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
    overview: "Now that you have your workshop set up, it's time to look at the different types of 'materials' you'll be working with and the 'tools' you'll use to manipulate them. Knowing your data types is like a chef knowing the difference between a liquid and a solid — you can't process them the same way.",
    content: [
      {
        heading: "1. The Anatomy of Data: Data Types",
        intro: "Python organises data into several categories. Understanding these helps you avoid bugs — those horrifying little errors that can break your project.",
        points: [
          { bold: "None:", text: "Represents a variable that has been created but hasn't been assigned any value yet (similar to null in other languages)." },
          { bold: "Int (Integer):", text: "Whole numbers like 5 or 10." },
          { bold: "Float:", text: "Numbers with decimal points, like 2.5 or 5.6." },
          { bold: "Complex:", text: "Numbers with an imaginary part (e.g., 6 + 9j). Python uses j for the imaginary unit." },
          { bold: "Bool (Boolean):", text: "The logic of the computer — either True or False. Python treats True as 1 and False as 0 under the hood." },
          { bold: "List, Tuple, Set:", text: "Different ways to group multiple items together (sequence types)." },
          { bold: "Range:", text: "A clever tool to generate a sequence of numbers (e.g., range(0, 10)), often used for repetition." },
          { bold: "Dictionary (dict):", text: "Like a phone book — you look up data using a unique Key instead of a numbered index. Keys must be unique, but values can repeat." }
        ]
      },
      {
        heading: "2. The Toolbox: Operators",
        intro: "Operators are the symbols that perform actions on your data.",
        points: [
          { bold: "Arithmetic:", text: "The basics — +, -, *, /. Shortcut: instead of x = x + 2, write x += 2. Multiple assignment: a, b = 5, 6." },
          { bold: "Relational Operators:", text: "Compare two values and return True or False. == (equal), != (not equal), <, >, <=, >=. Note: a single = assigns, while == compares." },
          { bold: "and:", text: "Returns True only if both sides are true (like a security system needing both a key and a code)." },
          { bold: "or:", text: "Returns True if at least one side is true." },
          { bold: "not:", text: "Flips the result. not True becomes False." }
        ]
      }
    ],
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
    overview: "Today, we move beyond simple scripts and start giving your program a 'brain.' We will explore how your code can make decisions and how it can handle tedious, repetitive tasks without you having to write the same line twice.",
    content: [
      {
        heading: "1. Decision Making: If, Elif, and Else",
        intro: "Think of your program like a traveler at a fork in the road. Depending on certain conditions, it will choose one path or another.",
        points: [
          { bold: "The if Statement:", text: "The most basic decision. If a condition is True, the code inside the block executes." },
          { bold: "Indentation is Key:", text: "In Python, spaces (usually 4 or one Tab) tell the computer which lines belong to the if statement. Without proper indentation, Python won't know those lines are part of the decision." },
          { bold: "The else Statement:", text: "The 'Plan B.' If the if condition is False, the code in the else block will run." },
          { bold: "The elif (Else If) Statement:", text: "When you have more than two choices, use elif. It checks multiple conditions one after another until it finds a true one." },
          { bold: "Analogical Flow:", text: "It's like a grading system. If score > 90, grade A; elif score > 80, grade B; else grade C." }
        ]
      },
      {
        heading: "2. Repetition: The for Loop",
        intro: "Instead of writing the same print statement three times, you use a loop.",
        points: [
          { bold: "for Loop Basics:", text: "Repeats a block of code for every item in a sequence (like a list or range of numbers)." },
          { bold: "The range() Function:", text: "Creates a sequence of numbers. range(3) gives 0, 1, 2. range(1, 4) gives 1, 2, 3." },
          { bold: "Iterables:", text: "Loops don't just work with numbers. You can loop through strings (character by character) or lists (item by item). Any object you can step through is an iterable." }
        ]
      },
      {
        heading: "3. Advanced Loop Control",
        points: [
          { bold: "Nested Loops:", text: "A loop inside another loop — like a clock where the minute hand (inner loop) completes a full circle for every single tick of the hour hand (outer loop). Used for grids and coordinates." },
          { bold: "The break Statement:", text: "Exits a loop prematurely. If you're searching for a file and find it on the second try, you break to stop the loop from trying a third time." },
          { bold: "The else in Loops:", text: "A unique Python feature! An else block after a for loop runs only if the loop finished all its iterations naturally (i.e., it didn't hit a break)." }
        ]
      },
      {
        heading: "4. Mini-Exercise: Finding Even Numbers",
        points: [
          { bold: "Step 1:", text: "Use range(1, 10) to look at each number." },
          { bold: "Step 2:", text: "Use the Modulus operator (%) to check if the remainder is 0 when divided by 2." },
          { bold: "Step 3:", text: "If it is, print the number and increment a count variable." }
        ]
      }
    ],
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
    overview: "Today, we are going to learn how to add unpredictability to your programs. In the real world, things aren't always predictable — think of a rolling dice, a shuffled deck, or the random blocks in Tetris. To mimic this in code, we use Randomization.",
    content: [
      {
        heading: "1. The Concept of Modules",
        intro: "Imagine you want to drink coconut water. You don't need to plant a tree, wait years, and climb it yourself — you just go to the market and buy one. In Python, a Module is like that pre-packaged coconut. It's a file containing code written by other developers that you can import into your project.",
        points: [
          { bold: "import random:", text: "Brings the random module into your workshop. You must do this before using any random functions." },
          { bold: "Pseudo-random:", text: "These numbers are generated by the Mersenne Twister algorithm. They aren't truly random like a lightning strike, but they're perfect for games, simulations, and most programs." }
        ]
      },
      {
        heading: "2. Key Functions in the random Toolbox",
        points: [
          { bold: "random.randint(a, b):", text: "Generates a random integer between a and b — both a and b are included. e.g., randint(1, 6) simulates a die roll." },
          { bold: "random.randrange(a, b):", text: "Similar to randint, but b is excluded. randrange(1, 3) only gives 1 or 2." },
          { bold: "random.random():", text: "Returns a random float between 0.0 and 1.0 (1.0 is never actually reached)." },
          { bold: "random.uniform(a, b):", text: "Returns a random decimal number within a specific range, like between 1.5 and 5.5." },
          { bold: "random.choice(sequence):", text: "Like reaching into a bag and pulling one item out at random. Pass it a list or tuple." },
          { bold: "random.shuffle(sequence):", text: "Mixes up the entire sequence in place — like shuffling a deck of cards before a game." },
          { bold: "Pro-Tip:", text: "Always prefix these functions with the module name: random.randint(). If you just type randint(), Python won't know which toolbox it belongs to." }
        ]
      }
    ],
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
    overview: "Today, we are taking a leap from writing 'scripts' to building 'applications.' We will learn how to organise your code so that a user can interact with it through a menu. This is the foundation of almost all software: giving the user a list of options and responding to their choice.",
    content: [
      {
        heading: "1. What is a Menu-Driven Program?",
        intro: "Imagine walking into a cafe. You don't just stand there waiting for the barista to guess what you want — you look at a menu, pick a number, and they provide exactly that. A Menu-Driven Program follows the same logic: display options, capture choice, execute action.",
        points: [
          { bold: "The Display:", text: "Use print() to show the available options to the user." },
          { bold: "The Input:", text: "Use input() to capture the user's choice." },
          { bold: "The Logic:", text: "Use if-elif-else to match the choice to the correct action." },
          { bold: "The 'Invalid Input' Rule:", text: "Always assume the user might make a mistake. Use the final else block as a 'Catch-All' — like a polite waiter saying 'I'm sorry, that isn't on the menu.'" }
        ]
      },
      {
        heading: "2. The Developer's Guide to Common Pitfalls",
        points: [
          { bold: "Type Mismatch Trap:", text: "input() always returns a String. If you check if choice == 1:, it will always be False because the user typed '1' (text), not 1 (number). Fix: use int(input()) or check for the string version if choice == '1'." },
          { bold: "The Shadowing Error:", text: "Never name your script files the same as Python modules (random.py, math.py). When you try to import random, Python will try to import your own file instead." },
          { bold: "The Invisible Indentation Error:", text: "Mixing spaces and tabs or having one line out of alignment causes an IndentationError. Always use 4 spaces or one Tab consistently." },
          { bold: "Case Sensitivity:", text: "If your menu expects 'A' but the user types 'a', it falls into the else block. Fix with choice.lower() or choice.upper() to make your program case-insensitive." }
        ]
      }
    ],
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
    overview: "Up until now, our code has been like a long 'To-Do' list. If we needed to do the same task twice, we had to copy and paste. Functions solve this by letting us group code into a reusable package.",
    content: [
      {
        heading: "1. Defining a Function",
        intro: "To create a function, we use the def keyword (short for define).",
        points: [
          { bold: "The Header:", text: "def greet_user(): tells Python to remember this name and the code that follows it." },
          { bold: "The Body:", text: "Everything indented under the header is what happens when the function runs." },
          { bold: "The Call:", text: "Just defining a function does nothing. You have to 'call' it by typing its name with parentheses: greet_user()." }
        ]
      },
      {
        heading: "2. Parameters: Giving the Recipe Ingredients",
        intro: "A recipe for 'Cake' is better if you can choose the flavor. We use Parameters to pass information into a function.",
        points: [
          { bold: "The Analogy:", text: "The parameter (e.g., name) is a placeholder on a form. When you call the function, you fill that placeholder with an actual value — called an Argument." },
          { bold: "Example:", text: "def greet_person(name): print(f'Hello, {name}!') — calling greet_person('Alice') outputs: Hello, Alice!" }
        ]
      },
      {
        heading: "3. The return Statement: Getting a Result",
        intro: "Sometimes you don't want the function to just print something — you want it to calculate and give the result back.",
        points: [
          { bold: "print() vs return:", text: "print() just shows text on screen. return hands a value back to the main program so you can store it in a variable or use it in another calculation." },
          { bold: "The 'Exit' Rule:", text: "Once a function hits a return statement, it stops immediately. It's the 'final answer' of that function." }
        ]
      },
      {
        heading: "4. Why Use Functions?",
        points: [
          { bold: "DRY (Don't Repeat Yourself):", text: "If you find yourself copying and pasting code, it should probably be a function." },
          { bold: "Organisation:", text: "It's easier to read a program that says check_inventory() and process_payment() than 500 lines of raw math." },
          { bold: "Easy Debugging:", text: "If the 'Greeting' is broken, you only have to fix it in one place — inside the function." }
        ]
      }
    ],
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
    overview: "Until now, we've mostly worked with single variables — like a single box holding one value. Today, we're moving into Collections. Think of these as different types of storage units: a flexible warehouse, a locked safe, and a magic bag.",
    content: [
      {
        heading: "1. Lists: The Flexible Warehouse",
        intro: "A List is an ordered collection that can hold anything. You can add items, remove them, or change them whenever you like.",
        points: [
          { bold: "Syntax:", text: "Defined using square brackets []. Key characteristic: they are Mutable (changeable)." },
          { bold: ".append(item):", text: "Adds an item to the very end of the warehouse." },
          { bold: ".insert(index, item):", text: "Squeezes an item into a specific position." },
          { bold: ".remove(item):", text: "Finds the first instance of an item and removes it." },
          { bold: ".pop():", text: "Removes and returns the last item in the list." },
          { bold: ".sort():", text: "Organises the list alphabetically or numerically." }
        ]
      },
      {
        heading: "2. Tuples: The Locked Safe",
        intro: "A Tuple is almost exactly like a list, but with one major catch: once you put items in and close the door, you cannot change them.",
        points: [
          { bold: "Syntax:", text: "Defined using parentheses (). Key characteristic: they are Immutable." },
          { bold: "Why use them?", text: "They are faster than lists and safer for data that should never change, like the coordinates of a city or the RGB values of a colour." }
        ]
      },
      {
        heading: "3. Sets: The Magic Bag",
        intro: "A Set is a collection of unique items with no specific order. If you try to put a second 'Apple' into a set, the magic bag simply ignores it.",
        points: [
          { bold: "Syntax:", text: "Defined using curly braces {}. Key characteristic: no duplicates allowed, no fixed order (Unordered)." },
          { bold: ".add(item):", text: "Inserts a new unique item." },
          { bold: ".union(other_set):", text: "Combines two bags, keeping only one of each item." },
          { bold: ".intersection(other_set):", text: "Finds only the items that exist in both bags." },
          { bold: ".difference(other_set):", text: "Shows what is in the first bag but not the second." },
          { bold: "Pro-Tip — the in keyword:", text: "Quickly check if an item exists: if 'Milk' in shopping_list: — returns True or False." }
        ]
      },
      {
        heading: "4. Quick Comparison",
        points: [
          { bold: "List []:", text: "Ordered, Mutable, duplicates allowed. Best for a shopping list." },
          { bold: "Tuple ():", text: "Ordered, Immutable, duplicates allowed. Best for fixed data like coordinates." },
          { bold: "Set {}:", text: "Unordered, changeable, no duplicates. Best for storing unique IDs." }
        ]
      }
    ],
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
    overview: "Today, we are looking at two data structures that share the curly brace {} family but serve entirely different purposes: Dictionaries and Sets. They don't care about the order of your data — they care about relationships and uniqueness.",
    content: [
      {
        heading: "1. Dictionaries: The Digital Phonebook",
        intro: "Imagine finding a friend's number in your contacts. You don't scroll through and say 'John is the 45th person in my list' — you search by name. A Dictionary works exactly like this. Instead of a numbered index, you use a unique Key to retrieve a specific Value.",
        points: [
          { bold: "Syntax:", text: "Defined using curly braces with a colon: {\"name\": \"Alice\", \"age\": 25}. Keys must be unique, but values can be anything." },
          { bold: ".get(key):", text: "The safest way to look something up. If the key doesn't exist, it returns None instead of crashing your program." },
          { bold: ".keys():", text: "Returns a view of all labels (keys) in your dictionary." },
          { bold: ".values():", text: "Returns all the actual data (values) in your dictionary." },
          { bold: ".items():", text: "Returns everything — pairing each key with its value, perfect for looping." },
          { bold: "Adding/Updating:", text: "No special method needed. Write my_dict['new_key'] = 'value'. If the key exists, it updates it; if not, it creates it." }
        ]
      },
      {
        heading: "2. Sets: The VIP Guest List",
        intro: "A Set is a collection of unique items. If 'Bob' is already on the VIP list, writing 'Bob' again doesn't add a second Bob — the set automatically rejects duplicates.",
        points: [
          { bold: "Syntax:", text: "Defined using curly braces with individual items: {\"apple\", \"banana\", \"orange\"}." },
          { bold: ".union(other_set) or |:", text: "Combines two sets with no duplicates. (Who is invited to Party A or Party B?)" },
          { bold: ".intersection(other_set) or &:", text: "Finds items that exist in both sets. (Who is invited to both Party A and Party B?)" },
          { bold: ".difference(other_set) or -:", text: "Shows what's in the first set but not the second. (Who is at Party A, but not Party B?)" }
        ]
      },
      {
        heading: "3. Dictionary vs Set — Quick Comparison",
        points: [
          { bold: "Dictionary {key: value}:", text: "Maps a label to data. Access by key. Values can duplicate, keys cannot." },
          { bold: "Set {item}:", text: "Stores unique items. Cannot access by position. No duplicates at all." }
        ]
      }
    ],
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
    overview: "Strings are sequences of characters and they are immutable — cast in stone. Because you cannot change a string once it's created, Python provides a massive toolbox of String Methods. Think of them like a smart photocopier: they read your original string and instantly print a brand-new, modified version.",
    content: [
      {
        heading: "1. Formatting: Changing the Case",
        intro: "Often, user input is messy. Someone might type their name as 'aLiCe' instead of 'Alice.' These tools help you standardise text.",
        points: [
          { bold: ".upper():", text: "Converts every letter to uppercase. e.g., 'hello'.upper() → 'HELLO'." },
          { bold: ".lower():", text: "Converts every letter to lowercase. Perfect for checking user input regardless of capitalisation." },
          { bold: ".title():", text: "Capitalises the first letter of every word. e.g., 'lord of the rings'.title() → 'Lord Of The Rings'." }
        ]
      },
      {
        heading: "2. Cleaning and Swapping: The Eraser",
        points: [
          { bold: ".strip():", text: "Removes whitespace from the beginning and end of a string. ' yes '.strip() → 'yes'. Essential for cleaning user input." },
          { bold: ".replace(old, new):", text: "Searches and swaps text. e.g., 'I love apples'.replace('apples', 'bananas') → 'I love bananas'." }
        ]
      },
      {
        heading: "3. Analysing: The Magnifying Glass",
        intro: "When you need to find out what's inside a string, use these methods. They report back without changing the string.",
        points: [
          { bold: ".count(substring):", text: "Tells you exactly how many times a character or word appears." },
          { bold: ".find(substring):", text: "Tells you the index (position) where a word starts. Returns -1 safely if not found." },
          { bold: ".startswith() / .endswith():", text: "Returns True or False. Incredibly useful for checking file extensions like file.endswith('.py')." }
        ]
      },
      {
        heading: "4. Splitting and Joining: Scissors and Glue",
        intro: "These two methods are the bridge between Strings and Lists.",
        points: [
          { bold: ".split(separator):", text: "The Scissors. Cuts a string into a List of smaller strings. 'Python is fun'.split() → ['Python', 'is', 'fun']." },
          { bold: ".join(list):", text: "The Glue. Joins a List of strings back together. '-'.join(['A', 'B', 'C']) → 'A-B-C'." }
        ]
      }
    ],
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
    overview: "Today, the training wheels come off. Instead of learning a new isolated concept, you are going to put on your 'Software Engineer' hat and build a complete, working application from scratch: a Digital Contact Book. You aren't following a recipe — you are cooking the meal yourself.",
    content: [
      {
        heading: "The Objective",
        points: [
          { bold: "Goal:", text: "Build a menu-driven program that runs continuously until the user specifically chooses to exit." }
        ]
      },
      {
        heading: "The Requirements",
        points: [
          { bold: "Add a Contact:", text: "Ask the user for a name and a phone number, and save them together." },
          { bold: "View Contacts:", text: "Display a clean list of everyone currently saved in your book." },
          { bold: "Update a Contact:", text: "Look up an existing name and change their saved phone number to a new one." },
          { bold: "Delete a Contact:", text: "Completely remove a person and their details from the book." }
        ]
      },
      {
        heading: "Your Toolkit (Hints)",
        points: [
          { bold: "The Container:", text: "Which data type is best for pairing a unique Key (like a name) to a specific Value (like a phone number)?" },
          { bold: "The Flow:", text: "How do you keep a program running forever until a specific condition breaks it?" },
          { bold: "The Menu:", text: "How did we capture a user's choice and direct them to the right action on Day 5?" },
          { bold: "Remember:", text: "Building a project is a puzzle. Don't be afraid to make mistakes, get errors, and try again. That is exactly what real developers do every single day!" }
        ]
      }
    ],
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
    overview: "Up to this point, we have been writing code like a recipe: a top-to-bottom list of instructions. Today, we are stepping into a completely different paradigm called Object-Oriented Programming (OOP). Instead of just writing lists of tasks, we are going to start building digital models of real-world things.",
    content: [
      {
        heading: "1. The Core Analogy: The Blueprint and the House",
        points: [
          { bold: "The Class (The Blueprint):", text: "The drawing itself isn't a house. You can't sleep in it or open its doors. It is simply a template or set of rules. In Python, this is a Class." },
          { bold: "The Object (The Actual House):", text: "When a construction crew uses your blueprint to build a physical home, that home is the Object (also called an Instance)." },
          { bold: "Multiple Instances:", text: "You can build dozens of houses from one blueprint. Each is its own distinct entity. Painting one house blue doesn't affect the others." }
        ]
      },
      {
        heading: "2. Creating a Class",
        intro: "Use the class keyword. By convention, class names always start with a Capital letter (PascalCase).",
        points: [
          { bold: "class Robot: pass", text: "Defines an empty blueprint. pass is a temporary placeholder that tells Python 'I haven't written this part yet, but please don't crash.'" },
          { bold: "Instantiation:", text: "my_robot = Robot() — this builds an actual object from the blueprint. my_robot and your_robot are two separate, living objects in memory." }
        ]
      },
      {
        heading: "3. What is Inside an Object?",
        points: [
          { bold: "Attributes (State/Data):", text: "What the object has or knows. For a robot: name, colour, battery_level. These are essentially variables that live inside the object." },
          { bold: "Methods (Behaviour/Actions):", text: "What the object does. For a robot: walk(), speak(), recharge(). These are functions that belong to the object." }
        ]
      },
      {
        heading: "4. Procedural vs Object-Oriented",
        points: [
          { bold: "Procedural (Days 1–10):", text: "Focus on step-by-step actions. Data stored in loose variables. Actions are standalone functions." },
          { bold: "Object-Oriented (Day 11+):", text: "Focus on bundling data and actions together. Data stored inside Objects as Attributes. Actions attached to Objects as Methods." }
        ]
      }
    ],
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
    overview: "Yesterday, we learned how to create blueprints (Classes) for our objects. But what if you want to build a new type of house that is almost exactly like the first one, but with an added garage? Instead of drawing a brand-new blueprint from scratch, you use the original design and just add the extra parts. In OOP, this powerful concept is called Inheritance.",
    content: [
      {
        heading: "1. What is Inheritance?",
        intro: "Inheritance allows a new class to automatically pick up the attributes and methods of an existing class — like genetics. You might inherit your hair colour from your parents, but still choose your own unique haircut.",
        points: [
          { bold: "Parent Class (Superclass):", text: "The original, more general blueprint." },
          { bold: "Child Class (Subclass):", text: "The new, more specific blueprint that inherits from the parent." }
        ]
      },
      {
        heading: "2. The Syntax: Creating the Family Tree",
        intro: "To inherit, put the Parent class name in parentheses after the Child class name.",
        points: [
          { bold: "class Drone(Robot):", text: "Drone inherits everything from Robot. To add a new method, simply define it inside Drone." },
          { bold: "Example:", text: "my_drone = Drone() — my_drone.turn_on() uses Robot's method; my_drone.fly() uses Drone's own method." }
        ]
      },
      {
        heading: "3. The Power of Reusability (DRY)",
        points: [
          { bold: "Don't Repeat Yourself:", text: "Because Drone inherits turn_on() from Robot, we don't need to rewrite it. If we later create Submarine(Robot), it also gets turn_on() for free." },
          { bold: "Inherited Method:", text: "An action passed down automatically from the parent. Example: turn_on()." },
          { bold: "Unique Method:", text: "An action belonging only to the child class. Example: fly() for Drone." }
        ]
      }
    ],
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
    overview: "Up until now, everything we've built has lived in the computer's temporary memory (RAM). The moment you close your program, all that data vanishes like writing on a whiteboard. Today, we are learning how to write in ink — using File I/O to read from and write to permanent files on your hard drive.",
    content: [
      {
        heading: "1. The Core Analogy: The Filing Cabinet",
        intro: "Think of your hard drive as a massive filing cabinet. To read or change a document, you have to walk over, open a specific drawer, take the file out, read or write on it, and then put it back and close the drawer. Python handles files the exact same way.",
        points: []
      },
      {
        heading: "2. The Access Modes: Choosing Your Pen",
        intro: "When you open a file using open(), you must pass an Access Mode to tell Python your intentions.",
        points: [
          { bold: "'r' (Read):", text: "The default mode. You can read the text but cannot change it. If the file doesn't exist, Python throws an error." },
          { bold: "'w' (Write):", text: "The destructive mode. Completely wipes the file clean before writing your new text. If the file doesn't exist, Python creates a new blank one." },
          { bold: "'a' (Append):", text: "The safe addition mode. Opens the file and jumps to the very last line. Anything you write is added to the end, leaving old data intact." }
        ]
      },
      {
        heading: "3. The with Statement: The Self-Closing Drawer",
        intro: "Normally you must type .close() when done with a file. Forgetting this can cause memory leaks or corrupted files. The with keyword (Context Manager) handles this automatically.",
        points: [
          { bold: "with open('notes.txt', 'a') as my_file:", text: "As soon as the indented block of code finishes, the drawer snaps shut automatically. No .close() needed!" }
        ]
      },
      {
        heading: "4. JSON: The Universal Shipping Container",
        intro: "If you try to save a dictionary as normal text, Python loses its structure and reads it back as a useless string. JSON (JavaScript Object Notation) solves this.",
        points: [
          { bold: "The Flat-Pack Analogy:", text: "JSON is like an IKEA instruction manual. It dismantles your Python dictionary into a flat-pack text format, pushes it through the 'mail slot' (a .json file), and perfectly reassembles it back into a working dictionary on the other side." },
          { bold: "json.dump(data, file):", text: "The Packer. Takes your Python data and writes it into the open file." },
          { bold: "json.load(file):", text: "The Unpacker. Reads a JSON file and translates it back into a usable Python dictionary or list." },
          { bold: "Remember:", text: "Always import json at the top of your file before using these functions." }
        ]
      }
    ],
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
    overview: "Until now, if our program encountered a problem — like a user typing a letter when we asked for a number — the whole application would instantly crash. Today, we learn how to prevent those crashes using Exception Handling.",
    content: [
      {
        heading: "1. The Core Analogy: The Flat Tyre",
        points: [
          { bold: "Syntax Error:", text: "Like trying to drive a car with a missing engine — it won't even start." },
          { bold: "Exception:", text: "Like getting a flat tyre while already driving. The car was running fine, but an unexpected event occurred. Instead of abandoning the car on the highway (crashing the program), a good driver pulls over, puts on the spare tyre, and continues. Exception handling is your program's spare tyre." }
        ]
      },
      {
        heading: "2. The try and except Blocks",
        intro: "Wrap your 'risky' code inside a try block. If everything goes smoothly, Python skips the except block. If an error occurs inside try, Python immediately jumps to the except block to execute your backup plan.",
        points: [
          { bold: "ZeroDivisionError:", text: "Caught when the user tries to divide by zero." },
          { bold: "ValueError:", text: "Caught when the user types a letter instead of a number." },
          { bold: "Be specific:", text: "You wouldn't fix an empty gas tank by changing the tyre. Use specific except types to give the user accurate, helpful feedback." }
        ]
      },
      {
        heading: "3. Expanding the Net: else and finally",
        points: [
          { bold: "try:", text: "Always runs first. Contains the risky code. Analogy: driving down the highway." },
          { bold: "except:", text: "Only runs if an error occurs in try. Analogy: pulling over to fix a flat tyre." },
          { bold: "else:", text: "Only runs if the try block succeeded with no errors. Analogy: arriving at the destination smoothly." },
          { bold: "finally:", text: "Always runs regardless of success or failure. Used for cleanup tasks like closing files or logging out of a database. Analogy: turning off the engine and locking the doors." }
        ]
      }
    ],
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
    overview: "Today is your second major milestone. We are going to take the CRUD operations (Create, Read, Update, Delete) you practised in Day 10 and upgrade them using the Object-Oriented Programming concepts we learned in Days 11 and 12. You are going to build a Student Management System.",
    content: [
      {
        heading: "1. The Core Analogy: The Administration Office",
        points: [
          { bold: "The Student Class:", text: "The blank enrollment form (the blueprint). Every student must have a name, a roll number, and a grade." },
          { bold: "The Student Object:", text: "When a new person enrolls, you fill out the form. That specific, filled-out form is the object." },
          { bold: "The ManagementSystem Class:", text: "The actual filing cabinet and secretary combined. It holds all the student forms and has specific actions (methods) to manage them." }
        ]
      },
      {
        heading: "2. The Blueprint: Your Two Classes",
        intro: "Split your code into two distinct classes to keep data organised and code clean.",
        points: [
          { bold: "Class 1 — Student (The Data):", text: "Attributes: name, roll_number, age — set up using __init__. Methods: display_info() to print details nicely." },
          { bold: "Class 2 — System (The Manager):", text: "Attributes: a container like self.student_list = [] to hold all students. Methods: add (Create), view (Read), update, delete." }
        ]
      },
      {
        heading: "3. OOP meets CRUD",
        points: [
          { bold: "Create:", text: "Takes user input and makes a new Student object (Instantiation: Student(name, id))." },
          { bold: "Read:", text: "Loops through the database to show everyone (Method Calling: student.display())." },
          { bold: "Update:", text: "Modifies an existing student's data (Attribute Assignment: student.grade = 'A')." },
          { bold: "Delete:", text: "Removes the student object from the list or dictionary." }
        ]
      }
    ],
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
