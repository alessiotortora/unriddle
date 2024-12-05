'use server';

import { db } from '@/db';

export async function getProject(projectId: string) {
  try {
    const project = await db.query.projects.findFirst({
      where: (projects, { eq }) => eq(projects.contentId, projectId),
      with: {
        content: {
          with: {
            coverImage: true,
            coverVideo: true,
            videosToContent: {
              with: {
                video: true,
              },
            },
            imagesToContent: {
              with: {
                image: true,
              },
            },
          },
        },
      },
    });

    if (!project) {
      return null;
    }

    return project;
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}
