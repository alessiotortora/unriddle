'use client';

import { useEffect, useState } from 'react';

import { useParams, useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { BaseDialog } from '@/components/dialogs/base-dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createProject } from '@/lib/actions/create/create-project';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
});

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCancel?: () => void;
  title: string;
  description: string;
}

export const ProjectDialog = ({
  isOpen,
  onClose,
  onCancel,
  title,
  description,
}: ProjectModalProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  });

  const handleCancel = () => {
    form.reset();
    onCancel?.() || onClose();
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const spaceId = params.spaceId as string;
    if (!spaceId) {
      toast.error('Store ID is required');
      return;
    }

    try {
      setLoading(true);
      const response = await createProject({
        title: values.title,
        spaceId: spaceId,
      });

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to create project');
      }

      toast.success('Project created successfully');
      onClose();
      router.refresh();
      router.push(`/dashboard/${spaceId}/projects/${response.data.id}`);
    } catch (error) {
      toast.error('Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseDialog
      title={title}
      description={description}
      isOpen={isOpen}
      onClose={handleCancel}
    >
      <div className="space-y-4 py-2 pb-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="example"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-end space-x-2 pt-6">
              <Button
                disabled={loading}
                variant="outline"
                onClick={handleCancel}
                type="button"
              >
                Cancel
              </Button>
              <Button disabled={loading} type="submit">
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </BaseDialog>
  );
};
