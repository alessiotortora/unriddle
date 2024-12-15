import { Suspense } from 'react';

import { Heading } from '@/components/layout/heading';
import PageContainer from '@/components/layout/page-container';
import { getEvents } from '@/lib/actions/get/get-events';

import { CreateEventButton } from './_components/create-event-button';
import { EventCard } from './_components/event-card';
import { EventsGrid } from './_components/events-grid';

async function EventsList() {
  const events = await getEvents();

  return (
    <EventsGrid>
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </EventsGrid>
  );
}

export default function EventsPage() {
  return (
    <PageContainer scrollable>
      <div className="flex h-full flex-col space-y-8">
        <div className="flex items-center justify-between">
          <Heading
            title="Events"
            description="Manage and organize your events"
          />
          <CreateEventButton />
        </div>

        <Suspense fallback={<EventsGridSkeleton />}>
          <EventsList />
        </Suspense>
      </div>
    </PageContainer>
  );
}

function EventsGridSkeleton() {
  return (
    <EventsGrid>
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="bg-muted aspect-video w-full animate-pulse rounded-lg"
        />
      ))}
    </EventsGrid>
  );
}
