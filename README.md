# 🚀 DSA Code Analyzer

An AI-powered, LeetCode-style code editor and static analysis tool. This application allows users to write algorithmic solutions in multiple languages (Java, C++, Python, JavaScript) and receive instant, AI-generated feedback on Time Complexity, Space Complexity, and code optimality.

---

## ✨ Features
* **IDE-Like Interface:** Built with Monaco Editor for syntax highlighting and a professional coding experience.
* **Resizable Workspace:** Draggable panels to adjust the layout between the problem description, code editor, and results.
* **Multi-Language Support:** Auto-populates boilerplate code for Java, C++, Python 3, and JavaScript.
* **AI Static Analysis:** Leverages Google's latest `gemini-2.5-flash` model to analyze logic without needing to execute the code.
* **Structured Feedback:** Returns exact Big-O notation, optimality checks, and suggested algorithmic patterns (e.g., "Sliding Window", "Two Pointers").

---

## 🏗️ Project Architecture

The application follows a standard Client-Server architecture, acting as a middleman between the user and the LLM to ensure prompt security and reliable JSON formatting.

### 1. Data Flow
1. **Client (React):** The user inputs a problem statement and code. Upon clicking "Run Analysis", the frontend sanitizes the code (removing carriage returns) and sends a POST request.
2. **Server (Spring Boot):** The backend receives the payload and constructs a highly specific prompt. It injects the user's code and strictly instructs the AI to return *only* a raw JSON object matching a specific schema.
3. **AI Engine (Gemini API):** Google's `gemini-2.5-flash` model processes the code, calculates complexities, and returns the JSON string.
4. **Processing (Server):** The Spring Boot service intercepts the response, cleans any rogue Markdown formatting (like ` ```json ` blocks), parses it into a Java Data Transfer Object (DTO), and sends a clean HTTP 200 response to the client.
5. **UI Update (React):** The frontend receives the formatted object and updates the Result Cards on the UI.

### 2. Tech Stack
* **Frontend:** React, Vite, Tailwind CSS, Monaco Editor, React-Resizable-Panels, Axios.
* **Backend:** Java 21+, Spring Boot, standard `java.net.http.HttpClient`, Gson (for internal JSON handling), Jackson (for API responses).
* **AI Model:** Google Gemini API (`gemini-2.5-flash`).
