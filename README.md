# Store Rating Platform (Full-Stack Web Application)

A full-stack web application designed for rating registered stores, featuring a single unified authentication system with role-based access control (**System Administrator**, **Normal User**, and **Store Owner**).

---

## 🚀 Tech Stack

- **Frontend**: React (Vite), Vanilla CSS (custom design system with glassmorphism & responsive dark/slate UI), Lucide Icons.
- **Backend**: Express.js (Node.js), Clean MVC pattern (Controllers, Routes, Middleware, Models).
- **Database**: PostgreSQL / SQLite (managed via Sequelize ORM with standard relational schema, foreign keys, unique composite indexes, and DDL scripts).
- **Authentication**: JWT (JSON Web Tokens) with `bcryptjs` password hashing and role-based route protection.

---

## 👥 User Roles & Capabilities

### 1. System Administrator
- **Dashboard Overview**: Displays real-time statistics:
  - Total number of registered users
  - Total number of registered stores
  - Total number of submitted ratings
- **Store Management**:
  - View all stores with **Name, Email, Address, and Overall Rating** (average + total count).
  - Add new stores (with validation and optional owner assignment).
  - Search & filter stores by **Name, Email, and Address**.
  - Sort table columns in ascending or descending order.
- **User Management**:
  - View all users with **Name, Email, Address, and Role**.
  - If a user is a **Store Owner**, their store's **Average Rating** is automatically computed and displayed!
  - Add new users with: Name, Email, Password, Address, and Role.
  - Search & filter users by **Name, Email, Address, and Role**.
  - Sort table columns in ascending or descending order.

### 2. Normal User
- **Self Sign-Up & Sign-In**: Dedicated registration page (`/register`) and unified login (`/login`).
- **Store Directory**:
  - View all registered stores in either modern card grid view or sortable table view.
  - Real-time search by **Store Name** and **Address**.
  - Sort stores by **Name, Address, or Rating** (Ascending / Descending).
  - View store address, overall community rating, and personal rating status.
- **Rating Submission & Modification**:
  - Submit ratings (strictly **1 to 5 stars**).
  - If already rated, the interface clearly shows **"Modify My Rating"** and allows updating the rating at any time.
- **Account Security**:
  - Can securely update password after logging in.

### 3. Store Owner
- **Dedicated Store Owner Portal**:
  - View assigned store profile details (Store Name, Email, Address).
  - Real-time **Average Rating** hero card with 5-star visual indicator.
  - View a table of all customers who rated their store (**Customer Name, Customer Email, Submitted Rating, Date**).
  - Sort customer ratings by Name, Email, Rating, or Date.
- **Account Security**:
  - Can securely update password after logging in.

---

## 📋 Form Validations (Strictly Enforced)

Both the **Frontend** (client-side validation with real-time character counters & checklists) and **Backend** (Express validation middleware) strictly enforce:

1. **Name**: Minimum **20 characters**, Maximum **60 characters**.
2. **Address**: Maximum **400 characters**.
3. **Password**: **8 to 16 characters**, must include at least **one uppercase letter** (`[A-Z]`) and **one special character** (`[!@#$%^&*...]`).
4. **Email**: Standard email format validation (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`).
5. **Rating**: Integer between **1 and 5**.

---

## 🗄️ Database Schema & Relational Design

### 1. `users` Table
| Column | Type | Constraints / Description |
|---|---|---|
| `id` | SERIAL / INT | Primary Key |
| `name` | VARCHAR(60) | Length: 20-60 chars |
| `email` | VARCHAR(255) | Unique, Valid Email |
| `password` | VARCHAR(255) | Bcrypt hashed |
| `address` | VARCHAR(400) | Max 400 chars |
| `role` | ENUM / VARCHAR(20) | `'admin'`, `'user'`, `'store_owner'` |
| `created_at` / `updated_at` | TIMESTAMP | Audit timestamps |

### 2. `stores` Table
| Column | Type | Constraints / Description |
|---|---|---|
| `id` | SERIAL / INT | Primary Key |
| `name` | VARCHAR(60) | Not empty |
| `email` | VARCHAR(255) | Unique, Valid Email |
| `address` | VARCHAR(400) | Max 400 chars |
| `owner_id` | INT (FK) | References `users(id)` ON DELETE SET NULL |
| `created_at` / `updated_at` | TIMESTAMP | Audit timestamps |

### 3. `ratings` Table
| Column | Type | Constraints / Description |
|---|---|---|
| `id` | SERIAL / INT | Primary Key |
| `rating` | INT | Between 1 and 5 |
| `user_id` | INT (FK) | References `users(id)` ON DELETE CASCADE |
| `store_id` | INT (FK) | References `stores(id)` ON DELETE CASCADE |
| `created_at` / `updated_at` | TIMESTAMP | Audit timestamps |
| **Composite Unique Constraint** | `(user_id, store_id)` | Guarantees one rating per user per store (supports rating modification) |

---

## 🔑 Demo Accounts (Pre-Seeded)

The application comes pre-populated with demo data for immediate testing:

| Role | Email | Password | Pre-linked Data |
|---|---|---|---|
| **System Administrator** | `admin@example.com` | `Admin@1234` | Full access to stats, users, and stores |
| **Store Owner** | `owner@example.com` | `Owner@1234` | Linked to *Downtown Tech Gadgets & Accessories* |
| **Normal User 1** | `user1@example.com` | `User@1234` | Has submitted ratings on stores |
| **Normal User 2** | `user2@example.com` | `User@1234` | Has submitted ratings on stores |

*(Note: The login screen also features 1-click demo chips to quickly fill in credentials).*

---

## 🛠️ Project Structure

```text
talent/
├── backend/
│   ├── database/
│   │   ├── schema.sql              # Raw PostgreSQL DDL script
│   │   ├── seed.sql                # Raw PostgreSQL seed SQL
│   │   └── store_rating.sqlite     # SQLite local file (zero-setup dev)
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js         # Sequelize connection (SQLite & PostgreSQL)
│   │   ├── controllers/
│   │   │   ├── auth.controller.js  # Login, signup, me, update-password
│   │   │   ├── admin.controller.js # Stats, users list/add, stores list/add
│   │   │   ├── store.controller.js # User store listings & submit/modify rating
│   │   │   └── owner.controller.js # Owner dashboard & rating customer list
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js  # JWT verification & role authorization
│   │   │   └── validate.middleware.js # Validation rules for all forms
│   │   ├── models/
│   │   │   ├── User.js             # User Sequelize model
│   │   │   ├── Store.js            # Store Sequelize model
│   │   │   ├── Rating.js           # Rating Sequelize model
│   │   │   └── index.js            # Model associations
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── admin.routes.js
│   │   │   ├── store.routes.js
│   │   │   └── owner.routes.js
│   │   ├── utils/
│   │   │   └── seedData.js         # Automatic database sync & demo seeder
│   │   ├── app.js                  # Express middleware & route registration
│   │   └── server.js               # Server bootstrap & DB connection
│   ├── .env                        # Active environment variables
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Header with user badge, password change, logout
│   │   │   ├── StarRating.jsx      # Interactive 1-5 star rating component
│   │   │   ├── Table.jsx           # Reusable sortable table (asc/desc indicators)
│   │   │   ├── StatCard.jsx        # Admin metrics cards
│   │   │   ├── Modal.jsx           # Accessible modal backdrop & dialog
│   │   │   ├── ChangePasswordModal.jsx # Password update modal with live rules
│   │   │   ├── AddUserModal.jsx    # Admin modal to create users
│   │   │   ├── AddStoreModal.jsx   # Admin modal to create stores
│   │   │   ├── RatingModal.jsx     # Submit/modify rating modal
│   │   │   └── ProtectedRoute.jsx  # Role-based route guard
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Global auth state & token management
│   │   ├── pages/
│   │   │   ├── Login.jsx           # Single login page with demo chips
│   │   │   ├── Register.jsx        # Normal user signup page
│   │   │   ├── AdminDashboard.jsx  # Admin stats, stores & users tables with filters
│   │   │   ├── UserDashboard.jsx   # Stores grid/table with search & rating actions
│   │   │   └── OwnerDashboard.jsx  # Store Owner stats & customer feedback list
│   │   ├── services/
│   │   │   └── api.js              # Centralized API service with auth headers
│   │   ├── index.css               # Rich Vanilla CSS design system
│   │   ├── App.jsx                 # Router & route definitions
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js              # Proxy configuration for /api
│   └── package.json
│
├── package.json                    # Root script runner
└── README.md
```

---

## ⚙️ How to Run Locally

### 1. Backend Setup
```bash
cd backend
npm install
npm run seed       # Seeds the database with demo users and stores
npm run dev        # Starts backend server on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev        # Starts Vite dev server on http://localhost:5173
```

Open your browser at **`http://localhost:5173`**.

---

## 🛢️ PostgreSQL Configuration (Optional)
By default, the project runs out of the box with zero setup using embedded SQLite (`backend/database/store_rating.sqlite`).

To switch to **PostgreSQL**:
1. Open `backend/.env`
2. Change `DB_DIALECT=sqlite` to `DB_DIALECT=postgres`
3. Enter your PostgreSQL credentials:
   ```env
   DB_DIALECT=postgres
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=store_rating_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   ```
4. Run `npm run seed` to create the schema and demo data on PostgreSQL!
