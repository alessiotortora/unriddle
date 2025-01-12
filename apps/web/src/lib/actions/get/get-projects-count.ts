'use server';

import { and, count, eq, sql } from 'drizzle-orm';
import { cache } from 'react';
import { validate } from 'uuid';

import { db } from '@/db';
import { content, projects } from '@/db/schema';

export const getProjectsCount = cache(async (spaceId: string) => {
  if (!spaceId || !validate(spaceId)) {
    console.error('Invalid or missing spaceId:', spaceId);
    return {
      total: 0,
      published: 0,
    };
  }

  try {
    // Get both counts in a single query
    const [result] = await db
      .select({
        total: count(projects.id),
        published: count(sql`CASE WHEN ${content.status} = 'published' THEN 1 END`),
      })
      .from(projects)
      .innerJoin(content, eq(projects.contentId, content.id))
      .where(and(eq(content.spaceId, spaceId), eq(content.contentType, 'project')));

    return {
      total: result?.total ?? 0,
      published: result?.published ?? 0,
    };
  } catch (error) {
    console.error('Error fetching project counts:', error);
    return {
      total: 0,
      published: 0,
    };
  }
});
