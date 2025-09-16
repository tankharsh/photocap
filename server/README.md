# PhotoCap Server - Admin Login System

A Node.js/Express server with admin authentication system built with TypeScript, Prisma, and PostgreSQL.

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Setup:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your database credentials and JWT secret.

3. **Database Setup:**
   ```bash
   # Generate Prisma client
   npm run prisma:generate
   
   # Run database migrations
   npm run prisma:migrate
   
   # Seed database with admin users
   npm run seed
   ```

4. **Start Development Server:**
   ```bash
   npm run dev
   ```

## 📊 Database Seeding

Run the seeder to create default admin accounts:

```bash
npm run seed
```

### Default Admin Credentials:
- **Email:** admin@photocap.com
- **Password:** admin123
- **Role:** SUPER_ADMIN

## 🔐 API Endpoints

### Public Endpoints
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/health` - Health check

### Protected Endpoints (Requires Authentication)
- `GET /api/admin/profile` - Get admin profile
- `POST /api/admin/change-password` - Change password
- `GET /api/admin/verify-token` - Verify JWT token

### Super Admin Only
- `POST /api/admin/register` - Register new admin

## 🏗️ Project Structure

```
server/
├── src/
│   ├── middleware/          # Authentication & error handling
│   ├── modules/
│   │   └── admin/          # Admin module
│   │       ├── controller/ # Request handlers
│   │       ├── routes/     # API routes
│   │       └── services/   # Business logic
│   ├── prisma/             # Database schema & seeder
│   ├── validation/         # Input validation schemas
│   └── index.ts           # Main server file
├── package.json
├── tsconfig.json
└── .env.example
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run seed` - Run database seeder
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

## 🔧 Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL + Prisma ORM
- **Authentication:** JWT + bcrypt
- **Validation:** Zod
- **Security:** Helmet, CORS

## 📝 Admin Roles

- **SUPER_ADMIN:** Can create new admins, full access
- **ADMIN:** Standard admin privileges
- **MODERATOR:** Limited admin access

## 🔑 Authentication Flow

1. Admin logs in with email/password
2. Server validates credentials
3. JWT token generated and sent in response + httpOnly cookie
4. Protected routes require valid JWT token
5. Token includes admin ID, email, and role

## 🚨 Security Features

- Password hashing with bcrypt (12 rounds)
- JWT token-based authentication
- httpOnly cookies for token storage
- Role-based access control
- Input validation with Zod
- Security headers with Helmet
- CORS protection