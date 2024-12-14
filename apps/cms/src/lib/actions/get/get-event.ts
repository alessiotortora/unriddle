'use server';

import { db } from '@/db';

export async function getEvent(eventId: string) {
  try {
    const event = await db.query.events.findFirst({
      where: (events, { eq }) => eq(events.id, eventId),
    });

    if (!event) {
      return null;
    }

    return event;
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}
