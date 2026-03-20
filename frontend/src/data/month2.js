// Month 2: FastAPI (Days 21-40)
const m2Tasks = (d, labels) => labels.map((l, i) => ({ id: `d${d}_t${i}`, label: l }));

export const month2 = [
  {
    day: 21,
    month: 2,
    week: 5,
    monthTitle: "FastAPI",
    weekTitle: "FastAPI Basics",
    topic: "Introduction to FastAPI, APIs & HTTP Methods",
    overview: "Welcome to Month 2! Today, we are diving into the world of FastAPI, a modern and highly performant web framework designed specifically for building APIs (Application Programming Interfaces) with Python.",
    content: [
      {
        heading: "What is FastAPI?",
        intro: "To understand how FastAPI works, imagine you are opening a brand-new restaurant. To make it successful, you need a kitchen that is incredibly fast, easy to manage, and capable of handling multiple orders at the same time without getting overwhelmed. In the Python ecosystem, FastAPI is that ultra-efficient kitchen.",
        points: [
          { bold: "Asynchronous by Default:", text: "In our restaurant analogy, 'asynchronous' means your chef doesn't stand around doing nothing while waiting for a pot of water to boil; instead, they start chopping vegetables for the next order. This allows FastAPI to handle many concurrent requests smoothly right out of the box." }
        ]
      },
      {
        heading: "Setting Up Your \"Kitchen\"",
        intro: "Before we can start taking orders, we need to install our tools. Open your terminal and run the necessary commands to install two essential packages:",
        points: [
          { bold: "FastAPI:", text: "This is the framework itself — the recipes, the kitchen layout, and the rules of the restaurant." },
          { bold: "Uvicorn:", text: "This is an ASGI (Asynchronous Server Gateway Interface) server. If FastAPI is the kitchen, Uvicorn is the actual building and the waitstaff that takes requests from the outside world and hands them to the kitchen." }
        ]
      },
      {
        heading: "Your First Application",
        intro: "In your main.py file, you will import FastAPI, initialize your app, and create your first route. A route is simply a specific URL path that users can visit.",
        points: [
          { bold: "app = FastAPI():", text: "Initializes your application." },
          { bold: "@app.get(\"/\"):", text: "Called a decorator. It tells FastAPI that whenever a user visits the root directory (represented by /), it should trigger the function directly below it. It specifically listens for a GET request." },
          { bold: "JSON Response:", text: "The function returns a simple Python dictionary, which FastAPI automatically converts into JSON (the standard format for sending data over the web)." },
          { bold: "uvicorn main:app --reload:", text: "The --reload flag acts like a kitchen that instantly updates its menu the moment you change a recipe in your code — no manual server restarts required!" }
        ]
      },
      {
        heading: "Taking Orders: Routing and Parameters",
        points: [
          { bold: "Path Parameters:", text: "If a user wants to view a specific item, we can capture variables directly from the URL path using curly braces, like /items/{item_id}. FastAPI will extract that value and pass it directly into your Python function as a variable." },
          { bold: "Query Parameters:", text: "Users can pass extra instructions at the end of the URL, like ?limit=3. If you use Python type hints to specify that limit should be an int, FastAPI automatically converts the incoming URL string into a proper integer for you!" }
        ]
      },
      {
        heading: "Handling Errors Gracefully",
        intro: "What happens if a customer asks for item number 3, but your database only has two items? By default, the app will crash and throw a vague 'Internal Server Error.' This is like the kitchen catching on fire just because a customer ordered something off-menu.",
        points: [
          { bold: "HTTPException:", text: "By importing this from FastAPI, we can explicitly raise a 404 Not Found status code inside our code if the item doesn't exist. This clearly communicates to the client: 'We understand your request, but the item you are looking for does not exist here.'" }
        ]
      },
      {
        heading: "Structuring Data with Pydantic",
        intro: "When users want to add new items to our server (usually via a POST request), relying on simple text strings isn't enough. FastAPI relies heavily on a library called Pydantic.",
        points: [
          { bold: "BaseModel:", text: "By importing BaseModel from Pydantic, you can create a Python class that strictly defines the structure of your data. Think of a Pydantic model as a strict Order Form — if a customer forgets a mandatory field, the waiter (FastAPI) rejects it immediately with a helpful error message." },
          { bold: "response_model:", text: "You can also use these models as a response_model in your decorators, guaranteeing that your API always sends back data in a strict, predictable format." }
        ]
      },
      {
        heading: "The Magic of Interactive Documentation",
        points: [
          { bold: "Swagger UI (/docs):", text: "One of the absolute best features of FastAPI is that it generates beautiful, interactive documentation entirely for free. Navigate to /docs on your running server to see all your endpoints, their required parameters, and the shape of the data. You can click 'Try it out' to send actual requests and see responses right in your browser." },
          { bold: "ReDoc (/redoc):", text: "An alternative, cleaner documentation layout also available on your running server." }
        ]
      },
      {
        heading: "FastAPI vs. The Old Guard",
        points: [
          { bold: "Flask:", text: "Has been around longer and has a massive community, but doing modern things like automatic data validation and utilizing type hinting requires extra plugins." },
          { bold: "Django:", text: "Incredibly powerful and comes with everything built-in, but it is considered a 'heavyweight' framework which might be overkill for a simple API." },
          { bold: "FastAPI:", text: "Strikes a beautiful balance. It is lightweight, remarkably easy to write, natively supports modern Python features, and its asynchronous nature makes it blazingly fast." }
        ]
      }
    ],
    handsOn: ["Install FastAPI and Uvicorn", "Create first FastAPI project", "Run server", "Open Swagger UI"],
    example: "Hello World API",
    codingTask: "Create a simple FastAPI app with one GET endpoint returning a welcome message.",
    assignment: "Extend API to return your name and internship title.",
    explanation: "Interns understand how APIs work, how FastAPI starts, and how JSON responses are returned.",
    resourceLinks: [{ title: "FastAPI Introduction", url: "https://youtu.be/iWS9ogMPOI0?si=DrHaL00p3PKiHF6P" }],
    evaluationChecklist: ["FastAPI server runs", "Swagger UI opens", "Correct JSON response", "Clean project structure"],
    gitTask: "Create new repo fastapi-basics, Commit Hello World API",
    tasks: m2Tasks(21, ["Review learning resources", "Complete hands-on: Install FastAPI & Uvicorn", "Coding task: Hello World API endpoint", "Assignment: Add name & title endpoint", "Git: Create repo, commit API"])
  },
  {
    day: 22,
    month: 2,
    week: 5,
    monthTitle: "FastAPI",
    weekTitle: "FastAPI Basics",
    topic: "Routing & Path Parameters",
    overview: "Welcome back! Yesterday, we built our first FastAPI application and created basic routes. Today, we are taking a massive leap forward by learning how to make those routes dynamic and how to handle things professionally when a user makes a mistake.",
    content: [
      {
        heading: "The Library Analogy",
        intro: "To understand today's concepts, imagine your API is a massive public library.",
        points: [
          { bold: "Path Parameters:", text: "Are the precise coordinates to a specific book (e.g., 'Aisle 3, Shelf B'). They pinpoint the exact resource you want." },
          { bold: "Query Parameters:", text: "Are the filters you hand to the librarian (e.g., 'Only show me books in English'). They refine or filter the data." }
        ]
      },
      {
        heading: "Path Parameters",
        intro: "Path parameters are dynamic variables embedded directly into the URL path. They are essential when you want to retrieve a specific item, like a single blog post or a specific user profile. To create a path parameter, you wrap a variable in curly braces {} within your route decorator.",
        points: [
          { bold: "Type Hinting & Conversion:", text: "By declaring user_id: int in the function signature, FastAPI automatically converts the text from the URL into an actual integer." },
          { bold: "Automatic Validation:", text: "If a user tries to visit /users/hello instead of /users/1, FastAPI acts like a strict bouncer. It immediately rejects the request and returns a 422 Unprocessable Content error, telling the client exactly what went wrong — without you writing a single line of validation code!" }
        ]
      },
      {
        heading: "Query Parameters",
        intro: "Unlike path parameters, query parameters are appended to the end of a URL after a question mark ?. You use them to filter, sort, or modify the data returned by an endpoint. If you define a parameter in your Python function that is not included in the route's path, FastAPI automatically assumes it is a query parameter.",
        points: [
          { bold: "Optional Parameters:", text: "Give a parameter a default value of None to make it optional. If the user doesn't provide it, the application will still run perfectly without crashing." },
          { bold: "Combining Both:", text: "You can easily combine path and query parameters in a single route for highly flexible APIs (e.g., @app.get('/users/{user_id}/details') with an optional include_email: bool = False query parameter)." }
        ]
      },
      {
        heading: "Handling Errors Professionally",
        intro: "What happens if a user navigates to /posts/99, but your database only has two posts? A common beginner mistake is to manually return a dictionary like {\"error\": \"Post not found\"}. The problem is that behind the scenes, your server is still sending an HTTP 200 OK status code — bad practice.",
        points: [
          { bold: "HTTPException:", text: "Raise this with a status_code (like status.HTTP_404_NOT_FOUND) and a detail message. FastAPI gracefully stops the function and sends the proper status code back to the client." },
          { bold: "Using the status module:", text: "Import status from FastAPI so your code becomes incredibly readable. You don't have to memorize numeric codes like 404." }
        ]
      },
      {
        heading: "Advanced: Separating API Errors from Web Browser Errors",
        intro: "As your application grows, you might serve both raw JSON data (for API clients) and visual HTML templates (for regular users). An API client should get a JSON 404 error, but a human clicking a broken link should see a nicely designed HTML page.",
        points: [
          { bold: "Exception Handlers:", text: "FastAPI allows you to handle exceptions globally using the @app.exception_handler decorator. Inside the handler, check request.url.path.startswith('/api') to decide whether to return JSON or an HTML TemplateResponse." },
          { bold: "RequestValidationError:", text: "You can apply the same logic to catch the automatic 422 errors, creating a wonderful separation of concerns." }
        ]
      }
    ],
    handsOn: ["Create multiple endpoints", "Use path parameters"],
    example: "Student Information API",
    codingTask: "Create an endpoint that returns student data based on ID.",
    assignment: "Add error handling if student ID not found.",
    explanation: "Shows how APIs handle dynamic inputs from URLs.",
    resourceLinks: [{ title: "Path Parameters", url: "https://youtu.be/6uN6GxMwzVI?si=RtbJq-iyo0j7qx_u" }, { title: "Routing", url: "https://youtu.be/WRjXIA5pMtk?si=CuoaQQ_C2uwI-UbT" }],
    evaluationChecklist: ["Path parameter works", "Correct response", "Invalid ID handled"],
    gitTask: "Commit student API",
    tasks: m2Tasks(22, ["Review learning resources", "Complete hands-on: Multiple endpoints & path params", "Coding task: Student data endpoint by ID", "Assignment: Error handling for invalid IDs", "Git: Commit student API"])
  },
  {
    day: 23,
    month: 2,
    week: 5,
    monthTitle: "FastAPI",
    weekTitle: "FastAPI Basics",
    topic: "Query Parameters",
    overview: "When building web applications, we often need to send extra bits of information to the server. This is where query parameters come in. Think of the main URL path as the address of a building — query parameters are like special, optional instructions written on the envelope for the person inside.",
    content: [
      {
        heading: "Query Parameter Format",
        points: [
          { bold: "Starting with ?:", text: "Query parameters always start with a question mark ? to signal the beginning of the parameters (e.g., ?p=1)." },
          { bold: "Chaining with &:", text: "If you have more than one parameter, chain them together using an ampersand & (e.g., ?p=1&q=neat)." },
          { bold: "Key=Value Pairs:", text: "They are always written as key=value pairs. The server reads these values to filter results, change settings, or perform calculations." }
        ]
      },
      {
        heading: "The Power Operator (**)",
        intro: "The power operator allows you to calculate exponents. In mathematics, if you want to calculate '2 to the power of 3' (which is 2 × 2 × 2), you use a superscript number. In Python, we represent this using two asterisks: **.",
        points: [
          { bold: "Syntax:", text: "result = 2 ** 3 gives you 8. It is a clean, efficient way to calculate rapid, exponential scaling without writing out 2 * 2 * 2." },
          { bold: "Paper Folding Analogy:", text: "0 folds = 1 layer (2^0), 1 fold = 2 layers (2^1), 2 folds = 4 layers (2^2), 3 folds = 8 layers (2^3). Asking for the thickness after 5 folds is as simple as 2 ** 5 = 32." }
        ]
      },
      {
        heading: "The Modulus Operator (%)",
        intro: "The modulus operator is represented by the percent sign %. While it looks like a percentage sign, it has absolutely nothing to do with percentages in Python. Instead, modulus returns the remainder of a division problem.",
        points: [
          { bold: "Pizza Analogy:", text: "You have 10 slices of pizza, splitting them among 3 friends. Each friend gets 3 whole slices (9 total), and 1 slice is left over. Therefore, 10 % 3 = 1." },
          { bold: "Checking Even or Odd:", text: "If you divide any integer by 2 and the remainder is 0, the number is even. If the remainder is 1, it is odd (14 % 2 == 0 vs 15 % 2 == 1)." },
          { bold: "Clock Arithmetic:", text: "It is 10:00 AM and you want to know the time 5 hours from now. 10 + 5 = 15, but there is no 15:00 on a 12-hour clock. Use modulus: 15 % 12 = 3. The time will be 3:00 PM." }
        ]
      },
      {
        heading: "Tying It All Together",
        intro: "How might query parameters and mathematical operators cross paths in the real world? Imagine you built a FastAPI application that calculates remainders for users to help them split bills or items.",
        points: [
          { bold: "Real-World Example:", text: "A user might visit /calculate?pizza_slices=10&friends=3. Your server extracts those query parameters (10 and 3), uses the modulus operator (10 % 3) in the backend Python code, and neatly returns a result letting them know there is 1 slice left over." }
        ]
      }
    ],
    handsOn: ["Use query parameters", "Read values from URL"],
    example: "Calculator API",
    codingTask: "Create calculator API using query params.",
    assignment: "Add support for power and modulus operations.",
    explanation: "Teaches flexible input handling in APIs.",
    resourceLinks: [{ title: "Query Parameters", url: "https://youtu.be/qv5XK91OhFo?si=7Vo_EJEzJ6RhuqXs" }],
    evaluationChecklist: ["Query parameters parsed", "All operations work", "Division by zero handled"],
    gitTask: "Commit calculator API",
    tasks: m2Tasks(23, ["Review learning resources", "Complete hands-on: Query parameters", "Coding task: Calculator API with query params", "Assignment: Add power & modulus operations", "Git: Commit calculator API"])
  },
  {
    day: 24,
    month: 2,
    week: 5,
    monthTitle: "FastAPI",
    weekTitle: "FastAPI Basics",
    topic: "Request Body & Pydantic Models",
    overview: "Python is beloved by developers for being incredibly easy to read and write. Part of this ease comes from 'dynamic typing' — you don't have to declare what kind of data a variable holds. However, as your application grows, this flexibility becomes a massive liability.",
    content: [
      {
        heading: "The Problem with Dynamic Typing",
        intro: "Imagine you have a box in your code labeled user_age. You expect it to contain a number (like 24), so your code later tries to perform math on it. But what if another part of your program accidentally slipped the text string 'twenty-four' into that box? Your program will crash the moment it tries to do math with a word.",
        points: [
          { bold: "Hard to Debug:", text: "This is incredibly hard to debug because the failure happens far away from where the mistake was actually made." }
        ]
      },
      {
        heading: "The Solution: Pydantic's BaseModel",
        intro: "To fix this problem, the Python ecosystem introduced Pydantic, an external data validation library that FastAPI heavily relies upon. Think of Pydantic as a strict, highly efficient bouncer at the VIP door of your application — it checks the data's ID, and if it doesn't match the strict rules you set, it rejects it immediately.",
        points: [
          { bold: "Type Hinting and Autocomplete:", text: "Your code editor now knows exactly what an Item is. If you type item., your editor will instantly suggest name, description, price, and tax. You don't have to memorize your database structure!" },
          { bold: "Automatic Validation:", text: "If a client tries to create an Item but passes 'free' as the price instead of a float number, Pydantic immediately throws a highly descriptive validation error. Your app fails early and safely." },
          { bold: "Optional Fields:", text: "Notice the str | None = None syntax? This tells Pydantic that the field is optional. If the user doesn't provide it, it gracefully defaults to None without crashing." }
        ]
      },
      {
        heading: "Receiving Data: The Request Body",
        intro: "In previous lessons, we learned how to get data from the URL using Path Parameters and Query Parameters. But what if a user is filling out a massive form with dozens of fields? Passing all that information in a URL is messy, limited in size, and insecure. Instead, clients send this data inside a Request Body (usually via POST, PUT, or PATCH HTTP methods).",
        points: [
          { bold: "Using Pydantic Models:", text: "You simply pass the Pydantic model into your route function as an argument. FastAPI automatically intercepts the JSON payload, hands it to Pydantic for validation, and passes the perfectly structured object directly into your function." },
          { bold: "Automatic 422 Error:", text: "If the user forgot to include a required field, FastAPI automatically sends them a helpful HTTP 422 error detailing exactly what they missed." }
        ]
      },
      {
        heading: "Combining Path, Query, and Body Parameters",
        intro: "The true magic of FastAPI is how seamlessly it allows you to combine all three methods of receiving data into a single, cohesive endpoint.",
        points: [
          { bold: "FastAPI's Intelligence:", text: "FastAPI knows exactly where to look for each piece of data: it sees item_id matches the URL path (Path Parameter), it sees item is a Pydantic model (Request Body), and it sees q is a simple string not in the path (Query Parameter)." },
          { bold: "Zero Parsing Logic:", text: "With just a few lines of code, you have built a highly secure, self-documenting, and fully validated API endpoint without writing complex parsing logic." }
        ]
      }
    ],
    handsOn: ["Create Pydantic model", "Accept POST request"],
    example: "User Registration API",
    codingTask: "Create POST endpoint for user registration.",
    assignment: "Add validation for email and password length.",
    explanation: "Introduces request body validation and clean API design.",
    resourceLinks: [{ title: "Pydantic Model", url: "https://youtu.be/XIdQ6gO3Anc?si=kQ7w1S4ApJuu_hbX" }, { title: "Request Body", url: "https://youtu.be/DKZqznzGZe0?si=Ef7N8ary_WDkfTfy" }],
    evaluationChecklist: ["Validation works", "Password not returned", "Clean response"],
    gitTask: "Commit registration API",
    tasks: m2Tasks(24, ["Review learning resources", "Complete hands-on: Pydantic models & POST", "Coding task: User registration endpoint", "Assignment: Email & password validation", "Git: Commit registration API"])
  },
  {
    day: 25,
    month: 2,
    week: 5,
    monthTitle: "FastAPI",
    weekTitle: "FastAPI Basics",
    topic: "Mini Project: Notes API (In-memory CRUD)",
    overview: "Welcome to Day 25! Today is a milestone day. There are no new theoretical concepts to digest; instead, you are stepping into the shoes of a real backend developer to synthesize everything you have learned this week into a single, fully functional application. Your objective is to translate that conceptual knowledge into a working FastAPI backend by building a Notes API.",
    content: [
      {
        heading: "The \"In-Memory\" Concept",
        intro: "Your goal today is to build this API entirely 'in-memory.' Normally, an API saves data to a persistent database. However, connecting a database adds a layer of complexity that we don't need just yet.",
        points: [
          { bold: "Whiteboard Analogy:", text: "An in-memory database is like writing your notes on a classroom whiteboard. It is incredibly fast and perfectly suited for the task at hand. However, the moment you stop and restart your FastAPI server, the whiteboard is wiped completely clean, and your data is gone." },
          { bold: "Why In-Memory First?:", text: "It is the perfect playground for testing the mechanics of your API routes before we introduce permanent storage later on. Use a standard Python list or dictionary at the top of your main.py file to hold your notes." }
        ]
      },
      {
        heading: "Your Architectural Blueprint",
        intro: "To tackle this project smoothly, follow this sequence:",
        points: [
          { bold: "1. Define Your Pydantic Model:", text: "Create a Note class that inherits from BaseModel with attributes like id (integer), title (string), and content (string)." },
          { bold: "2. Initialize Your \"Database\":", text: "Create an empty list at the top of your file: fake_notes_db = []" },
          { bold: "3. Add a Note (POST):", text: "Create a @app.post('/notes/') route that accepts your Pydantic Note model and appends it to your fake_notes_db list." },
          { bold: "4. Get All Notes (GET):", text: "Create a @app.get('/notes/') route that simply returns the entire list." },
          { bold: "5. Update a Note (PUT):", text: "Create a @app.put('/notes/{note_id}') route. Don't forget to raise an HTTPException with a 404 status code if the user tries to update an ID that doesn't exist!" },
          { bold: "6. Delete a Note (DELETE):", text: "Create a @app.delete('/notes/{note_id}') route that uses a path parameter to locate and remove the item from your list." }
        ]
      },
      {
        heading: "Implementing the Search Feature",
        intro: "Your final challenge is to add a feature that allows users to search notes by their title. You do not need a completely new route for this — lean on Query Parameters.",
        points: [
          { bold: "Optional Query Parameter:", text: "Give your @app.get('/notes/') function an optional query parameter, such as title: str | None = None." },
          { bold: "Filtering Logic:", text: "If a user visits /notes/ (title is None), return the entire list. If a user visits /notes/?title=meeting, loop through your fake_notes_db and return only the notes where the title matches." }
        ]
      }
    ],
    handsOn: ["Store notes in list", "Perform CRUD operations"],
    example: "Notes API",
    codingTask: "Create: Add note, Get notes, Update note, Delete note.",
    assignment: "Add note search by title.",
    explanation: "Combines all FastAPI basics and prepares for database usage.",
    resourceLinks: [],
    evaluationChecklist: ["CRUD works", "Unique IDs", "Clean responses"],
    gitTask: "Create new repo notes-api, Commit full mini project",
    tasks: m2Tasks(25, ["Complete hands-on: In-memory CRUD", "Coding task: Notes API with full CRUD", "Assignment: Search notes by title", "Git: Create repo, commit Notes API"])
  },
  {
    day: 26,
    month: 2,
    week: 6,
    monthTitle: "FastAPI",
    weekTitle: "Validation & Error Handling",
    topic: "Response Models",
    overview: "Today, we are focusing on what happens when data leaves our API. We have already learned how to strictly validate the data coming into our server using Pydantic, but now it is time to look at the exact opposite: Response Models and Status Codes.",
    content: [
      {
        heading: "The Response Model",
        intro: "Up to this point, our API functions simply return whatever data we tell them to. But what if we accidentally return the wrong type of data, or worse, sensitive data? To solve this, FastAPI provides the response_model parameter, which we add directly to our route decorator.",
        points: [
          { bold: "Nightclub Exit Analogy:", text: "You already have a bouncer at the front door checking IDs to make sure only valid data gets in (Request Body validation). A Response Model is like a security guard at the exit — before any data is allowed to leave the club and go back to the user, this exit guard inspects it to ensure it perfectly matches the expected format." },
          { bold: "Usage:", text: "@app.post('/users/', response_model=UserOut) — even if your function returns the full user object (including the password), FastAPI will strip away any fields not in UserOut." }
        ]
      },
      {
        heading: "Hiding Sensitive Information",
        intro: "The absolute most important use case for a response model is hiding sensitive information. When a user registers, they send you a password. When your API sends a success response back, you never want to send that password back in the response body!",
        points: [
          { bold: "UserIn:", text: "This model includes the username, email, and the secret password. We use this to receive data." },
          { bold: "UserOut:", text: "This model only includes the username and email — it completely excludes the password. FastAPI automatically acts as a filter." },
          { bold: "response_model_exclude:", text: "You can also use this parameter directly in the route to skip specific fields, but defining a dedicated output model is the cleanest and most recommended approach." }
        ]
      },
      {
        heading: "Keeping Code Clean with Inheritance",
        intro: "If UserIn and UserOut both share fields like username and email, writing those fields out multiple times violates the DRY (Don't Repeat Yourself) principle. Instead, we can use standard Python inheritance.",
        points: [
          { bold: "Car Blueprint Analogy:", text: "First, you design a standard BaseCar with doors and wheels. Then, if you want a sports car, you don't redesign the doors and wheels; you just take the BaseCar and add a turbocharger." },
          { bold: "BaseUser:", text: "Holds shared fields (username, email, name)." },
          { bold: "UserIn(BaseUser):", text: "Inherits everything from BaseUser, adds a password." },
          { bold: "UserOut(BaseUser):", text: "Inherits everything from BaseUser but adds nothing else — no password!" },
          { bold: "UserInDB(BaseUser):", text: "For internal database use, inherits BaseUser, adds a hashed_password." }
        ]
      },
      {
        heading: "Setting Explicit HTTP Status Codes",
        intro: "By default, when a FastAPI route succeeds, it returns an HTTP 200 OK status code. However, depending on the action, standard web protocols expect different codes.",
        points: [
          { bold: "201 Created:", text: "When you successfully create a new user, the industry standard is to return a 201 Created status." },
          { bold: "204 No Content:", text: "If you successfully delete a user, you typically don't need to return any data." },
          { bold: "status module:", text: "Import status from FastAPI and set status_code=status.HTTP_201_CREATED directly in your route decorator. This gives you great auto-complete in your editor so you don't have to memorize random numbers." }
        ]
      }
    ],
    handsOn: ["Create Pydantic response schemas", "Return only selected fields", "Hide internal data"],
    example: "Returning only title & content of notes",
    codingTask: "Use response models to control API output.",
    assignment: "Apply response models to Notes API.",
    explanation: "Response models make APIs secure and predictable.",
    resourceLinks: [{ title: "Response Models", url: "https://youtu.be/tVJe14xlQBs?si=kK7zhK5Mv0_8KKte" }],
    evaluationChecklist: ["Response model applied", "No internal fields exposed", "Clean JSON format"],
    gitTask: "Commit response model changes",
    tasks: m2Tasks(26, ["Review learning resources", "Complete hands-on: Response schemas", "Coding task: Control API output with response models", "Assignment: Apply to Notes API", "Git: Commit response models"])
  },
  {
    day: 27,
    month: 2,
    week: 6,
    monthTitle: "FastAPI",
    weekTitle: "Validation & Error Handling",
    topic: "Field Validation using Pydantic",
    overview: "Today's lesson will act as a fantastic reinforcement of the concepts you've been working with over the past few days, specifically focusing on how FastAPI handles data validation behind the scenes. We are going to solidify our understanding of how to accept complex data from users by creating models with Pydantic.",
    content: [
      {
        heading: "The Engine Behind the Speed",
        intro: "Have you ever wondered why FastAPI is considered one of the absolute fastest Python frameworks available, often beating out older giants like Flask and Django? It comes down to two major underlying technologies:",
        points: [
          { bold: "Starlette:", text: "(Specifically through the Uvicorn server) handles the asynchronous web routing layer." },
          { bold: "Pydantic:", text: "Handles the heavy lifting of data validation. Instead of writing dozens of if/else statements to check if a user sent the right data, FastAPI offloads all of that work to Pydantic, which does it blazingly fast." }
        ]
      },
      {
        heading: "Modeling the Request Body",
        intro: "Whenever a client sends a POST request to your server, they usually include a 'Body' of data. To tell FastAPI exactly what this body should look like, we inherit from Pydantic's BaseModel.",
        points: [
          { bold: "Exclusive Post Office Analogy:", text: "You don't just accept any random box. You have a strict blueprint (your BaseModel). If a customer brings a box that doesn't perfectly match the dimensions and contents specified in your blueprint, you refuse to ship it." },
          { bold: "Defining Fields:", text: "By defining fields with types (name: str, age: int, base_salary: float), you are explicitly telling FastAPI what to accept and ensure it is the right type." }
        ]
      },
      {
        heading: "The Magic of Automatic Error Handling",
        intro: "What happens if a user tries to be sneaky or makes a mistake? Suppose they try to send 'chennai' as their age instead of a number like 24.",
        points: [
          { bold: "422 Unprocessable Entity:", text: "FastAPI handles this instantly. The moment it detects 'chennai' in the age field, it blocks the request and automatically returns a 422 error. Even better, it sends back a clean JSON response explaining exactly why it failed (e.g., 'value is not a valid integer'). You get enterprise-grade error handling without writing a single line of error-catching code!" }
        ]
      },
      {
        heading: "Making Fields Optional",
        intro: "By default, every field you define in your Pydantic model is absolutely required. If the user forgets to send their country, the request will fail.",
        points: [
          { bold: "Default None:", text: "If you want to make a field optional, simply assign it a default value of None: country: str = None. The request will succeed even without this field." }
        ]
      },
      {
        heading: "Advanced: The Body() Function",
        intro: "While Pydantic models are the standard way to accept body data, what if you just want to add one tiny extra piece of data to your request body without creating a whole new Pydantic class?",
        points: [
          { bold: "Body() Function:", text: "You can use FastAPI's built-in Body() function. By wrapping Body(...) around the type hint, you force FastAPI to look for that parameter inside the JSON body of the request, rather than assuming it is a query parameter." },
          { bold: "Important Rule:", text: "When mixing Pydantic models and individual Body() parameters, the standard parameters must go at the end of your function arguments!" }
        ]
      }
    ],
    handsOn: ["Use EmailStr", "Add min/max length", "Custom validators"],
    example: "User Registration Validation",
    codingTask: "Add validations for email format and password length.",
    assignment: "Add validation rules to Notes and User models.",
    explanation: "Ensures only clean and valid data enters the system.",
    resourceLinks: [{ title: "Pydantic Validation", url: "https://youtu.be/GkrDmUEEEtM?si=Iv7qeW7owXfDPRIe" }],
    evaluationChecklist: ["Invalid data rejected", "Proper error messages", "Valid data accepted"],
    gitTask: "Commit validation logic",
    tasks: m2Tasks(27, ["Review learning resources", "Complete hands-on: Field validation", "Coding task: Email & password validation", "Assignment: Validation for Notes & User models", "Git: Commit validation logic"])
  },
  {
    day: 28,
    month: 2,
    week: 6,
    monthTitle: "FastAPI",
    weekTitle: "Validation & Error Handling",
    topic: "Custom HTTP Exceptions",
    overview: "Today, we are taking a massive step towards making our APIs robust and production-ready. We are going to focus on how our application communicates with the outside world when things go wrong, and how to strictly adhere to HTTP standards when things go right.",
    content: [
      {
        heading: "Handling Errors with HTTPException",
        intro: "Imagine you run a massive library. If a patron asks you to throw away a book that does not exist in your catalog, you wouldn't just stare at them blankly or let the library burn down — you would politely inform them that the specific book could not be found.",
        points: [
          { bold: "raise HTTPException:", text: "Import HTTPException from FastAPI and use the raise keyword. Pass in a status_code (like 404, which universally means 'item not found') and a detail message (like 'book not found')." },
          { bold: "Custom Headers:", text: "To provide even more context to the client, you can also attach custom headers directly to the exception, like an 'X-Header-Error' that explicitly tells the client what went wrong." }
        ]
      },
      {
        heading: "Keeping Your Code DRY (Don't Repeat Yourself)",
        intro: "As your application grows, you will likely need to raise this exact same 'Item Not Found' 404 error across multiple different routes — such as your GET, PUT, and DELETE endpoints.",
        points: [
          { bold: "Helper Function:", text: "Instead of manually typing out the HTTPException every single time, write a standard Python function that returns this specific exception. Then, whenever a book isn't found, you just raise that custom function. This ensures your error messages and headers remain perfectly consistent across your entire API." }
        ]
      },
      {
        heading: "Building Custom Exception Handlers",
        intro: "Sometimes, standard HTTP errors aren't quite enough, and you need to handle highly specific, custom scenarios. For example, a user tries to use a query parameter to retrieve a negative number of books.",
        points: [
          { bold: "Custom Exception Class:", text: "Create your very own Python exception class (e.g., NegativeNumberException that extends the base Python Exception class)." },
          { bold: "@app.exception_handler:", text: "FastAPI allows you to catch this custom exception globally using this decorator. Inside the handler, return a specialized JSONResponse with a custom status code and a highly specific message." },
          { bold: "418 I'm a Teapot:", text: "A cheeky example status code you can use for custom scenarios, like 'Hey, why do you want a negative number of books? You need to read more'." }
        ]
      },
      {
        heading: "Setting Explicit Success Status Codes",
        intro: "Error codes are vital, but so are success codes! By default, when a FastAPI route succeeds, it returns a standard 200 OK status. However, if your user sends a POST request that successfully creates a brand-new item, the correct HTTP standard is actually 201 Created.",
        points: [
          { bold: "status_code in decorator:", text: "Import status from FastAPI and set status_code=status.HTTP_201_CREATED directly inside your route decorator. This explicitly tells the client application exactly what happened." }
        ]
      },
      {
        heading: "Accepting Forms and Custom Headers",
        intro: "Your API won't always receive data as a neat JSON body. Many web applications and authentication systems send data via traditional HTML Forms.",
        points: [
          { bold: "Form() Function:", text: "Import Form and set it as the default value in your function parameters (e.g., username: str = Form(...)). FastAPI will automatically intercept, decode, and validate the form data. If you don't declare it as a Form, FastAPI will mistakenly assume you are looking for a query parameter." },
          { bold: "Header() Function:", text: "If you need to read custom metadata coming directly from the client's request headers, import Header and assign it to your function parameters. This makes extracting secure headers or tracking tokens an absolute breeze." }
        ]
      }
    ],
    handsOn: ["Use HTTPException", "Return status codes"],
    example: "Note not found error",
    codingTask: "Raise proper exceptions when invalid ID is passed.",
    assignment: "Add meaningful error messages across all APIs.",
    explanation: "Improves API reliability and developer experience.",
    resourceLinks: [{ title: "HTTP Exceptions", url: "https://youtu.be/AomUc4nNZg0?si=L2k45xMb7aA6axNf" }],
    evaluationChecklist: ["Correct status codes", "No server crash", "Clear errors"],
    gitTask: "Commit error handling",
    tasks: m2Tasks(28, ["Review learning resources", "Complete hands-on: HTTPException & status codes", "Coding task: Exception handling for invalid IDs", "Assignment: Meaningful errors across all APIs", "Git: Commit error handling"])
  },
  {
    day: 29,
    month: 2,
    week: 6,
    monthTitle: "FastAPI",
    weekTitle: "Validation & Error Handling",
    topic: "File Uploads",
    overview: "Welcome to Day 29! Until now, our API has primarily communicated using strictly structured JSON data. While JSON is the undisputed king of modern APIs, the web is vast. Sometimes, your API needs to accept data from a traditional HTML form, or a user might need to upload a document, an image, or a text file. Today, we are learning how to handle both scenarios.",
    content: [
      {
        heading: "Installing the Prerequisite",
        points: [
          { bold: "python-multipart:", text: "To work with forms and files in FastAPI, we rely on an external library that parses this specific type of encoding. Before writing any code, you must install it by running: pip install python-multipart in your terminal." }
        ]
      },
      {
        heading: "Accepting Form Data",
        intro: "When a user submits a standard HTML form, the data is not formatted as JSON. It is sent with a special encoding (application/x-www-form-urlencoded). If you try to read this data using a standard Pydantic model, FastAPI will reject it because it is expecting JSON.",
        points: [
          { bold: "Form() Import:", text: "Import Form from FastAPI and use it as the default value in your function parameters: username: str = Form(...), password: str = Form(...). By assigning Form(...), you explicitly tell FastAPI to look inside the encoded form data for these specific fields." }
        ]
      },
      {
        heading: "Uploading Files",
        intro: "Handling files is where FastAPI truly shines. FastAPI gives you two main ways to accept a file: File (which reads the file as raw bytes) and UploadFile. You should almost always use UploadFile.",
        points: [
          { bold: "Why UploadFile?:", text: "If you use raw bytes, your server tries to swallow the entire file whole, holding it entirely in your computer's RAM. If a user uploads a massive 2GB video, your server might crash from memory exhaustion." },
          { bold: "Spooled Memory System:", text: "UploadFile holds small files in memory, but for large files, it acts like a funnel, gracefully writing the excess data directly to your server's disk without overwhelming your RAM." },
          { bold: "async def:", text: "Define your route as an async def function. Because reading and writing files from a hard drive takes physical time, doing this asynchronously ensures your server can handle other users' requests while waiting for the file operation to finish." },
          { bold: "Useful Attributes:", text: "UploadFile gives you access to assignment_file.filename (the original name of the file) and assignment_file.content_type (e.g., whether it is a text file or an image)." },
          { bold: "Important HTML Note:", text: "If you are testing file uploads from a custom HTML frontend, your <form> tag must include the attribute enctype='multipart/form-data'. If you forget this, the browser won't package the file correctly." }
        ]
      }
    ],
    handsOn: ["UploadFile", "FormData", "Save files"],
    example: "Upload image/document",
    codingTask: "Create API to upload and save file.",
    assignment: "Add file attachment feature to Notes API.",
    explanation: "Teaches handling of multipart form data.",
    resourceLinks: [{ title: "Form Data & File Upload", url: "https://youtu.be/Ofesfy686jY?si=SyV-gyvnX_MM74FO" }, { title: "Request Files", url: "https://youtu.be/dFV5M84fzRg?si=fT0pTmVq_yhM5u_4" }],
    evaluationChecklist: ["File saved", "Different file types accepted", "Path correct"],
    gitTask: "Commit file upload feature",
    tasks: m2Tasks(29, ["Review learning resources", "Complete hands-on: File uploads", "Coding task: File upload & save API", "Assignment: File attachment for Notes API", "Git: Commit file upload"])
  },
  {
    day: 30,
    month: 2,
    week: 6,
    monthTitle: "FastAPI",
    weekTitle: "Validation & Error Handling",
    topic: "Mini Project: Enhanced Notes API",
    overview: "Your objective is to combine all the advanced tools you learned over the past week — Validations, Error Handling, Response Models, and File Support — and inject them into the basic CRUD Notes API you built on Day 25. By putting these concepts together, you are transforming a fragile, basic script into a robust, secure, and professional backend service.",
    content: [
      {
        heading: "1. Implement Strict Response Models",
        intro: "In your basic Notes API, you likely just passed data directly in and out. Now, you should enforce strict boundaries:",
        points: [
          { bold: "NoteIn:", text: "A Pydantic model for when a user creates or updates a note (e.g., title, content)." },
          { bold: "NoteOut:", text: "A Pydantic model to serve as your response_model in your decorators. This guarantees you are sending back cleanly formatted data every single time." }
        ]
      },
      {
        heading: "2. Standardize Error Handling and Status Codes",
        intro: "A professional API is highly communicative.",
        points: [
          { bold: "201 Created:", text: "Upgrade your POST route to explicitly return a 201 Created status code when a note is successfully added." },
          { bold: "404 Not Found:", text: "Upgrade your GET, PUT, and DELETE routes to check if the requested note_id actually exists in your in-memory list. If it doesn't, raise a clean HTTPException with a 404 Not Found status." }
        ]
      },
      {
        heading: "3. Add File Attachment Support",
        intro: "You can enhance your Notes API by allowing users to attach files to their notes.",
        points: [
          { bold: "New Endpoint:", text: "Create @app.post('/notes/{note_id}/attachment') — in this route, accept an UploadFile." },
          { bold: "Link to Note:", text: "Read the filename of the uploaded file and append it as a new attribute to the specific note dictionary in your database (e.g., note['attached_file'] = assignment_file.filename)." }
        ]
      }
    ],
    handsOn: ["Combine validation, response models, error handling, file uploads"],
    example: "Production-ready Notes API",
    codingTask: "Upgrade Notes API with: Validations, Error handling, Response models, File support.",
    assignment: "Finalize Enhanced Notes API.",
    explanation: "This simulates a real backend API system.",
    resourceLinks: [],
    evaluationChecklist: ["Validations work", "Errors handled", "Files upload correctly", "Clean responses"],
    gitTask: "Create tag v1.0-enhanced-notes, Push to GitHub",
    tasks: m2Tasks(30, ["Complete hands-on: Combine all techniques", "Coding task: Enhanced Notes API", "Assignment: Finalize production-ready API", "Git: Tag v1.0-enhanced-notes, push"])
  },
  {
    day: 31,
    month: 2,
    week: 7,
    monthTitle: "FastAPI",
    weekTitle: "Databases with FastAPI",
    topic: "Introduction to Databases, SQLite & SQLAlchemy Setup",
    overview: "Over the past few days, we have built some fantastic APIs. However, because we were using in-memory Python lists, all of our hard work vanished the second our server restarted. Today, we cross the bridge into the world of persistent data storage by learning about two essential tools: SQLite and SQLAlchemy.",
    content: [
      {
        heading: "Part 1: SQLite — The Embedded Database",
        intro: "When most people think of a database, they picture a massive, separate server sitting in a warehouse that an application has to communicate with over a network. SQLite is entirely different — it is an 'embedded' or 'serverless' database.",
        points: [
          { bold: "Filing Cabinet Analogy:", text: "If a traditional database is like storing your items in a massive off-site storage unit that you have to drive to, SQLite is like having a perfectly organized filing cabinet sitting right under your desk." },
          { bold: "How it works:", text: "The database engine runs within the exact same process as your application. There is no network activity or separate server to configure. It simply stores everything in a lightweight .db file directly in your project folder." },
          { bold: "DDL (Data Definition Language):", text: "Used to build the structure, like CREATE TABLE users (...) or DROP TABLE users." },
          { bold: "DML (Data Manipulation Language):", text: "Used to handle the data inside those tables, such as INSERT INTO, UPDATE, SELECT, and DELETE." }
        ]
      },
      {
        heading: "Part 2: SQLAlchemy — The Ultimate Translator",
        intro: "While writing raw SQL queries inside Python strings is entirely possible, it can become messy, difficult to read, and disconnected from the object-oriented nature of Python. This is where SQLAlchemy steps in. SQLAlchemy is an Object-Relational Mapper (ORM).",
        points: [
          { bold: "Ancient Language Analogy:", text: "Imagine SQL as a highly specific, ancient language. You could learn to speak it perfectly, hand-writing every command. Or, you could hire a world-class translator — an ORM is that translator. It allows you to write perfectly normal, fluent Python code (objects and classes), and the ORM translates it into optimized SQL behind the scenes." }
        ]
      },
      {
        heading: "The Engine and the Session",
        points: [
          { bold: "The Engine:", text: "This is the core connection to your database — the actual pipeline that talks to your SQLite .db file." },
          { bold: "The Session:", text: "If the engine is the pipeline, the session is your temporary workspace or 'shopping cart.' You can add multiple new items to your session, make changes, or delete things. None of it is permanently saved to the database until you explicitly tell the session to commit() those changes." }
        ]
      },
      {
        heading: "The Declarative Base and Models",
        intro: "To map a Python class to a database table, we create a Base class. Every table we want to create will inherit from this Base.",
        points: [
          { bold: "Mapped and mapped_column:", text: "Using modern type-hinting with Mapped and mapped_column, we declare exactly what our database columns should look like. Notice how similar this feels to the Pydantic models we've been writing!" }
        ]
      },
      {
        heading: "Interacting with the Data (CRUD via ORM)",
        intro: "Once your engine, session, and models are set up, interacting with the database feels like pure Python magic. You no longer have to write INSERT INTO users.... Instead, you simply create an instance of your class, add it to the session, and commit!",
        points: [
          { bold: "Custom Methods:", text: "You can even add custom Python methods directly to your model classes. For instance, you can write a set_password() method right inside the User class to automatically hash passwords — something raw SQL simply cannot do." }
        ]
      }
    ],
    handsOn: ["Install SQLAlchemy", "Create SQLite database", "Configure database connection", "Create DB session"],
    example: "Connecting FastAPI to SQLite",
    codingTask: "Create a database connection using SQLAlchemy and integrate it with FastAPI.",
    assignment: "Create a database.py file that initializes the engine and session.",
    explanation: "Introduces permanent data storage with real databases.",
    resourceLinks: [{ title: "SQLAlchemy Setup", url: "https://youtu.be/8Xyn8R9eKB8?si=LIhWVYQUCQ3W1xK5" }, { title: "Database Config", url: "https://youtu.be/aAy-B6KPld8?si=LCRAOiD4JW1iG_mw" }],
    evaluationChecklist: ["Database file created", "Engine initialized", "Session working", "No connection errors"],
    gitTask: "Commit database configuration files",
    tasks: m2Tasks(31, ["Review learning resources", "Complete hands-on: SQLAlchemy & SQLite setup", "Coding task: Database connection with FastAPI", "Assignment: database.py with engine & session", "Git: Commit database config"])
  },
  {
    day: 32,
    month: 2,
    week: 7,
    monthTitle: "FastAPI",
    weekTitle: "Databases with FastAPI",
    topic: "Database Models & Tables",
    overview: "Welcome to Day 32! Over the past few days, you've made incredible strides. You successfully set up SQLAlchemy, established a connection to an SQLite database, and committed your foundational database.py configuration. Now that our database engine is running, we need to talk about how we actually store our data inside of it. Today, we are diving deep into the concept of Data Models.",
    content: [
      {
        heading: "What is a Data Model?",
        intro: "At its core, a data model is the underlying blueprint or structure of a database. When we say a database is a 'collection of interrelated data,' it means we need a highly organized way to define what that data looks like, how different pieces relate to one another, and what rules (or constraints) apply to them.",
        points: [
          { bold: "City Blueprint Analogy:", text: "Imagine you are building a massive city. You can't just start throwing bricks on the ground. You need a master architectural blueprint. This blueprint dictates where the residential zones are, how the roads connect the different neighborhoods (relationships), and strict zoning laws like 'no skyscrapers in the suburbs' (constraints). In database design, the data model is your master blueprint." }
        ]
      },
      {
        heading: "The Relational Model",
        intro: "The Relational Model is the most widely used data model in the contemporary world. If you are using a Relational Database Management System (RDBMS) like SQLite, PostgreSQL, or MySQL, you are using the relational model. In this model, absolutely everything is represented in the form of tables.",
        points: [
          { bold: "The Database:", text: "The entire collection of tables." },
          { bold: "The Table (Relation):", text: "A specific category of data. For instance, you will have a users table and a notes table." },
          { bold: "The Columns (Attributes/Fields):", text: "The specific data points you want to track. For a user, the columns might be id, username, and email. Every column in a table has a unique name." },
          { bold: "The Rows (Records):", text: "A single, fixed-format instance of data. If John Doe signs up, his information becomes one single row inside the users table." }
        ]
      },
      {
        heading: "Entity-Relationship (ER) Modeling",
        intro: "Before you write the Python code to generate these tables, you have to design them. This is where the Entity-Relationship (ER) Model comes in — a schematic or diagrammatic representation used specifically for designing databases before you start creating the actual tables.",
        points: [
          { bold: "Entities:", text: "Basic objects or real-world things that are distinguishable from other objects. In your application, a User is an entity, and a Note is an entity." },
          { bold: "Attributes:", text: "These describe the entity. A User entity has attributes like email and password." },
          { bold: "Relationships:", text: "How the entities interact. A User creates a Note. This establishes a link between the two tables." }
        ]
      },
      {
        heading: "Defining Primary Keys & Required Fields",
        intro: "When translating your ER design into actual SQLAlchemy models, you must define the constraints and rules for your attributes.",
        points: [
          { bold: "Primary Keys:", text: "Every single record in a database table must be uniquely identifiable. Instead of relying on a username or email (which can change or be duplicated), every table should have a dedicated id integer set as the Primary Key. The database guarantees that this ID will be 100% unique for every single row." },
          { bold: "Required vs. Optional Fields:", text: "When defining your columns in SQLAlchemy, you must explicitly state whether a field can be left blank (NULL in SQL). If a Note must have a title, set that column as required (not nullable). If a note has an optional attachment_url, explicitly allow it to be nullable." }
        ]
      },
      {
        heading: "Other Data Models (For Context)",
        points: [
          { bold: "Object-Based Model:", text: "Combines the ER model with object-oriented programming features like encapsulation and inheritance. When combined with the relational model, you get an Object-Relational Model — which is exactly what SQLAlchemy provides us!" },
          { bold: "Semi-Structured Data Model:", text: "Used heavily for transferring data between different applications where individual data items might have different sets of attributes. XML is a classic example, where users define their own hierarchical tags." }
        ]
      }
    ],
    handsOn: ["Create SQLAlchemy models", "Define tables using classes", "Create tables automatically"],
    example: "User & Notes tables",
    codingTask: "Create database models for: User, Note.",
    assignment: "Add primary keys and required fields.",
    explanation: "Interns learn how Python classes represent database tables.",
    resourceLinks: [{ title: "Database Models", url: "https://youtu.be/OwQoj3GJfNY?si=tX9FY3h3dYalamS8" }],
    evaluationChecklist: ["Models defined correctly", "Tables created", "Primary keys exist", "Correct data types"],
    gitTask: "Commit models file",
    tasks: m2Tasks(32, ["Review learning resources", "Complete hands-on: SQLAlchemy models", "Coding task: User & Note database models", "Assignment: Primary keys & required fields", "Git: Commit models"])
  },
  {
    day: 33,
    month: 2,
    week: 7,
    monthTitle: "FastAPI",
    weekTitle: "Databases with FastAPI",
    topic: "CRUD Operations with Database",
    overview: "Today is all about Database CRUD — the bread and butter of backend development. We are going to seamlessly integrate your SQLAlchemy models with your FastAPI routes so your users can actually store and modify persistent data.",
    content: [
      {
        heading: "What is CRUD?",
        intro: "CRUD stands for Create, Read, Update, and Delete. In SQL databases, these map to four core commands. However, because we are using an ORM (SQLAlchemy), we don't need to write those raw SQL statements — we simply call Python methods on our database session!",
        points: [
          { bold: "Create → INSERT INTO", text: "" },
          { bold: "Read → SELECT", text: "" },
          { bold: "Update → UPDATE", text: "" },
          { bold: "Delete → DELETE", text: "" }
        ]
      },
      {
        heading: "Setting Up the Dependency Injection",
        intro: "Before we write our endpoints, we need a way to pass our database session into our FastAPI routes. We do this using a FastAPI feature called Dependency Injection. The get_db() function creates a temporary 'workspace' (a session) for a single user request, hands it to your route (via yield), and guarantees that the session is safely closed when the request is finished.",
        points: [
          { bold: "Depends(get_db):", text: "Add this as a parameter to any route function that needs database access: db: Session = Depends(get_db)." }
        ]
      },
      {
        heading: "Step 1: Create API (POST)",
        intro: "When a user wants to create a new Note, they will send a JSON payload. We use Pydantic to validate that incoming data, and then we use SQLAlchemy to save it.",
        points: [
          { bold: "Convert Pydantic to SQLAlchemy:", text: "new_note = Note(**note_in.dict()) — convert the Pydantic model into a SQLAlchemy model." },
          { bold: "db.add() + db.commit():", text: "Add it to the session workspace, then commit the changes permanently to the database." },
          { bold: "db.refresh():", text: "Refresh the object to get the newly generated ID from the database." }
        ]
      },
      {
        heading: "Step 2: Read APIs (GET)",
        intro: "We typically need two types of Read operations: fetching a list of all items, and fetching one specific item by its ID.",
        points: [
          { bold: "Get All Notes:", text: "Use the query() method: db.query(Note).all() — equivalent to SELECT * FROM notes." },
          { bold: "Get Note by ID:", text: "Use the .filter() method: db.query(Note).filter(Note.id == note_id).first() — equivalent to SELECT * FROM notes WHERE id = {note_id}. Remember to handle the error if the note doesn't exist!" }
        ]
      },
      {
        heading: "Step 3: Update API (PUT)",
        intro: "Updating a record is a two-step process: first, retrieve the existing record from the database. Second, modify its attributes and commit the session.",
        points: [
          { bold: "Find then Update:", text: "Use note_query.update(note_in.dict(exclude_unset=True)) to update only the fields that were actually sent, then db.commit() to save." }
        ]
      },
      {
        heading: "Step 4: Delete API (DELETE)",
        intro: "If a user wants to permanently remove a note, we locate the note and call the .delete() method.",
        points: [
          { bold: "note_query.delete() + db.commit():", text: "Delete the record from the workspace, then commit the permanent deletion. Return a 204 status code to signal no content is being returned." },
          { bold: "Full-Stack Developer:", text: "You have successfully routed web requests through Pydantic validators, down into SQLAlchemy models, and permanently into a persistent SQLite database!" }
        ]
      }
    ],
    handsOn: ["Insert data", "Query data", "Update records", "Delete records"],
    example: "Notes CRUD with Database",
    codingTask: "Implement APIs: Create note, Get all notes, Get note by ID.",
    assignment: "Add update and delete APIs.",
    explanation: "Shows real interaction between FastAPI and database using ORM.",
    resourceLinks: [{ title: "CRUD Operations", url: "https://youtu.be/WFNtmhwU5HU?si=0HlN6wFu7wLtPvhh" }],
    evaluationChecklist: ["Data stored in DB", "Data retrieved correctly", "Update works", "Delete works"],
    gitTask: "Commit CRUD APIs",
    tasks: m2Tasks(33, ["Review learning resources", "Complete hands-on: Database CRUD", "Coding task: Create, Get all, Get by ID APIs", "Assignment: Add update & delete APIs", "Git: Commit CRUD APIs"])
  },
  {
    day: 34,
    month: 2,
    week: 7,
    monthTitle: "FastAPI",
    weekTitle: "Databases with FastAPI",
    topic: "Database Relationships",
    overview: "Now that we have our SQLite database running and multiple SQLAlchemy models defined (like a User table and a Note table), we face a new challenge: How do we securely connect them? If a user logs in and wants to see their notes, the database needs a structured way to know exactly which notes belong to which user. We solve this using Relational Database Relationships.",
    content: [
      {
        heading: "1. One-to-One Relationship",
        intro: "In a one-to-one relationship, a single record in one entity (table) can only reference exactly one record in another entity.",
        points: [
          { bold: "Video Store Analogy:", text: "Think of a video store member and their driver's license. One specific member has exactly one driver's license on file, and that specific driver's license is only ever used to validate that single member. The records match up perfectly one-to-one." }
        ]
      },
      {
        heading: "2. One-to-Many (or Many-to-One) Relationship",
        intro: "In this relationship, a single record in one entity can reference multiple records in another entity. However, the records in that second entity can only reference a single record back in the first entity.",
        points: [
          { bold: "Movie Rentals Analogy:", text: "One member can make multiple different rentals over the course of a year. However, one specific rental receipt belongs to exactly one member." },
          { bold: "Application to your API:", text: "This is the exact relationship we need! One User can create Many Notes. But any specific Note belongs strictly to One User." }
        ]
      },
      {
        heading: "3. Many-to-Many Relationship",
        intro: "In a many-to-many relationship, records in both entities can reference multiple records in each other.",
        points: [
          { bold: "Movies and Rentals Analogy:", text: "One specific movie (like The Matrix) can be rented many different times in many different transactions. Conversely, one single rental transaction can contain multiple different movies." },
          { bold: "Junction Table:", text: "To make this work in a database, you actually have to create a third table — known as a junction table — that sits between them and contains foreign keys referencing both primary tables." }
        ]
      },
      {
        heading: "Implementing the Relationship: Foreign Keys",
        intro: "To establish our One-to-Many relationship between Users and Notes, we use a concept called a Foreign Key. A Foreign Key is simply a column in one table that points directly to the Primary Key of another table.",
        points: [
          { bold: "user_id ForeignKey:", text: "Add user_id: Mapped[int] = mapped_column(ForeignKey('users.id')) to your Note model. This is the Foreign Key that links this note to a specific user." },
          { bold: "relationship():", text: "Add owner = relationship('User', back_populates='notes') to create a helpful Python attribute to easily access the User object. Also add notes = relationship('Note', back_populates='owner') to your User model to make the connection two-way!" }
        ]
      },
      {
        heading: "Building User-Specific APIs",
        intro: "Once your database understands this relationship, writing user-specific endpoints becomes incredibly straightforward.",
        points: [
          { bold: "Filter by Foreign Key:", text: "db.query(Note).filter(Note.user_id == user_id).all() — you don't have to fetch all the notes and sort through them in Python. You can just ask the database to filter by the Foreign Key." },
          { bold: "True Power of Relational DBs:", text: "Your data is no longer floating in isolated silos; it is intimately connected, allowing you to build highly complex, personalized applications!" }
        ]
      }
    ],
    handsOn: ["Foreign keys", "One-to-many relationships"],
    example: "One user -> many notes",
    codingTask: "Create relationship between User table and Notes table.",
    assignment: "Create APIs: Create user, Create note for a user, Get notes of a user.",
    explanation: "Teaches relational database design and real-world data connections.",
    resourceLinks: [{ title: "Relationships", url: "https://youtu.be/C3icLzBtg8I?si=tt_6wLcMrPfuLMU7" }],
    evaluationChecklist: ["Foreign key working", "Notes linked properly", "Queries correct"],
    gitTask: "Commit relationship models and APIs",
    tasks: m2Tasks(34, ["Review learning resources", "Complete hands-on: Foreign keys & relationships", "Coding task: User-Note relationship", "Assignment: User-specific note APIs", "Git: Commit relationship code"])
  },
  {
    day: 35,
    month: 2,
    week: 7,
    monthTitle: "FastAPI",
    weekTitle: "Databases with FastAPI",
    topic: "Mini Project: Notes API with Database",
    overview: "While there is no new textbook chapter to read today, here is a quick architectural blueprint to help you smoothly transition your project from 'in-memory' to 'database-backed'. Today's project is like taking all the sticky notes you've been temporarily slapping onto a whiteboard (your computer's RAM) and officially filing them away into a heavy-duty, fireproof filing cabinet (your SQLite .db file).",
    content: [
      {
        heading: "The Migration Blueprint",
        points: [
          { bold: "1. The Foundation (database.py):", text: "Ensure your database connection is solid. You should have your SQLite engine created and your SessionLocal configured to handle the workspace for your incoming requests." },
          { bold: "2. The Blueprints (models.py):", text: "Double-check your SQLAlchemy models. Your User and Note classes need to be perfectly mapped, ensuring you have your Primary Keys set and that crucial ForeignKey linking the notes to their specific authors." },
          { bold: "3. The Switch (Routing):", text: "Go through every single route (POST, GET, PUT, DELETE) in your main.py file and rip out the old Python list logic." }
        ]
      },
      {
        heading: "Key Substitutions",
        points: [
          { bold: "fake_db.append() → db.add() + db.commit():", text: "Inject your database session using Depends(get_db) and use db.add() and db.commit() to save data." },
          { bold: "Looping through list → Database query:", text: "Instead of looping through a list to find a note, ask the database to do the work using db.query(Note).filter(...) — much faster and more efficient." }
        ]
      }
    ],
    handsOn: ["Replace in-memory storage", "Use database for all operations"],
    example: "Fully DB-driven Notes API",
    codingTask: "Convert Enhanced Notes API into a database-backed version.",
    assignment: "Finalize Notes API using SQLite + SQLAlchemy.",
    explanation: "Transforms the API into a production-like backend.",
    resourceLinks: [],
    evaluationChecklist: ["Data persists after restart", "All CRUD works", "Clean DB schema", "No data loss"],
    gitTask: "Create tag v2.0-db-notes, Push complete DB version",
    tasks: m2Tasks(35, ["Complete hands-on: Replace in-memory with DB", "Coding task: DB-backed Notes API", "Assignment: Finalize with SQLite + SQLAlchemy", "Git: Tag v2.0-db-notes, push"])
  },
  {
    day: 36,
    month: 2,
    week: 8,
    monthTitle: "FastAPI",
    weekTitle: "Authentication + Final Project",
    topic: "User Authentication Flow (Register & Login)",
    overview: "Up until this point, our APIs have been completely open. Anyone with the URL could create, read, update, or delete data. In the real world, applications require security. Today, we are introducing user authentication into our FastAPI applications by focusing on two crucial concepts: Password Hashing and JSON Web Tokens (JWT).",
    content: [
      {
        heading: "The Golden Rule of Passwords: Hashing",
        intro: "When a user registers for your application, they trust you with their password. The absolute golden rule of web development is that you must never store passwords in plaintext. If your database is ever compromised, storing plaintext passwords means the attackers instantly have everyone's actual passwords.",
        points: [
          { bold: "Baking a Cake Analogy:", text: "Think of hashing a password like baking a cake. You can take raw ingredients — flour, sugar, and eggs (the plaintext password) — and bake them into a cake (the hash). However, no matter how hard you try, you can never un-bake that cake to get the raw eggs back." },
          { bold: "passlib with bcrypt:", text: "In Python, we typically use a library like passlib configured with the bcrypt algorithm to handle this. Hashing is a one-way mathematical function that scrambles a password into an unrecognizable string of characters." },
          { bold: "Verification:", text: "When a user attempts to log in later, we don't un-hash their stored password. Instead, we take their new login attempt, bake it through the exact same mathematical 'oven,' and use a verification function to check if the newly generated 'cake' matches the 'cake' we have stored in the database." }
        ]
      },
      {
        heading: "The Digital Passport: JSON Web Tokens (JWT)",
        intro: "HTTP is a 'stateless' protocol — the server has no memory of previous requests. If a user successfully logs in, the server immediately forgets who they are by the very next click. How do we keep a user logged in without forcing them to send their password with every single request? We use a JSON Web Token (JWT).",
        points: [
          { bold: "VIP Wristband Analogy:", text: "Imagine going to an exclusive nightclub. You show the bouncer your ID at the door (your username and password). Once you are verified, the bouncer doesn't make you show your ID every time you walk to a different room inside the club. Instead, they give you a VIP wristband. For the rest of the night, you just flash the wristband. A JWT is that VIP digital wristband." },
          { bold: "SECRET_KEY & Algorithm:", text: "The server signs this token using a highly secure SECRET_KEY and a cryptographic algorithm (like HS256). If anyone tries to tamper with the token, the signature becomes invalid. If you ever change that SECRET_KEY on your server, all previously issued tokens are instantly invalidated." }
        ]
      },
      {
        heading: "Building the Authentication APIs",
        points: [
          { bold: "The Signup (Registration) API:", text: "Receives user data (username, email, plaintext password) via a Pydantic schema. Checks the database to ensure the username or email isn't already taken. Passes their plaintext password into our hashing function. Saves the user to the database, explicitly storing the hashed_password attribute instead of the plain one." },
          { bold: "The Login API:", text: "Receives the user's login credentials. Queries the database to find the user by their username. If they don't exist, throws a 401 Unauthorized error. Uses verify_password to compare the plaintext password against the hashed password stored in the database. If the passwords match, uses jwt.encode() to generate a new access token. Returns the token in a standard dictionary format containing the access_token and token_type (set to 'bearer')." }
        ]
      }
    ],
    handsOn: ["Create User table with hashed password", "Use passlib to hash passwords", "Build register & login APIs"],
    example: "Basic User Authentication",
    codingTask: "Create APIs: Register a new user, Login with email & password.",
    assignment: "Ensure passwords are always stored in hashed format.",
    explanation: "Teaches how real systems manage users securely.",
    resourceLinks: [{ title: "JWT Auth Setup", url: "https://www.youtube.com/watch?v=t1yDcoV446o" }, { title: "JWT Login & Signup", url: "https://www.youtube.com/watch?v=89KRoSROung" }],
    evaluationChecklist: ["Password hashed", "User saved in DB", "Login validation works", "Wrong credentials rejected"],
    gitTask: "Commit authentication base setup",
    tasks: m2Tasks(36, ["Review learning resources", "Complete hands-on: Password hashing & auth", "Coding task: Register & login APIs", "Assignment: Hashed password storage", "Git: Commit auth setup"])
  },
  {
    day: 37,
    month: 2,
    week: 8,
    monthTitle: "FastAPI",
    weekTitle: "Authentication + Final Project",
    topic: "JWT Token Generation",
    overview: "Welcome to Month 2, Day 37! Yesterday, we learned the mechanics of hashing passwords and generating JSON Web Tokens (JWTs). Today, we are taking a step back to understand the fundamental why and how behind JWTs, and why they have become the industry standard for modern web architecture.",
    content: [
      {
        heading: "Authentication vs. Authorization",
        points: [
          { bold: "Authentication:", text: "This is the act of verifying who you are. It is the exact moment a user types in their username and password, and the server says, 'Yes, this password matches our records.'" },
          { bold: "Authorization:", text: "This happens after you log in. It is the process of verifying that the user sending a request is the same user who just logged in, and checking if they have permission to access a specific resource." },
          { bold: "JWTs are primarily a tool for Authorization.", text: "" }
        ]
      },
      {
        heading: "The Old Way: Session Variables",
        intro: "Traditionally, authorization was handled using server-side sessions: a user logs in, the server creates a 'session' in its own memory, generates a unique Session ID, sends it to the user's browser (usually stored in a cookie), and every subsequent click the browser sends that Session ID.",
        points: [
          { bold: "Two-Building Bank Analogy:", text: "Imagine a massive bank with two separate buildings: the Main Bank building and the Retirement Services building. If you walk into the Main Bank and show your ID, they 'remember' you. But if you walk next door to the Retirement Services building, those tellers have no idea who you are — because they don't share the same memory. You have to show your ID (log in) all over again." },
          { bold: "Major Limitation:", text: "The server has to remember the user — this doesn't scale well across multiple servers or microservices." }
        ]
      },
      {
        heading: "The Modern Way: JWT",
        intro: "JWT solves this problem beautifully by storing the user information directly on the client instead of the server. When you log in, the server creates a token containing your user data, signs it with a highly secure secret key, and hands it back to you. The server then completely forgets about you.",
        points: [
          { bold: "VIP Badge Analogy:", text: "Instead of the teller trying to memorize your face, they check your ID once and hand you a mathematically un-forgeable VIP badge. Now, you can walk into the Main Bank, the Retirement building, or any other building the bank owns. As long as every building knows what a valid VIP badge looks like (by sharing the same Secret Key), they will authorize you immediately." },
          { bold: "Incredible for Scaling:", text: "This makes JWTs incredibly powerful for scaling applications across multiple servers, load balancers, or microservices." }
        ]
      },
      {
        heading: "The Anatomy of a JWT",
        intro: "If you look at a raw JWT, it just looks like a long string of random gibberish separated by two periods. However, it consists of three distinct parts:",
        points: [
          { bold: "The Header:", text: "The first section. It simply declares what algorithm is being used to secure the token (e.g., HS256)." },
          { bold: "The Payload (Data):", text: "The middle section. Contains the actual information about the user: sub (the subject, usually the user ID), iat (issued at time), and exp (expiration time)." },
          { bold: "The Signature:", text: "The final section, and the most important. The server takes the Header and the Payload, combines them, and mathematically hashes them using its own private SECRET_KEY." },
          { bold: "How the Signature Prevents Tampering:", text: "Because the payload is just Base64 encoded, a user could decode the token and change their User ID. However, when that tampered token is sent back, the server re-hashes the altered payload with its SECRET_KEY. Since the payload was changed, the math won't match up, and the server instantly rejects the token as invalid." }
        ]
      }
    ],
    handsOn: ["Install python-jose", "Create access token", "Set token expiry"],
    example: "Token generation on login",
    codingTask: "Generate JWT token after successful login.",
    assignment: "Add expiry time and secret key configuration.",
    explanation: "JWT tokens identify users securely without storing sessions.",
    resourceLinks: [{ title: "JWT Tokens", url: "https://youtu.be/7Q17ubqLfaM?si=lc4325qLIYlU9Y1F" }],
    evaluationChecklist: ["Token generated", "Token contains user info", "Expiry applied"],
    gitTask: "Commit JWT token logic",
    tasks: m2Tasks(37, ["Review learning resources", "Complete hands-on: JWT token creation", "Coding task: Generate JWT on login", "Assignment: Token expiry & secret key config", "Git: Commit JWT logic"])
  },
  {
    day: 38,
    month: 2,
    week: 8,
    monthTitle: "FastAPI",
    weekTitle: "Authentication + Final Project",
    topic: "Protected Routes",
    overview: "Over the last few days, you learned how to create JSON Web Tokens (JWTs) and why they are necessary. Today, we close the loop. We will learn how to take a user's JWT, decode it, and use it to securely authorize their access to protected API endpoints.",
    content: [
      {
        heading: "The Authorization Flow",
        intro: "When a user successfully logs into your API, you generate a JWT and hand it back to them — that is authentication. Now, when that same user tries to create a note or view their profile, they will send that JWT back to your server attached to their request header. Your API must now read that token, crack it open (decode it), verify it hasn't been tampered with, and extract the user's identity. That is authorization.",
        points: [
          { bold: "Sealed Wax Envelope Analogy:", text: "Imagine your JWT is a sealed wax envelope containing a royal decree. First, you check the wax seal (verify the signature using SECRET_KEY and ALGORITHM). If the seal is broken or forged, you immediately reject it. Once you confirm the seal is authentic, you open the letter and read its contents to see who the messenger represents." }
        ]
      },
      {
        heading: "Decoding the Token in FastAPI",
        intro: "To achieve this in FastAPI, we write a dedicated function called get_current_user that acts as our 'envelope inspector.' This function takes the incoming token and uses the jwt.decode() method with the exact same SECRET_KEY and ALGORITHM that was used to originally create the token.",
        points: [
          { bold: "OAuth2PasswordBearer:", text: "Import this from fastapi.security and create: oauth2_bearer = OAuth2PasswordBearer(tokenUrl='login'). This tells FastAPI where to look for the token." },
          { bold: "JWTError:", text: "If the token is expired or tampered with, this error is triggered! Catch it and raise a 401 Unauthorized HTTP exception." },
          { bold: "401 Unauthorized:", text: "If username or user_id is None in the decoded payload, or if decoding fails, raise HTTPException with status HTTP_401_UNAUTHORIZED and detail 'Could not validate user.'" }
        ]
      },
      {
        heading: "Protecting Your Endpoints with Dependency Injection",
        intro: "Now that we have our get_current_user function, how do we actually apply it to our routes? We use FastAPI's powerful Dependency Injection system.",
        points: [
          { bold: "Depends(get_current_user):", text: "Simply add this as a parameter to any route you want to protect. FastAPI pauses and runs the get_current_user dependency first — if the token is missing or invalid, the dependency throws a 401 error and the user is blocked. If the token is valid, the dependency extracts the user dictionary and passes it directly into your route." }
        ]
      },
      {
        heading: "The Magic of the Swagger UI Lock",
        intro: "FastAPI is so well-integrated with standard security protocols that the moment you add the OAuth2PasswordBearer dependency to your application, FastAPI's auto-generated /docs page will instantly update.",
        points: [
          { bold: "Authorize Padlock:", text: "You will see a small 'Authorize' padlock icon appear at the top of your documentation and next to your protected endpoints. You can click that lock, log in with your username and password, and Swagger will automatically attach your generated JWT to all subsequent API requests — allowing you to test your secure endpoints directly in the browser!" }
        ]
      }
    ],
    handsOn: ["Use dependency injection", "Verify JWT token", "Protect endpoints"],
    example: "Only logged users can create posts",
    codingTask: "Protect APIs using JWT authentication.",
    assignment: "Make /posts and /comments accessible only to authenticated users.",
    explanation: "Interns learn authorization and how APIs restrict access.",
    resourceLinks: [{ title: "Protected Routes", url: "https://youtu.be/0A_GCXBCNUQ?si=F8G8uuhovaNkiJPg" }],
    evaluationChecklist: ["Unauthorized blocked", "Token verified", "Protected routes secure"],
    gitTask: "Commit protected route logic",
    tasks: m2Tasks(38, ["Review learning resources", "Complete hands-on: JWT verification & protection", "Coding task: Protect APIs with JWT", "Assignment: Auth-only posts & comments", "Git: Commit protected routes"])
  },
  {
    day: 39,
    month: 2,
    week: 8,
    monthTitle: "FastAPI",
    weekTitle: "Authentication + Final Project",
    topic: "Role-Based Access & Ownership",
    overview: "By now, you have successfully set up authentication (verifying who a user is) using JSON Web Tokens. Today, we are taking security one step further by implementing Role-Based Access Control (RBAC) to handle authorization (verifying what a user is allowed to do).",
    content: [
      {
        heading: "What is Role-Based Access Control?",
        intro: "Role-Based Access Control (RBAC) is an enterprise-level authorization mechanism that grants or denies access to specific endpoints or capabilities based on the 'role' assigned to a user.",
        points: [
          { bold: "Corporate Office Analogy:", text: "Imagine you are managing a massive corporate office building with hundreds of employees and dozens of rooms. Instead of individually programming each door lock to accept a specific employee's keycard, you create 'Roles.' An 'Employee' role keycard opens the front door and the breakroom. An 'Admin' role keycard also opens the secure server room." },
          { bold: "Incredibly Scalable:", text: "When a new employee is hired, you don't update the doors; you just give the person the 'Employee' role. If someone leaves or gets promoted, you simply change their role — making RBAC incredibly scalable for large organizations." }
        ]
      },
      {
        heading: "The Core Relationships in RBAC",
        points: [
          { bold: "Users to Roles:", text: "A user can be assigned one or more roles." },
          { bold: "Roles to Permissions:", text: "A single role (like 'Admin') implies multiple permissions (e.g., the ability to add users, delete notes, or change other people's roles)." },
          { bold: "Permissions to Capabilities:", text: "A specific permission gives you access to one or more endpoints/capabilities within the application." }
        ]
      },
      {
        heading: "Implementing RBAC in FastAPI",
        points: [
          { bold: "1. Add a Role to the User Model:", text: "Update your SQLAlchemy User model to include: role: Mapped[str] = mapped_column(server_default='user', nullable=False). Use server_default='user' to ensure any existing users are automatically granted the default 'user' role. Also include user.role inside the JWT token payload so it travels with the user." },
          { bold: "2. Create the Role Checker Dependency:", text: "Write a custom RoleChecker class with __init__(self, allowed_roles: List[str]) and a __call__ method. FastAPI allows instances of this class to act like functions when injected as a dependency. The __call__ method checks if current_user.role is in the list of allowed roles." },
          { bold: "403 Forbidden vs 401 Unauthorized:", text: "If the user's role doesn't match the allowed roles, raise HTTP 403 Forbidden (which means 'I know who you are, but you aren't allowed in here') — not 401 Unauthorized (which means 'I don't know who you are')." },
          { bold: "3. Protect Your Endpoints:", text: "Create an instance: admin_checker = RoleChecker(['admin']). Then inject it: @app.delete('/users/{user_id}', dependencies=[Depends(admin_checker)]). By chaining dependencies — RoleChecker depends on get_current_user, which depends on validating the JWT — FastAPI elegantly handles complex authorization logic behind the scenes." }
        ]
      }
    ],
    handsOn: ["Check post ownership", "Allow only owner to update/delete"],
    example: "User can only modify their own posts",
    codingTask: "Restrict update/delete operations to the post owner.",
    assignment: "Add role-based permission checks.",
    explanation: "Teaches advanced authorization and real-world security rules.",
    resourceLinks: [{ title: "Role-Based Access", url: "https://youtu.be/_k2M-LpxId8?si=s7gCHVl3qLO48ajQ" }, { title: "Ownership", url: "https://youtu.be/4Uya_I_Oxjk?si=YT5zRQ6xR8dOKj-U" }],
    evaluationChecklist: ["Ownership verified", "Unauthorized blocked", "Secure logic"],
    gitTask: "Commit role-based access logic",
    tasks: m2Tasks(39, ["Review learning resources", "Complete hands-on: Ownership & role checks", "Coding task: Owner-only update/delete", "Assignment: Role-based permissions", "Git: Commit role-based access"])
  },
  {
    day: 40,
    month: 2,
    week: 8,
    monthTitle: "FastAPI",
    weekTitle: "Authentication + Final Project",
    topic: "Final Project: Blog API (Complete Backend)",
    overview: "Today is the ultimate capstone project for Month 2. You are going to synthesize everything you have learned over the last several weeks to build a complete, production-ready Blog API. While there are no new concepts, here is a strategic blueprint for how you should structure this final architecture.",
    content: [
      {
        heading: "1. The Database Architecture (SQLAlchemy)",
        intro: "You will need three interconnected tables:",
        points: [
          { bold: "Users:", text: "Stores credentials, hashed passwords, and roles." },
          { bold: "Posts:", text: "Stores blog content. This will need a Foreign Key linking back to the Users table (One-to-Many)." },
          { bold: "Comments:", text: "Stores user feedback on posts. This will need two Foreign Keys — one linking to the Users table (who wrote it) and one linking to the Posts table (where it was posted)." }
        ]
      },
      {
        heading: "2. The Security Layer",
        intro: "You will need to construct an airtight authentication flow:",
        points: [
          { bold: "Registration Endpoint:", text: "Hashes passwords before saving." },
          { bold: "Login Endpoint:", text: "Verifies passwords and issues a signed JWT." },
          { bold: "get_current_user Dependency:", text: "Decodes tokens on protected routes." },
          { bold: "RoleChecker Dependency:", text: "Restricts certain destructive actions (like deleting other people's posts) to admin users only." }
        ]
      },
      {
        heading: "3. The CRUD Operations",
        intro: "Finally, you will expose all of this via strictly validated Pydantic models. You will build out the full Create, Read, Update, and Delete functionality for your posts and comments, ensuring that standard users can only modify their own content.",
        points: [
          { bold: "One Endpoint at a Time:", text: "This is a massive undertaking, but you have every single tool required to build it. Take it one endpoint at a time, test heavily using your Swagger /docs page, and remember to commit your milestones. Good luck!" }
        ]
      }
    ],
    codingTask: "Build Blog API with: User registration & login, JWT authentication, CRUD posts, Add comments, Protect all routes.",
    assignment: "Finalize the Blog API project.",
    explanation: "This is a production-level backend project.",
    handsOn: ["Combine authentication, JWT, Database CRUD, Relationships"],
    example: "Full Blog Backend",
    resourceLinks: [],
    evaluationChecklist: ["Auth works", "JWT secure", "CRUD complete", "DB persistence", "Code structured"],
    gitTask: "Create repo blog-api-backend, Final commit, Tag v2.0-blog-api",
    tasks: m2Tasks(40, ["Complete hands-on: Combine all backend concepts", "Coding task: Complete Blog API with auth + CRUD", "Assignment: Finalize Blog API project", "Git: Create repo, tag v2.0-blog-api"])
  }
];
