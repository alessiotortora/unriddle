import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { User, users } from '@/db/schema';
import { createClient } from '@/utils/supabase/server';

export async function getUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user: authUser },
    error,
  } = await supabase.auth.getUser();

  if (error || !authUser) return null;

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, authUser.id))
    .limit(1);

  if (user.length === 0) {
    return null;
  }

  return user[0];
}
