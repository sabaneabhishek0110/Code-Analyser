## `</>` Code Analyser
An AI-powered interactive code editor and static analysis tool. This application allows users to write algorithmic solutions in multiple languages (Java, C++, Python, JavaScript) and receive instant, AI-generated feedback on Time Complexity, Space Complexity, and overall code optimality.

## ✨ Features

* **IDE-Like Interface:** Built with Monaco Editor to provide robust syntax highlighting and a professional coding experience.
* **Resizable Workspace:** Features draggable panels, allowing users to customize the layout between the problem description, code editor, and analysis results.
* **Multi-Language Support:** Automatically populates boilerplate code for Java, C++, Python 3, and JavaScript.
* **AI Static Analysis:** Leverages Google's `gemini-2.5-flash` model to analyze computational logic without needing to directly execute the code.
* **Structured Feedback:** Returns exact Big-O notation, optimality evaluations, and suggested algorithmic patterns (e.g., "Sliding Window", "Two Pointers").

## 🏗️ Project Architecture

The application follows a standard Client-Server architecture, acting as a secure intermediary between the user and the LLM to manage prompt injection and ensure reliable JSON formatting.

### 1. Data Flow

1. **Client :** The user inputs a problem statement and their code. Upon clicking "Run Analysis", the frontend sanitizes the code payload and sends a POST request.
2. **Server :** The backend receives the payload and constructs a structured prompt. It injects the user's code and instructs the AI engine to return a raw JSON object matching a strict schema.
3. **AI Engine (Gemini API):** Google's `gemini-2.5-flash` model processes the code, evaluates the complexities, and generates the JSON string.
4. **Processing (Server):** The Spring Boot service intercepts the response, cleans any extraneous Markdown formatting, parses it into a Java Data Transfer Object (DTO), and returns a standardized HTTP 200 response to the client.
5. **UI Update (React):** The frontend receives the formatted data object and dynamically updates the Result Dashboard.

### 2. Tech Stack

* **Frontend:** React, Vite, Tailwind CSS, Monaco Editor, React-Resizable-Panels, Axios
* **Backend:** Java 21+, Spring Boot, standard `java.net.http.HttpClient`, Gson (for internal JSON handling), Jackson (for API responses)
* **AI Model:** Google Gemini API (`gemini-2.5-flash`)
