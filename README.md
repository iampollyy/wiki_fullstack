# Wiki Fullstack


## About the Project

**Wiki Fullstack** is a modern collaborative wiki/documentation platform designed for teams to create, edit, and maintain shared knowledge. The application provides a rich text editing experience with workspaces to organize content, version history to track changes, and a discussion system for feedback and collaboration.

The project demonstrates professional fullstack development practices with:

- Clean separation of concerns (frontend/backend)
- RESTful API architecture
- Real-time updates using WebSockets
- Secure authentication with JWT
- Role-based access control
- Comprehensive database migrations

## Key Features

- **📝 Rich Text Editor** — Create and edit articles with a powerful WYSIWYG editor (React Quill)
- **📁 Workspace Organization** — Group related articles into logical workspaces
- **📚 Version Control** — Full article version history with the ability to view and rollback to previous versions
- **💬 Comments & Discussion** — Collaborative discussions with comments on articles
- **🔐 User Authentication** — Secure login and registration with JWT tokens
- **👥 Role-Based Access** — Admin and user roles with permission management
- **🖼️ File Attachments** — Upload and attach files to articles
- **🔄 Real-Time Updates** — Instant updates across all connected clients using Socket.IO
- **📱 Responsive Design** — Works seamlessly on desktop, tablet, and mobile devices
- **✨ Modern UI** — Clean, intuitive interface built with React and SCSS

## Technology Stack

### Backend

- **Node.js & Express.js** — Server framework and routing
- **PostgreSQL** — Relational database
- **Sequelize ORM** — Database query builder and migration tool
- **Socket.IO** — Real-time bidirectional communication
- **JWT** — Secure token-based authentication
- **Multer** — File upload handling
- **CORS** — Cross-origin resource sharing

### Frontend

- **React 19** — UI library
- **TypeScript** — Type-safe JavaScript
- **React Router** — Client-side routing
- **Vite** — Fast module bundler
- **React Quill** — Rich text editor
- **Redux** — State management
- **SCSS Modules** — Component-scoped styling
- **Socket.IO Client** — Real-time communication
## Prerequisites

Before installing the application, ensure you have the following software installed:

### Required

- **Node.js** (v16.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v8.0.0 or higher) - Comes with Node.js
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **Git** (for version control) - [Download](https://git-scm.com/)

### Verify Installation

```powershell
# Check Node.js version
node --version

# Check npm version
npm --version

# Check PostgreSQL installation
psql --version
```


## Running the Application

### Development Mode

#### Terminal 1 - Start Backend Server

```powershell
cd backend
npm start
```

Expected output:

```
Server running on http://localhost:5000
Database connected
```

#### Terminal 2 - Start Frontend Dev Server

```powershell
cd frontend
npm run dev
```

Expected output:

```
VITE v... ready in ... ms

➜  Local:   http://localhost:5173/
```
