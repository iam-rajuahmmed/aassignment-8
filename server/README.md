# BookNook Server API

Express.js and MongoDB backend for **BookNook – A Small Online Library**.

## Features & Highlights
- **RESTful Architecture**: Clean, modular API routes for books, borrowing operations, and authentication.
- **JWT Authentication**: Secure Bearer token authorization on all private endpoints (`POST /books`, `PATCH /books/:id`, `DELETE /books/:id`, `POST /borrows`, `GET /borrows`, `DELETE /borrows/:id`).
- **Inventory & Copies Management**: Real-time decrement (`$inc: { copies: -1 }`) on book borrowing and increment (`$inc: { copies: 1 }`) on book return.
- **Strict Anti-Duplicate Borrowing**: Prevents users from borrowing the same title twice concurrently.
- **Automated Database Seeding**: Auto-initializes curated, authentic library records when the database is first connected.

## API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/` | Public | API health check and route directory |
| `GET` | `/seed` | Public | Seeds initial library books into collection |
| `POST` | `/auth/jwt` | Public | Generates a 7-day signed JWT token |
| `GET` | `/books` | Public | Fetches books (supports `limit`, `sort`, `category`, `search`) |
| `GET` | `/books/:id` | Public | Fetches detailed information for a single book |
| `POST` | `/books` | Protected (JWT) | Adds a new book to the library |
| `PATCH` | `/books/:id` | Protected (JWT) | Updates existing book information |
| `DELETE` | `/books/:id` | Protected (JWT) | Deletes a book from the collection |
| `POST` | `/borrows` | Protected (JWT) | Borrows a book and decrements available copies |
| `GET` | `/borrows` | Protected (JWT) | Retrieves borrows of the authenticated user |
| `DELETE` | `/borrows/:id` | Protected (JWT) | Returns a borrowed book and increments copies |

## Setup Instructions

1. Navigate to the `server` folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` file from `.env.example`:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLIENT_URL=http://localhost:3000
   ```
4. Start the server:
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

