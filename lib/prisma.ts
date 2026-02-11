import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Parse DATABASE_URL or use explicit config
const dbUrl = process.env.DATABASE_URL || 'postgresql://devuser:devpassword@localhost:5432/personal_dev_db';
const url = new URL(dbUrl);

// Create a connection pool for PostgreSQL
const pool = new pg.Pool({
  host: url.hostname,
  port: parseInt(url.port || '5432'),
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1).split('?')[0],
})

// Create PrismaClient with the PostgreSQL adapter
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  adapter: new PrismaPg(pool),
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
