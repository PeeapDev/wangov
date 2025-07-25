# WanGov-ID: Role-Based Identity Management System

A comprehensive identity management system with role-based authentication and dedicated dashboards for different user types.

## 🏗️ Architecture

WanGov-ID is built with a microservices architecture where each user role has its own containerized frontend service:

- **Backend API** (`wangov-api`): Core authentication and data services
- **SuperAdmin Portal** (`wangov-superadmin`): System administration dashboard
- **Admin Portal** (`wangov-admin`): Government admin management
- **Organization Portal** (`wangov-organization`): Organization staff interface
- **Citizen Portal** (`wangov-citizen`): Public citizen services

## 🚀 Features

### Authentication & Authorization
- **Multi-role Authentication**: SuperAdmin, Admin, Organization Staff, Citizens
- **JWT-based Security**: Separate token systems for different user types
- **Role-based Access Control**: Protected routes and API endpoints
- **Demo Account Support**: One-click demo login for all roles

### User Management
- **Citizen Registration**: NID-based registration system
- **Admin Management**: Government staff and organization management
- **Profile Management**: User profile updates and verification
- **Session Management**: Secure login/logout with token handling

### Dashboards
- **SuperAdmin Dashboard**: System overview, user management, analytics
- **Admin Dashboard**: Government operations, citizen oversight
- **Organization Dashboard**: Organization-specific services and data
- **Citizen Dashboard**: Personal services, document access, applications

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL 14+ with Prisma ORM
- **Authentication**: JWT tokens (separate for citizens and admins)
- **Caching**: Redis for session management

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v6 with protected routes
- **State Management**: React Context API
- **HTTP Client**: Axios with interceptors
- **Notifications**: React Hot Toast

### DevOps
- **Containerization**: Docker & Docker Compose
- **Web Server**: Nginx (for frontend services)
- **Environment**: Multi-stage builds for production
- **Orchestration**: Docker Compose with health checks

## 🚀 Quick Start

### Option 1: Docker Deployment (Recommended)

1. **Clone and setup**:
```bash
git clone https://github.com/PeeapDev/wangov.git
cd wangov
```

2. **Deploy all services**:
```bash
./deploy.sh
```

3. **Access the applications**:
- 🔧 **API Server**: http://localhost:3000
- 👑 **SuperAdmin Portal**: http://localhost:3001
- 🛡️ **Admin Portal**: http://localhost:3002
- 🏢 **Organization Portal**: http://localhost:3003
- 👤 **Citizen Portal**: http://localhost:3004

### Option 2: Development Setup

1. **Prerequisites**:
   - Node.js 18+
   - PostgreSQL 14+
   - Redis (optional)

2. **Backend setup**:
```bash
cd wangov-id
npm install
cp .env.example .env
# Edit .env with your database configuration
npm run prisma:migrate:dev
npm run seed
npm run dev
```

3. **Frontend setup**:
```bash
cd wangov-id/frontend
npm install
npm start
```

## 👥 Demo Accounts

The system comes with pre-configured demo accounts:

| Role | Email | Password | Dashboard |
|------|-------|----------|----------|
| SuperAdmin | superadmin@example.com | password123 | http://localhost:3001 |
| Admin | admin@example.com | password123 | http://localhost:3002 |
| Organization | org@example.com | password123 | http://localhost:3003 |
| Citizen | citizen@example.com | password123 | http://localhost:3004 |

## 🐳 Docker Services

### Service Ports
- **wangov-api**: 3000 (Backend API)
- **wangov-superadmin**: 3001 (SuperAdmin Frontend)
- **wangov-admin**: 3002 (Admin Frontend)
- **wangov-organization**: 3003 (Organization Frontend)
- **wangov-citizen**: 3004 (Citizen Frontend)
- **wangov-db**: 5432 (PostgreSQL)
- **wangov-redis**: 6379 (Redis)

### Docker Commands
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f [service-name]

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# Execute commands in containers
docker-compose exec wangov-api npm run prisma:migrate:deploy
```

## 🔧 Configuration

### Environment Variables

Key environment variables (see `.env.production`):

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# JWT Secrets (CHANGE IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key
ADMIN_JWT_SECRET=your-super-secret-admin-jwt-key
SESSION_SECRET=your-super-secret-session-key

# API Configuration
API_PORT=3000
CORS_ORIGIN=http://localhost:3001,http://localhost:3002,http://localhost:3003,http://localhost:3004
```

## 🔐 Security Features

- **Role-based Access Control**: Each service enforces role-specific access
- **JWT Token Security**: Separate token systems for different user types
- **CORS Protection**: Configured for specific frontend origins
- **Input Validation**: Comprehensive request validation
- **Password Hashing**: bcrypt for secure password storage
- **Session Management**: Secure token storage and cleanup

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - Citizen login
- `POST /api/admin/login` - Admin/SuperAdmin login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### User Management
- `GET /api/citizens` - List citizens (admin only)
- `POST /api/citizens` - Create citizen
- `GET /api/admins` - List admins (superadmin only)
- `POST /api/admins` - Create admin

## 🧪 Testing

Run the test suite:
```bash
# Backend tests
cd wangov-id
npm test

# Frontend tests
cd wangov-id/frontend
npm test
```

## 🚀 Deployment to Production

### Docker Registry

1. **Build and tag images**:
```bash
docker build -t your-registry/wangov-api:latest .
docker build -f Dockerfile.frontend -t your-registry/wangov-frontend:latest .
```

2. **Push to registry**:
```bash
docker push your-registry/wangov-api:latest
docker push your-registry/wangov-frontend:latest
```

### Environment Setup

1. Update production environment variables
2. Set up SSL certificates
3. Configure reverse proxy (Nginx/Traefik)
4. Set up monitoring and logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation in `/docs`

## 🔄 Changelog

### v1.0.0 (Current)
- ✅ Role-based authentication system
- ✅ Separate containerized dashboards
- ✅ Demo account integration
- ✅ JWT token management
- ✅ Protected routing
- ✅ Docker deployment setup
- ✅ Database migrations and seeding

---

**Built with ❤️ by the PeeapDev Team**

WanGov/
├── package.json              # Root package.json with orchestration scripts
├── wangov-id/                # Backend application
│   ├── src/                  # Backend source code
│   ├── prisma/               # Database schema and migrations
│   └── package.json          # Backend dependencies
└── wangov-id/frontend/       # Frontend application
    ├── src/                  # Frontend source code
    └── package.json          # Frontend dependencies
```

## Login Portals

The application provides three distinct login portals:

1. **Citizen Portal** - `/login`
   - For regular citizens accessing their digital ID services

2. **Government Admin Portal** - `/gov/auth/login`
   - For superadmin, superadmin-staff, and admin users
   - System administration and management

3. **Organization Portal** - `/org/auth/login`
   - For organization and organization-staff users
   - Organization-specific services and management

## Demo Accounts

After running `npm run prisma:seed`, you can use these demo accounts:

- **Superadmin:** `superadmin@wangov.sl` / `password123`
- **Admin:** `admin@wangov.sl` / `password123`
- **Organization:** `organization@example.com` / `password123`
- **Citizen:** `citizen@example.com` / `password123`

## Development URLs

- **Frontend:** http://localhost:3003
- **Backend API:** http://localhost:3000
- **API Documentation:** http://localhost:3000/api-docs (if available)

## Environment Variables

Make sure to set up your environment variables in `wangov-id/.env`:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/wangov_id"
JWT_SECRET="your-jwt-secret"
SESSION_SECRET="your-session-secret"
NODE_ENV="development"
```

## Support

For issues and questions, please refer to the project documentation or contact the development team.
# wangov
