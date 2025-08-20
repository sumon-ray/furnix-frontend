# Frontend switch to Mongo backend

- Default: in-app Next.js API routes (in-memory) for instant preview.
- Production/local Mongo: set env

NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api

Run:
1) cd backend && npm i && npm run dev
2) In frontend terminal, export NEXT_PUBLIC_API_BASE_URL then npm run dev

Note: NEXT_PUBLIC_ is required to expose variables on the client in Next.js [^2].
