# JSONPlaceholder Explorer (React + TS)

A small React/TypeScript app that lists posts from the JSONPlaceholder API, lets you view a post’s details with its comments and the author’s info, and offers a live title search (no submit button).

## Stack & Technical Choices

- React 18 + TypeScript (Vite)
- React Router for routing
- TanStack React Query for fetching/caching and request state
- Tailwind CSS for quick, consistent styling
- ESLint (enforces arrow functions) + Prettier for code quality and formatting

## Getting Started

Prerequisite: Node 18+

- Install dependencies: `npm install`
- Start dev server: `npm run dev`

## Structure

- `src/App.tsx`: App shell (header/footer) and `<Outlet/>`
- `src/main.tsx`: React entry, Router, and React Query Provider
- `src/routes/PostsPage.tsx`: Posts list with instant search
- `src/routes/PostDetailPage.tsx`: Post details, author, comments
- `src/api/types.ts`: TS types (Post, Comment, User)
- `src/api/client.ts`: Minimal API client (fetch)
- `src/api/hooks.ts`: Typed React Query hooks
- `tailwind.config.js`, `postcss.config.js`, `src/index.css`: styling

## Linting & Formatting

- Full lint (ESLint + Prettier check): `npm run lint`
- Auto-fix ESLint and format: `npm run lint:fix`
- Format only: `npm run format`

Notable rule: `func-style: ["error", "expression"]` — prefer arrow functions for exported components, hooks, and helpers.

## Key Decisions

- Data fetching: React Query for caching, loading/error state, and simple component code. `staleTime` is 60s and `refetchOnWindowFocus: false` to avoid noisy refetches.
- Basic UX: no-button search (300ms debounce), simple loading/error states, straightforward navigation.
- Styling: Tailwind for speed and a coherent prototype.
- Arrow functions: consistent code style enforced via ESLint; not a functional advantage here, but improves consistency.

## About Title Filtering

- JSONPlaceholder actually supports querystring filters (e.g., `?title_like=...`). The current implementation uses that server-side filter for search.
- Alignment option: to strictly follow “local filtering”, switch to client-side filtering by:
  1. Always calling `GET /posts` without parameters in `api.listPosts()`
  2. Keeping all posts in memory (React Query cache)
  3. Applying a front-end `filter` on `title.toLowerCase().includes(search)` (with debounce)

This change is simple to implement if desired.

## Possible Improvements

- Stronger accessibility (labels, ARIA roles)
- Richer error states (toasts, targeted retries)
