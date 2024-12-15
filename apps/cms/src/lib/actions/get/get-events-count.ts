'use server';

import { and, count, eq, gt } from 'drizzle-orm';
import { validate } from 'uuid';

import { db } from '@/db';
import { events } from '@/db/schema';

export async function getEventsCount(spaceId: string) {
  if (!validate(spaceId)) {
    console.error('Invalid UUID format for spaceId:', spaceId);
    return {
      total: 0,
      upcoming: 0,
    };
  }

  try {
    const [{ count: totalCount }] = await db
      .select({ count: count() })
      .from(events)
      .where(eq(events.spaceId, spaceId));

    const [{ count: upcomingCount }] = await db
      .select({ count: count() })
      .from(events)
      .where(
        and(
          eq(events.spaceId, spaceId),
          eq(events.status, 'scheduled'),
          gt(events.startDate, new Date()),
        ),
      );

    return {
      total: totalCount,
      upcoming: upcomingCount,
    };
  } catch (error) {
    console.error('Error fetching event counts:', error);
    return {
      total: 0,
      upcoming: 0,
    };
  }
}
