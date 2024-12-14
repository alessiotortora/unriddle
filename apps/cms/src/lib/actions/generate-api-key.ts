'use server';

import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

import { db } from '@/db';
import { users } from '@/db/schema/users';

export async function generateApiKey(userId: string) {
  try {
    const key = nanoid(32);
    const newApiKey = key ? `sk_${key}` : null;

    await db
      .update(users)
      .set({
        apiKey: newApiKey,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    if (!newApiKey) {
      return { success: false, error: 'Failed to generate API key' };
    }

    return { success: true, apiKey: newApiKey };
  } catch (error) {
    console.error('Error generating API key:', error);
    return { success: false, error: 'Failed to generate API key' };
  }
}
