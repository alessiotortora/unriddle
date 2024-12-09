'use client';

import Link from 'next/link';

import {
  CalendarFold,
  File,
  Files,
  LayoutDashboardIcon,
  LifeBuoy,
  Puzzle,
  Send,
  Settings,
  SettingsIcon,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Content, Project } from '@/db/schema';
import { useDialog } from '@/hooks/use-dialog';
import { useUser } from '@/hooks/use-user';

import { NavProjects } from './nav-projects';
import { NavSecondary } from './nav-secondary';
import { NavUser } from './nav-user';

const items = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboardIcon },
  { title: 'Projects', url: '/dashboard/projects', icon: Files },
  { title: 'Events', url: '/dashboard/events', icon: CalendarFold },
];

const navSecondary = [
  {
    title: 'Settings',
    url: '#',
    icon: SettingsIcon,
  },
];
const settingsItem = {
  title: 'Settings',
  icon: Settings,
};

interface AppSidebarProps {
  projects: (Project & { content: Content })[] | [];
}

export function AppSidebar({ projects }: AppSidebarProps) {
  const { onOpen } = useDialog();
  const { open } = useSidebar();
  const user = useUser((state) => state.user);

  const handleSettingsClick = () => {
    onOpen('settings', { user });
  };

  return (
    <Sidebar collapsible="icon" side="left" variant="sidebar">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Puzzle className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="truncate font-semibold">
                    {user?.firstName}
                  </span>
                  <span className="truncate text-xs">v1.0.0</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={{ children: item.title, hidden: open }}
                    asChild
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip={{ children: settingsItem.title, hidden: open }}
                  onClick={handleSettingsClick}
                >
                  <settingsItem.icon />
                  <span>{settingsItem.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem></SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <NavProjects
          projects={projects.map((project) => ({
            name: project.content.title?.trim() || 'New project',
            url: `/dashboard/${project.content.spaceId}/projects/${project.id}`,
            icon: File,
          }))}
        />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
