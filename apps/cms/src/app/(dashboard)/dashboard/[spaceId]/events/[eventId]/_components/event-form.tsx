'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { DateTimePicker } from '@/components/ui/data-time-picker';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Event } from '@/db/schema';
import { toast } from 'sonner';
import { useParams, useRouter } from 'next/navigation';
import { updateEvent } from '@/lib/actions/update/update-event';

interface EventFormProps {
  eventData: Event | null;
}

const eventFormSchema = z.object({
  title: z.string().max(256, {
    message: 'Title must be 256 characters or less.',
  }),
  description: z.string(),
  startDate: z.object({
    date: z.date(),
    hasTime: z.boolean(),
  }),
  endDate: z.object({
    date: z.date(),
    hasTime: z.boolean(),
  }),
  location: z.string(),
  client: z.string(),
  link: z.string().url({ message: 'Please enter a valid URL.' }).optional(),
  type: z.string(),
  status: z.string(),
  coverImage: z.string(),
  space: z.string(),
  details: z.record(z.string(), z.string()),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

export function EventForm({ eventData }: EventFormProps) {
  const params = useParams();
  const router = useRouter();
  const spaceId = params.spaceId as string;

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: eventData?.title || '',
      description: eventData?.description || '',
      startDate: { 
        date: eventData?.startDate ? new Date(eventData.startDate) : new Date(), 
        hasTime: false 
      },
      endDate: { 
        date: eventData?.endDate ? new Date(eventData.endDate) : new Date(), 
        hasTime: false 
      },
      location: eventData?.location || '',
      client: eventData?.client || '',
      link: eventData?.link || '',
      type: eventData?.type || 'other',
      status: eventData?.status || 'draft',
      details: eventData?.details || {},
    },
  });

  async function onSubmit(data: EventFormValues, isDraft: boolean) {
    try {
      const status = isDraft ? 'draft' : 'scheduled';
      
      const response = await updateEvent({
        ...data,
        id: eventData?.id!,
        spaceId,
        status,
        startDate: data.startDate.date,
        endDate: data.endDate.date,
      });

      if (!response.success) {
        throw new Error(response.error);
      }

      toast.success(isDraft ? 'Draft saved' : 'Event published');
      router.refresh();
    } catch (error) {
      toast.error('Failed to save event');
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => onSubmit(data, false))}
        className="space-y-8"
      >
        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Event title" {...field} />
                </FormControl>
                <FormDescription>
                  The title of your event (max 256 characters).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="exhibition">Exhibition</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    {/* Add more event types as needed */}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date & Time</FormLabel>
                <DateTimePicker
                  date={field.value.date}
                  setDate={(newDate) =>
                    field.onChange({ ...field.value, date: newDate })
                  }
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date & Time</FormLabel>
                <DateTimePicker
                  date={field.value.date}
                  setDate={(newDate) =>
                    field.onChange({ ...field.value, date: newDate })
                  }
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Event location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="client"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client</FormLabel>
                <FormControl>
                  <Input
                    placeholder="External collaborator/organization"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>External Link</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="space"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Space</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a space" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="venue1">Venue 1</SelectItem>
                    <SelectItem value="room1">Room 1</SelectItem>
                    {/* Add more spaces as needed */}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onSubmit(form.getValues(), true)}
          >
            Save as Draft
          </Button>
          <Button type="submit">Publish</Button>
        </div>
      </form>
    </Form>
  );
}
