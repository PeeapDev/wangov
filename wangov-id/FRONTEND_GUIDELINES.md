# WanGov-ID Frontend Development Guidelines

## Core Principles

### 1. Data Management
- **No Mock Data:** All data must be fetched from the API endpoints
- **State Management:** Use React Context and hooks for state management
- **Data Validation:** Validate all user inputs both on client and server side

### 2. Database Usage
- **PostgreSQL Only:** All data persistence must use the PostgreSQL database
- **ORM:** Use Prisma client for all database operations
- **Direct Connection Prohibition:** Frontend must never connect directly to the database

### 3. Authentication & Authorization
- **JWT Tokens:** Use JWT for authentication
- **Role-Based Access Control:** Implement strict RBAC for different user types
- **Session Management:** Leverage express-session for server-side session state

### 4. Code Quality
- **TypeScript:** Use strong typing throughout the application
- **Component Structure:** Follow atomic design principles
- **Testing:** Write unit tests for all components and integration tests for workflows

### 5. User Experience
- **Responsive Design:** All interfaces must work on mobile, tablet, and desktop
- **Accessibility:** Follow WCAG 2.1 AA standards
- **Performance:** Optimize bundle size and loading performance

### 6. Security
- **CSRF Protection:** Implement CSRF tokens for all forms
- **XSS Prevention:** Sanitize all user inputs
- **Secure Cookies:** Use httpOnly and secure flags for cookies

## Architecture Overview

The frontend will consist of three main applications:
1. **Public Landing Page:** Information and login portal
2. **Citizen Dashboard:** For individual citizens to manage their digital identity
3. **Admin Dashboard:** For system administrators and organization managers

## Technology Stack
- React with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Axios for API requests
- React Query for data fetching and caching
- React Hook Form for form management

## Development Workflow
1. Create reusable components
2. Build page layouts
3. Implement API integration services
4. Add authentication and authorization
5. Implement form validation
6. Add error handling
7. Optimize performance
8. Deploy

## Code Structure
```
frontend/
  ├── public/             # Static assets
  ├── src/
      ├── components/     # Reusable UI components
      ├── pages/          # Page components
      ├── layouts/        # Layout components
      ├── services/       # API services
      ├── utils/          # Utility functions
      ├── contexts/       # React contexts
      ├── hooks/          # Custom React hooks
      ├── types/          # TypeScript type definitions
      ├── assets/         # Images, icons, etc.
      ├── styles/         # Global styles
```

## API Integration
- All API calls must use the services layer
- Implement proper error handling for API failures
- Add request/response interceptors for auth token management

## User Types & Permissions
1. **Citizen**
   - Manage personal profile
   - View and manage documents
   - Control service access
   
2. **Organization Admin**
   - Manage organization profile
   - Add/remove organization members
   - Access organization-specific services
   
3. **Super Admin**
   - Manage all users and organizations
   - System configuration
   - Access logs and analytics
