'use server';

import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { projects } from '@/db/schema';
import { content } from '@/db/schema';
import { videosToContent } from '@/db/schema';
import { imagesToContent } from '@/db/schema';

export async function updateProject(
  projectId: string,
  payload: {
    title: string;
    description: string | null;
    year: number | null;
    tags: string[];
    status: 'draft' | 'published';
    coverImageUrl: string | null;
    coverVideoPlaybackId: string | null;
    details: Record<string, unknown> | null;
    featured: boolean;
    images: string[] | null;
    videos: string[] | null;
  },
) {
  try {
    const contentPayload = {
      title: payload.title,
      description: payload.description ?? null,
      status: payload.status,
      tags: payload.tags ?? null,
      coverImageId: payload.coverImageUrl ?? null,
      coverVideoId: payload.coverVideoPlaybackId ?? null,
    };

    const projectPayload = {
      year: payload.year ?? null,
      featured: payload.featured,
      details: payload.details ?? {},
    };

    await db.transaction(async (tx) => {
      // Update content and project tables
      console.log('Updating Content:', contentPayload);
      await tx
        .update(content)
        .set(contentPayload)
        .where(eq(content.id, projectId));

      console.log('Updating Project:', projectPayload);
      await tx
        .update(projects)
        .set(projectPayload)
        .where(eq(projects.contentId, projectId));

      // Always clear existing relationships first
      console.log('Clearing Videos and Images for Project:', projectId);
      await tx
        .delete(videosToContent)
        .where(eq(videosToContent.contentId, projectId));

      await tx
        .delete(imagesToContent)
        .where(eq(imagesToContent.contentId, projectId));

      // Insert new relationships if arrays are not empty
      if (payload.videos?.length) {
        console.log('Inserting Videos:', payload.videos);
        await tx.insert(videosToContent).values(
          payload.videos.map((videoId) => ({
            videoId,
            contentId: projectId,
          })),
        );
      }

      if (payload.images?.length) {
        console.log('Inserting Images:', payload.images);
        await tx.insert(imagesToContent).values(
          payload.images.map((imageId) => ({
            imageId,
            contentId: projectId,
          })),
        );
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating project:', error);
    throw new Error('Failed to update project');
  }
}
