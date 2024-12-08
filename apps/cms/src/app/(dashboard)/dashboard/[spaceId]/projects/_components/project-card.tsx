import Image from 'next/image';
import Link from 'next/link';

import { format } from 'date-fns';
import { File, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

import { DeleteProjectButton } from './delete-project-button';

interface ProjectCardProps {
  project: {
    id: string;
    contentId: string;
    year: number | null;
    featured: boolean | null;
    updatedAt: Date;
    content: {
      id: string;
      spaceId: string;
      title: string | null;
      description: string | null;
      status: 'draft' | 'published' | 'archived' | null;
      coverImage: { url: string | null } | null;
      coverVideo: { playbackId: string | null } | null;
    };
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  if (!project.content.title) return null;

  const coverImage = project.content.coverImage?.url;
  const coverVideo = project.content.coverVideo?.playbackId;
  const thumbnailUrl = coverVideo
    ? `https://image.mux.com/${coverVideo}/thumbnail.webp`
    : coverImage;

  return (
    <div className="relative">
      <Link
        href={`/dashboard/${project.content.spaceId}/projects/${project.id}`}
      >
        <Card className="hover:border-primary group relative overflow-hidden transition-colors">
          <div className="relative aspect-video w-full overflow-hidden">
            {thumbnailUrl ? (
              <Image
                src={thumbnailUrl}
                alt={project.content.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="bg-muted flex h-full w-full" />
            )}
          </div>

          <CardContent className="relative p-4">
            <div className="absolute left-3 top-[-12px]">
              <File
                className="text-muted-foreground fill-background"
                size={24}
              />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{project.content.title}</h3>
              <Badge
                variant={
                  project.content.status === 'published'
                    ? 'secondary'
                    : 'outline'
                }
              >
                {project.content.status}
              </Badge>
            </div>
          </CardContent>
          <CardFooter className="text-muted-foreground p-4 pt-0 text-xs">
            Last updated {format(new Date(project.updatedAt), 'MMM d, yyyy')}
          </CardFooter>
        </Card>
      </Link>
      <div className="absolute right-3 top-3">
        <DeleteProjectButton
          projectTitle={project.content.title || 'Untitled Project'}
          contentId={project.contentId}
        />
      </div>
    </div>
  );
}
