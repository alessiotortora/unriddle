import { drizzle } from 'drizzle-orm/postgres-js';

import * as schema from './schema';

const connectionString = process.env.DATABASE_URL!;

export const db = drizzle({
  connection: { url: connectionString, prepare: false, max: 1 },
  casing: 'snake_case',
  schema,
});
