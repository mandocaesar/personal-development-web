# User Management & Database Setup Guide

This guide will help you set up the database and user management system for the Personal Development Web application.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- Git

## Database Setup

### Option 1: Local PostgreSQL

1. **Install PostgreSQL** (if not already installed):
   ```bash
   # macOS
   brew install postgresql@15
   brew services start postgresql@15
   
   # Or use Docker
   docker run --name postgres -e POSTGRES_PASSWORD=yourpassword -p 5432:5432 -d postgres:15
   ```

2. **Create Database**:
   ```bash
   createdb personal_dev_db
   ```

### Option 2: Cloud Database (Neon, Supabase, etc.)

1. Create a PostgreSQL database on your preferred cloud provider
2. Get the connection string

## Environment Configuration

1. **Copy the example environment file**:
   ```bash
   cp .env.example .env
   ```

2. **Update `.env` with your database credentials**:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/personal_dev_db?schema=public"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
   
   # Environment
   NODE_ENV="development"
   ```

3. **Generate a secure NEXTAUTH_SECRET**:
   ```bash
   openssl rand -base64 32
   ```

## Installation Steps

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Generate Prisma Client**:
   ```bash
   npm run db:generate
   ```

3. **Push database schema** (for development):
   ```bash
   npm run db:push
   ```
   
   OR **Run migrations** (for production):
   ```bash
   npm run db:migrate
   ```

4. **Seed the database with initial data**:
   ```bash
   npm run db:seed
   ```

## Default Login Credentials

After seeding, you can log in with:

- **Admin**: `admin@company.com` / `admin123`
- **Manager**: `manager@company.com` / `manager123`
- **Other users**: `<email>` / `password123`

## Running the Application

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema to database (development)
- `npm run db:migrate` - Run migrations (production)
- `npm run db:seed` - Seed database with initial data
- `npm run db:studio` - Open Prisma Studio (database GUI)

## Features

### User Management
- ✅ Role-based access control (Admin, Manager, Lead, Mid, Junior, Viewer)
- ✅ User authentication with NextAuth
- ✅ User CRUD operations (Admin only)
- ✅ Password hashing with bcrypt

### Team Management
- ✅ Create and manage teams
- ✅ Assign users to teams
- ✅ Manager-team member relationships
- ✅ Team hierarchy support

### Access Control

**Admin**:
- Full system access
- Create, edit, delete users
- Manage all teams
- Change user roles

**Manager**:
- View and manage own teams
- Add/remove team members
- Conduct assessments
- Schedule coaching sessions

**Lead/Mid/Junior**:
- View own profile and assessments
- Access learning resources
- View team information

**Viewer**:
- Read-only access to public resources

## API Endpoints

### Authentication
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out

### Users
- `GET /api/users` - List users (Admin/Manager)
- `POST /api/users` - Create user (Admin only)
- `GET /api/users/[id]` - Get user details
- `PATCH /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user (Admin only)

### Teams
- `GET /api/teams` - List teams
- `POST /api/teams` - Create team (Admin/Manager)
- `POST /api/teams/[teamId]/members` - Add team member
- `DELETE /api/teams/[teamId]/members?userId=[userId]` - Remove team member

## Database Schema

### Main Models

- **User** - System users with roles and grades
- **Team** - Teams/departments
- **TeamMember** - User-team relationships with manager assignment
- **Assessment** - Performance assessments
- **CoachingSession** - 1-on-1 coaching sessions

### Enums

- **Role**: ADMIN, MANAGER, LEAD, MID, JUNIOR, VIEWER
- **CareerGrade**: Engineering career ladder grades
- **SessionStatus**: SCHEDULED, COMPLETED, CANCELLED

## Troubleshooting

### Database Connection Issues

1. **Check PostgreSQL is running**:
   ```bash
   pg_isready
   ```

2. **Verify connection string** in `.env`

3. **Test connection**:
   ```bash
   npm run db:studio
   ```

### Migration Issues

1. **Reset database** (⚠️ destroys all data):
   ```bash
   npx prisma migrate reset
   ```

2. **Re-seed**:
   ```bash
   npm run db:seed
   ```

### Authentication Issues

1. **Clear browser cookies/localStorage**
2. **Verify NEXTAUTH_SECRET is set**
3. **Check NEXTAUTH_URL matches your domain**

## Security Notes

⚠️ **Important for Production**:

1. Change all default passwords
2. Use a strong NEXTAUTH_SECRET
3. Use environment variables for sensitive data
4. Enable SSL for database connections
5. Implement rate limiting on API routes
6. Enable HTTPS for your domain
7. Review and update CORS policies

## Next Steps

1. Customize user roles and permissions
2. Add email verification
3. Implement password reset functionality
4. Add audit logging
5. Integrate with your existing systems
6. Set up automated backups

## Support

For issues or questions, please refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
