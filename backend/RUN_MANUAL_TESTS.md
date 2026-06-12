# AGENT.OS Backend & Voice Manual Run & Testing Guide

This guide walks you through starting the backend server manually, running each phase of the backend test suite, executing direct HTTP validations, and testing the voice navigation system in the browser.

---

## 🛠️ Step 1 — Setup Environment

Before running the server or tests, ensure your `backend/.env` file is configured with the correct keys. Since the project runs on **Google Gemini** for LLM generation and **Voyage AI** for embeddings, verify the following variables are present:

```env
PORT=8000
ENVIRONMENT=development
FRONTEND_URL=http://localhost:5173

SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_KEY=your-supabase-service-key

VOYAGE_API_KEY=your-voyage-api-key
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-1.5-flash
```

---

## 🚀 Step 2 — Start the FastAPI Server

Navigate to the `backend/` directory and launch the server using `uvicorn`:

```bash
# Go to the backend folder
cd portfolio/backend

# Install dependencies if you haven't already
pip install -r requirements.txt

# Start the server on port 8000
python -m uvicorn main:app --reload --port 8000
```

### Expected Output:
```text
INFO:     Will watch for changes in these directories: ['C:\\Users\\mahip\\OneDrive\\Desktop\\pk\\portfolio\\backend']
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [5900] using WatchFiles
```

---

## 🧪 Step 3 — Run the Integration Test Suite

The backend contains modular verification tests located under the `tests/` directory. 
> [!NOTE]
> On Windows consoles, always run Python commands with the `-u` (unbuffered) and `-X utf8` (UTF-8 encoding) flags to ensure unicode status symbols (like ✅ and ❌) print correctly.

Run the tests in this exact order:

### 1. Environment Config Check (Phase 2)
Verifies that all required API keys are active and follow the expected patterns.
```bash
python -u -X utf8 tests/test_config.py
```
*   **Expected Output:** `✅ All environment variables present`

### 2. Voyage AI Embedding Service Check (Phase 3)
Verifies embedding generation for query, document, and batch texts.
```bash
python -u -X utf8 tests/test_embeddings.py
```
*   **Expected Output:** `Ran 4 tests in X.XXs ... OK`
*   *(Note: Automatic retry logic sleeps for 20s if Voyage Trial API rate limits are encountered).*

### 3. Ingestion Verification Check (Phase 9)
Verifies that the core 21 portfolio chunks are successfully ingested in the database.
```bash
python -u -X utf8 tests/test_ingestion.py
```
*   **Expected Output:** `Ran 1 test in X.XXs ... OK`

### 4. Supabase Connection & SQL Functions Check (Phase 4)
Verifies client connectivity and the `match_chunks` PostgreSQL vector search function.
```bash
python -u -X utf8 tests/test_supabase.py
```
*   **Expected Output:** `Ran 2 tests in X.XXs ... OK`

### 5. LLM Response generation (Phase 5)
Checks Gemini text responses, conversation history tracking, and the hallucination guard.
```bash
python -u -X utf8 tests/test_claude.py
```
*   **Expected Output:** `Ran 3 tests in X.XXs ... OK`
*   *(Note: If Gemini API limits are hit, it falls back to Mock LLM responses gracefully).*

### 6. RAG Pipeline End-to-End Test (Phase 6)
Executes 8 core queries (skills, projects, experience, contact, FAQ) against the database and checks keyword inclusion.
```bash
python -u -X utf8 tests/test_pipeline.py
```
*   **Expected Output:** `Ran 1 test in X.XXs ... OK`

---

## 📡 Step 4 — Run HTTP & Route Verifications (Phase 7)

Use the built-in HTTP client runner to trigger health endpoints, CORS checks, empty field validations, and rate-limiting blocks. Make sure the backend server is running on port 8000 in another terminal, then run:

```bash
python -u -X utf8 test_endpoints.py
```

### What `test_endpoints.py` validates:
1.  **Health Check** (`GET /api/health`): Verifies Status `200` and returns environment models metadata.
2.  **Projects** (`GET /api/projects`): Verifies projects loaded from Supabase (or json fallback).
3.  **Telemetry** (`GET /api/telemetry`): Fetches database execution footprint stats.
4.  **Chat RAG** (`POST /api/chat`): Tests successful session retrieval and reasoning log structures.
5.  **Empty Validation**: Verifies sending blank messages results in a `422 Unprocessable Entity` error.
6.  **CORS OPTIONS Headers**: Validates the presence of `Access-Control-Allow-Origin` for frontend port `5173`.
7.  **Rate Limiting**: Sends 25 fast requests to trigger a `429 Too Many Requests` error after 20 attempts.

---

## 🗣️ Step 5 — Voice Navigation Browser Console Check (Phase 8)

To test Speech-to-Text, Text-to-Speech, and intent detection:

1.  Start the Vite React frontend:
    ```bash
    cd portfolio/frontend
    npm run dev
    ```
2.  Open the web console at `http://localhost:5173`.
3.  Copy and paste the following intent detection test script to verify manual browser voice routing:

```javascript
const SECTION_KEYWORDS = {
  about:        ["about", "who", "background"],
  skills:       ["skills", "expertise", "tech"],
  projects:     ["projects", "built", "portfolio"],
  experience:   ["experience", "internship", "microsoft"],
  education:    ["education", "university", "degree"],
  achievements: ["achievements", "hackathon", "awards"],
  contact:      ["contact", "email", "hire"]
};

const detectIntent = (transcript) => {
  const text = transcript.toLowerCase();
  for (const [section, keywords] of Object.entries(SECTION_KEYWORDS)) {
    if (keywords.some(k => text.includes(k))) {
      return { type: "navigate", section };
    }
  }
  return null;
};

// Verify commands:
const commands = [
  "show me skills",
  "tell me about projects",
  "go to experience",
  "open contact",
  "who is Pavan"
];

commands.forEach(cmd => {
  console.log(`"${cmd}" ➔`, detectIntent(cmd));
});
```
