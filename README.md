# User Management System

A Node.js application for managing users with authentication, built using Express and SQLite.

## Features

- User authentication with session management
- User CRUD operations
- Role-based access control (Admin/Client)
- Multiple email and phone management with primary selection
- Responsive design
- Search and pagination

## Prerequisites

- Node.js (v14 or higher)
- npm

```bash
USER-CRUD-NODEJS-WEBII/
│
├── public/
│   └── css/
│       └── style.css                  # Global application styles
│
├── src/
│   ├── config/
│   │   ├── database.js                # SQLite database configuration
│   │   └── database.sqlite            # SQLite database file
│   │
│   ├── controllers/                   # Route controllers
│   │   ├── auth.controller.js
│   │   ├── email.controller.js
│   │   ├── phone.controller.js
│   │   └── user.controller.js
│   │
│   ├── middlewares/
│   │   └── auth.middleware.js         # Auth and permission middleware
│   │
│   ├── models/                        # Data models and DAOs
│   │   ├── email.dao.js
│   │   ├── email.model.js
│   │   ├── phone.dao.js
│   │   ├── phone.model.js
│   │   ├── user.dao.js
│   │   └── user.model.js
│   │
│   └── routes/
│       ├── auth.routes.js
│       └── user.routes.js
│
├── views/
│   ├── partials/                      # Reusable components
│   └── users/                         # User-related views
│       ├── add.ejs                    # User creation form
│       ├── edit.ejs                   # User edit form
│       ├── index.ejs                  # User list view
│       ├── new.ejs                    # Alternate creation page
│       ├── show.ejs                   # User details page
│   ├── common-errors.ejs              # Common error template
│   ├── error.ejs                      # Generic error page
│   ├── index.ejs                      # Home page
│   └── login.ejs                      # Login page
│
├── .gitignore                         # Git ignore rules
├── app.js                             # Express app initialization
├── index.js                           # Main entry point
├── LICENSE                            # Project license
├── package.json                       # Project dependencies and scripts
├── package-lock.json                  # Dependency lock file
├── README.md                          # Project documentation
├── sessions                           # Saved session data
└── sessions.db                        # Session database file
```

## Security Features

- Password hashing with bcrypt
- Session management with SQLite store
- CSRF protection
- Input validation
- Role-based access control

## User Roles

- **ADMIN**: Can manage all users and perform all operations
- **CLIENT**: Can view all users and edit their own profile

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Create a `.env` file in the root directory with the following content:
```
PORT=3000
SESSION_SECRET=your-secret-key-change-in-production
```
### Running the Application

1. Start the server: `npm start`
2. For development with auto-reload: `npm run dev`
