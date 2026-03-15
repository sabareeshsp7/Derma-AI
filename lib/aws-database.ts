import { Pool, QueryResult } from 'pg'

const isProduction = process.env.NODE_ENV === 'production'
const useSSL = process.env.DB_SSL === 'true' || isProduction

const poolConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: useSSL ? { 
    rejectUnauthorized: false 
  } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
}

const pool = new Pool(poolConfig)

export async function query(text: string, params?: unknown[]): Promise<QueryResult> {
  const start = Date.now()
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    if (process.env.NODE_ENV === 'development') {
      console.log('Query executed', { duration, rows: res.rowCount })
    }
    return res
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

export async function getClient() {
  return await pool.connect()
}

export default pool
