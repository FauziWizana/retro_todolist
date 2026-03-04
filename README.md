# 📋 Kanban To Do List

A personal Kanban board application built with Next.js — visually manage your tasks with drag-and-drop, customizable columns, and per-user authentication.

## Features

- **Authentication** — Secure sign up and login via email & password (powered by [Better Auth](https://better-auth.com))
- **Kanban Board** — Drag-and-drop cards between columns using `@dnd-kit`
- **Column Management** — Create, rename, reorder, and color-code columns; default columns (_To Do_, _In Progress_, _Done_) are seeded on first login
- **Card Management** — Create and edit task cards with title, description, deadline, checklists, labels, and file attachments
- **Themes** — Light, dark, and a special _Retro_ theme featuring an animated Tamagotchi productivity pet (Pokémon TCG card style)
- **Responsive Sidebar** — Collapsible sidebar with motivational quotes

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | Radix UI + shadcn/ui |
| Drag & Drop | @dnd-kit |
| Auth | Better Auth |
| ORM | Drizzle ORM |
| Database | SQLite (via better-sqlite3) |

## Getting Started

### Prerequisites

- Node.js 18+
- npm / pnpm / yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd todolistlagi

# Install dependencies
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
BETTER_AUTH_SECRET=your_secret_key_here
BETTER_AUTH_URL=http://localhost:3000
```

> Generate a strong secret with: `openssl rand -base64 32`

### Database Setup

```bash
# Push schema to the SQLite database
npm run db:push
```

Or generate and run migrations explicitly:

```bash
npm run db:generate
npm run db:migrate
```

To open Drizzle Studio (visual DB browser):

```bash
npm run db:studio
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm run start
```

## Project Structure

```
├── app/
│   ├── (auth)/          # Login & signup pages
│   ├── api/
│   │   ├── auth/        # Better Auth handler
│   │   ├── cards/       # Cards REST API
│   │   └── columns/     # Columns REST API
│   ├── layout.tsx
│   └── page.tsx         # Kanban board page (protected)
├── components/
│   ├── KanbanBoard.tsx  # Main board with DnD context
│   ├── KanbanColumn.tsx # Individual column component
│   ├── TaskCard.tsx     # Draggable task card
│   ├── CardDialog.tsx   # Card create/edit modal
│   ├── ColumnDialog.tsx # Column create/edit modal
│   ├── Sidebar.tsx      # Collapsible sidebar
│   ├── Header.tsx       # Top navigation bar
│   └── ThemeProvider.tsx
├── lib/
│   ├── auth.ts          # Better Auth server config
│   ├── auth-client.ts   # Better Auth client config
│   └── db/
│       ├── index.ts     # Drizzle DB instance
│       └── schema.ts    # Database schema
├── drizzle.config.ts
└── middleware.ts        # Route protection
```

## Database Schema

```
Users ──< Columns ──< Cards ──< Checklists
                              └──< Attachments
```

- **user** — registered users (managed by Better Auth)
- **column** — per-user Kanban columns with color and position
- **card** — task cards belonging to a column, with deadline, description, labels, etc.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push schema changes to DB |
| `npm run db:generate` | Generate migration files |
| `npm run db:migrate` | Run pending migrations |
| `npm run db:studio` | Open Drizzle Studio |

## License

ISC
