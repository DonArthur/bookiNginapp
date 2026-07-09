# bookiNginapp

A robust, architecture-first booking application focused on absolute stability, ACID-compliant reservation states, and typed state isolation.

---

## Project Architecture

This repository is managed as a clean **Monorepo** structure, ensuring strict separation of concerns between our data layers and user interface:

```text
bookiNginapp/
├── apps/
│   ├── backend/   # Node.js + Fastify + TypeScript + PostgreSQL
│   └── frontend/  # Next.js + TanStack React-Query + Zustand + Tailwind
```

## Key Technical Focus

- **Data Consistency:** Utilizing relational integrity and atomic transactions to solve concurrent checkout race conditions (the "double-booking" problem).
- **State Separation:** Strict boundaries between server-cached state (TanStack Query) and local UI states (Zustand).
- **Modern Node Engine:** Powered by Fastify for high-throughput JSON performance and native TypeScript compilation.

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
```bash
cd apps/backend
```
2. Install dependencies:
```bash
npm install
```
3. Run the development server with hot-reload:
```bash
npm run dev
```
4. Verify the health status by visiting *http://localhost:5000/health*.

## Tech Stack Blueprint

- **Frontend:** Next.js, TanStack React-Query, Zustand, Tailwind CSS
- **Backend:** Node.js, Fastify, TypeScript
- **Database:** PostgreSQL

---