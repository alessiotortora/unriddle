'use server';

import { revalidatePath } from 'next/cache';

import { db } from '@/db';
import { content, contentTypeEnum } from '@/db/schema';

export async function createProject(formData: {
  title: string;
  spaceId: string;
}) {
  try {
    const result = await db
      .insert(content)
      .values({
        title: formData.title,
        spaceId: formData.spaceId,
        contentType: contentTypeEnum.enumValues[0],
      })
      .returning({ id: content.id });

    revalidatePath(`/${formData.spaceId}/projects`);
    return { success: true, data: result[0] };
  } catch (error) {
    console.error('Failed to create project:', error);
    return { success: false, error: 'Failed to create project' };
  }
}
