import Image from 'next/image';
import Link from 'next/link';

import { format } from 'date-fns';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface ProjectCardProps {
  project: {
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
  if (!project.content.title) return null; // Skip rendering if no title

  const coverImage = project.content.coverImage?.url;
  const coverVideo = project.content.coverVideo?.playbackId;
  const thumbnailUrl = coverVideo
    ? `https://image.mux.com/${coverVideo}/thumbnail.webp`
    : coverImage;

  return (
    <Link
      href={`/dashboard/${project.content.spaceId}/projects/${project.contentId}`}
    >
      <Card className="hover:border-primary group overflow-hidden transition-colors">
        <div className="relative aspect-video w-full overflow-hidden">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={project.content.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="bg-muted flex h-full w-full items-center justify-center">
              No cover image
            </div>
          )}
          <div className="absolute right-2 top-2">
            <Badge
              variant={
                project.content.status === 'published' ? 'default' : 'secondary'
              }
            >
              {project.content.status}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold">{project.content.title}</h3>
          {project.content.description && (
            <p className="text-muted-foreground mt-2 line-clamp-2">
              {project.content.description}
            </p>
          )}
        </CardContent>
        <CardFooter className="text-muted-foreground p-4 pt-0 text-sm">
          Last updated {format(new Date(project.updatedAt), 'MMM d, yyyy')}
        </CardFooter>
      </Card>
    </Link>
  );
}
