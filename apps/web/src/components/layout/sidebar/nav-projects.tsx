'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import {
  Folder,
  Forward,
  type LucideIcon,
  MoreHorizontal,
  Plus,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { createProject } from '@/lib/actions/create/create-project';

export function NavProjects({
  projects,
}: {
  projects:
    | {
        name: string;
        url: string;
        icon: LucideIcon;
      }[]
    | [];
}) {
  const { isMobile } = useSidebar();
  const params = useParams();
  const router = useRouter();

  const handleCreateProject = async () => {
    const spaceId = params.spaceId as string;
    if (!spaceId) {
      toast.error('Space ID is required');
      return;
    }

    try {
      const response = await createProject({
        spaceId: spaceId,
      });

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to create project');
      }

      toast.success('Project created successfully');
      router.refresh();
      router.push(`/dashboard/${spaceId}/projects/${response.data.projectId}`);
    } catch (error) {
      toast.error('Failed to create project');
    }
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarGroupAction title="Add project" onClick={handleCreateProject}>
        <Plus /> <span className="sr-only">Add Project</span>
      </SidebarGroupAction>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.url}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? 'bottom' : 'right'}
                align={isMobile ? 'end' : 'start'}
              >
                <DropdownMenuItem>
                  <Folder className="text-muted-foreground" />
                  <span>View Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Forward className="text-muted-foreground" />
                  <span>Share Project</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        {projects.length > 0 && (
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href={`/dashboard/${params.spaceId}/projects`}
                className="text-sidebar-foreground/70 hover:text-sidebar-foreground"
              >
                <MoreHorizontal />
                <span>See All</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
