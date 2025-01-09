'use client';

import React from 'react';

import { useParams, useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { CoverSection } from '@/components/media/cover-section';
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
import { Image as Images } from '@/db/schema';
import { Event, eventStatusEnum, eventTypeEnum } from '@/db/schema';
import { updateEvent } from '@/lib/actions/update/update-event';

interface EventFormProps {
  eventData: Event | null;
  images: Images[];
}

const eventFormSchema = z
  .object({
    title: z.string().max(256, {
      message: 'Title must be 256 characters or less.',
    }),
    description: z.string().optional(),
    startDate: z.object({
      date: z.date(),
      hasTime: z.boolean(),
    }),
    endDate: z.object({
      date: z.date(),
      hasTime: z.boolean(),
    }),
    location: z.string().optional(),
    client: z.string().optional(),
    link: z
      .string()
      .transform((url) => {
        if (!url) return '';
        if (url.startsWith('www.')) {
          return `https://${url}`;
        }
        if (url.startsWith('http://')) {
          return url.replace('http://', 'https://');
        }
        if (!url.startsWith('http')) {
          return `https://${url}`;
        }
        return url;
      })
      .refine(
        (url) => {
          if (!url) return true;
          try {
            new URL(url);
            return true;
          } catch {
            return false;
          }
        },
        { message: 'Please enter a valid URL.' },
      )
      .optional(),
    type: z.enum(eventTypeEnum.enumValues),
    status: z.enum(eventStatusEnum.enumValues),
    details: z.record(z.string(), z.string()).optional(),
    coverMedia: z
      .array(
        z.object({
          id: z.string().optional(),
          type: z.enum(['url']),
          value: z.string().nullable(),
        }),
      )
      .optional(),
    coverImageId: z.string().nullable().optional(),
  })
  .refine(
    (data) => {
      const startDateTime = data.startDate.date.getTime();
      const endDateTime = data.endDate.date.getTime();
      return endDateTime > startDateTime;
    },
    {
      message: 'End date and time must be after start date and time',
      path: ['endDate'], // This will show the error on the endDate field
    },
  );

const MemoizedCoverSection = React.memo(CoverSection);

type EventFormValues = z.infer<typeof eventFormSchema>;

export function EventForm({ eventData, images }: EventFormProps) {
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
        hasTime: false,
      },
      endDate: {
        date: eventData?.endDate ? new Date(eventData.endDate) : new Date(),
        hasTime: false,
      },
      location: eventData?.location || '',
      client: eventData?.client || '',
      link: eventData?.link || '',
      type: eventData?.type || 'other',
      status: eventData?.status || 'draft',
      details: eventData?.details || {},
      coverMedia: eventData?.coverImageId
        ? [
            {
              id: eventData.coverImageId,
              type: 'url',
              value:
                images?.find((img) => img.id === eventData.coverImageId)?.url ||
                null,
            },
          ]
        : [],
      coverImageId: eventData?.coverImageId || null,
    },
  });

  async function onSubmit(data: EventFormValues, isDraft: boolean) {
    try {
      const status = isDraft ? 'draft' : 'scheduled';

      const response = await updateEvent({
        id: eventData?.id!,
        title: data.title,
        description: data.description || null,
        startDate: data.startDate.date,
        endDate: data.endDate.date,
        location: data.location || null,
        client: data.client || null,
        link: data.link || null,
        type: data.type,
        status: status as (typeof eventStatusEnum.enumValues)[number],
        details: data.details || {},
        coverImageId: data.coverImageId || null,
        createdAt: eventData?.createdAt || new Date(),
        updatedAt: new Date(),
        spaceId,
      });

      if (!response.success) {
        throw new Error(response.error);
      }

      toast.success(isDraft ? 'Draft saved' : 'Event published');
      router.push(`/dashboard/${eventData?.spaceId}`);
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
        <MemoizedCoverSection
          control={form.control}
          images={images}
          setValue={form.setValue}
          imagesOnly={true}
        />

        <div className="mx-auto max-w-3xl space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Summer Design Workshop" {...field} />
                </FormControl>
                <FormDescription>
                  Name your event clearly and concisely.
                </FormDescription>
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
                  <Input placeholder="Client name" {...field} />
                </FormControl>
                <FormDescription>
                  Organization or partner for this event.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Brief description of your event"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormDescription>
                  Describe what attendees can expect.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <DateTimePicker
                  date={field.value.date}
                  setDate={(newDate) => {
                    field.onChange({ ...field.value, date: newDate });
                    form.trigger('endDate');
                  }}
                />
                <FormDescription>
                  Select when your event begins. This will be displayed to
                  attendees and used for scheduling.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date</FormLabel>
                <DateTimePicker
                  date={field.value.date}
                  setDate={(newDate) => {
                    field.onChange({ ...field.value, date: newDate });
                    form.trigger('endDate');
                  }}
                />
                <FormDescription>
                  Select when your event ends. Make sure it's after the start
                  date and includes any post-event activities.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Venue or Online" {...field} />
                </FormControl>
                <FormDescription>
                  Where the event will take place.
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
                      <SelectValue placeholder="Select the type of event" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {eventTypeEnum.enumValues.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Categorize your event to help attendees understand its format
                  and purpose. This helps with filtering and discovery.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>External Link</FormLabel>
                <FormControl>
                  <Input placeholder="Registration or event link" {...field} />
                </FormControl>
                <FormDescription>
                  Link to event details or registration.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4 pt-10">
          <Button
            type="button"
            variant="secondary"
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
