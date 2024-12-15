'use client';

import * as React from 'react';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Github,
  Globe,
  Instagram,
  Key,
  Link,
  LinkIcon,
  Linkedin,
  Twitter,
  UserRound,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@/hooks/use-user';
import { generateApiKey } from '@/lib/actions/generate-api-key';
import { updateUser } from '@/lib/actions/update/update-user';

import { BaseDialog } from './base-dialog';

const urlSchema = z
  .string()
  .url({ message: 'Please enter a valid URL.' })
  .nullable()
  .refine(
    (url) => {
      if (!url) return true; // Allow null
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    },
    { message: 'Must be a valid URL' },
  );

const formSchema = z.object({
  email: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  bio: z.string().nullable(),
  apiKey: z.string().nullable(),
  location: z.string().nullable(),
  socialLinks: z
    .object({
      twitter: urlSchema,
      github: urlSchema,
      instagram: urlSchema,
      linkedin: urlSchema,
      website: urlSchema,
      other: urlSchema,
    })
    .nullable(),
});

type FormValues = z.infer<typeof formSchema>;

const data = {
  nav: [
    { name: 'My account', icon: UserRound },
    { name: 'My social links', icon: LinkIcon },
    { name: 'My API key', icon: Key },
  ],
};

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    bio: string | null;
    location: string | null;
    role: 'guest' | 'user' | 'admin';
    apiKey: string | null;
    createdAt: Date;
    updatedAt: Date;
    socialLinks: Array<{
      twitter: string | null;
      github: string | null;
      instagram: string | null;
      linkedin: string | null;
      website: string | null;
      other: string | null;
    }> | null;
  };
}

function ProfileSection({
  form,
}: {
  form: ReturnType<typeof useForm<FormValues>>;
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <FormLabel>Email</FormLabel>
        <Input value={form.getValues().email} disabled />
      </div>
      <FormField
        control={form.control}
        name="firstName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>First Name</FormLabel>
            <FormControl>
              <Input {...field} value={field.value || ''} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="lastName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Last Name</FormLabel>
            <FormControl>
              <Input {...field} value={field.value || ''} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="bio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bio</FormLabel>
            <FormControl>
              <Textarea {...field} value={field.value || ''} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}

function SocialLinksSection({
  form,
}: {
  form: ReturnType<typeof useForm<FormValues>>;
}) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="socialLinks.twitter"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Twitter className="h-4 w-4" />
              Twitter
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value || ''}
                placeholder="https://twitter.com/username"
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="socialLinks.github"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Github className="h-4 w-4" />
              Github
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value || ''}
                placeholder="https://github.com/username"
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="socialLinks.linkedin"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value || ''}
                placeholder="https://linkedin.com/in/username"
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="socialLinks.instagram"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Instagram className="h-4 w-4" />
              Instagram
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value || ''}
                placeholder="https://instagram.com/username"
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="socialLinks.website"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Website
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value || ''}
                placeholder="https://your-website.com"
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="socialLinks.other"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              Other
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value || ''}
                placeholder="https://"
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}

function ApiSection({
  user,
  form,
}: {
  user: SettingsDialogProps['user'];
  form: ReturnType<typeof useForm<FormValues>>;
}) {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [showApiKey, setShowApiKey] = React.useState(false);

  const generateNewApiKey = async () => {
    setIsGenerating(true);
    try {
      const response = await generateApiKey(user.id);

      if (!response.success || !response.apiKey) {
        throw new Error(response.error || 'Failed to generate API key');
      }

      // Update form value
      form.setValue('apiKey', response.apiKey);

      // Show the API key after generation
      setShowApiKey(true);
    } catch (error) {
      toast.error('Failed to generate API key');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">API Key</h3>
        <p className="text-muted-foreground text-sm">
          Your API key provides access to the API. Keep it secure and never
          share it publicly.
        </p>
      </div>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="apiKey"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-4">
                <FormControl>
                  <Input
                    {...field}
                    type={showApiKey ? 'text' : 'password'}
                    value={field.value || ''}
                    readOnly
                    className="font-mono"
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowApiKey(!showApiKey)}
                  disabled={!field.value}
                >
                  {showApiKey ? 'Hide' : 'Show'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (field.value) {
                      navigator.clipboard.writeText(field.value);
                      toast.success('API key copied to clipboard');
                    }
                  }}
                  disabled={!field.value}
                >
                  Copy
                </Button>
              </div>
            </FormItem>
          )}
        />

        <Button
          type="button"
          variant="default"
          onClick={generateNewApiKey}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate New API Key'}
        </Button>

        <p className="text-muted-foreground text-sm">
          Generating a new API key will invalidate your existing key. Make sure
          to update any applications using the old key.
        </p>
      </div>
    </div>
  );
}

export function SettingsDialog({ isOpen, onClose, user }: SettingsDialogProps) {
  const [activeSection, setActiveSection] = React.useState('My account');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const setUser = useUser((state) => state.setUser);
  const router = useRouter();
  // Transform socialLinks array to object
  const socialLinksObject = user.socialLinks?.[0] ?? null;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio,
      apiKey: user.apiKey,
      location: user.location,
      socialLinks: socialLinksObject, // Use the transformed object
    },
  });

  // Add this to ensure form state updates are tracked
  const { isDirty } = form.formState;

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const formattedValue = {
        firstName: values.firstName ?? null,
        lastName: values.lastName ?? null,
        bio: values.bio ?? null,
        apiKey: values.apiKey ?? null,
        location: values.location ?? null,
        socialLinks: values.socialLinks
          ? {
              twitter: values.socialLinks.twitter ?? null,
              github: values.socialLinks.github ?? null,
              instagram: values.socialLinks.instagram ?? null,
              linkedin: values.socialLinks.linkedin ?? null,
              website: values.socialLinks.website ?? null,
              other: values.socialLinks.other ?? null,
            }
          : null,
      };

      const response = await updateUser(user.id, formattedValue);
      if (!response.success) {
        throw new Error(response.error);
      }

      setUser({
        ...user,
        ...formattedValue,
        createdAt: user.createdAt,
        updatedAt: new Date(),
      });

      toast.success('Settings saved successfully');
      form.reset(values); // Reset form state to remove dirty status
      router.refresh();
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'My account':
        return <ProfileSection form={form} />;
      case 'My social links':
        return <SocialLinksSection form={form} />;
      case 'My API key':
        return <ApiSection user={user} form={form} />; // Pass form prop here
      default:
        return null;
    }
  };

  return (
    <BaseDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Settings"
      description="Manage your account settings and preferences."
    >
      <Form {...form}>
        <form className="flex h-full flex-col">
          <SidebarProvider className="items-start">
            <Sidebar collapsible="none" className="hidden md:flex">
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>Account</SidebarGroupLabel>
                  <SidebarHeader>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <div className="flex flex-col gap-1 leading-none">
                          <span className="truncate font-semibold">
                            {user.firstName}
                          </span>
                          <span className="truncate text-xs">{user.email}</span>
                        </div>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarHeader>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {data.nav.map((item) => (
                        <SidebarMenuItem key={item.name}>
                          <SidebarMenuButton
                            asChild
                            isActive={item.name === activeSection}
                            onClick={() => setActiveSection(item.name)}
                          >
                            <button type="button">
                              <item.icon />
                              <span>{item.name}</span>
                            </button>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>
            <main className="flex h-[480px] flex-1 flex-col overflow-hidden">
              <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                <div className="flex items-center gap-2 px-4">
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink href="#">Settings</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator className="hidden md:block" />
                      <BreadcrumbItem>
                        <BreadcrumbPage>{activeSection}</BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
              </header>
              <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0">
                {renderSection()}
              </div>
              <div className="flex w-full items-end justify-end pl-4 pr-4 pt-4">
                <Button
                  type="button"
                  variant="default"
                  disabled={!isDirty || isSubmitting}
                  onClick={async () => {
                    const values = form.getValues();
                    await handleSubmit(values);
                  }}
                >
                  {isSubmitting ? 'Saving...' : 'Save changes'}
                </Button>
              </div>
            </main>
          </SidebarProvider>
        </form>
      </Form>
    </BaseDialog>
  );
}
