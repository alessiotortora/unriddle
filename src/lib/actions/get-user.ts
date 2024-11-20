import { InferModel } from 'drizzle-orm';

import { db } from '@/db';
import { users } from '@/db/schema';
import { createClient } from '@/utils/supabase/server';

type DbUser = InferModel<typeof users>; // Automatically infers the model type

export async function getUser(): Promise<DbUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  const dbUser = await db
    .select()
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1);

  return dbUser[0] ?? null;
}
