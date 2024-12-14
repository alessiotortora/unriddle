'use server';

import { db } from '@/db';

export async function getEvent(eventId: string) {
  try {
    const event = await db.query.events.findFirst({
      where: (events, { eq }) => eq(events.id, eventId),
      with: {
        coverImage: true,
      },
    });

    if (!event) {
      return null;
    }

    return event;
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
}
