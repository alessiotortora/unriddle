import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { Space, spaces } from '@/db/schema';

export async function getFirstSpace(userId: string): Promise<Space | null> {
  const firstSpace = await db
    .select()
    .from(spaces)
    .where(eq(spaces.userId, userId))
    .limit(1);

  if (firstSpace.length === 0) {
    return null;
  }

  return firstSpace[0];
}
