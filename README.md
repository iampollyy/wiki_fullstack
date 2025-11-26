# Wiki Fullstack

Detailed guide for the Wiki Fullstack project.

**#Final Design Look
**https://www.figma.com/design/QMyUMry6eVa5fhLl2Sx9wK/Wikipedia-Redesign-NodeJS-Project?node-id=0-1&p=f&m=dev
## Overview

This is a tutorial fullstack project built with Node.js (Express) — a wiki/blog system where articles are stored in a PostgreSQL database. The project separates backend and frontend:

- `backend/` — an Express server that provides a REST API to retrieve and create articles. Data is stored in a PostgreSQL database using Sequelize ORM.
- `frontend/` — the client side built with React + TypeScript, bundled with Vite. A Quill-based editor (`react-quill-new`) is used.

The project uses database migrations for schema management, making it easy to set up the database locally.

## Technologies

- Backend: Node.js, Express, CORS, PostgreSQL, Sequelize ORM
- Frontend: React, TypeScript, Vite, React Router, react-quill-new
- Bundler: Vite
- Database: PostgreSQL

## Repository structure (key folders)

- `backend/`

  - `src/server.js` — server entry point
  - `src/app.js` — Express app setup and routes
  - `src/routes/routes.js` — API routes (GET/POST for articles)
  - `src/services/articleService.js` — article service (currently uses file storage, can be migrated to database)
  - `src/db/` — database configuration and models
    - `db.js` — Sequelize connection instance
    - `models/article.js` — Article model
    - `migrations/` — database migration files
    - `config/database.js` — Sequelize CLI configuration
  - `data/` — article files: `*.json` (legacy file-based storage)

- `frontend/`
  - `src/` — React source files
  - `src/core/app` — App and mount point
  - `vite.config.js` — Vite config, path aliases
  - `package.json` — scripts for development and build

## Database Setup

This project uses PostgreSQL as the database. Before running the application, you need to:

### Prerequisites

1. **Install PostgreSQL** (if not already installed):
   - Download from [PostgreSQL official website](https://www.postgresql.org/download/)
   - Install and make sure PostgreSQL service is running

2. **Create a database**:
   ```sql
   CREATE DATABASE wiki_db;
   ```
   Or using psql command line:
   ```powershell
   psql -U postgres -c "CREATE DATABASE wiki_db;"
   ```

### Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
# Database Configuration
DB_NAME=wiki_db
DB_USER=postgres
DB_PASS=your_password
DB_HOST=localhost
DB_PORT=5432

# Server Configuration
PORT=5000

# Socket.IO Configuration (optional)
SOCKET_ORIGIN=*
SOCKET_PATH=/socket.io
```

Replace `your_password` with your PostgreSQL password.

### Running Database Migrations

After setting up the database and environment variables, run the migrations to create the required tables:

```powershell
cd backend
npm run db:migrate
```

This will create the `Articles` table with the following columns:
- `id` (integer, primary key, auto-increment)
- `title` (string, required)
- `content` (text, required)
- `birthYear` (integer, optional)
- `nationality` (string, optional)
- `occupation` (string, optional)
- `knownFor` (text, optional)
- `attachments` (JSONB, optional, default: [])
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

**Migration Commands:**
- `npm run db:migrate` - Run pending migrations
- `npm run db:migrate:undo` - Undo the last migration
- `npm run db:migrate:undo:all` - Undo all migrations
- `npm run db:migrate:status` - Check migration status

## Installation and running (local, Windows PowerShell)

Note: the commands below are for Windows PowerShell (`powershell.exe`).

1. **Install backend dependencies:**

```powershell
cd backend
npm install
```

2. **Set up the database** (see [Database Setup](#database-setup) section above):
   - Create PostgreSQL database
   - Create `.env` file with database credentials
   - Run migrations: `npm run db:migrate`

3. **Start the backend server:**

```powershell
npm start
# or
node src/server.js
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

Articles are stored in a PostgreSQL database using Sequelize ORM. The database schema is managed through migrations located in `backend/src/db/migrations/`.

**Key features:**
- Database migrations for version-controlled schema changes
- Sequelize ORM for type-safe database operations
- PostgreSQL with support for JSONB data types
- Automatic timestamps (createdAt, updatedAt)

**Note:** The project currently still has a file-based article service in `backend/data/` for backwards compatibility. Consider migrating the article service to use the database model instead of file operations.
