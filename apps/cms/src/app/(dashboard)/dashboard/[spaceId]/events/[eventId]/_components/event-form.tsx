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

const eventFormSchema = z.object({
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
  link: z.string().url({ message: 'Please enter a valid URL.' }).optional(),
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
});

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
                    {eventTypeEnum.enumValues.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Event description"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
