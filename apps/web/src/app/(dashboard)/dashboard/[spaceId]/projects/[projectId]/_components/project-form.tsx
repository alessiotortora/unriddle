'use client';

import React, { useCallback, useState } from 'react';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { CoverSection } from '@/components/media/cover-section';
import { MediaSection } from '@/components/media/media-section';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TagInput } from '@/components/ui/tag-input';
import { Textarea } from '@/components/ui/textarea';
import {
  Image as ImageType,
  ImagesToContent,
  Video as VideoType,
  VideosToContent,
} from '@/db/schema';
import { updateProject } from '@/lib/actions/update/update-project';
import { isRecordOfString } from '@/lib/utils';

import { ProjectWithRelations } from '../page';
import DetailsInput from './details-input';

type ProjectFormValues = z.infer<typeof formSchema>;

interface ProjectFormProps {
  projectData: ProjectWithRelations | null;
  images: ImageType[];
  videos: VideoType[];
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
        id: z.string(),
        type: z.enum(['url', 'playbackId']),
        value: z.string(),
      })
    )
    .max(8)
    .nullable(),
  coverMedia: z
    .array(
      z.object({
        id: z.string(),
        type: z.enum(['url', 'playbackId']),
        value: z.string(),
      })
    )
    .max(1)
    .nullable(),
  coverImageId: z.string().nullable(),
  coverVideoId: z.string().nullable(),
});

const MemoizedCoverSection = React.memo(CoverSection);
const MemoizedMediaSection = React.memo(MediaSection);

export default function ProjectForm({ projectData, images, videos }: ProjectFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState<string[]>(projectData?.content?.tags || []);
  const [details, setDetails] = useState<{ [key: string]: string }>(
    isRecordOfString(projectData?.details) ? projectData.details : {}
  );

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - i);
  const formattedUpdatedAt = projectData?.updatedAt
    ? format(new Date(projectData.updatedAt), 'dd/MM/yyyy') // Using `MM/dd/yyyy` format
    : 'N/A';
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: projectData?.content?.title || '',
      description: projectData?.content?.description || '',
      year: projectData?.year || currentYear,
      tags: projectData?.content?.tags || [],
      status: projectData?.content?.status || 'draft',
      featured: projectData?.featured ?? true,
      details: isRecordOfString(projectData?.details) ? projectData.details : null,
      media: projectData?.content
        ? [
            ...(projectData.content.imagesToContent || []).map(
              (image: ImagesToContent & { image: ImageType }) => ({
                id: image.image.id,
                type: 'url' as const,
                value: image.image.url || '',
              })
            ),
            ...(projectData.content.videosToContent || []).map(
              (video: VideosToContent & { video: VideoType }) => ({
                id: video.video.id,
                type: 'playbackId' as const,
                value: video.video.playbackId || '',
              })
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

  const handleSubmit = useCallback(
    async (values: ProjectFormValues, status: 'draft' | 'published') => {
      if (isSubmitting) return;
      if (!projectData) {
        toast.error('No project data available');
        return;
      }

      const promise = new Promise((resolve, reject) => {
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

          updateProject(projectData.id, projectData.contentId, payload)
            .then(() => {
              resolve(status);
            })
            .catch(reject)
            .finally(() => {
              setIsSubmitting(false);
            });
        } catch (error) {
          setIsSubmitting(false);
          reject(error);
        }
      });

      toast.promise(promise, {
        loading: status === 'published' ? 'Publishing...' : 'Saving...',
        success: (status) => {
          router.push(`/dashboard/${projectData.content.spaceId}`);
          return status === 'published'
            ? 'Project published successfully!'
            : 'Project saved successfully!';
        },
        error: 'Failed to save project',
      });
    },
    [projectData, router, isSubmitting]
  );

  return (
    <>
      <Form {...form}>
        <form className="space-y-8">
          <MemoizedCoverSection
            control={form.control}
            images={images}
            videos={videos}
            setValue={setValue}
          />

          <div className="mx-auto max-w-3xl space-y-8">
            <div className="flex w-full gap-4 md:flex-row">
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Project name" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormDescription>Name your project clearly.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          defaultValue={field.value?.toString() || currentYear.toString()}
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
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Brief project description"
                      className="w-full rounded-md border border-gray-300 p-2"
                    />
                  </FormControl>
                  <FormDescription>Describe your project's purpose and outcome.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <TagInput
                      {...field}
                      placeholder="Add tags"
                      tags={tags}
                      className="sm:min-w-[450px]"
                      setTags={(newTags) => {
                        setTags(newTags);
                        setValue('tags', newTags as [string, ...string[]]);
                      }}
                    />
                  </FormControl>
                  <FormDescription>Keywords to help find your project.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                  <FormDescription>Add key project details as pairs.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <MemoizedMediaSection
              control={form.control}
              initialMedia={[
                ...(projectData?.content?.imagesToContent || []).map(
                  (image: ImagesToContent & { image: ImageType }) => ({
                    id: image.image.id,
                    type: 'url' as const,
                    value: image.image.url,
                  })
                ),
                ...(projectData?.content?.videosToContent || []).map(
                  (video: VideosToContent & { video: VideoType }) => ({
                    id: video.video.id,
                    type: 'playbackId' as const,
                    value: video.video.playbackId,
                  })
                ),
              ]}
              images={images}
              videos={videos}
            />

            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Featured</FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-start gap-2">
                      <Checkbox checked={field.value ?? true} onCheckedChange={field.onChange} />
                      <Label className="text-foreground">Mark as Featured</Label>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Mark this project as a featured item. Featured projects are highlighted for
                    better visibility.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center justify-between pt-10">
            {projectData && (
              <p className="text-muted-foreground text-xs">Last Updated: {formattedUpdatedAt}</p>
            )}
            <div className="flex space-x-4">
              <Button
                type="button"
                variant="secondary"
                onClick={form.handleSubmit((values) => handleSubmit(values, 'draft'))}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save as Draft'}
              </Button>
              <Button
                type="button"
                variant="default"
                onClick={form.handleSubmit((values) => handleSubmit(values, 'published'))}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Publishing...' : 'Publish'}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}
