import PageContainer from '@/components/layout/page-container';
import { getEvent } from '@/lib/actions/get/get-event';
import { getMedia } from '@/lib/actions/get/get-media';

import { EventForm } from './_components/event-form';

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ spaceId: string; eventId: string }>;
}) {
  const eventId = (await params).eventId;
  const spaceId = (await params).spaceId;
  const event = await getEvent(eventId);

  return (
    <PageContainer scrollable={true}>
      <EventForm eventData={event} />
    </PageContainer>
  );
}
