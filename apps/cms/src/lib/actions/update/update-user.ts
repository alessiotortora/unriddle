'use server';

import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { socialLinks, users } from '@/db/schema';

export async function updateUser(
  userId: string,
  data: {
    firstName: string | null;
    lastName: string | null;
    bio: string | null;
    location: string | null;
    socialLinks: {
      twitter: string | null;
      github: string | null;
      instagram: string | null;
      linkedin: string | null;
      website: string | null;
      other: string | null;
    } | null;
  },
) {
  try {
    await db.transaction(async (tx) => {
      // Update user
      await tx
        .update(users)
        .set({
          firstName: data.firstName,
          lastName: data.lastName,
          bio: data.bio,
          location: data.location,
        })
        .where(eq(users.id, userId));

      // Upsert social links
      if (data.socialLinks) {
        await tx
          .insert(socialLinks)
          .values({
            userId,
            ...data.socialLinks,
          })
          .onConflictDoUpdate({
            target: socialLinks.userId,
            set: data.socialLinks,
          });
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating user:', error);
    return { success: false, error: 'Failed to update user' };
  }
}
