'use client';

import { useState, useTransition } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';

import { SignInWithMagicLink } from '../actions';

const formSchema = z.object({
  email: z.string().email(),
});

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const [linkSent, setLinkSent] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  });

  const onMagicLink = async (data: z.infer<typeof formSchema>) => {
    setLinkSent(false);
    startTransition(async () => {
      await SignInWithMagicLink(data.email);
      setLinkSent(true);
    });

    setTimeout(() => {
      setLinkSent(false);
    }, 5000);
  };

  return (
    <div className="mx-auto flex h-dvh max-w-md flex-col items-center justify-center p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onMagicLink)}
          className="flex w-full flex-col gap-2"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="name@domain.com"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button variant="default" type="submit">
            {isPending && <Spinner />}
            {isPending ? '' : linkSent ? 'Link Sent!' : 'Send me a login link'}
          </Button>
          {linkSent && (
            <p className="mt-2 text-sm text-gray-500">
              If you don’t see anything after 2 minutes, we likely couldn’t
              match the provided email to an account.
            </p>
          )}
        </form>
      </Form>
    </div>
  );
}
