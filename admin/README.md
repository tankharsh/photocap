# PhotoCap Admin Frontend

A modern Next.js admin interface for the PhotoCap application with authentication, dashboard, and profile management.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PhotoCap server running on port 5000

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Setup:**
   ```bash
   # .env.local is already configured
   # Make sure server is running on http://localhost:5000
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Admin interface will be available at: http://localhost:3001

## 🎯 Features

- **Modern Design** - Clean, responsive UI with Tailwind CSS
- **Authentication** - Secure login with JWT tokens
- **Dashboard** - Overview with stats and recent activities
- **Profile Management** - View profile information
- **Mobile Responsive** - Works on all device sizes
- **Route Protection** - Automatic authentication middleware

## 🔐 Default Login Credentials

- **Email:** admin@photocap.com
- **Password:** admin123
- **Role:** SUPER_ADMIN

## 📱 Pages

- `/login` - Admin login page
- `/dashboard` - Main dashboard with stats
- `/profile` - Profile settings (read-only)
- `/` - Auto-redirects based on auth status

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **State Management:** React Context
- **Authentication:** JWT with httpOnly cookies

## 🎨 UI Components

- **Layout** - Responsive sidebar navigation
- **Login** - Secure authentication form
- **Dashboard** - Stats cards and activity feed
- **Profile** - Account information display

## 🔧 Available Scripts

- `npm run dev` - Start development server (port 3001)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🌐 API Integration

The admin interface connects to the PhotoCap server API:

- **Base URL:** http://localhost:5000/api
- **Authentication:** JWT tokens in cookies
- **Auto-refresh:** Token verification on page load
- **Error Handling:** Automatic logout on token expiration

## 🔒 Security Features

- **Route Protection** - Middleware-based authentication
- **Token Management** - Secure httpOnly cookies
- **Auto-logout** - On token expiration
- **CORS Protection** - Configured for localhost development

## 📦 Project Structure

```
admin/
├── app/                 # Next.js App Router pages
│   ├── dashboard/      # Dashboard page
│   ├── login/          # Login page
│   ├── profile/        # Profile page
│   ├── layout.tsx      # Root layout with AuthProvider
│   └── page.tsx        # Home page (redirects)
├── components/         # React components
│   ├── Dashboard.tsx   # Dashboard component
│   ├── Layout.tsx      # Main layout with sidebar
│   ├── Login.tsx       # Login component
│   └── Profile.tsx     # Profile component
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication context
├── lib/                # Utilities
│   └── api.ts          # API service functions
├── styles/             # Global styles
│   └── globals.css     # Tailwind CSS + custom styles
└── middleware.ts       # Route protection middleware
```

## 🚀 Quick Start

1. Make sure the backend server is running on port 5000
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open http://localhost:3001 in your browser
5. Login with default credentials: admin@photocap.com / admin123

## 🔗 Backend Integration

The frontend communicates with the PhotoCap backend server:

- **Authentication:** POST /api/admin/login
- **Profile:** GET /api/admin/profile
- **Token Verification:** GET /api/admin/verify-token
- **Logout:** POST /api/admin/logout

The frontend automatically handles authentication states and redirects users appropriately.