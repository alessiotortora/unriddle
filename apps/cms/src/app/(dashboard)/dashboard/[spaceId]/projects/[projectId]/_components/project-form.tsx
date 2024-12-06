'use client';

// react
import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
// form
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
// components
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Image as Images, Video } from '@/db/schema';
import { updateProject } from '@/lib/actions/update/update-project';
// utils
import { isRecordOfString } from '@/lib/utils';

import { Project } from '../page';
import { CoverSection } from './cover-section';
import DetailsInput from './details-input';
import MediaSection from './media-section';
import { MediaSelector } from './media-selector';
// custom components
import { TagInput } from './tag-input';

type ProjectFormValues = z.infer<typeof formSchema>;

interface ProjectFormProps {
  projectData: Project | null;
  images: Images[];
  videos: Video[];
}

const formSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  year: z.number().int().min(1900).max(new Date().getFullYear()).nullable(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  featured: z.boolean().default(false),
  details: z.record(z.string(), z.string()).nullable(),
  media: z
    .array(
      z.object({
        id: z.string().optional(),
        type: z.enum(['url', 'playbackId']),
        value: z.string(),
      }),
    )
    .max(8)
    .nullable(),
  coverMedia: z
    .array(
      z.object({
        id: z.string(),
        type: z.enum(['url', 'playbackId']),
        value: z.string(),
      }),
    )
    .max(1)
    .nullable(),
  coverImageId: z.string().nullable(),
  coverVideoId: z.string().nullable(),
});

export default function ProjectForm({
  projectData,
  images,
  videos,
}: ProjectFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState<string[]>(projectData?.content?.tags || []);
  const [details, setDetails] = useState<{ [key: string]: string }>(
    isRecordOfString(projectData?.details) ? projectData.details : {},
  );

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - i);
  const formattedUpdatedAt = projectData?.updatedAt
    ? format(new Date(projectData.updatedAt), 'MM/dd/yyyy') // Using `MM/dd/yyyy` format
    : 'N/A';

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: projectData?.content?.title || '',
      description: projectData?.content?.description || '',
      year: projectData?.year || currentYear,
      tags: projectData?.content?.tags || [],
      status: projectData?.content?.status || 'draft',
      featured: projectData?.featured ?? false,
      details: isRecordOfString(projectData?.details)
        ? projectData.details
        : null,
      media: projectData?.content
        ? [
            ...(projectData.content.imagesToContent || []).map(
              (image: any) => ({
                id: image.imageId,
                type: 'url' as const,
                value: image.url,
              }),
            ),
            ...(projectData.content.videosToContent || []).map(
              (video: any) => ({
                id: video.videoId,
                type: 'playbackId' as const,
                value: video.playbackId,
              }),
            ),
          ]
        : null,
      coverMedia: projectData?.content?.coverImageId
        ? [
            {
              id: projectData.content.coverImageId,
              type: 'url',
              value: projectData.content.coverImage?.url || '',
            },
          ]
        : projectData?.content?.coverVideoId
          ? [
              {
                id: projectData.content.coverVideoId,
                type: 'playbackId',
                value: projectData.content.coverVideo?.playbackId || '',
              },
            ]
          : null,
      coverImageId: projectData?.content?.coverImageId || null,
      coverVideoId: projectData?.content?.coverVideoId || null,
    },
  });

  const { setValue } = form;

  const onSubmit = async (
    values: ProjectFormValues,
    status: 'draft' | 'published',
  ) => {
    if (isSubmitting) return;
    if (!projectData) {
      toast.error('No project data available');
      return;
    }

    const promise = new Promise(async (resolve, reject) => {
      try {
        setIsSubmitting(true);

        const images = values.media
          ? values.media
              .filter((item) => item.type === 'url' && item.id)
              .map((item) => item.id as string)
          : null;
        const videos = values.media
          ? values.media
              .filter((item) => item.type === 'playbackId' && item.id)
              .map((item) => item.id as string)
          : null;

        const payload = {
          title: values.title,
          description: values.description ?? null,
          year: values.year ?? null,
          tags: values.tags ?? [],
          status,
          coverImageUrl: values.coverImageId ?? null,
          coverVideoPlaybackId: values.coverVideoId ?? null,
          details: values.details || null,
          featured: values.featured ?? false,
          images: images ?? null,
          videos: videos ?? null,
        };

        await updateProject(projectData.contentId, payload);
        resolve(status);
      } catch (error) {
        reject(error);
      } finally {
        setIsSubmitting(false);
      }
    });

    toast.promise(promise, {
      loading: status === 'published' ? 'Publishing...' : 'Saving...',
      success: (status) => {
        router.push(`/dashboard`);
        return status === 'published'
          ? 'Project published successfully!'
          : 'Project saved successfully!';
      },
      error: 'Failed to save project',
    });
  };

  return (
    <>
      <div>
        <Form {...form}>
          <form className="flex w-full flex-col gap-6">
            <CoverSection
              control={form.control}
              images={images}
              videos={videos}
              setValue={setValue}
            />

            <div className="flex justify-between gap-2">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={'Enter project title'}
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the name of the project
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Year Field */}
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(parseInt(value))
                        }
                        defaultValue={
                          field.value?.toString() || currentYear.toString()
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {yearOptions.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      Choose the year when the project was completed.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter project description"
                      className="w-full rounded-md border border-gray-300 p-2"
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a brief description of the project.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tags Field */}
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <TagInput
                      {...field}
                      placeholder="e.g., design, marketing, video, software"
                      tags={tags}
                      className="sm:min-w-[450px]"
                      setTags={(newTags) => {
                        setTags(newTags);
                        setValue('tags', newTags as [string, ...string[]]);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Add keywords that describe your project. This will help
                    others find it. Example tags could include: industry, type
                    of work, or technology used.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Featured Field */}
            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Featured</FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-start gap-2">
                      <Checkbox
                        checked={field.value ?? false}
                        onCheckedChange={field.onChange}
                      />
                      <Label className="text-foreground">
                        Mark as Featured
                      </Label>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Mark this project as a featured item. Featured projects are
                    highlighted for better visibility.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Details Field */}
            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Details</FormLabel>
                  <FormControl>
                    <DetailsInput
                      details={details}
                      setDetails={(newDetails) => {
                        setDetails(newDetails);
                        field.onChange(newDetails);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Add any extra information in key-value pairs. Examples:
                    Technology - React.js, Medium - Video.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Replace Media Items Field with MediaSection */}
            <MediaSection
              control={form.control}
              initialMedia={[
                ...(projectData?.content?.imagesToContent || []).map(
                  (image: any) => ({
                    id: image.imageId,
                    type: 'url' as const,
                    value: image.image.url,
                  }),
                ),
                ...(projectData?.content?.videosToContent || []).map(
                  (video: any) => ({
                    id: video.videoId,
                    type: 'playbackId' as const,
                    value: video.video.playbackId,
                  }),
                ),
              ]}
              images={images}
              videos={videos}
            />

            {/* Submit Buttons */}
            <div className="mt-8 flex items-center justify-between space-x-4">
              {projectData && (
                <p className="text-muted-foreground text-xs">
                  Last Updated: {formattedUpdatedAt}
                </p>
              )}
              <div className="flex gap-x-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={form.handleSubmit((values) =>
                    onSubmit(values, 'draft'),
                  )}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  type="button"
                  variant="default"
                  onClick={form.handleSubmit((values) =>
                    onSubmit(values, 'published'),
                  )}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Publishing...' : 'Save and Publish'}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
