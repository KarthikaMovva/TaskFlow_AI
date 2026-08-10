# TaskFlow AI

TaskFlow AI is a modern AI-powered task and project management application built with a React frontend and an Express backend. It enables users to organize projects, manage tasks, collaborate efficiently, and track progress through an intuitive interface.

---

## Features

- User authentication
- Project management
- Task creation, editing, and deletion
- Task status updates
- AI-powered productivity assistance
- Activity tracking
- Responsive UI
- Secure REST API
- PostgreSQL database with Prisma ORM

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Axios

### Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL

---

## Project Structure

```
taskflow-ai/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   ├── prisma/
│   └── package.json
│
└── README.md
```

---

## Installation

### Clone

```bash
git clone <repository-url>
cd taskflow-ai
```

### Install Frontend

```bash
cd frontend
npm install
```

### Install Backend

```bash
cd backend
npm install
```

---

## Environment Variables

Create a `.env` file in the backend directory.

Example:

```env
DATABASE_URL=url
JWT_SECRET=your-secret
PORT=5000
```

---

## Database

Generate Prisma client

```bash
npx prisma generate
```

Run migrations

```bash
npx prisma migrate dev
```

Seed database (if available)

```bash
npx prisma db seed
```

---

## Running the Application

### Backend

```bash
npm run dev
```

Runs on:

```
http://localhost:5000
```

### Frontend

```bash
npm run dev
```

Runs on:

```
http://localhost:3000
```

---

## API Overview

### Authentication

- POST /api/auth/login
- POST /api/auth/register

### Projects

- GET /api/projects
- POST /api/projects
- PUT /api/projects/:id
- DELETE /api/projects/:id

### Tasks

- GET /api/tasks
- POST /api/tasks
- PUT /api/tasks/:taskId
- DELETE /api/tasks/:taskId

---

## Future Enhancements

- AI task prioritization
- Calendar integration
- Team collaboration
- Notifications
- File attachments
- Analytics dashboard
- Mobile support

