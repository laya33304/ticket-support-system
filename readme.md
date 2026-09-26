# Support Ticket Management System

A full-stack **Support Ticket Management System** that allows customers to create and track support tickets while agents can manage, update, and resolve tickets. The application provides secure authentication, role-based access control, ticket management, comments, and RESTful APIs.

## Features

### Authentication & Authorization

- User registration and login
- Password hashing using bcrypt
- JWT-based authentication
- Role-based access control
- Customer and Agent roles
- Protected API routes
- Unauthorized and forbidden request handling

### Customer Features

- Register and login
- Create support tickets
- View their tickets
- View individual ticket details
- Update ticket information where permitted
- Add comments to tickets
- Track ticket status and priority

### Agent Features

- Login as an agent
- View support tickets
- Update ticket status
- Update ticket priority
- Assign tickets to agents
- Add comments
- Manage customer support requests

### Ticket Management

- Create tickets
- Retrieve all accessible tickets
- Retrieve a ticket by ID
- Update ticket details
- Ticket status management
- Ticket priority management
- Agent assignment
- Ticket comments
- Automatic timestamps

### API Testing

Postman collection includes tests for:

- Successful registration
- Successful login
- Invalid login
- Create ticket
- Get tickets
- Get ticket by ID
- Update ticket
- Unauthorized API request
- Forbidden request for incorrect role
- Invalid input
- Not-found ticket

### Automated Testing

The application is designed to include automated API/unit testing for scenarios such as:

- Valid login succeeds
- Invalid password is rejected
- Ticket creation succeeds
- Unauthorized users cannot access protected data
- Customers cannot access another customer's ticket
- Agents can update ticket status
- Invalid ticket IDs return appropriate errors

---

## Technology Stack

### Frontend

- React
- Vite
- JavaScript
- HTML5
- CSS3

### Backend

- Node.js
- Express.js
- REST API
- JWT
- bcrypt
- CORS

### Database

- MySQL
- MySQL2
- Aiven Cloud MySQL

### Testing

- Postman
- Jest
- Supertest

### Deployment

- Vercel — Frontend
- Render — Backend
- Aiven — MySQL Database

---

## Project Structure

```text
ticket-support-system/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── commentController.js
│   │   ├── ticketController.js
│   │   └── userController.js
│   │
│   ├── database/
│   │   └── schema.sql
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── commentRoutes.js
│   │   ├── ticketRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── tests/
│   │   └── api.test.js
│   │
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── README.md
└── .gitignore
```

---

## Database Schema

The application uses three main tables:

### Users

Stores customer and agent accounts.

```text
users
├── id
├── name
├── email
├── password_hash
├── role
└── created_at
```

Roles:

```text
customer
agent
```

### Tickets

Stores customer support requests.

```text
tickets
├── id
├── user_id
├── subject
├── description
├── priority
├── status
├── assigned_to
├── created_at
└── updated_at
```

Ticket priorities:

```text
low
medium
high
```

Ticket statuses:

```text
open
in_progress
resolved
closed
```

### Ticket Comments

Stores conversations related to tickets.

```text
ticket_comments
├── id
├── ticket_id
├── user_id
├── comment
└── created_at
```

Foreign keys maintain relationships between users, tickets, and comments.

---

# API Documentation

Base API URL:

```text
https://ticket-support-system-l63v.onrender.com/api
```

## Authentication

### Register

```http
POST /auth/register
```

Request body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Successful response:

```text
201 Created
```

Example:

```json
{
  "message": "Registration successful"
}
```

New public registrations are created with the `customer` role.

---

### Login

```http
POST /auth/login
```

Request body:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Successful login returns a JWT token.

The token must be supplied when accessing protected endpoints:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

# Ticket APIs

## Create Ticket

```http
POST /tickets
```

Authentication required.

Request:

```json
{
  "subject": "Unable to login",
  "description": "I cannot access my account.",
  "priority": "high"
}
```

Expected response:

```text
201 Created
```

---

## Get Tickets

```http
GET /tickets
```

Authentication required.

Returns tickets accessible to the authenticated user according to their role.

Expected response:

```text
200 OK
```

---

## Get Ticket By ID

```http
GET /tickets/:id
```

Example:

```http
GET /tickets/1
```

Authentication required.

Expected response:

```text
200 OK
```

If the ticket does not exist:

```text
404 Not Found
```

---

## Update Ticket

```http
PUT /tickets/:id
```

Authentication required.

Example:

```json
{
  "status": "in_progress",
  "priority": "high",
  "assigned_to": 2
}
```

Expected response:

```text
200 OK
```

---

# Comment API

Comments allow users to communicate about a support ticket.

Example endpoint:

```http
POST /tickets/:id/comments
```

Authentication is required.

Example request:

```json
{
  "comment": "We are currently investigating the issue."
}
```

---

# Authentication Flow

```text
User
 │
 │ Register
 ▼
/auth/register
 │
 ▼
Customer Account
 │
 │ Login
 ▼
/auth/login
 │
 ▼
JWT Token
 │
 │ Authorization: Bearer <token>
 ▼
Protected API
 │
 ▼
Authentication Middleware
 │
 ├── Invalid/Missing Token ──► 401 Unauthorized
 │
 └── Valid Token
        │
        ▼
     Role Check
        │
        ├── Incorrect Role ──► 403 Forbidden
        │
        └── Authorized
                │
                ▼
             Controller
```

---

# Error Handling

The API uses appropriate HTTP status codes.

| Status | Meaning                                    |
| ------ | ------------------------------------------ |
| `200`  | Request successful                         |
| `201`  | Resource successfully created              |
| `400`  | Invalid request/input                      |
| `401`  | Authentication required/invalid            |
| `403`  | Authenticated but insufficient permissions |
| `404`  | Resource not found                         |
| `409`  | Resource conflict, such as duplicate email |
| `500`  | Internal server error                      |

---

# Postman API Testing

A Postman collection is provided for testing the REST API.

The collection covers:

```text
✓ Successful Registration
✓ Successful Login
✓ Invalid Login
✓ Create Ticket
✓ Get Tickets
✓ Get Ticket By ID
✓ Update Ticket
✓ Unauthorized API Request
✓ Forbidden Request
✓ Invalid Input
✓ Ticket Not Found
```

Postman tests automatically verify expected HTTP status codes.

Example:

```javascript
pm.test("Login returns 200", function () {
  pm.response.to.have.status(200);
});
```

---

# Automated Testing

The backend includes automated API tests using Jest and Supertest.

Example test scenarios:

```text
✓ Valid login succeeds
✓ Invalid password is rejected
✓ Ticket creation succeeds
✓ Unauthorized user cannot access protected data
✓ Customer cannot access another customer's ticket
✓ Agent can update ticket status
✓ Invalid ticket ID returns the appropriate error
```

Run the tests with:

```bash
npm test
```

---

# Environment Variables

Create a `.env` file inside the `backend` directory.

```env
PORT=3000

DB_HOST=your_database_host
DB_PORT=your_database_port
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name

JWT_SECRET=your_jwt_secret
```

For the frontend, if using the Vite environment variable approach:

```env
VITE_API_URL=https://ticket-support-system-l63v.onrender.com
```

### Important

Never commit `.env` files or database credentials to GitHub.

---

# Running the Project Locally

## 1. Clone the repository

```bash
git clone https://github.com/laya33304/ticket-support-system.git
```

```bash
cd ticket-support-system
```

---

## 2. Backend Setup

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Configure the `.env` file with your database and JWT credentials.

Start the backend:

```bash
npm start
```

For development with Nodemon:

```bash
npm run dev
```

The backend will run locally at:

```text
http://localhost:3000
```

---

## 3. Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

# Production Deployment

The application is deployed using:

```text
Frontend  → Vercel
Backend   → Render
Database  → Aiven MySQL
```

### Frontend

The React/Vite frontend is deployed through Vercel.

### Backend

The Express API is deployed through Render.

### Database

The MySQL database is hosted on Aiven Cloud.

The backend connects to the cloud database using environment variables rather than hard-coded credentials.

---

# Security Features

- Passwords are hashed using bcrypt.
- JWT authentication protects private API endpoints.
- Role-based authorization distinguishes customers and agents.
- Public registration creates customer accounts.
- Database credentials are stored in environment variables.
- SQL queries use parameterized placeholders to reduce SQL injection risks.
- CORS is configured for frontend-backend communication.
- Protected resources require authentication.

---

# Future Improvements

Possible future enhancements include:

- Email notifications for ticket updates
- Password reset through email
- Agent dashboard with ticket statistics
- Search and filtering
- Pagination for large ticket lists
- File attachments
- Real-time ticket updates
- Improved audit logging
- More comprehensive automated test coverage
- API documentation using Swagger/OpenAPI

---

# Author

**Laya Reddy**

Computer Science Engineering

GitHub:
https://github.com/laya33304

---
