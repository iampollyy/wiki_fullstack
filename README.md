# Wiki Fullstack

Detailed guide for the Wiki Fullstack project.

## Overview

This is a tutorial fullstack project built with Node.js (Express) — a simple wiki/blog system where articles are stored as JSON files on the server. The project separates backend and frontend:

- `backend/` — an Express server that provides a REST API to retrieve and create articles. Data is stored in the `backend/data/` folder as individual `.json` files.
- `frontend/` — the client side built with React + TypeScript, bundled with Vite. A Quill-based editor (`react-quill-new`) is used.

The project is convenient for local development and experimenting with a simple file-based article storage.

## Technologies

- Backend: Node.js, Express, CORS
- Frontend: React, TypeScript, Vite, React Router, react-quill-new
- Bundler: Vite

## Repository structure (key folders)

- `backend/`

  - `server.js` — server entry point
  - `app.js` — Express app setup and routes
  - `routes/routes.js` — API routes (GET/POST for articles)
  - `services/articleService.js` — simple JSON file operations in `data/`
  - `data/` — article files: `*.json`

- `frontend/`
  - `src/` — React source files
  - `src/core/app` — App and mount point
  - `vite.config.js` — Vite config, path aliases
  - `package.json` — scripts for development and build

## Installation and running (local, Windows PowerShell)

Note: the commands below are for Windows PowerShell (`powershell.exe`).

1. Install backend dependencies:

```powershell
cd backend
npm install
```

2. Start the backend server:

```powershell
npm start
# or
node server.js
```

By default the server runs on port 5000 and logs: `Server is running on http://localhost:5000`.

3. Install dependencies and run the frontend:

```powershell
cd ../frontend
npm install
npm run dev
```

Vite typically starts its dev server on http://localhost:5173. The exact URL will be shown in the Vite console.

4. Production build for the frontend:

```powershell
cd frontend
npm run build
```

If you want to serve the built frontend from the backend, you can copy the contents of `frontend/dist` into a static folder on the server and configure Express to serve static files (this is not automated in the current version).

## API (backend)

Base path: `http://localhost:5000/articles`

- GET /articles

  - Description: returns a list of all articles (reads all JSON files in `backend/data/` and returns brief information for each).
  - Response: an array of objects { id, title, birthYear, nationality, occupation, knownFor, content }

- GET /articles/:id

  - Description: returns the full article by id (reads `data/{id}.json`).
  - Success: 200 + article object
  - Error: 404 if the file is not found

- POST /articles
  - Description: creates a new article. The server expects JSON in the request body.
  - Fields: { title, birthYear?, nationality?, occupation?, knownFor?, content }
    - Required: `title`, `content`.
    - `knownFor` is expected as a string with comma-separated items; the service converts it to an array.
  - Success: 201 { id, message }

Examples (curl / PowerShell):

```powershell
# Get all articles
curl http://localhost:5000/articles

# Get one article
curl http://localhost:5000/articles/1761560103580

# Create an article (example)
curl -Method POST http://localhost:5000/articles -Body (ConvertTo-Json @{ title='New'; content='Text' }) -ContentType 'application/json'
```
or you can use UI on a frontend.

Note: you can use Postman/Insomnia or fetch from the frontend.

## Data storage

All articles are stored as separate JSON files in `backend/data/`. When creating a new article, `Date.now().toString()` is used as the id (file name `{id}.json`). The service provides:

- reading all files (sync) and building a list;
- reading a file by id (sync);
- writing a new file when creating an article.

Important: this is a simple file-based scheme without transactions/locks; it's suitable for demos and local development but not for production.
