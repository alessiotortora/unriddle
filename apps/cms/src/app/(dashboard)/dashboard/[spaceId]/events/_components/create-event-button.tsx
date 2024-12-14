'use client';

import { useParams, useRouter } from 'next/navigation';

import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { createEvent } from '@/lib/actions/create/create-event';

export function CreateEventButton() {
  const params = useParams();
  const router = useRouter();
  const spaceId = params.spaceId as string;

  const handleCreateEvent = async () => {
    if (!spaceId) {
      toast.error('Space ID is required');
      return;
    }

    try {
      const response = await createEvent({
        spaceId: spaceId,
      });

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to create event');
      }

      toast.success('Event created successfully');
      router.refresh();
      router.push(`/dashboard/${spaceId}/events/${response.data.eventId}`);
    } catch (error) {
      toast.error('Failed to create event');
    }
  };

  return (
    <Button onClick={handleCreateEvent}>
      <Plus className="mr-2 h-4 w-4" />
      New Event
    </Button>
  );
}
