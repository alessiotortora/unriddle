'use server';

import { revalidatePath } from 'next/cache';

import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { Event, events } from '@/db/schema';

export async function updateEvent(data: Event) {
  try {
    await db
      .update(events)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(events.id, data.id));

    revalidatePath(`/dashboard/${data.spaceId}/events`);
    revalidatePath(`/dashboard/${data.spaceId}/events/${data.id}`);

    return { success: true };
  } catch (error) {
    console.error('Failed to update event:', error);
    return { success: false, error: 'Failed to update event' };
  }
}
