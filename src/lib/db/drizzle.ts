import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

let _db: ReturnType<typeof drizzle> | undefined

export const db =
  _db ?? (_db = drizzle({ client: postgres(process.env.DATABASE_URL!) }))
