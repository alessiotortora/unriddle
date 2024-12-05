'use server';

import { desc } from 'drizzle-orm';

import { db } from '@/db';
import { projects } from '@/db/schema';

export async function getProjects() {
  try {
    const projectsData = await db.query.projects.findMany({
      with: {
        content: true,
      },
      orderBy: [desc(projects.createdAt)],
    });

    if (!projectsData || projectsData.length === 0) {
      return [];
    }

    return projectsData;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}
