import * as schema from './schema';
import { drizzle } from 'drizzle-orm/postgres-js';

const connectionString = process.env.DATABASE_URL!;

export const db = drizzle({
  connection: { url: connectionString, prepare: false },
  casing: 'snake_case',
  schema,
});
