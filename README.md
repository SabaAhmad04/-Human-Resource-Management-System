# Human Resource Management System (HRMS)

A full-stack HR management platform for digitizing core HR operations — employee onboarding, attendance tracking, leave management, payroll visibility, and approval workflows for Admins, HR Officers, and Employees.

## Features

- **Authentication** — Secure sign-in with role-based access (Admin / HR / Employee), auto-generated employee IDs and temporary passwords, email verification, forced password reset on first login
- **Dashboards** — Separate views for Employees, HR Officers, and Admins
- **Employee Profile Management** — View and edit personal, job, and salary details
- **Attendance Tracking** — Daily/weekly views, check-in/check-out, status indicators (Present, Absent, Half-day, Leave)
- **Leave & Time-Off Management** — Apply for leave, track status (Pending/Approved/Rejected), HR approval workflow
- **Payroll** — Read-only payroll view for employees, full control for Admins
- **Departments, Holidays, Announcements, Recruitment, Performance & Reports** — Additional HR modules

## Tech Stack

**Frontend**
- React (Vite)
- Redux Toolkit
- Tailwind CSS

**Backend**
- Node.js + Express
- MySQL (see `backend/database/schema.sql`)
- JWT-based authentication

## Project Structure

```
odoo/
├── backend/
│   ├── config/          # DB connection config
│   ├── controllers/      # Route logic (auth, employees, attendance, leave, payroll, etc.)
│   ├── database/         # SQL schema
│   ├── middlewares/       # Auth guard, validation, file upload
│   ├── routes/           # API route definitions
│   ├── utils/             # Helper functions (token generation, email sending)
│   └── server.js          # App entry point
│
└── frontend/
    ├── src/
    │   ├── components/    # Shared UI components (Layout, common widgets)
    │   ├── pages/
    │   │   ├── Auth/       # Login, Register, Forgot/Reset Password
    │   │   ├── admin/      # Admin dashboard, departments, payroll, reports, users
    │   │   ├── hr/         # HR dashboard, employees, attendance, leave, recruitment, etc.
    │   │   └── employee/   # Employee dashboard, profile, attendance, leaves, payroll
    │   ├── redux/          # Redux store, auth slice, API config
    │   └── utils/          # Axios instance, helpers
    └── vite.config.js
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm
- MySQL

### Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in `backend/` (see `.env.example` for required variables), then run the schema in `database/schema.sql` against your MySQL instance.

Start the server:
```bash
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173` (default Vite port).

## Authentication Flow

1. HR/Admin creates a new employee via the **Add Employee** form — the system auto-generates a Login ID and temporary password
2. Employee verifies their email via a verification link
3. Employee signs in using the Login ID and temporary password
4. Employee is required to set a new password on first login
5. Employee can change their password anytime from their profile settings

Note: There is no public self-registration — accounts are created only by HR/Admin.

## Contributing

This project is being built collaboratively. When contributing:
- Never commit `node_modules/` or `.env` files (see `.gitignore`)
- Follow the existing folder structure (`admin/`, `hr/`, `employee/` role-based separation)
- Use clear, descriptive commit messages

## License

This project is currently unlicensed. Add a license file if you intend to distribute or open-source this work.