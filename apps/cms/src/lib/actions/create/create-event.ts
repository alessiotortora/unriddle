'use server';

import { revalidatePath } from 'next/cache';

import { db } from '@/db';
import { events } from '@/db/schema';

export async function createEvent(formData: { spaceId: string }) {
  try {
    const newEvent = await db.insert(events).values({
      spaceId: formData.spaceId,
      title: 'Untitled Event',
      startDate: new Date(),
      status: 'draft',
    }).returning({ eventId: events.id });

    revalidatePath(`/dashboard/${formData.spaceId}/events`);
    
    return { 
      success: true, 
      data: { eventId: newEvent[0].eventId }
    };
  } catch (error) {
    console.error('Failed to create event:', error);
    return { success: false, error: 'Failed to create event' };
  }
}
