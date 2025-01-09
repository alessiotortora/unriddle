'use server';

import { desc } from 'drizzle-orm';

import { db } from '@/db';
import { events } from '@/db/schema';

export async function getEvents() {
  try {
    const eventsData = await db.query.events.findMany({
      orderBy: [desc(events.createdAt)],
    });

    if (!eventsData || eventsData.length === 0) {
      return [];
    }

    return eventsData;
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}
