import Image from 'next/image';
import Link from 'next/link';

import { format } from 'date-fns';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Event } from '@/db/schema';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const spaceId = '1';

  return (
    <Link href={`/dashboard/${spaceId}/events/${event.id}`}>
      <Card className="hover:bg-muted/50 transition-colors">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold">{event.title}</h3>
              {event.startDate && (
                <p className="text-muted-foreground text-sm">
                  {format(event.startDate, 'PPP')}
                </p>
              )}
            </div>
            <Badge variant={event.status === 'draft' ? 'secondary' : 'default'}>
              {event.status}
            </Badge>
          </div>
          {event.description && (
            <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
              {event.description}
            </p>
          )}
        </CardContent>
        {event.coverImageId && (
          <CardFooter className="p-0">
            <div className="relative h-48 w-full">
              <Image
                src={`/api/images/${event.coverImageId}`}
                alt={event.title}
                fill
                className="rounded-b-lg object-cover"
              />
            </div>
          </CardFooter>
        )}
      </Card>
    </Link>
  );
}
