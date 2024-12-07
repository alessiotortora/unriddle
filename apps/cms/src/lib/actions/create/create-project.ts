'use server';

import { revalidatePath } from 'next/cache';

import { db } from '@/db';
import { content, contentTypeEnum } from '@/db/schema';
import { projects } from '@/db/schema/projects';

export async function createProject(formData: { spaceId: string }) {
  try {
    // Start a transaction to ensure both operations succeed or fail together
    const result = await db.transaction(async (tx) => {
      // Create content first
      const [contentResult] = await tx
        .insert(content)
        .values({
          spaceId: formData.spaceId,
          contentType: contentTypeEnum.enumValues[0],
        })
        .returning({ id: content.id });

      // Create project using the content id
      const [projectResult] = await tx
        .insert(projects)
        .values({
          contentId: contentResult.id,
          year: new Date().getFullYear(),
          featured: false,
          details: {},
        })
        .returning({ id: projects.id });

      return {
        contentId: contentResult.id,
        projectId: projectResult.id,
      };
    });

    revalidatePath(`/${formData.spaceId}/projects`);
    return { success: true, data: result };
  } catch (error) {
    console.error('Failed to create project:', error);
    return { success: false, error: 'Failed to create project' };
  }
}
