# Wiki Fullstack

A collaborative wiki/blog platform built with modern web technologies. Create, edit, and discuss articles in organized workspaces with real-time features.

## 🎨 Design

**Final Design Look:** [Wikipedia Redesign NodeJS Project](https://www.figma.com/design/QMyUMry6eVa5fhLl2Sx9wK/Wikipedia-Redesign-NodeJS-Project?node-id=0-1&p=f&m=dev)

## 📋 Overview

This is a fullstack project built with Node.js and React—a collaborative wiki system where articles are organized into workspaces with version control and commenting features.

**Key Features:**

- 📝 Rich text editor for creating and editing articles
- 📁 Workspace organization for articles
- 📚 Article version history with rollback capability
- 💬 Comments and discussions on articles
- 🖼️ File attachments support
- 🔄 Real-time updates with Socket.IO
- 📱 Responsive UI

**Architecture:**

- `backend/` — Node.js/Express REST API with PostgreSQL database and Sequelize ORM
- `frontend/` — React + TypeScript single-page application bundled with Vite

## 🛠️ Technologies

**Backend:**

- Node.js, Express.js, Socket.IO
- PostgreSQL, Sequelize ORM
- CORS, Multer (file uploads)

**Frontend:**

- React 19, TypeScript, React Router
- Vite (bundler)
- React Quill (rich text editor)
- SCSS modules for styling
- Socket.IO client for real-time updates

## 📁 Project Structure

### Backend (`backend/`)

```
backend/
├── src/
│   ├── server.js              # Server entry point
│   ├── app.js                 # Express app setup
│   ├── routes/                # API endpoints
│   │   ├── articleRoutes.js       # Article CRUD
│   │   ├── articleVersionRoutes.js # Version history
│   │   ├── commentRoutes.js       # Comments/discussions
│   │   └── workspaceRoutes.js     # Workspace management
│   ├── services/              # Business logic
│   │   ├── articleService.js
│   │   ├── articleVersionService.js
│   │   ├── commentService.js
│   │   ├── workspaceService.js
│   │   └── notificationService.js
│   ├── db/                    # Database
│   │   ├── db.js                  # Sequelize connection
│   │   ├── models/                # Data models (Article, Comment, Workspace, ArticleVersion)
│   │   ├── migrations/            # Database schema migrations
│   │   └── config/
│   ├── config/                # Configuration
│   │   └── socket.js          # Socket.IO setup
│   └── middleware/
│       └── fileUpload.js       # Multer file upload
├── uploads/                   # Uploaded files
└── package.json
```

### Frontend (`frontend/`)

```
frontend/
├── src/
│   ├── core/                  # Core setup
│   │   ├── app/              # Main App component
│   │   └── router/           # Routing configuration
│   ├── entities/             # Data entities
│   │   ├── comment/          # Comment component
│   │   └── workspace/        # Workspace component
│   ├── features/             # Feature modules
│   │   ├── createArticle/    # Article editor
│   │   ├── createComment/    # Comment form
│   │   └── editComment/      # Edit comment form
│   ├── pages/                # Page components
│   │   ├── ArticlePage/      # Single article view
│   │   ├── ArticlesPage/     # Articles list
│   │   ├── ArticleVersionPage/
│   │   ├── DiscussionPage/   # Comments section
│   │   ├── HomePage/         # Home page
│   │   └── WorkspacePage/    # Workspace view
│   ├── shared/               # Shared components
│   │   └── ui/              # Reusable UI components
│   └── styles/              # Global styles
└── package.json
```

## ⚙️ Database Setup

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
   ```

   ```

### Environment Variables

Create a `.env` file in the `backend/` directory:

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

### Running Migrations

```powershell
cd backend
npm install
npm run db:migrate
```

**Migration Commands:**

- `npm run db:migrate` — Run pending migrations
- `npm run db:migrate:undo` — Undo the last migration
- `npm run db:migrate:undo:all` — Undo all migrations
- `npm run db:migrate:status` — Check migration status

## 🚀 Installation & Running

### Backend Setup

1. **Install dependencies:**

```powershell
cd backend
npm install
```

2. **Set up the database** (see [⚙️ Database Setup](#-database-setup) section above):

   - Create PostgreSQL database
   - Create `.env` file with database credentials
   - Run migrations: `npm run db:migrate`

3. **Start the backend server:**

```powershell
npm start
# Server runs on http://localhost:5000
```

### Frontend Setup

1. **Install dependencies and run:**

```powershell
cd ../frontend
npm install
npm run dev
```

Vite dev server typically runs on http://localhost:5173.

2. **Production build:**

```powershell
npm run build
```

## 🔌 API Endpoints

### Articles

| Method | Endpoint                      | Description            |
| ------ | ----------------------------- | ---------------------- |
| GET    | `/articles`                   | Get all articles       |
| GET    | `/articles/:id`               | Get single article     |
| POST   | `/articles`                   | Create new article     |
| PUT    | `/articles/:id`               | Update article         |
| DELETE | `/articles/:id`               | Delete article         |
| POST   | `/articles/upload-attachment` | Upload file attachment |

**Example:**

```powershell
# Get all articles
curl http://localhost:5000/articles

# Get single article
curl http://localhost:5000/articles/1

# Create article
curl -Method POST http://localhost:5000/articles `
  -Body (ConvertTo-Json @{ title='My Article'; content='Content here' }) `
  -ContentType 'application/json'
```

### Comments

| Method | Endpoint                       | Description              |
| ------ | ------------------------------ | ------------------------ |
| GET    | `/comments/article/:articleId` | Get comments for article |
| POST   | `/comments/article/:articleId` | Add comment              |
| PUT    | `/comments/:id`                | Update comment           |
| DELETE | `/comments/:id`                | Delete comment           |

### Article Versions

| Method | Endpoint                                       | Description          |
| ------ | ---------------------------------------------- | -------------------- |
| GET    | `/articles/:articleId/versions`                | Get all versions     |
| GET    | `/articles/:articleId/versions/:versionNumber` | Get specific version |
| GET    | `/articles/:articleId/versions/id/:versionId`  | Get version by ID    |

### Workspaces

| Method | Endpoint                 | Description           |
| ------ | ------------------------ | --------------------- |
| GET    | `/workspaces`            | Get all workspaces    |
| GET    | `/workspaces/slug/:slug` | Get workspace by slug |
| POST   | `/workspaces`            | Create workspace      |

## 📊 Data Storage

Articles and related data are stored in PostgreSQL with Sequelize ORM. The database schema is version-controlled through migrations.

### Key Features:

- ✅ Database migrations for schema management
- ✅ Sequelize ORM for type-safe operations
- ✅ JSONB columns for flexible data storage (attachments)
- ✅ Automatic timestamps (createdAt, updatedAt)
- ✅ Foreign key relationships between tables

## 🔧 Scripts

### Backend

```powershell
npm start                       # Start server
npm run db:migrate             # Run migrations
npm run db:migrate:undo        # Undo last migration
npm run db:migrate:status      # Check migration status
```

### Frontend

```powershell
npm run dev                    # Start dev server
npm run build                  # Production build
npm run preview               # Preview production build
npm run lint                  # Run ESLint
npm run type-check           # Run TypeScript type checking
```

## 📝 Notes

- **Real-time Updates:** Socket.IO is configured for real-time notifications
- **File Uploads:** Multer handles file attachments; files are stored in `backend/uploads/`
- **Rich Text Editor:** React Quill provides rich text editing capabilities
- **Database:** PostgreSQL required; configure via environment variables
- **CORS:** Backend is configured to accept requests from any origin (SOCKET_ORIGIN=\*)

## 📖 Documentation

- [Figma Design](https://www.figma.com/design/QMyUMry6eVa5fhLl2Sx9wK/Wikipedia-Redesign-NodeJS-Project?node-id=0-1&p=f&m=dev)
- [Express Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Sequelize Documentation](https://sequelize.org/)
- [Vite Documentation](https://vitejs.dev/)
