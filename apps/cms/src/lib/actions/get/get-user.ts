'use server';

import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { User, users } from '@/db/schema';
import { createClient } from '@/utils/supabase/server';

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
    error,
  } = await supabase.auth.getUser();

  if (error || !authUser) return null;

  const user = await db.query.users.findFirst({
    where: eq(users.id, authUser.id),
    with: {
      socialLinks: true,
    },
  });

  if (!user) return null;

  return user;
}
