# Scalops - AWS Cost Explorer with OAuth Authentication

A microservices-based application for exploring AWS costs with secure OAuth authentication, built with React, Node.js, and PostgreSQL.

## 🏗️ Architecture

- **Client**: React 19 + Vite + Tailwind CSS
- **Auth Service**: Express.js + Passport.js + JWT
- **User Service**: Express.js + Sequelize + PostgreSQL
- **Authentication**: Local + Google OAuth 2.0

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 8+
- PostgreSQL 12+
- Google OAuth 2.0 credentials
- AWS account (for cost exploration)

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd scalops
npm run install:all
```

### 2. Environment Setup

#### Auth Service
Copy `server/auth-service/env.example` to `server/auth-service/.env`:

```bash
cd server/auth-service
cp env.example .env
```

Edit `.env` with your values:
```env
PORT=5000
JWT_SECRET=your_very_long_random_jwt_secret_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
USER_SERVICE_URL=http://localhost:5001
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

#### User Service
Copy `server/user-service/env.example` to `server/user-service/.env`:

```bash
cd server/user-service
cp env.example .env
```

Edit `.env` with your values:
```env
PORT=5001
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=scalops_users
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_db_password
JWT_SECRET=your_very_long_random_jwt_secret_here
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

### 3. Database Setup

```bash
# Create PostgreSQL database
createdb scalops_users

# Or using psql
psql -U postgres
CREATE DATABASE scalops_users;
\q
```

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback`
6. Copy Client ID and Client Secret to your `.env` file

### 5. Start Development Servers

```bash
# Start all services
npm run dev

# Or start individually:
npm run dev:auth    # Auth service on port 5000
npm run dev:user    # User service on port 5001
npm run dev:client  # React client on port 3000
```

## 📁 Project Structure

```
scalops/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   └── package.json
├── server/
│   ├── auth-service/      # Authentication microservice
│   │   ├── routes/        # Auth endpoints
│   │   ├── strategies/    # Passport strategies
│   │   └── utils/         # JWT utilities
│   ├── user-service/      # User management microservice
│   │   ├── models/        # Sequelize models
│   │   ├── routes/        # User endpoints
│   │   └── db/            # Database configuration
│   └── shared/            # Shared middleware
├── package.json           # Root package.json
└── README.md
```

## 🔐 API Endpoints

### Auth Service (Port 5000)

- `POST /api/auth/login` - Local authentication
- `POST /api/auth/register` - User registration
- `GET /api/auth/google` - Google OAuth initiation
- `GET /api/auth/google/callback` - Google OAuth callback
- `POST /api/auth/validate` - JWT validation
- `GET /api/auth/health` - Health check

### User Service (Port 5001)

- `POST /api/user/create` - Create user
- `POST /api/user/find` - Find user by email
- `POST /api/user/validate` - Validate credentials
- `POST /api/user/link` - Link AWS account
- `POST /api/user/awsConnect` - Test AWS connection
- `GET /api/user/profile` - Get user profile
- `GET /api/user/health` - Health check

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start all services in development mode
npm run start        # Start all services in production mode
npm run build        # Build client for production
npm run lint         # Run linting on all services
npm run install:all  # Install dependencies for all services
```

### Code Quality

- ESLint configuration for all services
- Input validation middleware
- Comprehensive error handling
- Security best practices (CORS, input sanitization)

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Input validation and sanitization
- Secure session management
- Environment variable protection

## 🚨 Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3000, 5000, and 5001 are available
2. **Database connection**: Verify PostgreSQL is running and credentials are correct
3. **Google OAuth**: Check redirect URIs and API enablement
4. **CORS errors**: Verify CORS_ORIGINS in environment files

### Logs

- Auth service logs: Check console output on port 5000
- User service logs: Check console output on port 5001
- Client logs: Check browser console and Vite dev server

## 📝 Environment Variables Reference

| Variable | Service | Description | Required |
|----------|---------|-------------|----------|
| `PORT` | Both | Service port number | No (defaults: 5000, 5001) |
| `JWT_SECRET` | Both | Secret for JWT signing | Yes |
| `GOOGLE_CLIENT_ID` | Auth | Google OAuth client ID | Yes |
| `GOOGLE_CLIENT_SECRET` | Auth | Google OAuth client secret | Yes |
| `USER_SERVICE_URL` | Auth | URL of user service | No (default: localhost:5001) |
| `POSTGRES_*` | User | PostgreSQL connection details | Yes |
| `CORS_ORIGINS` | Both | Allowed CORS origins | No (default: localhost:3000) |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section
2. Review logs for error details
3. Create an issue with detailed information
