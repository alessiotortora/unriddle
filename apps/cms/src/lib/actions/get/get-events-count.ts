'use server';

import { and, count, eq, gt } from 'drizzle-orm';
import { validate } from 'uuid';

import { db } from '@/db';
import { events } from '@/db/schema';

export async function getEventsCount(spaceId: string) {
  if (!spaceId || !validate(spaceId)) {
    console.error('Invalid or missing spaceId:', spaceId);
    return {
      total: 0,
      upcoming: 0,
    };
  }

  try {
    // Get total count
    const [totalResult] = await db
      .select({
        value: count(events.id),
      })
      .from(events)
      .where(eq(events.spaceId, spaceId));

    // Get upcoming count
    const now = new Date();
    const [upcomingResult] = await db
      .select({
        value: count(events.id),
      })
      .from(events)
      .where(
        and(
          eq(events.spaceId, spaceId),
          eq(events.status, 'scheduled'),
          gt(events.startDate, now),
        ),
      );

    return {
      total: totalResult?.value ?? 0,
      upcoming: upcomingResult?.value ?? 0,
    };
  } catch (error) {
    console.error('Error fetching event counts:', error);
    return {
      total: 0,
      upcoming: 0,
    };
  }
}
