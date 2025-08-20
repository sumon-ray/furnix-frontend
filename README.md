# FurniX Preview

This is a fully working preview of a furniture e‑commerce app using Next.js App Router, TypeScript, Tailwind, shadcn/ui, Redux Toolkit + RTK Query + redux-persist, React Hook Form, and React Toastify.

What is included:
- Products with variants, filters, pagination, SEO-friendly slugs.
- Search, "Frequently Bought Together", product detail with variant selection.
- Cart with variant-level lines and persistence; multi-step checkout with totals.
- JWT-like auth (preview-safe), roles: SUPER_ADMIN, ADMIN, DISTRIBUTOR, CUSTOMER.
- Admin dashboard: products CRUD, orders list + status updates, users.
- Distributor dashboard: assigned orders processing.
- Custom Furniture Orders: upload images/PDFs, tracked as submissions.
- Simulated real-time low-stock alerts via polling.

How to try:
- Login with seed users (password for all: `password`):
  - super@furnix.dev (SUPER_ADMIN)
  - admin@furnix.dev (ADMIN)
  - dist@furnix.dev (DISTRIBUTOR)
  - cathy@furnix.dev (CUSTOMER)
- Or register a new user.

Replace the mock backend:
- Swap /app/api/* for an Express.js API with Postgres/Mongo.
- Keep the request/response JSON shapes to reuse the frontend.
- Implement JWT issuance/rotation, Nodemailer, Twilio, Socket.io and SSLCommerz via adapters.

Security note: This preview uses in-memory storage and base64 uploads for demo only.
