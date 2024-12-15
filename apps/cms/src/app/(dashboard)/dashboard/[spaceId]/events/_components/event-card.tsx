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
  if (!event) return null;

  return (
    <Link href={`/dashboard/${event.spaceId}/events/${event.id}`}>
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
        </CardContent>
      </Card>
    </Link>
  );
}
