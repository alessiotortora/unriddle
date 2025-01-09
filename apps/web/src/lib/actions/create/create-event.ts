'use server';

import { revalidatePath } from 'next/cache';

import { db } from '@/db';
import { events } from '@/db/schema';

interface CreateEventResponse {
  success: boolean;
  data?: { eventId: string };
  error?: string;
}

export async function createEvent(formData: {
  spaceId: string;
}): Promise<CreateEventResponse> {
  try {
    const [result] = await db
      .insert(events)
      .values({
        spaceId: formData.spaceId,
        startDate: new Date(),
        status: 'draft',
        type: 'other',
      })
      .returning({ eventId: events.id });

    revalidatePath(`/dashboard/${formData.spaceId}/events`);

    return {
      success: true,
      data: { eventId: result.eventId },
    };
  } catch (error) {
    console.error('Failed to create event:', error);
    return { success: false, error: 'Failed to create event' };
  }
}
