# Library Management System - Backend

A Node.js/Express.js backend service for managing library operations, including user management, book tracking, and lending functionality.

## Tech Stack

- Node.js with Express.js
- TypeScript
- MySQL
- TypeORM
- Environment Configuration (dotenv)

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm (Node Package Manager)

## Project Setup

1. Clone the repository:

```bash
git clone https://github.com/KutayAraz/library-management-app-server.git
cd library-management-server
```

2. Install dependencies:

```bash
npm install
```

3. Environment Configuration:
   - Copy the `.env.example` file to create a new `.env` file
   - Update the environment variables in `.env` with your configuration:

```env
# Database Configuration
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=library_management

# Application Configuration
NODE_ENV=development
PORT=3000
```

4. Database Setup:
   - Create a MySQL database:

```sql
CREATE DATABASE library_management;
```

- Run the schema file to create tables and initial data:

```bash
mysql -u your_username -p library_management < schema.sql
```

5. Start the application:

```bash
# Development mode with hot reload
npm run dev

# Production mode
npm run start
```

## API Endpoints

### Users

- `GET /users` - Get all users
- `GET /users/:id` - Get user details with borrowed books
- `POST /users/:userId/borrow/:bookId` - Borrow a book
- `POST /users/:userId/return/:bookId` - Return a book with rating

### Books

- `GET /books` - Get all books
- `GET /books/:id` - Get book details with current owner and ratings

## API Response Examples

### Get User Details

```json
{
  "id": 2,
  "name": "Enes Faruk Meniz",
  "books": {
    "past": [
      {
        "name": "I, Robot",
        "userScore": 5
      }
    ],
    "present": [
      {
        "name": "Brave New World"
      }
    ]
  }
}
```

### Get Book Details

```json
{
  "id": 2,
  "name": "I, Robot",
  "author": "Isaac Asimov",
  "year": 1950,
  "currentOwner": "John Doe",
  "score": 5.33
}
```

## Project Structure

```
src/
├── controllers/        # Request handlers
├── entities/            # TypeORM entities
├── middleware/        # Express middlewares
├── routes/           # API routes
├── schemas/           # DB Schemas
├── data-source.ts    # TypeORM configuration
└── index.ts          # Application entry point
```

## Error Handling

The API uses standard HTTP status codes for responses:

- 200: Successful request
- 204: Successful request with no content
- 400: Bad request (client error)
- 404: Resource not found
- 500: Internal server error

Error responses include a message field with details about the error.
