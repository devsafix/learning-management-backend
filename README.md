# Online Learning Platform - Backend

This is the **backend** of the Online Learning Platform, built with **Node.js, Express, TypeScript, and MongoDB (Mongoose)**.
It handles authentication, course and category management, payments, and role-based access for Admins, Instructors, and Students.

---

## Features

- **Authentication & Authorization**

  - JWT authentication
  - Role-based access (Admin, Instructor, Student)

- **Course Management**

  - Add, update, and delete courses
  - Assign categories

- **Category Management**

  - Create and fetch categories

- **Payment Integration**

  - Payment gateway support
  - Success and cancel routes

- **Admin**

  - Manage users and courses

- **Instructor**

  - Create and manage courses
  - View enrolled students

---

## Tech Stack

- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- Zod (request validation)
- JWT & Bcrypt
- Multer (file uploads)
- CORS & Cookie Parser

---

## Folder Structure

```
backend/
│── src/
│   ├── modules/       # Feature modules (auth, user, course, category, payment, etc.)
│   ├── middlewares/   # Auth, validation, error handling
│   ├── utils/         # Helper functions
│   ├── config/        # Environment configuration
│   ├── app.ts         # Express app setup
│   └── server.ts      # Entry point
│
│── package.json
│── tsconfig.json
│── .env
```

---

## Installation & Setup

1. Clone the repository

   ```bash
   git clone https://github.com/devsafix/learning-management-backend
   cd learning-management-backend
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Create a `.env` file:

   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/online-learning
   JWT_SECRET=your-secret
   FRONTEND_URL=http://localhost:3000
   ```

4. Run in development

   ```bash
   npm run dev
   ```

5. Build & run in production

   ```bash
   npm run build
   npm start
   ```

---

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` – Register new user
- `POST /api/v1/auth/login` – Login user
- `GET /api/v1/auth/me` – Get logged-in user details

### Courses

- `POST /api/v1/courses` – Create course (Instructor/Admin only)
- `GET /api/v1/courses` – Get all courses
- `GET /api/v1/courses/:id` – Get single course
- `PATCH /api/v1/courses/:id` – Update course
- `DELETE /api/v1/courses/:id` – Delete course

### Categories

- `POST /api/v1/categories` – Create category
- `GET /api/v1/categories` – Get all categories

### Payments

- `POST /api/v1/payments/create` – Create payment session
- `GET /api/v1/payments/success` – Payment success callback
- `GET /api/v1/payments/cancel` – Payment cancel callback

---

## License

This project is licensed under the **MIT License**.

---
