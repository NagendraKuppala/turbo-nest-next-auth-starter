# Turbo_Nest_Next AUTH starter

A full-stack authentication starter template using a monorepo structure powered by Turborepo, combining NestJS for the backend and Next.js for the frontend.

## Project Structure
```
apps/
  ├── api/         # NestJS backend application
  └── web/         # Next.js frontend application
packages/
  ├── ui/          # Shared React components
  ├── eslint-config/
  └── typescript-config/
```

## Getting Started

- Clone the repository and install dependencies
```
git clone <repository-url>
npm install
```

- Start the development servers:
```
npm run dev
```

- The web application will be available at http://localhost:3000 
- The API will be available at http://localhost:4000

## Project Architecture

### 1. Backend (NestJS)
The API is built with NestJS and follows its modular architecture:

#### Authentication Module (`apps/api/src/auth/auth.module.ts`)
- Handles all authentication flows including:
  - JWT authentication with refresh tokens
  - Local authentication strategy
  - Google OAuth integration
  - Role-based access control

#### User Module (`apps/api/src/user/user.module.ts`)
- Manages user data and operations

#### Email Module (`apps/api/src/email/email.module.ts`)
- Manages email operations

#### Database
- Uses Prisma ORM with a database schema containing:
  - User accounts
  - Posts/comments system with voting
  - Tipping functionality

### 2. Frontend (Next.js)
The web app uses Next.js with the App Router architecture:

#### Authentication Pages
- **Sign-in** `web/app/signin/page.tsx`
- **Register** `web/app/register/page.tsx`
- **Verification**
- **Password reset flows**
- **Authentication Actions** `src/lib/auth.ts`

#### UI Components
- Uses `shadcn/ui` component library with Tailwind CSS
- **Navigation:** `src/components/layout/navbar.tsx`
- **Dialog/Sheet components** for modals and mobile navigation
- **Cards, forms, and other UI primitives**

#### State Management
- Auth state is managed through a custom store (`useAuthStore`)


## Authentication Flow

### 1. User Registration
- User submits registration form
- Backend validates, creates account, sends verification email
- User is redirected to verification pending page

### 2. Email Verification
- User clicks link in email
- Backend verifies and activates account

### 3. Sign In Process
- User submits credentials
- Backend validates and returns JWT tokens
- Tokens are stored in HTTP-only cookies
- User session is established

### 4. OAuth Authentication
- User initiates Google login
- Backend handles OAuth callback from `auth.controller.ts`
- For new OAuth users, terms acceptance check is performed
- Account is created/updated and session established

### 5. Protected Routes
- Middleware checks auth state for protected routes
- Server-side session validation via `middleware.ts`
- Role-based access for admin routes

### 6. Token Management
- Access tokens for short-term auth
- Refresh tokens for session persistence
- Auto-refresh mechanism when tokens expire
- Sign-out clears tokens via `api/auth/signout/route.ts`

### 7. Profile Management
- Users can update profile info and password in `profile/page.tsx`
  
## UI Features
- Responsive Design: Desktop navigation menu and mobile slide-out drawer
- Theme Support: Light/dark mode toggle
- Form Validation: Using Zod schema validation
- Toast Notifications: For user feedback

## Integration Points
- Frontend makes authenticated requests to backend using custom `authFetch` utility
- Backend guards routes with JWT validation
- Session management coordinated between client and server