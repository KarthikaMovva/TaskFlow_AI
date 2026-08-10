# TaskFlow AI — Modern SaaS Frontend

TaskFlow AI is an AI-powered project and task management platform built with React, Next.js App Router, TypeScript, Tailwind CSS, and shadcn/ui, seamlessly integrated with an Express/Prisma/PostgreSQL REST API.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui primitives + Lucide React icons
- **API Client**: Axios with JWT Bearer Token interceptor
- **State Management**: React Context API (`AuthContext`, `WorkspaceContext`)
- **Data Fetching**: TanStack React Query
- **Notifications**: react-hot-toast

---

## 📁 Directory Structure

```text
frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── page.tsx            # Dashboard Overview
│   │   ├── projects/           # Projects list & detail
│   │   ├── kanban/             # Kanban Board
│   │   ├── tasks/              # Tasks Table & Inspector
│   │   ├── ai-insights/        # AI Intelligence & Health Score
│   │   ├── activity/           # Workspace Audit Log
│   │   ├── notifications/      # Notifications Center
│   │   └── settings/           # Profile & Org/Workspace Settings
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                     # shadcn/ui primitives
│   ├── layout/                 # Sidebar, Navbar, MobileSidebar
│   ├── projects/               # Create Project modal & project cards
│   ├── kanban/                 # KanbanColumn, KanbanCard
│   ├── tasks/                  # CreateTaskModal, TaskDetailSheet
│   └── auth/                   # LoginForm, RegisterForm, ProtectedRoute
├── src/
│   ├── api/                    # Modular API layer (Axios client)
│   ├── context/                # AuthContext & WorkspaceContext
│   ├── hooks/                  # Custom hooks (useAuth, useWorkspace)
│   ├── types/                  # TypeScript interfaces matching backend models
│   └── lib/                    # Token storage & utils
```

---

## 🔑 Authentication Flow

1. User registers (`/register`) or logs in (`/login`).
2. Server returns JWT `accessToken` and `refreshToken`.
3. Interceptor automatically attaches `Authorization: Bearer <token>` to all API requests.
4. `AuthProvider` validates user session on app mount via `/api/test-auth`.
5. Protected routes redirect unauthenticated users to `/login`.

---

## 🌐 API Integration

All frontend services communicate directly with the Express backend at `http://localhost:5000/api`:

- `auth.api.ts`: `/api/auth/*` & `/api/test-auth`
- `organization.api.ts`: `/api/organizations/*`
- `workspace.api.ts`: `/api/workspaces/*`
- `project.api.ts`: `/api/projects/*`
- `task.api.ts`: `/api/tasks/*`
- `kanban.api.ts`: `/api/kanban/*`
- `comment.api.ts`: `/api/comments/*`
- `activity.api.ts`: `/api/activity/*`
- `notification.api.ts`: `/api/notifications/*`
- `ai.api.ts`: Real-time AI engine calculating Health Score (0-100), Risk Detection, Workload Telemetry, and Recommendations.

---

## 🚀 Running the Frontend

### 1. Install dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env.local` file in `frontend/`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```
