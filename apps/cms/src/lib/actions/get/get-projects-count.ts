'use server';

import { and, count, eq } from 'drizzle-orm';

import { db } from '@/db';
import { content, projects } from '@/db/schema';

export async function getProjectsCount(spaceId: string) {
  try {
    const [{ count: totalCount }] = await db
      .select({ count: count() })
      .from(projects)
      .innerJoin(content, eq(projects.contentId, content.id))
      .where(
        and(eq(content.spaceId, spaceId), eq(content.contentType, 'project')),
      );

    const [{ count: publishedCount }] = await db
      .select({ count: count() })
      .from(projects)
      .innerJoin(content, eq(projects.contentId, content.id))
      .where(
        and(
          eq(content.spaceId, spaceId),
          eq(content.contentType, 'project'),
          eq(content.status, 'published'),
        ),
      );

    return {
      total: totalCount,
      published: publishedCount,
    };
  } catch (error) {
    console.error('Error fetching project counts:', error);
    return {
      total: 0,
      published: 0,
    };
  }
}
