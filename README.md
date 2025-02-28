# Turbo_Nest_Next AUTH starter

A full-stack authentication starter template built with Turborepo, NestJS, and Next.js.

## Features

- Full-stack TypeScript monorepo setup
- JWT-based authentication with refresh tokens
- Next.js frontend with app router
- NestJS backend API
- UI component library with SHADCN and Tailwind CSS
- Form validation with Zod and React Hook Form

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

## Authentication Flow
This starter implements JWT-based authentication with refresh tokens:

- User signs up/signs in through the web interface
- Backend validates credentials and returns JWT tokens
- Frontend stores tokens securely in HTTP-only cookies
- Protected routes/API endpoints verify JWT tokens
- Automatic token refresh when expired
- Role Based Access Control
