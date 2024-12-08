'use server';

import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { projects } from '@/db/schema';

export async function deleteProject(formData: { contentId: string }) {
  try {
    await db.delete(projects).where(eq(projects.contentId, formData.contentId));
    return { success: true, data: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete project' };
  }
}
