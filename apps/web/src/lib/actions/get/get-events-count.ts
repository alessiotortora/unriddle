'use server';

import { count, eq, sql } from 'drizzle-orm';
import { cache } from 'react';
import { validate } from 'uuid';

import { db } from '@/db';
import { events } from '@/db/schema';

export const getEventsCount = cache(async (spaceId: string) => {
  if (!spaceId || !validate(spaceId)) {
    console.error('Invalid or missing spaceId:', spaceId);
    return {
      total: 0,
      upcoming: 0,
    };
  }

  try {
    const now = new Date().toISOString();
    // Get both counts in a single query
    const [result] = await db
      .select({
        total: count(events.id),
        upcoming: count(
          sql`CASE WHEN ${events.status} = 'scheduled' AND ${events.startDate}::timestamp > ${now}::timestamp THEN 1 END`
        ),
      })
      .from(events)
      .where(eq(events.spaceId, spaceId));

    return {
      total: result?.total ?? 0,
      upcoming: result?.upcoming ?? 0,
    };
  } catch (error) {
    console.error('Error fetching event counts:', error);
    return {
      total: 0,
      upcoming: 0,
    };
  }
});
