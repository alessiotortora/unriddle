'use server';

import { revalidatePath } from 'next/cache';

import { db } from '@/db';
import { events } from '@/db/schema';
import { eq } from 'drizzle-orm';

interface UpdateEventData {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  location?: string;
  client?: string;
  link?: string;
  type: string;
  status: string;
  details?: Record<string, string>;
}

export async function updateEvent(data: UpdateEventData) {
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
