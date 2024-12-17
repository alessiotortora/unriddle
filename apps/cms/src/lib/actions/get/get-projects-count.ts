'use server';

import { and, count, eq } from 'drizzle-orm';
import { validate } from 'uuid';

import { db } from '@/db';
import { content, projects } from '@/db/schema';

export async function getProjectsCount(spaceId: string) {
  if (!spaceId || !validate(spaceId)) {
    console.error('Invalid or missing spaceId:', spaceId);
    return {
      total: 0,
      published: 0,
    };
  }

  try {
    // Get total count
    const [totalResult] = await db
      .select({
        value: count(projects.id),
      })
      .from(projects)
      .innerJoin(content, eq(projects.contentId, content.id))
      .where(
        and(eq(content.spaceId, spaceId), eq(content.contentType, 'project')),
      );

    // Get published count
    const [publishedResult] = await db
      .select({
        value: count(projects.id),
      })
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
      total: totalResult?.value ?? 0,
      published: publishedResult?.value ?? 0,
    };
  } catch (error) {
    console.error('Error fetching project counts:', error);
    return {
      total: 0,
      published: 0,
    };
  }
}
